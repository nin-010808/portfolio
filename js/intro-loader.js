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
