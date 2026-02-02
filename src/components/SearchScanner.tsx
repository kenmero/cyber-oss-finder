"use client";

import { motion } from "framer-motion";
import { Search, ScanLine } from "lucide-react";
import { useState } from "react";

interface SearchProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

export function SearchScanner({ onSearch, isLoading }: SearchProps) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) onSearch(query);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-2xl mx-auto mb-12"
        >
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-0 bg-neon-cyan/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative flex items-center bg-black/80 border-2 border-neon-cyan/50 rounded-full overflow-hidden shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                    <div className="pl-6 pr-4 text-neon-cyan flex items-center justify-center">
                        <Search className="w-6 h-6 animate-pulse" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="INITIATE_SYSTEM_SCAN [keyword]..."
                        className="w-full bg-transparent border-none py-3 md:py-4 px-2 md:px-4 text-white placeholder-gray-500 focus:ring-0 text-sm md:text-lg tracking-widest outline-none font-mono"
                        style={{ color: '#ffffff', opacity: 1 }} // Force visibility
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="pr-6 pl-4 text-neon-cyan hover:text-white transition-colors disabled:opacity-50"
                    >
                        {isLoading ? (
                            <ScanLine className="w-6 h-6 animate-spin" />
                        ) : (
                            <span className="text-sm font-bold">SCAN</span>
                        )}
                    </button>
                </div>

                {/* Scanning line animation */}
                {isLoading && (
                    <motion.div
                        initial={{ left: "0%" }}
                        animate={{ left: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="absolute bottom-0 top-0 w-1 bg-neon-cyan/50 blur-sm"
                    />
                )}
            </form>
        </motion.div>
    );
}
