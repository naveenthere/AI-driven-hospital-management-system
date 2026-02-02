"""
Extract JavaScript from allmodule_ver4.html and restore main.js
"""
import re

print("Extracting JavaScript from allmodule_ver4.html...")

# Read the HTML file
with open('../allmodule_ver4.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Extract JavaScript between <script> tags (the main application script)
match = re.search(r'<script>\s*(// ============ CONFIGURATION.*?)</script>', html_content, re.DOTALL)

if match:
    js_content = match.group(1)
    print(f"Found JavaScript: {len(js_content)} characters")
    
    # Save as main.js
    with open('frontend/static/main.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print("✅ Successfully restored main.js from backup!")
    print(f"   File size: {len(js_content)} bytes")
else:
    print("❌ Could not find JavaScript content in HTML file")
