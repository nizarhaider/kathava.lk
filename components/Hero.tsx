'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    return (
        <section className="pt-40 pb-20 text-center bg-[radial-gradient(circle_at_top_center,rgba(59,130,246,0.05)_0%,transparent_70%)]">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl max-w-4xl mx-auto mb-6 leading-[1.1] tracking-tight font-outfit font-bold px-2">
                        Voice Agents That Help You <br />
                        <span className="gradient-text">Scale Conversations</span>
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed px-4">
                        Give your business a voice (literally). Kathava provides premium AI voice agents in Sinhala, Tamil, and English for Sri Lankan businesses.
                    </p>

                    <div className="flex flex-wrap gap-6 sm:gap-4 justify-center items-center mb-12 md:mb-16 bg-slate-500/5 py-6 px-10 rounded-[2rem] w-fit mx-auto border border-white/5">
                        <div className="text-center min-w-[100px]">
                            <div className="text-xl sm:text-2xl font-extrabold">10,000+</div>
                            <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Concurrent Calls</div>
                        </div>
                        <div className="hidden md:block w-px h-10 bg-border mx-4"></div>
                        <div className="text-center min-w-[100px]">
                            <div className="text-xl sm:text-2xl font-extrabold">99.9%</div>
                            <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Adherence</div>
                        </div>
                        <div className="hidden md:block w-px h-10 bg-border mx-4"></div>
                        <div className="text-center min-w-[100px]">
                            <div className="text-xl sm:text-2xl font-extrabold">3+</div>
                            <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold">Native Languages</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
