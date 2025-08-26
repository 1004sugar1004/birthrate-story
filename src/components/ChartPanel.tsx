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

      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true) as SVGElement;
      
      // Force all styles to be inline for proper rendering
      const styleSheets = Array.from(document.styleSheets);
      const allElements = svgClone.querySelectorAll('*');
      
      allElements.forEach(el => {
        const computedStyle = window.getComputedStyle(el as Element);
        let styleStr = '';
        
        // Get all computed styles
        for (let i = 0; i < computedStyle.length; i++) {
          const prop = computedStyle[i];
          const value = computedStyle.getPropertyValue(prop);
          if (value && value !== 'initial' && value !== 'inherit') {
            styleStr += `${prop}: ${value}; `;
          }
        }
        
        if (styleStr) {
          (el as any).setAttribute('style', styleStr);
        }
      });

      // Ensure proper SVG attributes for standalone rendering
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      svgClone.setAttribute('width', '800');
      svgClone.setAttribute('height', '600');
      svgClone.setAttribute('viewBox', `0 0 800 600`);
      
      // Set white background
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', '100%');
      rect.setAttribute('height', '100%');
      rect.setAttribute('fill', 'white');
      svgClone.insertBefore(rect, svgClone.firstChild);

      // Create high-resolution canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scale = 2;
      canvas.width = 800 * scale;
      canvas.height = 600 * scale;
      ctx.scale(scale, scale);

      // Convert SVG to data URL and render
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        // Clear canvas with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 800, 600);
        
        // Draw the SVG
        ctx.drawImage(img, 0, 0, 800, 600);
        
        // Download the image
        const link = document.createElement('a');
        link.download = '출산율-그래프.png';
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        URL.revokeObjectURL(svgUrl);
      };
      
      img.onerror = () => {
        console.error('이미지 로드 실패');
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
    <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 shadow-elegant flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-card-foreground">합계출산율 변화</h2>
        
        {data.length > 0 && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-primary text-white rounded-lg hover:shadow-glow transition-all duration-300 text-sm font-medium"
          >
            <DownloadIcon />
            저장
          </button>
        )}
      </div>
      
      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted/30 flex items-center justify-center">
              📊
            </div>
            <p className="text-sm">그래프를 보려면 데이터를 추가해주세요</p>
          </div>
        </div>
      ) : (
        <div ref={chartRef} className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={sortedData}
              margin={{ top: 20, right: 20, left: 20, bottom: 40 }}
              onMouseLeave={() => onDataPointHover(undefined)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="year"
                type="number"
                scale="linear"
                domain={['dataMin', 'dataMax']}
                ticks={sortedData.map(d => d.year)}
                tick={{ 
                  fill: 'hsl(var(--muted-foreground))', 
                  fontSize: 12,
                  fontFamily: 'Arial, sans-serif'
                }}
                axisLine={{ 
                  stroke: 'hsl(var(--border))',
                  strokeWidth: 1
                }}
                tickLine={{
                  stroke: 'hsl(var(--border))',
                  strokeWidth: 1
                }}
              >
                <Label 
                  value="연도" 
                  position="insideBottom" 
                  offset={-5} 
                  style={{ 
                    textAnchor: 'middle', 
                    fill: 'hsl(var(--card-foreground))', 
                    fontSize: '14px',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 'bold'
                  }} 
                />
              </XAxis>
              <YAxis
                tick={{ 
                  fill: 'hsl(var(--muted-foreground))', 
                  fontSize: 12,
                  fontFamily: 'Arial, sans-serif'
                }}
                domain={[0, 'dataMax + 0.3']}
                axisLine={{ 
                  stroke: 'hsl(var(--border))',
                  strokeWidth: 1
                }}
                tickLine={{
                  stroke: 'hsl(var(--border))',
                  strokeWidth: 1
                }}
              >
                <Label
                  value="출산율"
                  angle={-90}
                  position="insideLeft"
                  style={{ 
                    textAnchor: 'middle', 
                    fill: 'hsl(var(--card-foreground))', 
                    fontSize: '14px',
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 'bold'
                  }}
                />
              </YAxis>
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                activeDot={{ 
                  r: 7, 
                  fill: 'hsl(var(--primary))',
                  stroke: 'hsl(var(--background))',
                  strokeWidth: 3,
                  filter: 'drop-shadow(0 0 6px hsl(var(--primary) / 0.5))'
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