"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/agents")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching agents:", error);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-white text-xl animate-pulse">Loading agents...</p>
      </div>
    );

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <header className="text-center py-10">
        <h1 className="valo-font text-6xl text-red-600 select-none drop-shadow-lg">
          Valorant Agents
        </h1>
      </header>
      <main className="max-w-7xl mx-auto p-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-gray-800 p-5 rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              <img
                src={agent.photos}
                alt={`${agent.name}'s photo`}
                className="rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold text-red-500 mb-2">
                {agent.name}
              </h2>
              <p className="text-sm text-gray-400">{agent.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
