# Phase III AI Chat - Technology Research

**Date:** 2026-01-05
**Feature:** 003-phase-iii-ai-chat
**Research Focus:** Evaluate technologies for AI chat integration with MCP tools

---

## RT-001: OpenAI Agents SDK (Python)

### Status: DOES NOT EXIST AS STANDALONE SDK

**Finding:** As of January 2025, OpenAI does not provide a dedicated "Agents SDK" as a separate Python package. Instead, agent functionality is built directly using the OpenAI Python SDK with the Assistants API or Chat Completions API with function calling.

### Installation
```bash
pip install openai
```

**Latest Stable Version:** 1.x (check PyPI for current version)

### Architecture Patterns

#### Option 1: Assistants API (Stateful)
- **Status:** Production-ready
- **Statefulness:** OpenAI manages conversation state server-side
- **Threading:** Persistent threads stored by OpenAI
- **Tools:** Built-in support for function calling
- **Use Case:** When you want OpenAI to manage state

```python
from openai import OpenAI

client = OpenAI(api_key="...")

# Create assistant
assistant = client.beta.assistants.create(
    name="Todo Assistant",
    instructions="You help users manage their todos",
    model="gpt-4",
    tools=[{"type": "function", "function": {...}}]
)

# Create thread (stored by OpenAI)
thread = client.beta.threads.create()

# Add message
client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="Show my todos"
)

# Run assistant
run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=assistant.id
)
```

**Pros:**
- State managed by OpenAI
- Built-in tool calling
- Streaming support

**Cons:**
- Requires storing thread_id per user
- Less control over conversation history
- Potential costs for state storage
- Not truly stateless

#### Option 2: Chat Completions API + Function Calling (Stateless)
- **Status:** Production-ready (recommended for your use case)
- **Statefulness:** Fully stateless - you manage message history
- **Tools:** Function calling via `tools` parameter
- **Use Case:** When you want full control over state

```python
from openai import OpenAI

client = OpenAI(api_key="...")

# Define tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_todos",
            "description": "Get all todos for a user",
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {
                        "type": "integer",
                        "description": "The user ID"
                    }
                },
                "required": ["user_id"]
            }
        }
    }
]

# Stateless call - pass full message history
messages = [
    {"role": "system", "content": "You are a todo assistant"},
    {"role": "user", "content": "Show my todos"}
]

response = client.chat.completions.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

# Handle tool calls
if response.choices[0].message.tool_calls:
    for tool_call in response.choices[0].message.tool_calls:
        function_name = tool_call.function.name
        arguments = json.loads(tool_call.function.arguments)
        # Execute function and add to message history
```

**Pros:**
- Fully stateless - fits your requirements
- Full control over conversation history
- No thread management needed
- Direct integration with MCP tools

**Cons:**
- You manage message history in frontend/backend
- More code for tool execution loop

### MCP Support
**Direct MCP Support:** No built-in MCP integration

**Integration Pattern:** You build MCP tools as Python functions and map them to OpenAI function definitions:
1. Create MCP tools in your backend
2. Generate OpenAI function schemas from MCP tool definitions
3. When OpenAI requests a tool call, route to your MCP tool
4. Return results back to OpenAI

### Error Handling Patterns
```python
from openai import OpenAI, OpenAIError, RateLimitError, APIError

try:
    response = client.chat.completions.create(...)
except RateLimitError as e:
    # Handle rate limiting (429)
    pass
except APIError as e:
    # Handle API errors (500, 503)
    pass
except OpenAIError as e:
    # Handle other OpenAI errors
    pass
```

