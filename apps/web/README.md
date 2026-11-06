# Web application

React + TypeScript + Material UI application.

The source layout is intentionally feature-oriented:

```text
src/
  app/            application bootstrap, providers, routing
  assets/         static assets imported by the application
  components/     reusable presentation components
  config/         typed runtime/build configuration
  features/       isolated product feature modules
  hooks/          reusable React hooks
  layouts/        page-level layouts
  lib/            framework and third-party integrations
  services/       API client and external service adapters
  styles/         global styles and MUI theme
  types/          web-only TypeScript types
  utils/          pure helpers
```
