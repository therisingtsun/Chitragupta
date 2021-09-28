TweenMax.to(".block-1", 2, {
    x: "120",
    y: "-100",
    scale: "2.4",
    ease: Expo.easeInOut,
});

TweenMax.to(".block-2", 2, {
    x: "-130",
    y: "200",
    scale: "1.2",
    ease: Expo.easeInOut,
});

TweenMax.to(".block-3", 2, {
    x: "180",
    y: "-240",
    scale: "1.6",
    ease: Expo.easeInOut,
});

TweenMax.to(".block-4", 2, {
    x: "280",
    y: "240",
    scale: "0",
    ease: Expo.easeInOut,
});

TweenMax.to(".block-5", 2, {
    x: "380",
    y: "140",
    scale: "0",
    ease: Expo.easeInOut,
});

TweenMax.to(".block-6", 2, {
    x: "280",
    y: "-40",
    scale: "0",
    ease: Expo.easeInOut,
});

TweenMax.to(".block-7", 2, {
    x: "-80",
    y: "340",
    scale: "1.5",
    ease: Expo.easeInOut,
});

TweenMax.to(".block-8", 2, {
    x: "380",
    y: "400",
    scale: "0",
    ease: Expo.easeInOut,
});

TweenMax.to(".block-9", 2, {
    x: "280",
    y: "240",
    scale: "0",
    ease: Expo.easeInOut,
});

TweenMax.to(".block-10", 2, {
    x: "320",
    y: "240",
    scale: "1.5",
    ease: Expo.easeInOut,
});

TweenMax.to(".block-11", 2, {
    x: "280",
    y: "240",
    scale: "0",
    ease: Expo.easeInOut,
});

TweenMax.to(".box", 2.4, {
    y: "-100%",
    ease: Expo.easeInOut,
});

TweenMax.from(".circle-shape", 2.4, {
    scale: "0",
    ease: Expo.easeInOut,
});
TweenMax.from(".circle-shape-2", 2.4, {
    scale: "0",
    ease: Expo.easeInOut,
});
TweenMax.from(".circle-shape-3", 2.4, {
    scale: "0",
    ease: Expo.easeInOut,
});
TweenMax.from(".navbar > div", 1.6, {
    opacity: 0,
    y: 60,
    ease: Expo.easeInOut,
    delay: 0.6,
});
TweenMax.from(".site-logo", 1.6, {
    opacity: 0,
    y: 40,
    ease: Expo.easeInOut,
    delay: 0.6,
});
TweenMax.staggerFrom(
    ".site-menu > div",
    1,
    {
        opacity: 0,
        y: 60,
        ease: Power2.easeOut,
    },
    0.2
);