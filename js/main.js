const introLoader = document.getElementById("intro-loader");
if (introLoader) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    introLoader.remove();
  } else {
    document.body.classList.add("intro-active");
    window.setTimeout(() => {
      introLoader.classList.add("is-leaving");
      window.setTimeout(() => {
        introLoader.remove();
        document.body.classList.remove("intro-active");
      }, 500);
    }, 2500);
  }
}

document.getElementById("year").textContent = new Date().getFullYear();

const caseStudies = {
  maba: {
    title: "Kabataang MABA",
    summary: "A youth group focused on helping kids in our barangay. I’m part of the group and value its community focus.",
    focus: "Community involvement and helping children in the barangay."
  },
  orvion: {
    title: "ORVION",
    summary: "I’m part of Orvion and value being involved with the community.",
    focus: "Member of Orvion, contributing to activities and initiatives."
  },
  portfolio: {
    label: "PROJECT NOTES",
    title: "Portfolio system",
    summary: "An evolving portfolio for bringing my background, interests, and learning into one place.",
    focusLabel: "Project focus",
    focus: "Practicing HTML, CSS, JavaScript, responsive design, and interface design."
  },
  campuscred: {
    label: "PROJECT NOTES",
    title: "CampusCred",
    summary: "CampusCred is a concept for verifying Batangas State University diplomas, transcripts, and certificates against blockchain records. It is a project concept, not a live verification service.",
    focusLabel: "Project focus",
    focus: "Credential verification for diplomas, transcripts, and certificates, using blockchain records as the verification reference."
  }
};

const caseStudyDialog = document.getElementById("case-study-dialog");
const caseStudyLabel = document.getElementById("case-study-label");
const caseStudyTitle = document.getElementById("case-study-title");
const caseStudySummary = document.getElementById("case-study-summary");
const caseStudyFocusLabel = document.getElementById("case-study-focus-label");
const caseStudyFocus = document.getElementById("case-study-focus");
document.querySelectorAll("[data-case-study]").forEach((button) => {
  button.addEventListener("click", () => {
    const study = caseStudies[button.dataset.caseStudy];
    if (!study) {
      throw new Error(`Unknown case study: ${button.dataset.caseStudy}`);
    }
    caseStudyLabel.textContent = study.label || "FIELD NOTE";
    caseStudyTitle.textContent = study.title;
    caseStudySummary.textContent = study.summary;
    caseStudyFocusLabel.textContent = study.focusLabel || "Involvement";
    caseStudyFocus.textContent = study.focus;
    caseStudyDialog.showModal();
  });
});
document.getElementById("case-study-close").addEventListener("click", () => caseStudyDialog.close());
caseStudyDialog.addEventListener("click", (event) => {
  if (event.target === caseStudyDialog) {
    caseStudyDialog.close();
  }
});

const workGrid = document.getElementById("work-grid");
const workViewButtons = document.querySelectorAll("[data-work-view]");
workViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.workView;
    workGrid.dataset.view = view;
    workViewButtons.forEach((viewButton) => {
      viewButton.setAttribute("aria-pressed", String(viewButton === button));
    });
  });
});

