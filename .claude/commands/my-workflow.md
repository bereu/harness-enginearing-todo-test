---
description: my-workflow
---

```mermaid
flowchart TD
    start_node_default([Start])
    end_node_default([End])
    prompt_1773922093034[Enter your prompt here.]
    skill_1773922148864[[Skill: plan-coding]]
    skill_1773922378632[[Skill: implement-feature]]
    subagentflow_1773922422836[["subagentflow-1773922422836"]]
    ifelse_1773922446153{If/Else:<br/>Conditional Branch}
    ifelse_1773922461949{If/Else:<br/>Conditional Branch}
    subagentflow_1773922543132[["subagentflow-1773922543132"]]

    start_node_default --> prompt_1773922093034
    prompt_1773922093034 --> skill_1773922148864
    skill_1773922378632 --> subagentflow_1773922422836
    subagentflow_1773922422836 --> ifelse_1773922446153
    skill_1773922148864 --> ifelse_1773922461949
    ifelse_1773922461949 -->|True| skill_1773922378632
    ifelse_1773922461949 -->|False| skill_1773922148864
    ifelse_1773922446153 -->|True| subagentflow_1773922543132
    subagentflow_1773922543132 --> end_node_default
```

## Workflow Execution Guide

Follow the Mermaid flowchart above to execute the workflow. Each node type has specific execution methods as described below.

### Execution Methods by Node Type

- **Rectangle nodes (Sub-Agent: ...)**: Execute Sub-Agents
- **Diamond nodes (AskUserQuestion:...)**: Use the AskUserQuestion tool to prompt the user and branch based on their response
- **Diamond nodes (Branch/Switch:...)**: Automatically branch based on the results of previous processing (see details section)
- **Rectangle nodes (Prompt nodes)**: Execute the prompts described in the details section below

## Skill Nodes

#### skill_1773922148864(plan-coding)

- **Prompt**: skill "plan-coding"

#### skill_1773922378632(implement-feature)

- **Prompt**: skill "implement-feature"

## Sub-Agent Flow Nodes

#### subagentflow_1773922422836(code-review)

@Sub-Agent: my-workflow_code-review

#### subagentflow_1773922543132(test-features)

@Sub-Agent: my-workflow_test-features

### Prompt Node Details

#### prompt_1773922093034(Enter your prompt here.)

```
Enter your prompt here.

You can use variables like {{variableName}}.
```

### If/Else Node Details

#### ifelse_1773922446153(Binary Branch (True/False))

**Branch conditions:**

- **True**: When condition is true
- **False**: When condition is false

**Execution method**: Evaluate the results of the previous processing and automatically select the appropriate branch based on the conditions above.

#### ifelse_1773922461949(Binary Branch (True/False))

**Branch conditions:**

- **True**: When condition is true
- **False**: When condition is false

**Execution method**: Evaluate the results of the previous processing and automatically select the appropriate branch based on the conditions above.
