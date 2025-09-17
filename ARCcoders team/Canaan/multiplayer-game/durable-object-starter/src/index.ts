// This is the complete, corrected code for: src/index.ts

import { GameRoom } from './durable-object';
import { QuizGameDO } from './quiz-durable-object';

export interface Env {
	GAME_ROOM: DurableObjectNamespace;
	QUIZ_SESSIONS: DurableObjectNamespace;
}

// --- CORS Headers ---
// These headers tell the browser that it's okay for your frontend to talk to this backend.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allows any origin (for development)
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        // --- Handle CORS Preflight Requests ---
        // The browser sends an OPTIONS request first to ask for permission.
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

		const url = new URL(request.url);
		const path = url.pathname;

        let stub: DurableObjectStub | undefined;
        let id: DurableObjectId | undefined;

		// Routing Logic
		if (path.startsWith('/map/')) {
			const gameId = path.split('/')[2];
			if (!gameId) {
				return new Response('Map Game ID is missing', { status: 400, headers: corsHeaders });
			}
			id = env.GAME_ROOM.idFromName(gameId);
			stub = env.GAME_ROOM.get(id);
		} else if (path.startsWith('/quiz/')) {
			const gameId = path.split('/')[2];
			if (!gameId) {
				return new Response('Quiz Game ID is missing', { status: 400, headers: corsHeaders });
			}
			id = env.QUIZ_SESSIONS.idFromName(gameId);
			stub = env.QUIZ_SESSIONS.get(id);
		} else {
            // If the URL doesn't match either game, return Not Found
            return new Response('Not Found', { status: 404, headers: corsHeaders });
        }

        // --- Get the response from the Durable Object ---
        const response = await stub.fetch(request);

        // --- Add CORS headers to the actual response ---
        // This is the "permission slip" the browser needs to see.
        const newResponse = new Response(response.body, response);
        newResponse.headers.set('Access-Control-Allow-Origin', '*');
        newResponse.headers.append('Vary', 'Origin');

        return newResponse;
	},
};

export { GameRoom, QuizGameDO };