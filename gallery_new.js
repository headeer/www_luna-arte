document.addEventListener("DOMContentLoaded", function () {
  const initialImageCount = 9;
  const loadMoreCount = 9;

  const galleries = [
    {
      id: "photoGallery1",
      showMoreButton: "showMore1",
      modalId: "myModal1",
      modalContentId: "modalContent1",
      currentImageCount: initialImageCount,
      images: generateImageObjects("stylizacje", "stylizacja", 1, 102),
    },
    {
      id: "photoGallery2",
      showMoreButton: "showMore2",
      modalId: "myModal2",
      modalContentId: "modalContent2",
      currentImageCount: initialImageCount,
      images: generateImageObjects("tous", "tous", 1, 22),
    },
  ];

  function generateImageObjects(directory, filePrefix, start, end) {
    const images = [];
    for (let i = start; i <= end; i++) {
      images.push({
        alt: `${filePrefix} ${i}`,
        title: `${filePrefix} ${i}`,
        src: `assets/new/${directory}/${filePrefix}%20(${i}).jpg`,
      });
    }
    return images;
  }

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

  const showMoreImages = (gallery) => {
    const showMoreButton = document.getElementById(gallery.showMoreButton);
    const galleryElement = document.getElementById(gallery.id);

    showMoreButton.addEventListener("click", () => {
      const start = gallery.currentImageCount;
      const end = Math.min(
        gallery.currentImageCount + loadMoreCount,
        gallery.images.length
      );

      for (let i = start; i < end; i++) {
        const imgElement = document.createElement("a");
        imgElement.classList.add("carousel-row--img");
        imgElement.innerHTML = `<img width="435" height="580" class="hover-shadow lazy" alt="${gallery.images[i].alt}" title="${gallery.images[i].title}" data-src="${gallery.images[i].src}" data-index="${i}">`;
        galleryElement.appendChild(imgElement);
      }

      gallery.currentImageCount += loadMoreCount;

      lazyLoadImages();
      initializeImageClickEvents(gallery);

      // Remove "Show More" button if no more images to load
      if (gallery.currentImageCount >= gallery.images.length) {
        showMoreButton.style.display = "none";
      }
    });
  };

  const openModal = (modalId, modalContentId, index) => {
    const modal = document.getElementById(modalId);
    const modalContent = document.getElementById(modalContentId);
    const gallery = galleries.find((g) => g.modalId === modalId);

    if (modal && modalContent) {
      modalContent.innerHTML = "";

      gallery.images.slice(0, gallery.currentImageCount).forEach((image, i) => {
        const div = document.createElement("div");
        div.classList.add("my-slides");

        const img = document.createElement("img");
        img.src = image.src;

        div.appendChild(img);
        modalContent.appendChild(div);

        if (i === index) {
          div.style.display = "block";
        } else {
          div.style.display = "none";
        }
      });

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

  const initializeImageClickEvents = (gallery) => {
    const galleryElement = document.getElementById(gallery.id);
    galleryElement
      .querySelectorAll(".carousel-row--img img")
      .forEach((imgElement) => {
        imgElement.addEventListener("click", (e) => {
          e.preventDefault();
          const index = parseInt(imgElement.dataset.index, 10);
          openModal(gallery.modalId, gallery.modalContentId, index);
        });
      });
  };

  // Add data-index to initial images
  const addIndexToInitialImages = () => {
    galleries.forEach((gallery, galleryIndex) => {
      const galleryElement = document.getElementById(gallery.id);
      galleryElement
        .querySelectorAll(".carousel-row--img img")
        .forEach((imgElement, index) => {
          imgElement.dataset.index = index;
        });
    });
  };

  addIndexToInitialImages();

  galleries.forEach((gallery) => {
    showMoreImages(gallery);
    lazyLoadImages();
    initializeImageClickEvents(gallery);
  });
});
