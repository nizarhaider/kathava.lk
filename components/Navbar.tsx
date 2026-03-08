'use client';

import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="glass fixed top-0 left-0 right-0 h-20 flex items-center z-[1000] border-b border-border">
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center w-full max-w-7xl">
        <Link href="/" className="text-2xl font-extrabold font-outfit tracking-tighter flex items-center relative z-20">
          Kathava<span className="text-accent">.lk</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 items-center font-medium text-sm">
          <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-accent transition-colors">How it works</Link>
          <Link href="#benefits" className="hover:text-accent transition-colors">Benefits</Link>
          <Link href="#demo" className="btn btn-primary text-sm py-2 px-5">
            Talk to Sam
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-slate-400 relative z-20"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`w-full h-0.5 bg-current transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </div>
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-slate-950/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
          <Link href="#features" onClick={() => setIsOpen(false)} className="text-2xl font-bold font-outfit">Features</Link>
          <Link href="#how-it-works" onClick={() => setIsOpen(false)} className="text-2xl font-bold font-outfit">How it works</Link>
          <Link href="#benefits" onClick={() => setIsOpen(false)} className="text-2xl font-bold font-outfit">Benefits</Link>
          <Link href="#demo" onClick={() => setIsOpen(false)} className="btn btn-primary text-xl py-4 px-10">
            Talk to Sam
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