const sectionLinks = document.querySelectorAll("[data-section-link]");
const observedSections = Array.from(sectionLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const setActiveSection = (sectionId) => {
  sectionLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${sectionId}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};
sectionLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveSection(link.getAttribute("href").slice(1));
  });
});
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSections = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (!visibleSections.length) return;
    setActiveSection(visibleSections[0].target.id);
  }, { rootMargin: "-25% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75] });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

const waveSvgNamespace = "http://www.w3.org/2000/svg";
const sectionWavePaths = Array.from(document.querySelectorAll(".system-section"), (section) => {
  const svg = document.createElementNS(waveSvgNamespace, "svg");
  svg.classList.add("section-wave");
  svg.setAttribute("viewBox", "0 0 1200 96");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const primary = document.createElementNS(waveSvgNamespace, "path");
  primary.classList.add("section-wave__primary");
  const secondary = document.createElementNS(waveSvgNamespace, "path");
  secondary.classList.add("section-wave__secondary");
  svg.append(primary, secondary);
  section.prepend(svg);

  return { primary, secondary };
});

const createWavePath = (phase, baseline) => {
  const segmentCount = 24;
  const points = Array.from({ length: segmentCount + 1 }, (_, index) => {
    const progress = index / segmentCount;
    return {
      x: progress * 1200,
      y: baseline + Math.sin(progress * Math.PI * 2 - phase) * 32
    };
  });
  let path = `M${points[0].x} ${points[0].y}`;

  for (let index = 0; index < segmentCount; index++) {
    const previous = points[Math.max(0, index - 1)];
    const current = points[index];
    const next = points[index + 1];
    const following = points[Math.min(segmentCount, index + 2)];
    const controlOneX = current.x + (next.x - previous.x) / 6;
    const controlOneY = current.y + (next.y - previous.y) / 6;
    const controlTwoX = next.x - (following.x - current.x) / 6;
    const controlTwoY = next.y - (following.y - current.y) / 6;
    path += ` C${controlOneX} ${controlOneY} ${controlTwoX} ${controlTwoY} ${next.x} ${next.y}`;
  }

  return path;
};

const drawSectionWaves = (phase) => {
  sectionWavePaths.forEach(({ primary, secondary }) => {
    primary.setAttribute("d", createWavePath(phase, 42));
    secondary.setAttribute("d", createWavePath(phase, 50));
  });
};

const waveMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
let waveAnimationFrame = 0;
let waveAnimationStart = 0;
const animateSectionWaves = (time) => {
  if (waveMotionPreference.matches) return;
  if (!waveAnimationStart) waveAnimationStart = time;
  const phase = ((time - waveAnimationStart) / 6500) * Math.PI * 2;
  drawSectionWaves(phase);
  waveAnimationFrame = window.requestAnimationFrame(animateSectionWaves);
};
const updateSectionWaveMotion = () => {
  window.cancelAnimationFrame(waveAnimationFrame);
  waveAnimationStart = 0;
  if (waveMotionPreference.matches) {
    drawSectionWaves(0);
    return;
  }
  waveAnimationFrame = window.requestAnimationFrame(animateSectionWaves);
};

drawSectionWaves(0);
updateSectionWaveMotion();
waveMotionPreference.addEventListener("change", updateSectionWaveMotion);

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });
  document.querySelectorAll("main > .system-section").forEach((section) => {
    section.classList.add("scroll-reveal");
    revealObserver.observe(section);
  });
}

const aboutDialog = document.getElementById("about-dialog");
const photoDialog = document.getElementById("photo-dialog");
const openAbout = (event) => {
  event.preventDefault();
  aboutDialog.showModal();
};

document.getElementById("about-open").addEventListener("click", openAbout);
document.getElementById("about-close").addEventListener("click", () => aboutDialog.close());

document.getElementById("photo-open").addEventListener("click", () => photoDialog.showModal());
document.getElementById("photo-close").addEventListener("click", () => photoDialog.close());
photoDialog.addEventListener("click", (event) => {
  if (event.target === photoDialog) {
    photoDialog.close();
  }
});

const javascriptSkill = document.getElementById("javascript-skill");
const javascriptInfo = document.getElementById("javascript-info");
javascriptSkill.addEventListener("click", () => {
  const expanded = javascriptSkill.getAttribute("aria-expanded") === "true";
  javascriptSkill.setAttribute("aria-expanded", String(!expanded));
  javascriptInfo.hidden = expanded;
});

document.getElementById("quick-message").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("message-name").value.trim();
  const message = document.getElementById("message-body").value.trim();
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}`);
  window.location.href = `mailto:emmanueldelmundoedm08@gmail.com?subject=${subject}&body=${body}`;
});

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeLabel = document.getElementById("theme-label");
const themeColor = document.querySelector('meta[name="theme-color"]');

const updateThemeControl = (theme) => {
  const isLight = theme === "light";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  themeIcon.textContent = isLight ? "☀" : "☾";
  themeLabel.textContent = isLight ? "Dark" : "Light";
  themeColor.setAttribute("content", isLight ? "#fff8ed" : "#171522");
};

updateThemeControl(document.documentElement.dataset.theme);
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
  updateThemeControl(nextTheme);
});