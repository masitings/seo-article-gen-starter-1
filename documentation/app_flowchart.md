flowchart TD
  A[User visits app] --> B[Display Login Page]
  B --> C{Authenticated?}
  C -->|No| D[Show Login Form]
  D --> E[Submit Credentials]
  E --> C
  C -->|Yes| F[Display Dashboard]
  F --> G[Load Article History]
  G --> H[Display History]
  F --> I[Fill Article Form]
  I --> J[Click Generate]
  J --> K[POST to api generate]
  K --> L[Prompt Builder]
  L --> M[Call LLM API]
  M --> N[Receive Article Response]
  N --> O[Save to Database]
  O --> P[Return API Response]
  P --> Q[Display Generated Article]