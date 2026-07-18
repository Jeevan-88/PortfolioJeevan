/* ============================================
   Phone UI — Core Manager
   Manages the interactive phone overlay on the
   Contact Me tab's last scroll frame.
   ============================================ */

(function () {
    "use strict";

    const ACTIVATION_THRESHOLD = 0.97; // Activate phone at 97% scroll progress
    let isActive = false;
    let hasBooted = false;
    let overlayEl = null;
    let homeEl = null;
    let appScreenEl = null;
    let bootScreenEl = null;
    let currentApp = null;
    let appContentEl = null;

    // App definitions for the home screen grid with 2D style vector SVG icons
    const apps = [
        { 
            id: "gmail",      
            label: "Gmail",      
            icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#FFFFFF"/></svg>`,  
            colorClass: "icon-gmail" 
        },
        { 
            id: "github",     
            label: "GitHub",     
            icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#FFFFFF"/></svg>`,  
            colorClass: "icon-github" 
        },
        { 
            id: "linkedin",   
            label: "LinkedIn",   
            icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#FFFFFF"/></svg>`,  
            colorClass: "icon-linkedin" 
        },
        { 
            id: "camera",     
            label: "Camera",     
            icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9ZM12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18ZM12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8Z" fill="#FFFFFF"/></svg>`, 
            colorClass: "icon-camera" 
        },
        { 
            id: "album",      
            label: "Album",      
            icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16V4C22 2.9 21.1 2 20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H20C21.1 18 22 17.1 22 16ZM8.5 11L11 14.01L14.5 9.5L19 15H5L8.5 11ZM2 20H20V22H2V20Z" fill="#FFFFFF"/></svg>`,  
            colorClass: "icon-album" 
        },
        { 
            id: "calculator", 
            label: "Calc",       
            icon: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 2H5C3.9 2 3 2.9 3 4V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V4C21 2.9 20.1 2 19 2ZM7 6H9V8H7V6ZM7 10H9V12H7V10ZM7 14H9V16H7V14ZM7 18H9V20H7V18ZM11 6H13V8H11V6ZM11 10H13V12H11V10ZM11 14H13V16H11V14ZM11 18H13V20H11V18ZM15 6H17V8H15V6ZM15 10H17V20H15V10Z" fill="#FFFFFF"/></svg>`, 
            colorClass: "icon-calculator" 
        },
        { 
            id: "snake",      
            label: "Snake",      
            icon: `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 22 20.1 22 19V5C22 3.9 20.1 3 19 3ZM8 17H6V15H8V17ZM10 15H8V13H10V15ZM10 13H12V11H10V13ZM14 11H12V9H14V11ZM16 9H14V7H16V9ZM18 7H16V5H18V7Z" fill="#FFFFFF"/></svg>`, 
            colorClass: "icon-snake" 
        }
    ];

    // User-clicked exact percentages mapping the slanted 3D phone screen corners:
    // 1: Top-Left, 2: Top-Right, 3: Bottom-Left, 4: Bottom-Right
    const targetScreenPercentages = [
        { x: 0.394, y: 0.121 }, // Point 1
        { x: 0.660, y: 0.107 }, // Point 2
        { x: 0.374, y: 0.959 }, // Point 3
        { x: 0.642, y: 0.988 }  // Point 4
    ];

    /**
     * Compute and apply the matrix3d homography transformation to overlayEl
     * mapping the local 320x530 coordinates to the target 3D perspective quad
     */
    function updatePerspectiveTransform() {
        if (!overlayEl) return;
        const wrapper = overlayEl.parentElement;
        if (!wrapper) return;

        const rect = wrapper.getBoundingClientRect();
        const pw = rect.width;
        const ph = rect.height;

        // Convert percentage coords to absolute pixels
        const dst = targetScreenPercentages.map(p => ({
            x: p.x * pw,
            y: p.y * ph
        }));

        // Source local rectangle size
        const w = 320;
        const h = 530;

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

        // Format to 6 decimal places to prevent syntax issues with large floats
        const matrixStr = matrix.map(v => v.toFixed(6)).join(",");
        overlayEl.style.transform = `matrix3d(${matrixStr})`;
    }

    // Auto-update perspective warp when window size changes
    window.addEventListener("resize", () => {
        if (isActive) updatePerspectiveTransform();
    });

    /**
     * Inject the phone overlay HTML into the Contact Me panel wrapper
     */
    function injectOverlay() {
        const contactPanel = document.querySelector('[data-browser-panel="contact"] .sequence-panel-wrapper');
        if (!contactPanel || contactPanel.querySelector(".phone-overlay")) return;

        overlayEl = document.createElement("div");
        overlayEl.className = "phone-overlay";
        overlayEl.innerHTML = `
            <div class="phone-boot-screen">
                <div class="phone-boot-logo"><span>J</span></div>
            </div>
            <div class="phone-home">
                <div class="phone-status-bar">
                    <span class="time"></span>
                    <div class="phone-status-icons">
                        <span>WiFi</span>
                        <span>100%</span>
                    </div>
                </div>
                <div class="phone-app-grid"></div>
                <div class="phone-dock-indicator"></div>
            </div>
            <div class="phone-app-screen">
                <div class="phone-app-topbar">
                    <button class="phone-back-btn" aria-label="Back">‹</button>
                    <span class="phone-app-title"></span>
                </div>
                <div class="phone-app-content"></div>
            </div>
        `;

        contactPanel.appendChild(overlayEl);

        homeEl = overlayEl.querySelector(".phone-home");
        appScreenEl = overlayEl.querySelector(".phone-app-screen");
        bootScreenEl = overlayEl.querySelector(".phone-boot-screen");
        appContentEl = overlayEl.querySelector(".phone-app-content");

        // Render app icons
        renderAppGrid();

        // Back button
        overlayEl.querySelector(".phone-back-btn").addEventListener("click", navigateHome);

        // Update clock
        updateClock();
        setInterval(updateClock, 30000);
    }

    /**
     * Render the home screen app icon grid
     */
    function renderAppGrid() {
        const grid = overlayEl.querySelector(".phone-app-grid");
        if (!grid) return;

        grid.innerHTML = "";
        apps.forEach((app) => {
            const iconEl = document.createElement("div");
            iconEl.className = "phone-app-icon";
            iconEl.dataset.appId = app.id;
            iconEl.innerHTML = `
                <div class="icon-box ${app.colorClass}">
                    ${app.icon}
                </div>
                <span class="icon-label">${app.label}</span>
            `;
            iconEl.addEventListener("click", () => openApp(app.id, app.label));
            grid.appendChild(iconEl);
        });
    }

    /**
     * Update the status bar clock
     */
    function updateClock() {
        if (!overlayEl) return;
        const timeEl = overlayEl.querySelector(".phone-status-bar .time");
        if (timeEl) {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes().toString().padStart(2, "0");
            const ampm = h >= 12 ? "PM" : "AM";
            const h12 = h % 12 || 12;
            timeEl.textContent = `${h12}:${m} ${ampm}`;
        }
    }

    /**
     * Open an app by id
     */
    function openApp(appId, appLabel) {
        if (currentApp) {
            // Unmount previous app
            if (window.PhoneApps && window.PhoneApps[currentApp] && window.PhoneApps[currentApp].unmount) {
                window.PhoneApps[currentApp].unmount();
            }
        }

        currentApp = appId;

        // Set title
        const titleEl = overlayEl.querySelector(".phone-app-title");
        if (titleEl) titleEl.textContent = appLabel;

        // Clear content
        appContentEl.innerHTML = "";

        // Mount the app
        if (window.PhoneApps && window.PhoneApps[appId] && window.PhoneApps[appId].mount) {
            window.PhoneApps[appId].mount(appContentEl);
        } else {
            appContentEl.innerHTML = `<div style="padding:20px;color:#fff;text-align:center;opacity:0.5;">App loading...</div>`;
        }

        // Slide in the app screen
        appScreenEl.classList.add("visible");
    }

    /**
     * Navigate back to home screen
     */
    function navigateHome() {
        // Unmount current app
        if (currentApp && window.PhoneApps && window.PhoneApps[currentApp] && window.PhoneApps[currentApp].unmount) {
            window.PhoneApps[currentApp].unmount();
        }
        currentApp = null;

        // Slide out the app screen
        appScreenEl.classList.remove("visible");
    }

    /**
     * Boot animation — plays once when the phone first activates
     */
    function playBootAnimation() {
        if (hasBooted) return;
        hasBooted = true;

        // Show boot screen for 1.2s, then fade to home
        setTimeout(() => {
            bootScreenEl.classList.add("fade-out");
            setTimeout(() => {
                bootScreenEl.style.display = "none";
            }, 500);
        }, 1200);
    }

    function activate() {
        if (isActive) return;
        isActive = true;

        if (!overlayEl) {
            injectOverlay();
        }

        updatePerspectiveTransform();
        overlayEl.classList.add("active");
        playBootAnimation();
    }

    /**
     * Deactivate the phone overlay (called when scroll progress < threshold)
     */
    function deactivate() {
        if (!isActive) return;
        isActive = false;

        if (overlayEl) {
            overlayEl.classList.remove("active");
        }

        // Unmount current app if any
        if (currentApp && window.PhoneApps && window.PhoneApps[currentApp] && window.PhoneApps[currentApp].unmount) {
            window.PhoneApps[currentApp].unmount();
        }
        currentApp = null;

        // Navigate home
        if (appScreenEl) {
            appScreenEl.classList.remove("visible");
        }
    }

    /**
     * Check scroll progress and activate/deactivate accordingly
     * Called from the animation loop in desktop.js
     */
    function checkProgress(progress) {
        if (progress >= ACTIVATION_THRESHOLD) {
            activate();
        } else {
            deactivate();
        }
    }

    // Expose the public API
    window.PhoneUI = {
        checkProgress: checkProgress,
        activate: activate,
        deactivate: deactivate
    };
})();
