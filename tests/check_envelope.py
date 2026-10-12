#!/usr/bin/env python3
"""tests/check_envelope.py — validate a function response against
api/v1/schema/envelope.json (§1.10). No third-party deps (stdlib only):
implements just enough of draft 2020-12 for this schema.

Usage: curl -sf $BASE/api/health | python3 tests/check_envelope.py
Exits 0 on valid, 1 with a message on invalid.
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCHEMA = json.load(open(os.path.join(ROOT, "api", "v1", "schema", "envelope.json")))

ERRORS = []


def bad(msg):
    ERRORS.append(msg)


def check_type(val, types, path):
    names = {"object": dict, "array": list, "string": str, "boolean": bool, "null": type(None)}
    if isinstance(types, str):
        types = [types]
    if not any(isinstance(val, names[t]) for t in types if t in names):
        bad(f"{path}: expected {types}, got {type(val).__name__}")
        return False
    # bool is a subclass of int in python; guard integer checks elsewhere if needed
    return True


def check_schema(val, schema, path):
    if "type" in schema and not check_type(val, schema["type"], path):
        return
    if isinstance(val, dict):
        for req in schema.get("required", []):
            if req not in val:
                bad(f"{path}: missing required '{req}'")
        props = schema.get("properties", {})
        for k, sub in props.items():
            if k in val:
                check_schema(val[k], sub, f"{path}.{k}")
        if "pattern" in schema and isinstance(val, str):
            pass  # patterns handled per-property below
    if isinstance(val, list) and "items" in schema:
        for i, item in enumerate(val):
            check_schema(item, schema["items"], f"{path}[{i}]")
    for key in ("format",):
        if key in schema and schema[key] == "date-time" and isinstance(val, str):
            if not re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$", val):
                bad(f"{path}: not RFC3339 UTC date-time: {val!r}")
    if "pattern" in schema and isinstance(val, str):
        if not re.match(schema["pattern"] + r"\Z", val):
            bad(f"{path}: does not match {schema['pattern']}: {val!r}")
    if "enum" in schema and val not in schema["enum"]:
        bad(f"{path}: {val!r} not in enum {schema['enum']}")
    if "const" in schema and val != schema["const"]:
        bad(f"{path}: expected const {schema['const']!r}")


def main():
    try:
        doc = json.load(sys.stdin)
    except Exception as e:
        print(f"INVALID: response is not JSON: {e}")
        return 1
    check_schema(doc, SCHEMA, "$")
    # allOf if/then
    if doc.get("ok") is False and "error" not in doc:
        bad("$.allOf: ok=false requires 'error'")
    if doc.get("ok") is True and "error" in doc:
        bad("$.allOf: ok=true must not carry 'error'")
    if ERRORS:
        print("INVALID envelope:")
        for e in ERRORS:
            print(" -", e)
        return 1
    print("envelope valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
