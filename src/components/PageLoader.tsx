import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="text-2xl font-light text-white mb-4">
          Pure<span className="text-yellow-400">Ohana</span>Treasures
        </div>
        <div className="flex space-x-2">
          {[1, 2, 3].map((index) => (
            <div 
              key={index}
              className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"
              style={{ animationDelay: `${index * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageLoader;