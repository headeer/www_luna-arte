// DOM elements
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const closeCur = document.querySelector(".close");
const modal = document.getElementById("myModal");
const modalContent = document.querySelector(".modal-content");
const numberText = document.querySelector(".my-slides--number");
const slides = Array.from(document.querySelectorAll(".my-slides"));
const hoverShadows = Array.from(document.querySelectorAll(".hover-shadow"));
const captionText = document.getElementById("caption");

// Variables
let slideIndex = 1;
let root = document.querySelector("html");

// Event listeners
prev.addEventListener("click", () => {
  if (slideIndex > 1) {
    plusSlides(-1);
  }
});

next.addEventListener("click", () => {
  plusSlides(1);
});

closeCur.addEventListener("click", () => {
  closeModal();
});

hoverShadows.forEach((el, i) => {
  el.addEventListener("click", () => {
    openModal();
    currentSlide(i + 1);
  });
});

window.addEventListener("resize", () => {
  slideIndex = 1;
  showSlides(slideIndex);
});

// Functions
function openModal() {
  root.classList.add("focus");
  modal.style.display = "flex";
  showAndClose();
  numberText.textContent = `${slideIndex} / ${slides.length}`;
}

function closeModal() {
  modal.style.display = "none";
  root.classList.remove("focus");
}

function plusSlides(n) {
  showSlides((slideIndex += n));
  numberText.textContent = `${slideIndex} / ${slides.length}`;
}

function currentSlide(n) {
  showSlides((slideIndex = n));
  numberText.textContent = `${slideIndex} / ${slides.length}`;
}

function showSlides(n) {
  if (n < 1) {
    slideIndex = slides.length;
  } else if (n > slides.length) {
    slideIndex = 1;
  }

  slides.forEach((slide) => {
    slide.style.display = "none";
  });

  slides[slideIndex - 1].style.display = "flex";
  showAndClose();
}

function showAndClose() {
  prev.style.display = slideIndex === 1 ? "none" : "flex";
  next.style.display = slideIndex === slides.length ? "none" : "flex";
}

// Initialization
showSlides(slideIndex);
