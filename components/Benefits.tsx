'use client';

import React from 'react';
import { Check, X, TrendingDown, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Benefits = () => {
    return (
        <section id="benefits" className="bg-slate-950 text-white py-24 overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-20 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full z-0"></div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6 font-outfit relative z-10"
                    >
                        Human Efficiency, <span className="text-accent">AI Economy</span>
                    </motion.h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed relative z-10">
                        Traditional call centers are expensive and hard to scale. Kathava's voice agents provide 24/7 coverage at a fraction of the cost.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
                    {/* Manual Agent Card */}
                    <div className="bg-white/5 border border-white/10 p-6 sm:p-10 rounded-[2.5rem] backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-6 sm:mb-8">
                            <Users size={20} className="text-slate-400" />
                            <h3 className="text-lg sm:text-xl font-bold font-outfit uppercase tracking-tight">Manual Call Center</h3>
                        </div>

                        <div className="mb-8 sm:mb-10">
                            <div className="text-3xl sm:text-4xl font-extrabold mb-1">LKR 65k+</div>
                            <p className="text-slate-500 text-xs sm:text-sm tracking-tight">Per agent/month (Avg. Sri Lanka)</p>
                        </div>

                        <ul className="space-y-3 sm:space-y-4">
                            {[
                                "Costly training & high turnover rates",
                                "Limited to 8-hour shifts",
                                "Wait times during peak hours",
                                "Infrastructure & management overhead"
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
                                    <X size={16} className="text-red-400 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* AI agent Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-white p-7 sm:p-10 rounded-[2.5rem] text-slate-900 shadow-[0_40px_100px_rgba(59,130,246,0.2)] relative"
                    >
                        <div className="absolute -top-3 -right-3 bg-accent text-white px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em]">RECOMMENDED</div>
                        <div className="flex items-center gap-3 mb-8 sm:mb-10">
                            <TrendingDown size={28} className="text-accent" />
                            <h3 className="text-xl sm:text-2xl font-black font-outfit uppercase tracking-tighter">Sam AI Voice Agent</h3>
                        </div>

                        <div className="mb-6 sm:mb-8">
                            <div className="text-5xl sm:text-7xl font-black text-accent mb-1 font-outfit tracking-tighter">90%</div>
                            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Lower Operational Costs</p>
                        </div>

                        <ul className="space-y-4 sm:space-y-5 mb-8 sm:mb-10">
                            {[
                                "No training or hiring costs",
                                "24/7/365 availability",
                                "Zero wait times - Infinite scaling",
                                "Multilingual Native Support"
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 font-bold text-sm sm:text-base tracking-tight leading-tight">
                                    <Check size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <button className="btn btn-primary w-full text-base sm:text-lg py-4 shadow-xl shadow-blue-100 font-black uppercase tracking-widest">
                            Start Saving Now
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Benefits;
