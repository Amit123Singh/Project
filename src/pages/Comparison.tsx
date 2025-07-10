import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunds } from '../hooks/useFunds';
import { FundDetail } from '../types';
import { fetchMultipleFundDetails } from '../utils/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ComparisonChart from '../components/ComparisonChart';
import { ArrowLeft, Building, Hash, TrendingUp, Calendar, RefreshCw } from 'lucide-react';

const Comparison: React.FC = () => {
  const [fundDetails, setFundDetails] = useState<FundDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { selectedFunds } = useFunds();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedFunds.length < 2) {
      navigate('/funds');
      return;
    }
    
    loadFundDetails();
  }, [selectedFunds]);

  const loadFundDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const schemeCodes = selectedFunds.map(fund => fund.schemeCode);
      const details = await fetchMultipleFundDetails(schemeCodes);
      setFundDetails(details);
    } catch (err) {
      setError('Failed to load fund details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    if (fundDetails.length === 0) return [];

    // Get all unique dates
    const allDates = new Set<string>();
    fundDetails.forEach(detail => {
      detail.data.forEach(entry => allDates.add(entry.date));
    });

    // Sort dates
    const sortedDates = Array.from(allDates).sort();

    // Take last 100 data points for better visualization
    const recentDates = sortedDates.slice(-100);

    // Create chart data
    const chartData = recentDates.map(date => {
      const dataPoint: any = { date };
      
      fundDetails.forEach(detail => {
        const fundName = `${detail.fund.schemeName.slice(0, 30)}... (${detail.fund.schemeCode})`;
        const entry = detail.data.find(d => d.date === date);
        dataPoint[fundName] = entry ? parseFloat(entry.nav) : null;
      });
      
      return dataPoint;
    });

    return chartData.filter(point => 
      Object.values(point).some(value => value !== null && value !== point.date)
    );
  };

  const chartData = prepareChartData();
  const fundNames = fundDetails.map(detail => `${detail.fund.schemeName.slice(0, 30)}... (${detail.fund.schemeCode})`);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingSpinner size="lg" text="Loading fund comparison..." />
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
              onClick={loadFundDetails}
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
          <button
            onClick={() => navigate('/funds')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Fund Selection
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fund Comparison</h1>
          <p className="text-gray-600">Compare the performance of your selected mutual funds</p>
        </div>

        {/* Chart Section */}
        <div className="mb-8">
          <ComparisonChart 
            data={chartData} 
            fundNames={fundNames} 
            colors={colors} 
          />
        </div>

        {/* Fund Details Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {fundDetails.map((detail, index) => (
            <div key={detail.fund.schemeCode} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {detail.fund.schemeName}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="text-sm text-gray-500">Chart Color</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Scheme Code:</span>
                  <span className="text-sm font-medium">{detail.fund.schemeCode}</span>
                </div>
                
                {detail.fund.fundHouse && (
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Fund House:</span>
                    <span className="text-sm font-medium">{detail.fund.fundHouse}</span>
                  </div>
                )}
                
                {detail.fund.schemeCategory && (
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Category:</span>
                    <span className="text-sm font-medium">{detail.fund.schemeCategory}</span>
                  </div>
                )}
                
                {detail.data.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Latest NAV:</span>
                    <span className="text-sm font-medium">
                      ₹{detail.data[0].nav} ({detail.data[0].date})
                    </span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Data Points:</span>
                    <span className="text-sm font-medium">{detail.data.length}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Comparison;