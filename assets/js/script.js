/*=========================================
        PRELOADER
=========================================*/

window.addEventListener("load", function () {

    window.scrollTo(0, 0);

    const preloader = document.getElementById("preloader");

    if (preloader) {

        preloader.style.transition = "opacity 0.6s ease";
        preloader.style.opacity = "0";

        setTimeout(function () {

            preloader.style.display = "none";

        }, 600);

    }

});


/*=========================================
        SUPABASE CONNECTION
=========================================*/

const SUPABASE_URL = 'https://jrmabbeurnsmxshmcooh.supabase.co';

const SUPABASE_KEY = 'sb_publishable_BWINBzBQFqnGcOT2ghVeqA_B46ZfIrL';

let supabaseClient = null;

if (typeof supabase !== "undefined") {

    supabaseClient = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

} else {

    console.error("Supabase library failed to load.");

}





/*=========================================
        PREVENT SCROLL RESTORATION
=========================================*/

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", function () {

    window.scrollTo(0, 0);



/*=========================================
        STICKY NAVBAR
=========================================*/

window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/*=========================================
        BACK TO TOP BUTTON
=========================================*/

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", function () {

    if (window.scrollY > 400) {

        topBtn.style.display = "block";

    } else {

        topBtn.style.display = "none";

    }

});

topBtn.onclick = function () {

    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

};


/*=========================================
        MOBILE MENU
=========================================*/

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", function () {

    menuToggle.classList.toggle("active");
    navLinks.classList.toggle("active");

});


/*=========================================
    CLOSE MENU AFTER CLICKING A LINK
=========================================*/

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach(function (item) {

    item.addEventListener("click", function () {

        menuToggle.classList.remove("active");
        navLinks.classList.remove("active");

    });

});


/*=========================================
        SCROLL REVEAL ANIMATION
=========================================*/

const reveals = document.querySelectorAll(".reveal");

function revealSections() {

    const windowHeight = window.innerHeight;

    reveals.forEach(function (section) {

        const revealTop = section.getBoundingClientRect().top;
        const revealPoint = 120;

        if (revealTop < windowHeight - revealPoint) {

            section.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealSections);
window.addEventListener("load", revealSections);

/*=========================================
        COUNTER ANIMATION
=========================================*/

const counters = document.querySelectorAll(".counter");

const startCounter = () => {

    counters.forEach(counter => {

        const target = +counter.getAttribute("data-target");

        const increment = target / 80;

        let count = 0;

        const update = () => {

            count += increment;

            if(count < target){

                counter.innerText = Math.ceil(count);

                requestAnimationFrame(update);

            }else{

                counter.innerText = target;

            }

        };

        update();

    });

};

let counterStarted = false;

window.addEventListener("scroll", () => {

    const stats = document.querySelector(".stats");

    if(!stats) return;

    const top = stats.getBoundingClientRect().top;

    if(top < window.innerHeight - 100 && !counterStarted){

        startCounter();

        counterStarted = true;

    }

});

/*=========================================
        ACTIVE NAVIGATION
=========================================*/

const sections = document.querySelectorAll("section");
const navItemsActive = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight) {

            current = section.getAttribute("id");

        }

    });

    navItemsActive.forEach(link => {

        link.classList.remove("active");

        if(link.getAttribute("href") === "#" + current){

            link.classList.add("active");

        }

    });

});


/*=========================================
        SCROLL PROGRESS BAR
=========================================*/

window.addEventListener("scroll", function(){

    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;

    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    const scrolled = (winScroll / height) * 100;

    document.getElementById("progress-bar").style.width = scrolled + "%";

});


// ==========================================
// JIDEX FOODS GLOBAL SUPABASE REVIEW SYSTEM
// ==========================================


// ==========================================
// 1. REVIEW FORM
// ==========================================

const formElement = document.getElementById("jidexReviewForm");

if (formElement) {

    formElement.addEventListener("submit", async function (e) {

        e.preventDefault();

        // Make sure Supabase is available
        if (!supabaseClient) {

            alert(
                "The review system is temporarily unavailable. Please try again later."
            );

            console.error("Supabase client is not available.");

            return;
        }


        // Get form values
        const uName =
            document.getElementById("reviewerName").value.trim();

        const uRating =
            parseInt(
                document.getElementById("reviewerRating").value
            );

        const uComment =
            document.getElementById("reviewerComment").value.trim();


        // Basic validation
        if (!uName || !uComment || !uRating) {

            alert("Please complete all review fields.");

            return;
        }


        // Disable submit button while sending
        const submitButton =
            formElement.querySelector("button[type='submit']");

        if (submitButton) {

            submitButton.disabled = true;

            submitButton.innerText = "Submitting...";
        }


        try {

            // Send review to Supabase
            const { data, error } = await supabaseClient
                .from("reviews")
                .insert([
                    {
                        name: uName,
                        rating: uRating,
                        comment: uComment
                    }
                ]);


            // Handle database error
            if (error) {

                console.error(
                    "Supabase review submission error:",
                    error
                );

                alert(
                    "Unable to submit your review. Please try again."
                );

                return;
            }


            // Success
            alert(
                "Thank you! Your review has been shared."
            );


            // Clear form
            formElement.reset();


            // Refresh reviews
            loadLiveReviews();


        } catch (error) {

            console.error(
                "Unexpected review submission error:",
                error
            );

            alert(
                "Something went wrong while submitting your review. Please try again."
            );

        } finally {

            // Restore button
            if (submitButton) {

                submitButton.disabled = false;

                submitButton.innerText = "Submit Review";

            }

        }

    });

}



