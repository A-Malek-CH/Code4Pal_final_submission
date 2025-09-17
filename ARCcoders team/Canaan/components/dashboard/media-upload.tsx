"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, FileText, ImageIcon, Video, Music, Link } from "lucide-react"

interface MediaUploadProps {
  onClose: () => void
}

export function MediaUpload({ onClose }: MediaUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [formData, setFormData] = useState({
    eventId: "",
    title: "",
    sourceText: "",
  })

  // Mock events - replace with actual data
  const mockEvents = [
    { id: "1", name: "The Industrial Revolution" },
    { id: "2", name: "French Revolution" },
    { id: "3", name: "American Civil War" },
  ]

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return ImageIcon
    if (file.type.startsWith("video/")) return Video
    if (file.type.startsWith("audio/")) return Music
    return FileText
  }

  const getFileType = (file: File) => {
    if (file.type.startsWith("image/")) return "image"
    if (file.type.startsWith("video/")) return "video"
    if (file.type.startsWith("audio/")) return "audio"
    return "document"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement file upload logic with Prisma
    console.log("Upload data:", { files, formData })
    onClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Upload Media Files</h3>
        <p className="text-muted-foreground mb-4">Drag and drop files here, or click to select</p>
        <input
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <Button type="button" variant="outline" asChild>
          <label htmlFor="file-upload" className="cursor-pointer">
            Select Files
          </label>
        </Button>
        <p className="text-xs text-muted-foreground mt-2">Supported: Images, Videos, Audio, PDF, Word documents</p>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold">Selected Files ({files.length})</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => {
              const Icon = getFileIcon(file)
              return (
                <Card key={index} className="bg-muted/50">
                  <CardContent className="flex items-center gap-3 p-3">
                    <Icon className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{getFileType(file)}</span>
                        <span>•</span>
                        <span>{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="eventId" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Link to Event *
          </Label>
          <Select
            value={formData.eventId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, eventId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an event to link these media files" />
            </SelectTrigger>
            <SelectContent>
              {mockEvents.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="title">Title (optional)</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Enter a title for these media files"
          />
        </div>

        <div>
          <Label htmlFor="sourceText">Description/Source Text</Label>
          <Textarea
            id="sourceText"
            value={formData.sourceText}
            onChange={(e) => setFormData((prev) => ({ ...prev, sourceText: e.target.value }))}
            placeholder="Describe the content, context, or source of these media files"
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">This text will be used for search and AI embeddings</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={files.length === 0 || !formData.eventId}>
          Upload {files.length} File{files.length !== 1 ? "s" : ""}
        </Button>
      </div>
    </form>
  )
}
