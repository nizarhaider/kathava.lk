'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="py-16 border-t border-border bg-background">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="max-w-xs">
                        <Link href="/" className="text-2xl font-black font-outfit mb-6 block">
                            Kathava<span className="text-accent">.lk</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            The future of business communication in Sri Lanka. Scalable, multilingual AI voice agents.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 font-outfit uppercase tracking-wider text-xs text-slate-400">Product</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="#features" className="hover:text-accent transition-colors">Features</Link></li>
                            <li><Link href="#how-it-works" className="hover:text-accent transition-colors">How it works</Link></li>
                            <li><Link href="#demo" className="hover:text-accent transition-colors">Live Demo</Link></li>
                            <li><Link href="#benefits" className="hover:text-accent transition-colors">Savings</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 font-outfit uppercase tracking-wider text-xs text-slate-400">Company</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link href="#" className="hover:text-accent transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 font-outfit uppercase tracking-wider text-xs text-slate-400">Talk to Sam</h4>
                        <a href="tel:+94774482914" className="text-xl font-black text-accent block mb-2 hover:translate-x-1 transition-transform">
                            +94 77 448 2914
                        </a>
                        <p className="text-muted-foreground text-xs leading-5">
                            Sinhala Support Available Now.<br />Tamil & English Coming Soon.
                        </p>
                    </div>
                </div>

                <div className="pt-8 border-t border-border text-center text-muted-foreground text-xs font-medium">
                    © {new Date().getFullYear()} Kathava.lk. All rights reserved. Built for Sri Lankan Businesses.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
