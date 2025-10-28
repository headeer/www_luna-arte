document.addEventListener("DOMContentLoaded", function () {
  const initialImageCount = 9;
  const loadMoreCount = 9;
  let currentImageCount = initialImageCount;

  const lazyLoadImages = () => {
    const lazyImages = document.querySelectorAll(".lazy");

    if ("IntersectionObserver" in window) {
      const lazyImageObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const lazyImage = entry.target;
              if (!lazyImage.src) {
                lazyImage.src = lazyImage.dataset.src;
                lazyImage.classList.remove("lazy");
                lazyImageObserver.unobserve(lazyImage);
              }
            }
          });
        }
      );

      lazyImages.forEach((image) => {
        lazyImageObserver.observe(image);
      });
    } else {
      // Fallback for browsers that do not support IntersectionObserver
      lazyImages.forEach((image) => {
        if (!image.src) {
          image.src = image.dataset.src;
          image.classList.remove("lazy");
        }
      });
    }
  };

  const showMoreImages = (buttonId, galleryId) => {
    const showMoreButton = document.getElementById(buttonId);
    const galleryElement = document.getElementById(galleryId);

    showMoreButton.addEventListener("click", async () => {
      const start = currentImageCount + 1;
      const end = currentImageCount + loadMoreCount;

      for (let i = start; i <= end; i++) {
        // Check if image exists before creating the element
        const response = await fetch(`assets/new/pircing/ucho%20(${i}).jpg`);
        if (response.ok) {
          const imgElement = document.createElement("a");
          imgElement.classList.add("carousel-row--img");
          imgElement.innerHTML = `<img width="435" height="580" class="hover-shadow lazy" alt="Piercing Ucho${i}" title="Piercing Ucho ${i}" data-src="assets/new/pircing/ucho%20(${i}).jpg" data-index="${
            i - 1
          }">`;
          galleryElement.appendChild(imgElement);
        } else {
          // If no more images exist, hide the button
          showMoreButton.style.display = "none";
          break;
        }
      }

      currentImageCount += loadMoreCount;

      lazyLoadImages();
      initializeImageClickEvents();
    });
  };

  const openModal = (modalId, modalContentId, index) => {
    const modal = document.getElementById(modalId);
    const modalContent = document.getElementById(modalContentId);

    if (modal && modalContent) {
      modalContent.innerHTML = "";

      for (let i = 1; i <= currentImageCount; i++) {
        const div = document.createElement("div");
        div.classList.add("my-slides");

        const img = document.createElement("img");
        img.src = `assets/new/pircing/ucho%20(${i}).jpg`;

        div.appendChild(img);
        modalContent.appendChild(div);

        if (i === index + 1) {
          div.style.display = "block";
        } else {
          div.style.display = "none";
        }
      }

      modal.style.display = "block";
    } else {
      console.error(`Modal or Modal Content with ID ${modalId} not found.`);
    }
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "none";
    } else {
      console.error(`Modal with ID ${modalId} not found.`);
    }
  };

  const showSlides = (modalContentId, index) => {
    const slides = document.querySelectorAll(`#${modalContentId} .my-slides`);
    const totalSlides = slides.length;

    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;

    slides.forEach((slide) => (slide.style.display = "none"));
    slides[index].style.display = "block";
  };

  let slideIndex = 0;

  const currentSlide = (modalContentId, index) => {
    slideIndex = index;
    showSlides(modalContentId, index);
  };

  const changeSlide = (modalContentId, n) => {
    currentSlide(modalContentId, (slideIndex += n));
  };

  document.querySelectorAll(".close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", (e) => {
      const modalId = e.target.closest(".modal").id;
      closeModal(modalId);
    });
  });

  document.querySelectorAll(".prev").forEach((prevBtn) => {
    prevBtn.addEventListener("click", (e) => {
      const modalContentId = e.target
        .closest(".modal")
        .querySelector(".modal-content").id;
      changeSlide(modalContentId, -1);
    });
  });

  document.querySelectorAll(".next").forEach((nextBtn) => {
    nextBtn.addEventListener("click", (e) => {
      const modalContentId = e.target
        .closest(".modal")
        .querySelector(".modal-content").id;
      changeSlide(modalContentId, 1);
    });
  });

  const initializeImageClickEvents = () => {
    document
      .querySelectorAll(".carousel-row--img img")
      .forEach((imgElement) => {
        imgElement.addEventListener("click", (e) => {
          e.preventDefault();
          const index = parseInt(imgElement.dataset.index, 10);
          openModal("myModal1", "modalContent1", index);
        });
      });
  };

  // Add data-index to initial images
  const addIndexToInitialImages = () => {
    document
      .querySelectorAll(".carousel-row--img img")
      .forEach((imgElement, index) => {
        imgElement.dataset.index = index;
      });
  };

  addIndexToInitialImages();

  showMoreImages("showMore1", "photoGallery1");
  lazyLoadImages();
  initializeImageClickEvents();
});
