// Parallax
const parallax_el = document.querySelectorAll(".parallax");
const main = document.querySelector("main");

let xValue = 0,
    yValue = 0;

let rotateDegree = 0;  

function ahsiap(cursorPosition){
    parallax_el.forEach((el) => {
        let speedx      = el.dataset.speedx;
        let speedy      = el.dataset.speedy;
        let speedz      = el.dataset.speedz;
        let rotateSpeed = el.dataset.rotation;


        let isInLeft = 
            parseFloat(getComputedStyle(el).left) < window.innerWidth / 2 ? 1 : -1;
        let zValue =
            (cursorPosition - parseFloat(getComputedStyle(el).left)) * isInLeft * 0.1;

        el.style.transform = `perspective(2300px) translateZ(${
            zValue * speedz
        }px) rotateY(${rotateDegree * rotateSpeed}deg) translateX(calc(-50% + ${
            -xValue * speedx
        }px)) translateY(calc(-50% + ${yValue * speedy}px))`;
    });
}
// -------------------------------------------------------------------------------------------
// Activate parallax
ahsiap(0);

window.addEventListener("mousemove", (e) =>{
    if(timeline.isActive()) return;

    xValue = e.clientX - window.innerWidth / 2;
    yValue = e.clientY - window.innerHeight / 2;

    rotateDegree = (xValue / (window.innerWidth / 2)) * 20;

    ahsiap(e.clientX);
});


// if (window.innerWidth <= 725){
//     main.style.maxHeight = `${window.innerWidth * 0.6}px`;
// } else {
//     main.style.maxHeight = `${window.innerWidth * 1.6}px`;
// }   

// GSAP animation
let timeline = gsap.timeline();


timeline
Array.from(parallax_el)
    .filter((el) => !el.classList.contains("text"))
    .forEach((el) =>{
        timeline.from(
            el,
            {
                top: `${el.offsetHeight / 2 + +el.dataset.distance}px`,
                duration: 4.5,
                ease: "power3.out",
            },
            "0"  
        );
    });

timeline.from(
    ".text h1",
    {
        y: window.innerHeight - 
            document.querySelector(".text h1").getBoundingClientRect().top + 200,
            duration: 4,
    }, 
    "1.5"

).from(
    ".text h2",
    {
        y: -150,
        opacity: 0,
        duration: 3.5,
    },
    "2"

).from(
    ".palabapakkau",{
    opacity: 0,
    duration: 3,
    },
    "2"
);


// ---------------------------------------------------------------

// card swiper
const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);

// ------------------------------------------------
