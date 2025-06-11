import React, { useState } from 'react';

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export default function MemoryActivity({ items = [], instructions = '', title = '', onSubmit, disabled = false }) {
  // items: [{ name: 'Apple', target: '🍎' }, ...] - Note: using 'target' instead of 'pair' for consistency
  const pairs = items.flatMap((item) => [
    { ...item, id: `${item.name}-name`, display: item.name, type: 'name' },
    { ...item, id: `${item.name}-target`, display: item.target || item.pair, type: 'target' },
  ]);
  const [cards, setCards] = useState(shuffle(pairs));
  const [flipped, setFlipped] = useState([]); // [index, index]
  const [matched, setMatched] = useState([]); // [index, ...]
  const [completed, setCompleted] = useState(false);

  const handleFlip = (idx) => {
    if (disabled || flipped.includes(idx) || matched.includes(idx) || flipped.length === 2) return;
    setFlipped((prev) => [...prev, idx]);
  };

  React.useEffect(() => {
    if (flipped.length === 2) {
      const [i, j] = flipped;
      if (
        cards[i].name === cards[j].name &&
        cards[i].type !== cards[j].type
      ) {
        setTimeout(() => {
          setMatched((prev) => [...prev, i, j]);
          setFlipped([]);
        }, 700);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
    }
  }, [flipped, cards]);

  React.useEffect(() => {
    if (matched.length === cards.length && cards.length > 0 && !completed) {
      setCompleted(true);
      if (onSubmit) onSubmit();
    }
  }, [matched, cards, completed, onSubmit]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2 text-center">{title}</h2>
      <p className="mb-4 text-center">{instructions}</p>
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <div
              key={card.id}
              className={`w-16 h-20 flex items-center justify-center rounded shadow border cursor-pointer text-lg font-bold select-none transition-all duration-200 ${isFlipped ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} hover:bg-blue-100`}
              onClick={() => handleFlip(idx)}
            >
              {isFlipped ? (
                typeof card.display === 'string' && card.display.match(/^https?:\/\//)
                  ? <img src={card.display} alt="" className="w-10 h-10 object-contain" />
                  : <span className="text-2xl select-none">{card.display}</span>
              ) : '?'}
            </div>
          );
        })}
      </div>
      {completed && <div className="mt-4 text-green-600 font-bold">All pairs matched! <span className="text-2xl">🎉</span></div>}
    </div>
  );
} 