(function($) {
    "use strict";
  
    const $documentOn = $(document);
    const $windowOn = $(window);
  
    $documentOn.ready( function() {
  
      /* ================================
       Mobile Menu Js Start
    ================================ */
    
      $('#mobile-menu').meanmenu({
        meanMenuContainer: '.mobile-menu',
        meanScreenWidth: "1199",
        meanExpand: ['<i class="far fa-plus"></i>'],
    });

       $('#mobile-menus').meanmenu({
        meanMenuContainer: '.mobile-menus',
        meanScreenWidth: "19920",
        meanExpand: ['<i class="far fa-plus"></i>'],
    });

     $documentOn.on("click", ".mean-expand", function () {
        let icon = $(this).find("i");

        if (icon.hasClass("fa-plus")) {
            icon.removeClass("fa-plus").addClass("fa-minus"); 
        } else {
            icon.removeClass("fa-minus").addClass("fa-plus"); 
        }
    });

    /* ================================
        Sidebar Toggle & Sticky Item Logic
        ================================ */

        // Open offcanvas
        $(".sidebar__toggle").on("click", function () {
        $(".offcanvas__info").addClass("info-open");
        $(".offcanvas__overlay").addClass("overlay-open");

        // Hide sticky item
        $(".sidebar-sticky-item").fadeOut().removeClass("active");
        });

        // Close offcanvas
        $(".offcanvas__close, .offcanvas__overlay").on("click", function () {
        $(".offcanvas__info").removeClass("info-open");
        $(".offcanvas__overlay").removeClass("overlay-open");

        // Show sticky item
        $(".sidebar-sticky-item").fadeIn().addClass("active");
        });

        /* ================================
        Body Overlay Js Start
        ================================ */

        $(".body-overlay").on("click", function () {
        $(".offcanvas__area").removeClass("offcanvas-opened");
        $(".df-search-area").removeClass("opened");
        $(".body-overlay").removeClass("opened");

        // Show sticky item when overlay clicked
        $(".sidebar-sticky-item").fadeIn().addClass("active");
        });

        /* ================================
        Offcanvas Link Click (Optional)
        ================================ */

        $(".offcanvas a").on("click", function () {
        $(".sidebar-sticky-item").fadeIn().addClass("active");
    });

    
      /* ================================
       Sticky Header Js Start
    ================================ */

       $windowOn.on("scroll", function () {
        if ($(this).scrollTop() > 250) {
          $("#header-sticky").addClass("sticky");
        } else {
          $("#header-sticky").removeClass("sticky");
        }
      });      
      
       /* ================================
       Video & Image Popup Js Start
    ================================ */

      $(".img-popup").magnificPopup({
        type: "image",
        gallery: {
          enabled: true,
        },
      });

      $(".video-popup").magnificPopup({
        type: "iframe",
        callbacks: {},
      });
  
      /* ================================
       Counterup Js Start
    ================================ */

      $(".count").counterUp({
        delay: 15,
        time: 4000,
      });
  
      /* ================================
       Wow Animation Js Start
    ================================ */

      new WOW().init();
  
      /* ================================
       Nice Select Js Start
    ================================ */

    if ($('.single-select').length) {
        $('.single-select').niceSelect();
    }

      /* ================================
       Parallaxie Js Start
    ================================ */

      if ($('.parallaxie').length && $(window).width() > 991) {
          if ($(window).width() > 768) {
              $('.parallaxie').parallaxie({
                  speed: 0.55,
                  offset: 0,
              });
          }
      }

      /* ================================
      Hover Active Js Start
    ================================ */

    $(".amount-list .amount-btn, .grt-core-box-2").hover(
		// Function to run when the mouse enters the element
		function () {
			// Remove the "active" class from all elements
			$(".amount-list .amount-btn, .grt-core-box-2").removeClass("active");
			// Add the "active" class to the currently hovered element
			$(this).addClass("active");
		}
	);

    /* ================================
      Custom Accordion Js Start
    ================================ */

    if ($('.accordion-box').length) {
        $(".accordion-box").on('click', '.acc-btn', function () {
            var outerBox = $(this).closest('.accordion-box');
            var target = $(this).closest('.accordion');
            var accBtn = $(this);
            var accContent = accBtn.next('.acc-content');

            if (target.hasClass('active-block')) {
                // Already open, so close it
                accBtn.removeClass('active');
                target.removeClass('active-block');
                accContent.slideUp(300);
            } else {
                // Close all others
                outerBox.find('.accordion').removeClass('active-block');
                outerBox.find('.acc-btn').removeClass('active');
                outerBox.find('.acc-content').slideUp(300);

                // Open clicked one
                accBtn.addClass('active');
                target.addClass('active-block');
                accContent.slideDown(300);
            }
        });
    }

    /* ================================
      Showcase Slider Js Start
    ================================ */

    $("[data-background]").each(function () {
			$(this).css("background-image", "url( " + $(this).attr("data-background") + "  )");
    });
    $("[data-mask-img]").each(function () {
        $(this).css("-webkit-mask-image", "url( " + $(this).attr("data-mask-img") + "  )");
    });

    $("[data-width], [data-height]").each(function () {
        const $this = $(this);
        
        // Set the width if data-width is present
        if ($this.attr("data-width")) {
                $this.css("width", $this.attr("data-width"));
        }

        // Set the height if data-height is present
        if ($this.attr("data-height")) {
                $this.css("height", $this.attr("data-height"));
        }
    });


    $("[data-bg-color]").each(function () {
        $(this).css("background-color", $(this).attr("data-bg-color"));
    });

    $("[data-text-color]").each(function () {
        $(this).css("color", $(this).attr("data-text-color"));
    });


    if ($('#showcase-slider-wrappper').length > 0) {
        // Function to update the active slide
        const updateActiveSlide = () => {
                $('.tp-slider-dot').find('.swiper-pagination-bullet').each(function () {
                        if (!$(this).hasClass("swiper-pagination-bullet-active")) {
                            handleActiveSlideClick('#trigger-slides .swiper-slide-active');
                            handleActiveSlideClick('#trigger-slides .swiper-slide-duplicate-active');
                        }
                });
        };

        // Function to handle slide click events
        const handleActiveSlideClick = (selector) => {
                $(selector).find('div').first().each(function () {
                        if (!$(this).hasClass("active")) {
                            $(this).trigger('click');
                        }
                });
        };

        // WebGL Shader Configuration
        const vertex = `
                varying vec2 vUv;
                void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
        `;
        const fragment = `
                varying vec2 vUv;
                uniform sampler2D currentImage;
                uniform sampler2D nextImage;
                uniform sampler2D disp;
                uniform float dispFactor;
                uniform float effectFactor;
                uniform vec4 resolution;
                void main() {
                        vec2 uv = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);
                        vec4 disp = texture2D(disp, uv);
                        vec2 distortedPosition = vec2(uv.x + dispFactor * (disp.r * effectFactor), uv.y);
                        vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * (disp.r * effectFactor), uv.y);
                        vec4 _currentImage = texture2D(currentImage, distortedPosition);
                        vec4 _nextImage = texture2D(nextImage, distortedPosition2);
                        vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
                        gl_FragColor = finalTexture;
                }
        `;

        const gl_canvas = new WebGL({
            vertex: vertex,
            fragment: fragment,
        });

        // Add events for the slide triggers
        const addEvents = () => {
            const triggerSlide = Array.from(document.getElementById('trigger-slides').querySelectorAll('.slide-wrap'));
            gl_canvas.isRunning = false;

            triggerSlide.forEach((el) => {
                el.addEventListener('click', function () {
                    if (!gl_canvas.isRunning) {
                        gl_canvas.isRunning = true;

                        document.getElementById('trigger-slides').querySelectorAll('.active')[0].className = '';
                        this.className = 'active';

                        const slideId = parseInt(this.dataset.slide, 10);

                        gl_canvas.material.uniforms.nextImage.value = gl_canvas.textures[slideId];
                        gl_canvas.material.uniforms.nextImage.needsUpdate = true;

                        gsap.to(gl_canvas.material.uniforms.dispFactor, {
                                duration: 1,
                                value: 1,
                                ease: 'Sine.easeInOut',
                                onComplete: function () {
                                        gl_canvas.material.uniforms.currentImage.value = gl_canvas.textures[slideId];
                                        gl_canvas.material.uniforms.currentImage.needsUpdate = true;
                                        gl_canvas.material.uniforms.dispFactor.value = 0.0;
                                        gl_canvas.isRunning = false;
                                },
                        });
                    }
                });
            });
        };

        // Initialize Swiper
        const showcaseSwiper = new Swiper('#showcase-slider', {
            direction: "horizontal",
            loop: true,
            slidesPerView: 'auto',
            touchStartPreventDefault: false,
            speed: 1000,
            mousewheel: false,
            autoplay: {
                delay: 2000,
            },
            effect: 'fade',
            simulateTouch: true,
            parallax: true,
            navigation: {
                clickable: true,
                prevEl: '.tp-hero-prev',
                nextEl: '.tp-hero-next',
            },
            pagination: {
                el: '.tp-slider-dot',
                clickable: true,
            },
            on: {
                slidePrevTransitionStart: function () {
                    updateActiveSlide();
                },
                slideNextTransitionStart: function () {
                    updateActiveSlide();
                },
                init: function () {
                    updateSlideNumbers(this); // Update numbers on initial load
                },
                slideChange: function () {
                    updateSlideNumbers(this); // Update numbers when slide changes
                }
            },
        });

        // Function to update slide numbers
        function updateSlideNumbers(swiper) {
            const current = swiper.realIndex + 1; // Get the real index of the current slide
            const numbers = document.querySelector('.tp-hero-7-slider-numbers');
            const formattedCurrent = current < 10 ? `0${current}` : current; // Add leading zero for single digits
            numbers.innerHTML = `${formattedCurrent}`;
        }

        addEvents();
    }

    /* ================================
      Brand Slider Js Start
    ================================ */

   if ($('.brand-slider').length > 0) {
    const brandSlider = new Swiper(".brand-slider", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".array-next",
            prevEl: ".array-prev",
        },
        breakpoints: {
            1399: {
                slidesPerView: 6,
            },
            1199: {
                slidesPerView: 5.5,
            },
            991: {
                slidesPerView: 4.5,
            },
            767: {
                slidesPerView: 4,
            },
            575: {
                slidesPerView: 3,
            },
            410: {
                slidesPerView: 2,
            },
            0: {
                slidesPerView: 1,
            },
        },
    });
   }

    /* ================================
      Causes Slider Js Start
    ================================ */
   if ($('.causes-slider').length > 0) {
    const causesSlider = new Swiper(".causes-slider", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".array-next",
            prevEl: ".array-prev",
        },
        pagination: {
            el: ".dot",
            clickable: true,
        },
        breakpoints: {
            1699: {
                slidesPerView: 4,
            },
            1399: {
                slidesPerView: 3.5,
            },
            1199: {
                slidesPerView: 3.1,
            },
            991: {
                slidesPerView: 3,
            },
            767: {
                slidesPerView: 2,
            },
            575: {
                slidesPerView: 1.5,
            },
            0: {
                slidesPerView: 1.2,
            },
        },
    });
   }

   /* ================================
      Testimonial Slider Js Start
    ================================ */
   if ($('.testimonial-slider').length > 0) {
    const testimonialSlider = new Swiper(".testimonial-slider", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".array-next",
            prevEl: ".array-prev",
        },
    });
   }

    if ($('.testimonial-slider-2').length > 0) {
    const testimonialSlider2 = new Swiper(".testimonial-slider-2", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".array-next",
            prevEl: ".array-prev",
        },
        breakpoints: {
            991: {
                slidesPerView: 2,
            },
            767: {
                slidesPerView: 1,
            },
            575: {
                slidesPerView: 1,
            },
            0: {
                slidesPerView: 1,
            },
        },
    });
   }

    if ($('.testimonial-slider-4').length > 0) {
    const testimonialSlider4 = new Swiper(".testimonial-slider-4", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".array-next",
            prevEl: ".array-prev",
        },
        breakpoints: {
            1199: {
                slidesPerView: 3,
            },
            991: {
                slidesPerView: 2,
            },
            767: {
                slidesPerView: 2,
            },
            575: {
                slidesPerView: 1.4,
            },
            0: {
                slidesPerView: 1,
            },
        },
    });
   }

    if ($('.testimonial-slider-inner').length > 0) {
    const testimonialSliderInner = new Swiper(".testimonial-slider-inner", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: ".array-next",
            prevEl: ".array-prev",
        },
        breakpoints: {
            1399: {
                slidesPerView: 4,
            },
             1199: {
                slidesPerView: 3,
            },
            991: {
                slidesPerView: 2,
            },
            767: {
                slidesPerView: 2,
            },
            575: {
                slidesPerView: 1.4,
            },
            0: {
                slidesPerView: 1,
            },
        },
    });
   }

    /* ================================
      News Slider Js Start
    ================================ */
   if ($('.grt-news-slider').length > 0) {
    const grtNewsSlider = new Swiper(".grt-news-slider", {
        spaceBetween: 30,
        speed: 1300,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
         navigation: {
            nextEl: ".array-next",
            prevEl: ".array-prev",
        },
         breakpoints: {
            1399: {
                slidesPerView: 3,
            },
            1199: {
                slidesPerView: 2.5,
            },
            991: {
                slidesPerView: 2,
            },
            767: {
                slidesPerView: 1.6,
            },
            575: {
                slidesPerView: 1.5,
            },
            0: {
                slidesPerView: 1,
            },
        },
    });
   }

    /* ================================
    Footer Box Slider Js Start
    ================================ */
   if ($('.grt-footer-box-slider').length > 0) {
    const grtFooterBoxSlider = new Swiper(".grt-footer-box-slider", {
        spaceBetween: 60,
        speed: 1300,
        loop: true,
        // autoplay: {
        //     delay: 2000,
        //     disableOnInteraction: false,
        // },
         navigation: {
            nextEl: ".array-next",
            prevEl: ".array-prev",
        },
         breakpoints: {
            1119: {
                slidesPerView: 6,
            },
            991: {
                slidesPerView: 2,
            },
            767: {
                slidesPerView: 1.6,
            },
            575: {
                slidesPerView: 1.5,
            },
            0: {
                slidesPerView: 1,
            },
        },
    });
   }

   /* ================================
        Countdown Js Start
    ================================ */

    let targetDate = new Date("2026-8-29 00:00:00").getTime();
    const countdownInterval = setInterval(function () {
        let currentDate = new Date().getTime();
        let remainingTime = targetDate - currentDate;

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            // Display a message or perform any action when the countdown timer reaches zero
            $("#countdown-container").text("Countdown has ended!");
        } else {
            let days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
            let hours = Math.floor(
                (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            );
            let minutes = Math.floor(
                (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
            );
            let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            // Pad single-digit values with leading zeros
            $("#day").text(days.toString().padStart(2, "0"));
            $("#hour").text(hours.toString().padStart(2, "0"));
            $("#min").text(minutes.toString().padStart(2, "0"));
            $("#sec").text(seconds.toString().padStart(2, "0"));
        }
    }, 1000);


    /* ================================
        Mouse Cursor Animation Js Start
    ================================ */

    if ($(".mouseCursor").length > 0) {
        function itCursor() {
            var myCursor = jQuery(".mouseCursor");
            if (myCursor.length) {
                if ($("body")) {
                    const e = document.querySelector(".cursor-inner"),
                        t = document.querySelector(".cursor-outer");
                    let n, i = 0, o = !1;
                    window.onmousemove = function(s) {
                        if (!o) {
                            t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
                        }
                        e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
                        n = s.clientY;
                        i = s.clientX;
                    };
                    $("body").on("mouseenter", "button, a, .cursor-pointer", function() {
                        e.classList.add("cursor-hover");
                        t.classList.add("cursor-hover");
                    });
                    $("body").on("mouseleave", "button, a, .cursor-pointer", function() {
                        if (!($(this).is("a", "button") && $(this).closest(".cursor-pointer").length)) {
                            e.classList.remove("cursor-hover");
                            t.classList.remove("cursor-hover");
                        }
                    });
                    e.style.visibility = "visible";
                    t.style.visibility = "visible";
                }
            }
        }
        itCursor();
    }

    /* ================================
        Back To Top Button Js Start
    ================================ */
    $windowOn.on('scroll', function() {
        var windowScrollTop = $(this).scrollTop();
        var windowHeight = $(window).height();
        var documentHeight = $(document).height();

        if (windowScrollTop + windowHeight >= documentHeight - 10) {
            $("#back-top").addClass("show");
        } else {
            $("#back-top").removeClass("show");
        }
    });

    $documentOn.on('click', '#back-top', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    /* ================================
       Search Popup Toggle Js Start
    ================================ */

    if ($(".search-toggler").length) {
        $(".search-toggler").on("click", function(e) {
            e.preventDefault();
            $(".search-popup").toggleClass("active");
            $("body").toggleClass("locked");
        });
    }

    
	
    /* ================================
       Smooth Scroller And Title Animation Js Start
    ================================ */
    if ($('#smooth-wrapper').length && $('#smooth-content').length) {
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

        gsap.config({
            nullTargetWarn: false,
        });

        let smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 2,
            effects: true,
            smoothTouch: 0.1,
            normalizeScroll: false,
            ignoreMobileResize: true,
        });
    }

    /* ================================
       Text Anim Js Start
    ================================ */

      if (
    typeof SplitText !== "undefined" &&
        document.querySelectorAll(".split-title").length > 0
        ) {
    document.querySelectorAll(".split-title").forEach((title) => {

        // split by words + chars (IMPORTANT)
        const split = new SplitText(title, {
        type: "words,chars"
        });

        // add class to chars
        split.chars.forEach((char) => {
        char.classList.add("char");
        });

        // GSAP animation
        gsap.to(split.chars, {
        scrollTrigger: {
            trigger: title,
            start: "top 90%",
            toggleActions: "play none none none"
        },
        duration: 0.8,
        clipPath: "inset(0% 0% -15% 0%)",
        x: 0,
        opacity: 1,
        ease: "power4.out",
        stagger: 0.03
        });

    });
    }

     if (typeof gsap !== "undefined") {
          gsap.registerPlugin(ScrollTrigger, SplitText);

          let mm = gsap.matchMedia();

          mm.add("(min-width: 1200px)", () => {

              let splits = [];

              // ===== tz-sub-tilte =====
              $('.tz-sub-tilte').each(function (index, el) {

              let split = new SplitText(el, {
                  type: "lines,words,chars",
                  linesClass: "split-line"
              });

              splits.push(split);

              gsap.set(split.chars, {
                  opacity: 0,
                  x: 7
              });

              gsap.to(split.chars, {
                  scrollTrigger: {
                  trigger: el,
                  start: "top 90%",
                  end: "top 60%",
                  scrub: 1
                  },
                  x: 0,
                  opacity: 1,
                  duration: 0.7,
                  stagger: 0.2
              });
              });

              // ===== tz-itm-title =====
              $('.tz-itm-title').each(function (index, el) {

              let split = new SplitText(el, {
                  type: "lines,words,chars",
                  linesClass: "split-line"
              });

              splits.push(split);

              gsap.set(split.chars, {
                  opacity: 0.3,
                  x: -7
              });

              gsap.to(split.chars, {
                  scrollTrigger: {
                  trigger: el,
                  start: "top 92%",
                  end: "top 60%",
                  scrub: 1
                  },
                  x: 0,
                  opacity: 1,
                  duration: 0.7,
                  stagger: 0.2
              });
              });

              // ðŸ”¥ MOST IMPORTANT PART
              ScrollTrigger.refresh();

              // ðŸ”¥ cleanup on breakpoint change
              return () => {
              splits.forEach(split => split.revert());
              ScrollTrigger.getAll().forEach(st => st.kill());
              };

          });
    }

    /* ================================
    Scale Up Image Js Start
    ================================ */

    if (typeof ScrollTrigger !== "undefined") {

    ScrollTrigger.matchMedia({

        // ✅ XL and up → animation ON
        "(min-width: 1200px)": function () {

        document.querySelectorAll(".scale-up-img").forEach((section) => {

            const img = section.querySelector(".scale-up");

            let tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom center",
                scrub: 1
            }
            });

            tl.to(img, {
            scale: 1.15,
            ease: "none"
            });

        });

        },

        // ❌ Below XL → animation OFF + reset
        "(max-width: 1199px)": function () {

        // kill all related ScrollTriggers
        ScrollTrigger.getAll().forEach((st) => {
            if (st.trigger && st.trigger.classList.contains("scale-up-img")) {
            st.kill();
            }
        });

        // reset scale
        document.querySelectorAll(".scale-up-img .scale-up").forEach((img) => {
            gsap.set(img, { scale: 1 });
        });

        }

    });

    }

     /* ================================
    Animate Circle Js Start
    ================================ */

    if ($('.bz-gsap-animate-circle').length) {
    gsap.utils.toArray('.bz-gsap-animate-circle').forEach((el) => {

        // Accessibility: reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(el, { rotate: 0 });
        return;
        }

        gsap.timeline({
        scrollTrigger: {
            trigger: el,
            scrub: 1,
            start: "top 80%",
            end: "top 20%",
            markers: false
        }
        })
        .set(el, { transformOrigin: "50% 50%" })
        .fromTo(
        el,
        { rotate: 0 },
        { rotate: 180, ease: "none" }
        );
    });
    }
  


  
    }); // End Document Ready Function

    /* ================================
       Preloader Js Start
    ================================ */
    $windowOn.on('load', function() {
        $(".preloader").fadeOut(600);
    });

  
  })(jQuery); // End jQuery




