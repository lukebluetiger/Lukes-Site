import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import githubIcon from '../assets/github.png';
import PropTypes from 'prop-types';
import Tag from './Tag';

const ProjectCard = ({ project }) => (
  <div className="group relative bg-cyan-950/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-900/20 mx-auto max-w-md">
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
      
      {/* Tech Stack - Now using Tag component */}
      <div className="flex flex-wrap gap-2 border-t border-b border-cyan-800/20 py-4 relative z-20">
        {project.technologies.map(tech => (
          <Tag
            key={tech}
            name={tech}
          />
        ))}
      </div>
      
      {/* Links */}
      <div className="flex gap-4 pt-2 relative z-20">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >                
            <img
                src={githubIcon}
                alt="GitHub"
                className="w-6 h-6 mx-auto"
            />
            <span>Repository</span>
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
  const { tag } = useParams(); // Get tag from URL params

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`/api/Projects`);
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

  // Filter projects based on selected technology from URL param
  const filteredProjects = tag
    ? projects.filter(project => project.technologies.includes(tag))
    : projects;

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
          <h1 className="text-4xl font-bold text-cyan-100">
            {tag ? `Projects using ${tag}` : 'Projects'}
          </h1>
          {tag && (
            <Link 
              to="/projects" 
              className="px-4 py-2 text-cyan-200 hover:text-cyan-300 transition-colors"
            >
              View All Projects
            </Link>
          )}
        </div>
        
        {/* Technology Filter using Tag component */}
        <div className="flex flex-wrap gap-2 py-4">
          <Link
            to="/projects"
            className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors ${
              !tag
                ? 'bg-cyan-600/60 text-cyan-100'
                : 'bg-cyan-800/40 text-cyan-200 hover:bg-cyan-700/50'
            }`}
          >
            All Projects
          </Link>
          {allTechnologies.map(tech => (
            <Tag
              key={tech}
              name={tech}
              isActive={tag === tech}
            />
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
            No projects found {tag ? `using ${tag}` : ''}.
          </p>
        )}
      </div>
    </main>
  );
}
ProjectCard.propTypes = {
  project: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string,
    coverImage: PropTypes.shape({
      url: PropTypes.string,
      alt: PropTypes.string,
    }),
    technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
    githubUrl: PropTypes.string,
    liveUrl: PropTypes.string,
  }).isRequired,
};

export default Projects;