import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Activity, Users, DollarSign, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MetricCard } from "@/components/MetricCard";
import { Navigation } from "@/components/Navigation";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for charts
const priceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  price: 2200 + Math.random() * 200,
}));

const transactionData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  count: 15000 + Math.random() * 5000,
}));

const Dashboard = () => {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [latestBlocks, setLatestBlocks] = useState<any[]>([]);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const rpcProvider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/demo");
    setProvider(rpcProvider);

    const fetchData = async () => {
      try {
        const network = await rpcProvider.getNetwork();
        const blockNumber = await rpcProvider.getBlockNumber();
        
        setNetworkInfo({
          name: network.name,
          chainId: network.chainId.toString(),
          blockNumber
        });

        const blocks = [];
        for (let i = 0; i < 6; i++) {
          const block = await rpcProvider.getBlock(blockNumber - i);
          if (block) blocks.push(block);
        }
        setLatestBlocks(blocks);
      } catch (error) {
        console.error("Error fetching blockchain data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch blockchain data",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, [toast]);

  const handleSearch = () => {
    const query = searchQuery.trim();
    if (!query) return;

    if (/^\d+$/.test(query)) {
      window.location.href = `/block/${query}`;
    } else if (query.startsWith("0x") && query.length === 66) {
      window.location.href = `/tx/${query}`;
    } else if (query.startsWith("0x") && query.length === 42) {
      window.location.href = `/address/${query}`;
    } else {
      toast({
        title: "Invalid search",
        description: "Please enter a valid block number, transaction hash, or address",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Search Bar */}
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                placeholder="Search by Address / Txn Hash / Block Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 h-12 text-lg"
              />
              <Button onClick={handleSearch} size="lg" className="px-6">
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="ETH Price"
            value="$2,247.82"
            icon={DollarSign}
            trend={{ value: "2.4%", isPositive: true }}
          />
          <MetricCard
            title="Latest Block"
            value={networkInfo?.blockNumber.toLocaleString() || "Loading..."}
            icon={Activity}
            description="Updated just now"
          />
          <MetricCard
            title="Avg Block Time"
            value="12.1s"
            icon={Clock}
            description="Last 100 blocks"
          />
          <MetricCard
            title="Active Addresses"
            value="467.2K"
            icon={Users}
            trend={{ value: "8.2%", isPositive: true }}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>ETH Price (24h)</CardTitle>
              <CardDescription>Real-time price chart</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume (24h)</CardTitle>
              <CardDescription>Hourly transaction count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--chart-2))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Latest Blocks & Transactions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Latest Blocks
              </CardTitle>
              <CardDescription>Most recent blocks on the blockchain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {latestBlocks.map((block) => (
                  <Link
                    key={block.number}
                    to={`/block/${block.number}`}
                    className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-primary">#{block.number}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {block.transactions.length} txns
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">
                          {new Date(block.timestamp * 1000).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Latest Transactions
              </CardTitle>
              <CardDescription>Recent network activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {latestBlocks.slice(0, 6).map((block, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-xs font-mono text-primary mb-1">
                          0x{Math.random().toString(16).substr(2, 8)}...
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Block #{block.number}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium">
                          {(Math.random() * 2).toFixed(4)} ETH
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 60)}s ago
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
