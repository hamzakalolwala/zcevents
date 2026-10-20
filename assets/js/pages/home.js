/* ZC Events — home page. */
(function (w) {
  var React = w.React, Z = w.ZCEvents, S = w.ZCSite, h = React.createElement, F = React.Fragment;
  var HREF = S.HREF;

  /* Recent weddings: three stages in the arch frame, each with eyebrow, title and meta so the lines
     align. The rose arch is left out here because it is the "Stages" photo in What we make below. */
  var RECENT = [
    { key: 'royal-blue-velvet-arches', eyebrow: 'Wedding stage', title: 'Royal blue velvet',
      meta: 'White arches, blue roses and a carved sofa' },
    { key: 'lattice-arches', eyebrow: 'Mama Mosalu', title: 'Lattice arches',
      meta: 'White flowers, red roses and greenery' },
    { key: 'pastel-reception-stage', eyebrow: 'Reception', title: 'Pastel flowers',
      meta: 'On white panels, around a shell sofa' },
  ];

  var HERO = S.photo('wisteria-canopy-fan-stage');
  var SHOWN = [HERO.key].concat(
    RECENT.map(function (r) { return r.key; }),
    S.OFFERINGS.map(function (o) { return o.photo; }));

  function RecentWork() {
    return h(S.Section, { tone: 'surface' },
      h(Z.SectionHeading, {
        eyebrow: 'Portfolio',
        title: h(F, null, 'Recent ', h('em', null, 'weddings')),
        intro: 'A few of the stages we have dressed, from royal blue velvet to lattice arches and pastel flowers.',
      }),
      h('div', { className: 'site-grid site-after-heading home-recent' },
        RECENT.map(function (r) {
          var p = S.photo(r.key);
          return h(Z.EventCard, {
            key: r.key, href: HREF.portfolio + '#' + r.key, image: p.src, alt: p.alt, position: p.position,
            eyebrow: r.eyebrow, title: r.title, meta: r.meta,
          });
        })),
      h('div', { className: 'site-more' },
        h(Z.Button, { variant: 'quiet', href: HREF.portfolio }, 'See the portfolio')));
  }

  function WhatWeMake() {
    return h(S.Section, { tone: 'tint' },
      h(Z.SectionHeading, {
        eyebrow: 'The studio',
        title: h(F, null, 'What we ', h('em', null, 'make')),
        intro: 'The places your guests walk through, gather before and stop to photograph.',
      }),
      h('div', { className: 'site-grid site-grid--4 site-after-heading' },
        S.OFFERINGS.map(function (o) {
          var p = S.photo(o.photo);
          return h('div', { key: o.key, className: 'home-offer' },
            h(Z.ArchFrame, { src: p.src, alt: p.alt, position: p.position }),
            h('div', { className: 'home-offer__words' },
              h('h3', { className: 'home-offer__title t-title' }, o.title),
              h('p', { className: 'home-offer__text t-body' }, o.text)));
        })),
      h('div', { className: 'site-more' },
        h(Z.Button, { variant: 'quiet', href: HREF.about + '#what-we-make' }, 'More about what we make')));
  }

  /* The ceremony names set like the lettering on a welcome board: capitals, centred, under an arch. */
  function Ceremonies() {
    /* Desktop: heading and link on the left, the board beside them. Phones: heading, board, link. */
    return h(S.Section, { tone: 'surface', width: 'narrow' },
      h('div', { className: 'home-ceremonies' },
        h('div', { className: 'home-ceremonies__words' },
          h(Z.SectionHeading, {
            align: 'left',
            eyebrow: 'The wedding',
            title: h(F, null, 'Ceremonies we ', h('em', null, 'dress')),
            intro: 'Stages and entrances for each of them, in the colours and flowers you have in mind.',
          })),
        h('div', { className: 'home-board' },
          h('span', { className: 'home-board__rule', 'aria-hidden': 'true' }),
          h('ul', { className: 'home-board__list', 'aria-label': 'Ceremonies' },
            S.CEREMONIES.map(function (c) { return h('li', { key: c, className: 'home-board__item t-label' }, c); })),
          h('span', { className: 'home-board__rule', 'aria-hidden': 'true' })),
        h('p', { className: 'home-ceremonies__more' },
          h(Z.Button, { variant: 'quiet', href: HREF.about }, 'About the studio'))));
  }

  function HomePage() {
    return h(S.Page, { page: 'home', credit: S.creditFor(SHOWN) },
      h(Z.Hero, {
        image: HERO.src, alt: HERO.alt, position: HERO.position, height: 640,
        eyebrow: 'Wedding and event decor',
        title: h(F, null, 'We bring your ', h('em', null, 'visions'), h('br'), 'into reality'),
        actions: h(F, null,
          h(Z.Button, { variant: 'primary', size: 'lg', href: HREF.portfolio }, 'See our work'),
          h(Z.Button, { onPhoto: true, size: 'lg', href: HREF.enquire }, 'Enquire')),
      }),
      h(RecentWork),
      h(WhatWeMake),
      h(Ceremonies),
      h(S.Closing, { tone: 'tint' }));
  }

  S.register('home', {
    title: 'ZC Events · Wedding and event decor',
    description: 'ZC Events dresses wedding stages, entrances, welcome boards and photo corners for each ceremony, from Mama Mosalu to Walima.',
    hero: HERO.src,
  }, HomePage);
})(window);
