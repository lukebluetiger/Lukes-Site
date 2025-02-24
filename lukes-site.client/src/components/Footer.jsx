import React from 'react';
import githubIcon from '../assets/github.png'; // import the GitHub image
function Footer() {
    return (
        <footer className="bg-[#1f2a2d] text-white w-full bottom-0 py-3 text-center">
            <a
                href="https://github.com/lukebluetiger"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:opacity-70 transition-opacity"
            >
                <img
                    src={githubIcon}
                    alt="GitHub"
                    className="w-6 h-6 mx-auto"
                />
            </a>
            <h5 className="font-light my-2">
                © Copyright 2025
            </h5>
        </footer>
    );
}

export default Footer;