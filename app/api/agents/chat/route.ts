import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { agentOrchestrator } from "@/lib/agents/agent-orchestrator";
import type { AgentContext } from "@/lib/agents/types";
import { z } from "zod";

export const maxDuration = 60;
export const runtime = "nodejs";

const requestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    })
  ),
  context: z.enum(["grocery", "streaming", "commerce", "support", "general"]),
  agentId: z.string().optional(),
  preferences: z.record(z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { messages, context, agentId, preferences } = validation.data;

    // Generate a unique agent ID if not provided
    const finalAgentId = agentId || `agent-${session.user.id}-${Date.now()}`;

    // Orchestrate the agent response
    const stream = await agentOrchestrator.orchestrate({
      userId: session.user.id,
      agentId: finalAgentId,
      context: context as AgentContext,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      preferences,
    });

    // Convert the stream to a Response
    const readableStream = ReadableStream.from(stream);
    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[v0] Agent chat API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get("agentId");

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    const agentState = await agentOrchestrator.getAgentState(agentId);

    if (!agentState) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Verify ownership
    if (agentState.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      agentState,
    });
  } catch (error) {
    console.error("[v0] Agent state retrieval error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agentId, updates } = await request.json();

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    const agentState = await agentOrchestrator.getAgentState(agentId);

    if (!agentState) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (agentState.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedState = await agentOrchestrator.updateAgentState(
      agentId,
      updates
    );

    return NextResponse.json({
      success: true,
      agentState: updatedState,
    });
  } catch (error) {
    console.error("[v0] Agent update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
