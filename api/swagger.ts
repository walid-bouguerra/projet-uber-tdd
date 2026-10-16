export const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Uber TDD API",
        version: "1.0.0",
        description: "API de réservation de courses, estimation de prix et gestion des rides.",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Serveur local de développement",
        },
    ],
    paths: {
        "/rides": {
            post: {
                summary: "Réserver un trajet",
                tags: ["Rides"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["rider", "from", "to", "distance"],
                                properties: {
                                    rider: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            balance: { type: "number" },
                                            birthDate: { type: "string", format: "date-time" },
                                        },
                                    },
                                    from: { type: "string" },
                                    to: { type: "string" },
                                    distance: { type: "number" },
                                    uberX: { type: "boolean" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: "Ride booked" },
                    400: { description: "Paramètres manquants" },
                    422: { description: "The ride cannot be booked" },
                },
            },
        },
        "/rides/{id}/cancel": {
            post: {
                summary: "Annuler un trajet",
                tags: ["Rides"],
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["rider"],
                                properties: {
                                    rider: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            balance: { type: "number" },
                                            birthDate: { type: "string", format: "date-time" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Ride cancelled" },
                    409: { description: "Ride already cancelled" },
                },
            },
        },
        "/riders/{riderId}/rides": {
            get: {
                summary: "Lister les trajets d'un rider",
                tags: ["Riders"],
                parameters: [
                    {
                        in: "path",
                        name: "riderId",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    200: { description: "Liste des trajets" },
                },
            },
        },
        "/rides/estimate": {
            post: {
                summary: "Estimer le prix d'un trajet",
                tags: ["Rides"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["rider", "from", "to", "distance"],
                                properties: {
                                    rider: {
                                        type: "object",
                                        properties: {
                                            id: { type: "string" },
                                            balance: { type: "number" },
                                            birthDate: { type: "string", format: "date-time" },
                                        },
                                    },
                                    from: { type: "string" },
                                    to: { type: "string" },
                                    distance: { type: "number" },
                                    uberX: { type: "boolean" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Estimation calculée" },
                    400: { description: "Paramètres manquants" },
                },
            },
        },
        "/rides/book": {
            post: {
                summary: "Réserver avec un token d'estimation",
                tags: ["Rides"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["token"],
                                properties: {
                                    token: { type: "string" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: "Ride booked" },
                    404: { description: "Unknown token" },
                    410: { description: "Expired token" },
                    409: { description: "Token already used" },
                },
            },
        },
    },
} as const;
