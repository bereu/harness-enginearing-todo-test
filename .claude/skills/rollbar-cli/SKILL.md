---
name: rollbar-cli
description: Use this skill to query and manage Rollbar errors, occurrences, and deployments using the `rollbar-cli` command-line tool.
version: 1.0.0
---

## Overview

This skill enables you to query and manage your project's error tracking data in Rollbar via the `rollbar-cli` tool. You should use `rollbar-cli` directly in the terminal to inspect issues, troubleshoot occurrences, and check deployments without navigating the web UI.

Ensure `ROLLBAR_ACCESS_TOKEN` is set, or use the `--token` flag.

## Available Commands

Here are some of the primary uses of `rollbar-cli`:

### 1. View & Manage Items (Errors/Issues)
Use the `rollbar-cli items` command to query or manage Rollbar items.

*   **List items (Interactive Interface):**
    ```bash
    rollbar-cli items list
    ```
    *Note: This command opens an interactive Terminal UI where you can use arrow keys (`↑/↓`) to navigate, `enter` to view occurrences, `o` for details, `y` to copy ID, and `r` to resolve. Press `q` or `Ctrl+C` to exit.*

*   **Get a specific item:**
    ```bash
    rollbar-cli items get <id_or_uuid>
    ```
*   **Resolve or close an item:**
    ```bash
    rollbar-cli items resolve <id>
    rollbar-cli items mute <id>
    ```

### 2. View Occurrences
To investigate specific occurrences of items:
```bash
rollbar-cli occurrences --help
```

### 3. Check Deploys
To query or monitor recent deployments:
```bash
rollbar-cli deploys --help
```

### 4. Environments & Users
*   `rollbar-cli environments`: Query existing environments.
*   `rollbar-cli users`: Query users that have experienced errors.

## Output Output
The tool supports formatting output as structured JSON, NDJSON, or standard terminal views. Run `rollbar-cli [command] --help` for specific details and flags on each sub-command.
