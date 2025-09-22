import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Request validation schema
const InteractionRequestSchema = z.object({
  medA: z.string().min(1, 'Medication A is required').trim(),
  medB: z.string().min(1, 'Medication B is required').trim(),
});

// Response type
export interface InteractionResponse {
  pair: [string, string];
  isPotentiallyRisky: boolean;
  reason: string;
  advice: string;
}

// Mock ruleset for medication interactions
const INTERACTION_RULES: Record<string, {
  reason: string;
  advice: string;
}> = {
  'warfarin-ibuprofen': {
    reason: 'increased bleeding risk',
    advice: 'avoid combo; consult clinician; prefer acetaminophen for pain relief'
  },
  'ibuprofen-warfarin': {
    reason: 'increased bleeding risk',
    advice: 'avoid combo; consult clinician; prefer acetaminophen for pain relief'
  },
  'metformin-contrast dye': {
    reason: 'lactic acidosis risk around imaging contrast',
    advice: 'hold metformin per imaging protocol'
  },
  'contrast dye-metformin': {
    reason: 'lactic acidosis risk around imaging contrast',
    advice: 'hold metformin per imaging protocol'
  },
  'lisinopril-spironolactone': {
    reason: 'hyperkalemia risk',
    advice: 'monitor potassium, consult clinician'
  },
  'spironolactone-lisinopril': {
    reason: 'hyperkalemia risk',
    advice: 'monitor potassium, consult clinician'
  }
};

function checkInteraction(medA: string, medB: string): InteractionResponse {
  const normalizedA = medA.toLowerCase().trim();
  const normalizedB = medB.toLowerCase().trim();
  
  // Check if it's the same medication (after normalization)
  if (normalizedA === normalizedB) {
    return {
      pair: [medA, medB],
      isPotentiallyRisky: false,
      reason: 'same medication',
      advice: 'This appears to be the same medication. Please verify your medication names.'
    };
  }
  
  // Create interaction key (try both orders)
  const key1 = `${normalizedA}-${normalizedB}`;
  const key2 = `${normalizedB}-${normalizedA}`;
  
  const interaction = INTERACTION_RULES[key1] || INTERACTION_RULES[key2];
  
  if (interaction) {
    return {
      pair: [medA, medB],
      isPotentiallyRisky: true,
      reason: interaction.reason,
      advice: interaction.advice
    };
  }
  
  // No known interaction
  return {
    pair: [medA, medB],
    isPotentiallyRisky: false,
    reason: 'no known high-risk interaction in our database',
    advice: 'While no high-risk interaction is known, always consult your healthcare provider about all medications you are taking. This is for informational purposes only and is not medical advice.'
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validationResult = InteractionRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input',
          details: validationResult.error.errors.map(e => e.message)
        },
        { status: 400 }
      );
    }
    
    const { medA, medB } = validationResult.data;
    
    // Check interaction
    const result = checkInteraction(medA, medB);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error processing interaction check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
