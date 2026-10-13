const hotelSlider = document.querySelector(".hotel-slider");

function moveHotelSlider(direction) {

    const slides = hotelSlider.querySelectorAll(".hotel-slide");

    if (direction === "next") {

        hotelSlider.appendChild(slides[0]);

    } else {

        hotelSlider.prepend(slides[slides.length - 1]);

    }

}

/* ============================================================
   ABOUT EDITORIAL — MOUSE PARALLAX
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
    const aboutImage = document.querySelector(".about-editorial-image");
    const aboutFrame = document.querySelector(".about-editorial-frame");
    const aboutBadge = document.querySelector(".about-editorial-badge");

    if (!aboutImage) return;

    if (window.innerWidth > 768) {
        aboutImage.addEventListener("mousemove", function (event) {
            const rect = aboutImage.getBoundingClientRect();

            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            aboutImage.querySelector("img").style.transform =
                `scale(1.08) translate(${x * 12}px, ${y * 12}px)`;

            if (aboutFrame) {
                aboutFrame.style.transform =
                    `translate(${x * 5}px, ${y * 5}px)`;
            }

            if (aboutBadge) {
                aboutBadge.style.transform =
                    `translate(${x * -8}px, ${y * -8}px) rotate(${x * 3}deg)`;
            }
        });

        aboutImage.addEventListener("mouseleave", function () {
            aboutImage.querySelector("img").style.transform = "scale(1.02)";
            if (aboutFrame) aboutFrame.style.transform = "translate(0,0)";
            if (aboutBadge) aboutBadge.style.transform = "translate(0,0) rotate(0)";
        });
    }
});


/* NEXT BUTTON */

document
    .querySelector(".hotel-next")
    .addEventListener("click", function () {

        moveHotelSlider("next");

    });


/* PREVIOUS BUTTON */

document
    .querySelector(".hotel-prev")
    .addEventListener("click", function () {

        moveHotelSlider("prev");

    });

/* ============================================================
   EXPERIENCES — SCROLL REVEAL
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    const experienceCards =
        document.querySelectorAll(".experience-card");

    if (experienceCards.length > 0) {

        const observer = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("is-visible");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.15
            }
        );


        experienceCards.forEach(function (card) {

            observer.observe(card);

        });

    }



    /* ========================================================
       CUSTOM CURSOR
       ======================================================== */

    const cursor =
        document.getElementById("experienceCursor");


    if (
        cursor &&
        window.innerWidth > 767
    ) {

        document.addEventListener(
            "mousemove",
            function (event) {

                cursor.style.left =
                    event.clientX + "px";

                cursor.style.top =
                    event.clientY + "px";

            }
        );


        const media =
            document.querySelectorAll(
                ".experience-media"
            );


        media.forEach(function (item) {

            item.addEventListener(
                "mouseenter",
                function () {

                    cursor.classList.add("active");

                }
            );


            item.addEventListener(
                "mouseleave",
                function () {

                    cursor.classList.remove("active");

                }
            );

        });

    }

});

