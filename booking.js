/* ============================================================
   LUXURY HOTEL EXPLORER
   BOOKING PAGE — JAVASCRIPT
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    const bookingForm = document.getElementById("bookingForm");

    if (!bookingForm) return;


    /* ========================================================
       ELEMENTS
       ======================================================== */

    const checkIn = document.getElementById("checkIn");
    const checkOut = document.getElementById("checkOut");
    const guests = document.getElementById("guests");
    const roomType = document.getElementById("roomType");

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");

    const summaryDates = document.getElementById("summaryDates");
    const summaryGuests = document.getElementById("summaryGuests");
    const summaryRoom = document.getElementById("summaryRoom");
    const summaryTotal = document.getElementById("summaryTotal");

    const reserveBtn = document.getElementById("reserveBtn");
    const formError = document.getElementById("formError");

    const confirmationSection =
        document.getElementById("confirmationSection");

    const confirmName =
        document.getElementById("confirmName");


    /* ========================================================
       HOTEL PRICE
       Comes from booking.php
       ======================================================== */

    const hotelPrice =
        typeof HOTEL_PRICE !== "undefined"
            ? Number(HOTEL_PRICE)
            : 0;


    /* ========================================================
       TODAY'S DATE
       ======================================================== */

    const today = new Date();

    today.setHours(0, 0, 0, 0);


    function formatDateForInput(date) {

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    /* ========================================================
       DEFAULT DATES
       Tomorrow → Check-in
       3 Nights → Check-out
       ======================================================== */

    const defaultCheckIn = new Date(today);

    defaultCheckIn.setDate(
        defaultCheckIn.getDate() + 1
    );


    const defaultCheckOut = new Date(defaultCheckIn);

    defaultCheckOut.setDate(
        defaultCheckOut.getDate() + 3
    );


    checkIn.min = formatDateForInput(today);
    checkOut.min = formatDateForInput(today);

    checkIn.value = formatDateForInput(defaultCheckIn);
    checkOut.value = formatDateForInput(defaultCheckOut);


    /* ========================================================
       DATE FORMAT
       Example:
       10 Sep 2026
       ======================================================== */

    function formatDisplayDate(dateString) {

        if (!dateString) {
            return "";
        }

        const date = new Date(dateString + "T00:00:00");

        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }


    /* ========================================================
       CALCULATE NIGHTS
       ======================================================== */

    function calculateNights() {

        if (!checkIn.value || !checkOut.value) {
            return 0;
        }

        const start =
            new Date(checkIn.value + "T00:00:00");

        const end =
            new Date(checkOut.value + "T00:00:00");

        const difference =
            end.getTime() - start.getTime();

        const nights =
            Math.ceil(
                difference / (1000 * 60 * 60 * 24)
            );

        return nights > 0 ? nights : 0;
    }


    /* ========================================================
       UPDATE SUMMARY
       ======================================================== */

    function updateSummary() {

        const nights = calculateNights();

        /* Dates */

        if (nights > 0) {

            summaryDates.textContent =
                `${formatDisplayDate(checkIn.value)} → ${formatDisplayDate(checkOut.value)} (${nights} nights)`;

        } else {

            summaryDates.textContent =
                "Select your dates";
        }


        /* Guests */

        const guestCount =
            Number(guests.value || 1);

        summaryGuests.textContent =
            guestCount === 1
                ? "1 Guest"
                : `${guestCount} Guests`;


        /* Room */

        summaryRoom.textContent =
            roomType.value;


        /* Price */

        const total =
            nights * hotelPrice;

        summaryTotal.textContent =
            "₹" + total.toLocaleString("en-IN");
    }


    /* ========================================================
       UPDATE CHECK-OUT MINIMUM
       ======================================================== */

    function updateCheckOutMin() {

        if (!checkIn.value) {
            return;
        }

        const selectedCheckIn =
            new Date(checkIn.value + "T00:00:00");

        selectedCheckIn.setDate(
            selectedCheckIn.getDate() + 1
        );

        const minimumCheckout =
            formatDateForInput(selectedCheckIn);

        checkOut.min = minimumCheckout;


        /* If checkout is before valid date */

        if (
            !checkOut.value ||
            checkOut.value < minimumCheckout
        ) {

            checkOut.value =
                minimumCheckout;
        }
    }


    /* ========================================================
       CHECK-IN CHANGE
       ======================================================== */

    checkIn.addEventListener("change", function () {

        updateCheckOutMin();

        clearError();

        updateSummary();
    });


    /* ========================================================
       CHECK-OUT CHANGE
       ======================================================== */

    checkOut.addEventListener("change", function () {

        clearError();

        updateSummary();
    });


    /* ========================================================
       GUEST CHANGE
       ======================================================== */

    guests.addEventListener("change", function () {

        clearError();

        updateSummary();
    });


    /* ========================================================
       ROOM CHANGE
       ======================================================== */

    roomType.addEventListener("change", function () {

        clearError();

        updateSummary();
    });


    /* ========================================================
       INPUT ERROR CLEAR
       ======================================================== */

    fullName.addEventListener("input", clearError);
    email.addEventListener("input", clearError);


    function clearError() {

        formError.textContent = "";
    }


    /* ========================================================
       VALIDATE DATES
       ======================================================== */

    function validateDates() {

        if (!checkIn.value || !checkOut.value) {

            showError(
                "Please select your check-in and check-out dates."
            );

            return false;
        }


        const start =
            new Date(checkIn.value + "T00:00:00");

        const end =
            new Date(checkOut.value + "T00:00:00");


        if (start < today) {

            showError(
                "Check-in date cannot be in the past."
            );

            return false;
        }


        if (end <= start) {

            showError(
                "Check-out date must be after check-in date."
            );

            return false;
        }


        return true;
    }


    /* ========================================================
       VALIDATE GUEST DETAILS
       ======================================================== */

    function validateGuestDetails() {

        if (fullName.value.trim() === "") {

            showError(
                "Please enter your full name."
            );

            fullName.focus();

            return false;
        }


        if (email.value.trim() === "") {

            showError(
                "Please enter your email address."
            );

            email.focus();

            return false;
        }


        if (!email.validity.valid) {

            showError(
                "Please enter a valid email address."
            );

            email.focus();

            return false;
        }


        return true;
    }


    /* ========================================================
       SHOW ERROR
       ======================================================== */

    function showError(message) {

        formError.textContent = message;

        formError.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    /* ========================================================
       FORM SUBMIT
       ======================================================== */

    bookingForm.addEventListener("submit", function (event) {

        event.preventDefault();


        /* Validate dates */

        if (!validateDates()) {
            return;
        }


        /* Validate guest */

        if (!validateGuestDetails()) {
            return;
        }


        /* Validate nights */

        const nights =
            calculateNights();

        if (nights <= 0) {

            showError(
                "Please select valid booking dates."
            );

            return;
        }


        /* Clear previous error */

        clearError();


        /* Button loading */

        reserveBtn.classList.add("loading");

        reserveBtn.disabled = true;


        /* Simulate reservation processing */

        setTimeout(function () {

            reserveBtn.classList.remove("loading");

            reserveBtn.classList.add("done");


            /* Guest name */

            confirmName.textContent =
                fullName.value.trim();


            /* Show confirmation */

            confirmationSection.classList.add("show");


            /* Scroll to confirmation */

            setTimeout(function () {

                confirmationSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 200);


        }, 1200);

    });


    /* ========================================================
       INITIAL SETUP
       ======================================================== */

    updateCheckOutMin();

    updateSummary();


    /* ========================================================
       HERO PARALLAX
       ======================================================== */

    const heroImage =
        document.querySelector(".booking-hero-image");


    if (heroImage) {

        window.addEventListener("scroll", function () {

            const scrollPosition =
                window.scrollY;

            if (scrollPosition < 500) {

                heroImage.style.transform =
                    `scale(1.02) translateY(${scrollPosition * 0.08}px)`;
            }

        });

    }


    /* ========================================================
       HOTEL IMAGE HOVER EFFECT
       ======================================================== */

    const previewImage =
        document.querySelector(".hotel-preview-image img");


    if (previewImage) {

        previewImage.addEventListener(
            "mouseenter",
            function () {

                previewImage.style.transform =
                    "scale(1.04)";
            }
        );


        previewImage.addEventListener(
            "mouseleave",
            function () {

                previewImage.style.transform =
                    "scale(1)";
            }
        );

    }

});