#!/bin/sh
# OpenAdapt installer — https://openadapt.ai
#
#   curl -fsSL https://openadapt.ai/install.sh | sh
#
# Installs uv (a fast Python toolchain) if you don't have it, then installs
# OpenAdapt as a persistent `openadapt` command. Safe to re-run: it upgrades
# in place. Nothing runs with elevated privileges; read the script first if
# you like — that's why it's served in the clear over HTTPS.
set -eu

info() { printf '\033[1;36m==>\033[0m %s\n' "$1"; }
err()  { printf '\033[1;31mError:\033[0m %s\n' "$1" >&2; }

if ! command -v curl >/dev/null 2>&1; then
    err "curl is required but not installed."
    exit 1
fi

if ! command -v uv >/dev/null 2>&1; then
    info "Installing uv (fast Python package manager)…"
    curl -LsSf https://astral.sh/uv/install.sh | sh
    # uv installs to ~/.local/bin by default; make it visible to this script.
    export PATH="$HOME/.local/bin:$PATH"
fi

if ! command -v uv >/dev/null 2>&1; then
    err "uv was installed but isn't on your PATH yet."
    err "Open a new terminal and re-run this command, or add ~/.local/bin to PATH."
    exit 1
fi

info "Installing OpenAdapt…"
uv tool install --upgrade openadapt

# Make sure the installed `openadapt` command is on PATH in future shells.
uv tool update-shell >/dev/null 2>&1 || true

info "OpenAdapt is installed. Launch it with:"
printf '\n    openadapt\n\n'
info "If your shell can't find it yet, open a new terminal first."
