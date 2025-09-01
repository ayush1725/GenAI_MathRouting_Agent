import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Calculator, Home, Brain, History, Info, Menu, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/solver", label: "AI Solver", icon: Brain },
    { path: "/history", label: "History", icon: History },
    { path: "/about", label: "About", icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 step-number rounded-xl flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <Calculator className="text-primary-foreground w-5 h-5 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">MathAI</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Mathematical Intelligence</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={`enhanced-button relative overflow-hidden px-4 py-2 transition-all duration-300 ${
                        isActive(item.path)
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                      data-testid={`nav-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span>{item.label}</span>
                      {isActive(item.path) && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent animate-pulse"></div>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden enhanced-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full pulse-indicator"></div>
                  <span className="text-green-400 text-xs">AI Online</span>
                </div>
              </div>
              <Link href="/solver">
                <Button className="enhanced-button bg-gradient-to-r from-accent to-secondary hover:from-accent/90 hover:to-secondary/90 text-white shadow-lg" data-testid="button-solve-now">
                  <Zap className="w-4 h-4 mr-2" />
                  Solve Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass-card border-t border-border/20">
            <div className="px-4 py-6 space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={`enhanced-button w-full justify-start ${
                        isActive(item.path)
                          ? "bg-gradient-to-r from-primary to-secondary text-white"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-border/20">
                <Link href="/solver">
                  <Button 
                    className="enhanced-button w-full bg-gradient-to-r from-accent to-secondary text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Start Solving
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16"></div>
    </>
  );
}