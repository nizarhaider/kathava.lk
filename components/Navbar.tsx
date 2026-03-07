'use client';

import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="glass fixed top-0 left-0 right-0 h-20 flex items-center z-[1000] border-b border-border">
      <div className="container mx-auto px-6 flex justify-between items-center w-full max-w-7xl">
        <Link href="/" className="text-2xl font-extrabold font-outfit tracking-tighter flex items-center">
          Kathava<span className="text-accent">.lk</span>
        </Link>

        <div className="flex gap-10 items-center font-medium text-sm">
          <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-accent transition-colors">How it works</Link>
          <Link href="#benefits" className="hover:text-accent transition-colors">Benefits</Link>
          <Link href="#demo" className="btn btn-primary text-sm py-2 px-5">
            Talk to Sam
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
