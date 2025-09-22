// Test the business logic separately from the API route
interface InteractionRule {
  reason: string;
  advice: string;
}

const INTERACTION_RULES: Record<string, InteractionRule> = {
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

interface InteractionResult {
  pair: [string, string];
  isPotentiallyRisky: boolean;
  reason: string;
  advice: string;
}

function checkInteraction(medA: string, medB: string): InteractionResult {
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

describe('Interaction Checker Logic', () => {
  describe('checkInteraction', () => {
    it('should return risky interaction for warfarin + ibuprofen', () => {
      const result = checkInteraction('warfarin', 'ibuprofen');
      
      expect(result.isPotentiallyRisky).toBe(true);
      expect(result.pair).toEqual(['warfarin', 'ibuprofen']);
      expect(result.reason).toBe('increased bleeding risk');
      expect(result.advice).toContain('avoid combo');
    });

    it('should return safe interaction for unknown combination', () => {
      const result = checkInteraction('aspirin', 'vitamin C');
      
      expect(result.isPotentiallyRisky).toBe(false);
      expect(result.pair).toEqual(['aspirin', 'vitamin C']);
      expect(result.reason).toBe('no known high-risk interaction in our database');
      expect(result.advice).toContain('consult your healthcare provider');
    });

    it('should return risky interaction for metformin + contrast dye', () => {
      const result = checkInteraction('metformin', 'contrast dye');
      
      expect(result.isPotentiallyRisky).toBe(true);
      expect(result.reason).toBe('lactic acidosis risk around imaging contrast');
      expect(result.advice).toContain('hold metformin');
    });

    it('should handle case insensitivity', () => {
      const result = checkInteraction('LISINOPRIL', 'spironolactone');
      
      expect(result.isPotentiallyRisky).toBe(true);
      expect(result.reason).toBe('hyperkalemia risk');
    });

    it('should detect same medication', () => {
      const result = checkInteraction('aspirin', '  aspirin  ');
      
      expect(result.isPotentiallyRisky).toBe(false);
      expect(result.reason).toBe('same medication');
      expect(result.advice).toContain('same medication');
    });

    it('should handle bidirectional interactions', () => {
      const result1 = checkInteraction('warfarin', 'ibuprofen');
      const result2 = checkInteraction('ibuprofen', 'warfarin');
      
      expect(result1.isPotentiallyRisky).toBe(true);
      expect(result2.isPotentiallyRisky).toBe(true);
      expect(result1.reason).toBe(result2.reason);
    });

    it('should trim whitespace from inputs', () => {
      const result = checkInteraction('  warfarin  ', '  ibuprofen  ');
      
      expect(result.pair).toEqual(['  warfarin  ', '  ibuprofen  ']);
      expect(result.isPotentiallyRisky).toBe(true);
    });

    it('should handle empty strings gracefully', () => {
      const result = checkInteraction('', 'ibuprofen');
      
      expect(result.isPotentiallyRisky).toBe(false);
      expect(result.reason).toBe('no known high-risk interaction in our database');
    });
  });
});
