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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="container mx-auto max-w-6xl h-screen flex flex-col">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            대한민국 합계출산율 변화 탐색기
          </h1>
          <p className="text-sm text-muted-foreground">
            연도를 선택하여 출산율 변화를 시각화해보세요
          </p>
        </div>

        {/* Main Content Grid - Tablet Optimized */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 min-h-0">
          {/* Input Panel - Compact */}
          <div className="md:col-span-1 flex flex-col">
            <DataInputPanel
              selectedData={selectedData}
              onAddData={handleAddData}
              onClearData={handleClearData}
            />
          </div>

          {/* Data Table - Scrollable */}
          <div className="md:col-span-1 flex flex-col min-h-0">
            <DataTable 
              data={selectedData} 
              highlightedYear={highlightedYear}
            />
          </div>

          {/* Chart Panel - Takes remaining space */}
          <div className="md:col-span-2 flex flex-col min-h-0">
            <ChartPanel
              data={selectedData}
              onDataPointHover={handleDataPointHover}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
