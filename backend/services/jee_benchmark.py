"""
JEE Bench Evaluation System for Math Routing Agent.
Benchmarks the system against JEE (Joint Entrance Examination) mathematical problems.
"""

import asyncio
import json
import time
from typing import Dict, Any, List
from datetime import datetime

class JEEBenchmarkRunner:
    def __init__(self, math_agent):
        self.math_agent = math_agent
        
        # Sample JEE problems for benchmarking
        self.jee_problems = [
            {
                "id": "jee_algebra_1",
                "problem": "If the roots of the equation x² - 2ax + a² - b² = 0 are real and distinct, then prove that |a| < |b|",
                "category": "algebra",
                "difficulty": "hard",
                "expected_approach": "discriminant_analysis",
                "topic": "quadratic_equations"
            },
            {
                "id": "jee_calculus_1", 
                "problem": "Find the maximum value of sin⁴x + cos⁴x",
                "category": "calculus",
                "difficulty": "hard",
                "expected_approach": "optimization_trigonometry",
                "topic": "maxima_minima"
            },
            {
                "id": "jee_geometry_1",
                "problem": "Find the equation of the circle which passes through the points (0,0), (a,0) and (0,b)",
                "category": "geometry",
                "difficulty": "medium",
                "expected_approach": "circle_equation",
                "topic": "coordinate_geometry"
            },
            {
                "id": "jee_integration_1",
                "problem": "Evaluate ∫(x²)/(√(1-x²)) dx",
                "category": "calculus",
                "difficulty": "hard", 
                "expected_approach": "substitution_trigonometric",
                "topic": "definite_integration"
            },
            {
                "id": "jee_complex_1",
                "problem": "If z = x + iy and |z - 1| = |z + 1|, find the locus of z",
                "category": "algebra",
                "difficulty": "medium",
                "expected_approach": "complex_number_locus",
                "topic": "complex_numbers"
            }
        ]
    
    async def run_benchmark(self) -> Dict[str, Any]:
        """
        Run comprehensive JEE benchmark evaluation.
        """
        print("Starting JEE Benchmark Evaluation...")
        start_time = time.time()
        
        results = {
            "benchmark_info": {
                "total_problems": len(self.jee_problems),
                "started_at": datetime.now().isoformat(),
                "system_version": "1.0.0"
            },
            "individual_results": [],
            "aggregate_metrics": {},
            "performance_analysis": {}
        }
        
        # Process each problem
        for i, problem in enumerate(self.jee_problems):
            print(f"Processing problem {i+1}/{len(self.jee_problems)}: {problem['id']}")
            
            problem_result = await self._evaluate_single_problem(problem)
            results["individual_results"].append(problem_result)
            
            # Add small delay to avoid overwhelming the system
            await asyncio.sleep(0.5)
        
        # Calculate aggregate metrics
        results["aggregate_metrics"] = self._calculate_aggregate_metrics(results["individual_results"])
        
        # Performance analysis
        results["performance_analysis"] = self._analyze_performance(results["individual_results"])
        
        # Completion info
        total_time = time.time() - start_time
        results["benchmark_info"]["completed_at"] = datetime.now().isoformat()
        results["benchmark_info"]["total_duration_seconds"] = total_time
        
        print(f"JEE Benchmark completed in {total_time:.2f} seconds")
        return results
    
    async def _evaluate_single_problem(self, problem: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluate a single JEE problem.
        """
        problem_start = time.time()
        
        try:
            # Attempt to solve the problem
            solution = await self.math_agent.solve_problem(
                problem=problem["problem"],
                show_steps=True,
                include_explanations=True
            )
            
            response_time = time.time() - problem_start
            
            # Evaluate the solution quality
            evaluation = self._evaluate_solution_quality(problem, solution)
            
            return {
                "problem_id": problem["id"],
                "problem_text": problem["problem"],
                "category": problem["category"],
                "difficulty": problem["difficulty"],
                "topic": problem["topic"],
                "solved_successfully": True,
                "response_time_seconds": response_time,
                "source_used": solution["source"],
                "confidence_score": solution.get("confidence_score", 0.5),
                "solution_evaluation": evaluation,
                "steps_count": len(solution["solution"].get("steps", [])),
                "has_final_answer": bool(solution["solution"].get("final_answer")),
                "error": None
            }
            
        except Exception as e:
            response_time = time.time() - problem_start
            
            return {
                "problem_id": problem["id"],
                "problem_text": problem["problem"],
                "category": problem["category"], 
                "difficulty": problem["difficulty"],
                "topic": problem["topic"],
                "solved_successfully": False,
                "response_time_seconds": response_time,
                "source_used": None,
                "confidence_score": 0.0,
                "solution_evaluation": {"score": 0, "issues": ["Failed to solve"]},
                "steps_count": 0,
                "has_final_answer": False,
                "error": str(e)
            }
    
    def _evaluate_solution_quality(self, problem: Dict[str, Any], solution: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluate the quality of a solution for a JEE problem.
        """
        evaluation = {
            "score": 0,  # Out of 100
            "strengths": [],
            "issues": [],
            "mathematical_rigor": 0,  # Out of 10
            "explanation_clarity": 0,  # Out of 10
            "completeness": 0  # Out of 10
        }
        
        solution_data = solution.get("solution", {})
        steps = solution_data.get("steps", [])
        final_answer = solution_data.get("final_answer", "")
        
        # Check for basic completeness
        if steps:
            evaluation["completeness"] += 5
            evaluation["strengths"].append("Solution has step-by-step breakdown")
        else:
            evaluation["issues"].append("No step-by-step solution provided")
        
        if final_answer:
            evaluation["completeness"] += 5
            evaluation["strengths"].append("Final answer provided")
        else:
            evaluation["issues"].append("No final answer provided")
        
        # Evaluate step quality
        if len(steps) >= 2:
            evaluation["mathematical_rigor"] += 4
            evaluation["strengths"].append("Multi-step solution approach")
        
        # Check for mathematical terminology
        solution_text = json.dumps(solution_data).lower()
        math_terms = ["theorem", "formula", "equation", "derivative", "integral", "proof"]
        term_count = sum(1 for term in math_terms if term in solution_text)
        
        if term_count >= 2:
            evaluation["mathematical_rigor"] += 3
            evaluation["strengths"].append("Uses appropriate mathematical terminology")
        
        # Evaluate explanation clarity
        for step in steps:
            if step.get("explanation"):
                evaluation["explanation_clarity"] += 2
        
        evaluation["explanation_clarity"] = min(evaluation["explanation_clarity"], 10)
        
        # Check for JEE-specific approach
        expected_approach = problem.get("expected_approach", "")
        if expected_approach:
            approach_keywords = {
                "discriminant_analysis": ["discriminant", "real", "distinct"],
                "optimization_trigonometry": ["maximum", "minimum", "derivative"],
                "circle_equation": ["circle", "equation", "points"],
                "substitution_trigonometric": ["substitution", "trigonometric"],
                "complex_number_locus": ["locus", "complex", "equation"]
            }
            
            if expected_approach in approach_keywords:
                keywords = approach_keywords[expected_approach]
                if any(keyword in solution_text for keyword in keywords):
                    evaluation["mathematical_rigor"] += 3
                    evaluation["strengths"].append(f"Uses {expected_approach} approach")
        
        # Calculate final score
        evaluation["score"] = (
            evaluation["mathematical_rigor"] * 4 +  # 40 points max
            evaluation["explanation_clarity"] * 3 +  # 30 points max  
            evaluation["completeness"] * 3           # 30 points max
        )
        
        # Deduct points for issues
        issue_penalty = len(evaluation["issues"]) * 10
        evaluation["score"] = max(0, evaluation["score"] - issue_penalty)
        
        return evaluation
    
    def _calculate_aggregate_metrics(self, individual_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate aggregate performance metrics.
        """
        if not individual_results:
            return {}
        
        total_problems = len(individual_results)
        solved_successfully = len([r for r in individual_results if r["solved_successfully"]])
        
        # Success rate by category
        category_stats = {}
        for result in individual_results:
            cat = result["category"]
            if cat not in category_stats:
                category_stats[cat] = {"total": 0, "solved": 0}
            category_stats[cat]["total"] += 1
            if result["solved_successfully"]:
                category_stats[cat]["solved"] += 1
        
        # Success rate by difficulty
        difficulty_stats = {}
        for result in individual_results:
            diff = result["difficulty"]
            if diff not in difficulty_stats:
                difficulty_stats[diff] = {"total": 0, "solved": 0}
            difficulty_stats[diff]["total"] += 1
            if result["solved_successfully"]:
                difficulty_stats[diff]["solved"] += 1
        
        # Average response time
        response_times = [r["response_time_seconds"] for r in individual_results]
        avg_response_time = sum(response_times) / len(response_times)
        
        # Source distribution
        sources = [r["source_used"] for r in individual_results if r["source_used"]]
        source_distribution = {}
        for source in sources:
            source_distribution[source] = source_distribution.get(source, 0) + 1
        
        # Quality scores
        solved_results = [r for r in individual_results if r["solved_successfully"]]
        if solved_results:
            quality_scores = [r["solution_evaluation"]["score"] for r in solved_results]
            avg_quality_score = sum(quality_scores) / len(quality_scores)
            min_quality_score = min(quality_scores)
            max_quality_score = max(quality_scores)
        else:
            avg_quality_score = min_quality_score = max_quality_score = 0
        
        return {
            "overall_success_rate": (solved_successfully / total_problems) * 100,
            "problems_solved": solved_successfully,
            "total_problems": total_problems,
            "category_performance": {
                cat: (stats["solved"] / stats["total"]) * 100
                for cat, stats in category_stats.items()
            },
            "difficulty_performance": {
                diff: (stats["solved"] / stats["total"]) * 100  
                for diff, stats in difficulty_stats.items()
            },
            "average_response_time_seconds": avg_response_time,
            "source_distribution": source_distribution,
            "quality_metrics": {
                "average_score": avg_quality_score,
                "minimum_score": min_quality_score,
                "maximum_score": max_quality_score
            }
        }
    
    def _analyze_performance(self, individual_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Provide detailed performance analysis and recommendations.
        """
        analysis = {
            "strengths": [],
            "weaknesses": [],
            "recommendations": [],
            "detailed_insights": {}
        }
        
        solved_results = [r for r in individual_results if r["solved_successfully"]]
        failed_results = [r for r in individual_results if not r["solved_successfully"]]
        
        # Analyze strengths
        if len(solved_results) > len(failed_results):
            analysis["strengths"].append("System solves majority of JEE problems successfully")
        
        if solved_results:
            kb_solutions = len([r for r in solved_results if r["source_used"] == "knowledge_base"])
            if kb_solutions > 0:
                analysis["strengths"].append("Knowledge base contains relevant JEE-level content")
        
        # Analyze weaknesses  
        if failed_results:
            analysis["weaknesses"].append(f"Failed to solve {len(failed_results)} problems")
            
            # Analyze failure patterns
            failed_categories = [r["category"] for r in failed_results]
            failed_difficulties = [r["difficulty"] for r in failed_results]
            
            if "calculus" in failed_categories:
                analysis["weaknesses"].append("Difficulty with calculus problems")
            if "hard" in failed_difficulties:
                analysis["weaknesses"].append("Struggles with hard difficulty problems")
        
        # Recommendations
        if len(failed_results) > 0:
            analysis["recommendations"].append("Expand knowledge base with more JEE-level problems")
            analysis["recommendations"].append("Improve web search capabilities for advanced topics")
        
        if solved_results:
            avg_quality = sum(r["solution_evaluation"]["score"] for r in solved_results) / len(solved_results)
            if avg_quality < 70:
                analysis["recommendations"].append("Improve solution quality and mathematical rigor")
        
        # Detailed insights
        analysis["detailed_insights"] = {
            "most_challenging_category": self._find_most_challenging_category(individual_results),
            "fastest_solved_problem": min(solved_results, key=lambda x: x["response_time_seconds"])["problem_id"] if solved_results else None,
            "highest_quality_solution": max(solved_results, key=lambda x: x["solution_evaluation"]["score"])["problem_id"] if solved_results else None
        }
        
        return analysis
    
    def _find_most_challenging_category(self, results: List[Dict[str, Any]]) -> str:
        """Find the category with the lowest success rate."""
        category_performance = {}
        
        for result in results:
            cat = result["category"]
            if cat not in category_performance:
                category_performance[cat] = {"total": 0, "solved": 0}
            category_performance[cat]["total"] += 1
            if result["solved_successfully"]:
                category_performance[cat]["solved"] += 1
        
        # Calculate success rates
        success_rates = {
            cat: (stats["solved"] / stats["total"]) * 100
            for cat, stats in category_performance.items()
        }
        
        return min(success_rates, key=success_rates.get) if success_rates else "unknown"