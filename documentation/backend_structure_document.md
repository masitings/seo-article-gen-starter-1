# Backend Structure Document: SEO Article Generator Starter

This document outlines the backend architecture, hosting setup, and infrastructure components for the SEO Article Generator Starter project. It’s written in everyday language so anyone can understand how the backend is organized and why each piece is in place.

## 1. Backend Architecture

The backend is built around Next.js API Routes, Better Auth for authentication, and Drizzle ORM with PostgreSQL for data storage. Here’s how it’s organized:

• Modular API Routes: Each feature (authentication, article generation, fetching history) lives in its own folder under `app/api/`, keeping code focused and easy to navigate.

• Design Patterns:
  - **Separation of Concerns**: Prompt construction, database operations, and authentication are handled in separate modules (`lib/prompt-builder.ts`, `db/`, `lib/auth.ts`).
  - **Type-Driven Development**: TypeScript definitions flow from the database schema through the API layer to the frontend, reducing runtime errors.

• Frameworks and Libraries:
  - **Next.js** (App Router) for serverless API routes and hybrid Server/Client components.
  - **Better Auth** for secure session and user management.
  - **Drizzle ORM** for type-safe database interaction.

This architecture supports:

- **Scalability**: Serverless functions on Vercel auto-scale with traffic. Clear module boundaries let you add new features without breaking existing ones.
- **Maintainability**: Small, focused files and strong typing make it easy to understand, test, and extend the code.
- **Performance**: Server Components fetch and render user data quickly, while client components handle interactivity. Next.js caching and Vercel’s global edge network speed up responses.

## 2. Database Management

We use a traditional SQL database setup:

• **Type**: Relational (SQL)
• **System**: PostgreSQL
• **ORM**: Drizzle ORM (TypeScript-friendly)

How data is handled:

- **Tables**: User accounts, generated articles, and any future usage tracking (e.g., credits).
- **JSONB Field**: Article settings are stored as a JSONB column, letting us save flexible configurations (tone, length, structure) without complex joins.
- **Access Patterns**:
  - Reads: Fetch a user’s article history, load a single article by ID.
  - Writes: Insert a new article with content and settings after generation.
- **Best Practices**:
  - Use migrations to evolve the schema safely.
  - Enforce data integrity with foreign keys and not-null constraints.
  - Index frequently queried columns (e.g., `userId` on articles) for faster lookups.

## 3. Database Schema

Below is a human-readable overview, followed by SQL statements to create the tables.

### Human-Readable Schema

Users Table:
- **id**: Unique identifier
- **email**: User’s email address
- **hashedPassword**: Securely stored password
- **createdAt** / **updatedAt**: Timestamps
- **credits** (optional): Remaining generation credits or tokens

Articles Table:
- **id**: Unique identifier
- **userId**: References Users.id
- **title**: The article title
- **keywords**: Main SEO keywords (comma-separated or JSON)
- **content**: Generated article text
- **settings**: JSONB storing voice, length, structure options
- **createdAt**: When it was generated

### SQL Schema (PostgreSQL)
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  credits INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  keywords TEXT[] NOT NULL,
  content TEXT NOT NULL,
  settings JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster user-article queries
CREATE INDEX idx_articles_user_id ON articles(user_id);
``` 

## 4. API Design and Endpoints

The backend exposes RESTful endpoints under `app/api/`:

• **POST /api/generate**
  - Purpose: Receive article settings, build an LLM prompt, call the AI API, save the result.
  - Input: JSON payload with title, keywords array, and settings object.
  - Output: JSON containing the new article ID and status.

• **GET /api/articles**
  - Purpose: Fetch a list of articles for the logged-in user.
  - Output: Array of articles (id, title, createdAt).

• **GET /api/articles/:id**
  - Purpose: Retrieve the full content and settings of a single article.
  - Output: Article object with content and settings.

• **Auth Routes (via Better Auth)**
  - **POST /api/auth/signup** and **POST /api/auth/signin**: Handle user registration and login.
  - **POST /api/auth/signout**: End session.

Key points: 
- Validation is done with Zod to ensure payload correctness before LLM calls.
- Error handling returns clear messages and HTTP status codes.
- All endpoints check the user session to enforce authorization.

## 5. Hosting Solutions

• **Vercel** (Recommended for production)
  - Serverless functions power our API routes.
  - Global edge network acts as a built-in CDN and load balancer.
  - Automatic scaling and zero-configuration SSL.

• **Docker & Docker Compose** (Local development)
  - Ensures your PostgreSQL container matches production.
  - Same environment for all developers, minimizing “but it works on my machine” issues.

Benefits:
- **Reliability**: Vercel’s SLA and automated deployments.
- **Scalability**: Functions scale with user demand without manual provisioning.
- **Cost-effectiveness**: Pay-per-use model; Docker keeps local costs predictable.

## 6. Infrastructure Components

• **Load Balancer / Edge Network**
  - Provided by Vercel’s global edge, distributing requests geographically.

• **Caching**
  - Next.js can cache API responses at the edge when appropriate.
  - In-memory cache or Redis (optional) for repeated LLM prompt templates or rate limiting.

• **Content Delivery Network (CDN)**
  - Built into Vercel, serving static assets like UI code and images from nearest locations.

• **Background Jobs (Future)**
  - For very large articles, consider Inngest or Vercel Cron Jobs to offload long-running generation tasks.

These components work together to reduce latency, handle traffic spikes, and provide a smooth user experience.

## 7. Security Measures

• **Authentication & Authorization**
  - Better Auth manages sessions and secure cookies.
  - API routes verify session tokens before proceeding.

• **Data Encryption**
  - HTTPS everywhere via Vercel’s SSL certificates.
  - PostgreSQL encryption at rest (managed by your cloud provider).

• **Environment Variables**
  - Secrets (LLM API keys, database URLs) stored in `.env` locally and Vercel Environment Variables in production.

• **Input Validation**
  - Zod schemas ensure only expected fields and formats are accepted, preventing injection attacks.

• **Principle of Least Privilege**
  - Database user has only the necessary permissions to read/write the application tables.

## 8. Monitoring and Maintenance

• **Logging**
  - Use Vercel Logs to track requests, errors, and function execution times.
  - Console logs in API handlers for troubleshooting.

• **Error Tracking**
  - Integrate Sentry (or similar) to capture runtime exceptions and alert the team.

• **Performance Metrics**
  - Vercel Analytics for API latency and traffic patterns.

• **Maintenance Practices**
  - Regularly update dependencies via automated tools (Dependabot).
  - Database migrations applied with version control to keep schema in sync.
  - Scheduled audits of environment variable settings and access controls.

## 9. Conclusion and Overall Backend Summary

The SEO Article Generator Starter backend combines powerful, type-safe technologies with a modular structure to deliver a scalable, maintainable, and high-performance foundation. Next.js API Routes and Better Auth handle business logic and security, while Drizzle ORM and PostgreSQL manage data with strong typing and flexibility. Vercel hosting and Docker-based local development ensure consistent environments, automatic scaling, and global delivery.

Unique aspects:
- **Type-Driven Flow**: End-to-end TypeScript integration reduces bugs.
- **JSONB Settings Storage**: Allows flexible article configurations without complex database changes.
- **Serverless Edge Architecture**: Guarantees low latency and auto-scaling.

With clear boundaries, best-practice tooling, and a roadmap for future growth (background jobs, credit systems), this backend setup is ready to support a robust SEO article generation platform.