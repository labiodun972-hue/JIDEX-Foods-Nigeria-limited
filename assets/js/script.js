/*=========================================
        JIDEX FOODS - MAIN JAVASCRIPT
=========================================*/


/*=========================================
        SUPABASE CONNECTION
=========================================*/

const SUPABASE_URL =
    'https://jrmabbeurnsmxshmcooh.supabase.co';

const SUPABASE_KEY =
    'sb_publishable_BWINBzBQFqnGcOT2ghVeqA_B46ZfIrL';

let supabaseClient = null;


/*=========================================
        INITIALIZE SUPABASE
=========================================*/

if (typeof supabase !== "undefined") {

    supabaseClient = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    console.log("Supabase connected successfully.");

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
        PRELOADER
=========================================*/

window.addEventListener("load", function () {

    // Always start at the top
    window.scrollTo(0, 0);

    const preloader =
        document.getElementById("preloader");

    if (!preloader) return;

    // Fade out
    preloader.style.transition =
        "opacity 0.6s ease";

    preloader.style.opacity = "0";

    // Remove after animation
    setTimeout(function () {

        preloader.style.display = "none";

    }, 600);

});


/*=========================================
        MOBILE MENU
=========================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const menuToggle =
            document.querySelector(".menu-toggle");

        const navLinks =
            document.querySelector(".nav-links");


        if (!menuToggle || !navLinks) return;


        /* OPEN / CLOSE MENU */

        menuToggle.addEventListener(
            "click",
            function () {

                menuToggle.classList.toggle("active");

                navLinks.classList.toggle("active");

            }
        );


        /* CLOSE MENU WHEN LINK IS CLICKED */

        const links =
            navLinks.querySelectorAll("a");

        links.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    menuToggle.classList.remove("active");

                    navLinks.classList.remove("active");

                }
            );

        });

    }
);


/*=========================================
        STICKY NAVBAR
=========================================*/

window.addEventListener(
    "scroll",
    function () {

        const navbar =
            document.querySelector(".navbar");

        if (!navbar) return;


        if (window.scrollY > 50) {

            navbar.classList.add("scrolled");

        } else {

            navbar.classList.remove("scrolled");

        }

    }
);


/*=========================================
        ACTIVE NAVIGATION
=========================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const sections =
            document.querySelectorAll("section[id]");

        const navLinks =
            document.querySelectorAll(
                ".nav-links a"
            );


        if (!sections.length || !navLinks.length) {
            return;
        }


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


            navLinks.forEach(function (link) {

                link.classList.remove("active");


                const href =
                    link.getAttribute("href");


                if (
                    href === "#" + currentSection
                ) {

                    link.classList.add("active");

                }

            });

        }


        window.addEventListener(
            "scroll",
            updateActiveNavigation
        );


        updateActiveNavigation();

    }
);


/*=========================================
        SCROLL REVEAL
=========================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const revealElements =
            document.querySelectorAll(".reveal");


        if (!revealElements.length) return;


        function revealOnScroll() {

            revealElements.forEach(
                function (element) {

                    const elementTop =
                        element.getBoundingClientRect().top;

                    const windowHeight =
                        window.innerHeight;


                    if (
                        elementTop <
                        windowHeight - 80
                    ) {

                        element.classList.add("active");

                    }

                }
            );

        }


        // Run immediately
        revealOnScroll();


        // Run while scrolling
        window.addEventListener(
            "scroll",
            revealOnScroll
        );

    }
);


/*=========================================
        SCROLL PROGRESS BAR
=========================================*/

window.addEventListener(
    "scroll",
    function () {

        const progressBar =
            document.getElementById(
                "progress-bar"
            );


        if (!progressBar) return;


        const scrollTop =
            window.scrollY;


        const documentHeight =
            document.documentElement
                .scrollHeight -
            window.innerHeight;


        if (documentHeight <= 0) {

            progressBar.style.width = "0%";

            return;

        }


        const progress =
            (scrollTop / documentHeight) * 100;


        progressBar.style.width =
            progress + "%";

    }
);


/*=========================================
        BACK TO TOP BUTTON
=========================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const topBtn =
            document.getElementById("topBtn");


        if (!topBtn) return;


        /* SHOW / HIDE BUTTON */

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

            }
        );


        /* SCROLL TO TOP */

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
);


/*=========================================
        REVIEW SUBMISSION
=========================================*/

