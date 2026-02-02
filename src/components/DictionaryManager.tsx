"use client";

import { useState, useEffect } from "react";
import { getCustomDictionary, saveCustomDictionary } from "@/lib/github";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NeonButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Book, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DictionaryManager() {
    const [isOpen, setIsOpen] = useState(false);
    const [dictionary, setDictionary] = useState<Record<string, string>>({});
    const [newJp, setNewJp] = useState("");
    const [newEn, setNewEn] = useState("");

    useEffect(() => {
        if (isOpen) {
            setDictionary(getCustomDictionary());
        }
    }, [isOpen]);

    const handleAdd = () => {
        if (!newJp || !newEn) return;
        const updated = { ...dictionary, [newJp]: newEn };
        setDictionary(updated);
        saveCustomDictionary(updated);
        setNewJp("");
        setNewEn("");
    };

    const handleDelete = (key: string) => {
        const updated = { ...dictionary };
        delete updated[key];
        setDictionary(updated);
        saveCustomDictionary(updated);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 text-[10px] md:text-xs text-neon-cyan/70 hover:text-neon-cyan border border-neon-cyan/30 hover:border-neon-cyan/80 px-3 py-1.5 rounded-sm transition-all bg-black/40 backdrop-blur-sm">
                    <Book className="w-3 h-3" />
                    <span className="font-mono tracking-wider">DICTIONARY</span>
                </button>
            </DialogTrigger>
            <DialogContent
                style={{ backgroundColor: '#000000' }}
                className="fixed z-[1000] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] border border-neon-cyan text-white w-[90vw] max-w-md shadow-[0_0_50px_rgba(0,243,255,0.2)]"
            >
                <DialogHeader className="mb-6">
                    <DialogTitle className="text-neon-cyan font-mono tracking-widest text-sm flex items-center gap-2">
                        <Book className="w-4 h-4" />
                        QUERY TRANSLATION MATRIX
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <p className="text-xs text-gray-400 font-mono leading-relaxed">
                            Define mappings for auto-translation (Japanese → English).
                            <br />Stored locally in your browser.
                        </p>

                        {/* Input Area */}
                        <div className="flex flex-col gap-3 bg-neon-cyan/5 p-4 rounded-lg border border-neon-cyan/10">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono text-neon-cyan/80">SOURCE (JP)</label>
                                    <Input
                                        value={newJp}
                                        onChange={(e) => setNewJp(e.target.value)}
                                        placeholder="推論"
                                        className="bg-black/80 border-white/20 text-xs font-mono focus:border-neon-cyan h-9"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-mono text-neon-cyan/80">TARGET (EN)</label>
                                    <Input
                                        value={newEn}
                                        onChange={(e) => setNewEn(e.target.value)}
                                        placeholder="inference"
                                        className="bg-black/80 border-white/20 text-xs font-mono focus:border-neon-cyan h-9"
                                    />
                                </div>
                            </div>
                            <NeonButton
                                type="button"
                                variant="cyan"
                                onClick={handleAdd}
                                className="w-full flex items-center justify-center gap-2 h-9 text-xs"
                            >
                                <Plus className="w-3 h-3" />
                                <span>ADD MAPPING</span>
                            </NeonButton>
                        </div>
                    </div>

                    {/* List */}
                    <div className="border border-white/10 rounded-lg max-h-[250px] overflow-y-auto custom-scrollbar bg-black/40">
                        {Object.keys(dictionary).length === 0 ? (
                            <div className="text-center py-10 text-gray-600 font-mono text-xs">
                                <span className="opacity-50">NO CUSTOM MAPPINGS ACTIVE</span>
                            </div>
                        ) : (
                            <div className="p-2 space-y-1">
                                <AnimatePresence>
                                    {Object.entries(dictionary).map(([jp, en]) => (
                                        <motion.div
                                            key={jp}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 hover:border-neon-cyan/30 group transition-colors"
                                        >
                                            <div className="flex items-center gap-3 text-xs font-mono w-full">
                                                <div className="w-1/3 truncate text-white" title={jp}>{jp}</div>
                                                <span className="text-gray-600">→</span>
                                                <div className="w-1/3 truncate text-neon-cyan" title={en}>{en}</div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(jp)}
                                                className="text-gray-500 hover:text-red-500 transition-colors opacity-60 hover:opacity-100 p-1"
                                                title="Remove"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>

        </Dialog>
    );
}
