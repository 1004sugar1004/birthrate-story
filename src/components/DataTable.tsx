import React from 'react';
import { FertilityData } from '../types/fertility';

interface DataTableProps {
  data: FertilityData[];
  highlightedYear?: number;
}

export const DataTable: React.FC<DataTableProps> = ({ data, highlightedYear }) => {
  const sortedData = [...data].sort((a, b) => a.year - b.year);

  return (
    <div className="bg-card rounded-xl border border-border p-6" style={{ boxShadow: 'var(--shadow-panel)' }}>
      <h2 className="text-lg font-semibold text-card-foreground mb-4">선택된 데이터</h2>
      
      {data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          아직 선택된 데이터가 없습니다.<br />
          좌측에서 연도를 입력해주세요.
        </div>
      ) : (
        <div className="overflow-y-auto max-h-96">
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