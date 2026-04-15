#!/bin/sh
env -u GITHUB_TOKEN gh pr create \
  --title "feat: Add hello endpoint to harness-for-todo-app [86e315d6-a67b-4526-b646-bf36a14544e4]" \
  --body-file pr_body.txt \
  --repo bereu/harness-enginearing-todo-test \
  --base main
