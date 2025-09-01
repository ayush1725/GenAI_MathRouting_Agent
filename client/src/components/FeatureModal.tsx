import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface FeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    color: string;
    detailedDescription?: string;
    benefits?: string[];
    redirectUrl?: string;
    redirectText?: string;
  };
}

export const FeatureModal: React.FC<FeatureModalProps> = ({
  isOpen,
  onClose,
  feature
}) => {
  const Icon = feature.icon;

  const getDetailedContent = (title: string) => {
    switch (title) {
      case "AI-Powered Solutions":
        return {
          detailedDescription: "Our AI system combines multiple mathematical reasoning approaches to provide comprehensive step-by-step solutions. It leverages advanced neural networks trained on mathematical literature and can handle complex problems across algebra, calculus, geometry, and more.",
          benefits: [
            "Step-by-step explanations with mathematical justification",
            "Multi-approach problem solving techniques",
            "Interactive solution exploration",
            "Visual mathematical representations",
            "Adaptive difficulty progression"
          ],
          redirectUrl: "/solver",
          redirectText: "Try AI Solver"
        };
      case "Smart Routing":
        return {
          detailedDescription: "Our intelligent routing system automatically determines the best source for mathematical solutions. It first searches our curated knowledge base, then seamlessly falls back to web search using multiple academic databases and mathematical resources.",
          benefits: [
            "Instant access to curated mathematical knowledge",
            "Fallback to real-time web search via MCP protocol",
            "Priority routing to academic sources",
            "Quality-scored content delivery",
            "Reduced response time optimization"
          ],
          redirectUrl: "/about",
          redirectText: "Learn About Routing"
        };
      case "AI Guardrails":
        return {
          detailedDescription: "Advanced content filtering ensures all mathematical solutions are educationally appropriate and accurate. Our guardrails system protects student privacy while maintaining the highest standards of mathematical integrity.",
          benefits: [
            "Educational content verification",
            "Privacy-first data handling",
            "Age-appropriate solution complexity",
            "Harmful content detection",
            "Compliance with educational standards"
          ],
          redirectUrl: "/about",
          redirectText: "View Safety Features"
        };
      case "Precision Accuracy":
        return {
          detailedDescription: "Human-in-the-loop feedback mechanisms ensure continuous improvement of solution quality. Our system learns from expert feedback and user interactions to enhance mathematical accuracy over time.",
          benefits: [
            "Expert mathematician review process",
            "Continuous accuracy improvement",
            "Real-time quality monitoring",
            "User feedback integration",
            "Benchmark performance tracking"
          ],
          redirectUrl: "/history",
          redirectText: "View Accuracy Stats"
        };
      default:
        return {
          detailedDescription: feature.description,
          benefits: ["Enhanced mathematical problem solving"],
          redirectUrl: "/solver",
          redirectText: "Get Started"
        };
    }
  };

  const content = getDetailedContent(feature.title);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl glass-card border border-primary/20 backdrop-blur-xl bg-background/95">
        <DialogHeader className="relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 p-2 rounded-full bg-muted/80 hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold gradient-text">
                {feature.title}
              </DialogTitle>
              <Badge variant="secondary" className="mt-2">
                Advanced Feature
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">About This Feature</h3>
            <p className="text-muted-foreground leading-relaxed">
              {content.detailedDescription}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Key Benefits</h3>
            <ul className="space-y-2">
              {content.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Link href={content.redirectUrl}>
              <Button 
                className="enhanced-button bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform duration-300"
                onClick={onClose}
              >
                {content.redirectText}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="glass-card border-primary/20"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};