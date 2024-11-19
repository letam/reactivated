#!/usr/bin/env bash

if [ $# -eq 0 ]; then
    >&2 echo "Provide a project name."
    exit 1
fi

# On macOS, the first time you setup venv a really weird issue happens
# and site-packages is not in sys.path. I cannot figure out why, no files
# or env variables change in between nix-shell runs.
nix-shell --command ""

nix-shell --command "npm install && python scripts/generate_types.py && npm exec -w reactivated tsc && playwright install && npm install"

./scripts/script-create-django-app.sh --name "$1"

