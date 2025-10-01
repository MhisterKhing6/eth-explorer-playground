import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Blocks, Clock, Zap, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";

const BlockDetails = () => {
  const { blockNumber } = useParams();
  const [block, setBlock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/demo");
        const blockData = await provider.getBlock(Number(blockNumber), true);
        
        if (blockData) {
          setBlock(blockData);
        } else {
          toast({
            title: "Block not found",
            description: "The requested block does not exist",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching block:", error);
        toast({
          title: "Error",
          description: "Failed to fetch block data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlock();
  }, [blockNumber, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading block data...</p>
        </div>
      </div>
    );
  }

  if (!block) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Block not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Blocks className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Block #{block.number}</h1>
              <p className="text-muted-foreground">Detailed block information</p>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transactions
              </CardTitle>
              <Database className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{block.transactions.length}</div>
              <p className="text-xs text-muted-foreground">in this block</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gas Used
              </CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {Number(block.gasUsed).toLocaleString()} / {Number(block.gasLimit).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Block Time
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(block.timestamp * 1000).toLocaleTimeString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(block.timestamp * 1000).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Block Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                <span className="text-muted-foreground font-medium">Block Height:</span>
                <span className="font-mono font-semibold text-primary">{block.number}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                <span className="text-muted-foreground font-medium">Miner:</span>
                <Link to={`/address/${block.miner}`} className="font-mono text-sm text-primary hover:underline break-all">
                  {block.miner}
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                <span className="text-muted-foreground font-medium">Block Hash:</span>
                <span className="font-mono text-sm break-all text-right">{block.hash}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                <span className="text-muted-foreground font-medium">Parent Hash:</span>
                <Link 
                  to={`/block/${block.number - 1}`} 
                  className="font-mono text-sm break-all text-primary hover:underline text-right"
                >
                  {block.parentHash}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>{block.transactions.length} transactions in this block</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {block.transactions.map((tx: any, index: number) => (
                <Link
                  key={index}
                  to={`/tx/${typeof tx === 'string' ? tx : tx.hash}`}
                  className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-mono text-sm text-primary mb-1">
                        {typeof tx === 'string' ? tx.slice(0, 20) : tx.hash.slice(0, 20)}...
                      </div>
                      {typeof tx !== 'string' && (
                        <div className="text-xs text-muted-foreground">
                          From: {tx.from.slice(0, 10)}... → To: {tx.to ? tx.to.slice(0, 10) + '...' : 'Contract Creation'}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tx #{index}
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

export default BlockDetails;
