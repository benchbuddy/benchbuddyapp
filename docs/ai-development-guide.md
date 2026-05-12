# Bench Buddy — AI Development Guide

This file defines the engineering standards and architectural principles that ALL AI coding agents must follow when generating or modifying code for Bench Buddy.

Bench Buddy is a React Native (Expo) mobile application focused on discovering, documenting, and improving public resting spaces.

---

## Core Philosophy

Bench Buddy prioritizes:

* clarity over cleverness
* maintainability over speed
* accessibility-first design
* scalable architecture
* minimal technical debt

AI agents must produce code suitable for long-term production use.

---

## SOLID Principles (MANDATORY)

### 1. Single Responsibility Principle (SRP)

Each component, hook, service, or module must have ONE clear responsibility.

DO:

* Separate UI from data logic
* Create reusable hooks
* Keep screens thin

DO NOT:

* Fetch data inside UI components
* Mix navigation, styling, and business logic

Example structure:

```
screens/
components/
hooks/
services/
api/
```

---

### 2. Open / Closed Principle (OCP)

Code must be open for extension but closed for modification.

Rules:

* Prefer configuration over rewriting logic
* Add new features via composition
* Avoid modifying existing components when extending behaviour

Use:

* props
* interfaces
* strategy patterns

---

### 3. Liskov Substitution Principle (LSP)

Any component replacement must not break expected behavior.

Requirements:

* Shared component contracts
* Predictable props
* No hidden side effects

Example:
All map markers must behave consistently regardless of bench type.

---

### 4. Interface Segregation Principle (ISP)

Avoid large, bloated interfaces.

Rules:

* Small focused hooks
* Feature-specific services
* Separate data models

Example:

```
useBenches()
useReports()
useMemorials()
```

NOT:

```
useEverything()
```

---

### 5. Dependency Inversion Principle (DIP)

High-level modules must not depend on implementation details.

Rules:

* Screens depend on services, not APIs
* APIs abstracted behind service layer
* No direct fetch calls inside UI

Architecture flow:

```
UI → Hook → Service → API
```

---

## Project Architecture

Expected folder structure:

```
src/
  screens/
  components/
  navigation/
  hooks/
  services/
  api/
  models/
  utils/
  constants/
```

AI agents must maintain this structure.

---

## React Native Standards

### Components

* Functional components only
* Use hooks
* No class components
* Keep components <150 lines where possible

### State Management

Prefer:

* React hooks
* Context API

Avoid introducing global state libraries unless explicitly requested.

---

## Data Rules

Bench is the core domain model.

A Bench must be treated as a first-class entity with:

* id
* location
* tags
* accessibility attributes
* memorial metadata
* condition status

Never hardcode mock data inside UI components.

---

## Mapping Principles

The map is the primary interface.

AI agents must:

* keep map performance optimized
* avoid unnecessary re-renders
* load data lazily
* cluster markers where appropriate

---

## Accessibility Requirements

Bench Buddy is accessibility-first.

Generated code must:

* support screen readers
* use semantic labels
* maintain high contrast
* avoid gesture-only interactions

Accessibility is NOT optional.

---

## Code Quality Rules

AI agents must:

* Prefer readable names over abbreviations
* Avoid premature optimisation
* Write reusable components
* Avoid duplication
* Comment WHY, not WHAT

---

## Forbidden Patterns

AI agents must NOT:

* create monolithic files
* mix networking with UI rendering
* introduce unnecessary libraries
* over-engineer abstractions
* generate unused code

---

## Development Strategy

Build progressively:

1. Map rendering
2. Bench display
3. Bench details
4. User contributions
5. Reporting system
6. Accessibility features

Always prioritise a working product over feature completeness.

---

## AI Behaviour Expectations

When generating code, AI agents must:

* explain architectural decisions
* propose improvements before implementation
* avoid assumptions about backend structure
* request clarification if requirements are ambiguous

---

## Long-Term Vision

Bench Buddy aims to become a civic infrastructure platform for public rest and accessibility.

All generated code should support future scalability toward:

* council integrations
* analytics
* public data systems
* accessibility routing

---

END OF GUIDE