import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Tag from './Tag'; 
import axios from 'axios';

const BlogPostCard = ({ post, onTagClick }) => (
  <li className="group relative">
    <Link 
      to={`/blog/post/${post.slug}`}
      className="block"
    >
      <div className="absolute inset-0 -mx-8 rounded-xl group-hover:bg-cyan-950/50 transition-colors duration-200" />
      
      <div className="relative px-8 py-6">
        <div className="space-y-2 px-4">
          <h2 className="text-2xl font-semibold text-cyan-100 group-hover:text-cyan-300 transition-colors">
            {post.title}
          </h2>
          
          <p className="text-lg text-cyan-200/80">
            {post.summary}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <span className="text-cyan-300/70 text-sm">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span 
                  key={tag}
                  onClick={(e) => {
                    e.preventDefault();
                    onTagClick(tag);
                  }}
                  className="px-3 py-1 text-sm bg-cyan-800/40 text-cyan-200 rounded-full hover:bg-cyan-700/50 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  </li>
);

BlogPostCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    coverImage: PropTypes.shape({
      url: PropTypes.string,
      alt: PropTypes.string
    })
  }).isRequired,
  onTagClick: PropTypes.func.isRequired
};

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { tag } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5062/api/BlogPosts');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts if a tag is selected
  const filteredPosts = tag 
    ? posts.filter(post => post.tags.includes(tag))
    : posts;

  // Get unique tags from all posts
  const allTags = [...new Set(posts.flatMap(post => post.tags))];

  const handleTagClick = (selectedTag) => {
    navigate(`/blog/tag/${selectedTag}`);
  };

  if (loading) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-cyan-900/30 rounded w-1/4"></div>
          <div className="h-32 bg-cyan-900/30 rounded"></div>
          <div className="h-32 bg-cyan-900/30 rounded"></div>
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
    <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-cyan-100">
            {tag ? `Posts tagged "${tag}"` : 'Blog'}
          </h1>
          {tag && (
            <Link 
              to="/blog" 
              className="px-4 py-2 text-cyan-200 hover:text-cyan-300 transition-colors"
            >
              View All Posts
            </Link>
          )}
        </div>

        {/* Tags Navigation */}
        <div className="flex flex-wrap gap-2 py-4">
       {allTags.map(tagName => (
         <Tag 
           key={tagName} 
           name={tagName} 
           isActive={tag === tagName} 
         />
       ))}
     </div>

        <ul className="space-y-6">
          {filteredPosts.map(post => (
            <BlogPostCard 
              key={post.slug} 
              post={post} 
              onTagClick={handleTagClick}
            />
          ))}
        </ul>

        {filteredPosts.length === 0 && (
          <p className="text-cyan-200 text-lg">
            No posts found {tag ? `with tag "${tag}"` : ''}.
          </p>
        )}
      </div>
    </main>
  );
};

export default BlogPosts;