# Hackathon Todo - Monorepo

A production-ready todo application built through iterative phases, demonstrating modern software development practices from console app to cloud deployment.

## 🎯 Project Vision

This project showcases the evolution of a simple todo application through five distinct phases:

1. **Phase 1: Console App** - Command-line todo manager with in-memory storage
2. **Phase 2: Web Application** - Full-stack web app with React + FastAPI
3. **Phase 3: Chatbot Integration** - AI-powered natural language interface via MCP
4. **Phase 4: Kubernetes** - Container orchestration and production deployment
5. **Phase 5: Cloud & CI/CD** - Infrastructure automation and continuous deployment

## 📁 Monorepo Structure

```
hackathon-todo/
├── .spec-kit/              # Spec-Kit Plus configuration
│   ├── scripts/            # Automation scripts
│   └── templates/          # Templates for specs, plans, tasks, ADRs
├── specs/                  # Specifications for all phases
│   ├── phase1-console/     # Phase 1: Console app specs
│   ├── phase2-web/         # Phase 2: Web app specs
│   ├── phase3-chatbot/     # Phase 3: Chatbot specs (planned)
│   ├── phase4-k8s/         # Phase 4: Kubernetes specs (planned)
│   └── phase5-cloud/       # Phase 5: Cloud deployment specs (planned)
├── phases/                 # Implementation code for each phase
│   ├── phase1-console/     # Console app implementation
│   │   ├── src/
│   │   ├── tests/
│   │   ├── README.md
│   │   └── requirements.txt
│   ├── phase2-web/         # Web app implementation
│   │   ├── frontend/       # Next.js frontend
│   │   ├── backend/        # FastAPI backend
│   │   ├── docker-compose.yml
│   │   └── README.md
│   ├── phase3-chatbot/     # Chatbot implementation (planned)
│   ├── phase4-k8s/         # Kubernetes configs (planned)
│   └── phase5-cloud/       # Cloud infrastructure (planned)
├── shared/                 # Shared utilities (use sparingly)
├── history/                # Project history
│   ├── prompts/            # Prompt History Records (PHRs)
│   └── adr/                # Architecture Decision Records
├── CLAUDE.md               # Claude Code development rules
├── AGENTS.md               # Agent constitution and guidelines
└── README.md               # This file
```

## 🚀 Quick Start

### Phase 1: Console App

```bash
cd phases/phase1-console
pip install -r requirements.txt
python src/todo_app.py
```

### Phase 2: Web Application

**Using Docker Compose (Recommended)**:
```bash
cd phases/phase2-web
docker-compose up -d
```

**Manual Setup**:
```bash
# Backend
cd phases/phase2-web/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn src.main:app --reload

# Frontend (in another terminal)
cd phases/phase2-web/frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Phase 3-5: Coming Soon

Phases 3, 4, and 5 are in the planning stages. See their respective `specs/` folders for upcoming features.

## 📊 Phase Progress

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | ✅ Complete | Console todo app with in-memory storage |
| Phase 2 | ✅ Complete | Full-stack web app (Next.js + FastAPI) |
| Phase 3 | 🚧 Planned | AI chatbot integration with MCP tools |
| Phase 4 | 🚧 Planned | Kubernetes deployment and orchestration |
| Phase 5 | 🚧 Planned | Cloud infrastructure and CI/CD automation |

## 🛠 Development Methodology

This project follows **Spec-Driven Development (SDD)**:

1. **Specification** - Define requirements and acceptance criteria
2. **Planning** - Architect the solution and make key decisions
3. **Tasks** - Break down into testable, actionable tasks
4. **Implementation** - Build following TDD (Red-Green-Refactor)
5. **Documentation** - Capture decisions in ADRs, track progress in PHRs

### Key Documents

- **AGENTS.md** - Agent constitution, principles, and code quality standards
- **CLAUDE.md** - Claude Code development rules and workflows
- **specs/\*/spec.md** - Feature specifications for each phase
- **specs/\*/plan.md** - Architecture and implementation plans
- **specs/\*/tasks.md** - Task breakdowns with acceptance criteria

## 🎓 Learning Objectives

This project demonstrates:

- **Progressive Enhancement**: Building complexity iteratively
- **Separation of Concerns**: Clean architecture across phases
- **Test-Driven Development**: Writing tests first
- **Infrastructure as Code**: Kubernetes and Terraform
- **Modern Web Stack**: React, Next.js, FastAPI, PostgreSQL
- **AI Integration**: MCP protocol and agent-based interactions
- **Production Readiness**: Security, monitoring, CI/CD

## 🔒 Security

- No secrets committed to repository
- Environment variables for all configuration
- JWT-based authentication in web app
- CORS and CSRF protection
- Input validation and sanitization
- Follow OWASP Top 10 guidelines

## 📝 Contributing

All contributions must follow the SDD workflow:

1. Create/update specification in `specs/`
2. Document architectural decisions in ADRs if significant
3. Break down into tasks
4. Implement with tests
5. Create PHR to document the work

See **AGENTS.md** for detailed contribution guidelines and code standards.

## 📄 License

See LICENSE file for details.

---

**Built with Spec-Driven Development** | [Documentation](./specs) | [Agent Guidelines](./AGENTS.md)
