const desktop = document.querySelector(".desktop");
let topZ = 6;
let resetWhoamiSequence = () => {};
let onTabChanged = () => {};

function setStatus(message) {
    const status = document.getElementById("paint-status-text");

    if (status) {
        status.textContent = message;
    }
}

function bringToFront(element) {
    topZ += 1;
    element.style.zIndex = String(topZ);
}

function openWindow(windowId) {
    const targetWindow = document.getElementById(windowId);
    const taskButton = document.querySelector(`[data-restore-window="${windowId}"]`);

    if (!targetWindow) {
        return;
    }

    targetWindow.hidden = false;
    targetWindow.classList.remove("minimized");
    bringToFront(targetWindow);

    if (taskButton) {
        taskButton.hidden = false;
        taskButton.classList.add("active");
    }
}

function minimizeWindow(windowId) {
    const targetWindow = document.getElementById(windowId);
    const taskButton = document.querySelector(`[data-restore-window="${windowId}"]`);

    if (!targetWindow) {
        return;
    }

    targetWindow.hidden = true;
    targetWindow.classList.add("minimized");

    if (taskButton) {
        taskButton.hidden = false;
        taskButton.classList.remove("active");
    }
}

function closeWindow(windowId) {
    const targetWindow = document.getElementById(windowId);
    const taskButton = document.querySelector(`[data-restore-window="${windowId}"]`);

    if (!targetWindow) {
        return;
    }

    targetWindow.hidden = true;
    targetWindow.classList.remove("minimized");

    if (taskButton) {
        taskButton.classList.remove("active");
    }
}

document.querySelectorAll("[data-open-window]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
        if (trigger.dataset.dragged === "true") {
            return;
        }

        openWindow(trigger.dataset.openWindow);
    });
});

document.querySelectorAll("[data-restore-window]").forEach((trigger) => {
    trigger.addEventListener("click", () => openWindow(trigger.dataset.restoreWindow));
});

document.querySelectorAll("[data-minimize-window]").forEach((trigger) => {
    trigger.addEventListener("click", () => minimizeWindow(trigger.dataset.minimizeWindow));
});

document.querySelectorAll("[data-close-window]").forEach((trigger) => {
    trigger.addEventListener("click", () => closeWindow(trigger.dataset.closeWindow));
});

document.querySelectorAll("[data-maximize-window]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
        const targetWindow = document.getElementById(trigger.dataset.maximizeWindow);

        if (targetWindow) {
            targetWindow.classList.toggle("maximized");
            bringToFront(targetWindow);
        }
    });
});

function makeWindowDraggable(windowElement) {
    const handle = windowElement.querySelector("[data-drag-handle]");
    let startX = 0;
    let startY = 0;
    let startLeft = 0;
    let startTop = 0;
    let dragging = false;

    if (!handle) {
        return;
    }

    handle.addEventListener("pointerdown", (event) => {
        if (event.target.closest("button")) {
            return;
        }

        windowElement.classList.remove("maximized");
        dragging = true;
        startX = event.clientX;
        startY = event.clientY;
        startLeft = windowElement.offsetLeft;
        startTop = windowElement.offsetTop;
        bringToFront(windowElement);
        windowElement.classList.add("dragging");
        handle.setPointerCapture(event.pointerId);
    });

    handle.addEventListener("pointermove", (event) => {
        if (!dragging) {
            return;
        }

        const maxLeft = window.innerWidth - windowElement.offsetWidth;
        const maxTop = window.innerHeight - windowElement.offsetHeight - 58;
        const nextLeft = Math.min(Math.max(0, startLeft + event.clientX - startX), Math.max(0, maxLeft));
        const nextTop = Math.min(Math.max(0, startTop + event.clientY - startY), Math.max(0, maxTop));

        windowElement.style.left = `${nextLeft}px`;
        windowElement.style.top = `${nextTop}px`;
    });

    handle.addEventListener("pointerup", (event) => {
        dragging = false;
        windowElement.classList.remove("dragging");
        handle.releasePointerCapture(event.pointerId);
    });
}

