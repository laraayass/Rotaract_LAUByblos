const filterButtons = document.querySelectorAll(".com-container button");
const cards = document.querySelectorAll(".card-list .card-item");

const normalize = (text) => text.trim().toLowerCase();

const filters = {
  all: [],
  cs: ["community service", "cs"],
  pd: ["professional development", "pd"],
  finance: ["finance", "fn"],
  iu: ["international understanding", "iu"],
  pi: ["public image", "pi"],
  cls: ["club service", "cls"],
};

// Past vs Future projects toggle
const pastProjsRadio = document.getElementById("pastprojs");
const futureProjsRadio = document.getElementById("futureprojs");
const container = document.querySelector(".container");
const comContainer = document.querySelector(".com-container");
const futureMessage = document.querySelector(".future-message");
const futureContainer = document.querySelector(".future-container");

function toggleProjectsView() {
  if (futureProjsRadio.checked) {
    // Show future projects, hide past projects and filters
    container.style.display = "none";
    comContainer.style.display = "none";
    futureMessage.style.display = "none";
    if (futureContainer) {
      futureContainer.style.display = "block";
    }
    localStorage.setItem("projectsView", "future");
  } else {
    // Show past projects and filters, hide future projects
    container.style.display = "block";
    comContainer.style.display = "flex";
    futureMessage.style.display = "none";
    if (futureContainer) {
      futureContainer.style.display = "none";
    }
    localStorage.setItem("projectsView", "past");
  }
}

if (pastProjsRadio && futureProjsRadio) {
  // Always default to upcoming projects on page load
  futureProjsRadio.checked = true;
  pastProjsRadio.checked = false;

  pastProjsRadio.addEventListener("change", toggleProjectsView);
  futureProjsRadio.addEventListener("change", toggleProjectsView);
  // Initialize view on page load
  toggleProjectsView();
}

if (filterButtons.length && cards.length) {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isAllButton = btn.dataset.name === "All";

      if (isAllButton) {
        // If clicking All, deactivate all others and only keep All active
        filterButtons.forEach((b) => {
          if (b.dataset.name === "All") {
            b.classList.add("active");
          } else {
            b.classList.remove("active");
          }
        });
        // Show all cards
        cards.forEach((card) => {
          card.style.display = "";
        });
      } else {
        // If clicking a category button, remove All's active state
        const allBtn = Array.from(filterButtons).find(
          (b) => b.dataset.name === "All",
        );
        allBtn.classList.remove("active");

        btn.classList.toggle("active");

        const activeTargets = Array.from(filterButtons)
          .filter((b) => b.classList.contains("active"))
          .flatMap((b) => filters[normalize(b.dataset.name || "")] || []);

        cards.forEach((card) => {
          const badges = Array.from(card.querySelectorAll(".badge"));
          const badgeTexts = badges.map((b) => normalize(b.textContent || ""));
          const show =
            activeTargets.length === 0 ||
            badgeTexts.some((t) => activeTargets.includes(t));
          card.style.display = show ? "" : "none";
        });

        // If no category buttons are active, reactivate All button
        const hasActiveCategory = Array.from(filterButtons)
          .filter((b) => b.dataset.name !== "All")
          .some((b) => b.classList.contains("active"));

        if (!hasActiveCategory) {
          allBtn.classList.add("active");
          cards.forEach((card) => {
            card.style.display = "";
          });
        }
      }
    });
  });
}

// Image lightbox functionality with gallery support
const cardImages = document.querySelectorAll(".card-list .card-image");
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = `
  <span class="lightbox-close">&times;</span>
  <span class="lightbox-arrow lightbox-prev">&#10094;</span>
  <span class="lightbox-arrow lightbox-next">&#10095;</span>
  <img src="" alt="" class="lightbox-image">
  <div class="lightbox-counter"></div>
`;
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector(".lightbox-image");
const lightboxClose = lightbox.querySelector(".lightbox-close");
const lightboxPrev = lightbox.querySelector(".lightbox-prev");
const lightboxNext = lightbox.querySelector(".lightbox-next");
const lightboxCounter = lightbox.querySelector(".lightbox-counter");

let currentGallery = [];
let currentIndex = 0;

function updateLightbox() {
  if (currentGallery.length > 0) {
    lightboxImg.src = currentGallery[currentIndex];
    lightboxCounter.textContent = `${currentIndex + 1} / ${
      currentGallery.length
    }`;

    // Show/hide arrows and counter based on gallery size
    if (currentGallery.length > 1) {
      lightboxPrev.style.display = "block";
      lightboxNext.style.display = "block";
      lightboxCounter.style.display = "block";
    } else {
      lightboxPrev.style.display = "none";
      lightboxNext.style.display = "none";
      lightboxCounter.style.display = "none";
    }
  }
}

