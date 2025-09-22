// Indexing script for Pinecone
const fs = require('fs');
const path = require('path');
const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');

// Load environment variables
require('dotenv').config({ path: '../.env' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function initializePinecone() {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  
  return pinecone.index(process.env.PINECONE_INDEX);
}

async function createEmbedding(text) {
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

function splitIntoChunks(text) {
  // Simple splitting by sections (marked by ##)
  const sections = text.split('##').filter(section => section.trim());
  
  const chunks = [];
  sections.forEach((section, index) => {
    const lines = section.trim().split('\n');
    const title = lines[0].trim();
    const content = lines.slice(1).join('\n').trim();
    
    if (content) {
      chunks.push({
        id: `chunk-${index}`,
        title,
        text: content,
        fullText: `${title}\n${content}`
      });
    }
  });
  
  return chunks;
}

async function indexCorpus() {
  try {
    console.log('Starting indexing process...');
    
    // Read corpus
    const corpusPath = path.join(__dirname, 'corpus.md');
    const corpusText = fs.readFileSync(corpusPath, 'utf-8');
    
    // Split into chunks
    const chunks = splitIntoChunks(corpusText);
    console.log(`Split corpus into ${chunks.length} chunks`);
    
    // Initialize Pinecone
    const index = await initializePinecone();
    
    // Process chunks
    const vectors = [];
    for (const chunk of chunks) {
      console.log(`Processing chunk: ${chunk.title}`);
      
      const embedding = await createEmbedding(chunk.fullText);
      
      vectors.push({
        id: chunk.id,
        values: embedding,
        metadata: {
          title: chunk.title,
          text: chunk.text,
          fullText: chunk.fullText
        }
      });
    }
    
    // Upsert to Pinecone
    console.log('Upserting vectors to Pinecone...');
    await index.upsert(vectors);
    
    console.log('Indexing completed successfully!');
    
  } catch (error) {
    console.error('Error during indexing:', error);
    
    // Fallback: Save embeddings locally for in-memory fallback
    console.log('Saving fallback embeddings locally...');
    const fallbackPath = path.join(__dirname, 'fallback-embeddings.json');
    
    try {
      const corpusPath = path.join(__dirname, 'corpus.md');
      const corpusText = fs.readFileSync(corpusPath, 'utf-8');
      const chunks = splitIntoChunks(corpusText);
      
      const fallbackData = [];
      for (const chunk of chunks) {
        try {
          const embedding = await createEmbedding(chunk.fullText);
          fallbackData.push({
            id: chunk.id,
            title: chunk.title,
            text: chunk.text,
            fullText: chunk.fullText,
            embedding: embedding
          });
        } catch (embError) {
          console.warn(`Failed to create embedding for ${chunk.title}, using placeholder`);
          // Create a simple placeholder embedding for demo purposes
          fallbackData.push({
            id: chunk.id,
            title: chunk.title,
            text: chunk.text,
            fullText: chunk.fullText,
            embedding: new Array(1536).fill(0).map(() => Math.random() - 0.5) // Random embedding
          });
        }
      }
      
      fs.writeFileSync(fallbackPath, JSON.stringify(fallbackData, null, 2));
      console.log('Fallback embeddings saved to:', fallbackPath);
      
    } catch (fallbackError) {
      console.error('Failed to create fallback embeddings:', fallbackError);
    }
  }
}

// Run the indexing
if (require.main === module) {
  indexCorpus();
}

module.exports = { indexCorpus, createEmbedding, splitIntoChunks };