/* ============================================================
   FEATURED HOTELS — CINEMATIC SHOWCASE
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    const showcase = document.querySelector(".featured-showcase");

    if (!showcase) {
        return;
    }

    const frame = showcase.querySelector(".featured-showcase-frame");
    const media = showcase.querySelector(".featured-showcase-media");
    const draggable = showcase.querySelector(".featured-showcase-draggable");

    const currentCounter = showcase.querySelector(
        ".featured-showcase-counter-current"
    );

    const indexValue = showcase.querySelector(
        ".featured-showcase-index-value"
    );

    const locationValue = showcase.querySelector(
        ".featured-showcase-meta-location"
    );

    const categoryValue = showcase.querySelector(
        ".featured-showcase-meta-category"
    );

    const priceValue = showcase.querySelector(
        ".featured-showcase-price-amount"
    );

    const pricePer = showcase.querySelector(
        ".featured-showcase-price-per"
    );

    const coordsValue = showcase.querySelector(
        ".featured-showcase-coords"
    );

    const progress = showcase.querySelector(
        ".featured-showcase-progress"
    );

    const titleLines = showcase.querySelectorAll(
        ".featured-showcase-line-inner"
    );

    const navButtons = showcase.querySelectorAll(
        ".featured-showcase-nav-btn"
    );

    const nextButton = showcase.querySelector(
        ".featured-showcase-next"
    );

    /* ---------------------------------------------------------
       HOTEL DATA
       --------------------------------------------------------- */

    const hotels = [
        {
            name: "Taj",
            secondName: "Exotica",
            location: "Goa, India",
            category: "Luxury Beach Resort",
            price: "₹18,500",
            image: "images/Taj-Exotica.jpg",
            coords: "15.55° N — 73.75° E"
        },
        {
            name: "The Leela",
            secondName: "Palace",
            location: "New Delhi, India",
            category: "Royal Luxury Hotel",
            price: "₹22,000",
            image: "images/Leela-Palace.jpg",
            coords: "28.61° N — 77.21° E"
        },
        {
            name: "The",
            secondName: "Oberoi",
            location: "Mumbai, India",
            category: "Elegant City Hotel",
            price: "₹20,500",
            image: "images/Oberoi.jpg",
            coords: "19.07° N — 72.87° E"
        },
        {
            name: "ITC Grand",
            secondName: "Chola",
            location: "Chennai, India",
            category: "Grand Luxury Experience",
            price: "₹16,500",
            image: "images/Grand-Chola.jpg",
            coords: "13.08° N — 80.27° E"
        }
    ];

    let currentIndex = 0;
    let isAnimating = false;
    let autoplayTimer = null;
    let resumeTimer = null;

    /* ---------------------------------------------------------
       CREATE IMAGE SLIDES
       --------------------------------------------------------- */

    hotels.forEach(function (hotel, index) {

        const slide = document.createElement("div");

        slide.className = "featured-showcase-slide";

        if (index === 0) {
            slide.classList.add(
                "featured-showcase-slide--active"
            );
        }

        const parallax = document.createElement("div");

        parallax.className = "featured-showcase-parallax";

        const image = document.createElement("img");

        image.src = hotel.image;
        image.alt = hotel.name + " " + hotel.secondName;
        image.draggable = false;

        parallax.appendChild(image);
        slide.appendChild(parallax);
        frame.appendChild(slide);
    });

    const slides = showcase.querySelectorAll(
        ".featured-showcase-slide"
    );

    /* ---------------------------------------------------------
       SHOWCASE INIT
       --------------------------------------------------------- */

    showcase.classList.add(
        "featured-showcase--armed"
    );

    /* ---------------------------------------------------------
       UPDATE TITLE
       --------------------------------------------------------- */

    function updateTitle(hotel) {

        if (titleLines.length < 2) {
            return;
        }

        titleLines[0].textContent = hotel.name;
        titleLines[1].textContent = hotel.secondName;
    }

    /* ---------------------------------------------------------
       UPDATE HOTEL INFORMATION
       --------------------------------------------------------- */

    function updateHotelInfo(hotel, index) {

        currentCounter.textContent =
            String(index + 1).padStart(2, "0");

        indexValue.textContent =
            String(index + 1).padStart(2, "0");

        locationValue.textContent =
            hotel.location;

        categoryValue.textContent =
            hotel.category;

        priceValue.textContent =
            hotel.price;

        pricePer.textContent =
            "/ night";

        coordsValue.textContent =
            hotel.coords;

        updateTitle(hotel);
    }

    /* ---------------------------------------------------------
       UPDATE NAVIGATION
       --------------------------------------------------------- */

    function updateNavigation(index) {

        navButtons.forEach(function (button, buttonIndex) {

            const active =
                buttonIndex === index;

            button.classList.toggle(
                "featured-showcase-nav-btn--active",
                active
            );

            button.setAttribute(
                "aria-current",
                active ? "true" : "false"
            );
        });

        progress.style.setProperty(
            "--featured-showcase-progress",
            ((index + 1) / hotels.length).toFixed(2)
        );
    }

    /* ---------------------------------------------------------
       CINEMATIC SLIDE TRANSITION
       --------------------------------------------------------- */

    function changeSlide(newIndex, direction = 1) {

        if (isAnimating) {
            return;
        }

        if (newIndex === currentIndex) {
            return;
        }

        if (newIndex < 0) {
            newIndex = hotels.length - 1;
        }

        if (newIndex >= hotels.length) {
            newIndex = 0;
        }

        isAnimating = true;

        const oldSlide =
            slides[currentIndex];

        const newSlide =
            slides[newIndex];

        newSlide.classList.add(
            "featured-showcase-slide--active"
        );

        const oldImage =
            oldSlide.querySelector("img");

        const newImage =
            newSlide.querySelector("img");

        newSlide.style.zIndex = "3";
        oldSlide.style.zIndex = "2";

        newSlide.style.clipPath =
            direction > 0
                ? "inset(0 0 0 100%)"
                : "inset(0 100% 0 0)";

        newImage.style.transform =
            "scale(1.1)";

        requestAnimationFrame(function () {

            newSlide.style.transition =
                "clip-path 1s cubic-bezier(0.77,0,0.175,1)";

            newImage.style.transition =
                "transform 1.1s cubic-bezier(0.22,1,0.36,1)";

            newSlide.style.clipPath =
                "inset(0 0 0 0)";

            newImage.style.transform =
                "scale(1)";
        });

        /* Text transition */

        titleLines.forEach(function (line) {

            line.style.transition =
                "transform 0.55s cubic-bezier(0.22,1,0.36,1)";

            line.style.transform =
                "translateY(-110%)";
        });

        setTimeout(function () {

            updateHotelInfo(
                hotels[newIndex],
                newIndex
            );

            titleLines.forEach(function (line) {

                line.style.transition =
                    "none";

                line.style.transform =
                    "translateY(110%)";
            });

            requestAnimationFrame(function () {

                titleLines.forEach(function (line) {

                    line.style.transition =
                        "transform 0.75s cubic-bezier(0.22,1,0.36,1)";

                    line.style.transform =
                        "translateY(0)";
                });

            });

        }, 350);

        /* Finish */

        setTimeout(function () {

            oldSlide.classList.remove(
                "featured-showcase-slide--active"
            );

            oldSlide.style.zIndex = "";
            newSlide.style.zIndex = "";

            newSlide.style.transition = "";
            newSlide.style.clipPath = "";

            oldImage.style.transform = "";
            newImage.style.transition = "";
            newImage.style.transform = "";

            currentIndex = newIndex;

            updateNavigation(currentIndex);

            isAnimating = false;

        }, 1050);

        restartAutoplay();
    }

    /* ---------------------------------------------------------
       NEXT HOTEL
       --------------------------------------------------------- */

    function nextHotel() {

        changeSlide(
            currentIndex + 1,
            1
        );
    }

    /* ---------------------------------------------------------
       PREVIOUS HOTEL
       --------------------------------------------------------- */

    function previousHotel() {

        changeSlide(
            currentIndex - 1,
            -1
        );
    }

    /* ---------------------------------------------------------
       NAVIGATION BUTTONS
       --------------------------------------------------------- */

    navButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const index =
                    Number(button.dataset.index);

                const direction =
                    index > currentIndex
                        ? 1
                        : -1;

                changeSlide(
                    index,
                    direction
                );
            }
        );
    });

    /* ---------------------------------------------------------
       NEXT BUTTON
       --------------------------------------------------------- */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {
                nextHotel();
            }
        );
    }

    /* ---------------------------------------------------------
       KEYBOARD NAVIGATION
       --------------------------------------------------------- */

    media.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "ArrowRight") {

                event.preventDefault();
                nextHotel();

            } else if (event.key === "ArrowLeft") {

                event.preventDefault();
                previousHotel();
            }
        }
    );

    /* ---------------------------------------------------------
       DRAG / SWIPE
       --------------------------------------------------------- */

    let dragStartX = 0;
    let dragCurrentX = 0;
    let isDragging = false;

    media.addEventListener(
        "pointerdown",
        function (event) {

            dragStartX =
                event.clientX;

            dragCurrentX =
                event.clientX;

            isDragging = true;

            media.classList.add(
                "featured-showcase--grabbing"
            );

            try {
                media.setPointerCapture(
                    event.pointerId
                );
            } catch (error) {}
        }
    );

    media.addEventListener(
        "pointermove",
        function (event) {

            if (!isDragging) {
                return;
            }

            dragCurrentX =
                event.clientX;

            const distance =
                dragCurrentX - dragStartX;

            if (Math.abs(distance) > 15) {

                draggable.style.transform =
                    "translateX(" +
                    (distance * 0.08) +
                    "px)";
            }
        }
    );

    function finishDrag() {

        if (!isDragging) {
            return;
        }

        const distance =
            dragCurrentX - dragStartX;

        isDragging = false;

        media.classList.remove(
            "featured-showcase--grabbing"
        );

        draggable.style.transition =
            "transform 0.4s cubic-bezier(0.22,1,0.36,1)";

        draggable.style.transform =
            "translateX(0)";

        setTimeout(function () {

            draggable.style.transition = "";

        }, 400);

        if (Math.abs(distance) > 60) {

            if (distance < 0) {
                nextHotel();
            } else {
                previousHotel();
            }
        }
    }

    media.addEventListener(
        "pointerup",
        finishDrag
    );

    media.addEventListener(
        "pointercancel",
        finishDrag
    );

    media.addEventListener(
        "pointerleave",
        function () {

            if (isDragging) {
                finishDrag();
            }
        }
    );

    /* ---------------------------------------------------------
       MOUSE PARALLAX
       --------------------------------------------------------- */

    if (window.innerWidth > 767) {

        media.addEventListener(
            "mousemove",
            function (event) {

                const rect =
                    media.getBoundingClientRect();

                const x =
                    (event.clientX - rect.left) /
                    rect.width;

                const y =
                    (event.clientY - rect.top) /
                    rect.height;

                const moveX =
                    (x - 0.5) * 14;

                const moveY =
                    (y - 0.5) * 10;

                const activeSlide =
                    showcase.querySelector(
                        ".featured-showcase-slide--active"
                    );

                if (!activeSlide) {
                    return;
                }

                const parallax =
                    activeSlide.querySelector(
                        ".featured-showcase-parallax"
                    );

                if (parallax) {

                    parallax.style.transform =
                        "scale(1.045) translate(" +
                        moveX +
                        "px," +
                        moveY +
                        "px)";
                }
            }
        );

        media.addEventListener(
            "mouseleave",
            function () {

                const activeSlide =
                    showcase.querySelector(
                        ".featured-showcase-slide--active"
                    );

                if (!activeSlide) {
                    return;
                }

                const parallax =
                    activeSlide.querySelector(
                        ".featured-showcase-parallax"
                    );

                if (parallax) {

                    parallax.style.transition =
                        "transform 0.6s cubic-bezier(0.22,1,0.36,1)";

                    parallax.style.transform =
                        "scale(1.045)";

                    setTimeout(function () {

                        parallax.style.transition =
                            "";

                    }, 600);
                }
            }
        );
    }

    /* ---------------------------------------------------------
       AUTOPLAY
       --------------------------------------------------------- */

    function startAutoplay() {

        clearInterval(autoplayTimer);

        autoplayTimer =
            setInterval(function () {

                if (!document.hidden) {
                    nextHotel();
                }

            }, 6500);
    }

    function stopAutoplay() {

        clearInterval(
            autoplayTimer
        );
    }

    function restartAutoplay() {

        stopAutoplay();

        clearTimeout(
            resumeTimer
        );

        resumeTimer =
            setTimeout(function () {

                startAutoplay();

            }, 12000);
    }

    media.addEventListener(
        "mouseenter",
        stopAutoplay
    );

    media.addEventListener(
        "mouseleave",
        startAutoplay
    );

    showcase.addEventListener(
        "mouseenter",
        function () {
            stopAutoplay();
        }
    );

    showcase.addEventListener(
        "mouseleave",
        function () {
            startAutoplay();
        }
    );

    document.addEventListener(
        "visibilitychange",
        function () {

            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        }
    );

    /* ---------------------------------------------------------
       SCROLL REVEAL
       --------------------------------------------------------- */

    const observer =
        new IntersectionObserver(
            function (entries, observerInstance) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        showcase.classList.add(
                            "featured-showcase--in"
                        );

                        startAutoplay();

                        observerInstance.unobserve(
                            showcase
                        );
                    }
                });

            },
            {
                threshold: 0.15
            }
        );

    observer.observe(showcase);

    /* ---------------------------------------------------------
       INITIAL DATA
       --------------------------------------------------------- */

    updateHotelInfo(
        hotels[0],
        0
    );

    updateNavigation(0);

});

