import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calculator, 
  Brain, 
  Zap, 
  Target, 
  Shield, 
  Search,
  ArrowRight,
  Star,
  TrendingUp,
  Award
} from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Solutions",
      description: "Advanced mathematical reasoning with step-by-step explanations",
      color: "from-purple-500 to-blue-500"
    },
    {
      icon: Search,
      title: "Smart Routing",
      description: "Intelligent routing between knowledge base and web search",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "AI Guardrails",
      description: "Educational content filtering with privacy protection",
      color: "from-cyan-500 to-green-500"
    },
    {
      icon: Target,
      title: "Precision Accuracy",
      description: "Human-in-the-loop feedback for continuous improvement",
      color: "from-green-500 to-yellow-500"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Problems Solved", icon: Calculator },
    { number: "99.9%", label: "Accuracy Rate", icon: Target },
    { number: "24/7", label: "Available", icon: Zap },
    { number: "4.9★", label: "User Rating", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="matrix-bg"></div>
      
      {/* Floating Particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Hero Badge */}
            <div className="inline-flex items-center px-4 py-2 glass-card rounded-full mb-8 border border-primary/20">
              <Zap className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm gradient-text font-medium">Powered by Advanced AI</span>
            </div>

            {/* Hero Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Mathematical</span>
              <br />
              <span className="text-foreground">Intelligence</span>
              <br />
              <span className="gradient-text typing-animation">Redefined</span>
            </h1>

            {/* Hero Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of mathematical problem-solving with our 
              <span className="text-primary font-semibold"> AI-powered routing agent</span> that 
              provides step-by-step solutions with human-level reasoning.
            </p>

            {/* Hero CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/solver">
                <Button 
                  size="lg" 
                  className="enhanced-button bg-gradient-to-r from-primary via-secondary to-accent hover:scale-105 transition-transform duration-300 px-8 py-4 text-lg shadow-2xl"
                  data-testid="button-start-solving"
                >
                  <Brain className="w-5 h-5 mr-2" />
                  Start Solving
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="enhanced-button glass-card px-8 py-4 text-lg border-primary/20 hover:bg-primary/5"
                  data-testid="button-learn-more"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="floating-card glass-card border border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold gradient-text mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
              Revolutionary Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the cutting-edge capabilities that make our AI the most advanced mathematical reasoning system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="floating-card glass-card border border-transparent hover:border-primary/20 group cursor-pointer transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-6 text-center relative overflow-hidden">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:gradient-text transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    
                    {/* Hover Effect Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="glass-card border border-primary/20 glow-border">
            <CardContent className="p-12 text-center">
              <div className="max-w-3xl mx-auto">
                <Award className="w-16 h-16 mx-auto mb-6 text-accent" />
                <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
                  Ready to Transform Your Math Experience?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join thousands of students, educators, and researchers who trust our AI-powered mathematical intelligence
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/solver">
                    <Button 
                      size="lg" 
                      className="enhanced-button bg-gradient-to-r from-accent to-secondary hover:scale-105 transition-transform duration-300 px-8 py-4 text-lg shadow-2xl"
                    >
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Get Started Now
                    </Button>
                  </Link>
                  <Link href="/history">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="enhanced-button glass-card px-8 py-4 text-lg border-primary/20"
                    >
                      View Examples
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}