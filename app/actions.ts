"use server"

import { revalidatePath } from "next/cache"

export async function removeBackground(formData: FormData) {
  try {
    const file = formData.get("file") as File
    if (!file) {
      throw new Error("No file provided")
    }

    // Create a new FormData instance for the API request
    const apiFormData = new FormData()
    apiFormData.append("image_file", file)
    apiFormData.append("size", "auto")

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY!,
      },
      body: apiFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Remove.bg API error:", errorData)
      throw new Error(errorData.errors?.[0]?.title || "Failed to remove background")
    }

    const data = await response.arrayBuffer()
    const base64Image = Buffer.from(data).toString("base64")

    revalidatePath("/")
    return { success: true, image: `data:image/png;base64,${base64Image}` }
  } catch (error) {
    console.error("Error removing background:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to process image" }
  }
}

