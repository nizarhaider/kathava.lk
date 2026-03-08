'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Settings, Database, Rocket } from 'lucide-react';

const timelineSteps = [
    {
        id: "01",
        title: "Request Your Number",
        desc: "We provide your business with a local +94 voice and WhatsApp number, or port your existing SLT/Mobitel line.",
        icon: <MessageSquare className="text-white" />,
        side: "left"
    },
    {
        id: "02",
        title: "Persona Engineering",
        desc: "Sam is trained on your specific business rules, documents, and FAQs. We define her tone and personality.",
        icon: <Settings className="text-white" />,
        side: "right"
    },
    {
        id: "03",
        title: "Tool Integration",
        desc: "Hook Sam up to your Shopify inventory, Zendesk CRM, or custom internal SQL databases via our secure APIs.",
        icon: <Database className="text-white" />,
        side: "left"
    },
    {
        id: "04",
        title: "Go Live & Scale",
        desc: "Start handling thousands of concurrent calls. Monitor transcripts and analytics live from your dashboard.",
        icon: <Rocket className="text-white" />,
        side: "right"
    }
];

const Steps = () => {
    return (
        <section id="how-it-works" className="py-32 bg-white dark:bg-slate-950 overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 font-outfit tracking-tighter">
                        Get Started <span className="text-blue-600">Today</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        From setup to your first AI-handled call in under 48 hours. Here's how we transform your customer experience.
                    </p>
                </div>

                <div className="relative">
                    {/* Central Vertical Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800 hidden lg:block -translate-x-1/2"></div>

                    <div className="space-y-12 lg:space-y-32">
                        {timelineSteps.map((step, index) => (
                            <div key={index} className={`flex flex-col lg:flex-row items-center ${step.side === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                                {/* Content */}
                                <motion.div
                                    initial={{ opacity: 0, x: step.side === 'left' ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className={`w-full lg:w-1/2 px-4 md:px-12 text-center ${step.side === 'left' ? 'lg:text-right' : 'lg:text-left'}`}
                                >
                                    <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black tracking-widest uppercase mb-4">
                                        Step {step.id}
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-4 font-outfit dark:text-white uppercase tracking-tight">{step.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                                        {step.desc}
                                    </p>
                                </motion.div>

                                {/* Vertical Center Point */}
                                <div className="relative z-10 flex items-center justify-center my-6 lg:my-0">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 bg-blue-600 rounded-2xl sm:rounded-3xl rotate-12 flex items-center justify-center shadow-xl shadow-blue-500/30"
                                    >
                                        <div className="-rotate-12 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 flex items-center justify-center">
                                            {step.icon}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Empty Space for LG */}
                                <div className="hidden lg:block w-1/2 px-12"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Steps;
