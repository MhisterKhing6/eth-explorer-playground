import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { getAlchemyInstance, getNativeCurrency, fetchTokenPrice } from "@/lib/alchemy";
import { useNetwork } from "@/contexts/NetworkContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Wallet, Search, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { MetricCard } from "@/components/MetricCard";
import { Footer } from "@/components/Footer";

const AddressDetails = () => {
  const { address: paramAddress } = useParams();
  const { selectedNetwork } = useNetwork();
  const [address, setAddress] = useState(paramAddress || "");
  const [balance, setBalance] = useState<string>("");
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
  const [txSearchQuery, setTxSearchQuery] = useState("");
  const [displayTxCount, setDisplayTxCount] = useState(20);
  const { toast } = useToast();

  const fetchAddressData = async (addr: string) => {
    if (!ethers.isAddress(addr)) {
      toast({
        title: "Invalid address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const alchemy = getAlchemyInstance(selectedNetwork);
      
      // Fetch current price and balance in parallel
      const [bal, txCount, priceStr] = await Promise.all([
        alchemy.core.getBalance(addr),
        alchemy.core.getTransactionCount(addr),
        fetchTokenPrice(selectedNetwork)
      ]);
      
      // Extract numeric price from string like "$2,247.82"
      const price = parseFloat(priceStr.replace(/[$,]/g, '')) || 0;
      setCurrentPrice(price);
      
      // Get transaction history with network-specific categories
      const getCategories = (network: string) => {
        // Networks that don't support "internal" category
        const noInternalSupport = ['bsc', 'optimism', 'arbitrum', 'base', 'soneium'];
        if (noInternalSupport.includes(network)) {
          return ["external", "erc20"];
        }
        return ["external", "internal", "erc20"];
      };
      
      const categories = getCategories(selectedNetwork);
      
      const transfers = await alchemy.core.getAssetTransfers({
        fromAddress: addr,
        category: categories,
        maxCount: 50,
        order: "desc"
      });
      
      const receivedTransfers = await alchemy.core.getAssetTransfers({
        toAddress: addr,
        category: categories,
        maxCount: 50,
        order: "desc"
      });
      
      const allTransfers = [...transfers.transfers, ...receivedTransfers.transfers]
        .sort((a, b) => (b.blockNum || 0) - (a.blockNum || 0));
      
      setBalance(ethers.formatEther(bal.toString()));
      setTransactionCount(txCount);
      setTransactions(allTransfers);
      setAddress(addr);
    } catch (error) {
      console.error("Error fetching address data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch address data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramAddress) {
      fetchAddressData(paramAddress);
    }
  }, [paramAddress, selectedNetwork]);

  const handleSearch = () => {
    if (searchAddress.trim()) {
      fetchAddressData(searchAddress.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation showNetworkSelector={false} />
      
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-primary/10">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Address Lookup</h1>
              <p className="text-muted-foreground">Check any Ethereum address balance</p>
            </div>
          </div>

          <Card className="max-w-2xl border-2 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Ethereum address (0x...)"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1 font-mono"
                />
                <Button onClick={handleSearch} size="lg">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium">Supported formats:</span> 0x742d35Cc6634C0532925a3b8D39C4E3C7b4dd4c2 • ENS domains (coming soon)
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading address data...</p>
          </div>
        ) : address && balance !== "" ? (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription className="font-mono text-xs sm:text-sm break-all">{address}</CardDescription>
              </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <MetricCard
                title="Balance"
                value={`${parseFloat(balance).toFixed(6)} ${getNativeCurrency(selectedNetwork)}`}
                icon={Wallet}
                description={currentPrice > 0 ? `~$${(parseFloat(balance) * currentPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD` : "Price loading..."}
              />
              <MetricCard
                title="Total Transactions"
                value={transactionCount.toLocaleString()}
                icon={Activity}
                description="Lifetime transaction count"
              />
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Showing {transactions.length} transactions (up to 100 total)</CardDescription>
                  </div>
                  <div className="w-full sm:w-auto">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search transactions..."
                        value={txSearchQuery}
                        onChange={(e) => setTxSearchQuery(e.target.value)}
                        className="w-full sm:w-64"
                      />
                      <Button variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Search by: Hash, Address, Amount
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {transactions
                        .filter((tx) => {
                          if (!txSearchQuery) return true;
                          const hash = tx.hash?.toLowerCase() || '';
                          const from = tx.from?.toLowerCase() || '';
                          const to = tx.to?.toLowerCase() || '';
                          const value = tx.value?.toString() || '';
                          const query = txSearchQuery.toLowerCase();
                          return hash.includes(query) || from.includes(query) || to.includes(query) || value.includes(query);
                        })
                        .slice(0, displayTxCount)
                        .map((tx, index) => (
                          <Link
                            key={index}
                            to={`/tx/${tx.hash}`}
                            className="block p-4 rounded-lg border hover:bg-accent transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-mono text-sm text-primary mb-1">
                                  {tx.hash?.slice(0, 20)}...
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {tx.from === address.toLowerCase() ? 'Sent to' : 'Received from'}: {' '}
                                  {tx.from === address.toLowerCase() 
                                    ? tx.to?.slice(0, 10) + '...' 
                                    : tx.from?.slice(0, 10) + '...'}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {tx.value ? `${parseFloat(tx.value).toFixed(4)} ${tx.asset || getNativeCurrency(selectedNetwork)}` : 'N/A'}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Block #{tx.blockNum}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))
                      }
                    </div>
                    {displayTxCount < transactions.filter((tx) => {
                      if (!txSearchQuery) return true;
                      const hash = tx.hash?.toLowerCase() || '';
                      const from = tx.from?.toLowerCase() || '';
                      const to = tx.to?.toLowerCase() || '';
                      const value = tx.value?.toString() || '';
                      const query = txSearchQuery.toLowerCase();
                      return hash.includes(query) || from.includes(query) || to.includes(query) || value.includes(query);
                    }).length && (
                      <div className="mt-4 text-center">
                        <Button 
                          variant="outline" 
                          onClick={() => setDisplayTxCount(prev => prev + 20)}
                        >
                          Load More ({Math.min(20, transactions.filter((tx) => {
                            if (!txSearchQuery) return true;
                            const hash = tx.hash?.toLowerCase() || '';
                            const from = tx.from?.toLowerCase() || '';
                            const to = tx.to?.toLowerCase() || '';
                            const value = tx.value?.toString() || '';
                            const query = txSearchQuery.toLowerCase();
                            return hash.includes(query) || from.includes(query) || to.includes(query) || value.includes(query);
                          }).length - displayTxCount)} more)
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No transaction history found for this address
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Search for an Address</CardTitle>
              <CardDescription>
                Enter an Ethereum address above to view its balance and transaction count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>You can look up:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Any Ethereum wallet address</li>
                  <li>Smart contract addresses</li>
                  <li>ENS names (coming soon)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AddressDetails;
