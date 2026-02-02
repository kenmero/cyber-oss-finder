"use client";

import { useState } from "react";
import { SearchScanner } from "@/components/SearchScanner";
import { OssGrid } from "@/components/OssGrid";
import { OssTable } from "@/components/OssTable";
import { DictionaryManager } from "@/components/DictionaryManager";
import { searchRepositories } from "@/lib/github";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, Table as TableIcon, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "@/components/ui/button";

export default function Home() {
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [limit, setLimit] = useState(5);

  const { data: repos = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['repos', query, limit],
    queryFn: () => searchRepositories(query, limit),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });

  const handleSearch = (term: string) => {
    setQuery(term);
  };

  return (
    <main className="min-h-screen relative p-4 md:p-8 flex flex-col gap-8" >
      {/* Background Elements */}
      < div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-black z-[-1]" />
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 z-[-1]" />

      {/* Header section with Dictionary Manager */}
      {/* Header section with Dictionary Manager */}
      <header
        style={{ maxWidth: '1400px', margin: '0 auto' }}
        className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/10 pb-6 pt-6 w-full px-4 md:px-0"
      >
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            OSS FINDER
          </h1>
          <p className="text-neon-cyan/80 font-mono text-xs tracking-[0.2em] animate-pulse">
            // SYSTEM READY // WAITING FOR INPUT
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DictionaryManager />
        </div>
      </header >

      {/* Search & Controls */}
      < section
        style={{ maxWidth: '1400px', margin: '0 auto' }
        }
        className="flex flex-col gap-6 w-full relative z-10"
      >
        <SearchScanner onSearch={handleSearch} isLoading={isLoading} />

        {/* Controls Bar */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            {query && (
              <NeonButton
                variant="cyan"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
                className="h-8 text-[10px]"
              >
                <RefreshCw className={`w-3 h-3 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                REFRESH DATA
              </NeonButton>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Limit Selector */}
            <div className="relative group">
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="appearance-none bg-black/60 border border-neon-cyan/30 text-neon-cyan px-3 py-1.5 pr-8 rounded font-mono text-xs font-bold cursor-pointer hover:border-neon-cyan/60 hover:shadow-[0_0_10px_rgba(0,243,255,0.3)] transition-all focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.5)] [&>option]:bg-black [&>option]:text-white"
              >
                <option value={5}>LIMIT: 05</option>
                <option value={10}>LIMIT: 10</option>
                <option value={20}>LIMIT: 20</option>
                <option value={50}>LIMIT: 50</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex bg-black/40 p-1 rounded-md border border-white/10 backdrop-blur-sm">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded transition-all ${viewMode === 'table' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-gray-300'}`}
                title="Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-gray-300'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-neon-cyan/30 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-t-neon-cyan rounded-full animate-spin" />
              </div>
              <p className="font-mono text-neon-cyan animate-pulse tracking-widest text-sm">SCANNING REPOSITORIES...</p>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-500 gap-2 p-8 border border-red-500/30 bg-red-500/5 rounded-lg">
              <AlertCircle className="w-8 h-8" />
              <p className="font-mono font-bold">SYSTEM ERROR</p>
              <p className="text-xs font-mono opacity-70">TARGET UNREACHABLE</p>
            </div>
          ) : repos.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {viewMode === 'table' ? (
                  <OssTable repos={repos} />
                ) : (
                  <OssGrid repos={repos} />
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600 font-mono gap-4 border border-dashed border-gray-800 rounded-xl">
              <p className="tracking-widest text-xs">NO TARGETS ACQUIRED</p>
              {query && <p className="text-[10px] text-gray-700">Try adjusting your search parameters</p>}
            </div>
          )}
        </div>
      </section >
    </main >
  );
}
