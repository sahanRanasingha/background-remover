import Link from "next/link"
import { ExternalLink } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t mt-8">
      <div className="container mx-auto py-4 px-4 flex justify-center items-center">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          Developed by{" "}
          <Link
            href="https://www.sahanranasingha.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline inline-flex items-center gap-1"
          >
            Sahan Ranasingha
            <ExternalLink className="h-3 w-3" />
          </Link>
        </p>
      </div>
    </footer>
  )
}

