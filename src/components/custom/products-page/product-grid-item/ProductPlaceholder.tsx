// ============================================================================
// ProductPlaceholder Component
// Renders a placeholder SVG for products without images
// Features: Customizable dimensions, colors, and text display
// ============================================================================

import React from 'react';

// Component props interface
interface ProductPlaceholderProps {
  text?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  isListMode?: boolean;
}

const ProductPlaceholder: React.FC<ProductPlaceholderProps> = ({
  text,
  width = 150,
  height = 150,
  backgroundColor = '#f3f4f6',
  textColor = '#111827',
  isListMode = false
}) => {
  // Use provided text or default to "Image Coming Soon..."
  const displayText = text || "Image Coming Soon...";
  
  // Render text based on display mode
  const renderText = () => {
    if (!isListMode) {
      // Single line text for grid mode
      return (
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill={textColor}
          fontFamily="Arial, sans-serif"
          fontSize={Math.max(12, Math.floor(width / 12))}
          fontWeight="bold"
        >
          {displayText}
        </text>
      );
    } else {
      // Multi-line text for list mode
      const words = displayText.split(' ');
      const fontSize = Math.max(10, Math.floor(width / 16));
      
      return (
        <>
          <text
            x="50%"
            y="30%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill={textColor}
            fontFamily="Arial, sans-serif"
            fontSize={fontSize}
            fontWeight="bold"
          >
            {words[0]}
          </text>
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill={textColor}
            fontFamily="Arial, sans-serif"
            fontSize={fontSize}
            fontWeight="bold"
          >
            {words[1]}
          </text>
          <text
            x="50%"
            y="70%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill={textColor}
            fontFamily="Arial, sans-serif"
            fontSize={fontSize}
            fontWeight="bold"
          >
            {words[2]}
          </text>
        </>
      );
    }
  };
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* Background rectangle */}
      <rect width={width} height={height} fill={backgroundColor} />
      {/* Text content */}
      {renderText()}
    </svg>
  );
};

export default ProductPlaceholder; 