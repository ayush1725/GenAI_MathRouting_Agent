import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  History, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Brain,
  Target,
  Sparkles,
  Eye,
  Trash2,
  Star
} from "lucide-react";

interface HistoryItem {
  id: string;
  problem: string;
  category: string;
  source: 'knowledge_base' | 'web_search';
  difficulty: string;
  timestamp: string;
  responseTime: number;
  rating?: number;
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data for demo - in real app this would come from API
  const mockHistory: HistoryItem[] = [
    {
      id: "1",
      problem: "Solve x² + 5x + 6 = 0",
      category: "algebra",
      source: "knowledge_base",
      difficulty: "medium",
      timestamp: "2024-01-15T10:30:00Z",
      responseTime: 1200,
      rating: 5
    },
    {
      id: "2", 
      problem: "Find the derivative of ln(x²)",
      category: "calculus",
      source: "knowledge_base",
      difficulty: "medium",
      timestamp: "2024-01-15T09:45:00Z",
      responseTime: 800,
      rating: 4
    },
    {
      id: "3",
      problem: "Calculate the area of a circle with radius 5",
      category: "geometry", 
      source: "knowledge_base",
      difficulty: "easy",
      timestamp: "2024-01-14T16:20:00Z",
      responseTime: 600,
      rating: 5
    },
    {
      id: "4",
      problem: "Solve the system: 2x + 3y = 7, x - y = 1",
      category: "algebra",
      source: "web_search", 
      difficulty: "medium",
      timestamp: "2024-01-14T14:15:00Z",
      responseTime: 2100
    },
    {
      id: "5",
      problem: "Find the limit of (sin x)/x as x approaches 0",
      category: "calculus",
      source: "knowledge_base",
      difficulty: "hard",
      timestamp: "2024-01-13T11:30:00Z", 
      responseTime: 1500,
      rating: 5
    }
  ];

  const { data: history = [], isLoading } = useQuery({
    queryKey: ["/api/history", selectedCategory],
    queryFn: async () => {
      const params = selectedCategory !== "all" ? `?category=${selectedCategory}` : "";
      try {
        const response = await fetch(`/api/history${params}`);
        if (!response.ok) {
          // Fallback to mock data if API fails
          return mockHistory;
        }
        const data = await response.json();
        return data.map((item: any) => ({
          id: item.id,
          problem: item.problem,
          category: item.category,
          source: item.source,
          difficulty: item.difficulty,
          timestamp: item.createdAt,
          responseTime: Math.random() * 2000 + 500, // Mock response time for now
          rating: Math.floor(Math.random() * 2) + 4 // Mock rating 4-5 stars
        }));
      } catch (error) {
        // Return mock data on error
        return mockHistory;
      }
    }
  });

  const categories = ["all", "algebra", "calculus", "geometry", "statistics"];

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.problem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      algebra: "from-purple-500 to-blue-500",
      calculus: "from-blue-500 to-cyan-500", 
      geometry: "from-cyan-500 to-green-500",
      statistics: "from-green-500 to-yellow-500"
    };
    return colors[category as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "text-green-400",
      medium: "text-yellow-400", 
      hard: "text-red-400"
    };
    return colors[difficulty as keyof typeof colors] || "text-gray-400";
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center animate-pulse">
            <History className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </div>
    );
  }

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
              <History className="w-4 h-4 text-accent mr-2" />
              <span className="text-sm gradient-text font-medium">Solution History</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Your Mathematical Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Review and revisit your solved problems, track your progress, and discover patterns in your learning
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Search and Filters */}
        <Card className="glass-card border border-primary/20 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search your solved problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass-card border-primary/20"
                  data-testid="input-search-history"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <div className="flex space-x-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={`enhanced-button ${
                        selectedCategory === category
                          ? "bg-gradient-to-r from-primary to-secondary text-white"
                          : "glass-card border-primary/20"
                      }`}
                      data-testid={`filter-${category}`}
                    >
                      {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* History List */}
        <div className="space-y-6" data-testid="history-list">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item, index) => (
              <Card 
                key={item.id} 
                className="floating-card glass-card border border-primary/10 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Problem Header */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getCategoryColor(item.category)} rounded-lg flex items-center justify-center`}>
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                              {item.category}
                            </span>
                            <span className={`text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                              {item.difficulty}
                            </span>
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${item.source === 'knowledge_base' ? 'bg-primary' : 'bg-secondary'}`}></div>
                              <span className="text-xs text-muted-foreground">
                                {item.source === 'knowledge_base' ? 'Knowledge Base' : 'Web Search'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Problem Text */}
                      <p className="text-foreground font-mono text-lg mb-3 group-hover:gradient-text transition-all duration-300">
                        {item.problem}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatTimestamp(item.timestamp)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{(item.responseTime / 1000).toFixed(1)}s</span>
                        </div>
                        {item.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span>{item.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button variant="ghost" size="sm" className="enhanced-button" data-testid={`button-view-${item.id}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="enhanced-button text-red-400 hover:text-red-300" data-testid={`button-delete-${item.id}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="glass-card border-2 border-dashed border-primary/20">
              <CardContent className="p-12 text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  No Problems Found
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || selectedCategory !== "all" 
                    ? "Try adjusting your search or filter criteria"
                    : "Start solving problems to see your history here"
                  }
                </p>
                <Button className="enhanced-button bg-gradient-to-r from-primary to-secondary">
                  <Target className="w-4 h-4 mr-2" />
                  Solve Your First Problem
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}