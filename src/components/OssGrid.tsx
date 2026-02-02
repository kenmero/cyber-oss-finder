"use client";

import { GithubRepo, analyzeLicense } from "@/lib/github";
import { motion } from "framer-motion";
import { ExternalLink, Star, GitFork, Clock, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";
import { CyberCard } from "@/components/ui/card";

interface GridProps {
    repos: GithubRepo[];
}

export function OssGrid({ repos }: GridProps) {
    if (repos.length === 0) return null;

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, index) => {
                const licenseInfo = analyzeLicense(repo.license?.key);

                return (
                    <CyberCard
                        key={repo.id}
                        glow
                        className="flex flex-col h-full hover:bg-white/5 transition-colors group"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg text-white group-hover:text-neon-cyan transition-colors truncate w-3/4">
                                {repo.name}
                            </h3>
                            <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neon-cyan hover:text-white"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow font-mono">
                            {repo.description || "No description provided."}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-mono mb-6">
                            <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" /> {repo.stargazers_count}
                            </div>
                            <div className="flex items-center gap-1">
                                <GitFork className="w-3 h-3 text-blue-400" /> {repo.forks_count}
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                                <Clock className="w-3 h-3" /> {new Date(repo.updated_at).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Footer / License Status */}
                        <div className="mt-auto pt-4 border-t border-white/10">
                            <div className={cn("flex items-center gap-2 font-bold px-3 py-1.5 rounded-full text-xs w-fit border mb-2",
                                licenseInfo.status === 'allowed' ? "bg-neon-green/10 border-neon-green text-neon-green" :
                                    licenseInfo.status === 'review' ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan" :
                                        licenseInfo.status === 'forbidden' ? "bg-red-500/10 border-red-500 text-red-500" :
                                            "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                            )}>
                                {licenseInfo.status === 'allowed' && <ShieldCheck className="w-3 h-3" />}
                                {licenseInfo.status === 'review' && <ShieldAlert className="w-3 h-3" />}
                                {licenseInfo.status === 'forbidden' && <ShieldX className="w-3 h-3" />}
                                {licenseInfo.status === 'unknown' && <ShieldAlert className="w-3 h-3" />}
                                {licenseInfo.label}
                            </div>
                            <div className="text-[10px] text-gray-500 leading-tight">
                                {licenseInfo.description}
                            </div>
                        </div>
                    </CyberCard>
                );
            })}
        </div>
    );
}