async function submitReview(event) {

    event.preventDefault();


    if (!supabaseClient) {

        alert(
            "Review system is currently unavailable. Please try again later."
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


    if (
        !nameInput ||
        !ratingInput ||
        !commentInput
    ) {

        console.error(
            "Review form elements were not found."
        );

        return;

    }


    const name =
        nameInput.value.trim();

    const rating =
        Number(ratingInput.value);

    const comment =
        commentInput.value.trim();


    /* VALIDATION */

    if (!name) {

        alert("Please enter your name.");

        return;

    }


    if (
        !rating ||
        rating < 1 ||
        rating > 5
    ) {

        alert(
            "Please select a rating between 1 and 5."
        );

        return;

    }


    if (!comment) {

        alert("Please write your review.");

        return;

    }


    /* FIND SUBMIT BUTTON */

    const button =
        event.target.querySelector(
            'button[type="submit"]'
        );


    const originalButtonText =
        button
            ? button.innerText
            : "Submit Review";


    if (button) {

        button.disabled = true;

        button.innerText =
            "Submitting...";

    }


    try {

        /* INSERT REVIEW INTO SUPABASE */

        const { data, error } =
            await supabaseClient
                .from("reviews")
                .insert([
                    {
                        name: name,
                        rating: rating,
                        comment: comment
                    }
                ])
                .select();


        if (error) {

            console.error(
                "Supabase review error:",
                error
            );

            alert(
                "We could not submit your review. Please try again."
            );

            return;

        }


        console.log(
            "Review submitted successfully:",
            data
        );


        /* CLEAR FORM */

        nameInput.value = "";

        ratingInput.value = "5";

        commentInput.value = "";


        alert(
            "Thank you! Your review has been submitted successfully."
        );


        /* REFRESH REVIEWS */

        await loadReviews();


    } catch (error) {

        console.error(
            "Unexpected review error:",
            error
        );

        alert(
            "Something went wrong. Please try again."
        );


    } finally {

        if (button) {

            button.disabled = false;

            button.innerText =
                originalButtonText;

        }

    }

}


/*=========================================
        LOAD REVIEWS FROM SUPABASE
=========================================*/

async function loadReviews() {

    const container =
        document.getElementById(
            "reviewsDisplayContainer"
        );


    if (!container) {

        console.warn(
            "Reviews display container not found."
        );

        return;

    }


    if (!supabaseClient) {

        container.innerHTML = `
            <p style="
                text-align:center;
                color:#777;
            ">
                Review system unavailable.
            </p>
        `;

        return;

    }


    /* LOADING MESSAGE */

    container.innerHTML = `
        <p style="
            text-align:center;
            color:#777;
        ">
            Loading reviews...
        </p>
    `;


    try {

        /*
            IMPORTANT:

            Your Supabase table uses:

            id
            name
            rating
            comment
            create_at

            Therefore we order by create_at.
        */

        const { data, error } =
            await supabaseClient
                .from("reviews")
                .select(
                    "id, name, rating, comment, create_at"
                )
                .order(
                    "create_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Error loading reviews:",
                error
            );


            container.innerHTML = `
                <p style="
                    text-align:center;
                    color:#777;
                ">
                    Unable to load reviews right now.
                </p>
            `;

            return;

        }


        /* NO REVIEWS */

        if (!data || data.length === 0) {

            container.innerHTML = `
                <p style="
                    text-align:center;
                    color:#777;
                ">
                    No reviews yet.
                    Be the first to leave a review!
                </p>
            `;

            return;

        }


        /* CLEAR CONTAINER */

        container.innerHTML = "";


        /* DISPLAY EACH REVIEW */

        data.forEach(function (review) {


            /* CREATE CARD */

            const reviewCard =
                document.createElement("div");


            reviewCard.className =
                "customer-review";


            /* SAFE NAME */

            const safeName =
                escapeHTML(
                    review.name || "Customer"
                );


            /* SAFE COMMENT */

            const safeComment =
                escapeHTML(
                    review.comment || ""
                );


            /* RATING */

            const rating =
                Math.min(
                    5,
                    Math.max(
                        1,
                        Number(review.rating) || 0
                    )
                );


            const stars =
                "⭐".repeat(rating);


            /* DATE */

            let formattedDate = "";


            if (review.create_at) {

                const date =
                    new Date(
                        review.create_at
                    );


                if (
                    !isNaN(
                        date.getTime()
                    )
                ) {

                    formattedDate =
                        date.toLocaleDateString(
                            "en-NG",
                            {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            }
                        );

                }

            }


            /* CARD HTML */

            reviewCard.innerHTML = `

                <div style="
                    background:#fff;
                    padding:25px;
                    border-radius:15px;
                    box-shadow:0 8px 25px rgba(0,0,0,.08);
                    border-left:4px solid #D62828;
                ">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        align-items:flex-start;
                        gap:15px;
                        flex-wrap:wrap;
                    ">

                        <div>

                            <h4 style="
                                margin:0 0 6px;
                                color:#1F1F1F;
                                font-size:18px;
                            ">
                                ${safeName}
                            </h4>

                            <div style="
                                font-size:17px;
                                margin-bottom:8px;
                            ">
                                ${stars}
                            </div>

                        </div>

                        ${
                            formattedDate
                            ? `
                                <small style="
                                    color:#999;
                                ">
                                    ${formattedDate}
                                </small>
                            `
                            : ""
                        }

                    </div>

                    <p style="
                        margin:10px 0 0;
                        color:#555;
                        line-height:1.8;
                    ">
                        ${safeComment}
                    </p>

                </div>

            `;


            container.appendChild(
                reviewCard
            );

        });


    } catch (error) {

        console.error(
            "Unexpected error loading reviews:",
            error
        );


        container.innerHTML = `
            <p style="
                text-align:center;
                color:#777;
            ">
                Unable to load reviews.
            </p>
        `;

    }

}


/*=========================================
        ESCAPE HTML
=========================================*/

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;

}


