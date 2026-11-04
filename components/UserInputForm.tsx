
import React, { useState, useEffect } from 'react';
import type { UserInput } from '../types';
import { GroupType, KpopGeneration } from '../types';
import { GROUP_TYPES, KPOP_GENERATIONS, DEFAULT_CONCEPT_KEYWORDS, MIN_MEMBERS, MAX_MEMBERS } from '../constants';

interface UserInputFormProps {
  onGenerate: (userInput: UserInput) => void;
  onProfileUpload: (file: File) => void;
  isLoading: boolean;
}

export const UserInputForm: React.FC<UserInputFormProps> = ({ onGenerate, onProfileUpload, isLoading }) => {
  const [groupType, setGroupType] = useState<GroupType>(GroupType.GIRL_GROUP);
  const [generation, setGeneration] = useState<KpopGeneration>(KpopGeneration.FIFTH);
  const [numMembers, setNumMembers] = useState<number>(5);
  const [conceptKeywords, setConceptKeywords] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);

  const isSolo = groupType === GroupType.SOLOIST || groupType === GroupType.FEMALE_SOLOIST || groupType === GroupType.MALE_SOLOIST;

  useEffect(() => {
    if (isSolo) {
      setNumMembers(1);
    } else if (numMembers === 1) {
      setNumMembers(5);
    }
  }, [groupType, isSolo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      groupType,
      numMembers: isSolo ? 1 : numMembers,
      conceptKeywords: conceptKeywords.trim() || undefined,
      generation
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onProfileUpload(file);
    }
  };

  // Border visibility fix: use indigo-200 and focus purple-500 ring for high legibility
  const inputClasses = "w-full p-3 bg-white border-2 border-indigo-100 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-all duration-300 outline-none font-medium text-sm";

  return (
    <div className="bg-white/90 backdrop-blur-xl p-4 rounded-xl shadow-md space-y-3 max-w-2xl mx-auto border border-white/40">
      <div className="text-center">
        <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-widest">Global A&R Dashboard</h3>
        <p className="text-[10px] text-indigo-400">Configure the next world-conquering K-Pop act</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-indigo-600 px-1">Artist Type</label>
            <select
              value={groupType}
              onChange={(e) => setGroupType(e.target.value as GroupType)}
              className={inputClasses}
            >
              {GROUP_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-indigo-600 px-1">Concept Era</label>
            <select
              value={generation}
              onChange={(e) => setGeneration(e.target.value as KpopGeneration)}
              className={inputClasses}
            >
              {KPOP_GENERATIONS.map(gen => <option key={gen} value={gen}>{gen}</option>)}
            </select>
          </div>
        </div>

        {!isSolo && (
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-indigo-600 px-1">
              Final Lineup Size ({MIN_MEMBERS}-{MAX_MEMBERS} members)
            </label>
            <input
              type="number"
              value={numMembers}
              onChange={(e) => setNumMembers(Math.max(MIN_MEMBERS, Math.min(MAX_MEMBERS, parseInt(e.target.value, 10) || MIN_MEMBERS)))}
              className={inputClasses}
            />
          </div>
        )}

        <div className="space-y-1">
          <div className="flex justify-between items-center px-1">
            <label className="text-[9px] font-black uppercase tracking-widest text-indigo-600">Concept Storyline</label>
            <span className="text-[8px] font-bold text-indigo-300 uppercase italic">Optional</span>
          </div>
          <input
            type="text"
            value={conceptKeywords}
            onChange={(e) => setConceptKeywords(e.target.value)}
            placeholder="E.g., Simple dual concept (like Blackpink/Red Velvet) OR deep storyline lore (like Ateez/Enhypen)"
            className={inputClasses}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-800 text-white font-black py-3 px-4 rounded-lg shadow-sm transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300 disabled:opacity-50 tracking-widest uppercase text-xs border-b-2 border-indigo-900"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-circle-notch animate-spin mr-2"></i> ANALYZING...
            </span>
          ) : 'Execute Debut Protocol'}
        </button>
      </form>

      <div className="pt-3 border-t border-indigo-50">
        <label className="block text-center text-[9px] font-bold uppercase tracking-widest mb-2 text-indigo-300">Or Import Agency Dossier (.pdf)</label>
        <div className="relative group">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label 
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full p-2 border-2 border-dashed border-indigo-100 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-all text-indigo-400"
          >
            <i className="fas fa-file-upload text-base mb-1"></i>
            <span className="font-bold text-[10px]">{fileName || 'Upload Agency PDF Profile'}</span>
          </label>
        </div>
      </div>
    </div>
  );
};
