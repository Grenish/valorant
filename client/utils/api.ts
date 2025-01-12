const API_BASE_URL = 'http://localhost:5000/api/v1';

export interface Ability {
    name: string;
    description: string;
    category: string;
    price?: number;
    cooldown?: number;
    duration?: number;
    range?: string;
    points?: number;
}

export interface Agent {
    id: number;
    name: string;
    roles: string[];
    story: string;
    abilities: Ability[];
    origin: string;
    release_patch: string;
    photos: string[];
}

export async function fetchAgents(): Promise<Agent[]> {
    const response = await fetch(`${API_BASE_URL}/agents`);
    if (!response.ok) throw new Error('Failed to fetch agents');
    const data = await response.json();
    console.log('Raw API response:', data); // Log the raw API response

    if (typeof data === 'object' && !Array.isArray(data)) {
        // If data is an object, extract the agents array
        if (data.agents && Array.isArray(data.agents)) {
            return data.agents;
        } else {
            console.error('Unexpected API response structure:', data);
            return [];
        }
    } else if (Array.isArray(data)) {
        return data;
    } else {
        console.error('Unexpected API response:', data);
        return [];
    }
}

export async function fetchAgentById(id: number): Promise<Agent> {
    const response = await fetch(`${API_BASE_URL}/agents/${id}`);
    if (!response.ok) throw new Error('Failed to fetch agent');
    return response.json();
}

export async function fetchAgentPhotos(id: number): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/agents/${id}/photos`);
    if (!response.ok) throw new Error('Failed to fetch agent photos');
    return response.json();
}

