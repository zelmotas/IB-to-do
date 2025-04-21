import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Get file type and name
    const fileType = file.type
    const fileName = file.name

    // Generate a simple response about the file
    const responseMessage = `I see you've uploaded a file named "${fileName}" (${fileType}). While I can't directly access its contents, I can help you discuss it. What would you like to know about this file or how can I help you with it?`

    return NextResponse.json({
      message: responseMessage,
      fileName,
      fileType,
    })
  } catch (error) {
    console.error("Error in AI upload API route:", error)
    return NextResponse.json(
      {
        error: "Failed to process file upload",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
