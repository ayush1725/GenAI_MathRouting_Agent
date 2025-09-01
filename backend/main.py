from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
import asyncio
import json
from datetime import datetime

# Import our services
from services.math_agent import MathRoutingAgent
from services.guardrails import AIGuardRails
from services.vector_db import VectorDBService
from services.web_search import MCPWebSearchService
from services.storage import StorageService
from services.dspy_feedback import DSPyFeedbackSystem

app = FastAPI(
    title="Math Routing Agent API",
    description="AI-Powered Mathematical Problem Solver with Agentic-RAG Architecture",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
storage = StorageService()
guardrails = AIGuardRails()
vector_db = VectorDBService()
web_search = MCPWebSearchService()
feedback_system = DSPyFeedbackSystem()
math_agent = MathRoutingAgent(
    storage=storage,
    guardrails=guardrails,
    vector_db=vector_db,
    web_search=web_search,
    feedback_system=feedback_system
)

# Pydantic models
class MathProblemRequest(BaseModel):
    problem: str
    show_steps: bool = True
    include_explanations: bool = True

class FeedbackRequest(BaseModel):
    problem_id: str
    accuracy_rating: int
    clarity_rating: str
    comments: Optional[str] = None
    is_helpful: bool

class MathSolutionResponse(BaseModel):
    problem: str
    solution: Dict[str, Any]
    source: str
    response_time: float
    category: Optional[str] = None
    problem_id: str
    confidence_score: Optional[float] = None

class SystemStatusResponse(BaseModel):
    vector_database: str
    web_search: str
    ai_guardrails: str
    feedback_system: str
    mcp_status: str
    knowledge_base_stats: Dict[str, int]
    recent_activity: List[Dict[str, Any]]

# API Endpoints
@app.post("/api/solve", response_model=MathSolutionResponse)
async def solve_problem(request: MathProblemRequest):
    """
    Solve a mathematical problem using the Agentic-RAG system.
    
    The system first applies AI guardrails, then searches the knowledge base,
    and falls back to web search via MCP if needed.
    """
    try:
        solution = await math_agent.solve_problem(
            problem=request.problem,
            show_steps=request.show_steps,
            include_explanations=request.include_explanations
        )
        return solution
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.post("/api/feedback")
async def submit_feedback(request: FeedbackRequest):
    """
    Submit feedback for human-in-the-loop learning.
    
    Uses DSPy for intelligent feedback processing and model improvement.
    """
    try:
        await math_agent.submit_feedback(
            problem_id=request.problem_id,
            accuracy_rating=request.accuracy_rating,
            clarity_rating=request.clarity_rating,
            comments=request.comments,
            is_helpful=request.is_helpful
        )
        return {"success": True, "message": "Feedback submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit feedback: {str(e)}")

@app.get("/api/status", response_model=SystemStatusResponse)
async def get_system_status():
    """
    Get comprehensive system status including all components.
    """
    try:
        stats = await storage.get_knowledge_base_stats()
        recent_activity = await storage.get_recent_activity(limit=5)
        
        # Check MCP status
        mcp_status = await web_search.check_mcp_connection()
        
        return {
            "vector_database": "online",
            "web_search": "ready",
            "ai_guardrails": "active",
            "feedback_system": "learning",
            "mcp_status": mcp_status,
            "knowledge_base_stats": stats,
            "recent_activity": [
                {
                    "action": activity["action"],
                    "source": activity["source"],
                    "details": activity["details"],
                    "timestamp": activity["created_at"].isoformat() if activity.get("created_at") else None
                }
                for activity in recent_activity
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get system status: {str(e)}")

@app.get("/api/activity")
async def get_recent_activity(limit: int = 10):
    """
    Get recent system activity for monitoring.
    """
    try:
        activities = await storage.get_recent_activity(limit=limit)
        return activities
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recent activity: {str(e)}")

@app.get("/api/knowledge-base/stats")
async def get_knowledge_base_stats():
    """
    Get detailed knowledge base statistics.
    """
    try:
        stats = await storage.get_knowledge_base_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get knowledge base stats: {str(e)}")

@app.post("/api/benchmark/jee")
async def run_jee_benchmark():
    """
    Run JEE Bench evaluation (bonus feature).
    """
    try:
        from services.jee_benchmark import JEEBenchmarkRunner
        benchmark_runner = JEEBenchmarkRunner(math_agent)
        results = await benchmark_runner.run_benchmark()
        return results
    except ImportError:
        raise HTTPException(status_code=501, detail="JEE Benchmark not implemented")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Benchmark failed: {str(e)}")

@app.get("/api/health")
async def health_check():
    """
    Simple health check endpoint.
    """
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Serve static files from client build
if os.path.exists("../client/dist"):
    app.mount("/", StaticFiles(directory="../client/dist", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5000,
        reload=True,
        log_level="info"
    )