import React from 'react';
import UserCount from './UserCount';
import finger1 from '../assets/finger1.gif'
import finger2 from '../assets/finger2.gif'

function Home() {
    return (
        <div className="min-h-screen bg-[#2B3B40] flex flex-col">
            <main className="flex-1 w-full flex flex-col items-center justify-start text-[#bdedbb] font-['Windows-XP-Tahoma',Arial,sans-serif] text-2xl px-4">
                <div className="relative w-full h-64">
                    <img src='./images/zion.jpg' alt="milky way" className="w-full h-full object-cover object-bottom rounded-lg"  />
                    <p className="absolute bottom-0 left-0 w-full text-center text-xs text-[#bdedbb] italic opacity-75 bg-GREY bg-opacity-0 py-1">July 2023, Zion National Park</p>
                </div>
                <h1 className="flex items-center gap-4 font-light mt-8">
                    <img src={finger1} alt="finger pointing" className="h-8 w-8" />
                    welcome to my playground!
                    <img src={finger2} alt="finger pointing" className="h-8 w-8" />
                </h1>

                <div className="flex-1 flex items-center justify-center mt-6">
                    <UserCount />
                </div>
            </main>
        </div>
    );
}

export default Home;