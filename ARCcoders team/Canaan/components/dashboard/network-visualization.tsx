"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react"

interface NetworkVisualizationProps {
  events: any[]
  relationships: any[]
  selectedEvent: string | null
  onEventSelect: (eventId: string | null) => void
}

export function NetworkVisualization({
  events,
  relationships,
  selectedEvent,
  onEventSelect,
}: NetworkVisualizationProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  // Calculate node positions in a circular layout
  const getNodePositions = () => {
    const positions: { [key: string]: { x: number; y: number } } = {}
    const centerX = 300
    const centerY = 200
    const radius = 120

    events.forEach((event, index) => {
      const angle = (index / events.length) * 2 * Math.PI
      positions[event.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    return positions
  }

  const nodePositions = getNodePositions()

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5))
  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
    onEventSelect(null)
  }

  const getConnectionCount = (eventId: string) => {
    return relationships.filter((rel) => rel.sourceEventId === eventId || rel.targetEventId === eventId).length
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Zoom: {Math.round(zoom * 100)}%</span>
        </div>
        <Button variant="outline" size="sm">
          <Maximize2 className="h-4 w-4 mr-2" />
          Fullscreen
        </Button>
      </div>

      {/* Network Visualization */}
      <Card className="bg-muted/20">
        <CardContent className="p-0">
          <div className="relative overflow-hidden" style={{ height: "500px" }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 600 400"
              className="cursor-move"
              style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)` }}
            >
              {/* Relationship Lines */}
              {relationships.map((rel) => {
                const sourcePos = nodePositions[rel.sourceEventId]
                const targetPos = nodePositions[rel.targetEventId]
                if (!sourcePos || !targetPos) return null

                const isHighlighted = selectedEvent === rel.sourceEventId || selectedEvent === rel.targetEventId

                return (
                  <g key={rel.id}>
                    <line
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke={isHighlighted ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth={isHighlighted ? 3 : 2}
                      strokeOpacity={isHighlighted ? 1 : 0.6}
                      markerEnd="url(#arrowhead)"
                    />
                    {/* Relationship Label */}
                    <text
                      x={(sourcePos.x + targetPos.x) / 2}
                      y={(sourcePos.y + targetPos.y) / 2}
                      textAnchor="middle"
                      fontSize="10"
                      fill="hsl(var(--muted-foreground))"
                      className="pointer-events-none"
                    >
                      {rel.relationshipType}
                    </text>
                  </g>
                )
              })}

              {/* Arrow Marker Definition */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--border))" />
                </marker>
              </defs>

              {/* Event Nodes */}
              {events.map((event) => {
                const pos = nodePositions[event.id]
                if (!pos) return null

                const isSelected = selectedEvent === event.id
                const connectionCount = getConnectionCount(event.id)
                const nodeSize = 20 + connectionCount * 3

                return (
                  <g key={event.id}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={nodeSize}
                      fill={isSelected ? "hsl(var(--primary))" : "hsl(var(--card))"}
                      stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--border))"}
                      strokeWidth={isSelected ? 3 : 2}
                      className="cursor-pointer hover:fill-primary/20 transition-colors"
                      onClick={() => onEventSelect(isSelected ? null : event.id)}
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fontSize="10"
                      fill={isSelected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
                      className="pointer-events-none font-medium"
                    >
                      {event.name.split(" ").slice(0, 2).join(" ")}
                    </text>
                    {/* Connection Count Badge */}
                    {connectionCount > 0 && (
                      <circle
                        cx={pos.x + nodeSize - 5}
                        cy={pos.y - nodeSize + 5}
                        r="8"
                        fill="hsl(var(--secondary))"
                        stroke="hsl(var(--background))"
                        strokeWidth="2"
                      />
                    )}
                    {connectionCount > 0 && (
                      <text
                        x={pos.x + nodeSize - 5}
                        y={pos.y - nodeSize + 9}
                        textAnchor="middle"
                        fontSize="8"
                        fill="hsl(var(--secondary-foreground))"
                        className="pointer-events-none font-bold"
                      >
                        {connectionCount}
                      </text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Selected Event Info */}
      {selectedEvent && (
        <Card className="bg-card">
          <CardContent className="p-4">
            {(() => {
              const event = events.find((e) => e.id === selectedEvent)
              const connections = relationships.filter(
                (rel) => rel.sourceEventId === selectedEvent || rel.targetEventId === selectedEvent,
              )

              if (!event) return null

              return (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{event.name}</h3>
                    <Badge variant="outline">{connections.length} connections</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Influences (Outgoing)</h4>
                      <div className="space-y-1">
                        {connections
                          .filter((rel) => rel.sourceEventId === selectedEvent)
                          .map((rel) => (
                            <div key={rel.id} className="text-sm flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {rel.relationshipType}
                              </Badge>
                              <span>{rel.targetEvent.name}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Influenced By (Incoming)</h4>
                      <div className="space-y-1">
                        {connections
                          .filter((rel) => rel.targetEventId === selectedEvent)
                          .map((rel) => (
                            <div key={rel.id} className="text-sm flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {rel.relationshipType}
                              </Badge>
                              <span>{rel.sourceEvent.name}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card className="bg-card">
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
              <span>Selected Event</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-card border-2 border-border"></div>
              <span>Event Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-border"></div>
              <span>Relationship</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-secondary text-xs flex items-center justify-center text-secondary-foreground font-bold">
                3
              </div>
              <span>Connection Count</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
