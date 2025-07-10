import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fund } from '../types';
import { fetchAllFunds } from '../utils/api';
import { useFunds } from '../hooks/useFunds';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import FundCard from '../components/FundCard';
import { Search, Filter, ArrowRight, RefreshCw } from 'lucide-react';

const FundSelection: React.FC = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFundHouse, setSelectedFundHouse] = useState('');
  
  const { selectedFunds, addFund, removeFund, maxFunds } = useFunds();
  const navigate = useNavigate();

  useEffect(() => {
    loadFunds();
  }, []);

  const loadFunds = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllFunds();
      setFunds(data);
    } catch (err) {
      setError('Failed to load funds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredFunds = useMemo(() => {
    return funds.filter(fund => {
      const matchesSearch = fund.schemeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || fund.schemeCategory === selectedCategory;
      const matchesFundHouse = !selectedFundHouse || fund.fundHouse === selectedFundHouse;
      
      return matchesSearch && matchesCategory && matchesFundHouse;
    });
  }, [funds, searchTerm, selectedCategory, selectedFundHouse]);

  const categories = useMemo(() => {
    const cats = funds.map(fund => fund.schemeCategory).filter(Boolean);
    return [...new Set(cats)].sort();
  }, [funds]);

  const fundHouses = useMemo(() => {
    const houses = funds.map(fund => fund.fundHouse).filter(Boolean);
    return [...new Set(houses)].sort();
  }, [funds]);

  const handleFundSelect = (fund: Fund) => {
    if (selectedFunds.find(f => f.schemeCode === fund.schemeCode)) {
      removeFund(fund.schemeCode);
    } else {
      addFund(fund);
    }
  };

  const canShowComparison = selectedFunds.length >= 2 && selectedFunds.length <= maxFunds;

  const handleShowComparison = () => {
    if (canShowComparison) {
      navigate('/comparison');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner size="lg" text="Loading mutual funds..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadFunds}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Mutual Funds</h1>
          <p className="text-gray-600">Choose 2-4 funds to compare their performance</p>
        </div>

        {/* Selected Funds Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Selected Funds</h2>
              <p className="text-sm text-gray-600">
                {selectedFunds.length} of {maxFunds} funds selected
              </p>
            </div>
            
            <button
              onClick={handleShowComparison}
              disabled={!canShowComparison}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                canShowComparison
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Show Comparison
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
          
          {selectedFunds.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedFunds.map(fund => (
                <div
                  key={fund.schemeCode}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {fund.schemeName.slice(0, 30)}...
                  <button
                    onClick={() => removeFund(fund.schemeCode)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Funds
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by scheme name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fund House
              </label>
              <select
                value={selectedFundHouse}
                onChange={(e) => setSelectedFundHouse(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Fund Houses</option>
                {fundHouses.map(house => (
                  <option key={house} value={house}>{house}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Funds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFunds.map(fund => {
            const isSelected = selectedFunds.some(f => f.schemeCode === fund.schemeCode);
            const isDisabled = !isSelected && selectedFunds.length >= maxFunds;
            
            return (
              <FundCard
                key={fund.schemeCode}
                fund={fund}
                isSelected={isSelected}
                disabled={isDisabled}
                onSelect={() => handleFundSelect(fund)}
                onRemove={() => removeFund(fund.schemeCode)}
              />
            );
          })}
        </div>

        {filteredFunds.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No funds found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundSelection;