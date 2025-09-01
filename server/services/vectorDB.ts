export interface VectorSearchResult {
  problem: string;
  solution: any;
  similarity: number;
  category: string;
  source: string;
}

export interface VectorDBService {
  searchSimilarProblems(query: string, limit?: number): Promise<VectorSearchResult[]>;
  addProblem(problem: string, solution: any, category: string): Promise<void>;
}

export class MockVectorDB implements VectorDBService {
  private problems: Array<{
    problem: string;
    solution: any;
    category: string;
    embedding: number[]; // Mock embedding
  }> = [];

  constructor() {
    // Initialize with sample problems and mock embeddings
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleData = [
      {
        problem: "solve quadratic equation x² + 5x + 6 = 0",
        solution: {
          steps: [
            {
              step: 1,
              title: "Factor the quadratic expression",
              content: "x² + 5x + 6 = (x + 2)(x + 3)",
              explanation: "Find two numbers that multiply to 6 and add to 5: 2 and 3"
            },
            {
              step: 2,
              title: "Set each factor equal to zero",
              content: "x + 2 = 0  or  x + 3 = 0",
              explanation: "Use the zero product property"
            },
            {
              step: 3,
              title: "Solve for x",
              content: "x = -2  or  x = -3",
              explanation: "These are the roots of the quadratic equation"
            }
          ],
          finalAnswer: "x = -2 or x = -3"
        },
        category: "algebra",
        embedding: this.generateMockEmbedding("quadratic equation solve")
      },
      {
        problem: "find derivative of f(x) = 3x³ + 2x² - 5x + 1",
        solution: {
          steps: [
            {
              step: 1,
              title: "Identify the function and apply the power rule",
              content: "f(x) = 3x³ + 2x² - 5x + 1",
              explanation: "We'll differentiate each term separately using the power rule: d/dx[xⁿ] = n·xⁿ⁻¹"
            },
            {
              step: 2,
              title: "Differentiate each term",
              content: "d/dx[3x³] = 9x²\nd/dx[2x²] = 4x\nd/dx[-5x] = -5\nd/dx[1] = 0",
              explanation: "Apply the power rule to each term"
            },
            {
              step: 3,
              title: "Combine the results",
              content: "f'(x) = 9x² + 4x - 5",
              explanation: "Sum all the derivatives"
            }
          ],
          finalAnswer: "f'(x) = 9x² + 4x - 5"
        },
        category: "calculus",
        embedding: this.generateMockEmbedding("derivative calculus power rule")
      },
      {
        problem: "calculate area of triangle with sides 3, 4, 5",
        solution: {
          steps: [
            {
              step: 1,
              title: "Identify triangle type",
              content: "3² + 4² = 9 + 16 = 25 = 5²",
              explanation: "This is a right triangle (Pythagorean theorem satisfied)"
            },
            {
              step: 2,
              title: "Apply area formula",
              content: "Area = ½ × base × height = ½ × 3 × 4 = 6",
              explanation: "For a right triangle, use the two perpendicular sides as base and height"
            }
          ],
          finalAnswer: "Area = 6 square units"
        },
        category: "geometry",
        embedding: this.generateMockEmbedding("triangle area geometry")
      }
    ];

    sampleData.forEach(data => {
      this.problems.push(data);
    });
  }

  private generateMockEmbedding(text: string): number[] {
    // Generate a simple mock embedding based on text
    const words = text.toLowerCase().split(' ');
    const embedding = new Array(384).fill(0); // Standard embedding size
    
    words.forEach((word, index) => {
      const hash = this.simpleHash(word);
      for (let i = 0; i < 384; i++) {
        embedding[i] += Math.sin(hash + i + index) * 0.1;
      }
    });
    
    return embedding;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    // Simple cosine similarity calculation
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  async searchSimilarProblems(query: string, limit: number = 5): Promise<VectorSearchResult[]> {
    const queryEmbedding = this.generateMockEmbedding(query);
    
    const results = this.problems.map(problem => ({
      problem: problem.problem,
      solution: problem.solution,
      similarity: this.calculateSimilarity(queryEmbedding, problem.embedding),
      category: problem.category,
      source: "knowledge_base"
    }));

    // Sort by similarity and return top results
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  async addProblem(problem: string, solution: any, category: string): Promise<void> {
    this.problems.push({
      problem: problem.toLowerCase(),
      solution,
      category,
      embedding: this.generateMockEmbedding(problem)
    });
  }
}

export const vectorDB = new MockVectorDB();
