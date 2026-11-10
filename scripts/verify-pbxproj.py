import re, sys

pbxproj = sys.argv[1] if len(sys.argv) > 1 else 'ios/App/App.xcodeproj/project.pbxproj'
content = open(pbxproj).read()

m = re.search(r'isa = PBXResourcesBuildPhase;.*?files = \((.*?)\);', content, re.DOTALL)
if not m:
    print('ERROR: PBXResourcesBuildPhase not found in', pbxproj)
    sys.exit(1)

phase = m.group(1)
print('=== PBXResourcesBuildPhase files ===')
print(phase)

errors = []
if 'GoogleService-Info.plist in Resources' not in phase:
    errors.append('GoogleService-Info.plist NOT in PBXResourcesBuildPhase')
if 'capacitor.config.json in Resources' not in phase:
    errors.append('capacitor.config.json NOT in PBXResourcesBuildPhase')

if errors:
    for e in errors:
        print('ERROR:', e)
    sys.exit(1)

print('OK: GoogleService-Info.plist and capacitor.config.json confirmed in PBXResourcesBuildPhase')
