import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Blocks } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Explorer
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Blocks className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Block #{block.number}</h1>
              <p className="text-muted-foreground">Block Details</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Block Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Block Height:</span>
                <span className="font-mono font-semibold">{block.number}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Timestamp:</span>
                <span>{new Date(block.timestamp * 1000).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Transactions:</span>
                <span className="font-semibold">{block.transactions.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Miner:</span>
                <Link to={`/address/${block.miner}`} className="font-mono text-primary hover:underline">
                  {block.miner}
                </Link>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Gas Used:</span>
                <span className="font-mono">{block.gasUsed.toString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Gas Limit:</span>
                <span className="font-mono">{block.gasLimit.toString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Hash:</span>
                <span className="font-mono text-sm break-all">{block.hash}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Parent Hash:</span>
                <Link to={`/block/${block.number - 1}`} className="font-mono text-sm break-all text-primary hover:underline">
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
