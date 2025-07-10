import React from 'react';
import { Fund } from '../types';
import { Check, Plus, X } from 'lucide-react';

interface FundCardProps {
  fund: Fund;
  isSelected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

const FundCard: React.FC<FundCardProps> = ({ 
  fund, 
  isSelected = false, 
  onSelect, 
  onRemove, 
  disabled = false 
}) => {
  const handleClick = () => {
    if (disabled) return;
    
    if (isSelected && onRemove) {
      onRemove();
    } else if (!isSelected && onSelect) {
      onSelect();
    }
  };

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : disabled 
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${disabled ? 'text-gray-400' : 'text-gray-900'} line-clamp-2`}>
              {fund.schemeName}
            </h3>
            <p className={`text-sm mt-1 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
              Code: {fund.schemeCode}
            </p>
          </div>
          
          <div className="ml-4 flex-shrink-0">
            {isSelected ? (
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                <Check className="h-5 w-5 text-white" />
              </div>
            ) : (
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                disabled 
                  ? 'border-gray-300 bg-gray-100' 
                  : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}>
                <Plus className={`h-5 w-5 ${disabled ? 'text-gray-400' : 'text-gray-600'}`} />
              </div>
            )}
          </div>
        </div>
        
        {fund.fundHouse && (
          <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
            {fund.fundHouse}
          </p>
        )}
        
        {fund.schemeCategory && (
          <div className="mt-2">
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              disabled 
                ? 'bg-gray-200 text-gray-400' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {fund.schemeCategory}
            </span>
          </div>
        )}
      </div>
      
      {isSelected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default FundCard;