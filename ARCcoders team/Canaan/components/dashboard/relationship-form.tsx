"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Zap, TrendingUp, GitBranch, Calendar } from "lucide-react"

interface RelationshipFormProps {
  onClose: () => void
  events: any[]
  relationship?: any
}

const relationshipTypes = [
  { value: "CAUSED", label: "Caused", icon: Zap, description: "Direct causal relationship" },
  { value: "LED_TO", label: "Led To", icon: ArrowRight, description: "Sequential progression" },
  { value: "INFLUENCED", label: "Influenced", icon: TrendingUp, description: "Indirect influence" },
  { value: "INSPIRED", label: "Inspired", icon: GitBranch, description: "Inspirational connection" },
  { value: "PRECEDED", label: "Preceded", icon: Calendar, description: "Temporal precedence" },
]

export function RelationshipForm({ onClose, events, relationship }: RelationshipFormProps) {
  const [formData, setFormData] = useState({
    sourceEventId: relationship?.sourceEventId || "",
    targetEventId: relationship?.targetEventId || "",
    relationshipType: relationship?.relationshipType || "",
    description: relationship?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement Prisma create/update logic
    console.log("Relationship form submitted:", formData)
    onClose()
  }

  const selectedType = relationshipTypes.find((type) => type.value === formData.relationshipType)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Source Event */}
      <div>
        <Label htmlFor="sourceEvent">Source Event (Cause/Influence) *</Label>
        <Select
          value={formData.sourceEventId}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, sourceEventId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select the event that causes or influences" />
          </SelectTrigger>
          <SelectContent>
            {events
              .filter((event) => event.id !== formData.targetEventId)
              .map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name} ({event.startDate.getFullYear()})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Relationship Type */}
      <div>
        <Label htmlFor="relationshipType">Relationship Type *</Label>
        <Select
          value={formData.relationshipType}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, relationshipType: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select how the events are connected" />
          </SelectTrigger>
          <SelectContent>
            {relationshipTypes.map((type) => {
              const Icon = type.icon
              return (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </div>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Target Event */}
      <div>
        <Label htmlFor="targetEvent">Target Event (Effect/Result) *</Label>
        <Select
          value={formData.targetEventId}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, targetEventId: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select the event that is affected or results" />
          </SelectTrigger>
          <SelectContent>
            {events
              .filter((event) => event.id !== formData.sourceEventId)
              .map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name} ({event.startDate.getFullYear()})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Relationship Preview */}
      {formData.sourceEventId && formData.targetEventId && selectedType && (
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Relationship Preview</h4>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium">{events.find((e) => e.id === formData.sourceEventId)?.name}</span>
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded">
              <selectedType.icon className="h-3 w-3" />
              <span>{selectedType.label}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{events.find((e) => e.id === formData.targetEventId)?.name}</span>
          </div>
        </div>
      )}

      {/* Description */}
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Provide additional context about this relationship..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!formData.sourceEventId || !formData.targetEventId || !formData.relationshipType}
        >
          {relationship ? "Update Relationship" : "Create Relationship"}
        </Button>
      </div>
    </form>
  )
}
