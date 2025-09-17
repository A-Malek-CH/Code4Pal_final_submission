"use client";

import { cn } from "@/lib/utils";
import type { ComponentPropsWithRef } from "react";
import { Upload, Zap } from "lucide-react";

type Props = ComponentPropsWithRef<"input">;

const CyberpunkFileSelector = (props: Props) => {
  return (
    <>
      <style jsx global>{`
        @keyframes neonGlow {
          0%,
          100% {
            box-shadow: 0 0 10px rgba(0, 247, 255, 0.3),
              inset 0 0 10px rgba(0, 247, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 20px rgba(0, 247, 255, 0.6),
              inset 0 0 20px rgba(0, 247, 255, 0.2);
          }
        }

        @keyframes dataFlow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>

      <div className="relative group">
        <input
          {...props}
          type="file"
          multiple
          className={cn(
            // File button styling
            "file:bg-gradient-to-r file:from-[#00f7ff] file:to-[#9600ff] file:text-black file:font-bold file:font-mono",
            "file:border-none file:rounded-lg file:rounded-tr-none file:rounded-br-none",
            "file:px-6 file:py-3 file:mr-4 file:transition-all file:duration-300",
            "file:hover:from-[#00f7ff] file:hover:to-[#ff00f7] file:hover:shadow-[0_0_15px_rgba(0,247,255,0.5)]",
            // Overall input styling
            "w-full bg-gray-900/50 border-2 border-[#00f7ff]/30 rounded-lg text-[#00f7ff] font-mono",
            "hover:border-[#00f7ff] hover:bg-gray-800/50 hover:cursor-pointer",
            "focus:outline-none focus:border-[#ff00f7] focus:shadow-[0_0_20px_rgba(255,0,247,0.3)]",
            "backdrop-blur-sm transition-all duration-300",
            "animate-[neonGlow_3s_ease-in-out_infinite]",
            props.className
          )}
        />

        {/* Cyberpunk decorative elements */}
        <div className="absolute top-0 right-0 p-3 pointer-events-none">
          <div className="flex items-center space-x-1">
            <Zap className="h-4 w-4 text-[#00f7ff] animate-pulse" />
            <Upload className="h-4 w-4 text-[#9600ff]" />
          </div>
        </div>

        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00f7ff]/20 via-[#9600ff]/20 to-[#ff00f7]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-[dataFlow_2s_linear_infinite] bg-[length:200%_100%]"></div>
      </div>
    </>
  );
};

export default CyberpunkFileSelector;
