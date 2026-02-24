# 🤖 AI Clause Analyser

> [!WARNING]
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

### Project Structure

src/
├── analysis/
│ ├── services/
│ ├── repositories/
│ ├── prompts/
│ └── dto/
├── clause/
├── embeddings/
├── traits/
└── shared/


---

## 🛠️ Tech Stack

- Node.js
- NestJS
- TypeScript
- OpenAI API
- PostgreSQL
- pgvector (vector similarity search)
- TypeORM
- Docker

---

## 🧠 How It Works

### 1️⃣ Clause Submission
The API receives a contractual clause as input text.

### 2️⃣ Embedding Generation
A vector embedding is generated to enable:
- Semantic similarity search
- Clause indexing
- Vector-based retrieval

### 3️⃣ AI Analysis
The LLM evaluates the clause and returns:
- Abusiveness detection
- Risk classification
- Legal reasoning
- Violated principles
- Confidence score

### 4️⃣ Persistence Layer
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

## 👨‍💻 Author

Developed by Jorge Costa.