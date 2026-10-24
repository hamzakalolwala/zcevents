/* ZC Events website — the parts every page shares: contact details, navigation, the photo catalogue,
   the page frame and section bands. A classic script that runs twice: in build/build.mjs (server
   React, no DOM) to write each page as HTML, and in the browser to hydrate it. Never touch window,
   document or localStorage while rendering; only inside effects and event handlers. */
(function (w) {
  var React = w.React, Z = w.ZCEvents, h = React.createElement;
  var SITE = (w.ZCSite = w.ZCSite || { pages: {} });

  SITE.EMAIL = 'zehracreationzc@gmail.com';
  /** The studio's WhatsApp number: country code then number, digits only (e.g. '919800000000').
      Empty: the enquiry form sends by email. Set: it sends on WhatsApp, with email still offered. */
  SITE.WHATSAPP = '919884939952';
  /** A link that opens a WhatsApp chat with the studio, with `text` already typed in. WhatsApp's own
      send link, not the wa.me short link: wa.me's redirect turns emoji into "�". */
  SITE.whatsappHref = function (text) {
    return 'https://api.whatsapp.com/send?phone=' + SITE.WHATSAPP + (text ? '&text=' + encodeURIComponent(text) : '');
  };
  /** Leave for a mailto: or WhatsApp link. WhatsApp opens in a new tab (the app, on a phone) so the
      thank-you note stays on the site; if the browser blocks that, it opens here instead. */
  SITE.go = function (url, newTab) {
    if (newTab) {
      var win = w.open(url, '_blank');
      if (win) { try { win.opener = null; } catch (e) { /* cross-origin already */ } return; }
    }
    w.location.href = url;
  };
  /** The like counter (likes-worker/ in the project, a Cloudflare Worker): GET reads the count,
      POST adds one. Empty: no like button is shown. */
  SITE.LIKES_URL = 'https://zc-events-likes.hamzabadri521.workers.dev/likes';
  SITE.YEAR = 2026;
  /** Who built the site: a quiet credit after the photo credit in every footer. */
  SITE.MAKER = { name: 'Hamza Badri', email: 'hamzabadri521@gmail.com' };
  SITE.CREDIT = 'Photography: Clicktography';

  SITE.HREF = { home: 'index.html', portfolio: 'portfolio.html', about: 'about.html', enquire: 'enquire.html' };
  SITE.NAV = [
    { key: 'portfolio', label: 'Portfolio', href: SITE.HREF.portfolio },
    { key: 'about', label: 'About', href: SITE.HREF.about },
  ];
  SITE.CTA = { label: 'Enquire', href: SITE.HREF.enquire };

  /* ---------- photo catalogue ----------
     Every photograph the site may show, keyed by file name. alt describes the setup; caption says
     what was made (never whose wedding or which hall); ceremony only where the studio's notes give
     one. ratio is the file's own shape; position is the crop that keeps the setup centred. */
  var P = 'assets/photos/';
  function photo(file, o) { o.key = file; o.src = P + file + '.webp'; return o; }
  SITE.PHOTOS = {
    'wisteria-canopy-fan-stage': photo('wisteria-canopy-fan-stage', { kind: 'stage', ratio: '3 / 2', position: '50% 62%',
      alt: 'White wisteria canopy over a cream shell sofa, with a glowing fan-shaped backdrop and gold vases',
      caption: 'Wisteria canopy' }),
    'wisteria-mirror-aisle': photo('wisteria-mirror-aisle', { kind: 'entrance', ratio: '3 / 2', position: '58% 50%',
      alt: 'Mirror aisle lined with candles and greenery, leading to a stage under hanging wisteria',
      caption: 'Wisteria canopy and mirror aisle' }),
    'wisteria-canopy-detail': photo('wisteria-canopy-detail', { kind: 'detail', ratio: '3 / 2', position: '40% 40%',
      alt: 'Hanging white wisteria, glass lamps and a lily-printed backdrop',
      caption: 'Wisteria and glass lamps' }),
    'royal-blue-velvet-arches': photo('royal-blue-velvet-arches', { kind: 'stage', ratio: '2 / 1', position: '50% 50%',
      alt: 'Royal blue velvet backdrop with three white arches, blue roses, a carved sofa and a Persian rug',
      caption: 'Royal blue velvet and white arches' }),
    'blue-gypsophila-vase': photo('blue-gypsophila-vase', { kind: 'detail', ratio: '2 / 3', position: '50% 40%',
      alt: 'Blue-tinted gypsophila in a glass vase beside blue roses',
      caption: 'Blue gypsophila' }),
    'lavender-cafe-de-paris': photo('lavender-cafe-de-paris-4x5', { kind: 'corner', ratio: '4 / 5', position: '50% 50%',
      alt: 'Cafe de Paris photo corner: a lavender striped awning over a flower-filled window box, a lace-covered table and fluted pillars',
      caption: 'Lavender café corner' }),
    'lavender-lanterns-florals': photo('lavender-lanterns-florals', { kind: 'detail', ratio: '3 / 2',
      alt: 'Violet and white flowers arranged around white and gold lanterns',
      caption: 'Lavender flowers and lanterns' }),
    'peach-roses-molded-wall': photo('peach-roses-molded-wall', { kind: 'stage', ratio: '15 / 8', position: '50% 50%',
      alt: 'Peach roses on a white moulded wall with carved frames',
      caption: 'Peach roses on a moulded wall' }),
    'rose-arch-champagne-drape': photo('rose-arch-champagne-drape', { kind: 'stage', ratio: '3 / 2',
      alt: 'Red, white and pink flowers framing a lit champagne drape, with a pale grey velvet shell sofa',
      caption: 'Floral frame and champagne drape' }),
    'champagne-drape-stage': photo('champagne-drape-stage', { kind: 'stage', ratio: '3 / 2', position: '50% 55%',
      alt: 'Champagne drape with pastel flowers and a white sofa',
      caption: 'Champagne drape and pastel florals' }),
    'pastel-reception-stage': photo('pastel-reception-stage', { kind: 'stage', ratio: '3 / 2', ceremony: 'Reception',
      alt: 'Pastel flowers on white panels around a stage sofa',
      caption: 'Pastel flowers on white panels' }),
    'lattice-arches': photo('lattice-arches', { kind: 'stage', ratio: '3 / 2', ceremony: 'Mama Mosalu',
      alt: 'Three lattice arches wound with white flowers, red roses and greenery',
      caption: 'Lattice arches' }),
    'rose-arch-detail': photo('rose-arch-detail', { kind: 'detail', ratio: '3 / 2', ceremony: 'Mama Mosalu',
      alt: 'Red roses, white flowers and greenery wound around a lit gold arch',
      caption: 'Roses on a gold arch' }),
    'emerald-velvet-paper-birds': photo('emerald-velvet-paper-birds', { kind: 'stage', ratio: '3 / 2',
      alt: 'Clear hanging birds and crystal chandeliers before an emerald velvet backdrop',
      caption: 'Emerald velvet and hanging birds' }),
    'jali-daybed-pastels': photo('jali-daybed-pastels', { kind: 'detail', ratio: '3 / 4', ceremony: 'Pannat', position: '50% 0%',
      alt: 'White jali daybed with cushions, beside pastel flowers and hanging floral hoops',
      caption: 'Jali daybed' }),
    'welcome-board': photo('welcome-board-4x5', { kind: 'signage', ratio: '4 / 5', position: '50% 50%', archOnly: true,
      alt: 'The printed floral border of a welcome board above a spray of flowers on its easel',
      caption: 'Welcome board' }),
    'white-green-floral-walls': photo('white-green-floral-walls', { kind: 'stage', ratio: '3 / 2',
      alt: 'White flower walls and a green wall around a cream sofa with brass candle stands',
      caption: 'White and green floral walls' }),
  };
  /* Left out on purpose: ivory-stage-glowing-curves has no photo credit yet. Two files are crops of
     the studio's originals, so nothing private is ever served: the welcome board is cut below its
     lettering (the family's and couple's names) and above the hall's sign, and the café corner is a
     4:5 crop with the couple's hashtag cut away. The uncropped board is kept in originals/, outside
     the site, in case the family agrees to show it. archOnly: show the board only in an arch. */

  /** Ceremony names exactly as the studio writes them. */
  SITE.CEREMONIES = Z.CEREMONIES;

  /** What the studio makes, in the same words wherever it appears (home teaser, about page). */
  SITE.OFFERINGS = [
    { key: 'stages', title: 'Stages', photo: 'rose-arch-champagne-drape',
      text: 'The backdrop, the flowers and the seat for the couple: drapes, arches, floral walls and light.' },
    { key: 'entrances', title: 'Entrances and aisles', photo: 'wisteria-mirror-aisle',
      text: 'The walk in, lined with candles, greenery and flowers, under arches or a canopy.' },
    { key: 'welcome-boards', title: 'Welcome boards', photo: 'welcome-board',
      text: 'Boards that greet your guests, lettered with the couple’s names and dressed in flowers.' },
    { key: 'photo-corners', title: 'Photo corners', photo: 'lavender-cafe-de-paris',
      text: 'A corner built around a theme for photographs, like a lavender café with its awning and window box.' },
  ];

  SITE.photo = function (key) {
    var p = SITE.PHOTOS[key];
    if (!p) throw new Error('No photo "' + key + '" in ZCSite.PHOTOS');
    return p;
  };

  /* ---------- page frame ---------- */
  /** Header, <main>, footer. props: page (the NAV key, or 'home' / 'enquire'), credit (footer credit
      line; defaults to SITE.CREDIT; pass SITE.creditFor(keys) when the page shows the photos). */
  SITE.Page = function Page(props) {
    var links = SITE.NAV.map(function (l) { return { label: l.label, href: l.href, current: l.key === props.page }; });
    var footerLinks = [{ label: 'Home', href: SITE.HREF.home }].concat(
      SITE.NAV.map(function (l) { return { label: l.label, href: l.href }; }),
      [{ label: 'Enquire', href: SITE.HREF.enquire }]);
    return h(React.Fragment, null,
      h('a', { className: 'site-skip', href: '#main' }, 'Skip to content'),
      /* No Enquire button on the enquire page itself: it would only reload the page, beside the
         form's own primary "Send enquiry". */
      h(Z.SiteHeader, { links: links, cta: props.page === 'enquire' ? undefined : SITE.CTA, homeHref: SITE.HREF.home }),
      h('main', { id: 'main', tabIndex: -1 }, props.children),
      h(Z.SiteFooter, { email: SITE.EMAIL, year: SITE.YEAR, links: footerLinks, credit: h(React.Fragment, null,
        props.credit || SITE.CREDIT, ' · Website by ' + SITE.MAKER.name + ' · ',
        h('a', { className: 'site-maker', href: 'mailto:' + SITE.MAKER.email + '?subject=' + encodeURIComponent('A website like ZC Events') }, SITE.MAKER.email)) }));
  };

  /** The footer credit for a page that shows these photo keys. A photo with its own `credit` adds it
      to the line; none has one now, so every page carries the Clicktography line. */
  SITE.creditFor = function (keys) {
    var extra = keys.map(function (k) { return SITE.PHOTOS[k] && SITE.PHOTOS[k].credit; }).filter(Boolean);
    return [SITE.CREDIT].concat(extra.filter(function (c, i) { return extra.indexOf(c) === i; })).join(' · ');
  };

  /** A full-width band. tone: 'surface' (default) | 'tint' | 'deep'. width: 'wide' (container,
      default) | 'narrow' (container-narrow, for forms and text-led pages). */
  SITE.Section = function Section(props) {
    var tone = props.tone || 'surface', narrow = props.width === 'narrow';
    return h('section', { id: props.id, className: 'site-section site-section--' + tone + (props.className ? ' ' + props.className : ''), 'aria-labelledby': props.labelledBy },
      h('div', { className: 'site-container' + (narrow ? ' site-container--narrow' : '') }, props.children));
  };

  /** The band that closes the home, portfolio and about pages: one primary, to the enquiry page.
      tone: whichever of 'surface' / 'tint' differs from the band above it. */
  SITE.Closing = function Closing(props) {
    return h(SITE.Section, { tone: props.tone || 'surface', width: 'narrow' },
      h(Z.SectionHeading, {
        eyebrow: 'Enquire',
        title: h(React.Fragment, null, 'Tell us about the ', h('em', null, 'day')),
        intro: 'Share the date, the ceremony and anything you already have in mind, and we will reply to talk it through.',
      }),
      h('div', { className: 'site-more' }, h(Z.Button, { variant: 'primary', href: SITE.HREF.enquire }, 'Enquire')),
      h(SITE.Like));
  };

  /* ---------- the like button ----------
     One count for the whole site. The page is built with no count (the server can't know it), then the
     browser fetches it. A visitor can like once; their browser remembers, so the button shows "Liked". */
  var HEART = 'M12 20.2s-7.5-4.6-7.5-10.4A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5c0 5.8-7.5 10.4-7.5 10.4z';
  var LIKED_KEY = 'zc-events-liked';
  function heart(filled) {
    return h('svg', { className: 'zc-glyph site-like__heart', width: 18, height: 18, viewBox: '0 0 24 24', fill: filled ? 'currentColor' : 'none',
      stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false' }, h('path', { d: HEART }));
  }
  function readCount(r) { return r.ok ? r.json() : null; }
  SITE.formatCount = function (n) { return Number(n).toLocaleString('en-IN'); };
  SITE.Like = function Like() {
    var c = React.useState(null), count = c[0], setCount = c[1];
    var l = React.useState(false), liked = l[0], setLiked = l[1];
    React.useEffect(function () {
      try { setLiked(w.localStorage.getItem(LIKED_KEY) === '1'); } catch (e) { /* private mode */ }
      if (!SITE.LIKES_URL || typeof w.fetch !== 'function') return undefined;
      var live = true;
      w.fetch(SITE.LIKES_URL).then(readCount).then(function (d) {
        if (live && d && typeof d.count === 'number') setCount(d.count);
      }).catch(function () { /* the count just doesn't show */ });
      return function () { live = false; };
    }, []);
    function like() {
      if (liked) return;
      var before = count;
      setLiked(true);
      if (typeof count === 'number') setCount(count + 1);
      try { w.localStorage.setItem(LIKED_KEY, '1'); } catch (e) { /* private mode */ }
      if (typeof w.fetch !== 'function') return;
      w.fetch(SITE.LIKES_URL, { method: 'POST' }).then(function (r) {
        if (!r.ok) throw new Error('like not counted');
        return r.json();
      }).then(function (d) {
        if (d && typeof d.count === 'number') setCount(d.count);
      }).catch(function () {
        // Not counted (offline, or too many likes): undo, so the visitor can try again.
        setLiked(false); setCount(before);
        try { w.localStorage.removeItem(LIKED_KEY); } catch (e) { /* private mode */ }
      });
    }
    if (!SITE.LIKES_URL) return null;
    var label = liked ? 'Liked' : 'Like';
    return h('p', { className: 'site-like' },
      h('span', { className: 'site-like__ask' }, 'Like our work?'),
      h(Z.Button, { variant: 'secondary', className: 'site-like__button', 'aria-pressed': liked, onClick: like,
          'aria-label': label + (typeof count === 'number' && count > 0 ? ', ' + SITE.formatCount(count) + (count === 1 ? ' like' : ' likes') : '') },
        heart(liked), label,
        typeof count === 'number' && count > 0 ? h('span', { className: 'site-like__count', 'aria-hidden': 'true' }, SITE.formatCount(count)) : null));
  };

  /** Registers a page. meta: { title, description, hero? (image path to preload), image? (og:image) }. */
  SITE.register = function (key, meta, Component) { SITE.pages[key] = { meta: meta, Component: Component }; };

  /* ---------- browser: hydrate the page built by build.mjs ---------- */
  if (w.ReactDOM && typeof document !== 'undefined') {
    var boot = function () {
      var key = document.body.getAttribute('data-page'), entry = SITE.pages[key], root = document.getElementById('root');
      if (!entry || !root) return;
      var el = h(entry.Component);
      if (root.firstElementChild) w.ReactDOM.hydrateRoot(root, el);
      else w.ReactDOM.createRoot(root).render(el);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else setTimeout(boot, 0);
  }
})(window);
