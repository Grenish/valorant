import { serve } from "bun";
import { readFile } from "fs/promises";

interface Agent {
    id: number;
    name: string;
    roles: string[];
    story: string;
    abilities: {
        name: string;
        description: string;
        category: string;
        price?: number;
        cooldown?: number;
        duration?: number;
        range?: string;
        points?: number;
    }[];
    origin: string;
    release_patch: string;
    photos: string[];
}

let agents: Agent[] = [];

async function loadAgents() {
    try {
        const data = await readFile("./valorant-agents-v1.json", "utf-8");
        agents = JSON.parse(data).agents;
    } catch (error) {
        console.error("Failed to load agents data:", error);
    }
}

function jsonResponse(data: any, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });
}

loadAgents();

serve({
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Home route
        if (path === "/") {
            return jsonResponse({
                success: true,
                message: "Welcome to the Valorant Agents API!",
                documentation: "/api/v1/docs",
            });
        }

        // GET all photos from all agents
        if (path === "/api/v1/agents/photos") {
            const allPhotos = agents.flatMap((agent) => agent.photos);
            return jsonResponse({ success: true, data: allPhotos });
        }

        // GET photos by agent ID
        const matchPhotosById = path.match(/^\/api\/v1\/agents\/(\d+)\/photos$/);
        if (matchPhotosById) {
            const agentId = parseInt(matchPhotosById[1]);
            const agent = agents.find((a) => a.id === agentId);

            if (!agent) {
                return jsonResponse({ success: false, message: "Agent not found" }, 404);
            }

            return jsonResponse({ success: true, data: agent.photos });
        }

        // All agents
        if (path === "/api/v1/agents") {
            return jsonResponse({ success: true, data: agents });
        }

        // Single agent by ID
        const match = path.match(/^\/api\/v1\/agents\/(\d+)$/);
        if (match) {
            const agentId = parseInt(match[1]);
            const agent = agents.find((a) => a.id === agentId);

            if (!agent) {
                return jsonResponse({ success: false, message: "Agent not found" }, 404);
            }

            return jsonResponse({ success: true, data: agent });
        }

        if (path === "/ping") {
            return new Response("pong");
        }

        // Documentation route
        if (path === "/api/v1/docs") {
            return jsonResponse({
                success: true,
                documentation: {
                    endpoints: {
                        "/api/v1/agents": "Get a list of all agents",
                        "/api/v1/agents/{id}": "Get details of a specific agent by ID",
                        "/api/v1/agents/photos": "Get photos from all agents",
                        "/api/v1/agents/{id}/photos": "Get photos for a specific agent by ID",
                        "/ping": "Check if the server is running",
                    },
                    example: {
                        list_agents: "/api/v1/agents",
                        single_agent: "/api/v1/agents/1",
                        all_photos: "/api/v1/agents/photos",
                        agent_photos: "/api/v1/agents/1/photos",
                        server_ping: "/ping",
                    },
                },
            });
        }

        // 404 for unmatched routes
        return jsonResponse({ success: false, message: "Endpoint not found" }, 404);
    },
    port: parseInt(process.env.PORT || "5000"),
});

// Extend globalThis to include `count`
declare global {
    var count: number;
}

// Log port only once when the server starts
if (globalThis.count === 1) {
    console.log(`Server is running on port ${process.env.PORT || "3000"}`);
}

// Initialize the counter
globalThis.count = globalThis.count || 0;
globalThis.count++;
console.log(`Server reloaded ${globalThis.count} time(s)`);
