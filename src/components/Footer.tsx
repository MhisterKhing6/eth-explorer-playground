import { Blocks, Github, Linkedin, Globe } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Blocks className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">ChainExplorer</h3>
              <p className="text-sm text-muted-foreground">Multi-chain blockchain explorer</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="flex justify-center md:justify-end gap-3 mb-3">
              <a href="https://github.com/MhisterKhing6" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-muted transition-colors">
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
              <a href="https://www.linkedin.com/in/botchway-kingsley-410097374" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-muted transition-colors">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
              <a href="https://mhisterkhing6.github.io/personalportfolio/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-muted transition-colors">
                <Globe className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Explore transactions, blocks, and addresses across multiple blockchain networks
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 <span className="font-semibold">KBEmpire</span>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};