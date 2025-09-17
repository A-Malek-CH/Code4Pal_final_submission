// components/map-game/interactive-historical-game.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";

import {
  Compass,
  Trophy,
  Clock,
  Star,
  RotateCcw,
  RefreshCw,
  XCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2, 
  MapPin,
} from "lucide-react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-leaflet";
// @ts-ignore
import { filterByDate } from "@openhistoricalmap/maplibre-gl-dates";

// --- Type Definitions (No Changes Here) ---
interface HistoricalEvent {
  id: string;
  name: string;
  description?: string;
  actualYear?: number;
  actualCoordinates?: [number, number];
  location?: string;
  startDate?: string; 
  endDate?: string;
  actorLinks?: any[];
}
interface GameEvent extends HistoricalEvent {
  isPlaced?: boolean;
  score?: number;
}
interface GameState {
  events: GameEvent[];
  totalScore: number;
}
interface InteractiveHistoricalMapProps {
  events: HistoricalEvent[];
  levelId: number;
  gameMode?: boolean;
}

export function InteractiveHistoricalMap({
  events: propEvents = [],
  levelId,
  gameMode = false,
}: InteractiveHistoricalMapProps) {
  // --- All State and Refs (No Changes Here) ---
  const [currentYear, setCurrentYear] = useState(1948);
  const [mapReady, setMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const maplibreMapRef = useRef<any>(null);
  const activeMarkerRef = useRef<L.Marker | null>(null);
  const [gameState, setGameState] = useState<GameState>({ events: [], totalScore: 0 });
  const [selectedEventForPlacement, setSelectedEventForPlacement] = useState<GameEvent | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const passingScore = (propEvents.length * 100) * 0.6;
  const completedEvents = gameState.events.filter(e => e.isPlaced).length;
  const totalEvents = gameState.events.length;
  const progressPercentage = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

  // --- All useEffect and handler functions (No Changes to Logic) ---
  useEffect(() => {
    if (gameMode) {
      setGameState({ events: propEvents.map(e => ({ ...e, isPlaced: false })), totalScore: 0 });
    }
  }, [gameMode, propEvents]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current).setView([31.9522, 35.2332], 7);
    mapRef.current = map;
    const gl = (L as any).maplibreGL({ style: "https://www.openhistoricalmap.org/map-styles/main/main.json" }).addTo(map);
    maplibreMapRef.current = gl.getMaplibreMap();
    maplibreMapRef.current.once("styledata", () => {
      filterByDate(maplibreMapRef.current, `${currentYear}-01-01`);
      setMapReady(true);
    });
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    if (maplibreMapRef.current && mapReady) {
      filterByDate(maplibreMapRef.current, `${currentYear}-01-01`);
    }
  }, [currentYear, mapReady]);

  const handleEventSelectForPlacement = (event: GameEvent) => {
    if (event.isPlaced || activeMarkerRef.current || feedback) return;
    setSelectedEventForPlacement(event);
    if (mapRef.current) {
        const marker = L.marker(mapRef.current.getCenter(), {
            draggable: true,
            // Change: Use the primary background color for the marker
            icon: L.divIcon({ className: 'draggable-map-marker bg-primary' })
        }).addTo(mapRef.current);
        activeMarkerRef.current = marker;
    }
  };

  const handleEventPlacement = () => {
    if (!activeMarkerRef.current || !selectedEventForPlacement || gameStatus !== 'playing') return;
    const { lat, lng } = activeMarkerRef.current.getLatLng();
    const userCoords: [number, number] = [lat, lng];
    const event = selectedEventForPlacement;
    const R = 6371;
    const dLat = (event.actualCoordinates![0] - userCoords[0]) * Math.PI / 180;
    const dLon = (event.actualCoordinates![1] - userCoords[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(userCoords[0] * Math.PI / 180) * Math.cos(event.actualCoordinates![0] * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    const yearDiff = Math.abs(event.actualYear! - currentYear);
    const isLocationCorrect = distance < 200;
    const isYearCorrect = yearDiff < 25;
    const isCorrect = isLocationCorrect && isYearCorrect;
    const score = isCorrect ? 100 : 0;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    activeMarkerRef.current.remove();
    activeMarkerRef.current = null;
    setTimeout(() => {
      setFeedback(null);
      const newGameState = {
        ...gameState,
        events: gameState.events.map(e => e.id === selectedEventForPlacement.id ? { ...e, isPlaced: true, score } : e),
        totalScore: gameState.totalScore + score
      };
      setGameState(newGameState);
      setSelectedEventForPlacement(null);
      const allEventsPlaced = newGameState.events.every(e => e.isPlaced);
      if (allEventsPlaced) {
        if (newGameState.totalScore >= passingScore) {
          setGameStatus('won');
        } else {
          setGameStatus('lost');
        }
      }
    }, 1500);
  };

  const resetGame = () => window.location.reload();

  return (
    // Change: Use the main background color for the page
    <div className="relative space-y-6 p-4 sm:p-6 bg-background min-h-screen">

      <Card className="border-2 shadow-lg">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/games/map/${levelId > 101 ? levelId - 1 : ''}`} className={levelId <= 101 ? 'pointer-events-none' : ''}>
              <Button variant="outline" size="icon" disabled={levelId <= 101}><ArrowLeft/></Button>
            </Link>
            <div className="text-center">
              {/* Change: Use muted foreground for secondary text */}
              <div className="text-sm text-muted-foreground">Level</div>
              <div className="text-2xl font-bold">{levelId}</div>
            </div>
            <Link href={`/games/map/${levelId + 1}`}>
              <Button variant="outline" size="icon"><ArrowRight/></Button>
            </Link>
          </div>
          
          <div className="flex-grow max-w-xs mx-4">
              <div className="flex justify-between mb-1">
                  {/* Change: Use primary color for progress text */}
                  <span className="text-base font-medium text-primary">Progress</span>
                  <span className="text-sm font-medium text-primary">{completedEvents} / {totalEvents}</span>
              </div>
              {/* Change: Use muted for the progress bar background and primary for the fill */}
              <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
                {/* Change: Use muted foreground for secondary text */}
                <div className="text-sm text-muted-foreground">Score</div>
                {/* Change: Use primary for the score text */}
                <div className="text-2xl font-bold text-primary flex items-center gap-2">
                    {/* Change: Use a defined 'star' color for the icon */}
                    <Star className="w-6 h-6 text-star"/>
                    {gameState.totalScore}
                </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                    <div className="relative h-[500px] lg:h-[620px] m-2 rounded-xl overflow-hidden border-4 shadow-inner">
                    <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} className="bg-muted">
                        {/* Change: Use primary color for loading text/icon */}
                        {!mapReady && <div className="p-4 flex items-center justify-center h-full"><Compass className="animate-spin h-8 w-8 text-primary" /> <span className="ml-4 text-lg">Loading Map...</span></div>}
                    </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <Card className="border-2 shadow-xl">
            <CardHeader className="pb-2">
                {/* Change: Use primary for the icon color */}
                <CardTitle className="text-xl flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Events to Place</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[450px] overflow-y-auto p-4">
                {gameState.events.map((event) => {
                const isSelected = event.id === selectedEventForPlacement?.id;
                {/* Change: Use chart and destructive colors for feedback */}
                const feedbackClass = feedback && isSelected ? (feedback === 'correct' ? 'bg-chart-1/20 border-chart-1' : 'bg-destructive/20 border-destructive') : '';
                
                if (event.isPlaced) {
                    return (
                    // Change: Use chart-1 color for success/placed items
                    <div key={event.id} className="p-3 rounded-lg bg-chart-1/10 border border-chart-1/50 flex items-center gap-4">
                        <CheckCircle2 className="h-6 w-6 text-chart-1 flex-shrink-0"/>
                        <div>
                            <h4 className="font-semibold text-foreground">{event.name}</h4>
                            <p className="text-sm font-bold text-primary">Score: {event.score}pts</p>
                        </div>
                    </div>
                    );
                }
                
                return (
                    <div
                    key={event.id}
                    onClick={() => handleEventSelectForPlacement(event)}
                    // Change: Use official border, accent, and background colors
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ease-in-out hover:border-primary hover:shadow-md
                        ${isSelected ? 'border-star scale-105 shadow-xl bg-card' : 'border-border bg-muted'}
                        ${feedbackClass}`}
                    >
                    <h4 className="font-bold text-foreground">{event.name}</h4>
                    {/* Change: Use muted foreground for description text */}
                    <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>
                );
                })}
            </CardContent>
            </Card>

            <Card className="border-2 shadow-xl sticky top-6">
                <CardHeader className="pb-2"><CardTitle className="text-xl flex items-center gap-2"><Clock className="h-5 w-5" />Temporal Navigator</CardTitle></CardHeader>
                <CardContent className="space-y-4 pt-2 text-center">
                    {/* Change: Use muted foreground for secondary text */}
                    <p className="text-sm text-muted-foreground">Select a year</p>
                    {/* Change: Use muted background and primary text */}
                    <div className="bg-muted p-2 rounded-lg border">
                        <div className="text-center font-bold text-5xl text-primary tracking-wider">{currentYear}</div>
                    </div>
                    <Slider value={[currentYear]} onValueChange={(v) => setCurrentYear(v[0])} min={1917} max={2024} step={1} />
                    <Button 
                        onClick={handleEventPlacement} 
                        size="lg"
                        className="w-full mt-2 text-lg" 
                        disabled={!activeMarkerRef.current || gameStatus !== 'playing'}
                    >
                        <MapPin className="mr-2 h-5 w-5"/>
                        Confirm Placement
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
      
      {(gameStatus === 'won' || gameStatus === 'lost') && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] transition-opacity duration-300">
          <Card className="w-full max-w-md m-4 text-center border-2 shadow-2xl animate-in fade-in-0 zoom-in-95">
            <CardHeader>
              {gameStatus === 'won' ? (
                <>
                  {/* Change: Use star color for trophy icon */}
                  <Trophy className="w-16 h-16 text-star mx-auto animate-bounce" />
                  {/* Change: Use chart-1 color for success title */}
                  <CardTitle className="text-4xl font-black text-chart-1 mt-4">Level Complete!</CardTitle>
                </>
              ) : (
                <>
                  {/* Change: Use destructive color for failure icon and title */}
                  <XCircle className="w-16 h-16 text-destructive mx-auto" />
                  <CardTitle className="text-4xl font-black text-destructive mt-4">Level Failed</CardTitle>
                </>
              )}
            </CardHeader>
            <CardContent className="space-y-6 px-8 pb-8">
              {/* Change: Use muted foreground for secondary text */}
              <div className="text-lg text-muted-foreground">
                <p>Your final score is:</p>
                {/* Change: Use primary for the score text */}
                <p className="text-5xl font-bold text-primary my-2">{gameState.totalScore}</p>
                <p className="text-sm">(Passing score was {passingScore})</p>
              </div>
              {gameStatus === 'won' ? (
                <div className="flex w-full gap-4">
                  <Button onClick={resetGame} variant="outline" className="w-1/2"><RefreshCw className="mr-2 h-4 w-4" />Retry</Button>
                  <Link href={`/games/map/${levelId + 1}`} className="w-1/2"><Button className="w-full">Next Level<ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                </div>
              ) : (
                <Button onClick={resetGame} size="lg" className="w-full"><RotateCcw className="mr-2 h-4 w-4" />Try Again</Button>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// --- Leaflet Icon Fix (No Changes Here) ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});