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

TweenMax.staggerFrom(
	".navbar > div",
	0.8,
	{
		x: "-80",
		opacity: 0,
		ease: Power3.easeOut,
		delay: 1,
	},
	0.08
);
TweenMax.staggerFrom(
	".images > div",
	0.8,
	{
		x: "-80",
		opacity: 0,
		ease: Power3.easeOut,
		delay: 1,
	},
	0.08
);
TweenMax.staggerTo(
	".navbar > div",
	0.8,
	{
		x: "80",
		opacity: 0,
		ease: Power3.easeOut,
		delay: 4,
	},
	0.04
);
TweenMax.staggerTo(
	".images > div",
	0.4,
	{
		scale: "0",
		opacity: 0,
		ease: Power3.easeOut,
		delay: 4,
	},
	0.04
);
TweenMax.to(".overlay", 1.2, {
	top: "-100%",
	ease: Expo.easeOut,
	delay: 5,
});
TweenMax.to(".shapes", 0, {
	zIndex: 0,
	delay: 5.2
});