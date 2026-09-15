/* =========================================
   NEXORA
   Main JavaScript
========================================= */


/* =========================================
   LANGUAGE SYSTEM
========================================= */

const languageSwitch = document.getElementById("languageSwitch");
const languageLabel = document.getElementById("languageLabel");

let currentLanguage =
    localStorage.getItem("nexora-language") || "ar";


function applyLanguage(language) {

    currentLanguage = language;

    const html = document.documentElement;
    const body = document.body;

    if (language === "en") {

        html.lang = "en";
        html.dir = "ltr";

        body.classList.add("lang-en");

        languageLabel.textContent = "العربية";

    } else {

        html.lang = "ar";
        html.dir = "rtl";

        body.classList.remove("lang-en");

        languageLabel.textContent = "EN";
    }


    /*
     * Replace all elements containing
     * data-ar and data-en.
     */

    document.querySelectorAll("[data-ar][data-en]")
        .forEach(element => {

            const text =
                language === "en"
                    ? element.getAttribute("data-en")
                    : element.getAttribute("data-ar");

            /*
             * innerHTML is intentional here because
             * the CTA heading uses <br>.
             */

            element.innerHTML = text;
        });


    localStorage.setItem(
        "nexora-language",
        language
    );
}


languageSwitch.addEventListener("click", () => {

    const newLanguage =
        currentLanguage === "ar"
            ? "en"
            : "ar";

    applyLanguage(newLanguage);

});


/* Apply saved language */

applyLanguage(currentLanguage);


/* =========================================
   MOBILE MENU
========================================= */

const menuButton =
    document.getElementById("menuButton");

const navLinks =
    document.querySelector(".nav-links");


menuButton.addEventListener("click", () => {

    navLinks.classList.toggle("open");

});


/*
 * Close mobile menu after clicking a link
 */

document.querySelectorAll(".nav-link")
    .forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("open");

        });

    });


/* =========================================
   NAVBAR SCROLL
========================================= */

const navbar =
    document.getElementById("navbar");


window.addEventListener("scroll", () => {

    if (window.scrollY > 30) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================================
   ACTIVE NAVIGATION
========================================= */

const sections =
    document.querySelectorAll("section[id]");

const navItems =
    document.querySelectorAll(".nav-link");


const sectionObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const currentId =
                        entry.target.getAttribute("id");

                    navItems.forEach(link => {

                        link.classList.remove("active");

                        if (
                            link.getAttribute("href") ===
                            `#${currentId}`
                        ) {

                            link.classList.add("active");

                        }

                    });

                }

            });

        },
        {
            threshold: 0.25
        }
    );


sections.forEach(section => {

    sectionObserver.observe(section);

});


/* =========================================
   NUMBER COUNTER
========================================= */

const counters =
    document.querySelectorAll("[data-count]");


let counterStarted = false;


function animateCounter(element) {

    const target =
        Number(element.getAttribute("data-count"));

    const duration = 1400;

    const startTime =
        performance.now();


    function update(currentTime) {

        const progress =
            Math.min(
                (currentTime - startTime) / duration,
                1
            );

        /*
         * Ease-out effect
         */

        const eased =
            1 - Math.pow(1 - progress, 3);

        const currentValue =
            Math.floor(target * eased);

        element.textContent =
            currentValue.toLocaleString(
                currentLanguage === "ar"
                    ? "ar"
                    : "en-US"
            );


        if (progress < 1) {

            requestAnimationFrame(update);

        } else {

            element.textContent =
                target.toLocaleString(
                    currentLanguage === "ar"
                        ? "ar"
                        : "en-US"
                );

        }

    }


    requestAnimationFrame(update);

}


const statsSection =
    document.querySelector(".stats-section");


const statsObserver =
    new IntersectionObserver(
        entries => {

            if (
                entries[0].isIntersecting &&
                !counterStarted
            ) {

                counterStarted = true;

                counters.forEach(counter => {

                    animateCounter(counter);

                });

            }

        },
        {
            threshold: 0.35
        }
    );


if (statsSection) {

    statsObserver.observe(statsSection);

}


/* =========================================
   RE-ANIMATE COUNTERS WHEN LANGUAGE CHANGES
========================================= */

languageSwitch.addEventListener("click", () => {

    setTimeout(() => {

        counters.forEach(counter => {

            const value =
                Number(
                    counter.getAttribute("data-count")
                );

            counter.textContent =
                value.toLocaleString(
                    currentLanguage === "ar"
                        ? "ar"
                        : "en-US"
                );

        });

    }, 20);

});


/* =========================================
   REVEAL ANIMATIONS
========================================= */

const revealElements = document.querySelectorAll(
    ".service-card, .analytics-card, .insight-highlight, .about-image, .about-content, .big-stat, .trust-item"
);


revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(20px)";

    element.style.transition =
        "opacity .7s ease, transform .7s ease";

});


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";

                    entry.target.style.transform =
                        "translateY(0)";

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================
   SMOOTH ANCHOR SCROLL
========================================= */

document.querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

        anchor.addEventListener("click", function(event) {

            const targetId =
                this.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);


            if (!target) {
                return;
            }


            event.preventDefault();


            const navbarHeight =
                navbar.offsetHeight;


            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight;


            window.scrollTo({

                top: targetPosition,

                behavior: "smooth"

            });

        });

    });


/* =========================================
   DASHBOARD MICRO ANIMATION
========================================= */

const dashboard =
    document.querySelector(".dashboard-card");


if (dashboard) {

    let animationFrame;

    dashboard.addEventListener("mousemove", event => {

        if (window.innerWidth < 850) {
            return;
        }


        cancelAnimationFrame(animationFrame);


        animationFrame =
            requestAnimationFrame(() => {

                const rect =
                    dashboard.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;


                const rotateY =
                    ((x / rect.width) - .5) * 5;

                const rotateX =
                    ((y / rect.height) - .5) * -5;


                dashboard.style.transform =
                    `perspective(1000px)
                     rotateY(${rotateY}deg)
                     rotateX(${rotateX}deg)`;

            });

    });


    dashboard.addEventListener("mouseleave", () => {

        dashboard.style.transform =
            "perspective(1000px) rotateY(-5deg) rotateX(2deg)";

    });

}


/* =========================================
   CURRENT YEAR
========================================= */

const year =
    document.getElementById("year");


if (year) {

    year.textContent =
        new Date().getFullYear();

}


/* =========================================
   IMAGE ERROR FALLBACK
========================================= */

document.querySelectorAll("img")
    .forEach(image => {

        image.addEventListener("error", () => {

            image.style.display = "none";

            const parent =
                image.parentElement;

            if (parent) {

                parent.style.background =
                    "linear-gradient(135deg,#071B33,#12385F)";

            }

        });

    });


/* =========================================
   PAGE LOADED
========================================= */

window.addEventListener("load", () => {

    document.body.classList.add("page-loaded");

});
