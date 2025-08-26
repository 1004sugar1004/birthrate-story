import React, { useState } from 'react';
import { SearchIcon, TrashIcon } from './icons/IconComponents';
import { getDataForYear } from '../data/fertilityData';
import { FertilityData } from '../types/fertility';

interface DataInputPanelProps {
  selectedData: FertilityData[];
  onAddData: (data: FertilityData) => void;
  onClearData: () => void;
}

export const DataInputPanel: React.FC<DataInputPanelProps> = ({
  selectedData,
  onAddData,
  onClearData,
}) => {
  const [yearInput, setYearInput] = useState('');
  const [error, setError] = useState('');

  const handleAddData = () => {
    const year = parseInt(yearInput);
    
    // Validation
    if (isNaN(year)) {
      setError('올바른 연도를 입력해주세요.');
      return;
    }
    
    if (year < 1970 || year > 2023) {
      setError('1970년부터 2023년 사이의 연도를 입력해주세요.');
      return;
    }
    
    if (selectedData.some(data => data.year === year)) {
      setError('이미 추가된 연도입니다.');
      return;
    }
    
    const data = getDataForYear(year);
    if (!data) {
      setError('해당 연도의 데이터를 찾을 수 없습니다.');
      return;
    }
    
    onAddData(data);
    setYearInput('');
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddData();
    }
  };

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 shadow-elegant h-fit">
      <h2 className="text-lg font-semibold text-card-foreground mb-4">연도 선택</h2>
      
      <div className="space-y-3">
        <input
          id="year-input"
          type="number"
          placeholder="예: 1983"
          value={yearInput}
          onChange={(e) => setYearInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground transition-all"
          style={{ colorScheme: 'light' }}
        />
        
        {error && (
          <p className="text-destructive text-sm font-medium">{error}</p>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={handleAddData}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all duration-300 font-medium"
          >
            <SearchIcon />
            추가
          </button>
          
          <button
            onClick={onClearData}
            className="p-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-all hover:shadow-md"
            title="모든 데이터 초기화"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        1970-2023년 사이 연도를 입력하세요
      </div>
    </div>
  );
};