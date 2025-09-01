"""
Enhanced Vector Database Service with improved similarity search.
Stores and retrieves mathematical problems using semantic embeddings.
"""

import numpy as np
import json
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import asyncio

class VectorDBService:
    def __init__(self):
        self.problems = []
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2),
            lowercase=True
        )
        self.problem_vectors = None
        self.is_fitted = False
        
        # Initialize with enhanced sample data
        asyncio.create_task(self._initialize_knowledge_base())
    
    async def _initialize_knowledge_base(self):
        """Initialize the knowledge base with comprehensive mathematical problems."""
        
        sample_problems = [
            # Algebra Problems
            {
                "problem": "solve quadratic equation x² + 5x + 6 = 0",
                "solution": {
                    "steps": [
                        {
                            "step": 1,
                            "title": "Identify the quadratic equation",
                            "content": "x² + 5x + 6 = 0",
                            "explanation": "This is a quadratic equation in standard form ax² + bx + c = 0"
                        },
                        {
                            "step": 2,
                            "title": "Factor the quadratic expression",
                            "content": "x² + 5x + 6 = (x + 2)(x + 3)",
                            "explanation": "Find two numbers that multiply to 6 and add to 5: 2 and 3"
                        },
                        {
                            "step": 3,
                            "title": "Set each factor equal to zero",
                            "content": "x + 2 = 0  or  x + 3 = 0",
                            "explanation": "Use the zero product property: if ab = 0, then a = 0 or b = 0"
                        },
                        {
                            "step": 4,
                            "title": "Solve for x",
                            "content": "x = -2  or  x = -3",
                            "explanation": "These are the roots of the quadratic equation"
                        }
                    ],
                    "final_answer": "x = -2 or x = -3"
                },
                "category": "algebra",
                "difficulty": "intermediate",
                "keywords": ["quadratic", "equation", "factoring", "roots"]
            },
            
            # Calculus Problems
            {
                "problem": "find derivative of f(x) = 3x³ + 2x² - 5x + 1",
                "solution": {
                    "steps": [
                        {
                            "step": 1,
                            "title": "Apply the power rule to each term",
                            "content": "f(x) = 3x³ + 2x² - 5x + 1",
                            "explanation": "Use the power rule: d/dx[xⁿ] = n·xⁿ⁻¹"
                        },
                        {
                            "step": 2,
                            "title": "Differentiate each term",
                            "content": "d/dx[3x³] = 9x²\nd/dx[2x²] = 4x\nd/dx[-5x] = -5\nd/dx[1] = 0",
                            "explanation": "Apply the power rule and constant rule to each term"
                        },
                        {
                            "step": 3,
                            "title": "Combine the results",
                            "content": "f'(x) = 9x² + 4x - 5",
                            "explanation": "Sum all the derivatives to get the final answer"
                        }
                    ],
                    "final_answer": "f'(x) = 9x² + 4x - 5"
                },
                "category": "calculus",
                "difficulty": "intermediate",
                "keywords": ["derivative", "power rule", "polynomial"]
            },
            
            # Geometry Problems  
            {
                "problem": "calculate area of triangle with sides 3, 4, 5",
                "solution": {
                    "steps": [
                        {
                            "step": 1,
                            "title": "Check if it's a right triangle",
                            "content": "3² + 4² = 9 + 16 = 25 = 5²",
                            "explanation": "Verify using Pythagorean theorem: a² + b² = c²"
                        },
                        {
                            "step": 2,
                            "title": "Apply the area formula",
                            "content": "Area = ½ × base × height = ½ × 3 × 4 = 6",
                            "explanation": "For a right triangle, use the two perpendicular sides"
                        }
                    ],
                    "final_answer": "Area = 6 square units"
                },
                "category": "geometry",
                "difficulty": "basic",
                "keywords": ["triangle", "area", "pythagorean", "right triangle"]
            },
            
            # Linear Algebra
            {
                "problem": "solve system of equations 2x + y = 7, x - y = 2",
                "solution": {
                    "steps": [
                        {
                            "step": 1,
                            "title": "Set up the system",
                            "content": "2x + y = 7  ... (1)\nx - y = 2   ... (2)",
                            "explanation": "We have a system of two linear equations with two unknowns"
                        },
                        {
                            "step": 2,
                            "title": "Add the equations",
                            "content": "(2x + y) + (x - y) = 7 + 2\n3x = 9",
                            "explanation": "Adding eliminates y, leaving us with one equation in x"
                        },
                        {
                            "step": 3,
                            "title": "Solve for x",
                            "content": "x = 3",
                            "explanation": "Divide both sides by 3"
                        },
                        {
                            "step": 4,
                            "title": "Substitute to find y",
                            "content": "3 - y = 2\ny = 1",
                            "explanation": "Substitute x = 3 into equation (2)"
                        }
                    ],
                    "final_answer": "x = 3, y = 1"
                },
                "category": "algebra",
                "difficulty": "intermediate", 
                "keywords": ["system", "equations", "linear", "elimination"]
            },
            
            # Trigonometry
            {
                "problem": "find sin(π/4) and cos(π/4)",
                "solution": {
                    "steps": [
                        {
                            "step": 1,
                            "title": "Convert to degrees",
                            "content": "π/4 radians = 45°",
                            "explanation": "π radians = 180°, so π/4 = 45°"
                        },
                        {
                            "step": 2,
                            "title": "Use special triangle",
                            "content": "45-45-90 triangle has sides in ratio 1:1:√2",
                            "explanation": "This is a well-known special right triangle"
                        },
                        {
                            "step": 3,
                            "title": "Calculate trigonometric ratios",
                            "content": "sin(45°) = opposite/hypotenuse = 1/√2 = √2/2\ncos(45°) = adjacent/hypotenuse = 1/√2 = √2/2",
                            "explanation": "Both sine and cosine are equal for 45°"
                        }
                    ],
                    "final_answer": "sin(π/4) = √2/2, cos(π/4) = √2/2"
                },
                "category": "trigonometry",
                "difficulty": "basic",
                "keywords": ["trigonometry", "sine", "cosine", "special angles"]
            },
            
            # Integration Problems
            {
                "problem": "integrate ∫ 2x dx",
                "solution": {
                    "steps": [
                        {
                            "step": 1,
                            "title": "Apply power rule for integration",
                            "content": "∫ 2x dx = ∫ 2x¹ dx",
                            "explanation": "Rewrite x as x¹ to apply the power rule"
                        },
                        {
                            "step": 2,
                            "title": "Use the power rule: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C",
                            "content": "∫ 2x¹ dx = 2 · x¹⁺¹/(1+1) + C = 2 · x²/2 + C",
                            "explanation": "Add 1 to the exponent and divide by the new exponent"
                        },
                        {
                            "step": 3,
                            "title": "Simplify",
                            "content": "= x² + C",
                            "explanation": "The constant 2 cancels with the denominator 2"
                        }
                    ],
                    "final_answer": "∫ 2x dx = x² + C"
                },
                "category": "calculus",
                "difficulty": "basic",
                "keywords": ["integration", "power rule", "antiderivative"]
            },
            
            # More Complex Integration
            {
                "problem": "evaluate ∫ x² cos(x) dx using integration by parts",
                "solution": {
                    "steps": [
                        {
                            "step": 1,
                            "title": "Choose u and dv for integration by parts",
                            "content": "Let u = x², dv = cos(x) dx\nThen du = 2x dx, v = sin(x)",
                            "explanation": "Use LIATE rule: choose u as the polynomial term"
                        },
                        {
                            "step": 2,
                            "title": "Apply integration by parts formula",
                            "content": "∫ u dv = uv - ∫ v du\n= x² sin(x) - ∫ sin(x) · 2x dx",
                            "explanation": "First application of integration by parts"
                        },
                        {
                            "step": 3,
                            "title": "Apply integration by parts again to ∫ 2x sin(x) dx",
                            "content": "Let u₁ = 2x, dv₁ = sin(x) dx\nThen du₁ = 2 dx, v₁ = -cos(x)\n∫ 2x sin(x) dx = -2x cos(x) + 2∫ cos(x) dx",
                            "explanation": "Second application of integration by parts"
                        },
                        {
                            "step": 4,
                            "title": "Complete the integration",
                            "content": "= -2x cos(x) + 2 sin(x) + C",
                            "explanation": "∫ cos(x) dx = sin(x)"
                        },
                        {
                            "step": 5,
                            "title": "Combine all terms",
                            "content": "∫ x² cos(x) dx = x² sin(x) - (-2x cos(x) + 2 sin(x)) + C\n= x² sin(x) + 2x cos(x) - 2 sin(x) + C",
                            "explanation": "Final answer after combining all terms"
                        }
                    ],
                    "final_answer": "∫ x² cos(x) dx = x² sin(x) + 2x cos(x) - 2 sin(x) + C"
                },
                "category": "calculus",
                "difficulty": "hard",
                "keywords": ["integration by parts", "polynomial", "trigonometric"]
            },
            
            # Statistics
            {
                "problem": "find mean and standard deviation of data set: 2, 4, 6, 8, 10",
                "solution": {
                    "steps": [
                        {
                            "step": 1,
                            "title": "Calculate the mean",
                            "content": "Mean = (2 + 4 + 6 + 8 + 10) / 5 = 30 / 5 = 6",
                            "explanation": "Sum all values and divide by the number of values"
                        },
                        {
                            "step": 2,
                            "title": "Calculate squared deviations from mean",
                            "content": "(2-6)² = 16\n(4-6)² = 4\n(6-6)² = 0\n(8-6)² = 4\n(10-6)² = 16",
                            "explanation": "Find (xᵢ - μ)² for each data point"
                        },
                        {
                            "step": 3,
                            "title": "Calculate variance",
                            "content": "Variance = (16 + 4 + 0 + 4 + 16) / 5 = 40 / 5 = 8",
                            "explanation": "Sum of squared deviations divided by n"
                        },
                        {
                            "step": 4,
                            "title": "Calculate standard deviation",
                            "content": "Standard deviation = √8 = 2√2 ≈ 2.83",
                            "explanation": "Square root of variance"
                        }
                    ],
                    "final_answer": "Mean = 6, Standard deviation = 2√2 ≈ 2.83"
                },
                "category": "statistics",
                "difficulty": "intermediate",
                "keywords": ["mean", "standard deviation", "variance", "descriptive statistics"]
            },
            
            # JEE Mathematics - Complex Numbers
            {
                "problem": "if z = 1 + i, find z⁴",
                "solution": {
                    "steps": [
                        {
                            "step": 1,
                            "title": "Convert to polar form",
                            "content": "z = 1 + i\n|z| = √(1² + 1²) = √2\narg(z) = arctan(1/1) = π/4",
                            "explanation": "Find modulus and argument of complex number"
                        },
                        {
                            "step": 2,
                            "title": "Express in polar form",
                            "content": "z = √2 · e^(iπ/4) = √2(cos(π/4) + i sin(π/4))",
                            "explanation": "Using Euler's formula"
                        },
                        {
                            "step": 3,
                            "title": "Apply De Moivre's theorem",
                            "content": "z⁴ = (√2)⁴ · e^(i·4·π/4) = 4 · e^(iπ) = 4 · (cos(π) + i sin(π))",
                            "explanation": "For z^n, multiply modulus by n and argument by n"
                        },
                        {
                            "step": 4,
                            "title": "Simplify",
                            "content": "z⁴ = 4 · (-1 + 0i) = -4",
                            "explanation": "cos(π) = -1, sin(π) = 0"
                        }
                    ],
                    "final_answer": "z⁴ = -4"
                },
                "category": "algebra",
                "difficulty": "hard",
                "keywords": ["complex numbers", "De Moivre theorem", "JEE", "polar form"]
            },
            
            # JEE Coordinate Geometry
            {
                "problem": "find equation of circle passing through (1,2), (3,4), and (5,6)",
                "solution": {
                    "steps": [
                        {
                            "step": 1,
                            "title": "General equation of circle",
                            "content": "x² + y² + 2gx + 2fy + c = 0",
                            "explanation": "General form where center is (-g, -f) and radius is √(g² + f² - c)"
                        },
                        {
                            "step": 2,
                            "title": "Substitute point (1,2)",
                            "content": "1 + 4 + 2g + 4f + c = 0\n2g + 4f + c = -5 ... (1)",
                            "explanation": "First equation from substituting (1,2)"
                        },
                        {
                            "step": 3,
                            "title": "Substitute point (3,4)",
                            "content": "9 + 16 + 6g + 8f + c = 0\n6g + 8f + c = -25 ... (2)",
                            "explanation": "Second equation from substituting (3,4)"
                        },
                        {
                            "step": 4,
                            "title": "Substitute point (5,6)",
                            "content": "25 + 36 + 10g + 12f + c = 0\n10g + 12f + c = -61 ... (3)",
                            "explanation": "Third equation from substituting (5,6)"
                        },
                        {
                            "step": 5,
                            "title": "Solve system of equations",
                            "content": "From (2)-(1): 4g + 4f = -20, so g + f = -5\nFrom (3)-(2): 4g + 4f = -36, so g + f = -9",
                            "explanation": "This system is inconsistent - the three points are collinear!"
                        },
                        {
                            "step": 6,
                            "title": "Verify collinearity",
                            "content": "Slope between (1,2) and (3,4): (4-2)/(3-1) = 1\nSlope between (3,4) and (5,6): (6-4)/(5-3) = 1",
                            "explanation": "Equal slopes confirm the points are collinear"
                        }
                    ],
                    "final_answer": "No circle exists - the three points are collinear"
                },
                "category": "geometry",
                "difficulty": "hard",
                "keywords": ["circle equation", "coordinate geometry", "JEE", "collinear points"]
            }
        ]
        
        # Add problems to the database
        for problem_data in sample_problems:
            await self.add_problem(
                problem_data["problem"],
                problem_data["solution"],
                problem_data["category"]
            )
    
    async def add_problem(self, problem: str, solution: Any, category: str):
        """Add a new problem to the vector database."""
        problem_entry = {
            "problem": problem.lower(),
            "solution": solution,
            "category": category,
            "keywords": self._extract_keywords(problem)
        }
        
        self.problems.append(problem_entry)
        
        # Refit the vectorizer with new data
        await self._refit_vectorizer()
    
    async def _refit_vectorizer(self):
        """Refit the TF-IDF vectorizer with current problems."""
        if not self.problems:
            return
            
        problem_texts = [p["problem"] for p in self.problems]
        
        try:
            self.problem_vectors = self.vectorizer.fit_transform(problem_texts)
            self.is_fitted = True
        except Exception as e:
            print(f"Error fitting vectorizer: {e}")
            self.is_fitted = False
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract mathematical keywords from text."""
        math_terms = [
            'solve', 'find', 'calculate', 'compute', 'determine',
            'equation', 'derivative', 'integral', 'limit',
            'triangle', 'circle', 'area', 'volume', 'angle',
            'matrix', 'vector', 'system', 'polynomial'
        ]
        
        text_lower = text.lower()
        return [term for term in math_terms if term in text_lower]
    
    async def search_similar_problems(
        self, 
        query: str, 
        limit: int = 5, 
        min_similarity: float = 0.1
    ) -> List[Dict[str, Any]]:
        """
        Search for similar problems using TF-IDF and cosine similarity.
        """
        if not self.is_fitted or not self.problems:
            return []
        
        try:
            # Transform query to vector
            query_vector = self.vectorizer.transform([query.lower()])
            
            # Calculate similarities
            similarities = cosine_similarity(query_vector, self.problem_vectors)[0]
            
            # Create results with similarity scores
            results = []
            for i, similarity in enumerate(similarities):
                if similarity >= min_similarity:
                    problem = self.problems[i]
                    results.append({
                        "problem": problem["problem"],
                        "solution": problem["solution"],
                        "category": problem["category"],
                        "similarity": float(similarity),
                        "source": "knowledge_base",
                        "keywords": problem["keywords"]
                    })
            
            # Sort by similarity and return top results
            results.sort(key=lambda x: x["similarity"], reverse=True)
            return results[:limit]
            
        except Exception as e:
            print(f"Error in similarity search: {e}")
            return []
    
    async def get_problems_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get all problems in a specific category."""
        return [
            {
                "problem": p["problem"],
                "solution": p["solution"],
                "category": p["category"],
                "keywords": p["keywords"]
            }
            for p in self.problems 
            if p["category"].lower() == category.lower()
        ]
    
    async def get_database_stats(self) -> Dict[str, int]:
        """Get statistics about the vector database."""
        if not self.problems:
            return {"total": 0}
        
        stats = {"total": len(self.problems)}
        
        # Count by category
        categories = {}
        for problem in self.problems:
            cat = problem["category"]
            categories[cat] = categories.get(cat, 0) + 1
        
        stats.update(categories)
        return stats