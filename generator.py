import os

def create_html(title, caption, multi_stage, extra_head=""):
    ms_controls = """
        <div class="controls-row">
            <button class="btn btn-secondary" id="btn-back">◀ Back</button>
            <button class="btn btn-primary" id="btn-run">Run ▶</button>
            <button class="btn btn-secondary btn-reset" id="btn-reset">Reset</button>
        </div>
        <div class="scrubber-row">
            <input type="range" id="scrubber" min="0" max="1" value="0">
            <div class="step-indicators" id="step-indicators"></div>
        </div>
""" if multi_stage else ""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    {extra_head}
</head>
<body>
    <button class="theme-toggle" aria-label="Toggle theme">
        <svg class="sun" viewBox="0 0 24 24"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" stroke="currentColor" fill="none" stroke-width="2"/></svg>
        <svg class="moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" fill="none" stroke-width="2"/></svg>
    </button>
    
    <div class="steps-panel">
        <h3>Steps to interact:</h3>
        <ol id="steps-list"></ol>
    </div>
    
    <div class="card">
        <div id="module-content"></div>
        <div class="legend" id="legend" style="display:none;"></div>
        <div id="controls-container"></div>
        {ms_controls}
    </div>

    <div class="explain-panel" id="explain-panel">Interact to see updates.</div>
    <div class="caption" id="caption">{caption}</div>

    <script src="script.js"></script>
</body>
</html>"""
    return html

def create_css(is_mobile=False):
    width = "100%" if is_mobile else "800px"
    font_size = "14px" if is_mobile else "16px"
    margin = "10px" if is_mobile else "20px auto"
    
    css = f"""
:root {{
    --primary: #3b82f6;
    --active: #f59e0b;
    --success: #10b981;
    --danger: #ef4444;
    --frozen: #9ca3af;
    --bg-main: #ffffff;
    --text-main: #1f2937;
    --card-bg: #f9fafb;
    --border: #e5e7eb;
}}

[data-theme="dark"] {{
    --primary: #60a5fa;
    --active: #fbbf24;
    --success: #34d399;
    --danger: #f87171;
    --frozen: #6b7280;
    --bg-main: #111827;
    --text-main: #f9fafb;
    --card-bg: #1f2937;
    --border: #374151;
}}

body {{
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: var(--bg-main);
    color: var(--text-main);
    margin: {margin};
    padding: 0;
    font-size: {font_size};
    transition: background-color 0.3s, color 0.3s;
    max-width: {width};
}}

.theme-toggle {{
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: var(--text-main);
    cursor: pointer;
}}
.theme-toggle svg {{ width: 24px; height: 24px; }}
[data-theme="dark"] .sun {{ display: none; }}
[data-theme="light"] .moon {{ display: none; }}

.card {{
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
}}

.steps-panel, .explain-panel {{
    background: var(--card-bg);
    border-left: 4px solid var(--primary);
    padding: 12px;
    margin: 16px 0;
    border-radius: 4px;
}}

.caption {{
    opacity: 0;
    transition: opacity 0.5s;
    font-style: italic;
    color: var(--frozen);
    text-align: center;
    margin-top: 16px;
}}
.caption.visible {{
    opacity: 1;
}}

.btn {{
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-weight: 600;
}}
.btn-primary {{
    background: var(--primary);
    color: white;
}}
.btn-secondary {{
    background: var(--frozen);
    color: white;
}}
.btn-reset {{
    background: var(--success);
}}

.readout {{
    font-family: monospace;
    font-size: 1.1em;
    padding: 4px 8px;
    background: var(--border);
    border-radius: 4px;
}}

.legend {{
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    font-size: 0.9em;
    justify-content: center;
}}
.legend-item {{
    display: flex;
    align-items: center;
    gap: 4px;
}}
.legend-color {{
    width: 12px;
    height: 12px;
    border-radius: 50%;
}}

/* Module specific layouts */
.row {{ display: flex; gap: 16px; width: 100%; }}
.col {{ flex: 1; }}

/* Multi-stage scrubber */
.controls-row {{ display: flex; gap: 8px; justify-content: center; }}
.scrubber-row {{ display: flex; flex-direction: column; gap: 8px; align-items: center; }}
.step-indicators {{ display: flex; gap: 4px; }}
.step-dot {{ width: 12px; height: 12px; border-radius: 50%; background: var(--frozen); cursor: pointer; }}
.step-dot.active {{ background: var(--primary); }}

input[type=range] {{ width: 100%; }}
"""
    return css

def generate_module(slug, title, caption, steps_html, multi_stage, js_code_desktop, js_code_mobile=None):
    if js_code_mobile is None:
        js_code_mobile = js_code_desktop
        
    js_code_desktop = steps_html + "\n" + js_code_desktop
    js_code_mobile = steps_html + "\n" + js_code_mobile
        
    base = f"build/{slug}"
    mobile_base = f"{base}/mobile"
    
    os.makedirs(base, exist_ok=True)
    os.makedirs(mobile_base, exist_ok=True)
    
    with open(f"{base}/index.html", "w") as f:
        f.write(create_html(title, caption, multi_stage))
    with open(f"{base}/style.css", "w") as f:
        f.write(create_css(False))
    with open(f"{base}/script.js", "w") as f:
        f.write(js_code_desktop)
        
    with open(f"{mobile_base}/index.html", "w") as f:
        f.write(create_html(title, caption, multi_stage))
    with open(f"{mobile_base}/style.css", "w") as f:
        f.write(create_css(True))
    with open(f"{mobile_base}/script.js", "w") as f:
        f.write(js_code_mobile)
        
    print(f"Generated {slug}")

if __name__ == "__main__":
    pass
