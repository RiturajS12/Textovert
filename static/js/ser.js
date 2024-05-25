console.clear();

const ser_prsContainer = document.querySelector(".ser_prs");
const ser_prsContainerInner = document.querySelector(".ser_prs__inner");
const ser_prs = Array.from(document.querySelectorAll(".ser_pr"));
const overlay = document.querySelector(".overlay");

const applyOverlayMask = (e) => {
  const overlayEl = e.currentTarget;
  const x = e.pageX - ser_prsContainer.offsetLeft;
  const y = e.pageY - ser_prsContainer.offsetTop;

  overlayEl.style = `--opacity: 1; --x: ${x}px; --y:${y}px;`;
};

const createOverlayCta = (overlayser_pr, ctaEl) => {
  const overlayCta = document.createElement("div");
  overlayCta.classList.add("cta");
  overlayCta.textContent = ctaEl.textContent;
  overlayCta.setAttribute("aria-hidden", true);
  overlayser_pr.append(overlayCta);
};

const observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const ser_prIndex = ser_prs.indexOf(entry.target);
    let width = entry.borderBoxSize[0].inlineSize;
    let height = entry.borderBoxSize[0].blockSize;

    if (ser_prIndex >= 0) {
      overlay.children[ser_prIndex].style.width = `${width}px`;
      overlay.children[ser_prIndex].style.height = `${height}px`;
    }
  });
});

const initOverlayser_pr = (ser_prEl) => {
  const overlayser_pr = document.createElement("div");
  overlayser_pr.classList.add("ser_pr");
  createOverlayCta(overlayser_pr, ser_prEl.lastElementChild);
  overlay.append(overlayser_pr);
  observer.observe(ser_prEl);
};

ser_prs.forEach(initOverlayser_pr);
document.body.addEventListener("pointermove", applyOverlayMask);

const themes = [
            {
                background: "#1A1A2E",
                color: "#FFFFFF",
                primaryColor: "#0F3460"
            },
            {
                background: "#461220",
                color: "#FFFFFF",
                primaryColor: "#E94560"
            },
            {
                background: "#192A51",
                color: "#FFFFFF",
                primaryColor: "#967AA1"
            },
            {
                background: "#F7B267",
                color: "#000000",
                primaryColor: "#F4845F"
            },
            {
                background: "#F25F5C",
                color: "#000000",
                primaryColor: "#642B36"
            },
            {
                background: "#231F20",
                color: "#FFF",
                primaryColor: "#BB4430"
            }
        ];

        const setTheme = (theme) => {
            const root = document.querySelector(":root");
            root.style.setProperty("--background", theme.background);
            root.style.setProperty("--color", theme.color);
            root.style.setProperty("--primary-color", theme.primaryColor);
            root.style.setProperty("--glass-color", theme.glassColor);
        };

        const displayThemeButtons = () => {
            const btnContainer = document.querySelector(".theme-btn-container");
            themes.forEach((theme) => {
                const div = document.createElement("div");
                div.className = "theme-btn";
                div.style.cssText = `background: ${theme.background}; width: 25px; height: 25px`;
                btnContainer.appendChild(div);
                div.addEventListener("click", () => setTheme(theme));
            });
        };

        displayThemeButtons();