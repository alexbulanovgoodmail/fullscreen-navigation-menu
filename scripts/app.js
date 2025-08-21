const DEFAULT_IMG = "./images/1.webp";
const body = document.querySelector("body");
const menu = document.querySelector(".menu");
const menuContent = document.querySelector(".menu__content");
const wrapper = document.querySelector(".wrapper");
const openLabel = document.querySelector("#menu-open");
const closeLabel = document.querySelector("#menu-close");
const socialLinks = document.querySelectorAll(".socials__link");
const navigationLinks = document.querySelectorAll(".navigation__link");
const menuImgContainer = document.querySelector(".menu__img-container");

const menuToggle = document.querySelector(".menu-toggle");

let isOpen = false;
let isAnimating = false;
let scrollOffset = 0;

navigationLinks.forEach((link) => {
  link.addEventListener("mouseover", function () {
    if (!isOpen || isAnimating) return;

    const imgSrc = link.getAttribute("data-img");
    if (!imgSrc) return;

    const previewImgs = menuImgContainer.querySelectorAll("img");

    if (
      previewImgs.length > 0 &&
      previewImgs[previewImgs.length - 1].src.endsWith(imgSrc)
    )
      return;

    const newPreviewImg = document.createElement("img");
    newPreviewImg.classList.add("menu__img");
    newPreviewImg.src = imgSrc;
    newPreviewImg.style.opacity = 0;
    newPreviewImg.style.transform = "scale(1.25) rotate(10deg)";

    menuImgContainer.appendChild(newPreviewImg);

    cleanupPreviewImages();

    gsap.to(newPreviewImg, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: 0.75,
      ease: "power2.out",
    });
  });
});

menuToggle.addEventListener("click", function () {
  if (!isOpen) openMenu();
  else closeMenu();
});

function openMenu() {
  if (isAnimating || isOpen) return;

  isAnimating = true;
  document.addEventListener("keydown", handleEscPress);
  menuContent.addEventListener("click", handleMenuContent);
  menuToggle.setAttribute("aria-expanded", true);
  animateMenuToggle(true);
  scrollLock();

  window.gsap.to(wrapper, {
    rotation: 10,
    x: 300,
    y: 450,
    scale: 1.5,
    duration: 1.25,
    ease: "power4.inOut",
  });

  window.gsap.to(menuContent, {
    rotation: 0,
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    duration: 1.25,
    ease: "power4.inOut",
  });

  window.gsap.to([navigationLinks, socialLinks], {
    y: 0,
    opacity: 1,
    duration: 1,
    delay: 0.75,
    stagger: 0.1,
    ease: "power3.out",
  });

  window.gsap.to(menu, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
    duration: 1.25,
    ease: "power4.inOut",
    onComplete: function () {
      isOpen = true;
      isAnimating = false;
    },
  });
}

function closeMenu() {
  if (isAnimating || !isOpen) return;

  isAnimating = true;

  gsap.to(wrapper, {
    rotation: 0,
    x: 0,
    y: 0,
    scale: 1,
    duration: 1.25,
    ease: "power4.inOut",
  });

  gsap.to(menuContent, {
    rotation: -15,
    x: -100,
    y: -100,
    scale: 1.5,
    opacity: 0.25,
    duration: 1.25,
    ease: "power4.inOut",
  });

  gsap.to(menu, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    duration: 1.25,
    ease: "power4.inOut",
    onComplete: function () {
      isOpen = false;
      isAnimating = false;
      gsap.to([navigationLinks, socialLinks], {
        y: "120%",
      });

      document.removeEventListener("keydown", handleEscPress);
      menuContent.removeEventListener("click", handleMenuContent);
      menuToggle.setAttribute("aria-expanded", false);
      scrollUnLock();
      resetPreviewImage();
    },
  });

  animateMenuToggle(false);
}

function animateMenuToggle(opening) {
  window.gsap.to(opening ? openLabel : closeLabel, {
    x: opening ? -5 : 5,
    y: opening ? -10 : 10,
    rotation: opening ? -5 : 5,
    opacity: 0,
    delay: 0.25,
    duration: 0.5,
    ease: "power2.inOut",
  });

  window.gsap.to(opening ? closeLabel : openLabel, {
    x: 0,
    y: 0,
    rotation: 0,
    opacity: 1,
    delay: 0.5,
    duration: 0.5,
    ease: "power2.inOut",
  });
}

function cleanupPreviewImages() {
  const previewImgs = menuImgContainer.querySelectorAll("img");

  if (previewImgs.length > 3) {
    for (let i = 0; i < previewImgs.length - 3; i++) {
      menuImgContainer.removeChild(previewImgs[i]);
    }
  }
}

function resetPreviewImage() {
  menuImgContainer.innerHTML = "";
  const defaultPreviewImg = document.createElement("img");
  defaultPreviewImg.src = DEFAULT_IMG;
  menuImgContainer.appendChild(defaultPreviewImg);
}

function handleEscPress(event) {
  if (event.key === "Escape" || event.key === "Esc") {
    closeMenu();
  }
}

function handleMenuContent(event) {
  const target = event.target;

  if (target.closest("a") && isOpen) {
    closeMenu();
  }
}

function scrollLock() {
  const documentElement = document.documentElement;

  scrollOffset = window.scrollY;
  const lockPaddingOffset = window.innerWidth - documentElement.offsetWidth;
  documentElement.style.cssText = `
		overflow: hidden;
		touch-action: none;
		padding-right: ${lockPaddingOffset}px;
    `;
  body.style.overflow = "hidden";
  const matches = document.querySelectorAll(".lock-padding");

  if (matches.length > 0) {
    matches.forEach((elem) => {
      elem.style.paddingRight = `${lockPaddingOffset}px`;
    });
  }

  documentElement.style.scrollBehavior = "unset";
}

function scrollUnLock() {
  const documentElement = document.documentElement;

  documentElement.style.cssText = "";
  window.scroll({ top: scrollOffset });
  document.documentElement.style.scrollBehavior = "";
  body.style.overflow = "auto";

  const matches = document.querySelectorAll(".lock-padding");
  if (matches.length > 0) {
    matches.forEach((elem) => {
      elem.style.paddingRight = "";
    });
  }
}
