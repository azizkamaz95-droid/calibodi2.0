"""
Patch FirebaseAuthentication.swift init() to never return early.

Before:
    if FirebaseApp.app() == nil {
        guard FirebaseOptions.defaultOptions() != nil else {
            CAPLog.print(...)
            return                   ← early return prevents initAuthProviderHandlers
        }
        FirebaseApp.configure()
    }
    self.initAuthProviderHandlers(config: config)

After:
    if FirebaseApp.app() == nil {
        if FirebaseOptions.defaultOptions() != nil {
            FirebaseApp.configure()
        }
    }
    self.initAuthProviderHandlers(config: config)
"""
import re
import sys

impl_path = sys.argv[1]

with open(impl_path, "r") as f:
    content = f.read()

# Match the guard block with optional whitespace variations
pattern = (
    r"(\s+)guard FirebaseOptions\.defaultOptions\(\) != nil else \{\s*\n"
    r"[^\n]*CAPLog\.print[^\n]*\n"
    r"\s+return\s*\n"
    r"\s+\}\s*\n"
    r"(\s+)FirebaseApp\.configure\(\)"
)


def repl(m):
    # m.group(1) includes the newline + indentation before 'guard'
    leading_ws = m.group(1)
    indent = "            "
    return (
        leading_ws + "if FirebaseOptions.defaultOptions() != nil {\n"
        + indent + "    FirebaseApp.configure()\n"
        + indent + "}"
    )


new_content = re.sub(pattern, repl, content, flags=re.DOTALL)

if new_content == content:
    print("ERROR: guard-return pattern not found — dumping context for debug:")
    idx = content.find("FirebaseOptions.defaultOptions()")
    if idx >= 0:
        print("Found defaultOptions at char", idx)
        print(repr(content[max(0, idx - 100) : idx + 300]))
    else:
        print("'FirebaseOptions.defaultOptions()' not found at all in file")
    sys.exit(1)

with open(impl_path, "w") as f:
    f.write(new_content)

print("OK: init() patched — initAuthProviderHandlers always called")
