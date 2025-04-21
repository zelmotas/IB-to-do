import { type NextRequest, NextResponse } from "next/server"

// Simple predefined responses for common queries
const predefinedResponses = {
  greeting: [
    "Hello! How can I help with your IB studies today?",
    "Hi there! I'm your IB assistant. What subject are you working on?",
    "Greetings! How can I assist with your International Baccalaureate work?",
  ],
  help: [
    "I can help with homework questions, explain concepts, provide study tips, or assist with organizing your tasks. Just let me know what you need!",
    "I'm here to assist with your IB studies. I can explain difficult concepts, help with assignments, or provide study strategies.",
    "Need help with your IB coursework? I can explain topics, review your work, or suggest study resources.",
  ],
  math: [
    "I'd be happy to help with your math problem. Could you provide more details or share a specific question?",
    "For math questions, it helps if you can share the specific problem you're working on. What topic in mathematics are you studying?",
    "I can assist with various math topics from algebra to calculus. What specific concept or problem are you working on?",
  ],
  essay: [
    "For essay writing, I can help with structure, thesis development, and providing feedback. What specific aspect are you working on?",
    "Essays require clear structure and argumentation. Would you like help with planning, writing, or revising your essay?",
    "I can assist with essay organization, thesis statements, or evidence analysis. What part of the writing process are you in?",
  ],
  default: [
    "I'm here to help with your IB studies. Could you provide more details about what you need assistance with?",
    "I'd be happy to help with your IB coursework. What specific subject or topic are you studying?",
    "I can assist with various IB subjects. Please let me know what you're working on, and I'll do my best to help.",
  ],
}

// Function to get a random response from a category
function getRandomResponse(category: keyof typeof predefinedResponses): string {
  const responses = predefinedResponses[category]
  return responses[Math.floor(Math.random() * responses.length)]
}

// Function to determine the appropriate response category
function determineResponseCategory(message: string): keyof typeof predefinedResponses {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
    return "greeting"
  }

  if (lowerMessage.match(/\b(help|assist|support|guidance)\b/)) {
    return "help"
  }

  if (lowerMessage.match(/\b(math|mathematics|algebra|calculus|equation|formula)\b/)) {
    return "math"
  }

  if (lowerMessage.match(/\b(essay|write|writing|paper|thesis|argument)\b/)) {
    return "essay"
  }

  return "default"
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request: messages array is required" }, { status: 400 })
    }

    // Get the last user message
    const lastUserMessage = messages.filter((msg) => msg.role === "user").pop()?.content || ""

    // Determine response category based on the message content
    const category = determineResponseCategory(lastUserMessage)

    // Get a response
    const responseText = getRandomResponse(category)

    // Create a response in the format expected by the client
    const response = {
      choices: [
        {
          message: {
            role: "assistant",
            content: responseText,
          },
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in AI API route:", error)
    return NextResponse.json(
      {
        error: "Failed to process AI request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
