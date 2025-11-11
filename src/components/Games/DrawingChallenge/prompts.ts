/**
 * Drawing Challenge Prompts Database
 * 100+ drawing prompts organized by category
 */

import type { Prompt, Category } from './types';

export const prompts: Prompt[] = [
  // Animals (30 prompts)
  { id: 'a1', category: 'animals', text: 'Cat', emoji: '🐱', difficulty: 1 },
  { id: 'a2', category: 'animals', text: 'Dog', emoji: '🐶', difficulty: 1 },
  { id: 'a3', category: 'animals', text: 'Fish', emoji: '🐟', difficulty: 1 },
  { id: 'a4', category: 'animals', text: 'Bird', emoji: '🐦', difficulty: 1 },
  { id: 'a5', category: 'animals', text: 'Butterfly', emoji: '🦋', difficulty: 1 },
  { id: 'a6', category: 'animals', text: 'Rabbit', emoji: '🐰', difficulty: 1 },
  { id: 'a7', category: 'animals', text: 'Mouse', emoji: '🐭', difficulty: 1 },
  { id: 'a8', category: 'animals', text: 'Bear', emoji: '🐻', difficulty: 1 },
  { id: 'a9', category: 'animals', text: 'Frog', emoji: '🐸', difficulty: 1 },
  { id: 'a10', category: 'animals', text: 'Duck', emoji: '🦆', difficulty: 1 },
  { id: 'a11', category: 'animals', text: 'Elephant', emoji: '🐘', difficulty: 2 },
  { id: 'a12', category: 'animals', text: 'Lion', emoji: '🦁', difficulty: 2 },
  { id: 'a13', category: 'animals', text: 'Tiger', emoji: '🐯', difficulty: 2 },
  { id: 'a14', category: 'animals', text: 'Giraffe', emoji: '🦒', difficulty: 2 },
  { id: 'a15', category: 'animals', text: 'Monkey', emoji: '🐵', difficulty: 2 },
  { id: 'a16', category: 'animals', text: 'Panda', emoji: '🐼', difficulty: 2 },
  { id: 'a17', category: 'animals', text: 'Koala', emoji: '🐨', difficulty: 2 },
  { id: 'a18', category: 'animals', text: 'Fox', emoji: '🦊', difficulty: 2 },
  { id: 'a19', category: 'animals', text: 'Owl', emoji: '🦉', difficulty: 2 },
  { id: 'a20', category: 'animals', text: 'Penguin', emoji: '🐧', difficulty: 2 },
  { id: 'a21', category: 'animals', text: 'Turtle', emoji: '🐢', difficulty: 2 },
  { id: 'a22', category: 'animals', text: 'Snail', emoji: '🐌', difficulty: 2 },
  { id: 'a23', category: 'animals', text: 'Ladybug', emoji: '🐞', difficulty: 2 },
  { id: 'a24', category: 'animals', text: 'Bee', emoji: '🐝', difficulty: 2 },
  { id: 'a25', category: 'animals', text: 'Whale', emoji: '🐋', difficulty: 3 },
  { id: 'a26', category: 'animals', text: 'Dolphin', emoji: '🐬', difficulty: 3 },
  { id: 'a27', category: 'animals', text: 'Dinosaur', emoji: '🦕', difficulty: 3 },
  { id: 'a28', category: 'animals', text: 'Unicorn', emoji: '🦄', difficulty: 3 },
  { id: 'a29', category: 'animals', text: 'Dragon', emoji: '🐉', difficulty: 3 },
  { id: 'a30', category: 'animals', text: 'Octopus', emoji: '🐙', difficulty: 3 },

  // Food (25 prompts)
  { id: 'f1', category: 'food', text: 'Apple', emoji: '🍎', difficulty: 1 },
  { id: 'f2', category: 'food', text: 'Banana', emoji: '🍌', difficulty: 1 },
  { id: 'f3', category: 'food', text: 'Orange', emoji: '🍊', difficulty: 1 },
  { id: 'f4', category: 'food', text: 'Strawberry', emoji: '🍓', difficulty: 1 },
  { id: 'f5', category: 'food', text: 'Watermelon', emoji: '🍉', difficulty: 1 },
  { id: 'f6', category: 'food', text: 'Cherry', emoji: '🍒', difficulty: 1 },
  { id: 'f7', category: 'food', text: 'Grapes', emoji: '🍇', difficulty: 1 },
  { id: 'f8', category: 'food', text: 'Ice Cream', emoji: '🍦', difficulty: 1 },
  { id: 'f9', category: 'food', text: 'Cookie', emoji: '🍪', difficulty: 1 },
  { id: 'f10', category: 'food', text: 'Donut', emoji: '🍩', difficulty: 1 },
  { id: 'f11', category: 'food', text: 'Pizza', emoji: '🍕', difficulty: 2 },
  { id: 'f12', category: 'food', text: 'Burger', emoji: '🍔', difficulty: 2 },
  { id: 'f13', category: 'food', text: 'Hot Dog', emoji: '🌭', difficulty: 2 },
  { id: 'f14', category: 'food', text: 'Taco', emoji: '🌮', difficulty: 2 },
  { id: 'f15', category: 'food', text: 'Sushi', emoji: '🍣', difficulty: 2 },
  { id: 'f16', category: 'food', text: 'Cake', emoji: '🎂', difficulty: 2 },
  { id: 'f17', category: 'food', text: 'Cupcake', emoji: '🧁', difficulty: 2 },
  { id: 'f18', category: 'food', text: 'Lollipop', emoji: '🍭', difficulty: 2 },
  { id: 'f19', category: 'food', text: 'Popsicle', emoji: '🍡', difficulty: 2 },
  { id: 'f20', category: 'food', text: 'Popcorn', emoji: '🍿', difficulty: 2 },
  { id: 'f21', category: 'food', text: 'Sandwich', emoji: '🥪', difficulty: 2 },
  { id: 'f22', category: 'food', text: 'Carrot', emoji: '🥕', difficulty: 2 },
  { id: 'f23', category: 'food', text: 'Broccoli', emoji: '🥦', difficulty: 2 },
  { id: 'f24', category: 'food', text: 'Corn', emoji: '🌽', difficulty: 2 },
  { id: 'f25', category: 'food', text: 'Pumpkin', emoji: '🎃', difficulty: 2 },

  // Nature (25 prompts)
  { id: 'n1', category: 'nature', text: 'Sun', emoji: '☀️', difficulty: 1 },
  { id: 'n2', category: 'nature', text: 'Moon', emoji: '🌙', difficulty: 1 },
  { id: 'n3', category: 'nature', text: 'Star', emoji: '⭐', difficulty: 1 },
  { id: 'n4', category: 'nature', text: 'Cloud', emoji: '☁️', difficulty: 1 },
  { id: 'n5', category: 'nature', text: 'Rainbow', emoji: '🌈', difficulty: 1 },
  { id: 'n6', category: 'nature', text: 'Flower', emoji: '🌸', difficulty: 1 },
  { id: 'n7', category: 'nature', text: 'Tree', emoji: '🌳', difficulty: 1 },
  { id: 'n8', category: 'nature', text: 'Mountain', emoji: '⛰️', difficulty: 2 },
  { id: 'n9', category: 'nature', text: 'Beach', emoji: '🏖️', difficulty: 2 },
  { id: 'n10', category: 'nature', text: 'Ocean', emoji: '🌊', difficulty: 2 },
  { id: 'n11', category: 'nature', text: 'Cactus', emoji: '🌵', difficulty: 2 },
  { id: 'n12', category: 'nature', text: 'Mushroom', emoji: '🍄', difficulty: 2 },
  { id: 'n13', category: 'nature', text: 'Leaf', emoji: '🍃', difficulty: 1 },
  { id: 'n14', category: 'nature', text: 'Snowflake', emoji: '❄️', difficulty: 2 },
  { id: 'n15', category: 'nature', text: 'Snowman', emoji: '⛄', difficulty: 2 },
  { id: 'n16', category: 'nature', text: 'Fire', emoji: '🔥', difficulty: 2 },
  { id: 'n17', category: 'nature', text: 'Lightning', emoji: '⚡', difficulty: 2 },
  { id: 'n18', category: 'nature', text: 'Tornado', emoji: '🌪️', difficulty: 3 },
  { id: 'n19', category: 'nature', text: 'Volcano', emoji: '🌋', difficulty: 3 },
  { id: 'n20', category: 'nature', text: 'Earth', emoji: '🌍', difficulty: 2 },
  { id: 'n21', category: 'nature', text: 'Planet', emoji: '🪐', difficulty: 2 },
  { id: 'n22', category: 'nature', text: 'Comet', emoji: '☄️', difficulty: 3 },
  { id: 'n23', category: 'nature', text: 'Galaxy', emoji: '🌌', difficulty: 3 },
  { id: 'n24', category: 'nature', text: 'Sunrise', emoji: '🌅', difficulty: 2 },
  { id: 'n25', category: 'nature', text: 'Night Sky', emoji: '🌃', difficulty: 3 },

  // Vehicles (20 prompts)
  { id: 'v1', category: 'vehicles', text: 'Car', emoji: '🚗', difficulty: 1 },
  { id: 'v2', category: 'vehicles', text: 'Bus', emoji: '🚌', difficulty: 1 },
  { id: 'v3', category: 'vehicles', text: 'Truck', emoji: '🚚', difficulty: 1 },
  { id: 'v4', category: 'vehicles', text: 'Bicycle', emoji: '🚲', difficulty: 1 },
  { id: 'v5', category: 'vehicles', text: 'Boat', emoji: '⛵', difficulty: 1 },
  { id: 'v6', category: 'vehicles', text: 'Airplane', emoji: '✈️', difficulty: 2 },
  { id: 'v7', category: 'vehicles', text: 'Helicopter', emoji: '🚁', difficulty: 2 },
  { id: 'v8', category: 'vehicles', text: 'Rocket', emoji: '🚀', difficulty: 2 },
  { id: 'v9', category: 'vehicles', text: 'Train', emoji: '🚂', difficulty: 2 },
  { id: 'v10', category: 'vehicles', text: 'Police Car', emoji: '🚓', difficulty: 2 },
  { id: 'v11', category: 'vehicles', text: 'Fire Truck', emoji: '🚒', difficulty: 2 },
  { id: 'v12', category: 'vehicles', text: 'Ambulance', emoji: '🚑', difficulty: 2 },
  { id: 'v13', category: 'vehicles', text: 'Tractor', emoji: '🚜', difficulty: 2 },
  { id: 'v14', category: 'vehicles', text: 'Motorcycle', emoji: '🏍️', difficulty: 2 },
  { id: 'v15', category: 'vehicles', text: 'Scooter', emoji: '🛴', difficulty: 2 },
  { id: 'v16', category: 'vehicles', text: 'Skateboard', emoji: '🛹', difficulty: 2 },
  { id: 'v17', category: 'vehicles', text: 'Ship', emoji: '🚢', difficulty: 2 },
  { id: 'v18', category: 'vehicles', text: 'Submarine', emoji: '🚢', difficulty: 3 },
  { id: 'v19', category: 'vehicles', text: 'Hot Air Balloon', emoji: '🎈', difficulty: 2 },
  { id: 'v20', category: 'vehicles', text: 'UFO', emoji: '🛸', difficulty: 3 },

  // Objects (20 prompts)
  { id: 'o1', category: 'objects', text: 'House', emoji: '🏠', difficulty: 1 },
  { id: 'o2', category: 'objects', text: 'Castle', emoji: '🏰', difficulty: 2 },
  { id: 'o3', category: 'objects', text: 'Ball', emoji: '⚽', difficulty: 1 },
  { id: 'o4', category: 'objects', text: 'Balloon', emoji: '🎈', difficulty: 1 },
  { id: 'o5', category: 'objects', text: 'Umbrella', emoji: '☂️', difficulty: 2 },
  { id: 'o6', category: 'objects', text: 'Key', emoji: '🔑', difficulty: 1 },
  { id: 'o7', category: 'objects', text: 'Book', emoji: '📚', difficulty: 1 },
  { id: 'o8', category: 'objects', text: 'Pencil', emoji: '✏️', difficulty: 1 },
  { id: 'o9', category: 'objects', text: 'Guitar', emoji: '🎸', difficulty: 2 },
  { id: 'o10', category: 'objects', text: 'Drum', emoji: '🥁', difficulty: 2 },
  { id: 'o11', category: 'objects', text: 'Trophy', emoji: '🏆', difficulty: 2 },
  { id: 'o12', category: 'objects', text: 'Crown', emoji: '👑', difficulty: 2 },
  { id: 'o13', category: 'objects', text: 'Heart', emoji: '❤️', difficulty: 1 },
  { id: 'o14', category: 'objects', text: 'Gift', emoji: '🎁', difficulty: 2 },
  { id: 'o15', category: 'objects', text: 'Clock', emoji: '🕐', difficulty: 2 },
  { id: 'o16', category: 'objects', text: 'Camera', emoji: '📷', difficulty: 2 },
  { id: 'o17', category: 'objects', text: 'Phone', emoji: '📱', difficulty: 2 },
  { id: 'o18', category: 'objects', text: 'Computer', emoji: '💻', difficulty: 2 },
  { id: 'o19', category: 'objects', text: 'Robot', emoji: '🤖', difficulty: 3 },
  { id: 'o20', category: 'objects', text: 'Light Bulb', emoji: '💡', difficulty: 2 },
];

export const categoryNames: Record<Category, string> = {
  all: '🎨 All',
  animals: '🐾 Animals',
  food: '🍔 Food',
  nature: '🌿 Nature',
  vehicles: '🚗 Vehicles',
  objects: '📦 Objects'
};

export const getPromptsByCategory = (category: Category): Prompt[] => {
  if (category === 'all') {
    return prompts;
  }
  return prompts.filter(p => p.category === category);
};

export const getRandomPrompt = (category: Category, excludeIds: string[] = []): Prompt => {
  const available = getPromptsByCategory(category).filter(
    p => !excludeIds.includes(p.id)
  );

  if (available.length === 0) {
    // If all prompts completed, return random from all
    const allPrompts = getPromptsByCategory(category);
    return allPrompts[Math.floor(Math.random() * allPrompts.length)];
  }

  return available[Math.floor(Math.random() * available.length)];
};
