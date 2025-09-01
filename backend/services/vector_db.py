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