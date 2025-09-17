"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Network,
  Search,
  Filter,
  Plus,
  ArrowRight,
  GitBranch,
  Zap,
  TrendingUp,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { NetworkVisualization } from "./network-visualization"
import { RelationshipForm } from "./relationship-form"

// Mock data - replace with actual Prisma queries
const mockEvents = [
  {
    id: "1",
    name: "The Industrial Revolution",
    startDate: new Date("1760-01-01"),
    location: "Great Britain",
    tags: ["technology", "economy"],
  },
  {
    id: "2",
    name: "French Revolution",
    startDate: new Date("1789-05-05"),
    location: "France",
    tags: ["politics", "revolution"],
  },
  {
    id: "3",
    name: "American Civil War",
    startDate: new Date("1861-04-12"),
    location: "United States",
    tags: ["war", "politics"],
  },
  {
    id: "4",
    name: "Abolition of Slavery",
    startDate: new Date("1865-12-06"),
    location: "United States",
    tags: ["politics", "society"],
  },
]

const mockRelationships = [
  {
    id: "1",
    sourceEventId: "1",
    targetEventId: "2",
    relationshipType: "INFLUENCED",
    sourceEvent: mockEvents[0],
    targetEvent: mockEvents[1],
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    sourceEventId: "2",
    targetEventId: "3",
    relationshipType: "INSPIRED",
    sourceEvent: mockEvents[1],
    targetEvent: mockEvents[2],
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    sourceEventId: "3",
    targetEventId: "4",
    relationshipType: "CAUSED",
    sourceEvent: mockEvents[2],
    targetEvent: mockEvents[3],
    createdAt: new Date("2024-01-08"),
  },
]

const relationshipTypes = [
  { value: "CAUSED", label: "Caused", icon: Zap, color: "bg-red-100 text-red-800" },
  { value: "LED_TO", label: "Led To", icon: ArrowRight, color: "bg-blue-100 text-blue-800" },
  { value: "INFLUENCED", label: "Influenced", icon: TrendingUp, color: "bg-green-100 text-green-800" },
  { value: "INSPIRED", label: "Inspired", icon: GitBranch, color: "bg-purple-100 text-purple-800" },
  { value: "PRECEDED", label: "Preceded", icon: Calendar, color: "bg-orange-100 text-orange-800" },
]

export function RelationshipsViewer() {
  const [relationships] = useState(mockRelationships)
  const [events] = useState(mockEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("network")

  // Filter relationships
  const filteredRelationships = relationships.filter((rel) => {
    const matchesSearch =
      rel.sourceEvent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rel.targetEvent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rel.relationshipType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || rel.relationshipType === filterType
    const matchesEvent = !selectedEvent || rel.sourceEventId === selectedEvent || rel.targetEventId === selectedEvent
    return matchesSearch && matchesType && matchesEvent
  })

  const getRelationshipTypeInfo = (type: string) => {
    return relationshipTypes.find((rt) => rt.value === type) || relationshipTypes[0]
  }

  const getEventConnections = (eventId: string) => {
    const incoming = relationships.filter((rel) => rel.targetEventId === eventId)
    const outgoing = relationships.filter((rel) => rel.sourceEventId === eventId)
    return { incoming, outgoing, total: incoming.length + outgoing.length }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Relationship Network
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualize complex data relationships and explore cause-and-effect connections between events.
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Relationship
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Event Relationship</DialogTitle>
              <DialogDescription>
                Define how historical events are connected and influence each other.
              </DialogDescription>
            </DialogHeader>
            <RelationshipForm onClose={() => setIsCreateDialogOpen(false)} events={events} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-2xl font-bold">{relationships.length}</p>
              <p className="text-sm text-muted-foreground">Total Links</p>
            </div>
            <Network className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-2xl font-bold">{events.length}</p>
              <p className="text-sm text-muted-foreground">Connected Events</p>
            </div>
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-2xl font-bold">{relationshipTypes.length}</p>
              <p className="text-sm text-muted-foreground">Relationship Types</p>
            </div>
            <GitBranch className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-2xl font-bold">{Math.round((relationships.length / events.length) * 10) / 10}</p>
              <p className="text-sm text-muted-foreground">Avg Connections</p>
            </div>
            <TrendingUp className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events or relationship types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {relationshipTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedEvent || "all"}
              onValueChange={(value) => setSelectedEvent(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Focus on event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="network">Network View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
        </TabsList>

        <TabsContent value="network" className="space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Interactive Network</CardTitle>
              <CardDescription>
                Explore the interconnected web of historical events and their relationships.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NetworkVisualization
                events={events}
                relationships={filteredRelationships}
                selectedEvent={selectedEvent}
                onEventSelect={setSelectedEvent}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <div className="space-y-4">
            {filteredRelationships.map((relationship) => {
              const typeInfo = getRelationshipTypeInfo(relationship.relationshipType)
              const TypeIcon = typeInfo.icon
              return (
                <Card key={relationship.id} className="bg-card hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-center">
                          <h3 className="font-semibold text-sm mb-1">{relationship.sourceEvent.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {relationship.sourceEvent.startDate.getFullYear()}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {relationship.sourceEvent.location}
                          </div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                          <Badge className={`${typeInfo.color} gap-1`}>
                            <TypeIcon className="h-3 w-3" />
                            {typeInfo.label}
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="text-center">
                          <h3 className="font-semibold text-sm mb-1">{relationship.targetEvent.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {relationship.targetEvent.startDate.getFullYear()}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {relationship.targetEvent.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Chronological Relationships</CardTitle>
              <CardDescription>View how events influenced each other over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {events
                  .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                  .map((event, index) => {
                    const connections = getEventConnections(event.id)
                    return (
                      <div key={event.id} className="relative">
                        {index < events.length - 1 && <div className="absolute left-6 top-16 w-0.5 h-16 bg-border" />}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                            {event.startDate.getFullYear().toString().slice(-2)}
                          </div>
                          <Card className="flex-1 bg-muted/50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold">{event.name}</h3>
                                <Badge variant="outline">{connections.total} connections</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {event.startDate.getFullYear()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {event.location}
                                </span>
                              </div>
                              {connections.total > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {connections.incoming.length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      ← {connections.incoming.length} influenced by
                                    </Badge>
                                  )}
                                  {connections.outgoing.length > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      → {connections.outgoing.length} influenced
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
