// app/games/map/lobby/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Gamepad2, Hash } from 'lucide-react';

export default function MultiplayerLobbyPage() {
  const [roomName, setRoomName] = useState('game123'); // Default room name
  const router = useRouter();

  const handleJoinGame = () => {
    if (roomName.trim() === '') {
      alert('Please enter a room name.');
      return;
    }
    // Navigate the user to the correct multiplayer game URL
    router.push(`/games/map/${roomName}`);
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-900">
      <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 w-full max-w-md">
        <Users size={48} className="text-yellow-400 mx-auto mb-6" />
        <h1 className="text-5xl font-bold text-white mb-4">Multiplayer Lobby</h1>
        <p className="text-xl text-gray-400 mb-8">
          Enter a room name to Join or create game.
        </p>
        
        <div className="flex flex-col gap-4">
            <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g., game123"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                />
            </div>
            <button 
                onClick={handleJoinGame}
                className="flex items-center justify-center w-full px-8 py-4 bg-green-500 text-white font-bold rounded-full text-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
            >
                <Gamepad2 className="mr-2" />
                Join the Game
            </button>
        </div>

      </div>
    </div>
  );
}