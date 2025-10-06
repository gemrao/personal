import React, { useState } from "react";

export default function SmartFilterList() {
  const [items, setItems] = useState([
    "Apple",
    "Banana",
    "Orange",
    "Mango",
    "Grapes",
  ]);
  const [query, setQuery] = useState("");

  // Filter list by query
  const filtered = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  // Can we show the Add button?
  const canAdd = filtered.length === 0 && query.trim().length >= 3;

  const handleAdd = () => {
    const newItem = query.trim();
    if (newItem && !items.some(i => i.toLowerCase() === newItem.toLowerCase())) {
      setItems([...items, newItem]);
      setQuery(""); // clear input
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 400, margin: "0 auto" }}>
      <h2 style={{ color: "#b8860b", marginBottom: "1rem" }}>
        Fruit List 🍎
      </h2>

      {/* One input for both search and add */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Type to filter or add..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "0.6rem",
            border: "2px solid #d4af37",
            borderRadius: "0.5rem",
            outline: "none",
          }}
        />
        {canAdd && (
          <button
            onClick={handleAdd}
            style={{
              background: "#d4af37",
              color: "white",
              border: "none",
              padding: "0.6rem 1rem",
              borderRadius: "0.5rem",
              cursor: "pointer",
              fontWeight: "bold",
              whiteSpace: "nowrap",
            }}
          >
            Add
          </button>
        )}
      </div>

      {/* Filtered list */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.length > 0 ? (
          filtered.map((item, i) => (
            <li
              key={i}
              style={{
                padding: "0.5rem",
                borderBottom: "1px solid #eee",
                color: "#333",
              }}
            >
              {item}
            </li>
          ))
        ) : (
          <li style={{ color: "gray" }}>
            {query.length > 0 ? "No matches found" : "Start typing..."}
          </li>
        )}
      </ul>
    </div>
  );
}
