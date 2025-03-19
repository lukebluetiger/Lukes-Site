import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Tag from './Tag';
import githubIcon from '../assets/github.png';

const Project = () => {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`/api/Projects/${slug}`);
                setProject(response.data);
            } catch (err) {
                console.error('Error fetching the project:', err);
                setError('Failed to load the project details.');
            }
        };
        
        fetchProject();
    }, [slug]);
    
    if (error) {
        return (
            <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-red-900/30 text-red-200 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }
    
    if (!project) {
        return (
            <div className="min-h-screen bg-[#2B3B40]">
                <main className="container mx-auto px-4 py-16">
                    <div className="animate-pulse space-y-8">
                        <div className="h-64 bg-[#34E4EA]/10 rounded-lg"></div>
                        <div className="h-8 bg-[#34E4EA]/20 rounded w-3/4 mx-auto"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-[#34E4EA]/20 rounded"></div>
                            <div className="h-4 bg-[#34E4EA]/20 rounded w-5/6"></div>
                            <div className="h-4 bg-[#34E4EA]/20 rounded w-4/6"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // Parse features if it's a string
    const features = typeof project.features === 'string' 
        ? project.features.split(',') 
        : project.features || [];
    
    // Parse technologies if it's a string
    const technologies = typeof project.technologies === 'string'
        ? project.technologies.split(',')
        : project.technologies || [];
        
    // Format date if available
    const formattedDate = project.startDate 
        ? new Date(project.startDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        })
        : null;
    
    return (
        <div className="min-h-screen bg-[#2B3B40]">
            <article className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Back to projects link */}
                <div className="mb-8">
                    <Link to="/projects" className="text-[#34E4EA] hover:underline flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Projects
                    </Link>
                </div>
                
                {/* Project Header with Image */}
                <header className="mb-12">
                    {project.coverImage.url && (
                        <figure className="mb-12">
                            <img
                                src={project.coverImage.url}
                                alt={project.coverImage.alt || project.title}
                                className="w-full sticky top-0 object-cover max-h-[600px] rounded-lg"
                            />
                            {project.coverImageAlt && (
                                <figcaption className="text-center text-[#A4D8B4] mt-4 text-sm italic">
                                    {project.coverImageAlt}
                                </figcaption>
                            )}
                        </figure>
                    )}
                    
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#bdedbb] leading-tight">
                            {project.title}
                        </h1>
                        
                        {/* Project Meta */}
                        <div className="flex items-center justify-center text-[#A4D8B4] text-sm space-x-4 mb-6">
                            {project.status && (
                                <span className="px-3 py-1 bg-[#1f2a2d] rounded-full">
                                    Status: {project.status}
                                </span>
                            )}
                            {formattedDate && (
                                <span>Started: {formattedDate}</span>
                            )}
                        </div>
                        
                        {/* Project Links */}
                        <div className="flex justify-center gap-4">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-[#1f2a2d] hover:bg-[#1f2a2d]/80 text-[#A4D8B4] rounded-md transition-colors"
                                >
                                    <img
                                        src={githubIcon}
                                        alt="GitHub"
                                        className="w-5 h-5"
                                    />
                                    <span>Source Code</span>
                                </a>
                            )}
                            
                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-[#1f2a2d] hover:bg-[#1f2a2d]/80 text-[#A4D8B4] rounded-md transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span>Live Demo</span>
                                </a>
                            )}
                        </div>
                    </div>
                </header>
                
                {/* Project Summary */}
                <div className="mb-12">
                    <div className="text-xl text-[#A4D8B4] leading-relaxed mb-8">
                        {project.summary}
                    </div>
                    
                    {project.description && (
                        <div className="text-[#bdedbb] leading-relaxed space-y-4">
                            {project.description.split('\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Features Section */}
                {features.length > 0 && (
                    <section className="mb-12 bg-[#1f2a2d] rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-[#34E4EA] mb-6">Key Features</h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-[#34E4EA] font-bold text-lg">*</span>
                                    <span className="text-[#bdedbb]">{feature.trim()}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
                
                {/* Technologies Section - Moved from header to bottom */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-[#34E4EA] mb-6">Technologies</h2>
                    <div className="flex flex-wrap gap-2">
                        {technologies.map(tech => (
                            <Tag key={tech} name={tech} />
                        ))}
                    </div>
                </section>
            </article>
        </div>
    );
};

export default Project;