// ==========================================
// 2. LOAD REVIEWS FROM SUPABASE
// ==========================================

async function loadLiveReviews() {

    const feedContainer =
        document.getElementById("reviewsDisplayContainer");


    // If the review display does not exist
    // on this page, stop here.
    if (!feedContainer) {

        return;
    }


    // Check Supabase connection
    if (!supabaseClient) {

        feedContainer.innerHTML = `
            <p style="
                text-align:center;
                color:#777;
                padding:20px;
            ">
                Reviews are temporarily unavailable.
            </p>
        `;

        console.error(
            "Supabase client is not available."
        );

        return;
    }


    // Show loading message
    feedContainer.innerHTML = `
        <p style="
            text-align:center;
            color:#777;
            padding:20px;
        ">
            Loading reviews...
        </p>
    `;


    try {

        // Get reviews from database
        const {
            data: databaseRows,
            error
        } = await supabaseClient

            .from("reviews")

            .select("*")

            .order("created_at", {
                ascending: false
            });


        // Database error
        if (error) {

            console.error(
                "Supabase review loading error:",
                error
            );

            feedContainer.innerHTML = `
                <p style="
                    text-align:center;
                    color:#777;
                    padding:20px;
                ">
                    Reviews are temporarily unavailable.
                </p>
            `;

            return;
        }


        // No reviews
        if (
            !databaseRows ||
            databaseRows.length === 0
        ) {

            feedContainer.innerHTML = `
                <p style="
                    text-align:center;
                    color:#777;
                    padding:20px;
                ">
                    No reviews yet.
                    Be the first to leave one!
                </p>
            `;

            return;
        }


        // Clear loading message
        feedContainer.innerHTML = "";


        // Create review cards
        databaseRows.forEach(function (item) {

            // Make sure rating is between 1 and 5
            const rating = Math.min(
                5,
                Math.max(
                    1,
                    parseInt(item.rating) || 1
                )
            );


            // Generate stars
            const starsStr =
                "⭐".repeat(rating);


            // Create review card
            const reviewCard =
                document.createElement("div");


            reviewCard.style.cssText = `
                background: #fdfdfd;
                padding: 20px;
                border-left: 5px solid #e67e22;
                border-radius: 4px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            `;


            // Create top section
            const reviewHeader =
                document.createElement("div");


            reviewHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 15px;
                margin-bottom: 8px;
                flex-wrap: wrap;
            `;


            // Customer name
            const nameElement =
                document.createElement("strong");


            nameElement.style.cssText = `
                color: #333;
                font-size: 16px;
            `;


            nameElement.textContent =
                item.name || "Anonymous";


            // Stars
            const starsElement =
                document.createElement("span");


            starsElement.style.cssText = `
                font-size: 14px;
            `;


            starsElement.textContent =
                starsStr;


            // Add name and stars
            reviewHeader.appendChild(
                nameElement
            );

            reviewHeader.appendChild(
                starsElement
            );


            // Review comment
            const commentElement =
                document.createElement("p");


            commentElement.style.cssText = `
                margin: 0;
                color: #555;
                line-height: 1.5;
                font-size: 15px;
                word-wrap: break-word;
            `;


            commentElement.textContent =
                item.comment || "";


            // Build card
            reviewCard.appendChild(
                reviewHeader
            );

            reviewCard.appendChild(
                commentElement
            );


            // Add card to page
            feedContainer.appendChild(
                reviewCard
            );

        });


    } catch (error) {

        console.error(
            "Unexpected error loading reviews:",
            error
        );


        feedContainer.innerHTML = `
            <p style="
                text-align:center;
                color:#777;
                padding:20px;
            ">
                Unable to load reviews at the moment.
            </p>
        `;

    }

}



// ==========================================
// 3. LOAD REVIEWS WHEN PAGE OPENS
// ==========================================

window.addEventListener(
    "DOMContentLoaded",
    function () {

        loadLiveReviews();

    }
);
