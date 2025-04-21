import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import type { Message } from "@/types/chat"
import { updateChatSession } from "@/services/chat-service"
import { v4 as uuidv4 } from "uuid"

// Define the system prompt for IB-specific knowledge
const IB_SYSTEM_PROMPT = `
You are an AI assistant specifically designed to help International Baccalaureate (IB) students.
You have extensive knowledge about the IB curriculum, including:

- IB Diploma Programme (DP) subjects and requirements
- IB Middle Years Programme (MYP) subjects and requirements
- IB Theory of Knowledge (TOK) essay and presentation
- Extended Essay (EE) guidelines and research methods
- Internal Assessments (IAs) for all subjects
- CAS (Creativity, Activity, Service) requirements and project ideas
- IB exam preparation strategies and past paper analysis
- IB grading criteria and assessment objectives for all subjects
- Time management and study techniques for IB students
- University applications and how IB courses relate to different majors

You should provide accurate, helpful, and concise information to IB students.
When appropriate, suggest specific resources, study strategies, or approaches that are tailored to IB requirements.
If you don't know something specific about the IB curriculum, acknowledge that and provide general academic advice instead.
`

export async function POST(req: NextRequest) {
  try {
    const { messages, chatId } = await req.json()

    // Validate the request
    if (!messages || !Array.isArray(messages) || !chatId) {
      return NextResponse.json({ error: "Invalid request. Messages array and chatId are required." }, { status: 400 })
    }

    // Get the user from Supabase
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prepare messages for Groq API
    const groqMessages = [
      { role: "system", content: IB_SYSTEM_PROMPT },
      ...messages.map((msg: Message) => ({
        role: msg.role,
        content: msg.content,
      })),
    ]

    // Call Groq API
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // Using Llama 3 70B model
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("Groq API error:", error)
      return NextResponse.json({ error: "Failed to get response from AI model" }, { status: 500 })
    }

    const data = await response.json()

    // Create a new message from the AI response
    const newMessage: Message = {
      id: uuidv4(),
      role: "assistant",
      content: data.choices[0].message.content,
      createdAt: new Date(),
    }

    // Update the chat session with the new message
    const updatedMessages = [...messages, newMessage]
    await updateChatSession(chatId, updatedMessages)

    return NextResponse.json({ message: newMessage })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
