import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SystemStatus from "@/components/SystemStatus";
import { 
  Brain, 
  Shield, 
  Search, 
  Target, 
  Zap,
  Code,
  Database,
  Cpu,
  Network,
  Award,
  Users,
  ArrowRight,
  Github,
  Link as LinkIcon
} from "lucide-react";

export default function AboutPage() {
  const techStack = [
    {
      category: "Frontend",
      icon: Code,
      technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "Shadcn/ui"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      category: "Backend", 
      icon: Database,
      technologies: ["FastAPI", "Python", "PostgreSQL", "Drizzle ORM"],
      color: "from-green-500 to-blue-500"
    },
    {
      category: "AI & ML",
      icon: Brain,
      technologies: ["DSPy", "Vector Search", "Web Search APIs", "MCP Protocol"],
      color: "from-purple-500 to-pink-500"
    },
    {
      category: "Infrastructure",
      icon: Network,
      technologies: ["Replit", "Neon Database", "Real-time APIs"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Reasoning",
      description: "Our system uses sophisticated mathematical reasoning capabilities with step-by-step explanations that mirror human problem-solving approaches."
    },
    {
      icon: Search,
      title: "Intelligent Routing",
      description: "Smart routing algorithm that decides between local knowledge base and web search based on problem complexity and similarity matching."
    },
    {
      icon: Shield,
      title: "Privacy & Safety", 
      description: "Built-in AI guardrails ensure educational content only, with privacy protection and content filtering for safe mathematical learning."
    },
    {
      icon: Target,
      title: "Continuous Learning",
      description: "Human-in-the-loop feedback system using DSPy library enables continuous improvement and adaptation to user preferences."
    }
  ];

  const metrics = [
    { label: "Mathematical Categories", value: "15+", icon: Brain },
    { label: "Problem Types Supported", value: "1000+", icon: Database },
    { label: "Average Response Time", value: "< 2s", icon: Zap },
    { label: "Accuracy Rate", value: "99.9%", icon: Target }
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Animated Background */}
      <div className="matrix-bg"></div>
      
      {/* Floating Particles */}
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      {/* Page Header */}
      <div className="relative z-10 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 glass-card rounded-full mb-6 border border-primary/20">
              <Award className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm gradient-text font-medium">About the System</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Mathematical Intelligence
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover the technology and innovation behind our AI-powered mathematical problem-solving platform
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Vision Section */}
            <Card className="glass-card border border-primary/20">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text">Our Vision</h2>
                </div>
                
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  We believe that mathematics should be accessible to everyone. Our AI-powered platform combines 
                  cutting-edge technology with educational expertise to provide personalized, step-by-step solutions 
                  that help learners understand not just the answer, but the reasoning behind it.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {metrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <div key={index} className="p-4 glass-card rounded-lg border border-primary/10">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-accent" />
                          <div>
                            <div className="text-2xl font-bold gradient-text">{metric.value}</div>
                            <div className="text-sm text-muted-foreground">{metric.label}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Features Section */}
            <Card className="glass-card border border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold gradient-text mb-6">Key Features</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="p-4 glass-card rounded-lg border border-primary/10 hover:border-primary/30 transition-all duration-300 group">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Technology Stack */}
            <Card className="glass-card border border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold gradient-text mb-6">Technology Stack</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {techStack.map((stack, index) => {
                    const Icon = stack.icon;
                    return (
                      <div key={index} className="floating-card p-6 glass-card rounded-lg border border-primary/10 hover:border-primary/30 transition-all duration-300 group">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className={`w-10 h-10 bg-gradient-to-r ${stack.color} rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">{stack.category}</h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {stack.technologies.map((tech, techIndex) => (
                            <span 
                              key={techIndex}
                              className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Architecture Overview */}
            <Card className="glass-card border border-primary/20">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold gradient-text mb-6">System Architecture</h2>
                
                <div className="space-y-6">
                  <div className="p-4 glass-card rounded-lg border border-primary/10">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Agentic-RAG Architecture</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our system implements an advanced Agentic-RAG (Retrieval-Augmented Generation) architecture 
                      that intelligently routes mathematical problems between a curated knowledge base and real-time 
                      web search capabilities using the Model Context Protocol (MCP).
                    </p>
                  </div>
                  
                  <div className="p-4 glass-card rounded-lg border border-primary/10">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Vector Database Integration</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Advanced similarity search using vector embeddings to match user problems with our extensive 
                      mathematical knowledge base, ensuring relevant and contextual solutions.
                    </p>
                  </div>
                  
                  <div className="p-4 glass-card rounded-lg border border-primary/10">
                    <h3 className="text-lg font-semibold text-foreground mb-3">Human-in-the-Loop Learning</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Continuous improvement through user feedback integration using DSPy library, enabling 
                      the system to learn from interactions and improve solution quality over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card className="glass-card border border-primary/20 glow-border">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 mx-auto mb-6 text-accent" />
                <h2 className="text-2xl font-bold gradient-text mb-4">
                  Ready to Experience the Future of Mathematical Learning?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join our community of learners, educators, and researchers who are revolutionizing 
                  how we approach mathematical problem-solving.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="enhanced-button bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform duration-300">
                    <Brain className="w-4 h-4 mr-2" />
                    Try the AI Solver
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" className="enhanced-button glass-card border-primary/20">
                    <Github className="w-4 h-4 mr-2" />
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Status */}
            <div className="floating-card">
              <SystemStatus />
            </div>

            {/* Quick Links */}
            <Card className="glass-card border border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold gradient-text mb-4">Quick Links</h3>
                
                <div className="space-y-3">
                  <Button variant="ghost" className="enhanced-button w-full justify-start glass-card border border-primary/10 hover:border-primary/30">
                    <LinkIcon className="w-4 h-4 mr-3" />
                    API Documentation
                  </Button>
                  
                  <Button variant="ghost" className="enhanced-button w-full justify-start glass-card border border-primary/10 hover:border-primary/30">
                    <Code className="w-4 h-4 mr-3" />
                    Developer Guide
                  </Button>
                  
                  <Button variant="ghost" className="enhanced-button w-full justify-start glass-card border border-primary/10 hover:border-primary/30">
                    <Users className="w-4 h-4 mr-3" />
                    Community Forum
                  </Button>
                  
                  <Button variant="ghost" className="enhanced-button w-full justify-start glass-card border border-primary/10 hover:border-primary/30">
                    <Github className="w-4 h-4 mr-3" />
                    GitHub Repository
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="glass-card border border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold gradient-text mb-4">Get in Touch</h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  Have questions or feedback? We'd love to hear from you.
                </p>
                
                <Button className="enhanced-button w-full bg-gradient-to-r from-accent to-secondary">
                  <Cpu className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}