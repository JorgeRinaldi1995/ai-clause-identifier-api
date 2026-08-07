# 🤖 AI Clause Analyser

> [!NOTE]
>This project is currently in active development.
>You may find:
>- Experimental modules
>- Temporary implementations
>- Incomplete features
>- Ongoing refactors
>The codebase is evolving as architectural improvements and optimizations are introduced.

An AI-powered contract clause analysis system built with Node.js and NestJS.

This project leverages Large Language Models (LLMs) and vector embeddings to automatically detect abusive clauses, classify legal risk levels, and generate structured legal justifications.

---

## 🚀 Purpose

The goal of this system is to automate contractual clause analysis by providing:

- ✅ Abusive clause detection
- 📊 Risk classification (LOW | MEDIUM | HIGH)
- ⚖️ Identification of violated legal principles
- 🧠 Detailed legal justification
- 📈 Confidence score for each analysis

---

## 🏗️ Architecture

The project follows a modular architecture inspired by:

- Clean Architecture principles
- SOLID design principles
- Clear separation of concerns
- Infrastructure-independent domain logic


---

## 🛠️ Tech Stack

- Node.js
- NestJS
- TypeScript
- OpenAI API
- PostgreSQL
- pgvector (vector similarity search)
- Tessaract OCR

---

## 🧠 How It Works

### 1️⃣ Clause Submission
The API receives a contractual clause as pdf document.

### 2️⃣ PDF to text conversion
The API convert PDF to PGN, then PNG to text using Tessaract OCR. After that the text content are normalized and separeted by chunks.

### 3️⃣ Embedding Generation
A vector embedding is generated to enable:
- Semantic similarity search
- Clause indexing
- Vector-based retrieval

### 4️⃣ AI Analysis
The LLM evaluates the clause and returns:
- Abusiveness detection
- Risk classification
- Legal reasoning
- Violated principles
- Confidence score

### 5️⃣ Persistence Layer
Results are stored along with:
- Content hash (SHA-256)
- Model used
- Generated embedding
- Analysis result

---

## 📡 Example Response

```json
{
  "clauseId": "uuid",
  "isAbusive": true,
  "riskLevel": "HIGH",
  "justification": "The clause imposes excessive disadvantage on the consumer.",
  "violatedPrinciples": [
    "Good faith",
    "Contractual balance"
  ],
  "confidence": 0.92,
  "explanation": "The clause limits essential consumer rights...",
  "category": "Limitation of liability"
}
```

## ⚖️ Use Cases

LegalTech platforms

Law firms

Compliance automation

Contract auditing systems

Consumer protection analysis tools

## 🐳 Development Environment

The project ships with a Docker-based dev environment (hot-reload API + Postgres with `pgvector`), so you don't need Node, Postgres, Poppler, or Tesseract installed locally.

### Requirements
- Docker
- Docker Compose

### Setup
```bash
cp .env.example .env
# fill in OPEN_AI_KEY
docker compose up --build
```

The API will be available at `http://localhost:3000` (or the `PORT` set in `.env`), and Postgres (with `pgvector`) at `localhost:5432`. Source files are bind-mounted, so `nest start --watch` picks up changes automatically.

### Database migrations
Migrations are not run automatically. With the containers up, run:
```bash
docker compose run --rm api npm run migration:run
```

Other available commands: `migration:revert`, `migration:generate`, `migration:create` (see `package.json`).

## 👨‍💻 Author

Architected and Developed by Jorge Costa.