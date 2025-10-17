# Project Requirements Document (PRD)

## 1. Project Overview

This SEO Article Generator Starter is a full-stack boilerplate designed to help you build a web application that automatically generates SEO-optimized articles powered by a large language model (LLM). It provides user authentication, a customizable dashboard, and the plumbing needed to turn user inputs—like title, keywords, tone, and structure—into a detailed AI prompt, then save the output for later reference. The core problem it solves is eliminating the manual, repetitive work of drafting long-form SEO content while maintaining control over style, length, and structure.

We’re building this to give developers a head start on launching an AI-driven content tool without wiring up every component from scratch. Success means a user can sign up, configure article settings in a polished UI, hit “Generate,” and receive a coherent, SEO-friendly article in under a few seconds. We’ll know it’s working when the app reliably stores each article with its exact settings and displays the user’s history on their dashboard.

---

## 2. In-Scope vs. Out-of-Scope

**In-Scope (Version 1)**
- User sign-up, sign-in, and session management via Better Auth.
- Authenticated dashboard with an article generation form (title, keywords, type, length, tone, POV, structure toggles).
- Backend API route (`/api/generate`) that:
  - Validates input with Zod.
  - Builds a prompt via a `prompt-builder.ts` utility.
  - Calls an external LLM (e.g., OpenAI or Anthropic) and returns the result.
  - Persists generated articles (content, metadata, settings) in PostgreSQL via Drizzle ORM.
- UI to display a list or table of a user’s past articles.
- Containerized development environment with Docker & Docker Compose.
- Deployment setup recommendations for Vercel (serverless functions).

**Out-of-Scope (Deferred to Later Phases)**
- Credit or token management system for limiting usage.
- Background job processing for very large articles (e.g., Inngest or Cron jobs).
- In-app notifications or email alerts when generation completes.
- Rich text editor for post-generation editing.
- Analytics dashboard on article performance (traffic, SEO metrics).
- Multi-user collaboration or sharing features.

---

## 3. User Flow

A new visitor lands on the homepage and clicks “Sign Up.” They enter their email and password, submit the form, and receive a confirmation. Once authenticated, they are redirected to the dashboard, where they see a left navigation bar with links for “Generate Article” and “My Articles.” The main area shows a form with inputs for Article Title and Keywords, dropdowns for Tone of Voice and Article Type, radio buttons for length, and toggles for elements like FAQs or Conclusion.

After filling out the form, the user clicks the “Generate Article” button. The client-side code shows a loading spinner while sending a POST request to `/api/generate`. The server validates the data, builds a detailed prompt, calls the LLM API, then saves the article and returns the content. The UI replaces the spinner with the generated article and stores it in the “My Articles” list, where the user can revisit previous drafts and their settings at any time.

---

## 4. Core Features

- **Authentication**: Sign-up, sign-in, session handling (Better Auth).  
- **Dashboard UI**: Protected area with navigation sidebar and main content region.  
- **Article Settings Form**: Inputs for title, keywords, article type (e.g., how-to, listicle), length (Short, Medium, Large), tone, POV, readability, and structural toggles (intro, conclusion, FAQs).  
- **API Route**: `/api/generate` that handles input validation, prompt construction, LLM invocation, error handling, and database writes.  
- **Prompt Builder**: Utility module (`lib/prompt-builder.ts`) that converts form data into a structured AI prompt.  
- **Persistence**: Drizzle ORM + PostgreSQL schema for `users` and `articles` (fields: id, userId, title, keywords, content, settings JSON, timestamps).  
- **History View**: List or table of a user’s previously generated articles with quick access.  
- **Containerization**: Dockerfiles and `docker-compose.yml` for local dev.  
- **Deployment Guidance**: Config for Vercel serverless functions and environment variables.

---

## 5. Tech Stack & Tools

- **Frontend**:
  - Next.js (App Router + Server/Client Components)  
  - TypeScript  
  - Tailwind CSS  
  - shadcn/ui  
- **Backend**:
  - Next.js API Routes  
  - Better Auth (authentication)  
  - Drizzle ORM + PostgreSQL  
  - Zod (schema validation)  
- **AI Integration**:
  - OpenAI Node SDK or Anthropic client  
  - GPT-4 or equivalent LLM  
- **State Management**:
  - React Query or SWR (for async requests)  
- **Infrastructure & Dev Tools**:
  - Docker & Docker Compose  
  - Vercel (hosting serverless functions)  
  - Environment variables (`.env`) for API keys and database URLs  
- **Optional Future Tools**:
  - Inngest or Vercel Cron for background jobs  

---

## 6. Non-Functional Requirements

- **Performance**: 
  - Dashboard and form UI should load in under 2 seconds on a cold load.  
  - `/api/generate` should complete small/medium article calls in < 5 seconds.  
- **Security & Compliance**:   
  - All traffic over HTTPS.  
  - Secrets and API keys stored in environment variables, not in source control.  
  - Validate and sanitize all user inputs.  
  - GDPR-style data retention policy for user data.  
- **Reliability**:   
  - Graceful error handling on LLM timeouts or failures.  
  - Retry logic for transient API errors (up to 2 retries).  
- **Usability & Accessibility**:   
  - WCAG AA standards: keyboard navigation, screen-reader labels.  
  - Mobile-responsive layout for dashboard and forms.  
- **Scalability**:   
  - Serverless functions auto-scale on Vercel.  
  - Database connection pooling for concurrent users.

---

## 7. Constraints & Assumptions

- We assume availability of GPT-4 or comparable LLM API with reasonable rate limits.  
- Vercel’s serverless functions have a max execution time (~10 seconds), so large articles may need background processing later.  
- Developers will run Docker locally, matching the production environment (PostgreSQL version >=14).  
- Users have stable internet; generation hours depend on external LLM service health and speed.  
- Prompt structure and LLM behavior are roughly consistent; prompt builder logic may need tuning as models evolve.

---

## 8. Known Issues & Potential Pitfalls

- **LLM Rate Limits**: Hitting rate caps could reject requests.  
  - Mitigation: implement exponential backoff and user-friendly error messages.  
- **Serverless Timeout**: Large (5000+ word) articles may exceed time limits.  
  - Mitigation: queue long jobs via background workers.  
- **Prompt Drift**: Overly generic prompts yield subpar output.  
  - Mitigation: keep prompt templates under version control and iterate based on user feedback.  
- **Validation Gaps**: Missing or malformed fields can waste LLM credits.  
  - Mitigation: rigorous Zod validation and front-end form checks.  
- **Database Errors**: JSONB column for settings must match TypeScript types.  
  - Mitigation: enable strict type checks and run migration tests in CI.

---

This document outlines every major piece of functionality, technology, and decision needed for an AI-driven SEO article generator. It gives the AI model a clear blueprint for generating subsequent technical docs—Tech Stack Document, Frontend Guidelines, Backend Structure, File Structure, and IDE rules—without any missing details or ambiguity.