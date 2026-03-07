'use client';

import React, { useState } from 'react';
import { useGeminiLive, Language } from '@/hooks/useGeminiLive';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InteractiveDemo = () => {
    const [language, setLanguage] = useState<Language>('english');
    const { active, connecting, error, startSession, stopSession } = useGeminiLive(language);

    return (
        <div id="demo" className="max-w-2xl mx-auto p-12 rounded-[2.5rem] border border-white/10 bg-slate-950 shadow-[0_0_80px_rgba(59,130,246,0.15)] relative z-10 text-white overflow-hidden">
            {/* Background Decorative Patterns */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/30 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10">
                <div className="mb-10 text-center">
                    <h3 className="text-3xl font-bold mb-3 font-outfit tracking-tight">Talk to Sam</h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                        Experience our voice technology live. Sam is here to show you how Kathava's AI voice agents can slash your costs and scale your business to new heights.
                    </p>
                </div>

                <div className="flex gap-3 justify-center mb-12">
                    {(['english', 'sinhala', 'tamil'] as Language[]).map((lang) => (
                        <button
                            key={lang}
                            onClick={() => !active && setLanguage(lang)}
                            disabled={active}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${language === lang
                                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                                } ${active && language !== lang ? 'opacity-30' : 'opacity-100'}`}
                        >
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-8">
                    <div className="relative">
                        <AnimatePresence>
                            {active && (
                                <>
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute inset-[-30px] rounded-full bg-blue-500 z-0"
                                    />
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }}
                                        transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                                        className="absolute inset-[-50px] rounded-full bg-blue-400 z-0"
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={active ? stopSession : startSession}
                            disabled={connecting}
                            className={`relative z-10 w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 ${active
                                ? 'bg-red-500 scale-110 shadow-[0_0_40px_rgba(239,68,68,0.4)]'
                                : 'bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-[0_0_40px_rgba(37,99,235,0.3)]'
                                }`}
                        >
                            {connecting ? (
                                <Loader2 className="animate-spin text-white" size={40} />
                            ) : active ? (
                                <MicOff className="text-white" size={40} />
                            ) : (
                                <Mic className="text-white" size={40} />
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <div className={`font-bold text-xl font-outfit transition-colors ${active ? 'text-blue-400' : 'text-white'}`}>
                            {connecting ? 'Establishing Connection...' : active ? 'Listening...' : 'Click to Speak'}
                        </div>
                        {active && (
                            <div className="text-xs text-slate-400 mt-2 tracking-widest uppercase font-bold animate-pulse">
                                Sam is responding in {language}
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-[13px] w-full text-center">
                            {error}
                        </div>
                    )}
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-xs mb-2">Or experience Sam via direct phone line</p>
                    <a href="tel:+94774482914" className="text-xl font-black text-blue-400 hover:text-blue-300 transition-colors tracking-tight">
                        +94 77 448 2914
                    </a>
                </div>
            </div>
        </div>
    );
};

export default InteractiveDemo;
