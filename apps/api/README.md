# API application

Spring Boot application organized around domain modules. Each module owns its API, application services, domain model, and infrastructure adapters.

```text
src/main/java/com/myenglishcoach/
  shared/         cross-cutting, domain-neutral code
  modules/        bounded contexts / product modules
    <module>/
      api/        controllers and request/response DTOs
      application/ use cases and orchestration
      domain/     business model and ports
      infrastructure/ persistence and external adapters
```
