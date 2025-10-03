import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, Blocks } from "lucide-react";
import { useEffect, useState } from "react";
import { useNetwork } from "@/contexts/NetworkContext";

const chains = [
  { id: "bitcoin", name: "Bitcoin (BTC)" },
  { id: "ethereum", name: "Ethereum (ETH)" },
  { id: "bsc", name: "BNB Chain (BNB)" },
  { id: "avalanche", name: "Avalanche (AVAX)" },
  { id: "polygon", name: "Polygon (MATIC)" },
  { id: "optimism", name: "Optimism L2 (ETH)" },
  { id: "arbitrum", name: "Arbitrum L2 (ETH)" },
  { id: "base", name: "Base L2 (ETH)" },
  { id: "soneium", name: "Soneium L2 (SONEIUM)" },
];

interface NavigationProps {
  showNetworkSelector?: boolean;
}

export const Navigation = ({ showNetworkSelector = true }: NavigationProps) => {
  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { selectedNetwork, setSelectedNetwork } = useNetwork();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme as "light" | "dark");
    
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="p-2 rounded-lg bg-primary/10">
              <Blocks className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">ChainExplorer</h1>
              <p className="text-xs text-muted-foreground">Multi-Chain Explorer</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {showNetworkSelector && (
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  {chains.map((chain) => (
                    <SelectItem key={chain.id} value={chain.id}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
