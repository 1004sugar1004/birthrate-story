import React from 'react';
import { FertilityData } from '../types/fertility';

interface DataTableProps {
  data: FertilityData[];
  highlightedYear?: number;
}

export const DataTable: React.FC<DataTableProps> = ({ data, highlightedYear }) => {
  const sortedData = [...data].sort((a, b) => a.year - b.year);

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 shadow-elegant flex flex-col h-full">
      <h2 className="text-lg font-semibold text-card-foreground mb-4">선택된 데이터</h2>
      
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted/30 flex items-center justify-center">
              📋
            </div>
            <p className="text-sm">데이터를 추가하면 여기에 표시됩니다</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-card-foreground font-medium">연도</th>
                <th className="text-right py-2 text-card-foreground font-medium">합계출산율 (명)</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr
                  key={item.year}
                  className={`border-b border-border/50 transition-colors ${
                    highlightedYear === item.year ? 'bg-primary/10' : 'hover:bg-muted/50'
                  }`}
                >
                  <td className="py-2 text-card-foreground">{item.year}</td>
                  <td className="py-2 text-right text-card-foreground font-mono">
                    {item.rate.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};