### Production Readiness
- **Status:** Production-ready
- **Reliability:** High (OpenAI's main API)
- **Scaling:** Handles high load well
- **Rate Limits:** Per-tier limits (check OpenAI dashboard)

### Recommendation for Your Project
Use **Chat Completions API with function calling** for:
- Stateless architecture requirement
- Full control over message history
- Direct integration with your MCP tools
- Simpler architecture (no thread management)

---

## RT-002: Model Context Protocol (MCP) SDK

### Status: PRODUCTION-READY (Official Anthropic Standard)

**Package:** `mcp` (Python SDK)
**GitHub:** https://github.com/modelcontextprotocol/python-sdk
**Documentation:** https://modelcontextprotocol.io

### Installation
```bash
pip install mcp
```

**Latest Version:** Check PyPI (actively maintained by Anthropic as of Jan 2025)

### Architecture Overview

MCP provides a standardized protocol for connecting LLMs to data sources and tools. It defines:
- **Servers:** Expose tools, resources, and prompts
- **Clients:** Connect to MCP servers and invoke tools
- **Transport:** Communication protocol (stdio, SSE, HTTP)

### Tool Registration Patterns

#### Pattern 1: Decorator-Based (Recommended)
```python
from mcp.server import Server
from mcp.types import Tool, TextContent

app = Server("todo-mcp-server")

@app.tool()
async def get_todos(user_id: int) -> list[dict]:
    """Get all todos for a user"""
    # Implementation
    return [{"id": 1, "title": "Task 1", "completed": False}]

@app.tool()
async def create_todo(user_id: int, title: str, description: str = "") -> dict:
    """Create a new todo"""
    # Implementation
    return {"id": 2, "title": title, "completed": False}
```

#### Pattern 2: Manual Registration
```python
from mcp.server import Server
from mcp.types import Tool

app = Server("todo-mcp-server")

async def get_todos_handler(user_id: int):
    # Implementation
    pass

# Manual registration
app.add_tool(
    Tool(
        name="get_todos",
        description="Get all todos for a user",
        inputSchema={
            "type": "object",
            "properties": {
                "user_id": {"type": "integer"}
            },
            "required": ["user_id"]
        }
    ),
    get_todos_handler
)
```

### High-Level Abstractions

#### FastMCP
**Status:** Community project (check availability)

FastMCP provides a higher-level abstraction similar to FastAPI:
```python
from fastmcp import FastMCP

mcp = FastMCP("Todo Assistant")

@mcp.tool()
def get_todos(user_id: int) -> list[dict]:
    """Get all todos for a user"""
    return []

@mcp.resource("todo://{user_id}/todos")
def get_todo_resource(user_id: int) -> str:
    """Resource-based access to todos"""
    return json.dumps([])

if __name__ == "__main__":
    mcp.run()
```

### Stateless Tools with user_id Parameter

MCP tools are inherently stateless - each tool call is independent:

```python
from mcp.server import Server
from typing import Annotated

app = Server("todo-mcp-server")

@app.tool()
async def get_todos(
    user_id: Annotated[int, "User ID from JWT token"],
) -> list[dict]:
    """
    Get all todos for a user.

    The user_id should be extracted from the authenticated session,
    not from user input (security).
    """
    # Call your database/service layer
    todos = await todo_service.get_todos(user_id)
    return todos

@app.tool()
async def create_todo(
    user_id: int,
    title: str,
    description: str = "",
) -> dict:
    """Create a new todo for a user"""
    todo = await todo_service.create_todo(user_id, title, description)
    return todo
```

**Security Pattern:** Extract `user_id` from authenticated session context, not from LLM/user input:

```python
# In your FastAPI endpoint
@app.post("/api/chat")
async def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    user_id = current_user.id

    # Pass user_id to MCP tool invocations
    # The LLM requests tools, but you inject user_id server-side
```

### Integration with OpenAI APIs

MCP doesn't directly integrate with OpenAI - you build a bridge:

```python
# 1. Define MCP tools
from mcp.server import Server

app = Server("todo-mcp")

@app.tool()
async def get_todos(user_id: int) -> list[dict]:
    return []

# 2. Convert MCP tools to OpenAI function schemas
def mcp_tool_to_openai_function(tool) -> dict:
    """Convert MCP tool to OpenAI function definition"""
    return {
        "type": "function",
        "function": {
            "name": tool.name,
            "description": tool.description,
            "parameters": tool.inputSchema
        }
    }

# 3. Handle OpenAI tool calls by routing to MCP
async def handle_tool_call(tool_call, user_id: int):
    function_name = tool_call.function.name
    arguments = json.loads(tool_call.function.arguments)

    # Inject user_id for security
    arguments["user_id"] = user_id

    # Route to MCP tool
    result = await app.call_tool(function_name, arguments)
    return result
```

### Transport Options

#### Option 1: stdio (for local processes)
```python
from mcp.server.stdio import stdio_server

async def main():
    async with stdio_server() as (read_stream, write_stream):
        await app.run(read_stream, write_stream)
```

#### Option 2: SSE (Server-Sent Events, for web)
```python
from mcp.server.sse import SseServerTransport

# Integrate with FastAPI
@app.get("/mcp/sse")
async def mcp_sse():
    transport = SseServerTransport("/mcp/messages")
    return transport.handle_request()
```

#### Option 3: HTTP (custom transport)
You can build a custom HTTP transport using FastAPI.

### Production Readiness
- **Status:** Production-ready (official Anthropic standard)
- **Adoption:** Growing ecosystem
- **Stability:** Core protocol is stable
- **Community:** Active development

### Recommendation for Your Project
1. Use MCP to define your tools (get_todos, create_todo, etc.)
2. Build a bridge layer that converts MCP tools to OpenAI function schemas
3. Handle OpenAI tool calls by routing to MCP tool handlers
4. Inject `user_id` from authenticated session (not from LLM input)

---

## RT-003: OpenAI ChatKit

### Status: DOES NOT EXIST AS OFFICIAL OPENAI PRODUCT

**Finding:** As of January 2025, there is no official OpenAI ChatKit web component. The name "ChatKit" is used by various third-party libraries, but none are official OpenAI products.

### Alternative Options

#### Option 1: Build Custom Chat UI
**Recommended for full control**

Popular React/Next.js chat UI libraries:
1. **react-chatbot-kit**
2. **react-chat-elements**
3. **stream-chat-react** (Stream.io)
4. **Custom implementation** (recommended for your use case)

#### Option 2: Vercel AI SDK (Recommended)
**Package:** `ai` (Vercel AI SDK)
**Status:** Production-ready, actively maintained
**npm:** `npm install ai`

```bash
npm install ai openai
```

**Features:**
- React hooks for chat UIs (`useChat`)
- Streaming support
- OpenAI integration
- Next.js App Router support
- TypeScript support

**Example:**
```tsx
// app/api/chat/route.ts (Next.js App Router)
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

export const runtime = 'edge'

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    stream: true,
    messages,
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

// components/Chat.tsx
'use client'

import { useChat } from 'ai/react'

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  })

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  )
}
```

**Next.js Compatibility:**
- Full App Router support
- SSR compatible
- Edge runtime compatible
- Streaming support

**Configuration Options:**
- Custom API endpoints: `useChat({ api: '/your-endpoint' })`
- Headers/auth: `useChat({ headers: { 'Authorization': 'Bearer ...' } })`
- Custom body: `useChat({ body: { user_id: userId } })`
- Callbacks: `onFinish`, `onResponse`, `onError`

#### Option 3: OpenAI Playground Embed
**Not a component library**

OpenAI provides an embeddable playground, but it's not suitable for production apps with custom authentication.

#### Option 4: Build Custom with Headless Components
**Maximum flexibility**

Libraries for building custom chat UIs:
- **Radix UI** (headless components)
- **Headless UI** (Tailwind)
- **shadcn/ui** (pre-built with Radix)

Example structure:
```tsx
// components/ChatMessage.tsx
export function ChatMessage({ role, content }) {
  return (
    <div className={role === 'user' ? 'ml-auto' : 'mr-auto'}>
      <div className="p-3 rounded-lg bg-gray-100">
        {content}
      </div>
    </div>
  )
}

// components/ChatInput.tsx
export function ChatInput({ onSubmit, disabled }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(input)
    setInput('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
      />
      <button type="submit">Send</button>
    </form>
  )
}

// app/chat/page.tsx
'use client'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSend = async (content: string) => {
    const newMessages = [...messages, { role: 'user', content }]
    setMessages(newMessages)
    setLoading(true)

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    })

    const data = await response.json()
    setMessages([...newMessages, { role: 'assistant', content: data.content }])
    setLoading(false)
  }

  return (
    <div>
      {messages.map((m, i) => (
        <ChatMessage key={i} {...m} />
      ))}
      <ChatInput onSubmit={handleSend} disabled={loading} />
    </div>
  )
}
```

---

## Recommended Architecture for Phase III

Based on research findings, here's the recommended approach:

### Backend Stack
```python
# requirements.txt
openai>=1.0.0          # OpenAI API client
mcp>=1.0.0             # Model Context Protocol
fastapi>=0.100.0       # API framework
pydantic>=2.0.0        # Data validation
python-jose>=3.3.0     # JWT handling
```

### Frontend Stack
```json
{
  "dependencies": {
    "ai": "^3.0.0",           // Vercel AI SDK
    "openai": "^4.0.0",       // OpenAI types
    "react": "^18.0.0",
    "next": "^14.0.0"
  }
}
```

### Architecture Pattern

#### 1. Define MCP Tools (Backend)
```python
# backend/mcp_tools.py
from mcp.server import Server

app = Server("todo-mcp-server")

@app.tool()
async def get_todos(user_id: int) -> list[dict]:
    """Get all todos for a user"""
    return await db.get_todos(user_id)

@app.tool()
async def create_todo(user_id: int, title: str, description: str = "") -> dict:
    """Create a new todo"""
    return await db.create_todo(user_id, title, description)
```

#### 2. Bridge MCP to OpenAI (Backend)
```python
# backend/chat_service.py
from openai import OpenAI
from .mcp_tools import app as mcp_app

class ChatService:
    def __init__(self):
        self.openai_client = OpenAI()
        self.mcp_tools = self._build_openai_tools()

    def _build_openai_tools(self):
        """Convert MCP tools to OpenAI function schemas"""
        return [
            {
                "type": "function",
                "function": {
                    "name": "get_todos",
                    "description": "Get all todos for a user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer"}
                        },
                        "required": ["user_id"]
                    }
                }
            },
            # ... other tools
        ]

    async def chat(self, messages: list[dict], user_id: int) -> dict:
        """Stateless chat with tool calling"""
        response = self.openai_client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            tools=self.mcp_tools,
            tool_choice="auto"
        )

        # Handle tool calls
        if response.choices[0].message.tool_calls:
            return await self._handle_tool_calls(
                response, messages, user_id
            )

        return {"content": response.choices[0].message.content}

    async def _handle_tool_calls(self, response, messages, user_id):
        """Execute tool calls via MCP"""
        tool_calls = response.choices[0].message.tool_calls

        for tool_call in tool_calls:
            function_name = tool_call.function.name
            arguments = json.loads(tool_call.function.arguments)

            # Inject user_id for security (don't trust LLM input)
            arguments["user_id"] = user_id

            # Call MCP tool
            result = await mcp_app.call_tool(function_name, arguments)

            # Add to message history
            messages.append({
                "role": "function",
                "name": function_name,
                "content": json.dumps(result)
            })

        # Recursive call to get final response
        return await self.chat(messages, user_id)
```

#### 3. FastAPI Endpoint (Backend)
```python
# backend/api/chat.py
from fastapi import APIRouter, Depends
from .auth import get_current_user
from .chat_service import ChatService

router = APIRouter()
chat_service = ChatService()

@router.post("/chat")
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """Stateless chat endpoint"""
    response = await chat_service.chat(
        messages=request.messages,
        user_id=current_user.id  # Inject from auth, not from LLM
    )
    return response
```

#### 4. Frontend Chat UI (Next.js)
```tsx
// app/chat/page.tsx
'use client'

import { useChat } from 'ai/react'

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  })

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <div key={message.id} className={message.role}>
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <input
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          placeholder="Ask about your todos..."
        />
      </form>
    </div>
  )
}
```

---

## Summary & Recommendations

### RT-001: OpenAI Agents SDK
- **Status:** No standalone SDK exists
- **Recommendation:** Use OpenAI Python SDK with Chat Completions API + function calling
- **Installation:** `pip install openai`
- **Best for:** Stateless architecture with full control

### RT-002: Model Context Protocol (MCP)
- **Status:** Production-ready official standard
- **Recommendation:** Use for tool definitions and standardization
- **Installation:** `pip install mcp`
- **Best for:** Standardized tool interface, future compatibility

### RT-003: OpenAI ChatKit
- **Status:** Does not exist as official product
- **Recommendation:** Use Vercel AI SDK (`ai` package) for frontend
- **Installation:** `npm install ai openai`
- **Best for:** React/Next.js chat UIs with streaming support

### Overall Architecture Decision
**Recommended Stack:**
1. **Backend:** FastAPI + OpenAI Python SDK + MCP for tools
2. **Frontend:** Next.js + Vercel AI SDK (`useChat` hook)
3. **Pattern:** Stateless chat with server-side tool execution
4. **Security:** Inject `user_id` from JWT, never from LLM input

This approach provides:
- Full control over conversation history (stateless)
- Standardized tool definitions (MCP)
- Production-ready components (Vercel AI SDK)
- Secure user context injection
- Excellent DX and maintainability

---

## Next Steps

1. **Prototype:** Build a simple proof-of-concept with one MCP tool
2. **Validate:** Test stateless conversation with message history
3. **Security:** Implement JWT extraction and user_id injection
4. **UI:** Integrate Vercel AI SDK for chat interface
5. **Scale:** Add remaining MCP tools (CRUD operations)

---

## References

- OpenAI API Documentation: https://platform.openai.com/docs
- Model Context Protocol: https://modelcontextprotocol.io
- Vercel AI SDK: https://sdk.vercel.ai/docs
- OpenAI Python SDK: https://github.com/openai/openai-python
- MCP Python SDK: https://github.com/modelcontextprotocol/python-sdk
