/* Sky's The Limit Travels — interactions */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };

  /* ---------- split [data-split] text into masked words ---------- */
  $$("[data-split]").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w, i) {
      return '<span class="msk"><span class="mw" style="--wi:' + i + '">' + w + "</span></span>";
    }).join(" ");
  });

  /* ---------- sticky header: shadow + hide on scroll down ---------- */
  var header = $(".site-header");
  var lastY = window.scrollY;
  var onScrollHeader = function () {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 8);
    if (!reducedMotion) {
      var navOpen = mainNav && mainNav.classList.contains("open");
      var goingDown = y > lastY + 4;
      var goingUp = y < lastY - 4;
      if (goingDown && y > 420 && !navOpen) header.classList.add("hide");
      else if (goingUp || y <= 420 || navOpen) header.classList.remove("hide");
    }
    lastY = y;
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- mobile nav ---------- */
  var navToggle = $("#nav-toggle");
  var mainNav = $("#main-nav");

  var closeNav = function () {
    if (mainNav.classList.contains("open") && mainNav.contains(document.activeElement)) {
      navToggle.focus();
    }
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  };

  navToggle.addEventListener("click", function () {
    var open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  mainNav.addEventListener("click", function (e) {
    if (e.target.closest("a")) closeNav();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* ---------- nav active state on scroll ---------- */
  var navLinks = $$(".main-nav a");
  var sections = navLinks
    .map(function (a) {
      var id = a.getAttribute("href");
      return id && id.length > 1 ? $(id) : null;
    });

  var setActive = function () {
    var pos = window.scrollY + 140;
    var current = 0;
    var bestTop = -Infinity;
    sections.forEach(function (sec, i) {
      if (!sec) return;
      var top = sec.getBoundingClientRect().top + window.scrollY;
      if (top <= pos && top > bestTop) {
        bestTop = top;
        current = i;
      }
    });
    navLinks.forEach(function (a, i) {
      a.classList.toggle("active", i === current);
      if (i === current) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  };
  window.addEventListener("scroll", setActive, { passive: true });

  /* ---------- booking type buttons ---------- */
  var tabs = $$(".booking-tabs .tab");
  var fromInput = $("#bf-from");
  var toInput = $("#bf-to");

  var TAB_PLACEHOLDERS = {
    flights:  { from: "Leaving From",  to: "Going To" },
    hotels:   { from: "City or Hotel", to: "Area or Landmark" },
    packages: { from: "Departure City", to: "Dream Destination" },
    cruises:  { from: "Departure Port", to: "Cruise Region" }
  };

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-pressed", String(t === tab));
      });
      var ph = TAB_PLACEHOLDERS[tab.dataset.tab];
      if (ph) {
        fromInput.placeholder = ph.from;
        toInput.placeholder = ph.to;
      }
    });
  });

  /* ---------- swap from/to ---------- */
  $("#bf-swap").addEventListener("click", function () {
    var tmp = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = tmp;
  });

  /* ---------- toast ---------- */
  var toast = $("#toast");
  var toastTimer;
  var showToast = function (msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 3800);
  };

  /* ---------- booking form ---------- */
  $("#booking-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var kind = $(".booking-tabs .tab.active").textContent.trim().toLowerCase();
    var from = fromInput.value.trim();
    var to = toInput.value.trim();
    var msg = to
      ? "Searching " + kind + (from ? " from " + from : "") + " to " + to + "… ✈ Our travel experts will take it from here!"
      : "Tell us where you're headed and we'll find the perfect " + kind + " for you! ✈";
    showToast(msg);
  });

  /* ---------- newsletter ---------- */
  $("#news-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var email = $("#news-email");
    showToast("Welcome aboard, " + email.value.trim() + "! Exclusive deals are on the way. 🌴");
    email.value = "";
  });

  /* ---------- watch video ---------- */
  $("#watch-video").addEventListener("click", function (e) {
    e.preventDefault();
    showToast("Our destination reel is coming soon — stay tuned! 🎬");
  });

  /* ---------- reveal on scroll (blocks + split headlines) ---------- */
  var revealEls = $$(".reveal, [data-split]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- marquee: clone track content for a seamless loop ---------- */
  var mqTrack = $(".marquee-track");
  if (mqTrack && mqTrack.children.length === 1) {
    mqTrack.appendChild(mqTrack.children[0].cloneNode(true));
  }

  /* ---------- rAF loop: scroll progress, parallax, custom cursor ---------- */
  var progressEl = $(".scroll-progress");
  var parallaxEls = reducedMotion ? [] : $$("[data-parallax]").map(function (el) {
    return { el: el, speed: parseFloat(el.getAttribute("data-parallax")) || 0 };
  });

  var cursorDot = $(".cursor-dot");
  var cursorRing = $(".cursor-ring");
  var useCursor = finePointer && !reducedMotion && cursorDot && cursorRing;
  var mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;

  if (useCursor) {
    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.body.classList.add("has-cursor");
    }, { passive: true });
    document.addEventListener("mouseleave", function () {
      document.body.classList.remove("has-cursor");
    });
    document.addEventListener("mouseover", function (e) {
      document.body.classList.toggle("cursor-link", !!e.target.closest("a, button, select, input"));
    });
  }

  var tick = function () {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    if (progressEl) doc.style.setProperty("--sp", max > 0 ? (window.scrollY / max).toFixed(4) : 0);

    var vh = window.innerHeight;
    parallaxEls.forEach(function (p) {
      var r = p.el.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) return;
      var offset = (r.top + r.height / 2 - vh / 2) * p.speed;
      p.el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
    });

    if (useCursor) {
      ringX = lerp(ringX, mouseX, 0.16);
      ringY = lerp(ringY, mouseY, 0.16);
      cursorDot.style.transform = "translate3d(" + mouseX + "px," + mouseY + "px,0)";
      cursorRing.style.transform = "translate3d(" + ringX.toFixed(1) + "px," + ringY.toFixed(1) + "px,0)";
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  /* ---------- 3D tilt on cards ---------- */
  if (finePointer && !reducedMotion) {
    $$("[data-tilt]").forEach(function (card) {
      var lift = card.classList.contains("dest-card") ? -8 : -6;
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -7;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 7;
        card.style.transition = "transform .12s ease-out, box-shadow .35s ease";
        card.style.transform = "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(" + lift + "px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transition = "";
        card.style.transform = "";
      });
    });

    /* ---------- magnetic buttons ---------- */
    $$("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = clamp((e.clientX - r.left - r.width / 2) * 0.22, -8, 8);
        var dy = clamp((e.clientY - r.top - r.height / 2) * 0.22, -8, 8);
        btn.style.transform = "translate(" + dx.toFixed(1) + "px," + (dy - 3).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- inertial wheel scrolling ---------- */
  if (finePointer && !reducedMotion) {
    var target = window.scrollY;
    var current = window.scrollY;
    var animating = false;

    var smoothStep = function () {
      current = lerp(current, target, 0.11);
      if (Math.abs(target - current) < 0.6) {
        current = target;
        animating = false;
      }
      window.scrollTo({ top: current, behavior: "instant" });
      if (animating) requestAnimationFrame(smoothStep);
    };

    window.addEventListener("wheel", function (e) {
      if (e.ctrlKey || e.metaKey || e.defaultPrevented) return;
      var delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 32;
      else if (e.deltaMode === 2) delta *= window.innerHeight;
      e.preventDefault();
      var doc = document.documentElement;
      target = clamp(target + delta, 0, doc.scrollHeight - doc.clientHeight);
      if (!animating) {
        animating = true;
        requestAnimationFrame(smoothStep);
      }
    }, { passive: false });

    /* keep in sync with scrolls we didn't cause (anchors, keyboard, scrollbar) */
    window.addEventListener("scroll", function () {
      if (!animating) {
        target = window.scrollY;
        current = window.scrollY;
      }
    }, { passive: true });
  }

  /* ---------- back to top ---------- */
  var toTop = $("#to-top");
  var onScrollTop = function () {
    toTop.classList.toggle("show", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScrollTop, { passive: true });
  onScrollTop();

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- date fields: min = today (local time, not UTC) ---------- */
  ["bf-depart", "bf-return"].forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener("focus", function () {
      var d = new Date();
      var pad = function (n) { return String(n).padStart(2, "0"); };
      el.min = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    });
  });
})();
