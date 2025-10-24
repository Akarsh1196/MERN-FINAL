import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiArrowLeft } from 'react-icons/hi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-8xl mb-6"
        >
          🔍
        </motion.div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center space-x-2"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          
          <Link
            to="/"
            className="btn-primary flex items-center space-x-2"
          >
            <HiHome className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