/* ============================================================
   LUXURY CONCIERGE CHAT
   ============================================================ */

(function () {

    const fab = document.getElementById("fab");
    const panel = document.getElementById("chatPanel");
    const headClose = document.getElementById("headClose");

    const teaser = document.getElementById("teaser");
    const teaserClose = document.getElementById("teaserClose");
    const teaserHi = document.getElementById("teaserHi");

    const form = document.getElementById("conciergeForm");
    const formWrap = document.getElementById("formWrap");

    const hint = document.getElementById("formHint");

    const submitBtn = document.getElementById("submitBtn");
    const submitLabel = document.getElementById("submitLabel");

    const success = document.getElementById("successState");

    const nameInput = document.getElementById("fName");
    const emailInput = document.getElementById("fEmail");
    const msgInput = document.getElementById("fMsg");

    const againBtn = document.getElementById("againBtn");


    /* Safety check */

    if (!fab || !panel || !form) {
        return;
    }


    let isOpen = false;
    let teaserDismissed = false;


    /* ============================================================
       TIME BASED GREETING
       ============================================================ */

    const hour = new Date().getHours();

    if (hour < 12) {

        teaserHi.textContent = "Good morning.";

    } else if (hour < 18) {

        teaserHi.textContent = "Good afternoon.";

    } else {

        teaserHi.textContent = "Good evening.";

    }


    /* ============================================================
       SHOW TEASER
       ============================================================ */

    setTimeout(function () {

        if (!isOpen && !teaserDismissed) {

            teaser.classList.add("show");

        }

    }, 2600);


    /* ============================================================
       HIDE TEASER
       ============================================================ */

    function hideTeaser(permanent) {

        teaser.classList.remove("show");

        if (permanent) {

            teaserDismissed = true;

        }

    }


    /* ============================================================
       OPEN / CLOSE CHAT
       ============================================================ */

    function setOpen(value) {

        isOpen = value;

        panel.classList.toggle("open", value);

        fab.classList.toggle("open", value);

        fab.setAttribute("aria-expanded", value);

        panel.setAttribute("aria-hidden", !value);


        if (value) {

            /* Remove notification */

            fab.classList.add("seen");

            hideTeaser(true);


            /* Focus name field on desktop */

            if (window.matchMedia("(pointer:fine)").matches) {

                setTimeout(function () {

                    nameInput.focus({
                        preventScroll: true
                    });

                }, 460);

            }

        } else {

            if (panel.contains(document.activeElement)) {

                fab.focus();

            }

        }

    }


    /* Floating button */

    fab.addEventListener("click", function () {

        setOpen(!isOpen);

    });


    /* Close button */

    headClose.addEventListener("click", function () {

        setOpen(false);

    });


    /* Teaser close */

    teaserClose.addEventListener("click", function () {

        hideTeaser(true);

    });


    /* ============================================================
       ESC KEY
       ============================================================ */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape" && isOpen) {

            setOpen(false);

        }

    });


    /* ============================================================
       CLICK OUTSIDE
       ============================================================ */

    document.addEventListener("pointerdown", function (event) {

        if (!isOpen) {
            return;
        }

        if (
            panel.contains(event.target) ||
            fab.contains(event.target)
        ) {
            return;
        }

        setOpen(false);

    });


    /* ============================================================
       FORM VALIDATION
       ============================================================ */

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    [nameInput, emailInput, msgInput].forEach(function (input) {

        input.addEventListener("input", function () {

            input
                .closest(".field")
                .classList.remove("invalid");

        });

    });


    /* ============================================================
       FORM SUBMIT
       ============================================================ */

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        hint.classList.remove("show");


        let valid = true;


        /* Name */

        if (!nameInput.value.trim()) {

            nameInput
                .closest(".field")
                .classList.add("invalid");

            valid = false;

        }


        /* Email */

        if (!emailRegex.test(emailInput.value.trim())) {

            emailInput
                .closest(".field")
                .classList.add("invalid");

            valid = false;

        }


        /* Validation failed */

        if (!valid) {

            hint.textContent =
                "Kindly enter your name and a valid email address.";

            void hint.offsetWidth;

            hint.classList.add("show");

            return;

        }


        /* ========================================================
           SENDING ANIMATION
           ======================================================== */

        submitBtn.classList.add("sending");

        submitLabel.textContent = "Sending";


        /* Front-end simulation */

        setTimeout(function () {

            const firstName =
                nameInput.value
                    .trim()
                    .split(/\s+/)[0];


            document.getElementById("successName").textContent =
                firstName;


            document.getElementById("successEmail").textContent =
                emailInput.value.trim();


            formWrap.classList.add("leave");


            setTimeout(function () {

                formWrap.hidden = true;

                success.hidden = false;


                requestAnimationFrame(function () {

                    requestAnimationFrame(function () {

                        success.classList.add("show");

                    });

                });

            }, 350);


        }, 900);

    });


    /* ============================================================
       SEND ANOTHER MESSAGE
       ============================================================ */

    againBtn.addEventListener("click", function () {

        success.classList.remove("show");


        setTimeout(function () {

            success.hidden = true;

            form.reset();


            document
                .querySelectorAll(".field.invalid")
                .forEach(function (field) {

                    field.classList.remove("invalid");

                });


            hint.classList.remove("show");

            submitBtn.classList.remove("sending");

            submitLabel.textContent = "Send inquiry";

            formWrap.hidden = false;


            requestAnimationFrame(function () {

                requestAnimationFrame(function () {

                    formWrap.classList.remove("leave");

                });

            });


            if (window.matchMedia("(pointer:fine)").matches) {

                nameInput.focus({
                    preventScroll: true
                });

            }

        }, 250);

    });


})();

