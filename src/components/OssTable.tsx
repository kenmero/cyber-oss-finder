"use client";

import { GithubRepo, analyzeLicense } from "@/lib/github";
import { motion } from "framer-motion";
import { ExternalLink, ShieldCheck, ShieldAlert, ShieldX, Star, GitFork, Clock, Tag, Lock, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Assuming we have tooltip or use visible text

interface TableProps {
    repos: GithubRepo[];
}

export function OssTable({ repos }: TableProps) {
    if (repos.length === 0) return null;

    return (
        <div className="w-full space-y-4">
            {/* License Legend */}
            <div className="glass-panel p-3 rounded-lg flex flex-wrap gap-4 text-[10px] md:text-xs font-mono text-gray-400 border border-white/5">
                <div className="flex items-center gap-1.5">
                    <span className="text-neon-cyan/50">ACCESS KEY:</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-neon-green" />
                    <span>GRANTED (Free)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3 h-3 text-neon-cyan" />
                    <span>AUDIT REQ (Copyleft)</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <ShieldX className="w-3 h-3 text-red-500" />
                    <span>RESTRICTED (Non-Comm)</span>
                </div>
            </div>

            <div className="w-full overflow-x-auto glass-panel rounded-xl custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="border-b border-neon-cyan/20 text-neon-cyan/70 font-mono text-[10px] uppercase tracking-widest bg-black/20">
                            <th className="p-4 w-[20%]">IDENTITY</th>
                            <th className="p-4 w-[25%]">SYSTEM</th>
                            <th className="p-4 w-[15%]">USE CASE</th>
                            <th className="p-4 w-[10%]">LICENSE</th>
                            <th className="p-4 w-[10%]">ACCESS</th>
                            <th className="p-4 w-[10%]">CONSTRAINTS</th>
                            <th className="p-4 w-[10%]">VITAL SIGNS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {repos.map((repo, index) => {
                            const licenseInfo = analyzeLicense(repo.license?.key);

                            return (
                                <motion.tr
                                    key={repo.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    {/* IDENTITY */}
                                    <td className="p-4 align-top">
                                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="block max-w-[200px]">
                                            <div className="font-bold text-white text-sm group-hover:text-neon-cyan transition-colors truncate">
                                                {repo.name}
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-mono truncate">
                                                {repo.full_name}
                                            </div>
                                        </a>
                                    </td>

                                    {/* SYSTEM (Description) */}
                                    <td className="p-4 align-top">
                                        <p className="text-xs text-gray-400 leading-relaxed font-mono">
                                            {repo.description || "No system description available."}
                                        </p>
                                    </td>

                                    {/* USE CASE (Topics) */}
                                    <td className="p-4 align-top">
                                        <div className="flex flex-wrap gap-1.5">
                                            {repo.topics.slice(0, 3).map(topic => ( // Limit to 3 tags
                                                <span key={topic} className="px-1.5 py-0.5 rounded-sm bg-blue-500/10 text-blue-400 text-[10px] border border-blue-500/20 font-mono whitespace-nowrap">
                                                    #{topic}
                                                </span>
                                            ))}
                                            {repo.topics.length === 0 && (
                                                <span className="text-gray-600 text-[10px] font-mono">N/A</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* LICENSE */}
                                    <td className="p-4 align-top font-mono text-xs text-gray-300">
                                        {repo.license?.name || "None"}
                                    </td>

                                    {/* ACCESS */}
                                    <td className="p-4 align-top">
                                        <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold tracking-wider",
                                            licenseInfo.status === 'allowed' ? "bg-neon-green/10 border-neon-green text-neon-green" :
                                                licenseInfo.status === 'review' ? "bg-neon-cyan/10 border-neon-cyan text-neon-cyan" :
                                                    licenseInfo.status === 'forbidden' ? "bg-red-500/10 border-red-500 text-red-500" :
                                                        "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                                        )}>
                                            {licenseInfo.status === 'allowed' && <ShieldCheck className="w-3 h-3" />}
                                            {licenseInfo.status === 'review' && <ShieldAlert className="w-3 h-3" />}
                                            {licenseInfo.status === 'forbidden' && <ShieldX className="w-3 h-3" />}
                                            {licenseInfo.status === 'unknown' && <HelpCircle className="w-3 h-3" />}
                                            {licenseInfo.accessType}
                                        </div>
                                    </td>

                                    {/* CONSTRAINTS */}
                                    <td className="p-4 align-top">
                                        <div className="text-[10px] text-gray-400 font-mono leading-tight">
                                            {licenseInfo.status === 'review' && (
                                                <div className="flex items-center gap-1 text-neon-cyan">
                                                    <Lock className="w-3 h-3" /> Source Disclosure
                                                </div>
                                            )}
                                            {licenseInfo.status === 'forbidden' && (
                                                <div className="text-red-400">Non-Commercial Only</div>
                                            )}
                                            {licenseInfo.status === 'allowed' && (
                                                <div className="text-gray-600">Standard Attribution</div>
                                            )}
                                        </div>
                                    </td>

                                    {/* VITAL SIGNS */}
                                    <td className="p-4 align-top">
                                        <div className="flex flex-col gap-1.5 text-[10px] font-mono text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Star className="w-3 h-3 text-yellow-500" /> {repo.stargazers_count.toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <GitFork className="w-3 h-3 text-blue-400" /> {repo.forks_count.toLocaleString()}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3 text-gray-500" /> {new Date(repo.updated_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
