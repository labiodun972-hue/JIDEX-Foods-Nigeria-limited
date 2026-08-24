// Paste your project keys inside the single quotes below
const SUPABASE_URL = 'https://jrmabbeurnsmxshmcooh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_BWINBzBQFqnGcOT2ghVeqA_B46ZfIrL';

// This initializes the database client engine connection
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);





/*=========================================
        PREVENT SCROLL RESTORATION
=========================================*/

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", function () {

    window.scrollTo(0, 0);

    /*=========================================
            PRELOADER
    =========================================*/

    const preloader = document.getElementById("preloader");

    preloader.style.transition = "opacity 0.6s ease";
    preloader.style.opacity = "0";

    setTimeout(function () {

        preloader.style.display = "none";

    }, 600);

});


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

// 1. FUNCTION TO SAVE A NEW REVIEW TO SUPABASE
const formElement = document.getElementById('jidexReviewForm');

if (formElement) {
    formElement.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get live data typed into the form inputs
        const uName = document.getElementById('reviewerName').value;
        const uRating = parseInt(document.getElementById('reviewerRating').value);
        const uComment = document.getElementById('reviewerComment').value;

        // Push data straight to your Supabase table cloud storage
        const { data, error } = await supabaseClient
            .from('reviews')
            .insert([{ name: uName, rating: uRating, comment: uComment }]);

        if (error) {
            alert("Error sending review: " + error.message);
        } else {
            alert("Thank you! Your review has been shared globally.");
            formElement.reset(); // clear input fields
            loadLiveReviews();   // refresh feed list automatically
        }
    });
}

// 2. FUNCTION TO FETCH AND RENDER REVIEWS FOR EVERY VISITOR
async function loadLiveReviews() {
    const feedContainer = document.getElementById('reviewsDisplayContainer');
    if (!feedContainer) return;

    // Get all reviews saved inside your database table ordered by newest first
    const { data: databaseRows, error } = await supabaseClient
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        feedContainer.innerHTML = `<p style="color: red; text-align: center;">Could not load reviews: ${error.message}</p>`;
        return;
    }

    // If database is completely empty
    if (!databaseRows || databaseRows.length === 0) {
        feedContainer.innerHTML = '<p style="text-align: center; color: #777;">No reviews yet. Be the first to leave one!</p>';
        return;
    }

    // Wipe old HTML clean and generate dynamic structural cards
    feedContainer.innerHTML = '';
    databaseRows.forEach(item => {
        // Build star string indicator icon templates dynamically
        const starsStr = '⭐'.repeat(item.rating);
        
        feedContainer.innerHTML += `
            <div style="background: #fdfdfd; padding: 20px; border-left: 5px solid #e67e22; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <strong style="color: #333; font-size: 16px;">${item.name}</strong>
                    <span style="font-size: 14px;">${starsStr}</span>
                </div>
                <p style="margin: 0; color: #555; line-height: 1.5; font-size: 15px;">${item.comment}</p>
            </div>
        `;
    });
}

// Automatically load the global user feed right when the page finishes loading
window.addEventListener('DOMContentLoaded', loadLiveReviews);
