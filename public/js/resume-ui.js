/* ============================================
   Resume UI Manager
   Injects and handles the interactive chalkboard
   and pinned paper resume document.
   ============================================ */

(function () {
    "use strict";

    let overlayEl = null;

    /**
     * Inject Resume Chalkboard layout HTML
     */
    function injectOverlay() {
        const panel = document.querySelector('[data-browser-panel="resume"] .sequence-panel-wrapper');
        if (!panel || panel.querySelector(".resume-board-overlay")) return;

        overlayEl = document.createElement("div");
        overlayEl.className = "resume-board-overlay";
        overlayEl.innerHTML = `
            <div class="resume-board-layout">
                <!-- Left: Pinned Scrollable Paper -->
                <div class="resume-paper-container">
                    <div class="resume-paper-pin"></div>
                    <div class="resume-paper-scrollable">
                        <div class="resume-paper-header">
                            <h2 class="resume-paper-name">Avula Jeevan Yadav</h2>
                            <div class="resume-paper-contacts">
                                <a href="mailto:jeevanyadav2008@gmail.com">jeevanyadav2008@gmail.com</a>
                                <span>•</span>
                                <a href="tel:+919989541975">+91 **********</a>
                                <span>•</span>
                                <a href="https://www.linkedin.com/in/jeevan8/" target="_blank">LinkedIn</a>
                                <span>•</span>
                                <a href="https://github.com/Jeevan-88" target="_blank">GitHub</a>
                            </div>
                        </div>

                        <div class="resume-section-title">Skills</div>
                        <div class="resume-skill-group"><strong>Programming:</strong> Java, Python, Bash</div>
                        <div class="resume-skill-group"><strong>Cloud & DevOps:</strong> AWS, Azure, GCP, IAM, Terraform, Kubernetes, Docker, CI/CD, GitHub Actions, Linux</div>
                        <div class="resume-skill-group"><strong>Monitoring & Sec:</strong> Prometheus, Grafana, Cloud Security, Trivy</div>
                        <div class="resume-skill-group"><strong>Frameworks:</strong> Spring Boot, REST APIs, Maven</div>

                        <div class="resume-section-title">Projects</div>
                        <div class="resume-project-item">
                            <div class="resume-project-title-row">
                                <a href="https://github.com/Jeevan-88/DeployPilot" target="_blank" style="color:#2980b9;text-decoration:none;font-weight:700;">DeployPilot ↗</a>
                                <span>May '26 - Present</span>
                            </div>
                            <ul class="resume-bullet-list">
                                <li>Designed microservices architecture using Spring Boot and REST APIs.</li>
                                <li>Reduced image size by 70% using multi-stage Docker builds.</li>
                                <li>Configured Kubernetes Deployments, Services, ConfigMaps, and health probes.</li>
                                <li>Integrated Prometheus, Grafana, and scanned containers using Trivy.</li>
                            </ul>
                        </div>
                        <div class="resume-project-item">
                            <div class="resume-project-title-row">
                                <a href="https://github.com/Jeevan-88/Cloud-Sentry-Alpha" target="_blank" style="color:#2980b9;text-decoration:none;font-weight:700;">Cloud-Sentry ↗</a>
                                <span>Mar '26 - Apr '26</span>
                            </div>
                            <ul class="resume-bullet-list">
                                <li>CSPM tool scanning AWS/GCP/Azure configs with Boto3 and SDKs.</li>
                                <li>Optimized scans with Python ThreadPoolExecutor for concurrent execution.</li>
                                <li>Automated audits using GitHub Actions and enabled auto-remediation checks.</li>
                            </ul>
                        </div>

                        <div class="resume-section-title">Training</div>
                        <div class="resume-project-item">
                            <div class="resume-project-title-row">
                                <a href="https://drive.google.com/file/d/1Xu2A3dg6Ys3Tx8-f1SI2feG5V4iGFm_w/view?usp=sharing" target="_blank" style="color:#2980b9;text-decoration:none;font-weight:700;">Cyber Security Essentials Internship ↗</a>
                                <span>Jun '25 - Jul '25</span>
                            </div>
                            <ul class="resume-bullet-list">
                                <li>Worked hands-on with Kali Linux, Wireshark, Nmap, and Burp Suite.</li>
                                <li>Conducted scans, traffic analysis, and system vulnerability assessment.</li>
                            </ul>
                        </div>

                        <div class="resume-section-title">Education</div>
                        <div class="resume-project-item">
                            <div class="resume-project-title-row">
                                <span>Lovely Professional University</span>
                                <span>CGPA: 7.04</span>
                            </div>
                            <div>B.Tech in Computer Science (2023 - Present)</div>
                        </div>
                    </div>
                </div>

                <!-- Right: Chalkboard Writings -->
                <div class="chalkboard-container">
                    <div class="chalk-section-row">
                        <!-- Column 1: Certifications -->
                        <div class="chalk-col">
                            <div class="chalk-header">Certifications</div>
                            <ul class="chalk-list">
                                <li class="chalk-item">
                                    <a class="chalk-link" href="https://learn.microsoft.com/api/credentials/share/en-us/JeevanYadav-9707/4DF8CA3EACEC9F3C?sharingId=3C6F990D8402622C" target="_blank">Azure Administrator Associate</a>
                                    <div class="chalk-subtext">Microsoft • Jul 2026</div>
                                </li>
                                <li class="chalk-item">
                                    <a class="chalk-link" href="https://cp.certmetrics.com/amazon/en/public/verify/credential/5523acd16732439f824b4822dbcba003" target="_blank">AWS Developer Associate</a>
                                    <div class="chalk-subtext">AWS • Jan 2026</div>
                                </li>
                                <li class="chalk-item">
                                    <a class="chalk-link" href="https://cp.certmetrics.com/amazon/en/public/verify/credential/fa94e0b1d89d47a38e77e3d21b80fc87" target="_blank">AWS Solutions Architect</a>
                                    <div class="chalk-subtext">AWS • Jan 2026</div>
                                </li>
                                <li class="chalk-item">
                                    <a class="chalk-link" href="https://cp.certmetrics.com/amazon/en/public/verify/credential/e62ff622d7624b2cbcf448898cac1bf0" target="_blank">AWS Cloud Practitioner</a>
                                    <div class="chalk-subtext">AWS • Jan 2026</div>
                                </li>
                                <li class="chalk-item">
                                    <a class="chalk-link" href="https://drive.google.com/file/d/14v2OHGMFD4J2_dY_Q7mo4zI0uhOWN1tX/view?usp=sharing" target="_blank">Postman API Student Expert</a>
                                    <div class="chalk-subtext">Postman • Dec 2025</div>
                                </li>
                                <li class="chalk-item">
                                    <a class="chalk-link" href="https://www.freecodecamp.org/certification/jeevan_88/responsive-web-design" target="_blank">Responsive Web Design</a>
                                    <div class="chalk-subtext">FreeCodeCamp • Sep 2023</div>
                                </li>
                            </ul>
                        </div>

                        <!-- Column 2: Achievements & Education -->
                        <div class="chalk-col">
                            <div class="chalk-header">Achievements</div>
                            <ul class="chalk-list" style="margin-bottom:12px;">
                                <li class="chalk-item">
                                    <a class="chalk-link" href="https://github.com/prowler-cloud/prowler/pull/10570" target="_blank">Prowler Contributor</a>
                                    <div class="chalk-subtext">Merged secrets detection check (PR #10570) on GitHub (13k+ stars) • Apr 2026</div>
                                </li>
                                <li class="chalk-item">
                                    <a class="chalk-link" href="https://www.kaggle.com/ajeevanyadav" target="_blank">Kaggle Titanic ML</a>
                                    <div class="chalk-subtext">Built Random Forest/Gradient Boosting ensemble model, ranked globally • Apr 2026</div>
                                </li>
                            </ul>

                            <div class="chalk-header">Education</div>
                            <ul class="chalk-list">
                                <li class="chalk-item">
                                    <strong>Lovely Professional University</strong>
                                    <div class="chalk-subtext">B.Tech CSE (CGPA: 7.04) • 2023 - Present</div>
                                </li>
                                <li class="chalk-item">
                                    <strong>Excellencia Junior College</strong>
                                    <div class="chalk-subtext">Intermediate (89.1%) • 2021 - 2023</div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Footer: Chalk Humor Ticker -->
                    <div class="chalk-footer">
                        <span>$ devops-chalk --version : v1.0.7</span>
                        <span style="color:rgba(255,180,100,0.9);">// Surviving AWS Free Tier since 2023</span>
                        <span>$ git commit -m "added chalk textures"</span>
                    </div>
                </div>
            </div>
        `;

        panel.appendChild(overlayEl);
    }

    const THRESHOLD = 0.97;
    let isActive = false;

    /**
     * Activate the resume chalkboard overlay
     */
    function activate() {
        if (isActive) return;
        isActive = true;

        if (!overlayEl) {
            injectOverlay();
        }

        if (overlayEl) {
            overlayEl.style.display = "block";
            overlayEl.style.pointerEvents = "auto";
            overlayEl.style.opacity = "0";
            overlayEl.style.transform = "none";
            overlayEl.style.transition = "opacity 0.4s ease-out";
            requestAnimationFrame(() => {
                overlayEl.style.opacity = "1";
            });
        }
    }

    /**
     * Deactivate the resume chalkboard overlay
     */
    function deactivate() {
        if (!isActive) return;
        isActive = false;

        if (overlayEl) {
            overlayEl.style.opacity = "0";
            overlayEl.style.transition = "opacity 0.3s ease-out";
            setTimeout(() => {
                if (!isActive && overlayEl) {
                    overlayEl.style.display = "none";
                    overlayEl.style.pointerEvents = "none";
                }
            }, 300);
        }
    }

    /**
     * Check scroll progress in desktop.js animation loop.
     */
    function checkProgress(progress) {
        if (progress >= THRESHOLD) {
            activate();
        } else {
            deactivate();
        }
    }

    // Expose public API
    window.ResumeUI = {
        checkProgress: checkProgress
    };
})();
