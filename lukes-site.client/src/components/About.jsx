import React from 'react';

function About() {
    return (
<div className="min-h-screen bg-[#2B3B40]">
    <main>
        <article className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-light text-[#bdedbb] mb-8">
                About
            </h1>

            <div className="space-y-6 text-[#A4D8B4] text-lg leading-relaxed">
                <p>
                    Hey, my name is Luke. I am a Computer Science student at the University of Minnesota 
                    on track to graduate in May 2025. I love programming, right now my main interest is 
                    Web Development.
                </p>

                <p>
                    In 2023, I created a site to showcase my photography I have taken on various trips 
                    throughout the last few years. That site was a simple site, and this year I attempted 
                    to make a more modern site utilizing modern web development concepts. This site could 
                    show my programming work, and I could add fun web game projects I have created.
                </p>

                <p>
                    I hope you enjoy the site!
                </p>

                <div className="pt-6">
                    <h2 className="text-2xl font-light text-[#bdedbb] mb-4">
                        Technologies I Use
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {["React", "C#", ".NET", "OCaml", "TypeScript", "SQL"].map(tech => (
                            <span 
                                key={tech} 
                                className="px-3 py-1 bg-[#34E4EA]/10 text-[#A4D8B4] rounded-full text-sm"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    </main>
</div>
    );
}

export default About;