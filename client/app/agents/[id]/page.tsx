import { fetchAgentById, fetchAgentPhotos, Agent } from "@/utils/api";
import Image from "next/image";

export default async function AgentPage({
  params,
}: {
  params: { id: string };
}) {
  const agentId = parseInt(params.id);
  let agent: Agent | null = null;
  let photos: string[] = [];
  let error: string | null = null;

  try {
    agent = await fetchAgentById(agentId);
    photos = await fetchAgentPhotos(agentId);
  } catch (e) {
    error = e instanceof Error ? e.message : "An unknown error occurred";
    console.error("Error fetching agent data:", e);
  }

  if (error) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Agent not found</h2>
        <p>The requested agent could not be found.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="relative h-64">
        <Image
          src={photos[0] || "/placeholder.svg"}
          alt={agent.name}
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">{agent.name}</h1>
        <p className="text-gray-400 mb-4">{agent.roles.join(", ")}</p>
        <h2 className="text-2xl font-semibold mb-2">Story</h2>
        <p className="mb-4">{agent.story}</p>
        <h2 className="text-2xl font-semibold mb-2">Abilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agent.abilities.map((ability, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{ability.name}</h3>
              <p className="text-sm mb-2">{ability.description}</p>
              <p className="text-xs text-gray-400">
                Category: {ability.category}
              </p>
              {ability.cooldown && (
                <p className="text-xs text-gray-400">
                  Cooldown: {ability.cooldown}s
                </p>
              )}
              {ability.duration && (
                <p className="text-xs text-gray-400">
                  Duration: {ability.duration}s
                </p>
              )}
              {ability.range && (
                <p className="text-xs text-gray-400">Range: {ability.range}</p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative h-40">
                <Image
                  src={photo}
                  alt={`${agent.name} photo ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm text-gray-400">Origin: {agent.origin}</p>
          <p className="text-sm text-gray-400">
            Release Patch: {agent.release_patch}
          </p>
        </div>
      </div>
    </div>
  );
}
