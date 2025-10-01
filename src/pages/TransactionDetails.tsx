import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";

const TransactionDetails = () => {
  const { txHash } = useParams();
  const [transaction, setTransaction] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/demo");
        const tx = await provider.getTransaction(txHash!);
        const txReceipt = await provider.getTransactionReceipt(txHash!);
        
        if (tx) {
          setTransaction(tx);
          setReceipt(txReceipt);
        } else {
          toast({
            title: "Transaction not found",
            description: "The requested transaction does not exist",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error fetching transaction:", error);
        toast({
          title: "Error",
          description: "Failed to fetch transaction data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [txHash, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading transaction data...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Transaction not found</p>
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
              <Send className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold mb-1">Transaction Details</h1>
              <p className="text-muted-foreground font-mono text-xs sm:text-sm break-all">{txHash}</p>
            </div>
            {receipt && (
              <Badge 
                variant={receipt.status === 1 ? "default" : "destructive"} 
                className="gap-1 hidden sm:flex"
              >
                {receipt.status === 1 ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Success
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Failed
                  </>
                )}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Transaction Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                <span className="text-muted-foreground font-medium">Status:</span>
                {receipt && (
                  <Badge 
                    variant={receipt.status === 1 ? "default" : "destructive"} 
                    className="gap-1 w-fit"
                  >
                    {receipt.status === 1 ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" />
                        Success
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        Failed
                      </>
                    )}
                  </Badge>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                <span className="text-muted-foreground font-medium">Transaction Hash:</span>
                <span className="font-mono text-xs sm:text-sm break-all text-right">{transaction.hash}</span>
              </div>
              {transaction.blockNumber && (
                <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                  <span className="text-muted-foreground font-medium">Block:</span>
                  <Link to={`/block/${transaction.blockNumber}`} className="font-mono font-semibold text-primary hover:underline">
                    {transaction.blockNumber}
                  </Link>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                <span className="text-muted-foreground font-medium">From:</span>
                <Link to={`/address/${transaction.from}`} className="font-mono text-xs sm:text-sm text-primary hover:underline break-all text-right">
                  {transaction.from}
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                <span className="text-muted-foreground font-medium">To:</span>
                {transaction.to ? (
                  <Link to={`/address/${transaction.to}`} className="font-mono text-xs sm:text-sm text-primary hover:underline break-all text-right">
                    {transaction.to}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">Contract Creation</span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                <span className="text-muted-foreground font-medium">Value:</span>
                <span className="font-mono font-semibold text-primary">
                  {ethers.formatEther(transaction.value)} ETH
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                <span className="text-muted-foreground font-medium">Gas Price:</span>
                <span className="font-mono">
                  {transaction.gasPrice ? ethers.formatUnits(transaction.gasPrice, "gwei") : "N/A"} Gwei
                </span>
              </div>
              {receipt && (
                <>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                    <span className="text-muted-foreground font-medium">Gas Used:</span>
                    <span className="font-mono">{receipt.gasUsed.toString()}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                    <span className="text-muted-foreground font-medium">Confirmations:</span>
                    <span className="font-semibold">{receipt.confirmations || 0}</span>
                  </div>
                </>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b gap-2">
                <span className="text-muted-foreground font-medium">Nonce:</span>
                <span className="font-mono">{transaction.nonce}</span>
              </div>
              {transaction.data && transaction.data !== "0x" && (
                <div className="py-2 border-b">
                  <span className="text-muted-foreground block mb-2">Input Data:</span>
                  <div className="bg-muted p-3 rounded-md font-mono text-xs break-all">
                    {transaction.data}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TransactionDetails;
