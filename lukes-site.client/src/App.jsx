import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About'
import Blog from './components/Blog';
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
        <Route path="/blog/tag/:tag" element={<BlogPosts />} />
        <Route path="/blog/post/:slug" element={<BlogPost />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;