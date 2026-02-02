"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "cyan" | "magenta";
    size?: "default" | "sm" | "lg";
    children: React.ReactNode;
}

export function NeonButton({ children, className, variant = "cyan", size = "default", ...props }: ButtonProps) {
    const colorClass = variant === "cyan"
        ? "border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 shadow-[0_0_10px_rgba(0,243,255,0.3)] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]"
        : "border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10 shadow-[0_0_10px_rgba(255,0,255,0.3)] hover:shadow-[0_0_20px_rgba(255,0,255,0.6)]";

    const sizeClass = {
        default: "px-6 py-2",
        sm: "px-3 py-1 text-xs",
        lg: "px-8 py-3 text-lg"
    }[size];

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "rounded-md font-bold uppercase tracking-wider transition-all duration-300 border-2 bg-black/50 backdrop-blur-sm",
                colorClass,
                sizeClass,
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
}
