const scrollRevealOptions = {
    distance: "50px",
    origin: "bottom",
    duration: 1000,
};

scrollReveal().reveal(".container .letter-s",{
    duration: 1000,
    delay: 1000,
});

scrollReveal().reveal(".container .img",{
    duration: 1000,
    delay: 1500,
});

scrollReveal().reveal(".container .text__left",{
    ...scrollRevealOptions,
    origin: "right",
    delay: 2000,
});

scrollReveal().reveal(".container .text__right",{
    ...scrollRevealOptions,
    origin: "left",
    delay: 2000,
    
});

scrollReveal().reveal(".container .explore",{
    duration: 1000,
    delay: 2500,
});

scrollReveal().reveal(".container .catalog",{
    duration: 1000,
    delay: 5000,
});

scrollReveal().reveal(".container .print",{
    duration: 1000,
    delay: 5500,
});

scrollReveal().reveal(".container .h5",{
    duration: 1000,
    interval: 500,
    delay: 3000,
});

scrollReveal().reveal(".container .footer p",{
    duration: 1000,
    delay: 7000,
});

