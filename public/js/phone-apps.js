/* ============================================
   Phone Apps — All 7 Mini-App Implementations
   ============================================ */

(function () {
    "use strict";

    // Shared photo album storage
    window.__phoneAlbum = window.__phoneAlbum || [];

    /* ─────────────────────────────────────────
       1. Gmail App
       ───────────────────────────────────────── */
    const GmailApp = {
        mount(container) {
            container.innerHTML = `
                <div style="background:#1a1a1a;min-height:100%;font-family:sans-serif;">
                    <div style="background:#c5221f;padding:12px 14px;display:flex;align-items:center;gap:8px;">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="#FFFFFF"/></svg>
                        <span style="color:#fff;font-size:13px;font-weight:600;">Gmail</span>
                    </div>
                    <div style="padding:8px 10px;border-bottom:1px solid #333;">
                        <div style="color:#aaa;font-size:10px;">jeevanyadav2008@gmail.com</div>
                    </div>
                    <div style="padding:6px;">
                        <div class="gmail-email-card" style="background:#2a2a2a;border-radius:8px;padding:12px;margin:6px 0;cursor:pointer;border:1px solid #3a3a3a;transition:background 0.15s;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                <span style="color:#e8e8e8;font-size:12px;font-weight:600;">Jeevan Yadav</span>
                                <span style="color:#888;font-size:9px;">Now</span>
                            </div>
                            <div style="color:#fff;font-size:11px;font-weight:600;margin-bottom:4px;">Let's Connect! 🤝</div>
                            <div style="color:#999;font-size:10px;line-height:1.3;">I'd love to hear from you. Whether it's a project idea, collaboration, or just a hello — reach out anytime!</div>
                        </div>
                        <div style="background:#2a2a2a;border-radius:8px;padding:12px;margin:6px 0;border:1px solid #3a3a3a;">
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                                <span style="color:#e8e8e8;font-size:12px;font-weight:600;">Portfolio Bot</span>
                                <span style="color:#888;font-size:9px;">Today</span>
                            </div>
                            <div style="color:#fff;font-size:11px;font-weight:600;margin-bottom:4px;">Welcome to my Portfolio!</div>
                            <div style="color:#999;font-size:10px;line-height:1.3;">Thanks for visiting. Explore my work and feel free to get in touch.</div>
                        </div>
                    </div>
                    <div style="padding:10px;text-align:center;">
                        <a href="mailto:jeevanyadav2008@gmail.com" target="_blank" style="display:inline-block;background:#c5221f;color:#fff;padding:10px 24px;border-radius:20px;text-decoration:none;font-size:11px;font-weight:600;">
                            ✉ Send Email
                        </a>
                    </div>
                </div>
            `;
        },
        unmount() {}
    };

    /* ─────────────────────────────────────────
       2. GitHub App
       ───────────────────────────────────────── */
    const GitHubApp = {
        mount(container) {
            container.innerHTML = `
                <div style="background:#0d1117;min-height:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#c9d1d9;font-size:12px;line-height:1.5;">
                    <!-- GitHub Header Navigation -->
                    <div style="background:#161b22;padding:8px 12px;border-bottom:1px solid #30363d;display:flex;align-items:center;justify-content:space-between;">
                        <div style="display:flex;align-items:center;gap:8px;">
                            <svg viewBox="0 0 16 16" width="18" height="18" fill="#f0f6fc"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                            <span style="font-weight:600;color:#f0f6fc;font-size:13px;">GitHub</span>
                        </div>
                        <a href="https://github.com/Jeevan-88" target="_blank" style="color:#58a6ff;text-decoration:none;font-size:11px;font-weight:600;">Open App</a>
                    </div>

                    <div style="padding:12px;">
                        <!-- Profile Card -->
                        <div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:8px 0;">
                            <div style="width:72px;height:72px;border-radius:50%;background:#1d222b;border:2px solid #30363d;position:relative;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.3);margin-bottom:8px;display:flex;align-items:center;justify-content:center;">
                                <img src="assets/profile/founder.png" alt="Avatar" style="width:100%;height:100%;object-fit:cover;">
                            </div>
                            <div style="font-size:16px;font-weight:700;color:#f0f6fc;">Avula Jeevan Yadav</div>
                            <div style="font-size:12px;color:#8b949e;margin-top:1px;">Jeevan-88</div>
                        </div>

                        <!-- Readme Quick Card -->
                        <div style="background:#161b22;border:1px solid #30363d;border-radius:6px;padding:12px;margin:8px 0 12px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
                            <div style="display:flex;align-items:center;gap:6px;font-size:10px;color:#8b949e;margin-bottom:8px;border-bottom:1px solid #21262d;padding-bottom:6px;">
                                <span>Jeevan-88 / README.md</span>
                            </div>
                            <div style="font-size:14px;font-weight:700;color:#f0f6fc;margin-bottom:6px;">Hi 👋, I'm Jeevan</div>
                            <div style="color:#c9d1d9;font-size:10.5px;line-height:1.4;">
                                Cloud & DevOps engineer focused on AWS, automation, and building production-ready systems.
                            </div>
                            <!-- Social Connect Links -->
                            <div style="margin-top:10px;display:flex;gap:8px;align-items:center;">
                                <span style="font-size:9px;color:#8b949e;font-weight:600;">Connect:</span>
                                <a href="https://www.linkedin.com/in/jeevan8" target="_blank" style="background:#0a66c2;color:#fff;padding:2px 6px;border-radius:4px;text-decoration:none;font-size:9px;font-weight:700;display:inline-flex;align-items:center;gap:3px;">
                                    <span>in</span> LinkedIn
                                </a>
                                <a href="mailto:jeevanyadav2008@gmail.com" style="background:#ea4335;color:#fff;padding:2px 6px;border-radius:4px;text-decoration:none;font-size:9px;font-weight:700;display:inline-flex;align-items:center;gap:3px;">
                                    <span>✉</span> Gmail
                                </a>
                            </div>
                        </div>

                        <!-- Achievements Section -->
                        <div style="margin-bottom:14px;">
                            <div style="font-size:11px;font-weight:600;color:#f0f6fc;margin-bottom:6px;">Achievements</div>
                            <div style="display:flex;gap:8px;">
                                <div style="background:#161b22;border:1px solid #30363d;border-radius:6px;padding:6px 10px;display:flex;align-items:center;gap:6px;flex:1;">
                                    <div style="width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg,#ff758c,#ff7eb3);display:flex;align-items:center;justify-content:center;font-size:10px;box-shadow:0 2px 4px rgba(0,0,0,0.2);">Y</div>
                                    <div style="font-size:9px;font-weight:600;color:#f0f6fc;line-height:1.2;">YOLO<br><span style="font-size:8px;font-weight:400;color:#8b949e;">Quick merge</span></div>
                                </div>
                                <div style="background:#161b22;border:1px solid #30363d;border-radius:6px;padding:6px 10px;display:flex;align-items:center;gap:6px;flex:1;">
                                    <div style="width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg,#84fab0,#8fd3f4);display:flex;align-items:center;justify-content:center;font-size:10px;box-shadow:0 2px 4px rgba(0,0,0,0.2);">🦈</div>
                                    <div style="font-size:9px;font-weight:600;color:#f0f6fc;line-height:1.2;">Pull Shark<br><span style="font-size:8px;font-weight:400;color:#8b949e;">PR contributor</span></div>
                                </div>
                            </div>
                        </div>

                        <!-- Languages and Tools Grid -->
                        <div style="margin-bottom:14px;">
                            <div style="font-size:11px;font-weight:600;color:#f0f6fc;margin-bottom:6px;">Languages & Tools</div>
                            <div style="display:flex;flex-wrap:wrap;gap:4px;">
                                <span style="background:#21262d;border:1px solid #30363d;color:#c9d1d9;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;">AWS</span>
                                <span style="background:#21262d;border:1px solid #30363d;color:#c9d1d9;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;">Kubernetes</span>
                                <span style="background:#21262d;border:1px solid #30363d;color:#c9d1d9;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;">Docker</span>
                                <span style="background:#21262d;border:1px solid #30363d;color:#c9d1d9;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;">Terraform</span>
                                <span style="background:#21262d;border:1px solid #30363d;color:#c9d1d9;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;">Linux</span>
                                <span style="background:#21262d;border:1px solid #30363d;color:#c9d1d9;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;">Python</span>
                                <span style="background:#21262d;border:1px solid #30363d;color:#c9d1d9;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;">JavaScript</span>
                                <span style="background:#21262d;border:1px solid #30363d;color:#c9d1d9;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;">Java</span>
                                <span style="background:#21262d;border:1px solid #30363d;color:#c9d1d9;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;">Nginx</span>
                                <span style="background:#21262d;border:1px solid #30363d;color:#c9d1d9;padding:2px 6px;border-radius:4px;font-size:9px;font-weight:600;">Git</span>
                            </div>
                        </div>

                        <!-- Repositories -->
                        <div style="font-size:11px;font-weight:600;color:#f0f6fc;margin-bottom:8px;">Repositories</div>
                        <div style="display:flex;flex-direction:column;gap:8px;">
                            <div style="background:#161b22;border:1px solid #30363d;border-radius:6px;padding:10px;box-shadow:0 1px 3px rgba(0,0,0,0.15);">
                                <div style="display:flex;justify-content:space-between;align-items:center;">
                                    <a href="https://github.com/Jeevan-88/PortfolioJeevan" target="_blank" style="color:#58a6ff;font-size:12px;font-weight:600;text-decoration:none;">PortfolioJeevan</a>
                                    <span style="font-size:8px;background:#21262d;color:#8b949e;border:1px solid #30363d;padding:1px 5px;border-radius:10px;font-weight:500;">Public</span>
                                </div>
                                <div style="color:#8b949e;font-size:9px;margin-top:4px;line-height:1.3;">Interactive portfolio with scroll-driven animations</div>
                                <div style="display:flex;align-items:center;gap:12px;margin-top:8px;font-size:9px;color:#8b949e;">
                                    <span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#f1e05a;"></span>JavaScript</span>
                                </div>
                            </div>
                            <div style="background:#161b22;border:1px solid #30363d;border-radius:6px;padding:10px;box-shadow:0 1px 3px rgba(0,0,0,0.15);">
                                <div style="display:flex;justify-content:space-between;align-items:center;">
                                    <a href="https://github.com/Jeevan-88/Cloud-Sentry-Alpha" target="_blank" style="color:#58a6ff;font-size:12px;font-weight:600;text-decoration:none;">Cloud-Sentry-Alpha</a>
                                    <span style="font-size:8px;background:#21262d;color:#8b949e;border:1px solid #30363d;padding:1px 5px;border-radius:10px;font-weight:500;">Public</span>
                                </div>
                                <div style="color:#8b949e;font-size:9px;margin-top:4px;line-height:1.3;">Cloud security and compliance auditing utility</div>
                                <div style="display:flex;align-items:center;gap:12px;margin-top:8px;font-size:9px;color:#8b949e;">
                                    <span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#3572A5;"></span>Python</span>
                                </div>
                            </div>
                            <div style="background:#161b22;border:1px solid #30363d;border-radius:6px;padding:10px;box-shadow:0 1px 3px rgba(0,0,0,0.15);">
                                <div style="display:flex;justify-content:space-between;align-items:center;">
                                    <a href="https://github.com/Jeevan-88/DSA-Practice" target="_blank" style="color:#58a6ff;font-size:12px;font-weight:600;text-decoration:none;">DSA-Practice</a>
                                    <span style="font-size:8px;background:#21262d;color:#8b949e;border:1px solid #30363d;padding:1px 5px;border-radius:10px;font-weight:500;">Public</span>
                                </div>
                                <div style="color:#8b949e;font-size:9px;margin-top:4px;line-height:1.3;">Daily DSA problem solving journey | Placement Preparation 2026</div>
                                <div style="display:flex;align-items:center;gap:12px;margin-top:8px;font-size:9px;color:#8b949e;">
                                    <span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#b07219;"></span>Java</span>
                                </div>
                            </div>
                            <div style="background:#161b22;border:1px solid #30363d;border-radius:6px;padding:10px;box-shadow:0 1px 3px rgba(0,0,0,0.15);">
                                <div style="display:flex;justify-content:space-between;align-items:center;">
                                    <a href="https://github.com/Jeevan-88/terraform-basic-assignment" target="_blank" style="color:#58a6ff;font-size:12px;font-weight:600;text-decoration:none;">terraform-basic-assignment</a>
                                    <span style="font-size:8px;background:#21262d;color:#8b949e;border:1px solid #30363d;padding:1px 5px;border-radius:10px;font-weight:500;">Public</span>
                                </div>
                                <div style="display:flex;align-items:center;gap:12px;margin-top:8px;font-size:9px;color:#8b949e;">
                                    <span style="display:inline-flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;border-radius:50%;background:#844FBA;"></span>HCL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        unmount() {}
    };

    /* ─────────────────────────────────────────
       3. LinkedIn App
       ───────────────────────────────────────── */
    const LinkedInApp = {
        mount(container) {
            container.innerHTML = `
                <div style="background:#1d2226;min-height:100%;font-family:-apple-system,system-ui,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue','Fira Sans',Ubuntu,Oxygen,sans-serif;color:#e1e3e6;padding-bottom:20px;font-size:12px;line-height:1.4;">
                    <!-- Cover Banner -->
                    <div style="height:70px;background:#0a0d12;position:relative;overflow:hidden;border-bottom:1px solid #2f3437;display:flex;align-items:center;justify-content:center;padding:0 8px;text-align:center;">
                        <div style="font-size:7.5px;color:#a8abb0;font-weight:700;letter-spacing:0.5px;line-height:1.3;text-transform:uppercase;">
                            AVULA JEEVAN YADAV<br>
                            <span style="font-size:5.5px;font-weight:400;opacity:0.85;">Cloud & DevOps Enthusiast | AWS | Linux | Docker | CI/CD</span>
                        </div>
                    </div>
                    
                    <!-- Profile Card Area -->
                    <div style="padding:0 12px;position:relative;margin-top:-28px;">
                        <div style="width:58px;height:58px;border-radius:50%;background:#1d2226;border:3px solid #1d2226;box-shadow:0 0 0 1px #5c6065;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#2d3845;box-shadow: 0 0 12px rgba(100,160,255,0.15);">
                            <img src="assets/profile/founder.png" alt="Avatar" style="width:100%;height:100%;object-fit:cover;">
                        </div>
                        
                        <div style="margin-top:8px;">
                            <div style="display:flex;align-items:center;gap:4px;">
                                <span style="font-size:15px;font-weight:600;color:#fff;">Avula Jeevan Yadav</span>
                                <span style="font-size:8px;color:#8b949e;background:#282e33;padding:1px 4px;border-radius:3px;font-weight:500;">He/Him</span>
                            </div>
                            <div style="font-size:10.5px;color:#eceef0;margin-top:4px;line-height:1.3;font-weight:400;">
                                Cloud & DevOps | AWS | Linux | Docker | CI/CD | Infra Automation
                            </div>
                        </div>

                        <!-- University Info Link -->
                        <div style="display:flex;align-items:center;gap:6px;margin-top:10px;padding:8px 0;border-top:1px solid #2f3437;border-bottom:1px solid #2f3437;">
                            <div style="width:16px;height:16px;border-radius:2px;background:#ea7424;color:#fff;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:bold;flex-shrink:0;">LPU</div>
                            <span style="font-size:9.5px;color:#c9d1d9;font-weight:500;">Lovely Professional University</span>
                        </div>

                        <!-- Location & Connections -->
                        <div style="margin-top:10px;font-size:9.5px;color:#8b949e;line-height:1.3;">
                            <div>Phagwara, Punjab, India</div>
                            <div style="color:#70b5f9;font-weight:600;margin-top:2px;">15 connections</div>
                        </div>

                        <!-- Action Buttons -->
                        <div style="margin-top:12px;display:flex;gap:6px;">
                            <a href="https://www.linkedin.com/in/jeevan8" target="_blank" style="flex:1;background:#0a66c2;color:#fff;padding:6px 0;border-radius:16px;text-align:center;text-decoration:none;font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;transition:background 0.1s;">
                                Connect
                            </a>
                            <a href="mailto:jeevanyadav2008@gmail.com" style="flex:1;border:1px solid #0a66c2;color:#70b5f9;padding:5px 0;border-radius:16px;text-align:center;text-decoration:none;font-size:11px;font-weight:600;display:flex;align-items:center;justify-content:center;transition:background 0.1s;">
                                Message
                            </a>
                        </div>
                    </div>

                    <!-- About Card -->
                    <div style="margin-top:12px;background:#1b1f23;padding:12px;border-top:1px solid #2f3437;border-bottom:1px solid #2f3437;">
                        <div style="font-size:12px;font-weight:600;color:#fff;margin-bottom:6px;">About</div>
                        <div style="color:#c9d1d9;font-size:10px;line-height:1.45;">
                            Cloud & DevOps enthusiast with a passion for designing automated, resilient architectures on AWS. Proficient in Linux systems administration, Docker containerization, and building robust CI/CD pipelines to streamline software delivery.
                        </div>
                    </div>

                    <!-- Experience Card -->
                    <div style="margin-top:12px;background:#1b1f23;padding:12px;border-top:1px solid #2f3437;border-bottom:1px solid #2f3437;">
                        <div style="font-size:12px;font-weight:600;color:#fff;margin-bottom:10px;">Experience</div>
                        
                        <div style="display:flex;gap:10px;margin-bottom:12px;">
                            <div style="width:24px;height:24px;background:#38434f;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:bold;flex-shrink:0;">Dev</div>
                            <div>
                                <div style="font-size:11px;font-weight:600;color:#fff;">Cloud & DevOps Developer</div>
                                <div style="font-size:9.5px;color:#c9d1d9;margin-top:1px;">Personal Practice & Projects</div>
                                <div style="font-size:9px;color:#8b949e;margin-top:2px;">2024 - Present</div>
                                <div style="font-size:9.5px;color:#aaa;margin-top:4px;line-height:1.3;">Designed cloud infrastructures using Terraform, Docker, and AWS services. Built automated pipelines to deploy microservices.</div>
                            </div>
                        </div>

                        <div style="display:flex;gap:10px;border-top:1px solid #282e33;padding-top:10px;">
                            <div style="width:24px;height:24px;background:#ea7424;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:9px;color:#fff;font-weight:bold;flex-shrink:0;">LPU</div>
                            <div>
                                <div style="font-size:11px;font-weight:600;color:#fff;">Student Developer</div>
                                <div style="font-size:9.5px;color:#c9d1d9;margin-top:1px;">Lovely Professional University</div>
                                <div style="font-size:9px;color:#8b949e;margin-top:2px;">2022 - Present</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        unmount() {}
    };

    /* ─────────────────────────────────────────
       4. Camera App
       ───────────────────────────────────────── */
    const CameraApp = {
        _stream: null,
        _video: null,

        mount(container) {
            const self = this;
            container.innerHTML = `
                <div style="background:#000;height:100%;display:flex;flex-direction:column;position:relative;">
                    <video autoplay playsinline muted style="flex:1;width:100%;object-fit:cover;background:#111;"></video>
                    <div style="position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;transition:opacity 0.1s;" class="cam-flash"></div>
                    <div style="position:absolute;bottom:0;left:0;right:0;padding:12px;display:flex;justify-content:center;align-items:center;background:linear-gradient(transparent,rgba(0,0,0,0.7));">
                        <button class="cam-shutter" style="width:52px;height:52px;border-radius:50%;border:3px solid #fff;background:rgba(255,255,255,0.2);cursor:pointer;transition:transform 0.1s;">
                            <div style="width:40px;height:40px;border-radius:50%;background:#fff;margin:auto;"></div>
                        </button>
                    </div>
                    <div style="position:absolute;top:8px;right:8px;color:#fff;font-size:9px;background:rgba(0,0,0,0.5);padding:3px 8px;border-radius:10px;" class="cam-count"></div>
                </div>
            `;

            self._video = container.querySelector("video");
            const flash = container.querySelector(".cam-flash");
            const shutter = container.querySelector(".cam-shutter");
            const countEl = container.querySelector(".cam-count");

            countEl.textContent = `📷 ${window.__phoneAlbum.length}`;

            // Start camera
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
                    .then((stream) => {
                        self._stream = stream;
                        if (self._video) {
                            self._video.srcObject = stream;
                        }
                    })
                    .catch(() => {
                        container.querySelector("video").style.display = "none";
                        container.querySelector("div").insertAdjacentHTML("afterbegin",
                            '<div style="flex:1;display:flex;align-items:center;justify-content:center;color:#888;font-size:11px;text-align:center;padding:20px;">Camera access denied.<br>Allow camera in browser settings.</div>'
                        );
                    });
            }

            // Shutter button
            shutter.addEventListener("click", () => {
                if (!self._video || !self._video.videoWidth) return;

                // Flash
                flash.style.opacity = "1";
                setTimeout(() => { flash.style.opacity = "0"; }, 120);

                // Capture
                const canvas = document.createElement("canvas");
                canvas.width = self._video.videoWidth;
                canvas.height = self._video.videoHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(self._video, 0, 0);

                // Apply vintage filter
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    // Sepia tone
                    data[i]     = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
                    data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
                    data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
                    // Add warm tint
                    data[i] = Math.min(255, data[i] + 15);
                    data[i + 1] = Math.min(255, data[i + 1] + 5);
                    // Add grain noise
                    const noise = (Math.random() - 0.5) * 30;
                    data[i] = Math.min(255, Math.max(0, data[i] + noise));
                    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
                    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
                }
                ctx.putImageData(imageData, 0, 0);

                // Vignette overlay
                const gradient = ctx.createRadialGradient(
                    canvas.width / 2, canvas.height / 2, canvas.width * 0.3,
                    canvas.width / 2, canvas.height / 2, canvas.width * 0.7
                );
                gradient.addColorStop(0, "rgba(0,0,0,0)");
                gradient.addColorStop(1, "rgba(0,0,0,0.5)");
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                window.__phoneAlbum.push(dataUrl);
                countEl.textContent = `📷 ${window.__phoneAlbum.length}`;

                // Shutter animation
                shutter.style.transform = "scale(0.9)";
                setTimeout(() => { shutter.style.transform = "scale(1)"; }, 100);
            });
        },

        unmount() {
            if (this._stream) {
                this._stream.getTracks().forEach((t) => t.stop());
                this._stream = null;
            }
            this._video = null;
        }
    };

    /* ─────────────────────────────────────────
       5. Album App
       ───────────────────────────────────────── */
    const AlbumApp = {
        _container: null,

        mount(container) {
            this._container = container;
            this._render();
        },

        _render() {
            const photos = window.__phoneAlbum;
            if (!photos.length) {
                this._container.innerHTML = `
                    <div style="background:#1a1a1a;min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;">
                        <div style="font-size:36px;margin-bottom:10px;opacity:0.3;">🖼</div>
                        <div style="color:#888;font-size:11px;line-height:1.4;">No photos yet.<br>Take some with the Camera app!</div>
                    </div>
                `;
                return;
            }

            let html = '<div style="background:#1a1a1a;min-height:100%;padding:6px;">';
            html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">';
            photos.forEach((url, i) => {
                html += `<div class="album-thumb" data-idx="${i}" style="cursor:pointer;border-radius:4px;overflow:hidden;aspect-ratio:1;">
                    <img src="${url}" style="width:100%;height:100%;object-fit:cover;" />
                </div>`;
            });
            html += "</div></div>";
            this._container.innerHTML = html;

            // Click handlers for full view
            this._container.querySelectorAll(".album-thumb").forEach((el) => {
                el.addEventListener("click", () => {
                    const idx = parseInt(el.dataset.idx);
                    this._showFull(idx);
                });
            });
        },

        _showFull(idx) {
            const url = window.__phoneAlbum[idx];
            this._container.innerHTML = `
                <div style="background:#000;min-height:100%;display:flex;flex-direction:column;">
                    <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:8px;">
                        <img src="${url}" style="max-width:100%;max-height:100%;border-radius:4px;" />
                    </div>
                    <div style="padding:10px;display:flex;gap:8px;justify-content:center;">
                        <button class="album-back-btn" style="background:#333;color:#fff;border:none;padding:8px 16px;border-radius:16px;font-size:10px;cursor:pointer;">← Back</button>
                        <a href="${url}" download="vintage_photo_${idx}.jpg" style="background:#4CAF50;color:#fff;padding:8px 16px;border-radius:16px;font-size:10px;text-decoration:none;cursor:pointer;">⬇ Download</a>
                    </div>
                </div>
            `;
            this._container.querySelector(".album-back-btn").addEventListener("click", () => this._render());
        },

        unmount() {
            this._container = null;
        }
    };

    /* ─────────────────────────────────────────
       6. Calculator App
       ───────────────────────────────────────── */
    const CalculatorApp = {
        _display: "",
        _result: "0",
        _container: null,

        mount(container) {
            this._container = container;
            this._display = "";
            this._result = "0";
            this._render();
        },

        _render() {
            const buttons = [
                ["C", "±", "%", "÷"],
                ["7", "8", "9", "×"],
                ["4", "5", "6", "−"],
                ["1", "2", "3", "+"],
                ["0", ".", "="]
            ];

            let html = `<div style="background:#000;min-height:100%;display:flex;flex-direction:column;padding:8px;">`;
            // Display
            html += `<div style="flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-end;padding:8px 12px;min-height:60px;">`;
            html += `<div style="color:#888;font-size:10px;min-height:14px;word-break:break-all;">${this._display}</div>`;
            html += `<div style="color:#fff;font-size:28px;font-weight:300;margin-top:4px;">${this._result}</div>`;
            html += `</div>`;
            // Buttons
            html += `<div style="display:flex;flex-direction:column;gap:5px;">`;
            buttons.forEach((row) => {
                html += `<div style="display:flex;gap:5px;">`;
                row.forEach((btn) => {
                    const isOp = ["÷", "×", "−", "+", "="].includes(btn);
                    const isFunc = ["C", "±", "%"].includes(btn);
                    const isZero = btn === "0";
                    const bg = isOp ? "#ff9500" : isFunc ? "#a5a5a5" : "#333";
                    const color = isFunc ? "#000" : "#fff";
                    const flex = isZero ? "flex:2;" : "flex:1;";
                    html += `<button class="calc-btn" data-val="${btn}" style="${flex}padding:12px 0;border:none;border-radius:50px;background:${bg};color:${color};font-size:16px;font-weight:400;cursor:pointer;font-family:sans-serif;">${btn}</button>`;
                });
                html += `</div>`;
            });
            html += `</div></div>`;

            this._container.innerHTML = html;

            // Button handlers
            this._container.querySelectorAll(".calc-btn").forEach((btn) => {
                btn.addEventListener("click", () => this._onPress(btn.dataset.val));
            });
        },

        _onPress(val) {
            if (val === "C") {
                this._display = "";
                this._result = "0";
            } else if (val === "±") {
                if (this._result !== "0") {
                    this._result = this._result.startsWith("-")
                        ? this._result.slice(1)
                        : "-" + this._result;
                }
            } else if (val === "%") {
                this._result = String(parseFloat(this._result) / 100);
            } else if (val === "=") {
                try {
                    const expr = this._display
                        .replace(/×/g, "*")
                        .replace(/÷/g, "/")
                        .replace(/−/g, "-");
                    // Safe evaluate using Function constructor
                    const fn = new Function("return " + expr);
                    const res = fn();
                    this._result = String(Math.round(res * 1e10) / 1e10);
                    this._display = "";
                } catch {
                    this._result = "Error";
                    this._display = "";
                }
            } else if (["÷", "×", "−", "+"].includes(val)) {
                this._display += this._result + " " + val + " ";
                this._result = "0";
            } else {
                // Digit or dot
                if (this._result === "0" && val !== ".") {
                    this._result = val;
                } else {
                    this._result += val;
                }
            }
            this._render();
        },

        unmount() {
            this._container = null;
        }
    };

    /* ─────────────────────────────────────────
       7. Snake Game
       ───────────────────────────────────────── */
    const SnakeApp = {
        _raf: null,
        _container: null,
        _canvas: null,
        _ctx: null,
        _snake: [],
        _food: null,
        _dir: { x: 1, y: 0 },
        _nextDir: { x: 1, y: 0 },
        _score: 0,
        _gameOver: false,
        _lastTick: 0,
        _tickInterval: 120,
        _gridSize: 15,
        _cellSize: 0,
        _keyHandler: null,
        _touchStartX: 0,
        _touchStartY: 0,
        _touchHandler: null,
        _touchEndHandler: null,

        mount(container) {
            this._container = container;
            this._showStart();
        },

        _showStart() {
            this._container.innerHTML = `
                <div style="background:#111;min-height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;">
                    <div style="font-size:36px;margin-bottom:8px;">🐍</div>
                    <div style="color:#8BC34A;font-size:16px;font-weight:700;margin-bottom:4px;">Snake Game</div>
                    <div style="color:#888;font-size:9px;margin-bottom:16px;">Use arrow keys or swipe to play</div>
                    <button class="snake-start" style="background:#8BC34A;color:#000;border:none;padding:10px 28px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;">Play</button>
                </div>
            `;
            this._container.querySelector(".snake-start").addEventListener("click", () => this._startGame());
        },

        _startGame() {
            const self = this;
            self._container.innerHTML = `
                <div style="background:#111;height:100%;display:flex;flex-direction:column;">
                    <div style="display:flex;justify-content:space-between;padding:6px 10px;color:#8BC34A;font-size:11px;font-weight:600;">
                        <span>🐍 Snake</span>
                        <span class="snake-score">Score: 0</span>
                    </div>
                    <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:4px;">
                        <canvas class="snake-canvas" style="border-radius:4px;background:#1a1a1a;"></canvas>
                    </div>
                </div>
            `;

            self._canvas = self._container.querySelector(".snake-canvas");
            self._ctx = self._canvas.getContext("2d");

            // Size canvas to fit container
            const wrapper = self._canvas.parentElement;
            const size = Math.min(wrapper.clientWidth - 8, wrapper.clientHeight - 8);
            self._canvas.width = size;
            self._canvas.height = size;
            self._cellSize = Math.floor(size / self._gridSize);

            // Init game state
            const mid = Math.floor(self._gridSize / 2);
            self._snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
            self._dir = { x: 1, y: 0 };
            self._nextDir = { x: 1, y: 0 };
            self._score = 0;
            self._gameOver = false;
            self._lastTick = 0;
            self._spawnFood();

            // Key controls
            self._keyHandler = (e) => {
                const key = e.key;
                if (key === "ArrowUp" && self._dir.y === 0) { self._nextDir = { x: 0, y: -1 }; e.preventDefault(); }
                else if (key === "ArrowDown" && self._dir.y === 0) { self._nextDir = { x: 0, y: 1 }; e.preventDefault(); }
                else if (key === "ArrowLeft" && self._dir.x === 0) { self._nextDir = { x: -1, y: 0 }; e.preventDefault(); }
                else if (key === "ArrowRight" && self._dir.x === 0) { self._nextDir = { x: 1, y: 0 }; e.preventDefault(); }
            };
            document.addEventListener("keydown", self._keyHandler);

            // Touch controls
            self._touchHandler = (e) => {
                self._touchStartX = e.touches[0].clientX;
                self._touchStartY = e.touches[0].clientY;
            };
            self._touchEndHandler = (e) => {
                const dx = e.changedTouches[0].clientX - self._touchStartX;
                const dy = e.changedTouches[0].clientY - self._touchStartY;
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 20 && self._dir.x === 0) self._nextDir = { x: 1, y: 0 };
                    else if (dx < -20 && self._dir.x === 0) self._nextDir = { x: -1, y: 0 };
                } else {
                    if (dy > 20 && self._dir.y === 0) self._nextDir = { x: 0, y: 1 };
                    else if (dy < -20 && self._dir.y === 0) self._nextDir = { x: 0, y: -1 };
                }
            };
            self._canvas.addEventListener("touchstart", self._touchHandler, { passive: true });
            self._canvas.addEventListener("touchend", self._touchEndHandler, { passive: true });

            // Game loop
            const loop = (timestamp) => {
                if (self._gameOver) return;
                self._raf = requestAnimationFrame(loop);
                if (timestamp - self._lastTick < self._tickInterval) return;
                self._lastTick = timestamp;
                self._tick();
                self._draw();
            };
            self._raf = requestAnimationFrame(loop);
        },

        _spawnFood() {
            let pos;
            do {
                pos = {
                    x: Math.floor(Math.random() * this._gridSize),
                    y: Math.floor(Math.random() * this._gridSize)
                };
            } while (this._snake.some((s) => s.x === pos.x && s.y === pos.y));
            this._food = pos;
        },

        _tick() {
            this._dir = { ...this._nextDir };
            const head = {
                x: this._snake[0].x + this._dir.x,
                y: this._snake[0].y + this._dir.y
            };

            // Wall collision
            if (head.x < 0 || head.x >= this._gridSize || head.y < 0 || head.y >= this._gridSize) {
                this._endGame();
                return;
            }

            // Self collision
            if (this._snake.some((s) => s.x === head.x && s.y === head.y)) {
                this._endGame();
                return;
            }

            this._snake.unshift(head);

            // Food collision
            if (head.x === this._food.x && head.y === this._food.y) {
                this._score++;
                const scoreEl = this._container.querySelector(".snake-score");
                if (scoreEl) scoreEl.textContent = `Score: ${this._score}`;
                this._spawnFood();
                // Speed up slightly
                this._tickInterval = Math.max(60, this._tickInterval - 2);
            } else {
                this._snake.pop();
            }
        },

        _draw() {
            const ctx = this._ctx;
            const cs = this._cellSize;
            ctx.fillStyle = "#1a1a1a";
            ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

            // Draw grid lines
            ctx.strokeStyle = "#222";
            ctx.lineWidth = 0.5;
            for (let i = 0; i <= this._gridSize; i++) {
                ctx.beginPath();
                ctx.moveTo(i * cs, 0);
                ctx.lineTo(i * cs, this._gridSize * cs);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i * cs);
                ctx.lineTo(this._gridSize * cs, i * cs);
                ctx.stroke();
            }

            // Draw food
            ctx.fillStyle = "#f44336";
            ctx.beginPath();
            ctx.arc(this._food.x * cs + cs / 2, this._food.y * cs + cs / 2, cs / 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Draw snake
            this._snake.forEach((seg, i) => {
                const brightness = Math.max(40, 100 - i * 3);
                ctx.fillStyle = `hsl(120, 60%, ${brightness}%)`;
                ctx.beginPath();
                ctx.roundRect(seg.x * cs + 1, seg.y * cs + 1, cs - 2, cs - 2, 3);
                ctx.fill();
            });
        },

        _endGame() {
            this._gameOver = true;
            if (this._raf) cancelAnimationFrame(this._raf);

            // Draw game over overlay
            const ctx = this._ctx;
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
            ctx.fillStyle = "#fff";
            ctx.font = "bold 16px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("Game Over!", this._canvas.width / 2, this._canvas.height / 2 - 12);
            ctx.font = "12px sans-serif";
            ctx.fillText(`Score: ${this._score}`, this._canvas.width / 2, this._canvas.height / 2 + 8);

            // Play again button
            const wrapper = this._container.querySelector("div");
            if (wrapper) {
                const btn = document.createElement("div");
                btn.style.cssText = "text-align:center;padding:8px;";
                btn.innerHTML = `<button style="background:#8BC34A;color:#000;border:none;padding:8px 24px;border-radius:16px;font-size:11px;font-weight:600;cursor:pointer;">Play Again</button>`;
                wrapper.appendChild(btn);
                btn.querySelector("button").addEventListener("click", () => this._startGame());
            }
        },

        unmount() {
            if (this._raf) {
                cancelAnimationFrame(this._raf);
                this._raf = null;
            }
            if (this._keyHandler) {
                document.removeEventListener("keydown", this._keyHandler);
                this._keyHandler = null;
            }
            this._gameOver = true;
            this._container = null;
        }
    };

    /* ─────────────────────────────────────────
       Export all apps
       ───────────────────────────────────────── */
    window.PhoneApps = {
        gmail: GmailApp,
        github: GitHubApp,
        linkedin: LinkedInApp,
        camera: CameraApp,
        album: AlbumApp,
        calculator: CalculatorApp,
        snake: SnakeApp
    };
})();
