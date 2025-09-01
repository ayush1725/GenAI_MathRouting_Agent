"""
Enhanced Storage Service for the Math Routing Agent.
Handles persistent storage of problems, feedback, and system activities.
"""

import json
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional
from uuid import uuid4

class StorageService:
    def __init__(self):
        # In-memory storage (replace with actual database in production)
        self.math_problems = {}
        self.feedback_entries = {}
        self.system_activities = {}
        self.users = {}
        
    # Math Problems
    async def create_math_problem(
        self,
        problem: str,
        solution: Dict[str, Any],
        category: str,
        difficulty: str,
        source: str
    ) -> Dict[str, Any]:
        """Create a new math problem entry."""
        problem_id = str(uuid4())
        problem_entry = {
            "id": problem_id,
            "problem": problem,
            "solution": solution,
            "category": category,
            "difficulty": difficulty,
            "source": source,
            "created_at": datetime.now()
        }
        
        self.math_problems[problem_id] = problem_entry
        return problem_entry
    
    async def get_math_problem(self, problem_id: str) -> Optional[Dict[str, Any]]:
        """Get a math problem by ID."""
        return self.math_problems.get(problem_id)
    
    async def get_math_problems_by_category(self, category: str) -> List[Dict[str, Any]]:
        """Get all math problems in a specific category."""
        return [
            problem for problem in self.math_problems.values()
            if problem["category"] == category
        ]
    
    async def search_math_problems(self, query: str) -> List[Dict[str, Any]]:
        """Search math problems by text content."""
        query_lower = query.lower()
        return [
            problem for problem in self.math_problems.values()
            if query_lower in problem["problem"].lower()
        ]
    
    # Feedback Entries
    async def create_feedback(
        self,
        problem_id: str,
        accuracy_rating: int,
        clarity_rating: str,
        comments: Optional[str] = None,
        is_helpful: bool = True
    ) -> Dict[str, Any]:
        """Create a new feedback entry."""
        feedback_id = str(uuid4())
        feedback_entry = {
            "id": feedback_id,
            "problem_id": problem_id,
            "accuracy_rating": accuracy_rating,
            "clarity_rating": clarity_rating,
            "comments": comments,
            "is_helpful": is_helpful,
            "created_at": datetime.now()
        }
        
        self.feedback_entries[feedback_id] = feedback_entry
        return feedback_entry
    
    async def get_feedback_by_problem_id(self, problem_id: str) -> List[Dict[str, Any]]:
        """Get all feedback for a specific problem."""
        return [
            feedback for feedback in self.feedback_entries.values()
            if feedback["problem_id"] == problem_id
        ]
    
    async def get_feedback_stats(self) -> Dict[str, Any]:
        """Get feedback statistics."""
        if not self.feedback_entries:
            return {"total": 0, "average_rating": 0, "helpful_percentage": 0}
        
        total = len(self.feedback_entries)
        total_rating = sum(f["accuracy_rating"] for f in self.feedback_entries.values())
        helpful_count = sum(1 for f in self.feedback_entries.values() if f["is_helpful"])
        
        return {
            "total": total,
            "average_rating": total_rating / total if total > 0 else 0,
            "helpful_percentage": (helpful_count / total * 100) if total > 0 else 0
        }
    
    # System Activities
    async def create_activity(
        self,
        action: str,
        source: str,
        details: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a new system activity entry."""
        activity_id = str(uuid4())
        activity_entry = {
            "id": activity_id,
            "action": action,
            "source": source,
            "details": details,
            "created_at": datetime.now()
        }
        
        self.system_activities[activity_id] = activity_entry
        return activity_entry
    
    async def get_recent_activity(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent system activities."""
        activities = list(self.system_activities.values())
        activities.sort(key=lambda x: x["created_at"], reverse=True)
        return activities[:limit]
    
    async def get_activity_by_source(self, source: str) -> List[Dict[str, Any]]:
        """Get activities filtered by source."""
        return [
            activity for activity in self.system_activities.values()
            if activity["source"] == source
        ]
    
    # Knowledge Base Statistics
    async def get_knowledge_base_stats(self) -> Dict[str, int]:
        """Get comprehensive knowledge base statistics."""
        if not self.math_problems:
            return {
                "total": 0,
                "calculus": 0,
                "algebra": 0,
                "geometry": 0,
                "statistics": 0,
                "trigonometry": 0
            }
        
        problems = list(self.math_problems.values())
        stats = {
            "total": len(problems),
            "calculus": len([p for p in problems if p["category"] == "calculus"]),
            "algebra": len([p for p in problems if p["category"] == "algebra"]),
            "geometry": len([p for p in problems if p["category"] == "geometry"]),
            "statistics": len([p for p in problems if p["category"] == "statistics"]),
            "trigonometry": len([p for p in problems if p["category"] == "trigonometry"])
        }
        
        return stats
    
    # User Management (basic implementation)
    async def create_user(self, username: str, password: str) -> Dict[str, Any]:
        """Create a new user."""
        user_id = str(uuid4())
        user_entry = {
            "id": user_id,
            "username": username,
            "password": password,  # In production, hash this!
            "created_at": datetime.now()
        }
        
        self.users[user_id] = user_entry
        return user_entry
    
    async def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Get user by username."""
        return next(
            (user for user in self.users.values() if user["username"] == username),
            None
        )
    
    # Data Export/Import for backup
    async def export_data(self) -> Dict[str, Any]:
        """Export all data for backup."""
        return {
            "math_problems": {
                k: {**v, "created_at": v["created_at"].isoformat()} 
                for k, v in self.math_problems.items()
            },
            "feedback_entries": {
                k: {**v, "created_at": v["created_at"].isoformat()}
                for k, v in self.feedback_entries.items()
            },
            "system_activities": {
                k: {**v, "created_at": v["created_at"].isoformat()}
                for k, v in self.system_activities.items()
            },
            "users": {
                k: {**v, "created_at": v["created_at"].isoformat()}
                for k, v in self.users.items()
            }
        }
    
    async def import_data(self, data: Dict[str, Any]):
        """Import data from backup."""
        for category, items in data.items():
            if category == "math_problems":
                self.math_problems = {
                    k: {**v, "created_at": datetime.fromisoformat(v["created_at"])}
                    for k, v in items.items()
                }
            elif category == "feedback_entries":
                self.feedback_entries = {
                    k: {**v, "created_at": datetime.fromisoformat(v["created_at"])}
                    for k, v in items.items()
                }
            elif category == "system_activities":
                self.system_activities = {
                    k: {**v, "created_at": datetime.fromisoformat(v["created_at"])}
                    for k, v in items.items()
                }
            elif category == "users":
                self.users = {
                    k: {**v, "created_at": datetime.fromisoformat(v["created_at"])}
                    for k, v in items.items()
                }