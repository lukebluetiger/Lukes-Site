import React from 'react';
import { Link } from 'react-router-dom';
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
  
  export default ProjectCard;