import { ImageUploader } from "@/components/image-uploader"
import { ThemeToggle } from "@/components/theme-toggle"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300">
      <main className="flex-1">
        <div className="container mx-auto p-4">
          <header className="flex justify-between items-center mb-8">
            <div className="text-left">
              <h1 className="text-4xl font-bold text-foreground mb-2">Background Remover</h1>
              <p className="text-muted-foreground">Upload an image to remove its background instantly</p>
            </div>
            <ThemeToggle />
          </header>
          <ImageUploader />
        </div>
      </main>
      <Footer />
    </div>
  )
}

