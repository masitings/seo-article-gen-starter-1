# Tech Stack Document for SEO Article Generator Starter

This document outlines the technologies chosen for the SEO Article Generator Starter project. It’s written in everyday language so that non-technical readers can understand why each tool or framework was selected and how it contributes to the overall application.

## 1. Frontend Technologies

The frontend is everything the user interacts with in their browser. We chose tools that make the interface both attractive and easy to build and maintain.

- **Next.js (App Router)**  
  A React-based framework that handles page routing, server-side rendering, and static page generation out of the box. It speeds up development and improves performance by letting us choose between pre-rendering and client-side rendering where each makes sense.

- **TypeScript**  
  A typed version of JavaScript that catches errors early, ensuring our code is more reliable. It guarantees that data structures defined in the backend match what the frontend expects.

- **Tailwind CSS**  
  A utility-first CSS framework that provides ready-made styling classes. Developers can rapidly style the interface without writing custom CSS, ensuring a consistent look and feel.

- **shadcn/ui**  
  A library of pre-built, accessible React components (like dropdowns, switches, cards) styled with Tailwind. It makes assembling complex forms—such as the article settings panel—quick and consistent.

- **React Query or SWR**  
  Libraries to manage asynchronous data fetching on the client side. They handle loading states, caching, and automatic updates, so users get a smooth experience when generating articles or viewing history.

## 2. Backend Technologies

The backend powers the application’s logic and data storage. These tools ensure user data is managed securely and generation requests are processed correctly.

- **Next.js API Routes**  
  Serverless functions built into Next.js. We use them to create endpoints (for example, `/api/generate`) that receive user inputs, build prompts for the AI, call the AI service, and return results.

- **Better Auth**  
  An authentication library that handles user sign-up, sign-in, and session management. It secures every request so only logged-in users can generate articles or view their past work.

- **Zod**  
  A schema validation library used in API routes to check that incoming data (title, keywords, settings) is complete and correctly formatted before calling the AI service.

- **Drizzle ORM**  
  A TypeScript-first Object-Relational Mapping tool used to define database tables and interact with PostgreSQL in a type-safe manner. It prevents runtime errors by enforcing types from the database up through the code.

- **PostgreSQL**  
  A powerful, open-source relational database. We store user accounts, generated articles (content, title, timestamps), and a JSON field for the exact settings used in each generation.

## 3. Infrastructure and Deployment

These components ensure that the application runs reliably, can be scaled, and is easy for developers to deploy and maintain.

- **Docker & Docker Compose**  
  Tools for containerizing the application and database. Developers get an identical setup on their machines as in production, reducing the "it works on my machine" problem.

- **Vercel**  
  Our recommended hosting platform. It integrates seamlessly with Next.js, automatically building and deploying changes. API routes run as serverless functions, scaling up or down based on demand.

- **Git & GitHub**  
  Version control and code hosting. Git tracks changes, while GitHub provides collaboration tools (pull requests, code reviews).

- **CI/CD Pipeline**  
  Automated workflows (for example, using GitHub Actions) that run tests and deploy to Vercel whenever code is merged. This ensures high code quality and quick delivery of new features.

- **Environment Variables**  
  Stored in `.env` files (locally) and in Vercel’s dashboard (in production). They securely hold secrets like the AI API key, database URL, and auth credentials.

## 4. Third-Party Integrations

External services we connect to in order to extend functionality without reinventing the wheel.

- **Large Language Model (LLM) API**  
  Services like OpenAI or Anthropic. We send user-built prompts and receive generated article text. This is the core of the article generation feature.

- **Better Auth**  
  (Also listed under backend.) Though an internal library, it relies on secure token-based sessions to manage user authentication.

- **Analytics Tools (Optional)**  
  Services such as Google Analytics or Plausible can be added to track user behavior, generation counts, and feature usage for future improvements.

## 5. Security and Performance Considerations

We built in safeguards to protect user data and keep the application running smoothly.

- **Authentication & Authorization**  
  Every API route is protected by Better Auth. Users must sign in before generating articles or accessing their history.

- **Input Validation with Zod**  
  Ensures that only valid data reaches the AI service, preventing malformed requests and saving on API usage costs.

- **Error Handling**  
  API routes catch and return clear error messages for issues like AI timeouts or invalid inputs. The frontend displays these messages so users know what went wrong.

- **Rate Limiting / Usage Controls (Future)**  
  We can introduce a credits or token system to prevent abuse and manage API costs. This would involve adding usage-tracking fields to the user schema.

- **Performance Optimization**  
  - **Server Components** for fetching and displaying data that doesn’t require interactivity, reducing bundle size on the client.  
  - **Client Components** for the interactive form, loaded only when needed.  
  - **Caching** responses with React Query or SWR to avoid redundant network requests when revisiting past articles.

## 6. Conclusion and Overall Tech Stack Summary

This project’s tech stack is designed to deliver a secure, high-performance, and developer-friendly SEO Article Generator:

- Frontend: Next.js, TypeScript, Tailwind CSS, shadcn/ui, React Query/SWR
- Backend: Next.js API Routes, Better Auth, Zod, Drizzle ORM, PostgreSQL
- Infrastructure: Docker, Vercel, Git/GitHub, CI/CD (GitHub Actions), environment variables
- Integrations: LLM API (OpenAI/Anthropic), optional analytics
- Security & Performance: Auth protection, input validation, error handling, server/client component hybrid, caching

By combining these technologies, we ensure a smooth user experience—from a polished settings form to fast, reliable article generation—while keeping the codebase maintainable, type-safe, and ready for future enhancements.