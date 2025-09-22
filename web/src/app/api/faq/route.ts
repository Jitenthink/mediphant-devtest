import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

interface Match {
  text: string;
  score: number;
  title?: string;
}

interface FAQResponse {
  answer: string;
  matches: Match[];
}

// Fallback data structure
interface FallbackChunk {
  id: string;
  title: string;
  text: string;
  fullText: string;
  embedding: number[];
}

// Cosine similarity function
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function createEmbedding(text: string): Promise<number[]> {
  if (!openai) {
    throw new Error('OpenAI not configured');
  }
  
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error creating embedding:', error);
    throw error;
  }
}

async function searchPinecone(query: string): Promise<Match[]> {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    
    const index = pinecone.index(process.env.PINECONE_INDEX!);
    
    // Create embedding for the query
    const queryEmbedding = await createEmbedding(query);
    
    // Search Pinecone
    const searchResults = await index.query({
      vector: queryEmbedding,
      topK: 3,
      includeMetadata: true,
    });
    
    return searchResults.matches?.map(match => ({
      text: match.metadata?.text as string || '',
      score: match.score || 0,
      title: match.metadata?.title as string,
    })) || [];
    
  } catch (error) {
    console.error('Pinecone search error:', error);
    throw error;
  }
}

async function searchFallback(query: string): Promise<Match[]> {
  try {
    console.log('Searching fallback for query:', query);
    console.log('Current working directory:', process.cwd());
    // Load fallback embeddings
    const fallbackPath = path.join(process.cwd(), '..', 'retrieval', 'fallback-embeddings.json');
    console.log('Looking for fallback file at:', fallbackPath);
    
    if (!fs.existsSync(fallbackPath)) {
      console.error('Fallback embeddings not found at path:', fallbackPath);
      return [];
    }
    
    console.log('Fallback file found, loading data...');
    
    const fallbackData: FallbackChunk[] = JSON.parse(fs.readFileSync(fallbackPath, 'utf-8'));
    
    // Create embedding for query
    let queryEmbedding: number[];
    try {
      queryEmbedding = await createEmbedding(query);
    } catch {
      console.error('Failed to create query embedding, using simple text matching');
      // Enhanced text-based fallback - split query into keywords
      const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
      console.log('Query keywords:', queryWords);
      
      const matches = fallbackData
        .map(chunk => {
          const chunkText = (chunk.fullText + ' ' + chunk.title).toLowerCase();
          // Count matching keywords
          const matchingWords = queryWords.filter(word => chunkText.includes(word));
          const score = matchingWords.length / queryWords.length;
          
          return {
            chunk,
            score,
            matchingWords
          };
        })
        .filter(item => item.score > 0) // Only include chunks with at least one matching word
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, 3)
        .map(item => ({
          text: item.chunk.text,
          score: Math.max(0.5, item.score * 0.9), // Minimum score of 0.5, max of 0.9
          title: item.chunk.title,
        }));
      
      console.log('Text-based matches found:', matches.length);
      return matches;
    }
    
    // Calculate similarities
    const similarities = fallbackData.map(chunk => ({
      ...chunk,
      similarity: cosineSimilarity(queryEmbedding, chunk.embedding)
    }));
    
    // Sort by similarity and take top 3
    similarities.sort((a, b) => b.similarity - a.similarity);
    
    return similarities.slice(0, 3).map(chunk => ({
      text: chunk.text,
      score: chunk.similarity,
      title: chunk.title,
    }));
    
  } catch (error) {
    console.error('Fallback search error:', error);
    return [];
  }
}

async function generateAnswer(query: string, matches: Match[]): Promise<string> {
  if (matches.length === 0) {
    return "I don't have specific information about that topic. Please consult with a healthcare professional for medical advice.";
  }
  
  const context = matches.map(match => match.text).join('\n\n');
  
  if (!openai) {
    // Fallback response when OpenAI is not configured
    return `Based on the available information: ${matches[0].text}. Please consult a healthcare professional for personalized advice. (Note: AI response generation is not available without OpenAI configuration)`;
  }
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant providing information about medications and health. Always emphasize that your responses are for informational purposes only and not medical advice. Be concise and helpful."
        },
        {
          role: "user",
          content: `Based on the following context, answer the question: "${query}"\n\nContext:\n${context}\n\nProvide a concise, helpful answer while emphasizing this is informational only.`
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });
    
    return response.choices[0]?.message?.content || "Unable to generate a response.";
    
  } catch (error) {
    console.error('Error generating answer:', error);
    // Fallback to a simple response
    return `Based on the available information: ${matches[0].text}. Please consult a healthcare professional for personalized advice.`;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }
    
    let matches: Match[] = [];
    
    // Try Pinecone first, fallback to local search
    try {
      matches = await searchPinecone(query);
    } catch {
      console.log('Pinecone failed, using fallback search');
      matches = await searchFallback(query);
    }
    
    // Generate answer
    const answer = await generateAnswer(query, matches);
    
    const response: FAQResponse = {
      answer,
      matches: matches.map(match => ({
        text: match.text,
        score: Math.round(match.score * 100) / 100, // Round to 2 decimal places
        title: match.title,
      })),
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error processing FAQ request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
