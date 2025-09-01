import { useQuery } from "@tanstack/react-query";
import { Calculator, Search, Star, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SystemStatusData {
  vectorDatabase: string;
  webSearch: string;
  aiGuardrails: string;
  feedbackSystem: string;
  knowledgeBaseStats: {
    total: number;
    calculus: number;
    algebra: number;
    geometry: number;
    statistics: number;
  };
  recentActivity: Array<{
    action: string;
    source: string;
    details: string;
    timestamp: string;
  }>;
}

export default function SystemStatus() {
  const { data: status, isLoading } = useQuery<SystemStatusData>({
    queryKey: ["/api/status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["/api/activity"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'ready':
      case 'active':
        return 'bg-green-500';
      case 'learning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getActivityIcon = (source: string) => {
    switch (source) {
      case 'knowledge_base':
        return <Calculator className="text-primary w-3 h-3" />;
      case 'web_search':
        return <Search className="text-secondary w-3 h-3" />;
      case 'user_feedback':
        return <Star className="text-green-600 w-3 h-3" />;
      default:
        return <Clock className="text-muted-foreground w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card className="glass-card border border-primary/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold gradient-text mb-4">System Status</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full pulse-indicator ${getStatusColor(status?.vectorDatabase || 'offline')}`}></div>
                <span className="text-sm text-foreground">Vector Database</span>
              </div>
              <span className="text-xs text-muted-foreground capitalize">
                {status?.vectorDatabase || 'Offline'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status?.webSearch || 'offline')}`}></div>
                <span className="text-sm text-foreground">Web Search (MCP)</span>
              </div>
              <span className="text-xs text-muted-foreground capitalize">
                {status?.webSearch || 'Offline'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status?.aiGuardrails || 'offline')}`}></div>
                <span className="text-sm text-foreground">AI Guardrails</span>
              </div>
              <span className="text-xs text-muted-foreground capitalize">
                {status?.aiGuardrails || 'Offline'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status?.feedbackSystem || 'offline')}`}></div>
                <span className="text-sm text-foreground">Feedback System</span>
              </div>
              <span className="text-xs text-muted-foreground capitalize">
                {status?.feedbackSystem || 'Offline'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
          
          <div className="space-y-3" data-testid="recent-activity">
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    {getActivityIcon(activity.source)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleTimeString()} • {activity.source.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Base Stats */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Knowledge Base</h3>
          
          <div className="space-y-3" data-testid="knowledge-base-stats">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Problems</span>
              <span className="text-sm font-medium text-foreground">
                {status?.knowledgeBaseStats?.total || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Calculus</span>
              <span className="text-sm font-medium text-foreground">
                {status?.knowledgeBaseStats?.calculus || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Algebra</span>
              <span className="text-sm font-medium text-foreground">
                {status?.knowledgeBaseStats?.algebra || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Geometry</span>
              <span className="text-sm font-medium text-foreground">
                {status?.knowledgeBaseStats?.geometry || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Statistics</span>
              <span className="text-sm font-medium text-foreground">
                {status?.knowledgeBaseStats?.statistics || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
