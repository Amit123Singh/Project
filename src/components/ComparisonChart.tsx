import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  date: string;
  [key: string]: string | number;
}

interface ComparisonChartProps {
  data: ChartData[];
  fundNames: string[];
  colors: string[];
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, fundNames, colors }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {formatDate(label)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ₹${parseFloat(entry.value).toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">NAV Comparison Chart</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#666"
              fontSize={12}
              tickFormatter={formatDate}
            />
            <YAxis 
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {fundNames.map((fundName, index) => (
              <Line
                key={`${fundName}-${index}`}
                type="monotone"
                dataKey={fundName}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: colors[index % colors.length] }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;