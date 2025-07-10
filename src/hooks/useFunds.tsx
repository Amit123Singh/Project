import React, { createContext, useContext, useEffect, useState } from 'react';
import { FundsContextType, Fund } from '../types';
import { getSelectedFunds, saveSelectedFunds } from '../utils/localStorage';

const FundsContext = createContext<FundsContextType | undefined>(undefined);

export const useFunds = () => {
  const context = useContext(FundsContext);
  if (!context) {
    throw new Error('useFunds must be used within a FundsProvider');
  }
  return context;
};

export const FundsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedFunds, setSelectedFunds] = useState<Fund[]>([]);
  const maxFunds = 4;

  useEffect(() => {
    const savedFunds = getSelectedFunds();
    if (savedFunds.length > 0) {
      setSelectedFunds(savedFunds);
    }
  }, []);

  useEffect(() => {
    saveSelectedFunds(selectedFunds);
  }, [selectedFunds]);

  const addFund = (fund: Fund) => {
    if (selectedFunds.length < maxFunds && !selectedFunds.find(f => f.schemeCode === fund.schemeCode)) {
      setSelectedFunds(prev => [...prev, fund]);
    }
  };

  const removeFund = (schemeCode: number) => {
    setSelectedFunds(prev => prev.filter(f => f.schemeCode !== schemeCode));
  };

  const clearFunds = () => {
    setSelectedFunds([]);
  };

  const value = {
    selectedFunds,
    addFund,
    removeFund,
    clearFunds,
    maxFunds,
  };

  return <FundsContext.Provider value={value}>{children}</FundsContext.Provider>;
};