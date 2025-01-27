import React from 'react';
import { Box } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Box className="w-6 h-6 text-purple-400" />
      <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
        Proodloop
      </span>
    </div>
  );
};

export default Logo;