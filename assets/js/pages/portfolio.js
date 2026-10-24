/* ZC Events — portfolio page. Every photograph in ZCSite.PHOTOS, once: the stages and entrance in a
   3:2 grid (each tile opens a viewer), then the details band with one row of arches and the landscape
   close-ups (which open the viewer too), then a closing band to the enquiry page. */
(function (w) {
  var React = w.React, Z = w.ZCEvents, S = w.ZCSite, h = React.createElement;

  /* ---------- what goes where, wide to close ---------- */
  var STAGES = ['wisteria-canopy-fan-stage', 'royal-blue-velvet-arches', 'white-green-floral-walls',
    'pastel-reception-stage', 'lattice-arches', 'rose-arch-champagne-drape', 'champagne-drape-stage',
    'peach-roses-molded-wall', 'wisteria-mirror-aisle'];
  // Portrait close-ups under arches. Not clickable; the welcome board is shown only here (archOnly).
  var ARCHES = ['lavender-cafe-de-paris', 'jali-daybed-pastels', 'welcome-board', 'blue-gypsophila-vase'];
  // Landscape close-ups. The emerald velvet shot is a close view of the birds and chandeliers, so it
  // sits with the details rather than the whole stages.
  var DETAILS = ['wisteria-canopy-detail', 'emerald-velvet-paper-birds', 'lavender-lanterns-florals', 'rose-arch-detail'];
  var ALL = STAGES.concat(ARCHES, DETAILS);

  /* Caption: what was made, then the ceremony where the studio's notes give one ("Lattice arches ·
     Mama Mosalu"), then any credit the catalogue gives beyond Clicktography (none at present). The
     ceremony and a credit move to the next line whole, and wrap only if a column is narrower. */
  function item(key) {
    var p = S.photo(key);
    var name = p.credit ? p.caption.replace(' · ' + p.credit, '') : p.caption;
    var extra = [p.ceremony, p.credit].filter(Boolean);
    var caption = [name];
    extra.forEach(function (x) { caption.push(' · ', h('span', { key: x, className: 'pf-keep' }, x)); });
    return {
      key: key, src: p.src, alt: p.alt, position: p.position,
      name: p.ceremony ? name + ' · ' + p.ceremony : name, // the tile's accessible name, without the credit
      caption: caption,
    };
  }
  var stages = STAGES.map(item), arches = ARCHES.map(item), details = DETAILS.map(item);
  var VIEW = stages.concat(details); // the viewer steps through every tile, in page order

  // Every photo in the catalogue appears exactly once (check.mjs reports this as a console error).
  var missing = Object.keys(S.PHOTOS).filter(function (k) { return ALL.indexOf(k) < 0; });
  var twice = ALL.filter(function (k, i) { return ALL.indexOf(k) !== i; });
  if (missing.length || twice.length) console.error('portfolio: photos missing [' + missing + '] or shown twice [' + twice + ']');

  /* ---------- the design system's 1.5px line glyphs (the bundle doesn't export its Glyph) ---------- */
  var ARROW_BACK = 'M20 12H5M11 6l-6 6 6 6'; // ARROW, mirrored
  var CLOSE = 'M6 6l12 12M18 6L6 18';
  function glyph(d) {
    return h('svg', { className: 'zc-glyph', width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', focusable: 'false' },
      h('path', { d: d }));
  }

  /* ---------- a Gallery tile whose media is a button that opens the viewer ---------- */
  function Tile(props) {
    var it = props.item;
    return h('li', { className: 'zc-gallery__item pf-item', id: it.key },
      h('figure', { className: 'zc-gallery__figure' },
        h('button', { type: 'button', className: 'pf-tile', 'aria-label': 'View larger: ' + it.name, onClick: props.onOpen },
          h('span', { className: 'zc-gallery__media', style: { aspectRatio: '3 / 2' } },
            h('img', { className: 'zc-gallery__img', src: it.src, alt: it.alt, loading: props.eager ? 'eager' : 'lazy', decoding: 'async',
              style: it.position ? { objectPosition: it.position } : undefined }))),
        h('figcaption', { className: 'zc-gallery__caption' }, it.caption)));
  }

  function PortfolioPage() {
    var st = React.useState(null), index = st[0], setIndex = st[1];
    var dialogRef = React.useRef(null), openerRef = React.useRef(null);

    // However the viewer closes (Close, Esc, a click on the backdrop), clear it and put focus back on
    // the tile that opened it.
    function afterClose() {
      setIndex(null);
      var o = openerRef.current;
      openerRef.current = null;
      if (o && typeof o.focus === 'function') o.focus();
    }
    React.useEffect(function () {
      var d = dialogRef.current;
      if (!d) return undefined;
      d.addEventListener('close', afterClose);
      return function () { d.removeEventListener('close', afterClose); };
    }, []);

    // Open the native dialog once a photo is chosen.
    React.useEffect(function () {
      var d = dialogRef.current;
      if (!d || index === null || d.open) return;
      if (typeof d.showModal === 'function') d.showModal();
      else d.setAttribute('open', '');
    }, [index]);

    function open(i) {
      return function (e) { openerRef.current = e.currentTarget; setIndex(i); };
    }
    function close() {
      var d = dialogRef.current;
      if (!d) return;
      if (typeof d.close === 'function') d.close(); // fires 'close'
      else { d.removeAttribute('open'); afterClose(); }
    }
    function step(n) {
      setIndex(function (i) { return i === null ? i : (i + n + VIEW.length) % VIEW.length; });
    }
    function onKeyDown(e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    }
    function onDialogClick(e) {
      // A click on the backdrop lands on the dialog element itself, outside its box.
      if (e.target !== e.currentTarget) return;
      var r = e.currentTarget.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
    }

    var cur = index === null ? null : VIEW[index];
    var nStages = stages.length;

    return h(S.Page, { page: 'portfolio', credit: S.creditFor(ALL) },

      h(S.Section, { tone: 'surface', id: 'stages' },
        h(Z.SectionHeading, { as: 'h1', eyebrow: 'Portfolio', title: h(React.Fragment, null, 'Our ', h('em', null, 'work')),
          intro: 'Stages and entrances we have dressed, then the details up close: flowers, welcome boards and photo corners.' }),
        h('ul', { className: 'zc-gallery pf-gallery--stages site-after-heading' },
          stages.map(function (it, i) { return h(Tile, { key: it.key, item: it, eager: i < 3, onOpen: open(i) }); }))),

      h(S.Section, { tone: 'tint', id: 'details' },
        h(Z.SectionHeading, { eyebrow: 'Details', title: h(React.Fragment, null, 'Up ', h('em', null, 'close')),
          intro: 'A daybed, a welcome board and a photo corner, with the flowers and lamps from our stages.' }),
        h('ul', { className: 'site-grid site-grid--4 pf-arches site-after-heading' },
          arches.map(function (it) {
            return h('li', { key: it.key, id: it.key, className: 'pf-item' },
              h(Z.ArchFrame, { src: it.src, alt: it.alt, caption: it.caption, position: it.position }));
          })),
        h('ul', { className: 'zc-gallery pf-gallery--details site-after-heading' },
          details.map(function (it, i) { return h(Tile, { key: it.key, item: it, onOpen: open(nStages + i) }); }))),

      h(S.Closing, { tone: 'surface' }),

      /* The viewer: a native modal dialog on a scrim backdrop. The whole photo, its caption, and
         Previous / Next / Close; Esc closes, the arrow keys step. Nothing animates. */
      h('dialog', { ref: dialogRef, className: 'pf-viewer', 'aria-label': 'Photo viewer', onKeyDown: onKeyDown, onClick: onDialogClick },
        h('div', { className: 'pf-viewer__top' },
          h(Z.Button, { onPhoto: true, onClick: close }, 'Close', glyph(CLOSE))),
        h('figure', { className: 'pf-viewer__figure' },
          h('div', { className: 'pf-viewer__frame' },
            cur && h('img', { key: cur.key, className: 'pf-viewer__img', src: cur.src, alt: cur.alt })),
          h('figcaption', { className: 'pf-viewer__caption t-body', 'aria-live': 'polite' }, cur ? cur.caption : null)),
        h('div', { className: 'pf-viewer__nav' },
          h(Z.Button, { onPhoto: true, 'aria-label': 'Previous photo', onClick: function () { step(-1); } }, glyph(ARROW_BACK), 'Previous'),
          /* Ask the studio about the photo on screen, its name typed into the WhatsApp message. */
          cur && S.WHATSAPP ? h(Z.Button, { variant: 'primary', target: '_blank', rel: 'noopener',
            href: S.whatsappHref('Hello ZC Events, I saw the "' + cur.name + '" setup on your website and would like to ask about it.') }, 'Ask about this setup') : null,
          h(Z.Button, { onPhoto: true, arrow: true, 'aria-label': 'Next photo', onClick: function () { step(1); } }, 'Next'))));
  }

  S.register('portfolio', {
    title: 'Portfolio · ZC Events',
    description: 'Wedding stages, entrances, welcome boards and floral details dressed by ZC Events, from the whole setup to the flowers up close.',
  }, PortfolioPage);
})(window);
