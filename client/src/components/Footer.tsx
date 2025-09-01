import React from 'react';
import { Link } from 'wouter';
import { Brain, Github, Mail, Twitter, Linkedin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">MathAI</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Advanced mathematical reasoning system powered by AI, providing step-by-step solutions for students and educators worldwide.
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/ayush1725"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/ayush1725"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/ayush-dwibedy/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/solver" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  AI Problem Solver
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Solution History
                </Link>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Step-by-Step Solutions</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Multiple Math Domains</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">JEE Preparation</span>
              </li>
            </ul>
          </div>

          {/* Math Categories */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-4">Math Categories</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground text-sm">Algebra & Equations</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Calculus & Derivatives</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Geometry & Trigonometry</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Statistics & Probability</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Integration & Limits</span>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:ayushdwibedy@gmail.com" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm inline-flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  Contact Support
                </a>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Privacy Policy</span>
              </li>
              <li>
                <span className="text-muted-foreground text-sm">Terms of Service</span>
              </li>
              <li>
                <a 
                  href="https://docs.google.com/document/d/1vfJdrPhEAquBg4UPGX9gwhUAgOOyFKXFZaj8hUDANLk/edit?usp=sharing" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm inline-flex items-center gap-1"
                >
                  Documentation
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} MathAI. All rights reserved. Powered by advanced AI technology.
          </p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span className="text-muted-foreground text-xs">Made with 💜 for mathematics education</span>
          </div>
        </div>
      </div>
    </footer>
  );
};