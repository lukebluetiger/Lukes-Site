import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
const Tag = ({ name, isActive }) => {
  const location = useLocation();
  const basePath = location.pathname.includes('/project') ? '/project/tag/' : '/blog/tag/';

  return (
    <Link
      to={`${basePath}${encodeURIComponent(name)}`}
      className={`px-3 py-1 text-sm rounded-full cursor-pointer transition-colors ${
        isActive 
          ? 'bg-cyan-600/60 text-cyan-100' 
          : 'bg-cyan-800/40 text-cyan-200 hover:bg-cyan-700/50'
      }`}
    >
      {name}
    </Link>
  );
};

Tag.propTypes = {
  name: PropTypes.string.isRequired,
  isActive: PropTypes.bool
};

Tag.defaultProps = {
  isActive: false
};

export default Tag;