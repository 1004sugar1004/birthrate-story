import React, { useState } from 'react';
import { DataInputPanel } from '../components/DataInputPanel';
import { DataTable } from '../components/DataTable';
import { ChartPanel } from '../components/ChartPanel';
import { FertilityData } from '../types/fertility';

const Index = () => {
  const [selectedData, setSelectedData] = useState<FertilityData[]>([]);
  const [highlightedYear, setHighlightedYear] = useState<number | undefined>();

  const handleAddData = (data: FertilityData) => {
    setSelectedData(prev => [...prev, data]);
  };

  const handleClearData = () => {
    setSelectedData([]);
    setHighlightedYear(undefined);
  };

  const handleDataPointHover = (year?: number) => {
    setHighlightedYear(year);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            대한민국 합계출산율 변화 탐색기
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            원하는 연도를 선택하여 데이터를 추가하고, 시간의 흐름에 따른 출산율 변화를 시각화해보세요.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-6 mb-6">
          {/* Left Panel - Data Input */}
          <div className="lg:col-span-2">
            <div className="max-w-xs mx-auto lg:mx-0">
              <DataInputPanel
                selectedData={selectedData}
                onAddData={handleAddData}
                onClearData={handleClearData}
              />
            </div>
          </div>

          {/* Right Panel - Data Table */}
          <div className="lg:col-span-3">
            <DataTable 
              data={selectedData} 
              highlightedYear={highlightedYear}
            />
          </div>
        </div>

        {/* Bottom Panel - Chart */}
        <div className="w-full">
          <ChartPanel
            data={selectedData}
            onDataPointHover={handleDataPointHover}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
