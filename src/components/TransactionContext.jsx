import React, { createContext, useState, useEffect } from 'react';

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    // Mengambil data dari localStorage agar tidak hilang saat refresh
    const savedTrx = localStorage.getItem("rastTransactions");
    return savedTrx ? JSON.parse(savedTrx) : [];
  });

  useEffect(() => {
    localStorage.setItem("rastTransactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTrx) => {
    // Menambahkan transaksi baru ke posisi paling atas (indeks 0)
    setTransactions((prev) => [newTrx, ...prev]);
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};