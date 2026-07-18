/* ============================================
   Laptop UI — Core Manager & Apps
   Handles tab management, 3D perspective warp,
   interactive terminals, and the retro shooter game.
   ============================================ */

(function () {
    "use strict";

    const ACTIVATION_THRESHOLD = 0.97; // Show overlay at 97% scroll progress
    let isActive = false;
    let overlayEl = null;
    let currentTab = "sentry";
    let gameLoopRaf = null;
    let terminalInterval = null;

    // Corner coordinates clicked by user on last Projects frame
    const laptopScreenCoords = [
        { x: 0.254, y: 0.082 }, // Point 1: Top-Left
        { x: 0.792, y: 0.098 }, // Point 4: Top-Right
        { x: 0.247, y: 0.777 }, // Point 2: Bottom-Left
        { x: 0.793, y: 0.697 }  // Point 3: Bottom-Right
    ];

    /**
     * Compute and apply the matrix3d homography to warp overlayEl (800x500px)
     */
    function updatePerspectiveWarp() {
        if (!overlayEl) return;
        const wrapper = overlayEl.parentElement;
        if (!wrapper) return;

        const rect = wrapper.getBoundingClientRect();
        const pw = rect.width;
        const ph = rect.height;

        const dst = laptopScreenCoords.map(p => ({
            x: p.x * pw,
            y: p.y * ph
        }));

        // Fixed logical size of the overlay
        const w = 800;
        const h = 500;

        const x0 = dst[0].x, y0 = dst[0].y;
        const x1 = dst[1].x, y1 = dst[1].y;
        const x2 = dst[2].x, y2 = dst[2].y;
        const x3 = dst[3].x, y3 = dst[3].y;

        const dx1 = x1 - x3;
        const dx2 = x2 - x3;
        const dy1 = y1 - y3;
        const dy2 = y2 - y3;

        const deltax = x0 - x1 + x3 - x2;
        const deltay = y0 - y1 + y3 - y2;

        let g, h_coeff;
        const denominator = dx1 * dy2 - dx2 * dy1;
        if (Math.abs(denominator) < 0.0001) {
            g = 0;
            h_coeff = 0;
        } else {
            g = (deltax * dy2 - dx2 * deltay) / denominator;
            h_coeff = (dx1 * deltay - deltax * dy1) / denominator;
        }

        const a = x1 - x0 + g * x1;
        const b = x2 - x0 + h_coeff * x2;
        const c = x0;
        const d = y1 - y0 + g * y1;
        const e = y2 - y0 + h_coeff * y2;
        const f = y0;

        const matrix = [
            a / w, d / w, 0, g / w,
            b / h, e / h, 0, h_coeff / h,
            0,     0,     1, 0,
            c,     f,     0, 1
        ];

        const matrixStr = matrix.map(v => v.toFixed(6)).join(",");
        overlayEl.style.transform = `matrix3d(${matrixStr})`;
    }

    /**
     * Inject Laptop OS HTML layout
     */
    function injectOverlay() {
        const panel = document.querySelector('[data-browser-panel="projects"] .sequence-panel-wrapper');
        if (!panel || panel.querySelector(".laptop-overlay")) return;

        overlayEl = document.createElement("div");
        overlayEl.className = "laptop-overlay";
        overlayEl.innerHTML = `
            <div class="laptop-screen-glass"></div>
            <div class="laptop-layout">
                <!-- Sidebar Navigation -->
                <div class="laptop-sidebar">
                    <button class="laptop-tab-btn active" data-tab="sentry">⚡ Cloud Sentry</button>
                    <button class="laptop-tab-btn" data-tab="deploy">🌐 Deploy</button>
                    <button class="laptop-tab-btn" data-tab="game">🎮 Retro Space</button>
                </div>
                <!-- Main Viewports -->
                <div class="laptop-main">
                    <!-- Tab 1: Cloud Sentry -->
                    <div class="laptop-content-panel active" id="panel-sentry">
                        <div class="deploy-header" style="display:flex;justify-content:space-between;align-items:center;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <h3 style="margin:0;font-size:13px;color:#00ff66;">⚡ CLOUD SENTRY SECURITY SCRIPTS</h3>
                            </div>
                            <a href="https://github.com/Jeevan-88/Cloud-Sentry-Alpha" target="_blank" class="noticeable-repo-btn">Cloud Sentry Repo ↗</a>
                        </div>
                        <div class="deploy-grid">
                            <div class="deploy-card">
                                <h4>CONCURRENT SCANS</h4>
                                <div class="deploy-status-val" id="scan-count-val">42</div>
                                <p style="font-size:8px;color:#a3a3a3;margin:4px 0 0 0;">Total AWS/GCP/Azure resources scanned concurrently</p>
                            </div>
                            <div class="deploy-card">
                                <h4>AUTO-HEAL TRIGGER</h4>
                                <div class="deploy-status-val" style="color:#00e5ff;">ENABLED</div>
                                <p style="font-size:8px;color:#a3a3a3;margin:4px 0 0 0;">Regional EBS encryption policy auto-healing status</p>
                            </div>
                        </div>
                        
                        <!-- Terminal scanning simulation card -->
                        <div class="deploy-terminal-card" style="display: flex; flex-direction: column; flex: 1; min-height: 140px; background: #020408; border: 1px solid #00ff66; border-radius: 4px; overflow: hidden; box-shadow: inset 0 0 10px rgba(0, 255, 102, 0.15); margin-bottom: 6px;">
                            <div class="terminal-header" style="background: #07120b; border-bottom: 1px solid #00ff66; padding: 4px 8px; font-family: monospace; font-size: 8.5px; color: #00ff66; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
                                <span>cloud-sentry-scanner --scan</span>
                                <div style="display:flex;gap:4px;">
                                    <span class="term-dot" style="width: 5px; height: 5px; border-radius: 50%; background:#ff5f56;"></span>
                                    <span class="term-dot" style="width: 5px; height: 5px; border-radius: 50%; background:#ffbd2e;"></span>
                                    <span class="term-dot" style="width: 5px; height: 5px; border-radius: 50%; background:#27c93f;"></span>
                                </div>
                            </div>
                            <div class="terminal-body" id="sentry-terminal" style="flex: 1; font-family:monospace; font-size:8.5px; line-height:1.2; overflow-y:auto; padding:6px; color:#00ff66; white-space:pre-wrap;">
                                <!-- Scan report content printed here -->
                            </div>
                        </div>

                        <!-- Mini hacking console input -->
                        <div style="margin-top: 6px; display: flex; gap: 6px; align-items: center; background: #070e0b; border: 1px solid #112d1b; border-radius: 4px; padding: 4px 8px;">
                            <span style="color: #00ff66; font-family: monospace; font-size: 9px; font-weight: bold;">guest@cloud-sentry:~$</span>
                            <input type="text" id="sentry-terminal-input" placeholder="Type command (help, ls, cat clues.txt, cat manifest.db)..." style="flex: 1; background: transparent; border: none; outline: none; color: #fff; font-family: monospace; font-size: 9px;">
                        </div>
                    </div>

                    <!-- Tab 2: Deploy Mockup (DeployPilot White Browser Page) -->
                    <div class="laptop-content-panel" id="panel-deploy">
                        <div class="mini-browser-container" style="height: 100%; border: 1px solid #334155; box-shadow: 0 4px 20px rgba(0,0,0,0.3); display: flex; flex-direction: column; width: 100%; background: #0f172a;">
                            <div class="mini-browser-toolbar" style="background: #1e293b; border-bottom: 1px solid #334155; display: flex; align-items: center; gap: 8px; padding: 6px 10px;">
                                <div class="mini-browser-dots" style="display: flex; gap: 4px;">
                                    <span class="mini-browser-dot red" style="width:6px; height:6px; border-radius:50%; background:#ff5f56;"></span>
                                    <span class="mini-browser-dot yellow" style="width:6px; height:6px; border-radius:50%; background:#ffbd2e;"></span>
                                    <span class="mini-browser-dot green" style="width:6px; height:6px; border-radius:50%; background:#27c93f;"></span>
                                </div>
                                <div class="mini-browser-address-bar" style="flex: 1; background: #0f172a; border: 1px solid #334155; border-radius: 4px; font-family: monospace; font-size: 9px; color: #94a3b8; padding: 2px 8px; display: flex; justify-content: space-between; align-items: center;">
                                    <span>https://deploy-pilot.dev</span>
                                    <span style="color:#10b981; font-size:8px; font-weight:bold;">🔒 Secure</span>
                                </div>
                            </div>
                            <div class="mini-browser-viewport" style="flex: 1; background: #090d16; color: #fff; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; overflow: hidden; position: relative;">
                                <!-- Navigation switcher bar inside viewport -->
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(255,255,255,0.06); z-index: 10;">
                                    <div style="display: flex; align-items: center; gap: 4px; font-weight: 800; font-size: 11px; color: #fff;">
                                        <span style="background: #3b82f6; color: white; padding: 2px 4px; border-radius: 3px; font-size: 8px; font-weight: 900;">DP</span>
                                        DeployPilot
                                    </div>
                                    
                                    <!-- Preview Switcher -->
                                    <div style="display: flex; background: rgba(15, 23, 42, 0.8); padding: 2px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); gap: 2px;">
                                        <button id="btn-show-landing" onclick="document.getElementById('deploy-landing-img').style.display='block'; document.getElementById('deploy-dash-img').style.display='none'; this.style.background='#3b82f6'; this.style.color='#fff'; document.getElementById('btn-show-dash').style.background='transparent'; document.getElementById('btn-show-dash').style.color='#94a3b8';" style="background: #3b82f6; color: #fff; border: none; font-size: 8px; font-weight: 600; padding: 3px 8px; border-radius: 4px; cursor: pointer; transition: all 0.15s;">
                                            🖥️ Website Preview
                                        </button>
                                        <button id="btn-show-dash" onclick="document.getElementById('deploy-landing-img').style.display='none'; document.getElementById('deploy-dash-img').style.display='block'; this.style.background='#3b82f6'; this.style.color='#fff'; document.getElementById('btn-show-landing').style.background='transparent'; document.getElementById('btn-show-landing').style.color='#94a3b8';" style="background: transparent; color: #94a3b8; border: none; font-size: 8px; font-weight: 600; padding: 3px 8px; border-radius: 4px; cursor: pointer; transition: all 0.15s;">
                                            📊 Console Preview
                                        </button>
                                    </div>

                                    <div style="display: flex; gap: 6px;">
                                        <a href="https://deploy-pilot.dev" target="_blank" style="background: #10b981; color: white; font-size: 8px; font-weight: 700; padding: 4px 8px; border-radius: 4px; text-decoration: none; display: flex; align-items: center; gap: 2px; box-shadow: 0 0 12px rgba(16,185,129,0.3); transition: transform 0.1s;" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
                                            Visit Site ↗
                                        </a>
                                        <a href="https://github.com/Jeevan-88/DeployPilot" target="_blank" style="background: rgba(255,255,255,0.08); color: white; font-size: 8px; font-weight: 600; padding: 4px 8px; border-radius: 4px; text-decoration: none; border: 1px solid rgba(255,255,255,0.15); transition: background 0.1s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">
                                            GitHub ↗
                                        </a>
                                    </div>
                                </div>

                                <!-- Scrollable Preview Container -->
                                <div style="flex: 1; overflow-y: auto; background: #0b0f19; padding: 12px; display: flex; justify-content: center; align-items: flex-start;">
                                    <div style="width: 100%; max-width: 720px; border-radius: 6px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05); background: #111;">
                                        <img id="deploy-landing-img" src="/deploypilot-landing.png" alt="DeployPilot Landing Page Mockup" style="width: 100%; display: block;" />
                                        <img id="deploy-dash-img" src="/deploypilot-dashboard.png" alt="DeployPilot Console Dashboard Mockup" style="width: 100%; display: none;" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tab 3: Retro Game -->
                    <div class="laptop-content-panel" id="panel-game" style="justify-content:center;">
                        <div class="game-container">
                            <canvas id="game-canvas" width="560" height="350"></canvas>
                            <div style="margin-top:8px;font-size:9px;color:#5574a6;display:flex;gap:15px;" id="game-controls-help">
                                <span>[MOUSE] Move ship</span>
                                <span>[LEFT CLICK] Shoot</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        panel.appendChild(overlayEl);

        // Sidebar click handlers
        overlayEl.querySelectorAll(".laptop-tab-btn").forEach((btn) => {
            btn.addEventListener("click", () => switchTab(btn.dataset.tab));
        });

        // Hacking terminal input handler
        const termInput = overlayEl.querySelector("#sentry-terminal-input");
        const term = overlayEl.querySelector("#sentry-terminal");
        if (termInput && term) {
            termInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    const rawCmd = termInput.value;
                    const cleanCmd = rawCmd.trim().toLowerCase();
                    termInput.value = "";

                    // Print prompt & input
                    const pIn = document.createElement("div");
                    pIn.style.color = "#00ff66";
                    pIn.textContent = `guest@cloud-sentry:~$ ${rawCmd}`;
                    term.appendChild(pIn);

                    const pOut = document.createElement("div");
                    pOut.style.color = "#ffffff";
                    pOut.style.margin = "2px 0 6px 10px";

                    if (cleanCmd === "help") {
                        pOut.innerHTML = `Available commands:<br>
                        - <strong style="color:#00d4ff;">ls</strong> : List files in directory<br>
                        - <strong style="color:#00d4ff;">cat &lt;file&gt;</strong> : Print file content<br>
                        - <strong style="color:#00d4ff;">history</strong> : Print command terminal history<br>
                        - <strong style="color:#00d4ff;">help</strong> : Print helper guidelines`;
                    } else if (cleanCmd === "ls") {
                        pOut.innerHTML = `<span style="color:#ffb703;">config.json</span> &nbsp;&nbsp;&nbsp; <span style="color:#ffb703;">clues.txt</span> &nbsp;&nbsp;&nbsp; <span style="color:#ffb703;">manifest.db</span>`;
                    } else if (cleanCmd === "history") {
                        pOut.innerHTML = `1 &nbsp; ssh admin@cloud-sentry.local<br>
                        2 &nbsp; cat /secret/decryption_key.txt<br>
                        3 &nbsp; decrypt --key=S3NTRY`;
                    } else if (cleanCmd === "cat clues.txt") {
                        pOut.textContent = "CLUE DETECTED: Decrypting files requires authorization. Base64 decrypt keys. Look at history list.";
                    } else if (cleanCmd === "cat config.json") {
                        pOut.textContent = '{ "env": "prod", "gateway": "10.0.1.1", "version": "2.08", "owner": "jeevanyadav" }';
                    } else if (cleanCmd === "cat manifest.db") {
                        pOut.textContent = "database schemas active. access restricted.";
                    } else if (cleanCmd === "cat /secret/decryption_key.txt" || cleanCmd === "decrypt --key=s3ntry" || cleanCmd === "cat decryption_key.txt") {
                        pOut.innerHTML = `<span style="color:#00ff66;font-weight:bold;">[SUCCESS] SYSTEM ACCESS KEY RETRIEVED:</span><br>
                        <span style="font-size:12px;background:#00ff66;color:#000;padding:2px 6px;font-weight:bold;display:inline-block;margin-top:4px;">JV88D9</span>`;
                    } else if (cleanCmd === "") {
                        // Empty command, do nothing
                        pOut.style.display = "none";
                    } else {
                        pOut.style.color = "#ff3333";
                        pOut.textContent = `command not found: ${rawCmd}`;
                    }

                    term.appendChild(pOut);
                    term.scrollTop = term.scrollHeight;
                }
            });
        }

        // Run dashboard terminal logs loop
        runTerminalLogs();
        // Update header clock
        runHeaderClock();
    }

    /**
     * Switch current active OS tab panel
     */
    function switchTab(tabId) {
        currentTab = tabId;
        overlayEl.querySelectorAll(".laptop-tab-btn").forEach((btn) => {
            btn.classList.toggle("active", btn.dataset.tab === tabId);
        });
        overlayEl.querySelectorAll(".laptop-content-panel").forEach((panel) => {
            panel.classList.toggle("active", panel.id === `panel-${tabId}`);
        });

        if (tabId === "game") {
            startRetroGame();
        } else {
            stopRetroGame();
        }
    }

    /**
     * Update Clock
     */
    function runHeaderClock() {
        const clockEl = overlayEl.querySelector(".laptop-clock");
        function update() {
            if (!clockEl) return;
            const now = new Date();
            clockEl.textContent = now.toTimeString().split(" ")[0];
        }
        setInterval(update, 1000);
        update();
    }

    /**
     * Tab 1: Terminal simulation logs loop
     */
    function runTerminalLogs() {
        const term = document.getElementById("sentry-terminal");
        if (!term) return;

        const scanReportText = `2026-07-17 11:59:43,115 - src.engines.aws_engine - INFO - CloudTrail: Master-Sentry-Trail is active.
2026-07-17 11:59:43,366 - src.engines.aws_engine - INFO - [AUTO-HEAL] Regional EBS Encryption has been ENABLED.
2026-07-17 11:59:43,610 - src.engines.aws_engine - INFO - [OK] S3: jeevan-sentry-audit-logs is protected.
2026-07-17 11:59:44,605 - src.engines.aws_engine - INFO - [OK] S3: jeevan-sentry-logs-2026 is protected.
2026-07-17 11:59:45,604 - src.engines.aws_engine - INFO - [OK] S3: jeevan-vulnerable-audit is protected.
2026-07-17 11:59:45,618 - src.main - INFO - FINAL SECURITY SCORE: 92/100

   ________    ____  __  ______     _____ _______   ______________  __
  / ____/ /   / __ \\/ / / / __ \\   / ___// ____/ | / /_  __/ __ \\ \\/ /
 / /   / /   / / / / / / / / / /   \\__ \\/ __/ /  |/ / / / / /_/ /\\  /
/ /___/ /___/ /_/ / /_/ / /_/ /   ___/ / /___/ /|  / / / / _, _/ / /
\\____/_____/\\____/\\____/_____/   /____/_____/_/ |_/ /_/ /_/ |_| /_/

  Multi-Cloud Security Auditor  ·  v1.0.0

╭──────────────────────────────────────────────────────────────────────────╮
│ SCAN SUMMARY                                                             │
│ Total findings: 2                                                        │
╰──────────────────────────────────────────────────────────────────────────╯

  [HIGH]      (1)

  ╭─ [HIGH]  No WAF Web ACLs Found
  │  Resource: account
  │
  │  Why it matters:
  │    Without a Web Application Firewall, public-facing applications are exposed to common attacks such as SQL injection and cross-site scripting.
  │
  │  How to fix:
  │    1. Open the WAF console.
  │    2. Create a Web ACL for your load balancer or API Gateway.
  │    3. Attach the AWS Managed Rules baseline rule group.
  │    4. Associate the Web ACL with your resource.
  ╰────────────────────────────────────────────────────────────────────────

  [MEDIUM]    (1)

  ╭─ [MEDIUM]  Inspector Vulnerability Scanning Is Disabled
  │  Resource: account
  │
  │  Why it matters:
  │    Inspector scans EC2 instances, containers, and Lambda functions for known software vulnerabilities. Without it, outdated or vulnerable packages may go undetected.
  │
  │  How to fix:
  │    1. Open the Inspector console.
  │    2. Click 'Enable Inspector'.
  │    3. Select the resource types you want scanned (EC2, ECR, Lambda).
  ╰────────────────────────────────────────────────────────────────────────

2026-07-17 11:59:45,620 - src.main - INFO - Detailed report saved to: sentry_report.md`;

        const lines = scanReportText.split("\n");
        let idx = 0;

        term.innerHTML = "";

        if (terminalInterval) {
            clearInterval(terminalInterval);
        }

        function addLog() {
            if (!isActive || currentTab !== "sentry") return;
            
            if (idx >= lines.length) {
                clearInterval(terminalInterval);
                terminalInterval = null;
                
                const p = document.createElement("pre");
                p.style.margin = "8px 0 0 0";
                p.style.padding = "0";
                p.style.color = "#00d4ff";
                p.style.fontFamily = "monospace";
                p.style.fontSize = "8.5px";
                p.style.fontWeight = "bold";
                p.style.whiteSpace = "pre-wrap";
                p.textContent = "\n[SCAN COMPLETE] Type commands below (e.g. 'help', 'history', 'ls'):";
                term.appendChild(p);
                term.scrollTop = term.scrollHeight;
                return;
            }

            const line = lines[idx];
            const p = document.createElement("pre");
            p.style.margin = "0";
            p.style.padding = "0";
            p.style.whiteSpace = "pre";
            p.style.fontFamily = "monospace";
            p.style.fontSize = "8.5px";
            p.style.lineHeight = "1.2";

            if (line.includes("INFO")) {
                p.style.color = "#a3e635";
            } else if (line.includes("[HIGH]")) {
                p.style.color = "#f87171";
            } else if (line.includes("[MEDIUM]")) {
                p.style.color = "#fbbf24";
            } else if (line.includes("SUCCESS") || line.includes("[OK]")) {
                p.style.color = "#34d399";
            } else {
                p.style.color = "#00ff66";
            }

            p.textContent = line;
            term.appendChild(p);
            term.scrollTop = term.scrollHeight;
            idx++;
        }

        terminalInterval = setInterval(addLog, 200);
    }

    /* ─────────────────────────────────────────
       Tab 3: Retro Space Shooter Game
       ───────────────────────────────────────── */
    let gameCanvas = null;
    let gameCtx = null;
    let ship = { x: 280, y: 300, w: 20, h: 20 };
    let lasers = [];
    let enemies = [];
    let gameScore = 0;
    let isGameOver = false;

    function startRetroGame() {
        gameCanvas = document.getElementById("game-canvas");
        if (!gameCanvas) return;
        gameCtx = gameCanvas.getContext("2d");

        // Init values
        ship = { x: gameCanvas.width / 2, y: gameCanvas.height - 40, w: 18, h: 18 };
        lasers = [];
        enemies = [];
        gameScore = 0;
        isGameOver = false;

        // Event listeners
        gameCanvas.addEventListener("mousemove", onGameMouseMove);
        gameCanvas.addEventListener("click", onGameClick);

        if (gameLoopRaf) cancelAnimationFrame(gameLoopRaf);
        gameLoop();
    }

    function stopRetroGame() {
        if (gameCanvas) {
            gameCanvas.removeEventListener("mousemove", onGameMouseMove);
            gameCanvas.removeEventListener("click", onGameClick);
        }
        if (gameLoopRaf) cancelAnimationFrame(gameLoopRaf);
        isGameOver = true;
    }

    function onGameMouseMove(e) {
        const rect = gameCanvas.getBoundingClientRect();
        ship.x = e.clientX - rect.left;
    }

    function onGameClick() {
        if (isGameOver) {
            startRetroGame();
            return;
        }
        // Shoot laser
        lasers.push({ x: ship.x, y: ship.y - 10, r: 3, speed: 6 });
    }

    function gameLoop() {
        if (isGameOver) return;
        updateGame();
        drawGame();
        gameLoopRaf = requestAnimationFrame(gameLoop);
    }

    function updateGame() {
        // Move lasers
        lasers.forEach((l, idx) => {
            l.y -= l.speed;
            if (l.y < 0) lasers.splice(idx, 1);
        });

        // Spawn enemies
        if (Math.random() < 0.03 && enemies.length < 8) {
            enemies.push({
                x: Math.random() * (gameCanvas.width - 20) + 10,
                y: -10,
                w: 16,
                h: 16,
                speed: 1.5 + Math.random() * 1.5
            });
        }

        // Move enemies
        enemies.forEach((enemy, idx) => {
            enemy.y += enemy.speed;
            
            // Check collision with ship
            if (enemy.y + enemy.h > ship.y && Math.abs(enemy.x - ship.x) < 18) {
                isGameOver = true;
            }

            // Remove offscreen
            if (enemy.y > gameCanvas.height) {
                enemies.splice(idx, 1);
            }
        });

        // Check laser collision
        lasers.forEach((l, lIdx) => {
            enemies.forEach((enemy, eIdx) => {
                const dist = Math.hypot(l.x - enemy.x, l.y - enemy.y);
                if (dist < 15) {
                    enemies.splice(eIdx, 1);
                    lasers.splice(lIdx, 1);
                    gameScore += 100;
                }
            });
        });
    }

    function drawGame() {
        const ctx = gameCtx;
        ctx.fillStyle = "#020408";
        ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Draw starfield
        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < 20; i++) {
            const x = (Math.sin(i * 123) * 0.5 + 0.5) * gameCanvas.width;
            const y = ((Date.now() / 20 + i * 45) % gameCanvas.height);
            ctx.fillRect(x, y, 1.5, 1.5);
        }

        if (isGameOver) {
            ctx.fillStyle = "#ff3333";
            ctx.font = "bold 16px monospace";
            ctx.textAlign = "center";
            ctx.fillText("MISSION TERMINATED", gameCanvas.width / 2, gameCanvas.height / 2 - 20);
            ctx.fillStyle = "#00d4ff";
            ctx.font = "11px monospace";
            ctx.fillText(`FINAL SCORE: ${gameScore}`, gameCanvas.width / 2, gameCanvas.height / 2 + 10);
            ctx.fillText("CLICK SCREEN TO DEPLOY NEW SHIP", gameCanvas.width / 2, gameCanvas.height / 2 + 35);
            return;
        }

        // Draw Ship (Cool 2D vector style triangle)
        ctx.strokeStyle = "#00d4ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y - 12);
        ctx.lineTo(ship.x - 12, ship.y + 10);
        ctx.lineTo(ship.x + 12, ship.y + 10);
        ctx.closePath();
        ctx.stroke();

        // Draw lasers (neon green)
        ctx.fillStyle = "#00ff66";
        lasers.forEach((l) => {
            ctx.beginPath();
            ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw enemies (vector boxes)
        ctx.strokeStyle = "#ff3333";
        ctx.lineWidth = 1.5;
        enemies.forEach((enemy) => {
            ctx.strokeRect(enemy.x - enemy.w / 2, enemy.y, enemy.w, enemy.h);
        });

        // Draw Score HUD
        ctx.fillStyle = "#00d4ff";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`SCORE: ${gameScore}`, 12, 20);
    }

    /**
     * Activate the laptop overlay (called from desktop.js)
     */
    function activate() {
        if (isActive) return;
        isActive = true;

        if (!overlayEl) {
            injectOverlay();
        }

        updatePerspectiveWarp();
        overlayEl.classList.add("active");
    }

    /**
     * Deactivate the laptop overlay (called from desktop.js)
     */
    function deactivate() {
        if (!isActive) return;
        isActive = false;

        if (overlayEl) {
            overlayEl.classList.remove("active");
        }
        stopRetroGame();
        if (terminalInterval) {
            clearInterval(terminalInterval);
            terminalInterval = null;
        }
    }

    /**
     * Check scroll progress
     */
    function checkProgress(progress) {
        if (progress >= ACTIVATION_THRESHOLD) {
            activate();
        } else {
            deactivate();
        }
    }

    // Expose public API
    window.LaptopUI = {
        checkProgress: checkProgress,
        activate: activate,
        deactivate: deactivate
    };
})();
