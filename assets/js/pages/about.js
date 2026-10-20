/* ZC Events — about page: the studio in its own words, what we make, the ceremonies, how we work.
   Text uses only what the studio has told us (see BUILD-BRIEF.md, "What we know"). No owner's name,
   years, places, prices or counts.
   Needs from the family: the owner's name and a line of her story (for the intro); the city or area
   the studio covers; confirmation of the "How we work" steps (STEPS below); the site's domain, so link
   previews can carry an absolute og:image. */
(function (w) {
  var React = w.React, Z = w.ZCEvents, S = w.ZCSite, h = React.createElement;

  /* The arch beside the intro: the gold arch inside the frame's arch, cropped to its left side so the
     roses run from the foot of the arch to its crown. */
  var INTRO = { key: 'rose-arch-detail', position: '30% 50%' };

  /* What we make: one block per offering. The home page shows each offering's own photo in an arch,
     so here stages take a different stage (the royal blue panorama, cropped 3:2 around its centre),
     the aisle shows whole at 3:2, and the café corner is a centred 3:2 crop of its 4:5 file (awning,
     window box, lace table and pillars stay in). The welcome board is archOnly, so it stays in an
     ArchFrame (the section's one arch). */
  var MAKE = {
    'stages': { photo: 'royal-blue-velvet-arches', position: '50% 50%', href: 'portfolio.html#stages', more: 'See the stages' },
    'entrances': { photo: 'wisteria-mirror-aisle', href: 'portfolio.html#wisteria-mirror-aisle', more: 'See the aisle' },
    'welcome-boards': { photo: 'welcome-board', arch: true, href: 'portfolio.html#welcome-board', more: 'See the welcome board' },
    'photo-corners': { photo: 'lavender-cafe-de-paris', href: 'portfolio.html#lavender-cafe-de-paris', more: 'See the café corner' },
  };

  /* Copy for the family to confirm: how we work. Grounded only in what the enquiry form asks
     (date, ceremony, venue, colours, flowers, a theme); nothing about timing, deposits or visits. */
  var STEPS = [
    { title: 'You write to us', text: 'Tell us the date, the ceremony and the venue, and anything you already have in mind.' },
    { title: 'We plan the look', text: 'We talk it through with you: the colours, the flowers and a theme, if you have one.' },
    { title: 'We dress the venue', text: 'We build the setup and dress it at your venue, from the stage to the entrance.' },
  ];

  var PHOTO_KEYS = [INTRO.key].concat(Object.keys(MAKE).map(function (k) { return MAKE[k].photo; }));

  function accent(before, word, after) {
    return h(React.Fragment, null, before, h('em', null, word), after || null);
  }

  /* The heading is centred above both columns (README: "Centre hero text and section headings");
     only the running text beside the arch is left-aligned. */
  function Intro() {
    var p = S.photo(INTRO.key);
    return h(S.Section, { tone: 'surface', className: 'about-intro' },
      h(Z.SectionHeading, { as: 'h1', eyebrow: 'About', title: accent('About the ', 'studio'),
        intro: 'We bring your visions into reality.' }),
      h('div', { className: 'about-intro__grid site-after-heading' },
        h('div', { className: 'site-prose' },
          h('p', { className: 't-body-lg' },
            'ZC Events is a wedding-decor studio. We dress the stage where the couple sit, the entrance and aisle, the boards that greet your guests and the hall around them, and we build corners made for photographs. We work in drapes, arches, flowers and light.'),
          h('p', null,
            'We would rather show you than tell you. Every photograph on this site is a setup we made, shown as it stood and lit as it was, and the ',
            h('a', { href: S.HREF.portfolio }, 'portfolio'), ' has all of them.')),
        h('div', { className: 'about-intro__media' },
          h(Z.ArchFrame, { src: p.src, alt: p.alt, position: INTRO.position, caption: p.caption + (p.ceremony ? ' · ' + p.ceremony : '') }))));
  }

  function MakeBlock(props) {
    var o = props.offering, m = MAKE[o.key], p = S.photo(m.photo);
    var media = m.arch
      ? h(Z.ArchFrame, { src: p.src, alt: p.alt, position: p.position })
      : h('div', { className: 'about-make__photo' },
          h('img', { src: p.src, alt: p.alt, loading: 'lazy', decoding: 'async', style: m.position || p.position ? { objectPosition: m.position || p.position } : undefined }));
    return h('li', { className: 'about-make__item' + (props.flip ? ' about-make__item--flip' : '') + (m.arch ? ' about-make__item--arch' : '') },
      h('div', { className: 'about-make__media' }, media),
      h('div', { className: 'about-make__text' },
        h('h3', { className: 't-title about-make__title' }, o.title),
        h('p', { className: 't-body-lg about-make__body' }, o.text),
        h('p', { className: 'about-make__more' }, h(Z.Button, { variant: 'quiet', href: m.href }, m.more))));
  }

  function WhatWeMake() {
    return h(S.Section, { tone: 'tint', id: 'what-we-make' },
      h(Z.SectionHeading, { eyebrow: 'What we make', title: accent('From the stage to the ', 'door'),
        intro: 'What we build for the day, each shown in a setup from the portfolio.' }),
      h('ul', { className: 'about-make site-after-heading', role: 'list' },
        S.OFFERINGS.map(function (o, i) { return h(MakeBlock, { key: o.key, offering: o, flip: i % 2 === 1 }); })));
  }

  function Ceremonies() {
    return h(S.Section, { tone: 'surface', id: 'ceremonies' },
      h(Z.SectionHeading, { eyebrow: 'Ceremonies', title: accent('Through the ', 'wedding'),
        intro: 'We dress stages and entrances for each of the ceremonies, from Mama\u00a0Mosalu to Walima.' }),
      h('ul', { className: 'about-ceremonies t-label site-after-heading', role: 'list' },
        S.CEREMONIES.map(function (c) { return h('li', { key: c }, c); })));
  }

  /* Copy for the family to confirm (see STEPS above). */
  function HowWeWork() {
    return h(S.Section, { tone: 'tint', id: 'how-we-work' },
      h(Z.SectionHeading, { eyebrow: 'How we work', title: accent('Planned ', 'together') }),
      h('ol', { className: 'about-steps site-after-heading', role: 'list' },
        STEPS.map(function (s, i) {
          return h('li', { key: s.title, className: 'about-step' },
            h('p', { className: 't-heading about-step__num', 'aria-hidden': 'true' }, String(i + 1)),
            h('h3', { className: 't-title about-step__title' }, s.title),
            h('p', { className: 'about-step__text' }, s.text));
        })));
  }

  function AboutPage() {
    return h(S.Page, { page: 'about', credit: S.creditFor(PHOTO_KEYS) },
      h(Intro), h(WhatWeMake), h(Ceremonies), h(HowWeWork), h(S.Closing, { tone: 'surface' }));
  }

  S.register('about', {
    title: 'About · ZC Events',
    description: 'About ZC Events, the wedding-decor studio: what we make, the ceremonies we dress for, and how we plan the look with you.',
    image: S.photo('royal-blue-velvet-arches').src,
  }, AboutPage);
})(window);
