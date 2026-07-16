const desktop = document.querySelector(".desktop");
let topZ = 6;
let resetWhoamiSequence = () => {};

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
    const panel = document.querySelector('[data-browser-panel="whoami"]');
    const scrollContainer = document.querySelector(".browser-page");
    const sequenceContainer = document.querySelector("[data-whoami-scroll]");
    const spacer = document.querySelector(".whoami-scroll-sequence__spacer");
    const canvas = document.getElementById("whoami-sequence-canvas");
    const status = document.querySelector("[data-whoami-status]");

    if (!panel || !scrollContainer || !sequenceContainer || !spacer || !canvas) {
        return;
    }

    const frameCount = 300;
    const framePrefix = "whoami-frames/PortfolioAnimation_";
    const frameSuffix = ".jpg";
    const frameCache = new Map();
    const loadingFrames = new Set();
    const maxCacheSize = 14;
    const context = canvas.getContext("2d", { alpha: false });
    const devicePixelRatio = window.devicePixelRatio || 1;

    let targetFrame = 0;
    let activeFrame = -1;
    let renderScheduled = false;
    let resizeObserver = null;

    function frameUrl(index) {
        return `${framePrefix}${String(index).padStart(3, "0")}${frameSuffix}`;
    }

    function updateStatus(index) {
        if (status) {
            status.textContent = `Frame ${String(index + 1).padStart(3, "0")} of ${frameCount}`;
        }
    }

    function fitCanvas() {
        sequenceContainer.style.setProperty("--whoami-view-height", `${scrollContainer.clientHeight}px`);

        const rect = canvas.getBoundingClientRect();
        const nextWidth = Math.max(1, Math.round(rect.width * devicePixelRatio));
        const nextHeight = Math.max(1, Math.round(rect.height * devicePixelRatio));

        if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
            canvas.width = nextWidth;
            canvas.height = nextHeight;
        }

        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
    }

    function drawFrame(index) {
        const image = frameCache.get(index);

        fitCanvas();
        context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        if (!image || !image.complete || !image.naturalWidth || !image.naturalHeight) {
            updateStatus(index);
            return;
        }

        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;
        const imageRatio = image.naturalWidth / image.naturalHeight;
        const canvasRatio = canvasWidth / canvasHeight;
        let drawWidth = canvasWidth;
        let drawHeight = canvasHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imageRatio > canvasRatio) {
            drawHeight = canvasHeight;
            drawWidth = drawHeight * imageRatio;
            offsetX = (canvasWidth - drawWidth) / 2;
        } else {
            drawWidth = canvasWidth;
            drawHeight = drawWidth / imageRatio;
            offsetY = (canvasHeight - drawHeight) / 2;
        }

        context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
        updateStatus(index);
    }

    function pruneCache() {
        if (frameCache.size <= maxCacheSize) {
            return;
        }

        const retainedFrames = Array.from(frameCache.keys())
            .sort((left, right) => Math.abs(left - targetFrame) - Math.abs(right - targetFrame))
            .slice(0, maxCacheSize);

        frameCache.forEach((_, key) => {
            if (!retainedFrames.includes(key)) {
                frameCache.delete(key);
            }
        });
    }

    function loadFrame(index) {
        const safeIndex = Math.max(0, Math.min(frameCount - 1, index));

        if (frameCache.has(safeIndex)) {
            return Promise.resolve(frameCache.get(safeIndex));
        }

        if (loadingFrames.has(safeIndex)) {
            return Promise.resolve(null);
        }

        loadingFrames.add(safeIndex);

        return new Promise((resolve) => {
            const image = new Image();
            image.decoding = "async";
            image.src = frameUrl(safeIndex);

            image.onload = () => {
                loadingFrames.delete(safeIndex);
                frameCache.set(safeIndex, image);
                pruneCache();
                resolve(image);
            };

            image.onerror = () => {
                loadingFrames.delete(safeIndex);
                resolve(null);
            };
        });
    }

    function preloadNearby(index) {
        const preloadRadius = 5;

        for (let offset = -preloadRadius; offset <= preloadRadius; offset += 1) {
            loadFrame(index + offset);
        }
    }

    function scheduleRender() {
        if (renderScheduled) {
            return;
        }

        renderScheduled = true;

        requestAnimationFrame(() => {
            renderScheduled = false;

            if (activeFrame !== targetFrame) {
                activeFrame = targetFrame;
            }

            drawFrame(activeFrame);
        });
    }

    function updateFromScroll() {
        const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const progress = maxScroll > 0 ? scrollContainer.scrollTop / maxScroll : 0;

        targetFrame = Math.max(0, Math.min(frameCount - 1, Math.round(progress * (frameCount - 1))));
        preloadNearby(targetFrame);
        scheduleRender();
    }

    function resetSequence() {
        scrollContainer.scrollTop = 0;
        targetFrame = 0;
        activeFrame = 0;
        preloadNearby(0);
        drawFrame(0);
    }

    resizeObserver = new ResizeObserver(() => {
        if (panel.classList.contains("active")) {
            drawFrame(activeFrame >= 0 ? activeFrame : targetFrame);
        }
    });

    resizeObserver.observe(panel);

    scrollContainer.style.setProperty("--whoami-frame-count", String(frameCount));
    spacer.style.height = `${Math.max(2400, frameCount * 32)}px`;

    scrollContainer.addEventListener("scroll", updateFromScroll, { passive: true });
    window.addEventListener("resize", () => {
        if (panel.classList.contains("active")) {
            drawFrame(activeFrame >= 0 ? activeFrame : targetFrame);
        }
    });

    new ResizeObserver(() => {
        fitCanvas();
        if (panel.classList.contains("active")) {
            drawFrame(activeFrame >= 0 ? activeFrame : targetFrame);
        }
    }).observe(scrollContainer);

    resetWhoamiSequence = () => {
        requestAnimationFrame(resetSequence);
    };

    Promise.all([loadFrame(0), loadFrame(1), loadFrame(frameCount - 1)]).then(() => {
        if (panel.classList.contains("active")) {
            resetSequence();
        } else {
            updateStatus(0);
        }
    });
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
