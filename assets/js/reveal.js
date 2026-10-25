/* ZC Events website — scroll reveal. Headings, cards, photos and text rise and fade in as they come
   into view, and photos settle from a slight zoom. Loaded straight after the page's HTML, before React,
   so it starts at once; it only adds data attributes, which React leaves alone when it hydrates.
   The head script in build/build.mjs turns this on (html.reveal) only when the browser has
   IntersectionObserver and the visitor hasn't asked for reduced motion; if this file never runs, that
   script takes the class off again after a few seconds, so nothing can stay hidden. */
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('reveal') || !('IntersectionObserver' in window)) return;

  /* What reveals: blocks the server renders. Keep this list in step with site.css. */
  var SEL = [
    '.zc-section-heading', '.zc-event', '.home-offer', '.home-board', '.site-more',
    '.zc-gallery__item', '.pf-arches > li', '.about-intro__media', '.site-prose', '.about-make__item',
    '.about-ceremonies', '.about-step', '.enquire-note', '.enquire-aside > .zc-arch', '.enquire-faq__item',
  ].join(',');

  function show(el) { el.setAttribute('data-shown', ''); }

  // A working observer reports on every element at once, in view or not. If it hasn't said a word
  // within 2.5 s (some embedded or paused browsers never run it), show everything instead.
  var alive = false;
  setTimeout(function () {
    if (alive) return;
    io.disconnect();
    Array.prototype.forEach.call(document.querySelectorAll(SEL), show);
  }, 2500);

  var io = new IntersectionObserver(function (entries) {
    alive = true;
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      show(e.target);
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  function watch(el) {
    if (el.hasAttribute('data-shown') || el.hasAttribute('data-reveal')) return;
    el.setAttribute('data-reveal', '');
    // Inside another revealing block: let the outer block carry it.
    if (el.parentElement && el.parentElement.closest(SEL)) { show(el); return; }
    // Neighbours in a row come in one after another: up to four steps, then start again.
    var i = 0;
    for (var s = el.previousElementSibling; s; s = s.previousElementSibling) if (s.matches(SEL)) i++;
    if (i % 4) el.setAttribute('data-reveal-step', String(i % 4));
    io.observe(el);
  }

  Array.prototype.forEach.call(document.querySelectorAll(SEL), watch);

  // At the very bottom of the page, show whatever is left: the last band can sit too low to cross
  // the observer's line when the page can't scroll any further.
  window.addEventListener('scroll', function atBottom() {
    if (window.innerHeight + window.scrollY < document.documentElement.scrollHeight - 4) return;
    Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]:not([data-shown])'), show);
  }, { passive: true });

  // Anything React adds later appears at once rather than staying hidden.
  if ('MutationObserver' in window) {
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        Array.prototype.forEach.call(r.addedNodes, function (n) {
          if (n.nodeType !== 1) return;
          if (n.matches(SEL) && !n.hasAttribute('data-reveal')) show(n);
          Array.prototype.forEach.call(n.querySelectorAll(SEL), function (m) { if (!m.hasAttribute('data-reveal')) show(m); });
        });
      });
    }).observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
  }

  root.classList.add('reveal-ready');
})();