/*=========================================
        REVIEW FORM INITIALIZATION
=========================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const reviewForm =
            document.getElementById(
                "jidexReviewForm"
            );


        if (reviewForm) {

            reviewForm.addEventListener(
                "submit",
                submitReview
            );

        }


        /* LOAD EXISTING REVIEWS */

        loadReviews();

    }
);


/*=========================================
        SMOOTH SCROLL
=========================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const anchorLinks =
            document.querySelectorAll(
                'a[href^="#"]'
            );


        anchorLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        const targetId =
                            this.getAttribute(
                                "href"
                            );


                        if (
                            !targetId ||
                            targetId === "#"
                        ) {

                            return;

                        }


                        const target =
                            document.querySelector(
                                targetId
                            );


                        if (!target) {

                            return;

                        }


                        event.preventDefault();


                        const header =
                            document.querySelector(
                                "header"
                            );


                        const headerHeight =
                            header
                                ? header.offsetHeight
                                : 0;


                        const targetPosition =
                            target.getBoundingClientRect()
                                .top +
                            window.scrollY -
                            headerHeight;


                        window.scrollTo({

                            top:
                                targetPosition,

                            behavior:
                                "smooth"

                        });

                    }
                );

            }
        );

    }
);


/*=========================================
        PAGE VISIBILITY FIX
=========================================*/

/*
    This makes sure sections do not remain
    hidden if JavaScript loads late or if
    the visitor opens the page at a section.
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const revealElements =
            document.querySelectorAll(
                ".reveal"
            );


        revealElements.forEach(
            function (element) {

                const rect =
                    element.getBoundingClientRect();


                if (
                    rect.top <
                    window.innerHeight
                ) {

                    element.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


/*=========================================
        HERO VIDEO SAFETY
=========================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const heroVideo =
            document.querySelector(
                ".hero-video"
            );


        if (!heroVideo) return;


        heroVideo.muted = true;

        heroVideo.playsInline = true;


        const playPromise =
            heroVideo.play();


        if (
            playPromise !== undefined
        ) {

            playPromise.catch(
                function () {

                    console.log(
                        "Hero video autoplay was prevented."
                    );

                }
            );

        }

    }
);


/*=========================================
        FACTORY / ACTION VIDEOS
=========================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const videos =
            document.querySelectorAll(
                ".factory-card video, .action-card video, .journey-video video"
            );


        videos.forEach(
            function (video) {

                video.muted = true;

                video.playsInline = true;

            }
        );

    }
);


/*=========================================
        WHATSAPP BUTTON
=========================================*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const whatsapp =
            document.querySelector(
                ".whatsapp"
            );


        if (!whatsapp) return;


        whatsapp.addEventListener(
            "click",
            function () {

                console.log(
                    "Opening JIDEX WhatsApp..."
                );

            }
        );

    }
);


/*=========================================
        PAGE STARTUP MESSAGE
=========================================*/

console.log(
    "JIDEX Foods website JavaScript loaded successfully."
);
