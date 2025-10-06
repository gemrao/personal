import React, { useState } from "react";
import "./App.css";

export default function DraggableGrid({ rows = 3, cols = 4 }) {
  // total grid cells = rows * cols
  const totalCells = rows * cols;
  const [items, setItems] = useState(
    Array.from({ length: totalCells }, (_, i) => `${i + 1}`)
  );
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (index === draggedIndex) return;
    const newItems = [...items];
    const dragged = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, dragged);
    setDraggedIndex(index);
    setItems(newItems);
  };

  const handleDrop = () => setDraggedIndex(null);

  return (
    <div
      className="grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 120px)`,
      }}
    >
      {items.map((item, index) => (
        <div
          key={item}
          className={`item ${draggedIndex === index ? "dragging" : ""}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDrop={handleDrop}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
