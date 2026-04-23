import React, { createContext, useState, useEffect } from 'react';

export const PointContext = createContext();

export const PointProvider = ({ children }) => {
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('userPoints');
    return savedPoints ? parseInt(savedPoints) : 0;
  });

  useEffect(() => {
    localStorage.setItem('userPoints', points);
  }, [points]);

  const addPoints = (amount) => {
    setPoints(prev => prev + amount);
  };

  return (
    <PointContext.Provider value={{ points, addPoints }}>
      {children}
    </PointContext.Provider>
  );
};