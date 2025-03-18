import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CodeBlock from './CodeBlock';
import ReactMarkdown from 'react-markdown';
import Tag from './Tag';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/BlogPosts/${slug}`);
                setPost(response.data);
            } catch (err) {
                console.error('Error fetching the blog post:', err);
                setError('Failed to load the blog post.');
            }
        };

        fetchPost();
    }, [slug]);

    const renderContent = (block) => {
        switch (block.type) {
            case 'paragraph':
                return (
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown>{block.content}</ReactMarkdown>
                    </div>
                );

            case 'code':
                return (
                    <div className="w-full max-w-4xl mt-4 flex justify-center">
                        <CodeBlock
                            language={block.language || 'plaintext'}
                            code={block.content}
                            className="items-center bg-[#12232b] border border-[#232d31] max-auto rounded-md shadow-lg"
                        />
                    </div>
                );

            case 'image':
                return (
                    <figure className="my-12">
                        <img
                            src={block.url}
                            alt={block.alt}
                            className="rounded-lg shadow-xl w-full object-cover max-h-[600px]"
                        />
                        {block.caption && (
                            <figcaption className="text-center text-[#A4D8B4] mt-4 text-sm italic">
                                {block.caption}
                            </figcaption>
                        )}
                    </figure>
                );

                case 'heading':
                    {
                        // Make sure level is a valid number between 1-6
                        const level = block.level && typeof block.level === 'number' && block.level >= 1 && block.level <= 6 ? block.level : 3;
                        
                        const fontSize = level === 1 ? 'text-5xl' : 
                                         level === 2 ? 'text-4xl' : 
                                         level === 3 ? 'text-3xl' : 'text-2xl';
                        
                        switch(level) {
                            case 1: return <h1 className={`${fontSize} font-bold mb-4 text-[#bdedbb]`}>{block.content}</h1>;
                            case 2: return <h2 className={`${fontSize} font-bold mb-4 text-[#bdedbb]`}>{block.content}</h2>;
                            case 3: return <h3 className={`${fontSize} font-bold mb-4 text-[#bdedbb]`}>{block.content}</h3>;
                            case 4: return <h4 className={`${fontSize} font-bold mb-4 text-[#bdedbb]`}>{block.content}</h4>;
                            case 5: return <h5 className={`${fontSize} font-bold mb-4 text-[#bdedbb]`}>{block.content}</h5>;
                            case 6: return <h6 className={`${fontSize} font-bold mb-4 text-[#bdedbb]`}>{block.content}</h6>;
                            default: return <h3 className={`${fontSize} font-bold mb-4 text-[#bdedbb]`}>{block.content}</h3>;
                        }
                    }

            default:
                return <ReactMarkdown>{block.content}</ReactMarkdown>;
        }
    };

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
                            className="w-full rounded-lg shadow-xl object-cover max-h-[600px]"
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
                        <span>•</span>
                        <span>{post.metadata.readingTime}</span>
                    </div>
                </header>

                {/* Article Body */}
                <div className="post-content space-y-8 text-lg leading-relaxed">
                    {post.content.map((block, index) => (
                        <div key={index} className="mb-8">
                            {renderContent(block)}
                        </div>
                    ))}
                </div>

                {/* Tags Section */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-[#34E4EA]/20">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <Tag 
                            key={tag} 
                            name={tag}
                          />
                        ))}
                      </div>
                    </div>
                )}
            </article>
        </div>
    );
};

export default BlogPost;