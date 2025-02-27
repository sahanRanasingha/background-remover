"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { ImageIcon, Upload } from "lucide-react"
import { removeBackground } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

export function ImageUploader() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      setLoading(true)
      setError(null)

      const reader = new FileReader()
      reader.onload = () => {
        setOriginalImage(reader.result as string)
      }
      reader.readAsDataURL(file)

      const formData = new FormData()
      formData.append("file", file)
      const result = await removeBackground(formData)

      if (!result.success) {
        throw new Error(result.error)
      }

      setProcessedImage(result.image ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process image")
    } finally {
      setLoading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
  })

  const handleDownload = () => {
    if (!processedImage) return
    const link = document.createElement("a")
    link.href = processedImage
    link.download = "processed-image.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/10" : "border-muted hover:border-primary"}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">
              {isDragActive ? "Drop the image here" : "Drag & drop an image here, or click to select"}
            </p>
          </div>
        </div>
      </Card>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive rounded-lg p-4">{error}</div>
      )}

      {(originalImage || processedImage) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {originalImage && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Original Image</h3>
              <div className="relative aspect-square">
                <Image
                  src={originalImage || "/placeholder.svg"}
                  alt="Original"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </Card>
          )}

          {processedImage && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Processed Image</h3>
              <div className="relative aspect-square">
                <Image
                  src={processedImage || "/placeholder.svg"}
                  alt="Processed"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <Button className="mt-4 w-full" onClick={handleDownload}>
                Download
              </Button>
            </Card>
          )}
        </div>
      )}

      {loading && (
        <Card className="p-6 text-center">
          <div className="animate-pulse flex flex-col items-center gap-2">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Processing image...</p>
          </div>
        </Card>
      )}
    </div>
  )
}

