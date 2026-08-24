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
        PRELOADER
=========================================*/

window.addEventListener("load", function () {

    // Always start the visitor at the top
    window.scrollTo(0, 0);


    // Find the preloader
    const preloader =
        document.getElementById("preloader");


    // Stop if the preloader doesn't exist
    if (!preloader) {

        return;

    }


    // Fade out the preloader
    preloader.style.transition =
        "opacity 0.6s ease";

    preloader.style.opacity = "0";


    // Remove it completely
    setTimeout(function () {

        preloader.style.display = "none";

    }, 600);

});


/*=========================================
        STICKY NAVBAR
=========================================*/

window.addEventListener("scroll", function () {

    const navbar =
        document.querySelector(".navbar");

    if (!navbar) return;


    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});
