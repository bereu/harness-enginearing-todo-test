---
name: my-workflow_code-review
description: code-review
model: sonnet
---

```mermaid
flowchart TD
    start_1773922395897([Start])
    end_1773922395898([End])
    skill_1773922413711[[Skill: code-review]]

    start_1773922395897 --> skill_1773922413711
    skill_1773922413711 --> end_1773922395898
```

## Workflow Execution Guide

Follow the Mermaid flowchart above to execute the workflow. Each node type has specific execution methods as described below.

### Execution Methods by Node Type

- **Rectangle nodes (Sub-Agent: ...)**: Execute Sub-Agents
- **Diamond nodes (AskUserQuestion:...)**: Use the AskUserQuestion tool to prompt the user and branch based on their response
- **Diamond nodes (Branch/Switch:...)**: Automatically branch based on the results of previous processing (see details section)
- **Rectangle nodes (Prompt nodes)**: Execute the prompts described in the details section below

## Skill Nodes

#### skill_1773922413711(code-review)

- **Prompt**: skill "code-review"