cardImages.forEach((img) => {
  img.addEventListener("click", (e) => {
    e.preventDefault();

    // Check if image has a gallery attribute
    const galleryData = img.getAttribute("data-gallery");
    if (galleryData) {
      try {
        currentGallery = JSON.parse(galleryData);
      } catch (e) {
        currentGallery = [img.src];
      }
    } else {
      currentGallery = [img.src];
    }

    currentIndex = 0;
    updateLightbox();
    lightbox.classList.add("active");
  });
});

lightboxClose.addEventListener("click", () => {
  lightbox.classList.remove("active");
});

lightboxPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex =
    (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  updateLightbox();
});

lightboxNext.addEventListener("click", (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % currentGallery.length;
  updateLightbox();
});

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("active");
  }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "ArrowLeft") {
    lightboxPrev.click();
  } else if (e.key === "ArrowRight") {
    lightboxNext.click();
  } else if (e.key === "Escape") {
    lightbox.classList.remove("active");
  }
});

// main section - numbers
const counters = document.querySelectorAll(".numbers span");
const numbersContainer = document.querySelector(".numbers");

let activated = false;

window.addEventListener("scroll", () => {
  if (
    pageYOffset >
      numbersContainer.offsetTop - numbersContainer.offsetHeight - 200 &&
    activated === false
  ) {
    counters.forEach((counter) => {
      counter.innerText = 0;

      const target = parseInt(counter.dataset.count);
      const duration = 3000; // 3 seconds
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out function: progress^3 gradually slows down
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        counter.innerText = current;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      }
      requestAnimationFrame(updateCount);
      activated = true;
    });
  } else if (
    pageYOffset <
      numbersContainer.offsetTop - numbersContainer.offsetHeight - 500 ||
    (pageYOffset === 0 && activated === true)
  ) {
    counters.forEach((counter) => {
      counter.innerText = 0;
    });
    activated = false;
  }
});

// FAQ section - accordion
const FAQData = [
  {
    question: "How do I become a member?",
    answer: [
      "⁠Lead 1 to 2 projects.",
      "Attend 70% of the meetings.",
      "Attend the Rotaract Academy.",
    ],
  },
  {
    question: "What does leading a project mean?",
    answer: [
      "Leading a project is not doing the whole project alone.",
      "You get to choose which committee the project is part of and how to execute it.",
      "Most importantly, you get the support of the director and board.",
    ],
  },
  {
    question: "Is joining the club time consuming?",
    answer: [
      "It depends on how many committees you are part of and how many projects you are attending.",
      "You have the choice of joining from 1 to 3 committees.",
      "The board and directors are part of all committees, so they have bigger responsibilities and it takes up more of their time.",
    ],
  },
  {
    question: "What happens after graduation?",
    answer: [
      "You can join a community based Rotaract club depending on where you live or the city nearest to you.",
      "If you continue as a masters or med student, you can stay as a member in the university club.",
    ],
  },
  {
    question: "What does rotaract mean?",
    answer: [
      "A Rotaract club is Rotary sponsored and have people at the age of 18 and above that want to make an impact in their community while having fun and networking.",
    ],
  },
];

const FAQContainer = document.querySelector(".faq-container");

const removeAllExpanded = () => {
  const questionContainers = document.querySelectorAll(
    ".faq-container .question-container",
  );

  questionContainers.forEach((q) => {
    q.classList.remove("expanded");
    const answerContainer = q.querySelector(".answer-container");
    answerContainer.style.maxHeight = "0";
  });
};

const displayFAQ = () => {
  FAQData.forEach((q) => {
    const answerHTML = q.answer
      .map(
        (a) => `<div class="answer">
        <span class="answer-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="w-5 h-5"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        ${a}
      </div>`,
      )
      .join("");

    const html = `<div class="question">
          ${q.question}
          <span class="question-icon"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </span>
        </div>

        <div class="answer-container">
          ${answerHTML}
        </div>`;

    const questionContainer = document.createElement("div");
    questionContainer.classList.add("question-container");
    questionContainer.innerHTML = html;

    FAQContainer.appendChild(questionContainer);

    const question = questionContainer.querySelector(".question");

    question.addEventListener("click", () => {
      if (!questionContainer.classList.contains("expanded")) {
        removeAllExpanded();
      }

      questionContainer.classList.toggle("expanded");
      const isExpanded = questionContainer.classList.contains("expanded");

      const answerContainer =
        questionContainer.querySelector(".answer-container");
      const contentHeight = answerContainer.scrollHeight;
      answerContainer.style.maxHeight = isExpanded ? `${contentHeight}px` : "0";
    });
  });
};

displayFAQ();

// Committee image click handler
console.log("Script loaded - looking for committee items");
const items = document.querySelectorAll(".committee-item");
console.log("Found " + items.length + " committee items");

