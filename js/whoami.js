/* ═══════════════════════════════════════════════════════════════
   WHOAMI — Scroll-Driven Image Sequence Player (AAA Quality)
   Plays a 300-frame preloaded 2D animation sequence driven by
   mouse scroll (desktop) or touch gestures (mobile).
   
   Features:
     - 60fps momentum damping (lerp) for smooth scroll transitions
     - Responsive "background-size: cover" canvas aspect ratio drawing
     - Complete preloading with progress tracking percentage
     - Scrollbar-free static container
   ═══════════════════════════════════════════════════════════════ */

(() => {
    'use strict';

    /* ── DOM references ── */
    const panel      = document.querySelector('[data-browser-panel="whoami"]');
    const container  = document.querySelector('.whoami-video-shell');
    const canvas     = document.getElementById('whoami-sequence-canvas');
    const loadingEl  = document.getElementById('whoami-loading-overlay');
    const statusEl   = document.querySelector('[data-whoami-status]');

    if (!panel || !container || !canvas) return;

    const ctx = canvas.getContext('2d');

    /* ── Constants ── */
    const TOTAL_FRAMES     = 219;
    const FRAME_DIR        = window.location.protocol === 'file:' ? 'public/whoami-frames/' : 'whoami-frames/';
    const FRAME_PREFIX     = 'PortfolioAnimation_';
    const SCROLL_SPEED     = 0.35; // Sensitivity of scrolling
    const LERP_FACTOR      = 0.12;  // Momentum damping factor (lower = smoother/slower)

    /* ── State variables ── */
    const images = [];
    let isLoaded = false;
    let targetFrame = 0;
    let currentFrame = 0;
    let frameId = null;
    let touchStartY = 0;

    /* ═══════════════════════════════════
       PRELOADER SYSTEM
       ═══════════════════════════════════ */
    function zeroPad(num, size) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    function preloadImages() {
        return new Promise((resolve) => {
            let loadedCount = 0;

            const onImageLoad = () => {
                loadedCount++;
                
                /* Update loading percentage */
                if (statusEl) {
                    const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
                    statusEl.textContent = `Preloading animation… ${pct}%`;
                }

                if (loadedCount === TOTAL_FRAMES) {
                    isLoaded = true;
                    resolve();
                }
            };

            const onImageError = (e) => {
                console.warn(`Failed to load frame: ${e.target.src}`);
                onImageLoad(); // Skip and continue so it doesn't hang
            };

            for (let i = 0; i < TOTAL_FRAMES; i++) {
                const img = new Image();
                img.src = `${FRAME_DIR}${FRAME_PREFIX}${zeroPad(i, 3)}.jpg`;
                img.onload = onImageLoad;
                img.onerror = onImageError;
                images.push(img);
            }
        });
    }

    /* ═══════════════════════════════════
       RESPONSIVE COVER CANVAS DRAWING
       ═══════════════════════════════════ */
    function drawFrame(frameIndex) {
        if (!isLoaded || images.length === 0) return;

        const img = images[Math.floor(frameIndex)];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
    }

    /* ═══════════════════════════════════
       MOMENTUM RENDERING LOOP
       ═══════════════════════════════════ */
    function loop() {
        frameId = requestAnimationFrame(loop);

        /* Smoothly interpolate current frame toward target frame */
        const diff = targetFrame - currentFrame;
        
        if (Math.abs(diff) > 0.01) {
            currentFrame += diff * LERP_FACTOR;
            
            /* Clamp current frame to boundaries */
            currentFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, currentFrame));
            
            drawFrame(currentFrame);
        }
    }

    /* ═══════════════════════════════════
       INTERACTIVE SCROLL & TOUCH LISTENERS
       ═══════════════════════════════════ */
    function onWheel(e) {
        e.preventDefault(); // Block outer page scrolling
        if (!isLoaded) return;

        /* Increment target frame by scroll delta */
        targetFrame += e.deltaY * SCROLL_SPEED * 0.08;
        targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, targetFrame));
    }

    function onTouchStart(e) {
        if (e.touches.length > 0) {
            touchStartY = e.touches[0].clientY;
        }
    }

    function onTouchMove(e) {
        if (!isLoaded || e.touches.length === 0) return;
        e.preventDefault();

        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY; // Upward swipe advances frames
        touchStartY = currentY;

        targetFrame += deltaY * SCROLL_SPEED * 0.45;
        targetFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, targetFrame));
    }

    /* ═══════════════════════════════════
       RESIZE
       ═══════════════════════════════════ */
    function onResize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w < 1 || h < 1) return;

        canvas.width = w;
        canvas.height = h;

        /* Draw current frame immediately on resize */
        drawFrame(currentFrame);
    }

    /* ═══════════════════════════════════
       INITIALISATION
       ═══════════════════════════════════ */
    async function init() {
        /* Set initial sizes */
        onResize();

        /* Preload all images */
        await preloadImages();

        /* Dismiss preloader screen */
        if (loadingEl) loadingEl.style.display = 'none';

        /* Draw first frame */
        drawFrame(0);

        /* Start momentum animation loop */
        loop();

        /* Attach event listeners */
        container.addEventListener('wheel', onWheel, { passive: false });
        container.addEventListener('touchstart', onTouchStart, { passive: true });
        container.addEventListener('touchmove', onTouchMove, { passive: false });

        new ResizeObserver(onResize).observe(container);
    }

    /* ═══════════════════════════════════
       TAB VISIBILITY OBSERVER
       ═══════════════════════════════════ */
    const obs = new MutationObserver(() => {
        const visible = panel.classList.contains('active');

        if (visible && !isLoaded && images.length === 0) {
            init();
        } else if (visible && frameId === null && isLoaded) {
            loop();
        } else if (!visible && frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
    });
    obs.observe(panel, { attributes: true, attributeFilter: ['class'] });

    if (panel.classList.contains('active')) init();

})();
