import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Github, ExternalLink } from 'lucide-react';

const ProjectCard = ({ project }) => (
<div className="group relative bg-cyan-950/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/20">
    {/* Project Image */}
    <div className="aspect-video w-full bg-cyan-900/20 overflow-hidden">
      {project.coverImage && (
        <img 
          src={project.coverImage.url} 
          alt={project.coverImage.alt || project.title}
          className="w-full h-full object-cover"
        />
      )}
    </div>
    

      
    {/* Project Content */}
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-cyan-100">
        {project.title}
      </h2>

      <p className="text-cyan-200/80 line-clamp-2">
        {project.summary}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 border-t border-b border-cyan-800/20 py-4">
        {project.technologies.map(tech => (
          <span 
            key={tech}
            className="px-3 py-1 text-sm bg-cyan-800/40 text-cyan-200 rounded-full"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-4 pt-2">
        {project.githubUrl && (
          <a 
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <Github size={20} />
            <span>Repository</span>
          </a>
        )}
        {project.liveUrl && (
          <a 
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <ExternalLink size={20} />
            <span>Live Demo</span>
          </a>
        )}
      </div>
    </div>

    {/* Learn More Link - Overlays entire card */}
    <Link 
      to={`/projects/${project.slug}`}
      className="absolute inset-0 z-10 bg-cyan-950/0 hover:bg-cyan-950/10 transition-colors"
      aria-label={`Learn more about ${project.title}`}
    />

    
  </div>
  
  
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5062/api/Projects');
        setProjects(response.data);
      } catch (err) {
        setError('Failed to load projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Get unique technologies from all projects
  const allTechnologies = [...new Set(projects.flatMap(project => project.technologies))];

  // Filter projects based on selected technology
  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.technologies.includes(activeFilter));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-cyan-900/30 rounded-xl h-96" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-900/30 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );  
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-cyan-100">Projects</h1>
        </div>

        {/* Technology Filter */}
        <div className="flex flex-wrap gap-2 py-4">
          <span
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors ${
              activeFilter === 'all'
                ? 'bg-cyan-600/60 text-cyan-100'
                : 'bg-cyan-800/40 text-cyan-200 hover:bg-cyan-700/50'
            }`}
          >
            All Projects
          </span>
          {allTechnologies.map(tech => (
            <span
              key={tech}
              onClick={() => setActiveFilter(tech)}
              className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors ${
                activeFilter === tech
                  ? 'bg-cyan-600/60 text-cyan-100'
                  : 'bg-cyan-800/40 text-cyan-200 hover:bg-cyan-700/50'
              }`}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p className="text-cyan-200 text-lg">
            No projects found {activeFilter !== 'all' ? `using ${activeFilter}` : ''}.
          </p>
        )}
      </div>
    </main>
  );
};

export default Projects;