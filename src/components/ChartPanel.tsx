import React, { useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
  TooltipProps,
} from 'recharts';
import { DownloadIcon } from './icons/IconComponents';
import { FertilityData } from '../types/fertility';

interface ChartPanelProps {
  data: FertilityData[];
  onDataPointHover: (year?: number) => void;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: FertilityData;
  }>;
  label?: number;
}

export const ChartPanel: React.FC<ChartPanelProps> = ({ data, onDataPointHover }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  const sortedData = [...data].sort((a, b) => a.year - b.year);

  const handleDownload = async () => {
    if (!chartRef.current || data.length === 0) return;

    try {
      const svgElement = chartRef.current.querySelector('svg');
      if (!svgElement) return;

      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set high resolution
      const scale = 2;
      canvas.width = 800 * scale;
      canvas.height = 600 * scale;
      ctx.scale(scale, scale);

      // White background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 800, 600);

      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 800, 600);
        
        // Download
        const link = document.createElement('a');
        link.download = '출산율-그래프.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        URL.revokeObjectURL(svgUrl);
      };
      img.src = svgUrl;
    } catch (error) {
      console.error('차트 저장 중 오류가 발생했습니다:', error);
    }
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length && label) {
      return (
        <div className="bg-card/95 border border-border rounded-lg p-3 shadow-lg">
          <p className="text-card-foreground font-medium">{`${label}년`}</p>
          <p className="text-primary">
            {`출산율: ${payload[0].value.toFixed(2)}명`}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleMouseEnter = (data: any) => {
    if (data && data.payload && data.payload.year) {
      onDataPointHover(data.payload.year);
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6" style={{ boxShadow: 'var(--shadow-chart)' }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">합계출산율 변화</h2>
        
        {data.length > 0 && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-sm"
          >
            <DownloadIcon />
            저장
          </button>
        )}
      </div>
      
      {data.length === 0 ? (
        <div className="h-96 flex items-center justify-center text-muted-foreground">
          그래프를 보려면 데이터를 추가해주세요.
        </div>
      ) : (
        <div ref={chartRef} className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedData}
              margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
              onMouseLeave={() => onDataPointHover(undefined)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="year"
                type="number"
                scale="linear"
                domain={['dataMin', 'dataMax']}
                ticks={sortedData.map(d => d.year)}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              >
                <Label 
                  value="연도" 
                  position="insideBottom" 
                  offset={-10} 
                  style={{ textAnchor: 'middle', fill: 'hsl(var(--card-foreground))' }} 
                />
              </XAxis>
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                domain={[0, 'dataMax + 0.5']}
              >
                <Label
                  value="출산율"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: 'middle', fill: 'hsl(var(--card-foreground))' }}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ 
                  r: 6, 
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--card))',
                  strokeWidth: 2 
                }}
                onMouseEnter={handleMouseEnter}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};