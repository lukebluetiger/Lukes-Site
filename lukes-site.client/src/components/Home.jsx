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
            src='./images/zion.jpg' 
            alt="Zion National Park photograph" 
            className="w-full h-full object-cover object-bottom rounded-lg hidden sm:block" 
        />

        {/* Mobile image - hidden on medium screens and up */}
        <img 
            src='./images/zion-mobile.jpg' 
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
        
        {/* User Count Section */}
        
        <div className="flex-1 flex items-center justify-center mb-8">
            <UserCount />
        </div>
    </main>
</div>
    );
}

export default Home;