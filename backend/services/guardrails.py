"""
Enhanced AI Guardrails with privacy protection and content filtering.
Ensures only educational mathematical content is processed.
"""

import re
import asyncio
from typing import Dict, List
import json

class AIGuardRails:
    def __init__(self):
        # Mathematical keywords for content validation
        self.math_keywords = [
            'equation', 'derivative', 'integral', 'function', 'solve', 'calculate', 'find',
            'algebra', 'calculus', 'geometry', 'trigonometry', 'statistics', 'probability',
            'matrix', 'vector', 'polynomial', 'logarithm', 'exponential', 'limit',
            'theorem', 'proof', 'formula', 'graph', 'plot', 'coordinate', 'angle',
            'triangle', 'circle', 'square', 'rectangle', 'area', 'volume', 'perimeter',
            'differential', 'integration', 'optimization', 'linear', 'quadratic',
            'sine', 'cosine', 'tangent', 'pi', 'infinity', 'complex', 'rational'
        ]
        
        # Prohibited content categories
        self.prohibited_keywords = [
            'politics', 'religion', 'personal information', 'medical diagnosis', 
            'legal advice', 'financial advice', 'inappropriate', 'offensive', 
            'violent', 'sexual', 'drugs', 'weapons', 'illegal', 'harmful',
            'social security', 'credit card', 'password', 'private key'
        ]
        
        # Privacy-sensitive patterns
        self.privacy_patterns = [
            r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
            r'\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b',  # Credit card
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # Email
            r'\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b',  # Phone number
        ]
    
    async def validate_mathematical_content(self, input_text: str) -> Dict[str, any]:
        """
        Comprehensive validation of mathematical content with privacy protection.
        """
        input_lower = input_text.lower()
        
        # Step 1: Privacy protection - check for sensitive information
        privacy_check = await self._check_privacy_violations(input_text)
        if not privacy_check["is_safe"]:
            return {
                "is_valid": False,
                "reason": privacy_check["reason"],
                "violation_type": "privacy"
            }
        
        # Step 2: Content filtering - check for prohibited content
        content_check = await self._check_prohibited_content(input_lower)
        if not content_check["is_safe"]:
            return {
                "is_valid": False,
                "reason": content_check["reason"],
                "violation_type": "content"
            }
        
        # Step 3: Mathematical content validation
        math_check = await self._validate_mathematical_nature(input_text, input_lower)
        if not math_check["is_valid"]:
            return {
                "is_valid": False,
                "reason": math_check["reason"],
                "violation_type": "non_mathematical"
            }
        
        return {
            "is_valid": True,
            "confidence_score": math_check.get("confidence", 0.8),
            "detected_categories": math_check.get("categories", [])
        }
    
    async def _check_privacy_violations(self, text: str) -> Dict[str, any]:
        """Check for privacy-sensitive information."""
        violations = []
        
        for pattern in self.privacy_patterns:
            if re.search(pattern, text):
                violations.append("sensitive_data_detected")
        
        if violations:
            return {
                "is_safe": False,
                "reason": "Input contains sensitive personal information. Please remove any personal data and try again.",
                "violations": violations
            }
        
        return {"is_safe": True}
    
    async def _check_prohibited_content(self, text_lower: str) -> Dict[str, any]:
        """Check for prohibited content categories."""
        violations = []
        
        for keyword in self.prohibited_keywords:
            if keyword in text_lower:
                violations.append(keyword)
        
        if violations:
            return {
                "is_safe": False,
                "reason": "Content appears to be non-educational or inappropriate. Please enter a mathematical problem.",
                "violations": violations
            }
        
        return {"is_safe": True}
    
    async def _validate_mathematical_nature(self, original_text: str, text_lower: str) -> Dict[str, any]:
        """Validate that the content is mathematical in nature."""
        
        # Check for mathematical keywords
        math_keywords_found = [kw for kw in self.math_keywords if kw in text_lower]
        
        # Check for mathematical symbols
        math_symbols = re.findall(r'[+\-*/=<>∫∑∏√∞π∂∇±×÷≤≥≠≈∈∅∪∩]', original_text)
        
        # Check for numbers
        numbers = re.findall(r'\d+', original_text)
        
        # Check for variables (single letters that might represent variables)
        variables = re.findall(r'\b[a-z]\b', text_lower)
        
        # Check for mathematical expressions
        expressions = re.findall(r'[a-z]\s*[\+\-\*/\^]\s*[a-z0-9]', text_lower)
        
        # Calculate confidence score
        confidence = 0
        categories = []
        
        if math_keywords_found:
            confidence += 0.4
            categories.append("keywords")
        
        if math_symbols:
            confidence += 0.3
            categories.append("symbols")
        
        if numbers and variables:
            confidence += 0.2
            categories.append("variables_numbers")
        
        if expressions:
            confidence += 0.1
            categories.append("expressions")
        
        # Special patterns for common mathematical problems
        if re.search(r'(solve|find|calculate|compute|determine)', text_lower):
            confidence += 0.1
            categories.append("problem_language")
        
        if confidence >= 0.3:
            return {
                "is_valid": True,
                "confidence": min(confidence, 1.0),
                "categories": categories,
                "keywords_found": math_keywords_found,
                "symbols_found": len(math_symbols),
                "variables_found": len(variables)
            }
        
        return {
            "is_valid": False,
            "reason": "This doesn't appear to be a mathematical problem. Please enter a question related to mathematics, such as equations, calculus, geometry, or algebra.",
            "confidence": confidence
        }
    
    async def sanitize_input(self, text: str) -> str:
        """
        Sanitize input text while preserving mathematical content.
        """
        # Remove potential script injections
        sanitized = re.sub(r'<script.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
        
        # Remove SQL injection patterns
        sql_patterns = [
            r'(union|select|insert|update|delete|drop|create|alter)\s+',
            r'(or|and)\s+1\s*=\s*1',
            r'(or|and)\s+1\s*=\s*0'
        ]
        
        for pattern in sql_patterns:
            sanitized = re.sub(pattern, '', sanitized, flags=re.IGNORECASE)
        
        # Preserve mathematical notation while removing excessive whitespace
        sanitized = re.sub(r'\s+', ' ', sanitized).strip()
        
        return sanitized
    
    async def get_guardrails_status(self) -> Dict[str, any]:
        """Get current guardrails system status."""
        return {
            "status": "active",
            "privacy_protection": "enabled",
            "content_filtering": "enabled",
            "mathematical_validation": "enabled",
            "keywords_count": len(self.math_keywords),
            "prohibited_categories": len(self.prohibited_keywords),
            "privacy_patterns": len(self.privacy_patterns)
        }