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