'use client';

import React, { useState } from 'react';
import { useGeminiLive, Language } from '@/hooks/useGeminiLive';
import { Mic, MicOff, Loader2, Volume2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AudioOrb from './visuals/AudioOrb';

const InteractiveDemo = () => {
    const [language, setLanguage] = useState<Language>('english');
    const { active, connecting, error, startSession, stopSession, inputNode, outputNode } = useGeminiLive(language);

    return (
        <div id="demo" className="max-w-5xl mx-auto rounded-[3rem] border border-white/10 bg-slate-950 shadow-[0_0_100px_rgba(59,130,246,0.1)] relative z-10 text-white overflow-hidden min-h-[650px] flex flex-col items-center justify-center p-8 md:p-16">

            {/* 3D Audio Orb Visualizer - Full Background Coverage */}
            <div className="absolute inset-0 z-0 opacity-60">
                <AudioOrb inputNode={inputNode} outputNode={outputNode} />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full flex flex-col items-center gap-12 max-w-2xl">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        Gemini Multimodal Live
                    </motion.div>

                    <h3 className="text-4xl md:text-5xl font-black font-outfit tracking-tight">
                        Talk to <span className="text-blue-500">Sam</span>
                    </h3>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md mx-auto">
                        Experience the future of local business automation. Sam understands Sri Lankan accents and can pitch our services in your preferred language.
                    </p>
                </div>

                {/* Language Selection */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {(['english', 'sinhala', 'tamil'] as Language[]).map((lang) => (
                        <button
                            key={lang}
                            onClick={() => !active && setLanguage(lang)}
                            disabled={active}
                            className={`group flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[11px] font-bold transition-all border uppercase tracking-wider ${language === lang
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20 scale-105'
                                    : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-white'
                                } ${active && language !== lang ? 'opacity-30' : 'opacity-100'}`}
                        >
                            <Globe size={14} className={language === lang ? 'text-white' : 'text-slate-600 group-hover:text-blue-400'} />
                            {lang}
                        </button>
                    ))}
                </div>

                {/* Main Interaction Area */}
                <div className="relative flex flex-col items-center gap-16 py-8">

                    <div className="relative">
                        {/* Pulsing rings when active */}
                        <AnimatePresence>
                            {active && (
                                <>
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: [1, 2], opacity: [0.3, 0] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute inset-0 rounded-full bg-blue-500 z-0"
                                    />
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: [1, 2.5], opacity: [0.2, 0] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                                        className="absolute inset-0 rounded-full bg-blue-400 z-0"
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={active ? stopSession : startSession}
                            disabled={connecting}
                            className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 backdrop-blur-md border border-white/20 ${active
                                    ? 'bg-red-500/90 shadow-[0_0_60px_rgba(239,68,68,0.4)]'
                                    : 'bg-blue-600/90 hover:scale-110 shadow-[0_0_60px_rgba(37,99,235,0.3)]'
                                }`}
                        >
                            {connecting ? (
                                <Loader2 className="animate-spin text-white" size={48} />
                            ) : active ? (
                                <MicOff className="text-white" size={48} />
                            ) : (
                                <Mic className="text-white" size={48} />
                            )}
                        </button>
                    </div>

                    <div className="text-center space-y-2">
                        <div className={`text-2xl md:text-3xl font-black font-outfit tracking-tight transition-all duration-500 ${active ? 'text-blue-400' : 'text-slate-300'}`}>
                            {connecting ? 'Initializing Core...' : active ? 'Sam is Listening' : 'Ready to Demo'}
                        </div>
                        {active && (
                            <div className="flex items-center justify-center gap-2 text-blue-500/60 font-black text-[10px] uppercase tracking-[0.2em]">
                                <Volume2 size={12} className="animate-bounce" />
                                Audio Neuro-Sync Active
                            </div>
                        )}
                    </div>
                </div>

                {/* Status Message / Error */}
                <AnimatePresence mode="wait">
                    {error ? (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="w-full p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium text-center"
                        >
                            <strong>Critical Error:</strong> {error}
                        </motion.div>
                    ) : !active && !connecting ? (
                        <motion.div
                            key="tip"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-center"
                        >
                            Recommended: Use headphones for best experience
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                {/* Footer Link */}
                <div className="pt-8 border-t border-white/5 w-full flex justify-center">
                    <a href="tel:+94774482914" className="flex items-center gap-4 group">
                        <span className="text-slate-500 text-[10px] uppercase font-black tracking-tighter">Demo Hotline:</span>
                        <span className="text-xl md:text-2xl font-black text-blue-400 group-hover:text-blue-300 transition-colors font-outfit">
                            +94 77 448 2914
                        </span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default InteractiveDemo;
