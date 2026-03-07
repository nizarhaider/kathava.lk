'use client';

import React from 'react';
import { ShoppingCart, ShieldCheck, Headphones, Globe2, Truck, Calendar, CreditCard, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: <ShoppingCart size={32} />,
        title: "E-commerce & Retail",
        description: "Sam automatically checks your Shopify or Magento backend to answer 'Is this in stock?' or 'What's the price of a Samsung S24?' instantly over a phone call.",
        details: ["Real-time inventory lookup", "Product recommendations", "Order placement via voice"]
    },
    {
        icon: <Truck size={32} />,
        title: "Logistics & Delivery",
        description: "Customers call to track their parcels. Sam identifies them, pulls data from your courier management system, and provides precise delivery ETAs without human intervention.",
        details: ["Automated tracking updates", "Address verification", "Delivery rescheduling"]
    },
    {
        icon: <ShieldCheck size={32} />,
        title: "Banking & Verification",
        description: "Securely verify customer identity using phone numbers and OTP/ID verification. Sam can then provide balance updates or lock credit cards upon request.",
        details: ["Secure identity verification", "Balance inquiries", "Fraud reporting automation"]
    },
    {
        icon: <Calendar size={32} />,
        title: "Healthcare & Appointments",
        description: "Sam acts as a medical receptionist, booking appointments based on doctor availability and sending confirmation messages via WhatsApp automatically.",
        details: ["Smart appointment booking", "Automated lab result delivery", "Symptom recording"]
    },
    {
        icon: <Globe2 size={32} />,
        title: "Trilingual Tech",
        description: "Sam doesn't just translate; she understands local Sri Lankan accents and dialects in Sinhala, Tamil, and English, ensuring a natural conversation every time.",
        details: ["Dialect recognition", "Natural accent synthesis", "Language switching mid-call"]
    },
    {
        icon: <CreditCard size={32} />,
        title: "Utility & Bill Payments",
        description: "Perfect for Telcos and Utility companies. Sam verifies meter readings and process outstanding balances securely over the phone.",
        details: ["Bill amount inquiry", "Payment confirmation", "Connection status check"]
    }
];

const Features = () => {
    return (
        <section id="features" className="bg-slate-50 dark:bg-slate-900/50 py-32">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 font-outfit tracking-tight">
                        Industry <span className="text-blue-600">Use Cases</span>
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Sam isn't just a chatbot; she is a specialized employee tailored to your specific industry needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="group bg-white dark:bg-slate-950 p-8 rounded-[2rem] border border-slate-200 dark:border-white/5 hover:border-blue-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] transition-all duration-500"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="text-blue-600 mb-8 bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4 font-outfit dark:text-white">{feature.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                                {feature.description}
                            </p>

                            <div className="space-y-3">
                                {feature.details.map((detail, dIndex) => (
                                    <div key={dIndex} className="flex items-center gap-2 text-[13px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
                                        <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                                        {detail}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
