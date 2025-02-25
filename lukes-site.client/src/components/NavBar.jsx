import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="bg-[#1f2a2d] px-4 py-3">
            <div className="flex items-center justify-between">
                {/* Logo and Title */}
                <div className="flex items-center gap-4">
                    <Link to="/">
                        <img
                            src="/img.jpg"
                            alt="logo"
                            className="w-10 h-10 [image-rendering:pixelated]"
                        />
                    </Link>
                    <Link to="/" className="text-[#34E4EA] no-underline">
                        lukebluetiger-dev
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center gap-4">
                    <nav className="flex items-center gap-4 text-[#d3feff]">
                        <Link to="/" className="hover:italic no-underline">home</Link>
                        <span>|</span>
                        <Link to="/about" className="hover:italic no-underline">about</Link>
                        <span>|</span>
                        <Link to="/projects" className="hover:italic no-underline">projects</Link>
                        <span>|</span>
                        <Link to="/blog" className="hover:italic no-underline">blog</Link>
                    </nav>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden text-[#d3feff]"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {/* Mobile Navigation */}
            {isMenuOpen && (
                <nav className="items-center text-center text-xl lg:hidden mt-4 space-y-2 text-[#d3feff]">
                    <Link
                        to="/"
                        className="block py-2 hover:italic hover:bg-[#161f21] transition-colors duration-200 no-underline"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        home
                    </Link>
                    <Link
                        to="/about"
                        className="block py-2 hover:italic hover:bg-[#161f21] transition-colors duration-200 no-underline"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        about
                    </Link>
                    <Link
                        to="/projects"
                        className="block py-2 hover:italic hover:bg-[#161f21] transition-colors duration-200 no-underline"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        projects
                    </Link>
                    <Link
                        to="/blog"
                        className="block py-2 hover:italic hover:bg-[#161f21] transition-colors duration-200 no-underline"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        blog
                    </Link>
                </nav>
            )}
        </div>
    );
}

export default NavBar;