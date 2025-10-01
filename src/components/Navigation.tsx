import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, Blocks } from "lucide-react";
import { useEffect, useState } from "react";

const chains = [
  { id: "ethereum", name: "Ethereum", rpc: "https://eth-mainnet.g.alchemy.com/v2/demo" },
  { id: "polygon", name: "Polygon", rpc: "https://polygon-mainnet.g.alchemy.com/v2/demo" },
  { id: "bsc", name: "BNB Chain", rpc: "https://bsc-dataseed.binance.org/" },
  { id: "arbitrum", name: "Arbitrum", rpc: "https://arb1.arbitrum.io/rpc" },
];

export const Navigation = () => {
  const location = useLocation();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [selectedChain, setSelectedChain] = useState("ethereum");

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
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
              <h1 className="text-xl font-bold">BlockScout</h1>
              <p className="text-xs text-muted-foreground">Multi-Chain Explorer</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Select value={selectedChain} onValueChange={setSelectedChain}>
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
