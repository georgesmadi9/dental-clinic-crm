"use client";

import { Progress } from "@/components/ui/progress";
import React, { useState } from "react";

const LoadingComponent = ({
  what,
  loading,
  speed = 50, // speed in ms, default to 50ms per increment
}: {
  what: string;
  loading: boolean;
  speed?: number;
}) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (loading) {
      setLoadingProgress(0);
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval!);
            return 100;
          }
          return prev + 2;
        });
      }, speed);
    } else {
      setLoadingProgress(100);
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, speed]);

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-12">
      <span className="text-lg font-medium text-gray-600 mb-2">
        Loading {what}...
      </span>
      <Progress className="w-64" value={loadingProgress} />
    </div>
  );
};

export default LoadingComponent;
