import { useState } from "react";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateRoadmap = async () => {
    setLoading(true);
    setRoadmap([]); 
    try {
      const response = await fetch(
        "http://localhost:5000/api/generate-roadmap",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
        }
      );
      const data = await response.json();
      setRoadmap(data);
    } catch (error) {
      console.error("API error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
       <h1 className="app-title">AI Learning Roadmap Generator</h1>
  <p className="app-subtitle">
    Turn any goal into a clear, step-by-step learning path ✨
  </p>
      <input
        className="topic-input"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter your learning goal"
        disabled={loading}
      />
      <button
        className="generate-btn"
        onClick={generateRoadmap}
        disabled={loading || !topic.trim()}
      >
        {loading ? "Generating..." : "Generate Roadmap"}
      </button>

      {roadmap.length > 0 && (
        <div className="roadmap">
          {roadmap.map((step, idx) => (
            <div key={step.id} className="roadmap-step">
              <h3 className="step-title">{step?.title}</h3>
              <p className="step-desc">{step?.description}</p>
              <p className="step-time">{step?.estimated_time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;