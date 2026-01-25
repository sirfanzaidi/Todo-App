---
id: 003
title: Amend Constitution Phase III Technologies
stage: constitution
date: 2026-01-05
surface: agent
model: claude-sonnet-4-5
feature: none
branch: master
user: architect
command: /sp.constitution
labels: ["constitution", "phase-iii", "ai-agents", "mcp", "technology-matrix"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .spec-kit/memory/constitution.md
tests:
  - Template alignment verification
---

## Prompt

Amend the global constitution to include Phase III technologies and rules while preserving phase isolation.

Add the following to the technology matrix and rules:

Phase III:
- AI Framework: OpenAI Agents SDK (Python)
- MCP Server: Official Model Context Protocol SDK (modelcontextprotocol/python-sdk)
- Frontend Chat Interface: OpenAI ChatKit (web component)
- Chat Endpoint: Stateless POST /api/chat (or /api/{user_id}/chat)
- Conversation persistence: New Conversation and Message models in Neon PostgreSQL via SQLModel
- Agent behavior: Natural language understanding for all 5 basic todo features (add, list, update, delete, complete)
- Tools: Stateless MCP tools for task operations (add_task, list_tasks, update_task, delete_task, complete_task)

Rules & Constraints:
- AI agents and MCP tools are allowed only starting from Phase III
- All tools must be stateless and use authenticated user_id
- Conversation history must be persisted in database (not in-memory)
- No event-driven architecture (Kafka/Dapr) until Phase V
- No recurring tasks, due dates, priorities, tags, search/filter/sort until Phase V
- Build on existing Phase II authentication

## Response snapshot

Constitution successfully amended from version 1.1.0 to 1.2.0.

**Key Changes**:
1. Expanded Phase III Technology Matrix with detailed AI/MCP requirements
2. Added Phase III Specific Rules section with explicit constraints
3. Updated Technology Phase Rules table to separate Phase III and Phase IV+
4. Separated Phase IV infrastructure technologies into dedicated section
5. Added prohibition rules for advanced todo features (deferred to Phase V)

**Phase III Technologies Added**:
- OpenAI Agents SDK (Python)
- Model Context Protocol SDK (modelcontextprotocol/python-sdk)
- OpenAI ChatKit (web component)
- Chat endpoint (stateless POST /api/chat or /api/{user_id}/chat)
- Conversation and Message models (SQLModel + Neon PostgreSQL)
- 5 stateless MCP tools (add_task, list_tasks, update_task, delete_task, complete_task)

**Phase III Constraints Enforced**:
- All MCP tools MUST be stateless with authenticated user_id
- Conversation history MUST persist in database (not in-memory)
- NO event-driven architecture until Phase V
- NO advanced todo features (recurring, priorities, tags, search/filter) until Phase V
- MUST build on existing Phase II authentication

**Template Alignment**: All templates (spec, plan, tasks) remain aligned - changes are additive.

## Outcome

- ✅ Impact: Constitution updated to version 1.2.0 with Phase III technology requirements and constraints
- 🧪 Tests: Template alignment verified (spec-template.md, plan-template.md, tasks-template.md)
- 📁 Files: .spec-kit/memory/constitution.md
- 🔁 Next prompts: Create Phase III specification following constitutional requirements
- 🧠 Reflection: MINOR version bump appropriate - new capabilities added without breaking existing phase governance

## Evaluation notes (flywheel)

- Failure modes observed: None - amendment process followed successfully
- Graders run and results (PASS/FAIL): Template alignment check PASS
- Prompt variant (if applicable): Standard constitution amendment workflow
- Next experiment (smallest change to try): Monitor Phase III spec creation for constitutional compliance
