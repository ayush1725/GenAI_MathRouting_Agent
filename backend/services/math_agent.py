"""
Enhanced Math Routing Agent with Agentic-RAG architecture.
Includes intelligent routing between knowledge base and web search with MCP.
"""

import asyncio
import time
from typing import Dict, Any, Optional
from datetime import datetime

class MathRoutingAgent:
    def __init__(self, storage, guardrails, vector_db, web_search, feedback_system):
        self.storage = storage
        self.guardrails = guardrails
        self.vector_db = vector_db
        self.web_search = web_search
        self.feedback_system = feedback_system
        self.similarity_threshold = 0.7
        
    async def solve_problem(
        self, 
        problem: str, 
        show_steps: bool = True, 
        include_explanations: bool = True
    ) -> Dict[str, Any]:
        """
        Main problem-solving pipeline with intelligent routing.
        """
        start_time = time.time()
        
        # Step 1: Apply AI Guardrails
        validation = await self.guardrails.validate_mathematical_content(problem)
        if not validation["is_valid"]:
            raise ValueError(validation.get("reason", "Invalid mathematical content"))
        
        # Log activity
        await self.storage.create_activity(
            action="Problem submitted",
            source="user_input",
            details=problem[:100]
        )
        
        try:
            # Step 2: Search knowledge base first (Vector DB)
            similar_problems = await self.vector_db.search_similar_problems(problem, limit=3)
            
            if similar_problems and similar_problems[0]["similarity"] > self.similarity_threshold:
                # Found similar problem in knowledge base
                best_match = similar_problems[0]
                
                # Store solution
                problem_record = await self.storage.create_math_problem(
                    problem=problem,
                    solution=best_match["solution"],
                    category=best_match["category"],
                    difficulty="intermediate",
                    source="knowledge_base"
                )
                
                await self.storage.create_activity(
                    action="Solution found",
                    source="knowledge_base",
                    details=f"Similarity: {best_match['similarity']:.2f}"
                )
                
                return {
                    "problem": problem,
                    "solution": best_match["solution"],
                    "source": "knowledge_base",
                    "response_time": (time.time() - start_time) * 1000,
                    "category": best_match["category"],
                    "problem_id": problem_record["id"],
                    "confidence_score": best_match["similarity"]
                }
            
            # Step 3: Fallback to web search with MCP
            search_results = await self.web_search.search_mathematical_content(problem)
            web_solution = await self.web_search.generate_solution_from_search(problem, search_results)
            
            # Store web-based solution
            problem_record = await self.storage.create_math_problem(
                problem=problem,
                solution=web_solution,
                category="advanced",
                difficulty="advanced", 
                source="web_search"
            )
            
            await self.storage.create_activity(
                action="Solution found",
                source="web_search",
                details=f"Sources: {len(search_results)} found"
            )
            
            return {
                "problem": problem,
                "solution": web_solution,
                "source": "web_search",
                "response_time": (time.time() - start_time) * 1000,
                "category": "advanced",
                "problem_id": problem_record["id"],
                "confidence_score": 0.8 if search_results else 0.3
            }
            
        except Exception as error:
            await self.storage.create_activity(
                action="Solution failed",
                source="error",
                details=str(error)
            )
            raise Exception("Failed to solve the mathematical problem. Please try again or rephrase your question.")
    
    async def submit_feedback(
        self,
        problem_id: str,
        accuracy_rating: int,
        clarity_rating: str,
        comments: Optional[str] = None,
        is_helpful: bool = True
    ):
        """
        Enhanced feedback system with DSPy integration.
        """
        # Store feedback
        await self.storage.create_feedback(
            problem_id=problem_id,
            accuracy_rating=accuracy_rating,
            clarity_rating=clarity_rating,
            comments=comments,
            is_helpful=is_helpful
        )
        
        # Process feedback with DSPy for learning
        await self.feedback_system.process_feedback(
            problem_id=problem_id,
            accuracy_rating=accuracy_rating,
            clarity_rating=clarity_rating,
            comments=comments
        )
        
        await self.storage.create_activity(
            action="Feedback received",
            source="user_feedback",
            details=f"Rating: {accuracy_rating}/5, Clarity: {clarity_rating}"
        )