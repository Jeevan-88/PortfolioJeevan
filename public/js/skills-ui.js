/* ============================================
   Skills UI — Sticky Notes Overlay Manager
   One note at a time. Coordinates from user clicks.
   ============================================ */

(function () {
    "use strict";

    const THRESHOLD = 0.85;
    let overlayEl = null;
    let noteDivs = [];

    // ─── Notes: added one at a time by user ───
    const notesData = [
        {
            corners: [
                { x: 20.5, y: 17.2 }, // TL
                { x: 30.4, y: 18.4 }, // TR
                { x: 21.9, y: 38.3 }, // BL
                { x: 31.7, y: 37.9 }  // BR
            ],
            label: "Cloud Computing",
            skills: [
                "AWS (EC2, S3)",
                "Azure & GCP",
                "Cloud Architecture",
                "Serverless & CDN"
            ]
        },
        {
            corners: [
                { x: 22.7, y: 52.4 },
                { x: 31.5, y: 52.4 },
                { x: 23.6, y: 70.6 },
                { x: 32.5, y: 68.3 }
            ],
            label: "DevOps",
            skills: [
                "Docker",
                "Kubernetes",
                "Terraform",
                "CI/CD Pipelines",
                "Ansible"
            ]
        },
        {
            corners: [
                { x: 32.5, y: 7.8 },
                { x: 40.1, y: 9.2 },
                { x: 33.6, y: 25.5 },
                { x: 41.2, y: 26.4 }
            ],
            label: "Backend",
            skills: [
                "Python & Flask",
                "Node.js & Express",
                "REST APIs",
                "SQL & NoSQL"
            ]
        },
        {
            corners: [
                { x: 33.9, y: 45.9 },
                { x: 41.3, y: 44.8 },
                { x: 35.3, y: 62.5 },
                { x: 42.3, y: 59.8 }
            ],
            label: "Programming",
            skills: [
                "Python",
                "Java & C++",
                "JavaScript",
                "Bash Scripting"
            ]
        },
        {
            corners: [
                { x: 21.0, y: 77.5 },
                { x: 29.7, y: 75.7 },
                { x: 21.3, y: 93.9 },
                { x: 29.9, y: 91.2 }
            ],
            label: "Core CS",
            skills: [
                "OOPs Concepts",
                "DBMS & SQL",
                "Operating Systems",
                "Computer Networks"
            ]
        },
        {
            corners: [
                { x: 33.3, y: 75.7 },
                { x: 40.7, y: 73.5 },
                { x: 34.5, y: 88.5 },
                { x: 41.7, y: 85.4 }
            ],
            label: "Tools & Git",
            skills: [
                "Git & GitHub",
                "VS Code & Vim",
                "Postman API",
                "Linux CLI"
            ]
        },
        {
            corners: [
                { x: 59.4, y: 15.7 },
                { x: 63.5, y: 17.7 },
                { x: 59.9, y: 25.8 },
                { x: 63.9, y: 27.3 }
            ],
            label: "Soft Skills",
            skills: [
                "Problem Solving",
                "Self Learning",
                "Team Synergy",
                "Adaptability"
            ]
        },
        {
            corners: [
                { x: 52.7, y: 21.9 },
                { x: 57.1, y: 21.5 },
                { x: 53.7, y: 31.6 },
                { x: 59.0, y: 32.0 }
            ],
            label: "Creator Side",
            skills: [
                "Video Production",
                "Storytelling & Script",
                "Music & Beat Making",
                "Audio Production"
            ]
        },
        {
            corners: [
                { x: 54.3, y: 49.9 }, // TL
                { x: 58.4, y: 51.5 }, // TR
                { x: 54.3, y: 63.6 }, // BL
                { x: 58.5, y: 64.3 }  // BR
            ],
            label: "Monitoring",
            skills: [
                "Prometheus",
                "Grafana Dashboards",
                "AWS CloudWatch",
                "Log Analysis"
            ]
        },
        {
            corners: [
                { x: 56.6, y: 33.6 }, // TL
                { x: 60.9, y: 35.1 }, // TR
                { x: 56.5, y: 43.4 }, // BL
                { x: 61.0, y: 44.4 }  // BR
            ],
            label: "Frontend",
            skills: [
                "HTML5 & CSS3",
                "JavaScript ES6",
                "Responsive UI",
                "CSS Gradients"
            ]
        },
        {
            corners: [
                { x: 59.9, y: 52.6 }, // TL
                { x: 63.3, y: 53.1 }, // TR
                { x: 60.9, y: 61.8 }, // BL
                { x: 63.9, y: 61.0 }  // BR
            ],
            label: "System Design",
            skills: [
                "Microservices",
                "Load Balancing",
                "Scalability",
                "Caching Systems"
            ]
        },
        {
            corners: [
                { x: 60.1, y: 75.1 }, // TL
                { x: 63.8, y: 74.8 }, // TR
                { x: 60.7, y: 84.5 }, // BL
                { x: 64.8, y: 83.1 }  // BR
            ],
            label: "Life Quests",
            skills: [
                "Gaming & Lore",
                "PC Customization",
                "Creative Design",
                "Constant Learning"
            ]
        }
    ];

    function sortCorners(pts) {
        const sorted = [...pts].sort((a, b) => a.y - b.y);
        const top = sorted.slice(0, 2).sort((a, b) => a.x - b.x);
        const bot = sorted.slice(2, 4).sort((a, b) => a.x - b.x);
        return { tl: top[0], tr: top[1], bl: bot[0], br: bot[1] };
    }

    function injectOverlay() {
        const panel = document.querySelector('[data-browser-panel="skills"] .sequence-panel-wrapper');
        if (!panel || panel.querySelector(".skills-notes-overlay")) return;

        overlayEl = document.createElement("div");
        overlayEl.className = "skills-notes-overlay";

        notesData.forEach((note, idx) => {
            const c = sortCorners(note.corners);

            // Geometric center of the 4 corners
            const cx = (c.tl.x + c.tr.x + c.bl.x + c.br.x) / 4;
            const cy = (c.tl.y + c.tr.y + c.bl.y + c.br.y) / 4;

            // Average width and height of the note
            const w = ((c.tr.x - c.tl.x) + (c.br.x - c.bl.x)) / 2;
            const h = ((c.bl.y - c.tl.y) + (c.br.y - c.tr.y)) / 2;

            // Average vertical and horizontal offsets to calculate a robust slant angle
            const dy = ((c.tr.y - c.tl.y) + (c.br.y - c.bl.y)) / 2;
            const dx = ((c.tr.x - c.tl.x) + (c.br.x - c.bl.x)) / 2;

            // Correct angle by multiplying with aspect ratio coordinates (16:9)
            const angle = Math.atan2(dy * 9, dx * 16) * 180 / Math.PI;

            const div = document.createElement("div");
            div.className = "sticky-note-content";
            div.style.left = cx + "%";
            div.style.top = cy + "%";
            div.style.width = w + "%";
            div.style.height = h + "%";

            // Determine if sticky is on the left fridge door or right fridge door
            const isLeftDoor = cx < 45;
            const yRot = isLeftDoor ? 15 : -15;

            // translate(-50%, -50%) centers it exactly on (cx, cy).
            // rotateY(yRot) slants it in 3D perspective to match the door opening angle.
            // rotate(angle) tilts the text on the note's surface.
            const baseTransform = `translate(-50%, -50%) rotateY(${yRot}deg) rotate(${angle.toFixed(1)}deg)`;
            div.dataset.baseTransform = baseTransform;
            div.style.transform = baseTransform;

            const skillsHTML = note.skills.map(s => `<div class="sticky-skill">${s}</div>`).join("");
            div.innerHTML = `<div class="sticky-heading">${note.label}</div>${skillsHTML}`;

            overlayEl.appendChild(div);
            noteDivs.push(div);
        });

        panel.appendChild(overlayEl);
    }

    function checkProgress(progress) {
        if (!overlayEl) injectOverlay();
        if (!overlayEl) return;

        if (progress >= THRESHOLD) {
            overlayEl.style.display = "block";

            const textProg = (progress - THRESHOLD) / (1.0 - THRESHOLD);
            const count = noteDivs.length;

            noteDivs.forEach((div, i) => {
                const noteP = textProg * (count + 2) - i;
                if (noteP > 0) {
                    const opacity = Math.min(1, noteP);
                    div.style.display = "flex";
                    div.style.opacity = opacity.toFixed(3);
                    div.style.transform = div.dataset.baseTransform;
                } else {
                    div.style.display = "none";
                    div.style.opacity = "0";
                }
            });
        } else {
            overlayEl.style.display = "none";
            noteDivs.forEach(div => {
                div.style.display = "none";
                div.style.opacity = "0";
            });
        }
    }

    window.SkillsUI = { checkProgress };
})();
