# ADR-010: AI-Assisted Development Governance

## Status
ACCEPTED

## Context
OpenPLM uses Antigravity (AI coding assistant) for implementation. Without governance, AI-assisted development can produce large, untested, architecturally inconsistent code. Clear rules are needed to maintain engineering discipline.

## Decision
Establish explicit governance rules for AI-assisted development. The human project owner retains authority over scope, architecture, technology, and major design decisions. The AI assistant implements within approved boundaries.

## Rules
1. AI reads relevant documentation before making changes
2. AI works only on the approved task
3. No silent architecture or technology changes
4. No speculative features
5. Domain rules cannot be weakened for convenience
6. Tests are part of implementation
7. Changes are focused — unrelated modifications are not bundled
8. AI must stop and ask when an approved decision needs to change

## Reasoning
- Engineering projects require traceability and deliberate design
- AI can generate large volumes of code quickly — governance ensures quality over quantity
- Preventing scope creep and technology sprawl
- Maintaining audit trail of decisions

## Consequences
- Development is slower but more controlled
- All architecture-affecting changes require human approval
- The AI assistant reports concerns rather than silently deciding
- Documentation, tests, and code remain consistent
