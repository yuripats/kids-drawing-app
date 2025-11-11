/**
 * Color Mixer Game Page
 * Learn color theory by mixing colors
 */

import React from 'react';
import { useColorMixer } from '../../../hooks/useColorMixer';
import GameLayout from '../../shared/GameLayout';

interface ColorMixerPageProps {
  onNavigateHome: () => void;
}

const ColorMixerPage: React.FC<ColorMixerPageProps> = ({ onNavigateHome }) => {
  const { gameState, addColor, checkMatch, reset } = useColorMixer();

  const { currentMix, challenge, score, completedChallenges } = gameState;

  const rgbString = `rgb(${currentMix.r}, ${currentMix.g}, ${currentMix.b})`;
  const targetRgb = challenge ? `rgb(${challenge.target.r}, ${challenge.target.g}, ${challenge.target.b})` : 'white';

  return (
    <GameLayout
      title="Color Mixer"
      emoji="🌈"
      onNavigateHome={onNavigateHome}
      bgColorClass="bg-gradient-to-b from-pink-100 to-purple-100"
    >
      {/* Stats */}
      <div className="kid-card max-w-4xl mx-auto mb-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-slate-600 font-semibold">Score</p>
            <p className="text-3xl font-bold text-purple-600">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600 font-semibold">Completed</p>
            <p className="text-3xl font-bold text-pink-600">{completedChallenges}</p>
          </div>
        </div>
      </div>

      {/* Challenge */}
      {challenge && (
        <div className="kid-card max-w-2xl mx-auto mb-4 text-center">
          <h2 className="text-2xl font-bold text-purple-800 mb-2">Make: {challenge.name}</h2>
          <p className="text-lg text-slate-600 mb-4">{challenge.hint}</p>
          <div className="w-32 h-32 mx-auto rounded-lg border-4 border-gray-300" style={{ backgroundColor: targetRgb }} />
        </div>
      )}

      {/* Current Mix */}
      <div className="kid-card max-w-2xl mx-auto mb-4">
        <h3 className="text-xl font-bold text-center mb-3">Your Mix</h3>
        <div className="w-48 h-48 mx-auto rounded-lg border-4 border-gray-400 shadow-lg" style={{ backgroundColor: rgbString }} />
      </div>

      {/* Color Buttons */}
      <div className="kid-card max-w-2xl mx-auto mb-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button onClick={() => addColor({ r: 50 })} className="kid-button bg-red-500 hover:bg-red-600">
            + Red
          </button>
          <button onClick={() => addColor({ g: 50 })} className="kid-button bg-green-500 hover:bg-green-600">
            + Green
          </button>
          <button onClick={() => addColor({ b: 50 })} className="kid-button bg-blue-500 hover:bg-blue-600">
            + Blue
          </button>
          <button onClick={() => addColor({ r: 50, g: 50 })} className="kid-button bg-yellow-500 hover:bg-yellow-600">
            + Yellow
          </button>
          <button onClick={() => addColor({ r: 20, g: 20, b: 20 })} className="kid-button bg-gray-700 hover:bg-gray-800 text-white">
            + Black
          </button>
          <button onClick={() => addColor({ r: -30, g: -30, b: -30 })} className="kid-button bg-white hover:bg-gray-100 border-2">
            - Darken
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center mb-4">
        <button onClick={checkMatch} className="kid-button bg-green-500 hover:bg-green-600 text-lg px-8">
          ✅ Check!
        </button>
        <button onClick={reset} className="kid-button bg-orange-500 hover:bg-orange-600 text-lg px-8">
          🔄 Clear
        </button>
      </div>

      {/* Instructions - Hidden on mobile */}
      <div className="kid-card max-w-4xl mx-auto hidden md:block">
        <h2 className="text-xl font-bold mb-3 text-center">How to Play</h2>
        <ul className="space-y-2 text-slate-700">
          <li>• Mix colors to match the target color</li>
          <li>• Click color buttons to add that color to your mix</li>
          <li>• Use the hint to know which colors to combine</li>
          <li>• Click "Check!" when you think it matches</li>
        </ul>
      </div>
    </GameLayout>
  );
};

export default ColorMixerPage;
