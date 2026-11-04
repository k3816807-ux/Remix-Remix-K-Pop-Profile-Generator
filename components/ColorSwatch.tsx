
import React from 'react';
import type { OfficialColor } from '../types';

interface ColorSwatchProps {
  color: OfficialColor;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ color }) => {
  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <div
        className="w-10 h-10 rounded-md mr-3 border border-gray-300"
        style={{ backgroundColor: color.hex }}
        title={`${color.name} - ${color.hex}`}
      ></div>
      <div>
        <p className="font-medium text-gray-800">{color.name}</p>
        <p className="text-xs text-gray-500">{color.hex} - {color.description}</p>
      </div>
    </div>
  );
};
    