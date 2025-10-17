# Frontend Guidelines Document

This document outlines the frontend setup for the SEO Article Generator Starter project. It covers the architecture, design principles, styling, components, state management, routing, performance optimizations, testing, and a final overview. By following these guidelines, any developer—even without a deep technical background—can understand and contribute to the frontend codebase.

## 1. Frontend Architecture

**Framework and Libraries**
- **Next.js (App Router)**: Provides a file-based routing system, server-side rendering, and hybrid server/client components.
- **TypeScript**: Ensures type safety across the frontend, minimizing runtime errors.
- **Tailwind CSS**: A utility-first CSS framework for rapid styling.
- **shadcn/ui**: A collection of pre-built, accessible UI components (Buttons, Cards, Selects, Switches, etc.).
- **React Query (or SWR)**: Manages data fetching, caching, and server state on the client side.

**How It Supports Scalability, Maintainability, and Performance**
- **Modular Structure**: Code is divided into small, focused components and folders (e.g., `components/ui`, `app/dashboard`, `app/api`).
- **Type-Driven Development**: Shared TypeScript types from Drizzle ORM ensure consistency between database schemas, API routes, and UI props.
- **Server/Client Hybrid**: Server Components fetch and render data quickly, while Client Components handle interactivity, reducing bundle size and improving performance.
- **Docker & Vercel**: Consistent environments and seamless deployments.

## 2. Design Principles

**Key Principles**
1. **Usability**: Simple and intuitive forms, clear feedback on user actions.
2. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation, and high-contrast color palettes.
3. **Responsiveness**: Mobile-first design with breakpoints for tablets and desktops.
4. **Consistency**: Same spacing, typography, and components across the app.

**Application in UI Design**
- Forms use clear labels and placeholders.
- Buttons have distinct hover and disabled states.
- Error messages are shown near inputs with red text and icons.
- Interactive elements meet WCAG color contrast ratios.

## 3. Styling and Theming

**Styling Approach**
- **Utility-First (Tailwind CSS)**: Use Tailwind’s class names (e.g., `px-4`, `text-gray-700`, `bg-blue-500`) to style components directly.
- **No BEM or SMACSS**: Tailwind eliminates the need for custom naming conventions.
- **Custom Tailwind Config**: Extend `tailwind.config.js` for brand colors and fonts.

**Theming**
- Themes are defined in `tailwind.config.js` under the `theme.extend` section. Switching themes (light/dark) is done via the `class` strategy on the `<html>` element.

**Visual Style**
- **Design Style**: Modern flat design with subtle shadows and rounded corners.
- **Glassmorphism**: Light use of semi-transparent backgrounds for overlay cards.

**Color Palette**
| Role        | Color Name   | Hex      |
|-------------|--------------|----------|
| Primary     | Ocean Blue   | #1E40AF  |
| Secondary   | Seafoam      | #22C55E  |
| Accent      | Amber        | #F59E0B  |
| Neutral     | Gray Scale   | #F3F4F6, #9CA3AF, #4B5563 |
| Dark Mode   | Dark Slate   | #111827  |

**Typography**
- **Primary Font**: Inter, `font-family: 'Inter', sans-serif;`
- **Fallback**: System UI fonts for performance.
- **Headings**: Bold weights (600–800).
- **Body Text**: Regular weight (400–500).

## 4. Component Structure

**Organization and Reuse**
- **`components/ui/`**: Atomic UI pieces (Button, Input, Card, Select, Switch).
- **`components/generator-form.tsx`**: Composite component for the full article settings form.
- **`app/dashboard/page.tsx`**: Page-level component assembling the header, form, and history list.

**Why Component-Based Architecture?**
- **Reusability**: Build once, use everywhere (e.g., a `Button` component styled consistently).
- **Maintainability**: Fix or update logic in one place, and all consumers inherit the change.
- **Isolation**: Components own their styles and logic, reducing unintended side effects.

## 5. State Management

**Client-Side State**
- **Local Form State**: Managed with React’s `useState` or `useReducer` inside the form component.
- **Server State**: Handled by React Query (or SWR). It caches API calls for the article history and tracks loading/error states.

**Shared State Patterns**
- **Context API**: For global UI settings (e.g., theme switcher).
- **React Query**: For data that comes from the server (articles, user profile).

## 6. Routing and Navigation

**Next.js App Router**
- **File-Based Routes**: `app/dashboard/page.tsx` → `/dashboard`.
- **Nested Layouts**: Shared layouts and headers in `app/layout.tsx`.
- **Dynamic Routes**: Example: `app/dashboard/articles/[id]/page.tsx` for viewing a specific article.

**Navigation Components**
- Use `next/link` for client-side transitions (`<Link href="/dashboard">Dashboard</Link>`).
- Use `useRouter` from `next/navigation` for programmatic routing.

## 7. Performance Optimization

**Key Strategies**
1. **Code Splitting**: Use `dynamic()` from Next.js for large components (e.g., the article viewer).
2. **Lazy Loading**: Load heavy modules and images only when needed.
3. **Image Optimization**: Use `next/image` for automatic resizing and format selection (WebP). 
4. **Unused CSS Removal**: Tailwind’s built-in purge feature removes unused classes.
5. **Server Components**: Offload data fetching to the server, sending only HTML and minimal JS to the client.
6. **Cache-Control Headers**: Leverage Next.js built-in caching for static assets.

## 8. Testing and Quality Assurance

**Testing Strategy**
- **Unit Tests**: Jest + React Testing Library for components and prompt-builder logic.
- **Integration Tests**: Test API endpoint `/api/generate` with mocked LLM responses using `supertest`.
- **End-to-End Tests**: Cypress or Playwright to simulate user flows (login, form fill, article generation, history view).

**Quality Tools**
- **ESLint**: Enforce code style and catch errors early.
- **Prettier**: Auto-formatting for consistent code style.
- **TypeScript Compiler**: Strict mode enabled to catch type issues.
- **Zod**: Validate API request payloads, ensuring required fields are present and properly formatted.

## 9. Conclusion and Overall Frontend Summary

This guideline presents a clear, everyday-language overview of the frontend setup: a modular, TypeScript-based Next.js application styled with Tailwind CSS and enhanced by shadcn/ui components. We follow modern design principles—usability, accessibility, and responsiveness—while maintaining a scalable architecture supported by Docker and Vercel. State and data fetching are cleanly handled with React Query, and routing leverages Next.js App Router.

Unique features include:
- **Hybrid Server/Client Components** for fast load times and interactivity.
- **Type-Driven Development** from database to UI.
- **Prompt Builder Module** for consistent AI requests.

By adhering to these guidelines, developers can confidently build, extend, and maintain the SEO Article Generator’s frontend, ensuring a high-quality user experience and a robust codebase for future growth.