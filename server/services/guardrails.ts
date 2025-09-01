export interface GuardRailsService {
  validateMathematicalContent(input: string): Promise<{ isValid: boolean; reason?: string }>;
}

export class AIGuardRails implements GuardRailsService {
  private mathKeywords = [
    'equation', 'derivative', 'integral', 'function', 'solve', 'calculate', 'find',
    'algebra', 'calculus', 'geometry', 'trigonometry', 'statistics', 'probability',
    'matrix', 'vector', 'polynomial', 'logarithm', 'exponential', 'limit',
    'theorem', 'proof', 'formula', 'graph', 'plot', 'coordinate', 'angle',
    'triangle', 'circle', 'square', 'rectangle', 'area', 'volume', 'perimeter'
  ];

  private nonMathKeywords = [
    'politics', 'religion', 'personal', 'medical', 'legal', 'financial advice',
    'inappropriate', 'offensive', 'violent', 'sexual', 'drugs', 'weapons'
  ];

  async validateMathematicalContent(input: string): Promise<{ isValid: boolean; reason?: string }> {
    const lowercaseInput = input.toLowerCase();
    
    // Check for non-mathematical content
    const hasNonMathContent = this.nonMathKeywords.some(keyword => 
      lowercaseInput.includes(keyword)
    );
    
    if (hasNonMathContent) {
      return {
        isValid: false,
        reason: "Content appears to be non-educational or inappropriate. Please enter a mathematical problem."
      };
    }

    // Check for mathematical content
    const hasMathContent = this.mathKeywords.some(keyword => 
      lowercaseInput.includes(keyword)
    );

    // Also check for mathematical symbols
    const mathSymbols = /[+\-*/=<>∫∑∏√∞π∂∇±×÷≤≥≠≈∈∅∪∩]/;
    const hasSymbols = mathSymbols.test(input);

    // Check for numbers or variables
    const hasNumbers = /\d/.test(input);
    const hasVariables = /\b[a-z]\b/i.test(input);

    if (hasMathContent || hasSymbols || (hasNumbers && hasVariables)) {
      return { isValid: true };
    }

    return {
      isValid: false,
      reason: "This doesn't appear to be a mathematical problem. Please enter a question related to mathematics, such as equations, calculus, geometry, or algebra."
    };
  }
}

export const guardRails = new AIGuardRails();
