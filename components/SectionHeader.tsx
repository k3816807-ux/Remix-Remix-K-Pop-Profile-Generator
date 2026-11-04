
import React from 'react';

interface SectionHeaderProps {
  title: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
  return (
    <div className="relative inline-block mb-2">
      <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em]">
        {title}
      </h3>
      <div className="absolute -bottom-2 left-0 w-8 h-[2px] bg-indigo-200"></div>
    </div>
  );
};
