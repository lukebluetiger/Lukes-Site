import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CodeBlock from './CodeBlock';
import ReactMarkdown from 'react-markdown';
import Tag from './Tag';

const Project = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5062/api/Projects/${slug}`);
                setPost(response.data);
            } catch (err) {
                console.error('Error fetching the blog post:', err);
                setError('Failed to load the blog post.');
            }
        };

        fetchPost();
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

    if (!post) {
        return (
            <div className="min-h-screen bg-[#2B3B40]">
                <main className="container mx-auto px-4 py-16">
                    <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-6">
                            <div className="h-4 bg-[#34E4EA]/20 rounded"></div>
                            <div className="h-4 bg-[#34E4EA]/20 rounded w-3/4"></div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#2B3B40]">
            <article className="container mx-auto px-4 py-16 max-w-4xl">
            {post.coverImage && (
                    <figure className="mb-12">
                        <img
                            src={post.coverImage.url}
                            alt={post.coverImage.alt}
                            className="w-full sticky top-0 object-cover max-h-[600px]"
                        />
                        {post.coverImage.caption && (
                            <figcaption className="text-center text-[#A4D8B4] mt-4 text-sm italic">
                                {post.coverImage.caption}
                            </figcaption>
                        )}
                    </figure>
                )}
                {/* Header Section */}
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-bold mb-6 text-[#bdedbb] leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center text-[#A4D8B4] text-sm space-x-4">
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                </header>

                {/* Article Body */}
                <div className="post-content space-y-8 text-lg leading-relaxed">
                    {post.summary}
                </div>

                {/* Tags Section */}
                {post.technologies && post.technologies.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-[#34E4EA]/20">
                      <div className="flex flex-wrap gap-2">
                        {post.technologies?.map(tag => (
                          <Tag 
                            key={tag} 
                            name={tag} 
                            // If you prefer using onClick, you can adjust the Tag component accordingly
                          />
                        ))}
                      </div>
                    </div>
                )}
            </article>
        </div>
    );
};

export default Project;