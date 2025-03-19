import React from 'react';
import UserCount from './UserCount';
import finger1 from '../assets/finger1.gif'
import finger2 from '../assets/finger2.gif'

function Home() {
    return (
        <div className="min-h-screen bg-[#2B3B40] flex flex-col">
    <main className="flex-1 w-full flex flex-col items-center text-[#bdedbb] font-['Windows-XP-Tahoma',Arial,sans-serif] px-4">
        <div className="relative w-full h-64 mt-4">
        <img 
            src='/images/zion.jpg' 
            alt="Zion National Park photograph" 
            className="w-full h-full object-cover object-bottom rounded-lg hidden sm:block" 
        />

        {/* Mobile image - hidden on medium screens and up */}
        <img 
            src='/images/zion-mobile.jpg' 
            alt="Zion National Park photograph" 
            className="w-full h-full object-cover rounded-lg sm:hidden" 
        />
            <p className="absolute bottom-0 left-0 w-full text-center text-xs text-[#bdedbb] italic opacity-75 py-1">July 2023, Zion National Park</p>
        </div>
        
        <div className="mt-8 text-center">
            <h1 className="flex items-center justify-center gap-4 font-light text-2xl mb-6">
                <img src={finger1} alt="finger pointing" className="h-8 w-8" />
                welcome to my site!
                <img src={finger2} alt="finger pointing" className="h-8 w-8" />
            </h1>
        </div>
        
        <div className="space-y-6 text-[#A4D8B4] text-lg text-center leading-relaxed">
                <p>
                    Hey, my name is Luke. I am a Computer Science student at the University of Minnesota 
                    on track to graduate in May 2025. I love programming, right now my main interest is 
                    Web Development.
                </p>

                <p>
                    In 2023, I created a <a className="text-[#bdedbb] underline hover:text-[#bdedcd]" target="_blank" rel="noopener noreferrer" href="https://www.lukematuzaphotography.com">site</a> to showcase my photography I have taken on various trips 
                    throughout the last few years. That site was a simple site, and this year I attempted 
                    to make a more modern site utilizing modern web development concepts. This site could 
                    show my programming work, and I could add fun web game projects I have created.
                </p>

                <p>
                    I hope you enjoy the site!
                </p>
            </div>

        {/* User Count Section */}
        
        <div className="mt-8 mb-8 flex items-center justify-center font-light text-sm">
        <div className="flex items-center gap-2 text-[#A4D8B4] opacity-80 hover:opacity-100 transition-opacity duration-300">
            <UserCount />
        </div>
        </div>
    </main>
</div>
    );
}

export default Home;