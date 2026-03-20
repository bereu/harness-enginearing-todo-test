---
name: my-workflow_test-features
description: test-features
model: sonnet
---

```mermaid
flowchart TD
    start_1773922510290([Start])
    end_1773922510291([End])
    skill_1773922530338[[Skill: qa-features-skills]]

    start_1773922510290 --> skill_1773922530338
    skill_1773922530338 --> end_1773922510291
```

## Workflow Execution Guide

Follow the Mermaid flowchart above to execute the workflow. Each node type has specific execution methods as described below.

### Execution Methods by Node Type

- **Rectangle nodes (Sub-Agent: ...)**: Execute Sub-Agents
- **Diamond nodes (AskUserQuestion:...)**: Use the AskUserQuestion tool to prompt the user and branch based on their response
- **Diamond nodes (Branch/Switch:...)**: Automatically branch based on the results of previous processing (see details section)
- **Rectangle nodes (Prompt nodes)**: Execute the prompts described in the details section below

## Skill Nodes

#### skill_1773922530338(qa-features-skills)

- **Prompt**: skill "qa-features-skills"
