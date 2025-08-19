import { useState } from 'react';
import { stencilCollections } from '../../data/stencils';
import { Stencil, StencilCategory } from '../../types/Stencil';

interface StencilGalleryProps {
  onStencilSelect: (stencil: Stencil) => void;
}

const StencilGallery = ({ onStencilSelect }: StencilGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<StencilCategory | null>(null);

  const handleCategorySelect = (category: StencilCategory) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };

  const handleStencilClick = (stencil: Stencil) => {
    onStencilSelect(stencil);
  };

  if (selectedCategory) {
    const collection = stencilCollections.find(c => c.category === selectedCategory);
    if (!collection) return null;

    return (
      <div className="kid-card max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBackToCategories}
            className="kid-button bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 text-sm px-4 py-2"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800">
            {collection.emoji} {collection.name} Stencils
          </h2>
          <div className="w-16"></div> {/* Spacer for layout */}
        </div>

        <p className="text-center text-gray-600 mb-6">{collection.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {collection.stencils.map((stencil) => (
            <button
              key={stencil.id}
              onClick={() => handleStencilClick(stencil)}
              className="kid-card p-4 text-center hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 active:scale-95"
              style={{ minHeight: '120px' }}
            >
              <div className="text-4xl mb-2">{stencil.thumbnail}</div>
              {/* Debug: Show SVG preview */}
              <div className="w-16 h-16 mx-auto mb-2 border border-gray-200 rounded">
                <svg viewBox={stencil.viewBox} width="100%" height="100%">
                  <path 
                    d={stencil.svgPath} 
                    fill="none" 
                    stroke="#000000" 
                    strokeWidth="2"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1">{stencil.name}</h3>
              <p className="text-xs text-gray-600">{stencil.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="kid-card max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          🎨 Choose a Stencil to Color
        </h2>
        <p className="text-lg text-gray-600">
          Pick a category and find the perfect outline to fill with colors!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stencilCollections.map((collection) => (
          <button
            key={collection.category}
            onClick={() => handleCategorySelect(collection.category)}
            className="kid-card p-6 text-center hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 active:scale-95"
            style={{ minHeight: '140px' }}
          >
            <div className="text-5xl mb-3">{collection.emoji}</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{collection.name}</h3>
            <p className="text-sm text-gray-600">{collection.description}</p>
            <div className="mt-3 text-xs text-primary-600 font-medium">
              {collection.stencils.length} stencil{collection.stencils.length !== 1 ? 's' : ''}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          💡 <strong>Tip:</strong> Choose a stencil and then use colors and the fill tool to create beautiful artwork!
        </p>
      </div>
    </div>
  );
};

export default StencilGallery;