/**
 * Math Facts Game Page
 * Practice arithmetic skills
 */

import React, { useState } from 'react';
import { useMathFacts } from '../../../hooks/useMathFacts';
import GameLayout from '../../shared/GameLayout';
import type { Difficulty } from './types';

interface MathFactsPageProps {
  onNavigateHome: () => void;
}

const MathFactsPage: React.FC<MathFactsPageProps> = ({ onNavigateHome }) => {
  const { gameState, checkAnswer, setDifficulty, resetGame } = useMathFacts();
  const [userInput, setUserInput] = useState('');

  const { currentQuestion, score, correct, incorrect, streak, difficulty } = gameState;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = parseInt(userInput, 10);
    if (!isNaN(answer)) {
      checkAnswer(answer);
      setUserInput('');
    }
  };

  const getOperationSymbol = (op: string) => {
    return op === 'add' ? '+' : op === 'subtract' ? '-' : '×';
  };

  const headerActions = (
    <>
      <div className="flex gap-1">
        {(['easy', 'medium', 'hard'] as const).map(d => (
          <button
            key={d}
            aria-label={d === 'easy' ? 'Easy' : d === 'medium' ? 'Medium' : 'Hard'}
            onClick={() => setDifficulty(d as Difficulty)}
            className={`kid-button text-base md:text-lg px-2 md:px-3 py-1 md:py-2 ${
              difficulty === d ? '' : 'opacity-50'
            }`}
          >
            {d === 'easy' ? '🐣' : d === 'medium' ? '🐱' : '🦁'}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="kid-button text-xs md:text-sm bg-blue-500 hover:bg-blue-600 px-2 md:px-4 py-1 md:py-2"
      >
        <span className="md:hidden">🔄</span>
        <span className="hidden md:inline">🔄 Reset</span>
      </button>
    </>
  );

  return (
    <GameLayout
      title="Math Facts"
      emoji="🧮"
      onNavigateHome={onNavigateHome}
      headerActions={headerActions}
      bgColorClass="bg-gradient-to-b from-yellow-100 to-green-100"
    >
      {/* Stats */}
      <div className="kid-card max-w-4xl mx-auto mb-4 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-slate-600 font-semibold">Score</p>
            <p className="text-3xl font-bold text-green-600">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600 font-semibold">Correct</p>
            <p className="text-3xl font-bold text-blue-600">{correct}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600 font-semibold">Wrong</p>
            <p className="text-3xl font-bold text-red-600">{incorrect}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-600 font-semibold">Streak</p>
            <p className="text-3xl font-bold text-purple-600">{streak}🔥</p>
          </div>
        </div>
      </div>

      {/* Question */}
      {currentQuestion && (
        <div className="kid-card max-w-xl mx-auto mb-4 p-8 text-center">
          <div className="text-6xl md:text-8xl font-bold text-indigo-800 mb-6">
            {currentQuestion.num1} {getOperationSymbol(currentQuestion.operation)} {currentQuestion.num2} = ?
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label htmlFor="math-answer" className="sr-only">
              Your answer
            </label>
            <input
              id="math-answer"
              type="number"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="kid-input text-4xl text-center py-4"
              placeholder="Your answer"
              autoFocus
            />
            <button type="submit" className="kid-button bg-green-500 hover:bg-green-600 text-2xl py-4">
              ✅ Check Answer
            </button>
          </form>

          {streak >= 5 && (
            <div className="mt-4 text-xl text-orange-600 font-bold animate-pulse">
              🔥 {streak} in a row! Amazing! 🔥
            </div>
          )}
        </div>
      )}

      {/* Instructions - Hidden on mobile */}
      <div className="kid-card max-w-4xl mx-auto hidden md:block">
        <h2 className="text-xl font-bold mb-3 text-center">How to Play</h2>
        <ul className="space-y-2 text-slate-700">
          <li>• Solve the math problem</li>
          <li>• Type your answer and click "Check Answer"</li>
          <li>• Get streaks for bonus points!</li>
          <li>• Choose difficulty: Easy (addition), Medium (+subtraction), Hard (+multiplication)</li>
        </ul>
      </div>
    </GameLayout>
  );
};

export default MathFactsPage;
