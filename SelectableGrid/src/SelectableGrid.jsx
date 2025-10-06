import React, { useState, useRef } from "react";
import "./App.css";

export default function SelectableGrid({ rows = 4, cols = 6 }) {
  const totalCells = rows * cols;
  const [selected, setSelected] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const gridRef = useRef(null);

  // Toggle single cell
  const toggleSelect = (index) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      newSet.has(index) ? newSet.delete(index) : newSet.add(index);
      return newSet;
    });
  };

  // Mouse drag selection
  const handleMouseDown = (e) => {
    if (e.target.classList.contains("cell")) {
      setIsDragging(true);
      const index = Number(e.target.dataset.index);
      setSelected((prev) => new Set([...prev, index]));
    }
  };

  const handleMouseOver = (e) => {
    if (isDragging && e.target.classList.contains("cell")) {
      const index = Number(e.target.dataset.index);
      setSelected((prev) => new Set([...prev, index]));
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      ref={gridRef}
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 100px)`,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseOver={handleMouseOver}
    >
      {Array.from({ length: totalCells }, (_, i) => (
        <div
          key={i}
          data-index={i}
          className={`cell ${selected.has(i) ? "selected" : ""}`}
          onClick={() => toggleSelect(i)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}
