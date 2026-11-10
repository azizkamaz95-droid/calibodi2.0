import re, uuid, sys

with open('ios/App/App.xcodeproj/project.pbxproj', 'r') as f:
    content = f.read()

files_to_add = []

# Check if GoogleService-Info.plist is ACTUALLY referenced in PBXResourcesBuildPhase
# Note: "GoogleService-Info.plist in Resources" appears in PBXBuildFile section (comment) even
# if NOT in the build phase — so we must check the phase directly.
resources_match = re.search(r'PBXResourcesBuildPhase.*?files = \((.*?)\);', content, re.DOTALL)
resources_section = resources_match.group(1) if resources_match else ''

if 'GoogleService-Info.plist in Resources' not in resources_section:
    files_to_add.append(('GoogleService-Info.plist', 'text.plist.xml'))
    print('GoogleService-Info.plist NOT in Resources build phase — will add')
else:
    print('GoogleService-Info.plist already in Resources build phase')

if 'capacitor.config.json in Resources' not in resources_section:
    files_to_add.append(('capacitor.config.json', 'text.json'))
    print('capacitor.config.json NOT in Resources build phase — will add')
else:
    print('capacitor.config.json already in Resources build phase')

if not files_to_add:
    print('All required files already in project')
    sys.exit(0)

# Find anchor for file group insertion
anchor_patterns = [
    r'(AppDelegate\.swift \*/,\n)',
    r'(App\.swift \*/,\n)',
    r'(Info\.plist \*/,\n)',
]

anchor_found = None
for pattern in anchor_patterns:
    if re.search(pattern, content):
        anchor_found = pattern
        print(f'Using anchor: {pattern}')
        break

if anchor_found is None:
    print('ERROR: No anchor found in project.pbxproj')
    for m in re.finditer(r'(\w+\.swift \*/)', content):
        print(' ', m.group(1))
    sys.exit(1)

for filename, file_type in files_to_add:
    fr_uuid = uuid.uuid4().hex[:24].upper()
    bf_uuid = uuid.uuid4().hex[:24].upper()

    # 1. Add PBXFileReference
    file_ref = '\t\t' + fr_uuid + ' /* ' + filename + ' */ = {isa = PBXFileReference; fileEncoding = 4; lastKnownFileType = ' + file_type + '; path = "' + filename + '"; sourceTree = "<group>"; };\n'
    content = content.replace('/* End PBXFileReference section */', file_ref + '\t\t/* End PBXFileReference section */')

    # 2. Add PBXBuildFile
    build_file = '\t\t' + bf_uuid + ' /* ' + filename + ' in Resources */ = {isa = PBXBuildFile; fileRef = ' + fr_uuid + ' /* ' + filename + ' */; };\n'
    content = content.replace('/* End PBXBuildFile section */', build_file + '\t\t/* End PBXBuildFile section */')

    # 3. Add file reference to App group (so Xcode can resolve path)
    content = re.sub(anchor_found, r'\g<1>\t\t\t\t' + fr_uuid + ' /* ' + filename + ' */,\n', content, count=1)

    # 4. Add build file to PBXResourcesBuildPhase (search for the actual section, not comment text)
    def add_to_resources(m):
        return m.group(0).rstrip(');').rstrip() + '\n\t\t\t\t' + bf_uuid + ' /* ' + filename + ' in Resources */,\n\t\t\t);'

    new_content = re.sub(
        r'(isa = PBXResourcesBuildPhase;.*?files = \()(.*?)(\s*\);)',
        lambda m: m.group(1) + m.group(2) + '\n\t\t\t\t' + bf_uuid + ' /* ' + filename + ' in Resources */,' + m.group(3),
        content, count=1, flags=re.DOTALL
    )
    if new_content == content:
        print(f'ERROR: could not add {filename} to PBXResourcesBuildPhase')
        sys.exit(1)
    content = new_content

    print(f'{filename} added to Xcode project (fr:{fr_uuid[:8]}... bf:{bf_uuid[:8]}...)')

with open('ios/App/App.xcodeproj/project.pbxproj', 'w') as f:
    f.write(content)

print('Xcode project patched successfully')
