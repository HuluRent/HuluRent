#!/usr/bin/env python3

import json
import subprocess
import sys
from pathlib import Path

REPO = "HuluRent/HuluRent-backend"
ISSUES_FILE = Path("backend_issues.json")

LABELS = {
    "backend": "Backend work",
    "chore": "Maintenance and project setup",
    "security": "Security",
    "database": "Database",
    "bookings": "Booking system",
    "auth": "Authentication",
    "users": "User management",
    "categories": "Categories",
    "listings": "Listings",
    "search": "Search",
    "availability": "Availability",
    "agreements": "Agreements",
    "legal": "Legal requirements",
    "inspections": "Inspections",
    "messaging": "Messaging",
    "websocket": "WebSocket / real-time",
    "evidence": "Evidence",
    "reviews": "Reviews",
    "reports": "Reports",
    "admin": "Admin functionality",
    "notifications": "Notifications",
    "jobs": "Background jobs",
    "testing": "Testing",
}


def run_gh(*args, check=True):
    result = subprocess.run(
        ["gh", *args],
        text=True,
        capture_output=True,
    )

    if check and result.returncode != 0:
        print(result.stderr.strip())
        sys.exit(result.returncode)

    return result


def ensure_labels():
    print("\nChecking labels...\n")

    existing_result = run_gh(
        "label",
        "list",
        "--repo",
        REPO,
        "--limit",
        "100",
        "--json",
        "name",
    )

    existing = {
        label["name"]
        for label in json.loads(existing_result.stdout or "[]")
    }

    for label, description in LABELS.items():
        if label in existing:
            print(f"✓ Label exists: {label}")
            continue

        result = run_gh(
            "label",
            "create",
            label,
            "--repo",
            REPO,
            "--description",
            description,
            "--color",
            "ededed",
            check=False,
        )

        if result.returncode == 0:
            print(f"✓ Created label: {label}")
        else:
            print(f"⚠ Could not create label '{label}':")
            print(result.stderr.strip())


def issue_exists(title):
    result = run_gh(
        "issue",
        "list",
        "--repo",
        REPO,
        "--search",
        f'"{title}" in:title',
        "--state",
        "all",
        "--limit",
        "100",
        "--json",
        "title",
    )

    issues = json.loads(result.stdout or "[]")
    return any(issue["title"] == title for issue in issues)


def create_issue(issue):
    issue_id = issue["id"]
    title = issue["title"]

    if issue_exists(title):
        print(f"SKIP     {issue_id} already exists")
        return

    body = f"""## Description

{issue["description"]}

## Acceptance Criteria

{issue["acceptance_criteria"]}

## Project Metadata

- **Issue ID:** {issue["id"]}
- **Area:** {issue["area"]}
- **Priority:** {issue["priority"]}
- **Complexity:** {issue["complexity"]}
- **Dependencies:** {issue["dependencies"]}
- **Role:** {issue["role"]}
"""

    args = [
        "issue",
        "create",
        "--repo",
        REPO,
        "--title",
        title,
        "--body",
        body,
    ]

    for label in issue.get("labels", []):
        args.extend(["--label", label])

    result = run_gh(*args, check=False)

    if result.returncode != 0:
        print(f"ERROR    {issue_id}")
        print(result.stderr.strip())
        sys.exit(result.returncode)

    print(f"CREATED  {issue_id} -> {result.stdout.strip()}")


def main():
    if not ISSUES_FILE.exists():
        print(f"Missing {ISSUES_FILE}")
        sys.exit(1)

    issues = json.loads(ISSUES_FILE.read_text(encoding="utf-8"))

    print(f"Found {len(issues)} issues.")

    ensure_labels()

    print("\nCreating issues...\n")

    for issue in issues:
        create_issue(issue)

    print("\n================================")
    print("Import complete.")
    print("================================")


if __name__ == "__main__":
    main()