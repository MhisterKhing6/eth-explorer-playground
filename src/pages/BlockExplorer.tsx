import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Blocks, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BlockExplorer = () => {
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [latestBlocks, setLatestBlocks] = useState<any[]>([]);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Using Ethereum mainnet via public RPC
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

        // Fetch latest 10 blocks
        const blocks = [];
        for (let i = 0; i < 10; i++) {
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

    // Determine if it's a block number, transaction hash, or address
    if (/^\d+$/.test(query)) {
      // Block number
      window.location.href = `/block/${query}`;
    } else if (query.startsWith("0x") && query.length === 66) {
      // Transaction hash
      window.location.href = `/tx/${query}`;
    } else if (query.startsWith("0x") && query.length === 42) {
      // Address
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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Blocks className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Ethereum Block Explorer</h1>
          </div>
          
          <div className="flex gap-2 max-w-2xl">
            <Input
              placeholder="Search by Address / Txn Hash / Block"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {networkInfo && (
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Network</CardDescription>
                <CardTitle className="text-2xl">{networkInfo.name}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Chain ID</CardDescription>
                <CardTitle className="text-2xl">{networkInfo.chainId}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Latest Block</CardDescription>
                <CardTitle className="text-2xl">{networkInfo.blockNumber.toLocaleString()}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <CardTitle>Latest Blocks</CardTitle>
            </div>
            <CardDescription>The most recent blocks on the Ethereum blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestBlocks.map((block) => (
                <Link
                  key={block.number}
                  to={`/block/${block.number}`}
                  className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground">Block</span>
                        <span className="font-mono font-semibold text-primary">{block.number}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {block.transactions.length} transactions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">
                        Miner: {block.miner.slice(0, 10)}...
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(block.timestamp * 1000).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BlockExplorer;
