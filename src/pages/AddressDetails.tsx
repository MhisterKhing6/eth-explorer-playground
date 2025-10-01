import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ethers } from "ethers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Wallet, Search, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { MetricCard } from "@/components/MetricCard";

const AddressDetails = () => {
  const { address: paramAddress } = useParams();
  const [address, setAddress] = useState(paramAddress || "");
  const [balance, setBalance] = useState<string>("");
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState("");
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
      const provider = new ethers.JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/demo");
      const bal = await provider.getBalance(addr);
      const txCount = await provider.getTransactionCount(addr);
      
      setBalance(ethers.formatEther(bal));
      setTransactionCount(txCount);
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
  }, [paramAddress]);

  const handleSearch = () => {
    if (searchAddress.trim()) {
      fetchAddressData(searchAddress.trim());
    }
  };

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
                value={`${parseFloat(balance).toFixed(6)} ETH`}
                icon={Wallet}
                description={`~$${(parseFloat(balance) * 2247.82).toFixed(2)} USD`}
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
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    This address has made {transactionCount} transactions on the Ethereum network.
                  </p>
                  <p>
                    Note: Transaction history requires additional API calls. Use Alchemy SDK or Etherscan API
                    for complete transaction history.
                  </p>
                </div>
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
    </div>
  );
};

export default AddressDetails;
