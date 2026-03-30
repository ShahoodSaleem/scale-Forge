"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './InitialLoader.css';

const InitialLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide loader after a delay or when the page is fully loaded
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
          }}
          className="loader-container"
        >
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader;
