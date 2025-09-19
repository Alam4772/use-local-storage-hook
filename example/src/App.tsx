import React from "react";
import { useLocalStorage } from "use-local-storage-hook";
import "./App.css";

function App() {
  const [name, setName, clearName] = useLocalStorage<string>("name", "Guest", {
    ttl: 60000,
    namespace: "myApp",
  });

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Hello, {name}!</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "0.5rem", fontSize: "1rem" }}
      />
      <button
        onClick={clearName}
        style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
      >
        Clear
      </button>
    </div>
  );
}

export default App;
