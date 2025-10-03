import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export const VisitorCounter = () => {
  const [visitors, setVisitors] = useState<number>(0);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const hostname = window.location.hostname;
        const key = hostname === 'localhost' ? 'chainexplorer-dev' : 'chainexplorer.app';
        const response = await fetch(`https://api.countapi.xyz/get/${key}/visits`);
        const data = await response.json();
        setVisitors(data.value || 0);
      } catch (error) {
        console.log('Failed to fetch visitor count:', error);
      }
    };

    fetchVisitorCount();
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Users className="h-4 w-4" />
      <span>{visitors.toLocaleString()} visitors</span>
    </div>
  );
};