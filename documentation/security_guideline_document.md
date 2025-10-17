# Security Guidelines for seo-article-gen-starter-1

This document outlines the security best practices and controls you must integrate into the **SEO Article Generator Starter** codebase to ensure a robust, secure, and maintainable application by design.

---

## 1. Overview & Scope

- **Project:** seo-article-gen-starter-1 – a Next.js full-stack boilerplate for generating and managing SEO-optimized articles.
- **Technology Stack:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Better Auth, Drizzle ORM with PostgreSQL, Docker, Vercel.
- **Security Goal:** Protect user data, maintain confidentiality of AI API credentials, ensure integrity of generated content, and guard against common web and API attacks.

---

## 2. Authentication & Access Control

1. Implement robust authentication with Better Auth:
   - Enforce strong password policies (minimum 12 characters, mixed case, numbers, symbols).
   - Hash passwords with Argon2 or bcrypt using a unique salt per user.

2. Session Management:
   - Use secure, HttpOnly, `SameSite=Strict` cookies for session tokens.
   - Set idle and absolute timeouts (e.g., 15m idle, 8h absolute).
   - Regenerate session identifiers on login to prevent fixation.
   - Provide secure logout endpoints that destroy server-side sessions.

3. Role-Based Access Control (RBAC):
   - Define roles (e.g., `user`, `admin`).
   - Enforce server-side authorization checks in every API route (no client-side shortcuts).
   - Validate permissions before reading or writing user data (e.g., only the owner can view/edit their articles).

4. Multi-Factor Authentication (MFA) (Optional):
   - Consider adding TOTP or SMS-based MFA for heightened security, especially for admins.

---

## 3. Input Handling & Processing

1. Server-Side Validation:
   - Use **Zod** schemas in every API route request handler (`/api/generate`, `/api/articles`) to strictly validate request body shapes.
   - Reject and log any malformed or unexpected payloads.

2. Prevent Injection Attacks:
   - Always use parameterized Drizzle ORM queries—never string-concatenate SQL.
   - Sanitize user-provided article settings before embedding them into LLM prompt templates to avoid prompt injection or unintended commands.

3. XSS & Output Encoding:
   - Encode any user-generated content (e.g., article titles or custom HTML) before rendering in React.
   - If rendering rich text, use a vetted sanitizer like DOMPurify.

4. Redirect & URL Handling:
   - If implementing redirects (e.g., post-login), validate targets against an allow-list of internal routes.

5. CSRF Protection:
   - Use Next.js built-in CSRF tokens or a library like `csurf` for all state-changing API routes.

---

## 4. Data Protection & Secrets Management

1. Encryption:
   - Enforce TLS 1.2+ for all client ↔ server and server ↔ database connections.
   - Enable at-rest encryption for PostgreSQL (e.g., AWS RDS encryption).

2. Secrets Management:
   - Store AI API keys and database credentials in a secure vault (e.g., Vercel Environment Variables, HashiCorp Vault), never in source code.
   - Rotate keys periodically and on any suspected compromise.

3. Sensitive Data Handling:
   - Avoid logging PII (email addresses, article content) in plaintext. Mask or omit sensitive fields.
   - Implement audit logging for security-relevant events (failed logins, privilege changes) without exposing sensitive details.

4. Backups & Retention:
   - Secure database backups with encryption and access controls.
   - Define and enforce a data retention policy compliant with GDPR/CCPA (e.g., delete user data on request).

---

## 5. API & Service Security

1. Enforce HTTPS:
   - Redirect all HTTP traffic to HTTPS.
   - Enable HSTS (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`).

2. Rate Limiting & Throttling:
   - Protect `/api/generate` and auth endpoints with rate limiting (e.g., 5 requests/min per IP or user).
   - Mitigate brute-force and DoS attacks.

3. CORS Policy:
   - Restrict `Access-Control-Allow-Origin` to your front-end domain(s) only.
   - Avoid wildcard `*` in production.

4. Proper HTTP Methods:
   - Use GET for fetch operations, POST for create/generate, PUT/PATCH for updates, DELETE for removals.
   - Reject mismatched verbs with `405 Method Not Allowed`.

5. API Versioning:
   - Prefix routes with a version (e.g., `/api/v1/generate`) to support future changes without breaking clients.

6. Minimal Response Exposure:
   - Return only necessary fields in API responses (omit internal IDs, implementation details).

---

## 6. Web Application Security Hygiene

1. Security Headers:
   - Content-Security-Policy: limit scripts/styles to trusted sources, enable SRI for any CDN assets.
   - X-Frame-Options: `DENY` or `SAMEORIGIN` to prevent clickjacking.
   - X-Content-Type-Options: `nosniff`.
   - Referrer-Policy: `strict-origin-when-cross-origin`.

2. Secure Cookies:
   - `Secure; HttpOnly; SameSite=Strict` for all session/auth cookies.

3. Client-Side Storage:
   - Avoid storing tokens or PII in `localStorage` or `sessionStorage`.

4. Disable Debug Features:
   - Ensure `NODE_ENV=production` in production builds.
   - Remove console logs of sensitive data.

---

## 7. Infrastructure & Configuration Management

1. Docker Security:
   - Run containers with a non-root user.
   - Minimize base image size (e.g., use `node:18-alpine`).
   - Disable unused capabilities and ports.

2. Configuration as Code:
   - Store deployment manifests (Docker Compose, Vercel config) in version control.
   - Use secrets injection mechanisms rather than hardcoding.

3. Patch Management:
   - Regularly update OS packages, Node.js, dependencies, and Docker images.
   - Subscribe to security advisories for all core technologies.

4. File Permissions:
   - Restrict file system permissions in the container and on the host (e.g., config files readable only by the application user).

---

## 8. Dependency Management

1. Lockfiles & Deterministic Builds:
   - Commit `package-lock.json` or `yarn.lock` to ensure reproducible installs.

2. Vulnerability Scanning:
   - Integrate SCA tools (e.g., GitHub Dependabot, Snyk) to detect and alert on vulnerable packages.

3. Minimal Footprint:
   - Remove unused dependencies.
   - Audit for unnecessary transitive packages.

4. Regular Updates:
   - Schedule monthly dependency updates and patch cycles.

---

## 9. Monitoring, Logging & Incident Response

- Implement centralized logging (e.g., Datadog, ELK) with redaction of PII.
- Monitor auth failures, rate-limit triggers, and error rates on `/api/generate`.
- Define an incident response plan: alert on threshold breaches, rotate compromised credentials, communicate with stakeholders.

---

## 10. Continuous Integration & Testing

- Include security linting (ESLint plugins: `eslint-plugin-security`).
- Add automated tests:
  - Unit tests for prompt-builder logic.
  - Integration tests for `/api/generate` with mocked LLM and database.
- Run SAST (e.g., Bandit for Python, if any) and DAST (e.g., OWASP ZAP) in CI pipelines.

---

By following these guidelines, you will build a secure, resilient SEO Article Generator that protects your users, your infrastructure, and your brand reputation. Always review each change through the lens of security and prioritize defense-in-depth at every layer.