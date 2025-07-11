import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { Fund } from '../types';
import { fetchAllFunds } from '../utils/api';
import { useFunds } from '../hooks/useFunds';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import FundCard from '../components/FundCard';
import { Search, Filter, ArrowRight, RefreshCw, SlidersHorizontal, X } from 'lucide-react';

const FundSelection: React.FC = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFundHouse, setSelectedFundHouse] = useState('');
  const [selectedSchemeType, setSelectedSchemeType] = useState('');
  const [minNav, setMinNav] = useState<string>('');
  const [maxNav, setMaxNav] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
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

  // Memoized filter options
  const filterOptions = useMemo(() => {
    const categories = new Set<string>();
    const fundHouses = new Set<string>();
    const schemeTypes = new Set<string>();

    funds.forEach(fund => {
      if (fund.schemeCategory) categories.add(fund.schemeCategory);
      if (fund.fundHouse) fundHouses.add(fund.fundHouse);
      if (fund.schemeType) schemeTypes.add(fund.schemeType);
    });

    return {
      categories: Array.from(categories).sort(),
      fundHouses: Array.from(fundHouses).sort(),
      schemeTypes: Array.from(schemeTypes).sort()
    };
  }, [funds]);

  // Memoized filtered funds with advanced filtering
  const filteredFunds = useMemo(() => {
    return funds.filter(fund => {
      // Search filter
      const matchesSearch = fund.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (fund.fundHouse?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      // Category filter
      const matchesCategory = !selectedCategory || fund.schemeCategory === selectedCategory;
      
      // Fund house filter
      const matchesFundHouse = !selectedFundHouse || fund.fundHouse === selectedFundHouse;
      
      // Scheme type filter
      const matchesSchemeType = !selectedSchemeType || fund.schemeType === selectedSchemeType;
      
      // NAV range filter
      const fundNav = fund.nav || 0;
      const matchesMinNav = !minNav || fundNav >= parseFloat(minNav);
      const matchesMaxNav = !maxNav || fundNav <= parseFloat(maxNav);
      
      return matchesSearch && matchesCategory && matchesFundHouse && 
             matchesSchemeType && matchesMinNav && matchesMaxNav;
    });
  }, [funds, searchTerm, selectedCategory, selectedFundHouse, selectedSchemeType, minNav, maxNav]);

  const handleFundSelect = useCallback((fund: Fund) => {
    if (selectedFunds.find(f => f.schemeCode === fund.schemeCode)) {
      removeFund(fund.schemeCode);
    } else {
      addFund(fund);
    }
  }, [selectedFunds, addFund, removeFund]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedFundHouse('');
    setSelectedSchemeType('');
    setMinNav('');
    setMaxNav('');
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCategory) count++;
    if (selectedFundHouse) count++;
    if (selectedSchemeType) count++;
    if (minNav) count++;
    if (maxNav) count++;
    return count;
  }, [searchTerm, selectedCategory, selectedFundHouse, selectedSchemeType, minNav, maxNav]);

  const canShowComparison = selectedFunds.length >= 2 && selectedFunds.length <= maxFunds;

  const handleShowComparison = () => {
    if (canShowComparison) {
      navigate('/comparison');
    }
  };

  // Virtualized list item renderer
  const VirtualizedFundItem = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const fund = filteredFunds[index];
    const isSelected = selectedFunds.some(f => f.schemeCode === fund.schemeCode);
    const isDisabled = !isSelected && selectedFunds.length >= maxFunds;

    return (
      <div style={style} className="px-2 py-2">
        <FundCard
          fund={fund}
          isSelected={isSelected}
          disabled={isDisabled}
          onSelect={() => handleFundSelect(fund)}
          onRemove={() => removeFund(fund.schemeCode)}
        />
      </div>
    );
  }, [filteredFunds, selectedFunds, maxFunds, handleFundSelect, removeFund]);

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
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredFunds.length.toLocaleString()} of {funds.length.toLocaleString()} funds
          </p>
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

        {/* Search and Filter Toggle */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by scheme name or fund house..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Filter Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-white text-blue-600 text-xs px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Categories</option>
                    {filterOptions.categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                {/* Fund House Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fund House
                  </label>
                  <select
                    value={selectedFundHouse}
                    onChange={(e) => setSelectedFundHouse(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Fund Houses</option>
                    {filterOptions.fundHouses.map(house => (
                      <option key={house} value={house}>{house}</option>
                    ))}
                  </select>
                </div>
                
                {/* Scheme Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheme Type
                  </label>
                  <select
                    value={selectedSchemeType}
                    onChange={(e) => setSelectedSchemeType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">All Types</option>
                    {filterOptions.schemeTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                {/* Min NAV Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min NAV (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minNav}
                    onChange={(e) => setMinNav(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                {/* Max NAV Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max NAV (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={maxNav}
                    onChange={(e) => setMaxNav(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Virtualized Funds List */}
        <div className="bg-white rounded-lg shadow-md">
          {filteredFunds.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No funds found matching your criteria</p>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Available Funds ({filteredFunds.length.toLocaleString()})
              </h3>
              <div className="h-96 border border-gray-200 rounded-lg">
                <List
                  height={384}
                  itemCount={filteredFunds.length}
                  itemSize={200}
                  width="100%"
                >
                  {VirtualizedFundItem}
                </List>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FundSelection;