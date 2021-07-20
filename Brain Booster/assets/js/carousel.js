const nextIcon = '<div class="btn btn-dark"><i class="fas fa-chevron-right"></i></div>';
const prevIcon = '<div class="btn btn-dark"><i class="fas fa-chevron-left"></i></div>';

$('.slider').owlCarousel({
    nav: true,
    navText: [
        prevIcon,
        nextIcon
    ],
    responsive: {
        0: {
            items: 1
        },
        500: {
            items:2
        },
        1000: {
            items: 3
        }
    }
});