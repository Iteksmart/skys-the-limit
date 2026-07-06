/* Sky's The Limit Travels — interactions */
(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ---------- sticky header shadow ---------- */
  var header = $(".site-header");
  var onScrollHeader = function () {
    header.classList.toggle("scrolled", window.scrollY > 8);
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

  /* ---------- reveal on scroll ---------- */
  var revealEls = $$(".reveal");
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
