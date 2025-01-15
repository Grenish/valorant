import { serve } from "bun";
import { readFile, writeFile } from "fs/promises";
import { randomBytes } from "crypto";

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

// Generate a random API key
function generateApiKey(): string {
    return randomBytes(32).toString("hex").toUpperCase();
}

async function saveApiKey(apiKey: string) {
    try {
        const data = await readFile("./api-keys.json", "utf-8");
        const keys = JSON.parse(data);
        keys.apiKeys.push(apiKey);
        await writeFile("./api-keys.json", JSON.stringify(keys, null, 2));
        console.log("API key saved:", apiKey);
    } catch (error) {
        console.error("Failed to save API key:", error);
    }
}

// Validate API key
async function validateApiKey(request: Request): Promise<boolean> {
    try {
        const data = await readFile("./api-keys.json", "utf-8");
        const keys = JSON.parse(data).apiKeys;
        const apiKey = request.headers.get("x-api-key");
        return keys.includes(apiKey || "");
    } catch (error) {
        console.error("Failed to validate API key:", error);
        return false;
    }
}

// Helper to create JSON responses
function jsonResponse(data: any, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });
}

// Load agents data initially
loadAgents();

// Serve the API
serve({
    async fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Validate API key for all protected routes
        if (path !== "/ping" && path !== "/api/v1/docs" && path !== "/generate-api-key") {
            if (!(await validateApiKey(request))) {
                return jsonResponse({ success: false, message: "Invalid or missing API key" }, 403);
            }
        }

        // Home route
        if (path === "/") {
            return jsonResponse({
                success: true,
                message: "Welcome to the Valorant Agents API!",
                documentation: "/api/v1/docs",
            });
        }

        // Get all agents
        if (path === "/api/v1/agents") {
            return jsonResponse({ success: true, data: agents });
        }

        // Get agent by ID
        const matchAgentById = path.match(/^\/api\/v1\/agents\/(\d+)$/);
        if (matchAgentById) {
            const agentId = parseInt(matchAgentById[1]);
            const agent = agents.find((a) => a.id === agentId);

            if (!agent) {
                return jsonResponse({ success: false, message: "Agent not found" }, 404);
            }

            return jsonResponse({ success: true, data: agent });
        }

        // Get photos by agent ID
        const matchPhotosById = path.match(/^\/api\/v1\/agents\/(\d+)\/photos$/);
        if (matchPhotosById) {
            const agentId = parseInt(matchPhotosById[1]);
            const agent = agents.find((a) => a.id === agentId);

            if (!agent) {
                return jsonResponse({ success: false, message: "Agent not found" }, 404);
            }

            return jsonResponse({ success: true, data: agent.photos });
        }

        // Get all photos from all agents
        if (path === "/api/v1/agents/photos") {
            const allPhotos = agents.flatMap((agent) => agent.photos);
            return jsonResponse({ success: true, data: allPhotos });
        }

        // Filter agents by role
        if (path === "/role/sentinel") {
            const sentinels = agents.filter((agent) =>
                agent.roles.some((role) => role.toLowerCase() === "sentinel")
            );
            return jsonResponse({ success: true, data: sentinels });
        }

        if (path === "/role/initiator") {
            const initiators = agents.filter((agent) =>
                agent.roles.some((role) => role.toLowerCase() === "initiator")
            );
            return jsonResponse({ success: true, data: initiators });
        }

        if (path === "/role/controller") {
            const controllers = agents.filter((agent) =>
                agent.roles.some((role) => role.toLowerCase() === "controller")
            );
            return jsonResponse({ success: true, data: controllers });
        }

        if (path === "/role/duelist") {
            const duelists = agents.filter((agent) =>
                agent.roles.some((role) => role.toLowerCase() === "duelist")
            );
            return jsonResponse({ success: true, data: duelists });
        }

        // Generate a new API key
        if (path === "/generate-api-key") {
            const adminKey = request.headers.get("x-admin-key");
            if (adminKey !== "your-secure-admin-key") {
                return jsonResponse({ success: false, message: "Unauthorized" }, 403);
            }

            const newApiKey = generateApiKey();
            await saveApiKey(newApiKey);
            return jsonResponse({ success: true, apiKey: newApiKey });
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
                        "Roles Only": {
                            "/role/sentinel": "Get all Sentinel agents",
                            "/role/initiator": "Get all Initiator agents",
                            "/role/controller": "Get all Controller agents",
                            "/role/duelist": "Get all Duelist agents",
                        },
                        "/generate-api-key": "Generate a new API key (requires admin key)",
                        "/ping": "Check if the server is running",
                    },
                    example: {
                        list_agents: "/api/v1/agents",
                        single_agent: "/api/v1/agents/1",
                        all_photos: "/api/v1/agents/photos",
                        agent_photos: "/api/v1/agents/1/photos",
                        search_agent: "/api/v1/agents/search?q=jett",
                        sentinels: "/role/sentinel",
                        duelists: "/role/duelist",
                        generate_key: "/generate-api-key",
                        server_ping: "/ping",
                    },
                },
            });
        }

        // Ping route
        if (path === "/ping") {
            return new Response("pong");
        }

        // 404 for unmatched routes
        return jsonResponse({ success: false, message: "Endpoint not found" }, 404);
    },
    port: parseInt(process.env.PORT || "5000"),
});
