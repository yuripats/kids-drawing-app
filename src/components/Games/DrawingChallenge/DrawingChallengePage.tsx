/**
 * Drawing Challenge Game Page
 * Shows prompts and integrates with drawing canvas
 */

import React, { useState, useCallback, useRef } from 'react';
import { useDrawingChallenge } from '../../../hooks/useDrawingChallenge';
import GameLayout from '../../shared/GameLayout';
import DrawingCanvasWithTools from '../../Canvas/DrawingCanvasWithTools';
import type { Category, GameMode } from './types';
import { categoryNames } from './prompts';
import { formatTime } from '../../../utils/gameUtils';

interface DrawingChallengePageProps {
  onNavigateHome: () => void;
}

const DrawingChallengePage: React.FC<DrawingChallengePageProps> = ({ onNavigateHome }) => {
  const {
    gameState,
    startChallenge,
    finishChallenge,
    nextPrompt,
    setCategory,
    setMode,
    setTimeLimit
  } = useDrawingChallenge();

  const {
    currentPrompt,
    gameStatus,
    mode,
    category,
    timeLimit,
    timeRemaining,
    completedChallenges
  } = gameState;

  const [showCanvas, setShowCanvas] = useState(false);
  const clearCanvasRef = useRef<(() => void) | null>(null);

  const handleStartDrawing = useCallback(() => {
    startChallenge();
    setShowCanvas(true);
  }, [startChallenge]);

  const handleFinish = useCallback(() => {
    finishChallenge();
    setShowCanvas(false);
  }, [finishChallenge]);

  const handleNextPrompt = useCallback(() => {
    nextPrompt();
    setShowCanvas(false);
    if (clearCanvasRef.current) {
      clearCanvasRef.current();
    }
  }, [nextPrompt]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value as Category);
    setShowCanvas(false);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value as GameMode);
    setShowCanvas(false);
  };

  const handleTimeLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeLimit(parseInt(e.target.value, 10));
  };

  const handleClearCanvas = useCallback(() => {
    if (clearCanvasRef.current) {
      clearCanvasRef.current();
    }
  }, []);

  const headerActions = (
    <>
      {/* Category Selector */}
      <select
        value={category}
        onChange={handleCategoryChange}
        disabled={gameStatus === 'drawing'}
        className="kid-input text-sm px-3 py-2"
        title="Drawing Category"
      >
        {Object.entries(categoryNames).map(([key, name]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>

      {/* Mode Selector */}
      <select
        value={mode}
        onChange={handleModeChange}
        disabled={gameStatus === 'drawing'}
        className="kid-input text-sm px-3 py-2"
        title="Game Mode"
      >
        <option value="free">✨ Free Mode</option>
        <option value="timed">⏱️ Timed Mode</option>
      </select>

      {/* Time Limit Selector (only in timed mode) */}
      {mode === 'timed' && (
        <select
          value={timeLimit}
          onChange={handleTimeLimitChange}
          disabled={gameStatus === 'drawing'}
          className="kid-input text-sm px-3 py-2"
          title="Time Limit"
        >
          <option value={60}>1 minute</option>
          <option value={120}>2 minutes</option>
          <option value={180}>3 minutes</option>
          <option value={300}>5 minutes</option>
        </select>
      )}
    </>
  );

  return (
    <GameLayout
      title="Drawing Challenge"
      emoji="🎨"
      onNavigateHome={onNavigateHome}
      headerActions={headerActions}
      bgColorClass="bg-gradient-to-b from-purple-100 to-pink-100"
    >
      {/* Stats Panel */}
      <div className="kid-card max-w-4xl mx-auto mb-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Challenges Completed */}
          <div className="text-center">
            <p className="text-sm text-slate-600 font-semibold">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {completedChallenges.length}
            </p>
          </div>

          {/* Current Difficulty */}
          {currentPrompt && (
            <div className="text-center">
              <p className="text-sm text-slate-600 font-semibold">Difficulty</p>
              <p className="text-3xl font-bold text-purple-600">
                {currentPrompt.difficulty === 1 ? '⭐' : currentPrompt.difficulty === 2 ? '⭐⭐' : '⭐⭐⭐'}
              </p>
            </div>
          )}

          {/* Timer (timed mode only) */}
          {mode === 'timed' && gameStatus === 'drawing' && (
            <div className="text-center">
              <p className="text-sm text-slate-600 font-semibold">Time Left</p>
              <p className={`text-3xl font-bold ${timeRemaining < 30 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatTime(timeRemaining)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Prompt Display (when not drawing) */}
      {!showCanvas && currentPrompt && (
        <div className="max-w-2xl mx-auto mb-6">
          <div className="kid-card text-center bg-white p-8">
            <div className="text-8xl mb-4 animate-bounce-once">
              {currentPrompt.emoji}
            </div>
            <h2 className="text-4xl font-bold text-purple-700 mb-2">
              Draw a {currentPrompt.text}!
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              {mode === 'timed'
                ? `You have ${formatTime(timeLimit)} to draw it!`
                : 'Take your time and be creative!'}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                className="kid-button bg-purple-500 hover:bg-purple-600 text-xl px-8"
                onClick={handleStartDrawing}
              >
                🖌️ Start Drawing!
              </button>

              {gameStatus !== 'drawing' && (
                <button
                  className="kid-button bg-blue-500 hover:bg-blue-600 text-xl px-8"
                  onClick={handleNextPrompt}
                >
                  🎲 Different Prompt
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Drawing Canvas (when drawing) */}
      {showCanvas && currentPrompt && (
        <div className="max-w-4xl mx-auto">
          {/* Prompt reminder */}
          <div className="kid-card bg-white p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentPrompt.emoji}</span>
              <div>
                <p className="text-sm text-slate-600">Drawing:</p>
                <p className="text-2xl font-bold text-purple-700">
                  {currentPrompt.text}
                </p>
              </div>
            </div>

            {mode === 'timed' && (
              <div className="text-right">
                <p className="text-sm text-slate-600">Time Left</p>
                <p className={`text-3xl font-bold ${timeRemaining < 30 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
            )}
          </div>

          {/* Canvas */}
          <div className="kid-card bg-white p-4 mb-4">
            <DrawingCanvasWithTools
              width={600}
              height={450}
              onDrawingChange={() => {
                // Could save drawing here if needed
                console.log('Drawing updated');
              }}
              clearCanvasRef={clearCanvasRef}
            />
          </div>

          {/* Drawing Controls */}
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              className="kid-button bg-green-500 hover:bg-green-600 text-lg px-6"
              onClick={handleFinish}
            >
              ✅ I'm Done!
            </button>

            <button
              className="kid-button bg-orange-500 hover:bg-orange-600 text-lg px-6"
              onClick={handleClearCanvas}
            >
              🗑️ Clear Canvas
            </button>

            <button
              className="kid-button bg-slate-500 hover:bg-slate-600 text-lg px-6"
              onClick={() => {
                setShowCanvas(false);
                if (gameStatus === 'drawing') {
                  handleFinish();
                }
              }}
            >
              ⬅️ Back to Prompt
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!showCanvas && (
        <div className="kid-card max-w-4xl mx-auto mt-6">
          <h2 className="text-xl font-bold mb-3 text-center text-purple-800">
            How to Play
          </h2>

          <div className="space-y-3 text-slate-700">
            <div>
              <h3 className="font-semibold text-lg mb-1">🎯 Goal</h3>
              <p>
                Draw the object shown in the prompt! Be as creative as you want!
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-1">🎮 How to Play</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Choose a category (animals, food, nature, vehicles, or all)</li>
                <li>Pick free mode (no timer) or timed mode (race against the clock)</li>
                <li>Click "Start Drawing" to begin</li>
                <li>Draw the object using the canvas tools</li>
                <li>Click "I'm Done!" when finished</li>
                <li>Get a new prompt and keep drawing!</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-1">🎨 Modes</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Free Mode:</strong> Take your time and be creative with no pressure!</li>
                <li><strong>Timed Mode:</strong> Challenge yourself to draw within a time limit!</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-1">💡 Tips</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>There's no wrong way to draw!</li>
                <li>Use different colors to make it fun</li>
                <li>Keep challenging yourself with harder prompts</li>
                <li>Complete all {120}+ drawing challenges!</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {gameStatus === 'finished' && !showCanvas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="kid-card max-w-md w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">
              Great Job!
            </h2>

            <p className="text-lg text-slate-700 mb-6">
              You completed the drawing challenge!
            </p>

            <div className="mb-4">
              <p className="text-sm text-slate-600">Challenges Completed</p>
              <p className="text-4xl font-bold text-purple-600">
                {completedChallenges.length}
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                className="kid-button bg-purple-500 hover:bg-purple-600 text-lg"
                onClick={() => {
                  handleNextPrompt();
                }}
              >
                🎲 Next Challenge
              </button>
              <button
                className="kid-button bg-slate-500 hover:bg-slate-600 text-lg"
                onClick={onNavigateHome}
              >
                ← Home
              </button>
            </div>
          </div>
        </div>
      )}
    </GameLayout>
  );
};

export default DrawingChallengePage;
