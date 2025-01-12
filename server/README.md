# Valorant Agents API Documentation

## Overview
The Valorant Agents API provides detailed information about agents in Valorant, including their abilities, roles, backstories, origins, and release details. This unofficial API is designed for developers who wish to integrate Valorant agent data into their applications, websites, or tools.

---

## Base URL
```
http://localhost:5000/api/v1/agents
```

(Note: This API is not hosted and is currently only available for local testing.)

---

## Endpoints

### 1. Get All Agents
**Endpoint:** `/api/v1/agents`

**Description:** Fetch a list of all agents with basic information.

**Method:** GET

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Brimstone",
    "roles": ["Controller"],
    "origin": "USA"
    ...
  },
  {
    "id": 2,
    "name": "Viper",
    "roles": ["Controller"],
    "origin": "USA"
    ...
  }
]
```

---

### 2. Get Agent by ID
**Endpoint:** `/api/v1/agents/{id}`

**Description:** Fetch detailed information about a specific agent by their ID.

**Method:** GET

**Path Parameters:**
- `id` (integer): The unique ID of the agent.

**Response Example:**
```json
{
  "id": 1,
  "name": "Brimstone",
  "roles": ["Controller"],
  "story": "Brimstone is a former firefighter...",
  "abilities": [
    {
      "name": "Incendiary",
      "description": "Launch a grenade...",
      "category": "Basic",
      "price": 250
    },
    {
      "name": "Stim Beacon",
      "description": "Target a nearby location...",
      "category": "Basic",
      "price": 200
    }
  ],
  "origin": "USA",
  "release_patch": "Beta",
  "photos": [
    "https://res.cloudinary.com/dwgsvtusk/image/upload/v1736708241/Brimstone_w8vw84.png"
  ]
}
```

---

### 3. Search Agents
**Endpoint:** `/api/v1/agents/search`

**Description:** Search for agents by name, role, or origin.

**Method:** GET

**Query Parameters:**
- `q` (string, required): Search term to filter agents by name.

**Response Example:**
```json
[
  {
    "id": 2,
    "name": "Viper",
    "roles": ["Controller"],
    "origin": "USA"
  }
]
```

---

### 4. Get All Agent Photos
**Endpoint:** `/api/v1/agents/photos`

**Description:** Fetch photos of all agents.

**Method:** GET

**Response Example:**
```json
{
  "success": true,
  "data": [
    "https://res.cloudinary.com/dwgsvtusk/image/upload/v1736708241/Brimstone_w8vw84.png",
    "https://res.cloudinary.com/dwgsvtusk/image/upload/v1736708246/Viper_gyqkfx.png"
  ]
}
```

---

### 5. Get Agent Photos by ID
**Endpoint:** `/api/v1/agents/{id}/photos`

**Description:** Fetch photos for a specific agent by their ID.

**Method:** GET

**Path Parameters:**
- `id` (integer): The unique ID of the agent.

**Response Example:**
```json
{
  "success": true,
  "data": [
    "https://res.cloudinary.com/dwgsvtusk/image/upload/v1736708241/Brimstone_w8vw84.png"
  ]
}
```

---

### 6. Documentation Guide
**Endpoint:** `/docs`

**Description:** Access the comprehensive API documentation and usage guide.

**Method:** GET

---

### 7. Server Status
**Endpoint:** `/ping`

**Description:** Check the API server status.

**Method:** GET

**Response Example:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-13T12:00:00Z"
}
```

---

## Error Codes

| Status Code | Description                  |
|-------------|------------------------------|
| 200         | Request successful           |
| 400         | Bad request                  |
| 404         | Agent not found              |
| 500         | Internal server error        |

---

## Notes
- This API is a personal project.
- This API is **unofficial** and intended for local development and testing purposes.
