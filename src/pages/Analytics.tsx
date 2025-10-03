import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BarChart3, Users, Eye, RefreshCw } from "lucide-react";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalVisits: 0,
    loading: true
  });

  const fetchStats = async () => {
    setStats(prev => ({ ...prev, loading: true }));
    try {
      const hostname = window.location.hostname;
      const key = hostname === 'localhost' ? 'chainexplorer-dev' : 'chainexplorer.app';
      const response = await fetch(`https://api.countapi.xyz/get/${key}/visits`);
      const data = await response.json();
      setStats({
        totalVisits: data.value || 0,
        loading: false
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart3 className="h-8 w-8" />
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              ChainExplorer usage statistics and metrics
            </p>
          </div>
          
          <Button onClick={fetchStats} disabled={stats.loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${stats.loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? (
                  <div className="animate-pulse bg-muted h-8 w-16 rounded" />
                ) : (
                  stats.totalVisits.toLocaleString()
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Since launch
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.loading ? (
                  <div className="animate-pulse bg-muted h-8 w-16 rounded" />
                ) : (
                  stats.totalVisits.toLocaleString()
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                All pages combined
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">
                Tracking enabled
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Analytics Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How it works</h3>
              <p className="text-sm text-muted-foreground">
                We use CountAPI to track basic visitor statistics. Each page visit increments the counter.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Privacy</h3>
              <p className="text-sm text-muted-foreground">
                No personal data is collected. Only anonymous visit counts are tracked.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">API Endpoint</h3>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                https://api.countapi.xyz/get/chainexplorer.app/visits
              </code>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Analytics;