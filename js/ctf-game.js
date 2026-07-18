/* ============================================
   CTF Cyber Security Hacking Quest Game Controller
   ============================================ */

(function () {
    "use strict";

    const CORRECT_PASSCODE = "JV88D9";
    let isDecrypted = false;
    let selectedFileEl = null;

    // Wait until document is fully loaded
    document.addEventListener("DOMContentLoaded", () => {
        initCTFGame();
    });

    function initCTFGame() {
        // --- Lockscreen Controls ---
        const passcodeIn = document.getElementById("computer-passcode");
        const decryptBtn = document.getElementById("computer-decrypt-btn");
        const errorMsg = document.getElementById("computer-error-msg");
        const lockScreen = document.getElementById("computer-lock-screen");
        const unlockedGrid = document.getElementById("computer-unlocked-grid");

        if (decryptBtn && passcodeIn) {
            decryptBtn.addEventListener("click", handleDecryption);
            passcodeIn.addEventListener("keypress", (e) => {
                if (e.key === "Enter") handleDecryption();
            });
        }

        function handleDecryption() {
            const entered = passcodeIn.value.trim().toUpperCase();
            if (entered === CORRECT_PASSCODE) {
                isDecrypted = true;
                errorMsg.textContent = "";
                lockScreen.style.display = "none";
                unlockedGrid.style.display = "grid";
                showWinNotification("System Decrypted!", "Secure Cloud storage access authorized. database_access.exe is available.");
            } else {
                errorMsg.textContent = "DECRYPTION FAILURE: Key signature mismatch.";
                passcodeIn.value = "";
                passcodeIn.focus();
            }
        }

        // --- File Grid Selection & Execution Handlers ---
        document.querySelectorAll(".file-grid").forEach((grid) => {
            grid.addEventListener("click", (e) => {
                const item = e.target.closest(".file-item");
                if (!item) {
                    clearFileSelection();
                    return;
                }

                e.stopPropagation();
                if (selectedFileEl) {
                    selectedFileEl.classList.remove("selected");
                }
                selectedFileEl = item;
                item.classList.add("selected");
            });
        });

        // Double click handlers for executions
        document.querySelectorAll(".file-grid").forEach((grid) => {
            grid.addEventListener("dblclick", (e) => {
                const item = e.target.closest(".file-item");
                if (item) {
                    executeFile(item.id);
                }
            });
        });

        // Clear selection when clicking empty grid area
        document.addEventListener("click", () => {
            clearFileSelection();
        });
    }

    function clearFileSelection() {
        if (selectedFileEl) {
            selectedFileEl.classList.remove("selected");
            selectedFileEl = null;
        }
    }

    function executeFile(fileId) {
        if (fileId === "quest-info-item") {
            openTextViewer(
                "quest_info.txt",
                "CYBER SECURITY CTF QUEST GUIDE\n" +
                "==============================\n" +
                "Status: IN PROGRESS\n\n" +
                "Mission:\n" +
                "Hacker, you must bypass the Secure Cloud Gateway (My Computer) and access the owner's credentials.\n\n" +
                "Steps to Clear:\n" +
                "1. Open Browser on the desktop.\n" +
                "2. Go to the Projects tab and scroll down to activate the laptop.\n" +
                "3. Use the Cloud Sentry terminal command input at the bottom to find the credentials (run 'history' or read files).\n" +
                "4. Enter the 6-character key in My Computer to decrypt the file system.\n" +
                "5. Run database_access.exe inside My Computer to claim your certification!"
            );
        } else if (fileId === "clue-manifest-item") {
            openTextViewer(
                "clue_manifest.txt",
                "CLUE MANIFEST\n" +
                "=============\n\n" +
                "Base64 Hint:\n" +
                "U2VjdXJlIGtleSBjYW4gYmUgZm91bmQgYnkgcnVubmluZyAnaGlzdG9yeScgaW4gdGhlIHByb2plY3RzIGtleWJvYXJkLiBEZWNyeXB0ZWQgcGFzc2NvZGUgaXMgN2NoYXJzIGFscGhhbnVtZXJpYy4=\n\n" +
                "Decodes to:\n" +
                "\"Secure key can be found by running 'history' in the projects keyboard.\"\n\n" +
                "Happy hunting!"
            );
        } else if (fileId === "computer-readme-item") {
            openTextViewer(
                "readme.txt",
                "DATABASE ACCESS SUCCESS\n" +
                "=======================\n\n" +
                "Well done! You have bypassed the encryption filters.\n\n" +
                "Instructions:\n" +
                "Double click database_access.exe inside this folder to register your hacking credentials and generate your official CTF certification."
            );
        } else if (fileId === "database-exe-item") {
            runClaimTerminal();
        }
    }

    // --- Simple Text Viewer Window ---
    function openTextViewer(title, content) {
        const activeWindowBody = document.querySelector(".ctf-window:not([hidden]) .ctf-window-body");
        if (!activeWindowBody) return;

        // Remove any existing viewers
        const oldViewer = activeWindowBody.querySelector(".ctf-text-viewer");
        if (oldViewer) oldViewer.remove();

        const viewer = document.createElement("div");
        viewer.className = "ctf-text-viewer";
        viewer.innerHTML = `
            <div class="ctf-text-header">
                <span>${title} - Notepad</span>
                <span class="ctf-text-close">X</span>
            </div>
            <div class="ctf-text-content">${content}</div>
        `;

        viewer.querySelector(".ctf-text-close").addEventListener("click", () => {
            viewer.remove();
        });

        activeWindowBody.appendChild(viewer);
    }

    // --- Executable Claim Terminal simulation ---
    function runClaimTerminal() {
        const body = document.getElementById("computer-window-body");
        if (!body) return;

        const terminal = document.createElement("div");
        terminal.className = "ctf-terminal-overlay";
        terminal.innerHTML = `
            <div class="ctf-terminal-header">database_access.exe - Bypass Protocol Terminal</div>
            <div class="ctf-terminal-output" id="claim-terminal-out"></div>
            <div class="ctf-terminal-input-row" id="claim-input-row">
                <span>guest@jeevanyadav-db:~$</span>
                <input type="text" class="ctf-terminal-input" id="claim-name-input" placeholder="Enter your name to claim certification..." autocomplete="off">
            </div>
        `;

        body.appendChild(terminal);

        const out = terminal.querySelector("#claim-terminal-out");
        const nameInput = terminal.querySelector("#claim-name-input");
        const inputRow = terminal.querySelector("#claim-input-row");

        const lines = [
            "./database_access.exe\r\n",
            "[SYSTEM] Bypassing cloud endpoint authorization controls...",
            "[SYSTEM] Fetching database metrics for Owner: Avula Jeevan Yadav...",
            "[SYSTEM] Connection established. Merging certification records...",
            "[SYSTEM] Security challenge cleared! Quest status: CERTIFIED.",
            "\r\nPlease enter your name to claim your Quest Certificate: "
        ];

        let lineIdx = 0;
        function printLines() {
            if (lineIdx < lines.length) {
                out.textContent += lines[lineIdx] + "\n";
                out.scrollTop = out.scrollHeight;
                lineIdx++;
                setTimeout(printLines, 500);
            } else {
                nameInput.focus();
            }
        }

        printLines();

        nameInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                const name = nameInput.value.trim();
                if (!name) return;

                inputRow.style.display = "none";
                out.textContent += `Name entered: ${name}\n\n`;
                out.textContent += "[SYSTEM] Building dynamic certificate canvas...\n";
                out.textContent += "[SYSTEM] Done! Redirecting to certificate portal...";
                out.scrollTop = out.scrollHeight;

                setTimeout(() => {
                    generateCertificate(name);
                    terminal.remove();
                }, 1000);
            }
        });
    }

    // --- Canvas Certificate Generation ---
    function generateCertificate(userName) {
        const body = document.getElementById("computer-window-body");
        if (!body) return;

        const certView = document.createElement("div");
        certView.className = "ctf-cert-view";
        certView.innerHTML = `
            <canvas class="ctf-cert-canvas" id="cert-canvas" width="600" height="420"></canvas>
            <div class="ctf-cert-actions">
                <button type="button" class="ctf-decrypt-btn" id="cert-download-btn">DOWNLOAD PNG</button>
                <button type="button" class="ctf-decrypt-btn" id="cert-close-btn" style="background:#ff7675;">CLOSE</button>
            </div>
        `;

        body.appendChild(certView);

        const canvas = certView.querySelector("#cert-canvas");
        const ctx = canvas.getContext("2d");

        // Render elegant, high-fidelity security cert on canvas
        // Background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 600, 420);

        // Gold inner border frame
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 6;
        ctx.strokeRect(15, 15, 570, 390);

        ctx.strokeStyle = "#2d3436";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(22, 22, 556, 376);

        // Heading title
        ctx.fillStyle = "#1e272e";
        ctx.font = "bold 20px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText("SECURITY CHALLENGE CERTIFICATE", 300, 65);

        ctx.fillStyle = "#57606f";
        ctx.font = "italic 11px sans-serif";
        ctx.fillText("This document certifies that the challenger has successfully solved the CTF quest", 300, 95);

        // User Name
        ctx.fillStyle = "#000080";
        ctx.font = "bold 26px Georgia, serif";
        ctx.fillText(userName.toUpperCase(), 300, 155);

        // Line separator
        ctx.strokeStyle = "#b2bec3";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(150, 175);
        ctx.lineTo(450, 175);
        ctx.stroke();

        // Certification detail text
        ctx.fillStyle = "#2f3542";
        ctx.font = "12px Georgia, serif";
        ctx.fillText("has successfully decrypted the database security filters,", 300, 205);
        ctx.fillText("bypassed the secure gateway, and accessed the owner's system database.", 300, 225);
        ctx.fillText("Quest Passcode Resolved: JV88D9", 300, 245);

        ctx.fillStyle = "#2ed573";
        ctx.font = "bold 13px Courier New, monospace";
        ctx.fillText("Rank: Elite Bounty Hunter", 300, 280);

        // Signatures
        ctx.fillStyle = "#2f3542";
        ctx.font = "11px sans-serif";
        ctx.fillText("Authorized Signature", 180, 355);
        ctx.fillText("Challenger Status", 420, 355);

        // Draw a simulated elegant signature for Jeevan
        ctx.fillStyle = "#0a3d62";
        ctx.font = "italic 22px 'Caveat', cursive, Georgia";
        ctx.fillText("Avula Jeevan Yadav", 180, 335);

        ctx.fillStyle = "#008000";
        ctx.font = "bold italic 16px monospace";
        ctx.fillText("VERIFIED", 420, 335);

        // Under signature lines
        ctx.strokeStyle = "#747d8c";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(100, 342);
        ctx.lineTo(260, 342);
        ctx.moveTo(340, 342);
        ctx.lineTo(500, 342);
        ctx.stroke();

        // Button handlers
        certView.querySelector("#cert-close-btn").addEventListener("click", () => {
            certView.remove();
        });

        certView.querySelector("#cert-download-btn").addEventListener("click", () => {
            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `Jeevan_Yadav_Security_Quest_Certificate.png`;
            link.href = dataUrl;
            link.click();
            showWinNotification("Certificate Downloaded!", "Save it to showcase your hacker skills on LinkedIn!");
        });
    }

    // --- Windows 98 Style Desktop Notifications ---
    function showWinNotification(title, message) {
        const notifier = document.createElement("div");
        notifier.style.position = "fixed";
        notifier.style.bottom = "68px";
        notifier.style.right = "20px";
        notifier.style.width = "280px";
        notifier.style.background = "#c0c0c0";
        notifier.style.border = "2px solid #fff";
        notifier.style.borderColor = "#fff #404040 #404040 #fff";
        notifier.style.boxShadow = "4px 4px 10px rgba(0,0,0,0.5)";
        notifier.style.fontFamily = "Tahoma, Geneva, sans-serif";
        notifier.style.fontSize = "12px";
        notifier.style.color = "#000";
        notifier.style.zIndex = "1000";
        notifier.style.boxSizing = "border-box";
        notifier.style.padding = "2px";

        notifier.innerHTML = `
            <div style="background:linear-gradient(90deg, #000080, #1084d0); color:white; font-weight:bold; padding:3px 6px; display:flex; justify-content:space-between;">
                <span>${title}</span>
                <span id="notif-close-btn" style="cursor:pointer; font-weight:normal;">X</span>
            </div>
            <div style="padding:10px; line-height:1.4;">
                ${message}
            </div>
        `;

        document.body.appendChild(notifier);

        notifier.querySelector("#notif-close-btn").addEventListener("click", () => {
            notifier.remove();
        });

        setTimeout(() => {
            if (notifier.parentElement) notifier.remove();
        }, 5000);
    }
})();