function makeDesktopIconsDraggable() {
    const iconsContainer = document.querySelector(".desktop-icons");
    const icons = Array.from(document.querySelectorAll(".desktop-icons .icon"));

    icons.forEach((icon) => {
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;
        let moved = false;
        let dragging = false;

        icon.addEventListener("pointerdown", (event) => {
            if (!desktop || !iconsContainer) {
                return;
            }

            const desktopRect = desktop.getBoundingClientRect();

            if (!iconsContainer.classList.contains("drag-mode")) {
                icons.forEach((item) => {
                    const itemRect = item.getBoundingClientRect();
                    item.style.position = "absolute";
                    item.style.left = `${itemRect.left - desktopRect.left}px`;
                    item.style.top = `${itemRect.top - desktopRect.top}px`;
                });

                iconsContainer.classList.add("drag-mode");
            }

            dragging = true;
            moved = false;
            startX = event.clientX;
            startY = event.clientY;
            startLeft = icon.offsetLeft;
            startTop = icon.offsetTop;
            icon.classList.add("dragging");
            icon.setPointerCapture(event.pointerId);
        });

        icon.addEventListener("pointermove", (event) => {
            if (!dragging || !desktop) {
                return;
            }

            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;

            if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                moved = true;
            }

            const maxLeft = desktop.clientWidth - icon.offsetWidth;
            const maxTop = desktop.clientHeight - icon.offsetHeight - 58;
            const nextLeft = Math.min(Math.max(0, startLeft + deltaX), Math.max(0, maxLeft));
            const nextTop = Math.min(Math.max(0, startTop + deltaY), Math.max(0, maxTop));

            icon.style.left = `${nextLeft}px`;
            icon.style.top = `${nextTop}px`;
        });

        icon.addEventListener("pointerup", (event) => {
            dragging = false;
            icon.classList.remove("dragging");
            icon.dataset.dragged = moved ? "true" : "false";
            icon.releasePointerCapture(event.pointerId);

            setTimeout(() => {
                icon.dataset.dragged = "false";
            }, 0);
        });

        icon.addEventListener("click", (event) => {
            if (icon.dataset.dragged === "true") {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    });
}

function setupWhoamiSequence() {
    const scrollContainer = document.querySelector(".browser-page");
    const panels = Array.from(document.querySelectorAll("[data-browser-panel]"));

    if (!scrollContainer || !panels.length) {
        return;
    }

    const tabFolders = {
        whoami: "whoami",
        about: "aboutme",
        projects: "projects",
        skills: "skills",
        resume: "resume",
        contact: "connect"
    };

    const tabIdsOrder = ["whoami", "about", "projects", "skills", "resume", "contact"];
    const tabState = {};
    let activeTab = "whoami";
    let framesIndex = null;
    let pathPrefix = "";
    let loadingPromises = {};
    let loopActive = true;
    let touchStartY = 0;

    // Initialize tab state objects and inject canvases
    panels.forEach((panel) => {
        const tabId = panel.dataset.browserPanel;
        if (tabFolders[tabId] !== undefined && tabFolders[tabId] !== null) {
            panel.classList.add("sequence-panel");
            // Inject standard full-bleed wrapper, canvas, and spinner overlay
            panel.innerHTML = `
                <div class="sequence-panel-wrapper">
                    <canvas class="sequence-canvas"></canvas>
                    <div class="sequence-spinner-overlay">
                        <div class="sequence-spinner"></div>
                    </div>
                </div>
            `;
            const canvasElement = panel.querySelector("canvas");
            tabState[tabId] = {
                progress: 0,
                targetProgress: 0,
                loaded: false,
                canvas: canvasElement,
                ctx: canvasElement.getContext("2d", { alpha: false }),
                frameCount: 0,
                images: []
            };
        }
    });

    // Fit canvas helper (Contain scale)
    function fitCanvas(state) {
        const canvasElement = state.canvas;
        const rect = canvasElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const w = Math.max(1, Math.round(rect.width * dpr));
        const h = Math.max(1, Math.round(rect.height * dpr));

        if (canvasElement.width !== w || canvasElement.height !== h) {
            canvasElement.width = w;
            canvasElement.height = h;
        }
    }

    // Draw active frame (Contain scale)
    function drawFrame(tabId) {
        const state = tabState[tabId];
        if (!state || !state.loaded || state.images.length === 0) {
            return;
        }

        const total = state.frameCount;
        const index = Math.max(0, Math.min(total - 1, Math.floor(state.progress * (total - 1))));
        const image = state.images[index];

        if (!image || !image.complete || !image.naturalWidth || !image.naturalHeight) {
            return;
        }

        fitCanvas(state);

        const canvasWidth = state.canvas.width;
        const canvasHeight = state.canvas.height;
        const imgWidth = image.naturalWidth;
        const imgHeight = image.naturalHeight;

        const canvasRatio = canvasWidth / canvasHeight;
        const imgRatio = imgWidth / imgHeight;

        let drawWidth, drawHeight, drawX, drawY;

        if (canvasRatio > imgRatio) {
            // Canvas is wider than Image (crop top/bottom to fill width)
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgRatio;
            drawX = 0;
            drawY = (canvasHeight - drawHeight) / 2;
        } else {
            // Canvas is taller than Image (crop left/right to fill height)
            drawHeight = canvasHeight;
            drawWidth = canvasHeight * imgRatio;
            drawX = (canvasWidth - drawWidth) / 2;
            drawY = 0;
        }

        state.ctx.fillStyle = "#050810";
        state.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        state.ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    }

    // Loader helper using requestIdleCallback/timeouts for low priority background loading
    function loadTabImages(tabId, files, concurrency) {
        const state = tabState[tabId];
        const folder = tabFolders[tabId];
        const total = files.length;

        return new Promise((resolve) => {
            if (total === 0) {
                resolve();
                return;
            }

            state.images.length = total;
            let nextIndex = 0;
            let completed = 0;

            function launchNext() {
                if (nextIndex >= total) return;

                const index = nextIndex++;
                const img = new Image();
                img.src = `${pathPrefix}${folder}/${files[index]}`;

                img.onload = () => {
                    state.images[index] = img;
                    completed++;
                    if (completed === total) {
                        resolve();
                    } else {
                        // Yield execution slightly for low-priority background loading
                        if (concurrency <= 4) {
                            setTimeout(launchNext, 2);
                        } else {
                            launchNext();
                        }
                    }
                };
                img.onerror = () => {
                    state.images[index] = null;
                    completed++;
                    if (completed === total) {
                        resolve();
                    } else {
                        launchNext();
                    }
                };
            }

            const startCount = Math.min(concurrency, total);
            for (let i = 0; i < startCount; i++) {
                launchNext();
            }
        });
    }

    // Preload coordinator
    function preloadTab(tabId, priority = "low") {
        if (!tabState[tabId] || tabState[tabId].loaded) {
            return Promise.resolve();
        }

        if (loadingPromises[tabId]) {
            return loadingPromises[tabId];
        }

        const files = framesIndex[tabFolders[tabId]] || [];
        tabState[tabId].frameCount = files.length;

        const concurrency = priority === "high" ? 30 : 4;

        const promise = loadTabImages(tabId, files, concurrency).then(() => {
            tabState[tabId].loaded = true;
            delete loadingPromises[tabId];

            // Hide spinner overlay
            const panel = document.querySelector(`[data-browser-panel="${tabId}"]`);
            if (panel) {
                const overlay = panel.querySelector(".sequence-spinner-overlay");
                if (overlay) {
                    overlay.style.opacity = "0";
                    setTimeout(() => {
                        overlay.style.display = "none";
                      }, 300);
                }
            }

            // Render first frame
            drawFrame(tabId);

            // Trigger background loading of the next likely tab
            preloadNextLikelyTab();
        });

        loadingPromises[tabId] = promise;
        return promise;
    }

    // Background loader scheduler
    function preloadNextLikelyTab() {
        const startIndex = tabIdsOrder.indexOf(activeTab);
        if (startIndex === -1) return;

        for (let i = 1; i < tabIdsOrder.length; i++) {
            const nextIndex = (startIndex + i) % tabIdsOrder.length;
            const nextTabId = tabIdsOrder[nextIndex];
            const folder = tabFolders[nextTabId];

            if (folder && tabState[nextTabId] && !tabState[nextTabId].loaded && !loadingPromises[nextTabId]) {
                preloadTab(nextTabId, "low");
                break;
            }
        }
    }

    // Tab switcher listener
    onTabChanged = (tabId) => {
        activeTab = tabId;
        const state = tabState[tabId];

        if (state) {
            if (!state.loaded) {
                const panel = document.querySelector(`[data-browser-panel="${tabId}"]`);
                if (panel) {
                    const overlay = panel.querySelector(".sequence-spinner-overlay");
                    if (overlay) {
                        overlay.style.display = "flex";
                        overlay.style.opacity = "1";
                    }
                }
                preloadTab(tabId, "high");
            } else {
                drawFrame(tabId);
                preloadNextLikelyTab();
            }
        }
    };

    // Reset sequence is used by activateTab("whoami")
    resetWhoamiSequence = () => {
        const state = tabState["whoami"];
        if (state) {
            state.targetProgress = 0;
            state.progress = 0;
            drawFrame("whoami");
        }
    };

    // Continuous LERP Loop
    function animationLoop() {
        if (!loopActive) return;
        requestAnimationFrame(animationLoop);

        const state = tabState[activeTab];
        if (state && state.loaded) {
            const diff = state.targetProgress - state.progress;
            if (Math.abs(diff) > 0.0001) {
                state.progress += diff * 0.12; // Lerp smoothing
                drawFrame(activeTab);
            }
        }
    }

    // Scroll scrubbing event handlers
    function onWheel(e) {
        const state = tabState[activeTab];
        if (!state || !state.loaded) return;

        e.preventDefault();

        // Speed proportional to number of frames (keeps scroll velocity uniform)
        const scrollStep = 12 / state.frameCount;
        const delta = (e.deltaY / 100) * scrollStep;

        state.targetProgress += delta;
        state.targetProgress = Math.max(0, Math.min(1, state.targetProgress));
    }

    function onTouchStart(e) {
        if (e.touches.length > 0) {
            touchStartY = e.touches[0].clientY;
        }
    }

    function onTouchMove(e) {
        const state = tabState[activeTab];
        if (!state || !state.loaded) return;

        e.preventDefault();

        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        touchStartY = currentY;

        const scrollStep = 12 / state.frameCount;
        const delta = (deltaY / 50) * scrollStep * 1.5;

        state.targetProgress += delta;
        state.targetProgress = Math.max(0, Math.min(1, state.targetProgress));
    }

    // Window resize handler
    window.addEventListener("resize", () => {
        if (tabState[activeTab]) {
            drawFrame(activeTab);
        }
    });

    // Load frames index and boot (dynamic auto-prefix lookup)
    fetch("public/frames-index.json")
        .then((res) => {
            pathPrefix = "public/";
            return res.json();
        })
        .catch(() => {
            pathPrefix = "";
            return fetch("frames-index.json").then((res) => res.json());
        })
        .then((data) => {
            framesIndex = data;

            const activePanel = document.querySelector(".browser-panel.active");
            if (activePanel) {
                const activeTabId = activePanel.dataset.browserPanel;
                if (tabState[activeTabId]) {
                    activeTab = activeTabId;
                    preloadTab(activeTabId, "high");
                } else {
                    preloadNextLikelyTab();
                }
            }

            animationLoop();
        })
        .catch((err) => {
            console.error("Failed to load image sequence index:", err);
        });

    // Bind scroll scrubbing to scrollContainer (.browser-page)
    scrollContainer.addEventListener("wheel", onWheel, { passive: false });
    scrollContainer.addEventListener("touchstart", onTouchStart, { passive: true });
    scrollContainer.addEventListener("touchmove", onTouchMove, { passive: false });
}

function setupPaintApp() {
    const canvas = document.getElementById("paint-canvas");
    const fileInput = document.getElementById("paint-file-input");
    const colorPreview = document.getElementById("primary-color-preview");
    const zoomStatus = document.getElementById("paint-zoom-status");

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const state = {
        tool: "pencil",
        color: "#000000",
        brushSize: 4,
        drawing: false,
        startX: 0,
        startY: 0,
        lastX: 0,
        lastY: 0,
        snapshot: null,
        history: [],
        zoom: 1
    };

    function pushHistory() {
        state.history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

        if (state.history.length > 20) {
            state.history.shift();
        }
    }

    function setTool(tool) {
        state.tool = tool;
        document.querySelectorAll("[data-tool]").forEach((button) => {
            button.classList.toggle("active", button.dataset.tool === tool);
        });
        setStatus(`${tool[0].toUpperCase()}${tool.slice(1)} selected.`);
    }

    function setColor(color) {
        state.color = color;
        document.documentElement.style.setProperty("--current-color", color);

        if (colorPreview) {
            colorPreview.style.background = color;
        }

        document.querySelectorAll(".paint-swatches button").forEach((button) => {
            button.classList.toggle("active", button.style.getPropertyValue("--swatch").trim().toLowerCase() === color.toLowerCase());
        });
    }

    function getPoint(event) {
        const rect = canvas.getBoundingClientRect();

        return {
            x: Math.round((event.clientX - rect.left) * (canvas.width / rect.width)),
            y: Math.round((event.clientY - rect.top) * (canvas.height / rect.height))
        };
    }

    function clearCanvas() {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    function drawImageContained(image) {
        pushHistory();
        clearCanvas();

        const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
        const width = image.width * scale;
        const height = image.height * scale;
        const x = (canvas.width - width) / 2;
        const y = (canvas.height - height) / 2;

        ctx.drawImage(image, x, y, width, height);
        setStatus("Image loaded. Draw over it or use Image to delete it.");
    }

    function loadImage(src, fallback) {
        const image = new Image();

        image.onload = () => drawImageContained(image);
        image.onerror = () => {
            if (fallback && src !== fallback) {
                loadImage(fallback);
                return;
            }

            clearCanvas();
            setStatus("Default image was not found. Blank canvas ready.");
        };
        image.src = src;
    }

    function drawFreehand(fromX, fromY, toX, toY) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = state.tool === "brush" ? 12 : state.brushSize;
        ctx.strokeStyle = state.tool === "eraser" ? "#ffffff" : state.color;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
    }

    function drawShape(fromX, fromY, toX, toY) {
        if (state.snapshot) {
            ctx.putImageData(state.snapshot, 0, 0);
        }

        ctx.lineWidth = state.brushSize;
        ctx.strokeStyle = state.color;
        ctx.beginPath();

        if (state.tool === "line") {
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
        }

        if (state.tool === "rect") {
            ctx.rect(fromX, fromY, toX - fromX, toY - fromY);
        }

        if (state.tool === "ellipse") {
            const centerX = (fromX + toX) / 2;
            const centerY = (fromY + toY) / 2;
            const radiusX = Math.abs(toX - fromX) / 2;
            const radiusY = Math.abs(toY - fromY) / 2;
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
        }

        ctx.stroke();
    }

    function hexToRgb(hex) {
        const value = hex.replace("#", "");

        return [
            parseInt(value.slice(0, 2), 16),
            parseInt(value.slice(2, 4), 16),
            parseInt(value.slice(4, 6), 16),
            255
        ];
    }

    function floodFill(startX, startY, color) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const targetIndex = (startY * canvas.width + startX) * 4;
        const target = data.slice(targetIndex, targetIndex + 4);
        const replacement = hexToRgb(color);

        if (target.every((value, index) => value === replacement[index])) {
            return;
        }

        const stack = [[startX, startY]];

        while (stack.length) {
            const point = stack.pop();
            const x = point[0];
            const y = point[1];

            if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
                continue;
            }

            const index = (y * canvas.width + x) * 4;

            if (
                data[index] !== target[0] ||
                data[index + 1] !== target[1] ||
                data[index + 2] !== target[2] ||
                data[index + 3] !== target[3]
            ) {
                continue;
            }

            data[index] = replacement[0];
            data[index + 1] = replacement[1];
            data[index + 2] = replacement[2];
            data[index + 3] = replacement[3];

            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function pickColor(x, y) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = `#${[pixel[0], pixel[1], pixel[2]].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
        setColor(color);
        setStatus(`Picked ${color}.`);
    }

    function addText(x, y) {
        const text = window.prompt("Text to add:");

        if (!text) {
            return;
        }

        pushHistory();
        ctx.fillStyle = state.color;
        ctx.font = "28px Arial";
        ctx.fillText(text, x, y);
        setStatus("Text added.");
    }

    function undo() {
        const last = state.history.pop();

        if (!last) {
            setStatus("Nothing to undo.");
            return;
        }

        ctx.putImageData(last, 0, 0);
        setStatus("Undo complete.");
    }

    function performAction(action) {
        if (action === "load") {
            fileInput.click();
            setStatus("Choose an image to place on the canvas.");
        }

        if (action === "undo") {
            undo();
        }

        if (action === "clear" || action === "delete-image") {
            pushHistory();
            clearCanvas();
            setStatus(action === "clear" ? "Canvas cleared." : "Image deleted. Blank canvas ready.");
        }

        if (action === "download") {
            const link = document.createElement("a");
            link.download = "paint-canvas.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
            setStatus("Canvas downloaded.");
        }

        if (action === "zoom") {
            state.zoom = state.zoom >= 1.5 ? 1 : state.zoom + 0.25;
            canvas.style.width = `${state.zoom * 100}%`;
            canvas.style.height = `${state.zoom * 100}%`;

            if (zoomStatus) {
                zoomStatus.textContent = `${Math.round(state.zoom * 100)}%`;
            }

            setStatus(`Zoom set to ${Math.round(state.zoom * 100)}%.`);
        }

        if (action === "help") {
            setStatus("Tools: P draw, B brush, E erase, F fill, I pick color, A text, / line, R rectangle, O ellipse.");
        }
    }

    canvas.addEventListener("pointerdown", (event) => {
        const point = getPoint(event);

        if (state.tool === "fill") {
            pushHistory();
            floodFill(point.x, point.y, state.color);
            setStatus("Fill applied.");
            return;
        }

        if (state.tool === "picker") {
            pickColor(point.x, point.y);
            return;
        }

        if (state.tool === "text") {
            addText(point.x, point.y);
            return;
        }

        pushHistory();
        state.drawing = true;
        state.startX = point.x;
        state.startY = point.y;
        state.lastX = point.x;
        state.lastY = point.y;
        state.snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
        if (!state.drawing) {
            return;
        }

        const point = getPoint(event);

        if (["pencil", "brush", "eraser"].includes(state.tool)) {
            drawFreehand(state.lastX, state.lastY, point.x, point.y);
            state.lastX = point.x;
            state.lastY = point.y;
        } else {
            drawShape(state.startX, state.startY, point.x, point.y);
        }
    });

    canvas.addEventListener("pointerup", (event) => {
        state.drawing = false;
        state.snapshot = null;
        canvas.releasePointerCapture(event.pointerId);
    });

    document.querySelectorAll("[data-tool]").forEach((button) => {
        button.addEventListener("click", () => setTool(button.dataset.tool));
    });

    document.querySelectorAll("[data-paint-action]").forEach((button) => {
        button.addEventListener("click", () => performAction(button.dataset.paintAction));
    });

    document.querySelectorAll(".paint-swatches button").forEach((button) => {
        button.addEventListener("click", () => setColor(button.style.getPropertyValue("--swatch").trim()));
    });

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => loadImage(reader.result);
        reader.readAsDataURL(file);
        fileInput.value = "";
    });

    clearCanvas();
    setColor("#000000");
    setTool("pencil");
    loadImage(canvas.dataset.imageSrc, canvas.dataset.fallbackSrc);
}

function setupDeployBrowser() {
    const browserWindow = document.getElementById("browser-window");
    const tabs = Array.from(document.querySelectorAll("[data-browser-tab]"));
    const panels = Array.from(document.querySelectorAll("[data-browser-panel]"));
    const address = document.getElementById("deploy-address");
    const toolbarForm = document.getElementById("deploy-search-form");
    const homeForm = document.getElementById("deploy-home-search-form");
    const homeSearch = document.getElementById("deploy-home-search");
    const output = document.getElementById("deploy-search-output");
    const history = ["home"];
    let historyIndex = 0;

    if (!browserWindow || !tabs.length || !panels.length || !address) {
        return;
    }

    function tabTitle(tabId) {
        const tab = tabs.find((item) => item.dataset.browserTab === tabId);
        return tab ? tab.textContent.trim() : "Deploy";
    }

    function tabUrl(tabId) {
        const tab = tabs.find((item) => item.dataset.browserTab === tabId);
        return tab ? tab.dataset.browserUrl : "www.deploy.com";
    }

    function setAddress(tabId) {
        address.value = tabUrl(tabId);
    }

    function activateTab(tabId, shouldTrack = true) {
        const targetPanel = panels.find((panel) => panel.dataset.browserPanel === tabId);

        if (!targetPanel) {
            return;
        }

        tabs.forEach((tab) => {
            tab.classList.toggle("active", tab.dataset.browserTab === tabId);
        });
        panels.forEach((panel) => {
            panel.classList.toggle("active", panel.dataset.browserPanel === tabId);
        });

        setAddress(tabId);

        if (tabId === "whoami") {
            resetWhoamiSequence();
        }

        if (typeof onTabChanged === "function") {
            onTabChanged(tabId);
        }

        if (shouldTrack && history[historyIndex] !== tabId) {
            history.splice(historyIndex + 1);
            history.push(tabId);
            historyIndex = history.length - 1;
        }
    }

    function runSearch(query) {
        const cleanQuery = query.trim();

        if (!cleanQuery) {
            activateTab("home");
            if (output) {
                output.textContent = "Type something to search this portfolio.";
            }
            return;
        }

        const lowerQuery = cleanQuery.toLowerCase();
        const normalizedQuery = lowerQuery
            .replace(/^https?:\/\//, "")
            .replace(/^www\./, "")
            .replace(/\.com\/?$/, "")
            .replace(/\s+/g, "");
        const matchingTab = tabs.find((tab) => {
            const title = tab.textContent.trim().toLowerCase();
            const id = tab.dataset.browserTab.toLowerCase();
            const url = tab.dataset.browserUrl.toLowerCase();
            const normalizedTitle = title.replace(/\s+/g, "");
            const normalizedUrl = url.replace(/^www\./, "").replace(/\.com$/, "");
            return (
                title.includes(lowerQuery) ||
                id.includes(normalizedQuery) ||
                normalizedTitle.includes(normalizedQuery) ||
                url.includes(lowerQuery) ||
                normalizedUrl.includes(normalizedQuery)
            );
        });

        if (matchingTab) {
            activateTab(matchingTab.dataset.browserTab);
            if (output) {
                output.textContent = `Opened ${tabTitle(matchingTab.dataset.browserTab)}.`;
            }
            return;
        }

        activateTab("home");
        address.value = `www.deploy.com/search?q=${encodeURIComponent(cleanQuery)}`;
        if (homeSearch) {
            homeSearch.value = cleanQuery;
        }
        if (output) {
            output.textContent = `No page is filled for "${cleanQuery}" yet. Add that info later.`;
        }
    }

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => activateTab(tab.dataset.browserTab));
    });

    toolbarForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = address.value.trim();
        runSearch(value);
    });

    homeForm.addEventListener("submit", (event) => {
        event.preventDefault();
        runSearch(homeSearch.value);
    });

    document.querySelectorAll("[data-browser-action]").forEach((button) => {
        button.addEventListener("click", () => {
            const action = button.dataset.browserAction;

            if (action === "back" && historyIndex > 0) {
                historyIndex -= 1;
                activateTab(history[historyIndex], false);
            }

            if (action === "forward" && historyIndex < history.length - 1) {
                historyIndex += 1;
                activateTab(history[historyIndex], false);
            }

            if (action === "refresh") {
                const currentTab = history[historyIndex] || "home";
                activateTab(currentTab, false);
                if (output && currentTab === "home") {
                    output.textContent = "Deploy refreshed.";
                }
            }

            if (action === "home") {
                activateTab("home");
                if (output) {
                    output.textContent = "Welcome back to Deploy.";
                }
            }
        });
    });
}

document.querySelectorAll(".paint-window, .browser-window").forEach(makeWindowDraggable);
makeDesktopIconsDraggable();
setupWhoamiSequence();
setupPaintApp();
setupDeployBrowser();
openWindow("paint-window");