items.forEach((item, index) => {
  console.log("Setting up click handler for item " + index);
  item.addEventListener("click", function () {
    console.log("Item " + index + " clicked!");

    // Close all
    items.forEach((i) => i.classList.remove("active"));

    // Open this one
    this.classList.add("active");
  });
});

// Click outside to close
document.addEventListener("click", function (e) {
  if (!e.target.closest(".committee-item")) {
    items.forEach((item) => item.classList.remove("active"));
  }
});

// Scroll animation for rotary circles
const observeCircles = () => {
  const circlesContainer = document.querySelector(".rotary-circles");
  if (!circlesContainer) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(circlesContainer);
};

observeCircles();

// Gallery Navigation - Infinite Carousel
const initGallery = () => {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  const container = gallery.querySelector(".gallery-images");
  const leftArrow = gallery.querySelector(".left-arrow");
  const rightArrow = gallery.querySelector(".right-arrow");
  const dotsContainer = gallery.querySelector(".gallery-dots");

  // Get original images
  const originalImages = Array.from(
    container.querySelectorAll(".gallery-image"),
  );
  const totalImages = originalImages.length;

  // Clone images for infinite loop - add clones at start and end
  const clonedStart = originalImages.map((img) => img.cloneNode(true));
  const clonedEnd = originalImages.map((img) => img.cloneNode(true));

  clonedStart.reverse().forEach((clone) => {
    clone.classList.remove("center");
    container.insertBefore(clone, container.firstChild);
  });

  clonedEnd.forEach((clone) => {
    clone.classList.remove("center");
    container.appendChild(clone);
  });

  const allImages = container.querySelectorAll(".gallery-image");
  let currentIndex = totalImages; // Start at first real image (index 0 of original)

  // Create dots
  originalImages.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("gallery-dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index + totalImages));
    dotsContainer.appendChild(dot);
  });

  const dots = gallery.querySelectorAll(".gallery-dot");

  const applySelection = () => {
    // Update center styling - set center class FIRST
    allImages.forEach((img) => {
      img.classList.remove("center");
      img.classList.remove("active");
    });
    allImages[currentIndex].classList.add("center");

    // Update dots
    const actualIndex =
      (currentIndex - totalImages + totalImages) % totalImages;
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === actualIndex);
    });
  };

  const updateGallery = (skipAnimation = false) => {
    applySelection();

    // Scroll animation
    const currentImage = allImages[currentIndex];
    const containerWidth = container.clientWidth;
    const imageWidth = currentImage.offsetWidth;
    const imageLeft = currentImage.offsetLeft;

    // Position to center current image (left + right images visible)
    const scrollPos = imageLeft - (containerWidth - imageWidth) / 2;

    if (skipAnimation) {
      container.scrollLeft = scrollPos;
    } else {
      container.scrollTo({
        left: scrollPos,
        behavior: "smooth",
      });
    }
  };

  const getClosestIndexToCenter = () => {
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    let closestIndex = currentIndex;
    let closestDistance = Infinity;

    allImages.forEach((img, index) => {
      const rect = img.getBoundingClientRect();
      const imgCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - imgCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const checkAndResetPosition = () => {
    if (currentIndex >= totalImages * 2 || currentIndex < totalImages) {
      const actualIndex =
        (currentIndex - totalImages + totalImages) % totalImages;
      const targetIndex = totalImages + actualIndex;

      const currentImage = allImages[currentIndex];
      const targetImage = allImages[targetIndex];

      if (currentImage && targetImage) {
        const delta = targetImage.offsetLeft - currentImage.offsetLeft;
        container.scrollLeft += delta;
      }

      currentIndex = targetIndex;
      applySelection();
    }
  };

  const goToSlide = (index) => {
    currentIndex = index;
    updateGallery();
  };

  const nextSlide = () => {
    currentIndex++;
    updateGallery();
    setTimeout(checkAndResetPosition, 500);
  };

  const prevSlide = () => {
    currentIndex--;
    updateGallery();
    setTimeout(checkAndResetPosition, 500);
  };

  // Event listeners
  allImages.forEach((img, index) => {
    img.addEventListener("click", () => goToSlide(index));
  });

  leftArrow.addEventListener("click", prevSlide);
  rightArrow.addEventListener("click", nextSlide);

  let scrollEndTimer = null;
  container.addEventListener(
    "scroll",
    () => {
      if (scrollEndTimer) clearTimeout(scrollEndTimer);

      const closestIndex = getClosestIndexToCenter();
      if (closestIndex !== currentIndex) {
        currentIndex = closestIndex;
        applySelection();
      }

      scrollEndTimer = setTimeout(() => {
        checkAndResetPosition();
        updateGallery();
      }, 120);
    },
    { passive: true },
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  // Initial render - delay to ensure DOM is ready
  setTimeout(() => {
    applySelection();
    updateGallery(true);
  }, 100);
};

initGallery();


