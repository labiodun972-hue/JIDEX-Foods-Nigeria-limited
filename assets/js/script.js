/*=========================================
        SUPABASE CONNECTION
=========================================*/

const SUPABASE_URL =
    'https://jrmabbeurnsmxshmcooh.supabase.co';

const SUPABASE_KEY =
    'sb_publishable_BWINBzBQFqnGcOT2ghVeqA_B46ZfIrL';

let supabaseClient = null;

if (typeof supabase !== "undefined") {

    supabaseClient = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

} else {

    console.error(
        "Supabase library failed to load."
    );

}


/*=========================================
        PREVENT SCROLL RESTORATION
=========================================*/

if ("scrollRestoration" in history) {

    history.scrollRestoration = "manual";

}


/*=========================================
        DOM READY
=========================================*/

document.addEventListener("DOMContentLoaded", function () {


    /*=========================================
            MOBILE MENU
    =========================================*/

    const menuToggle =
        document.querySelector(".menu-toggle");

    const navLinks =
        document.querySelector(".nav-links");


    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            menuToggle.classList.toggle("active");

            navLinks.classList.toggle("active");

        });


        navLinks.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                menuToggle.classList.remove("active");

                navLinks.classList.remove("active");

            });

        });

    }


    /*=========================================
            SAFE SCROLL REVEAL
    =========================================*/

    const revealElements =
        document.querySelectorAll(".reveal");


    function revealOnScroll() {

        revealElements.forEach(function (element) {

            const elementTop =
                element.getBoundingClientRect().top;

            const windowHeight =
                window.innerHeight;


            if (elementTop < windowHeight - 80) {

                element.classList.remove(
                    "reveal-hidden"
                );

                element.classList.add(
                    "reveal-visible"
                );

            }

        });

    }


    /*
        Only hide sections that are below
        the visitor's current screen.
    */

    revealElements.forEach(function (element) {

        const elementTop =
            element.getBoundingClientRect().top;

        const windowHeight =
            window.innerHeight;


        if (elementTop >= windowHeight - 80) {

            element.classList.add(
                "reveal-hidden"
            );

        }

    });


    revealOnScroll();


    window.addEventListener(
        "scroll",
        revealOnScroll,
        { passive: true }
    );


    /*=========================================
            ACTIVE NAVIGATION
    =========================================*/

    const sections =
        document.querySelectorAll("section[id]");

    const navigationLinks =
        document.querySelectorAll(".nav-links a");


    function updateActiveNavigation() {

        let currentSection = "";


        sections.forEach(function (section) {

            const sectionTop =
                section.offsetTop - 150;

            const sectionHeight =
                section.offsetHeight;


            if (
                window.scrollY >= sectionTop &&
                window.scrollY <
                sectionTop + sectionHeight
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        navigationLinks.forEach(function (link) {

            link.classList.remove("active");


            const target =
                link.getAttribute("href");


            if (
                target ===
                "#" + currentSection
            ) {

                link.classList.add("active");

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation,
        { passive: true }
    );


    updateActiveNavigation();


    /*=========================================
            SCROLL PROGRESS BAR
    =========================================*/

    const progressBar =
        document.getElementById(
            "progress-bar"
        );


    function updateProgressBar() {

        if (!progressBar) return;


        const scrollTop =
            window.scrollY;

        const documentHeight =
            document.documentElement.scrollHeight -
            window.innerHeight;


        if (documentHeight <= 0) {

            progressBar.style.width =
                "0%";

            return;

        }


        const scrollPercentage =
            (scrollTop / documentHeight) * 100;


        progressBar.style.width =
            scrollPercentage + "%";

    }


    window.addEventListener(
        "scroll",
        updateProgressBar,
        { passive: true }
    );


    updateProgressBar();


    /*=========================================
            BACK TO TOP BUTTON
    =========================================*/

    const topBtn =
        document.getElementById(
            "topBtn"
        );


    if (topBtn) {

        window.addEventListener(
            "scroll",
            function () {

                if (window.scrollY > 500) {

                    topBtn.style.display =
                        "flex";

                } else {

                    topBtn.style.display =
                        "none";

                }

            },
            { passive: true }
        );


        topBtn.addEventListener(
            "click",
            function () {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    /*=========================================
            REVIEW SYSTEM
    =========================================*/

    const reviewForm =
        document.getElementById(
            "jidexReviewForm"
        );

    const reviewsContainer =
        document.getElementById(
            "reviewsDisplayContainer"
        );


    /*
        LOAD REVIEWS
    */

    async function loadReviews() {

        if (!supabaseClient) {

            if (reviewsContainer) {

                reviewsContainer.innerHTML =
                    '<p style="text-align:center;color:#777;">Unable to connect to reviews.</p>';

            }

            return;

        }


        if (!reviewsContainer) return;


        reviewsContainer.innerHTML =
            '<p style="text-align:center;color:#777;">Loading reviews...</p>';


        try {

            const {
                data,
                error
            } = await supabaseClient
                .from("reviews")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


            if (error) {

                console.error(
                    "Error loading reviews:",
                    error
                );

                reviewsContainer.innerHTML =
                    '<p style="text-align:center;color:#777;">No reviews available yet.</p>';

                return;

            }


            if (!data || data.length === 0) {

                reviewsContainer.innerHTML =
                    '<p style="text-align:center;color:#777;">Be the first to leave a review!</p>';

                return;

            }


            reviewsContainer.innerHTML = "";


            data.forEach(function (review) {

                const reviewCard =
                    document.createElement("div");


                reviewCard.style.background =
                    "#fff";

                reviewCard.style.padding =
                    "20px";

                reviewCard.style.borderRadius =
                    "12px";

                reviewCard.style.boxShadow =
                    "0 8px 25px rgba(0,0,0,.08)";


                const name =
                    document.createElement("h4");

                name.textContent =
                    review.name ||
                    review.reviewer_name ||
                    "Customer";


                name.style.marginBottom =
                    "8px";


                const rating =
                    document.createElement("div");


                const ratingValue =
                    Number(
                        review.rating ||
                        review.reviewer_rating ||
                        5
                    );


                rating.textContent =
                    "⭐".repeat(
                        Math.max(
                            1,
                            Math.min(
                                5,
                                ratingValue
                            )
                        )
                    );


                rating.style.marginBottom =
                    "10px";


                const comment =
                    document.createElement("p");


                comment.textContent =
                    review.comment ||
                    review.reviewer_comment ||
                    "";


                comment.style.color =
                    "#777";

                comment.style.lineHeight =
                    "1.7";


                reviewCard.appendChild(name);

                reviewCard.appendChild(rating);

                reviewCard.appendChild(comment);


                reviewsContainer.appendChild(
                    reviewCard
                );

            });

        } catch (error) {

            console.error(
                "Review loading error:",
                error
            );


            reviewsContainer.innerHTML =
                '<p style="text-align:center;color:#777;">Unable to load reviews.</p>';

        }

    }


    /*
        SUBMIT REVIEW
    */

    if (reviewForm) {

        reviewForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                if (!supabaseClient) {

                    alert(
                        "Review system is currently unavailable."
                    );

                    return;

                }


                const nameInput =
                    document.getElementById(
                        "reviewerName"
                    );

                const ratingInput =
                    document.getElementById(
                        "reviewerRating"
                    );

                const commentInput =
                    document.getElementById(
                        "reviewerComment"
                    );


                const name =
                    nameInput.value.trim();

                const rating =
                    Number(
                        ratingInput.value
                    );

                const comment =
                    commentInput.value.trim();


                if (
                    !name ||
                    !comment ||
                    !rating
                ) {

                    alert(
                        "Please complete all review fields."
                    );

                    return;

                }


                const submitButton =
                    reviewForm.querySelector(
                        'button[type="submit"]'
                    );


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Submitting...";

                }


                try {

                    const {
                        error
                    } = await supabaseClient
                        .from("reviews")
                        .insert([
                            {
                                name: name,
                                rating: rating,
                                comment: comment
                            }
                        ]);


                    if (error) {

                        console.error(
                            "Review submission error:",
                            error
                        );

                        alert(
                            "Your review could not be submitted. Please try again."
                        );

                        return;

                    }


                    alert(
                        "Thank you! Your review has been submitted."
                    );


                    reviewForm.reset();


                    await loadReviews();


                } catch (error) {

                    console.error(
                        "Review error:",
                        error
                    );


                    alert(
                        "Something went wrong while submitting your review."
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            "Submit Review";

                    }

                }

            }
        );

    }


    /*
        Load reviews when page opens
    */

    loadReviews();

});


/*=========================================
        STICKY NAVBAR
=========================================*/

window.addEventListener(
    "scroll",
    function () {

        const navbar =
            document.querySelector(
                ".navbar"
            );


        if (!navbar) return;


        if (window.scrollY > 50) {

            navbar.classList.add(
                "scrolled"
            );

        } else {

            navbar.classList.remove(
                "scrolled"
            );

        }

    },
    { passive: true }
);


/*=========================================
        PRELOADER
=========================================*/

window.addEventListener(
    "load",
    function () {

        /*
            Always start visitor at top.
        */

        window.scrollTo(
            0,
            0
        );


        const preloader =
            document.getElementById(
                "preloader"
            );


        if (!preloader) return;


        preloader.style.transition =
            "opacity 0.6s ease";


        preloader.style.opacity =
            "0";


        setTimeout(
            function () {

                preloader.style.display =
                    "none";

            },
            600
        );

    }
);
