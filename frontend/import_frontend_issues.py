import json
import subprocess

REPO = "HuluRent/HuluRent-frontend"

with open("frontend_issues.json", "r", encoding="utf-8") as f:
    issues = json.load(f)

print(f"Found {len(issues)} issues.")

for issue in issues:
    body = f"""## Area
{issue.get('area', '')}

## Description
{issue.get('description', '')}

## Acceptance Criteria
{issue.get('acceptance_criteria', '')}

## Priority
{issue.get('priority', '')}

## Complexity
{issue.get('complexity', '')}

## Dependencies
{issue.get('dependencies', '')}

## Role
{issue.get('role', '')}
"""

    cmd = [
        "gh", "issue", "create",
        "--repo", REPO,
        "--title", f"{issue['id']} — {issue['title']}",
        "--body", body,
    ]

    for label in issue.get("labels", []):
        cmd.extend(["--label", label])

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0:
        print(f"✓ {issue['id']}")
    else:
        print(f"ERROR {issue['id']}")
        print(result.stderr.strip())
