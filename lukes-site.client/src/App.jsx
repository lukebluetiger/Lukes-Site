import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About'
import Blog from './components/Blog';
import Project from './components/Project';
import Projects from './components/Projects';
import BlogPost from './components/BlogPost'; // This will be the component to show a single post
import BlogPosts from './components/BlogPosts'; // This will be the component to index blog posts
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={(<Layout />)}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<Project />} />
        <Route path="/projects/tag/:tag" element={<Projects />} />
        <Route path="/blog/tag/:tag" element={<BlogPosts />} />
        <Route path="/blog/post/:slug" element={<BlogPost />} />
        <Route path='*' element={      <div className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-900/30 text-red-200 p-4 rounded-lg">
          404 - Not Found
        </div>
      </div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;