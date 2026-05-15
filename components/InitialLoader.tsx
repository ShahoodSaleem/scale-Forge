"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './InitialLoader.css';

const InitialLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide loader after a delay or when the page is fully loaded
    const timeoutDuration = process.env.NODE_ENV === 'development' ? 500 : 3000;
    const timeout = setTimeout(() => {
      setLoading(false);
      (window as any).hasLoaderFinished = true;
      window.dispatchEvent(new Event('loaderFinished'));
    }, timeoutDuration);

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
          <div className="loader-wrapper">
            <div className="loader">
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
            </div>
            <div className="loader loader--reflect">
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoader;
