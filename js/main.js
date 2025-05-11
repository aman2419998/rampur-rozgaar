document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const loc = params.get('location') || '';
    const cat = params.get('category') || '';
    const categoryLinks = document.querySelectorAll('.cat-item');

    categoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            const encodedCategory = encodeURIComponent(category);
            window.location.href = `job-list.html?category=${encodedCategory}`;
        });
    });


    const hasTabs = document.querySelector('[data-bs-toggle="pill"]') !== null;
    const fullTimeTab = document.querySelector('[data-category="Full Time"]');
    const featuredTab = document.querySelector('[data-category="featured"]');

    // 👇 If no tabs (like index.html), load featured jobs directly
    if (!hasTabs) {
        loadFeaturedJobs();
        return;
    }

    // 🔁 Tab-based pages
    if (loc || cat) {
        if (fullTimeTab) fullTimeTab.classList.add('active');
        if (featuredTab) featuredTab.classList.remove('active');
        loadJobs(cat, loc, 'Full Time');
    } else {
        if (featuredTab) featuredTab.classList.add('active');
        if (fullTimeTab) fullTimeTab.classList.remove('active');
        loadFeaturedJobs();
    }

    // 🧠 Tab switching logic
    document.querySelectorAll('[data-bs-toggle="pill"]').forEach(tab => {
        tab.addEventListener('click', function () {
            const tabCat = this.getAttribute('data-category');
            const loc = new URLSearchParams(window.location.search).get('location') || '';
            const cat = new URLSearchParams(window.location.search).get('category') || '';

            if (tabCat === 'featured') {
                loadFeaturedJobs();
            } else {
                loadJobs(cat, loc, tabCat);
            }
        });
    });
});



(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();


    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').css('top', '0px');
        } else {
            $('.sticky-top').css('top', '-100px');
        }
    });


    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: true,
        loop: true,
        nav: true,
        navText: [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            }
        }
    });

})(jQuery);

