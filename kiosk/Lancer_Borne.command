#!/bin/bash
# Lancer la Borne Chickenzz sur Mac
cd "$(dirname "$0")"
open -a "Google Chrome" --args --kiosk --kiosk-printing "file://$(pwd)/index.html"
