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
