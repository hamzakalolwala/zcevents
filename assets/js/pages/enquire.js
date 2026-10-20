/* ZC Events — enquire page.
   One surface band (#enquiry-form): the heading and the EnquiryForm on the left, a slim aside on the
   right with what happens next, the email address and one detail under an arch. On phones the form
   comes first and the aside follows. The form sends nothing itself: on submit we open the visitor's
   email app with the enquiry written out (a mailto: link to ZCSite.EMAIL), then show the thank-you. */
(function (w) {
  var React = w.React, Z = w.ZCEvents, S = w.ZCSite, h = React.createElement;

  /* A close-up for the aside: blue gypsophila in a glass vase, centred, nothing but flowers in frame.
     The catalogue crop (50% 40%) keeps the vase and the roses inside the arch. */
  var ASIDE_PHOTO = 'blue-gypsophila-vase';

  /* A fixed month list, so the date reads "12 March 2027" in every browser and locale. */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /** '2027-03-12' → '12 March 2027'. Anything else (a browser without a date picker) is kept as typed. */
  function longDate(value) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    var month = m ? MONTHS[parseInt(m[2], 10) - 1] : undefined;
    return month ? parseInt(m[3], 10) + ' ' + month + ' ' + m[1] : (value || '');
  }

  /** The enquiry as a mailto: URL to the studio: a subject line and a plain-text body. Empty optional
      fields are left out. Line breaks are CRLF, as mailto: bodies expect. */
  function mailtoFor(v) {
    var date = longDate(v.date);
    var subject = 'Enquiry: ' + (v.ceremony || 'Wedding') + ', ' + date;
    var lines = ['Name: ' + v.name, 'Phone: ' + v.phone, 'Date: ' + date];
    if (v.ceremony) lines.push('Ceremony: ' + v.ceremony);
    if (v.venue) lines.push('Venue: ' + v.venue);
    if (v.message) lines.push('', 'Message:', v.message.replace(/\r?\n/g, '\r\n'));
    return 'mailto:' + S.EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\r\n'));
  }

  function EnquirePage() {
    /* The mailto: URL once the enquiry is sent; null until then. */
    var sentState = React.useState(null), sent = sentState[0], setSent = sentState[1];
    var formRef = React.useRef(null);
    var photo = S.photo(ASIDE_PHOTO);

    /* The submit button goes away with the form, so move focus to the thank-you note in its place. */
    React.useEffect(function () {
      if (sent && formRef.current) formRef.current.focus();
    }, [sent]);

    /* EnquiryForm marks a missing field (aria-invalid, with its error sentence tied in by
       aria-describedby) but leaves focus on the submit button, so a screen reader would hear nothing.
       Each press of submit bumps `tries`; that commits together with the form's own errors, so this
       effect then moves focus to the first field still to fill, which reads out its label and error. */
    var triesState = React.useState(0), tries = triesState[0], setTries = triesState[1];
    React.useEffect(function () {
      var bad = tries && formRef.current && formRef.current.querySelector('[aria-invalid="true"]');
      if (bad) bad.focus();
    }, [tries]);
    function tried() { setTries(function (n) { return n + 1; }); }

    function send(values) {
      var url = mailtoFor(values);
      w.location.href = url;
      setSent(url);
    }

    var thanks = h(React.Fragment, null,
      'Your email app should have opened with your enquiry ready; please press send there to reach us. If nothing opened, write to us at ',
      h('a', { href: sent || 'mailto:' + S.EMAIL }, S.EMAIL), '.');

    return h(S.Page, { page: 'enquire', credit: S.creditFor([ASIDE_PHOTO]) },
      h(S.Section, { tone: 'surface', id: 'enquiry-form' },
        h('div', { className: 'enquire-layout' },
          h('div', { className: 'enquire-main' },
            h(Z.SectionHeading, {
              as: 'h1', align: 'left', eyebrow: 'Enquire',
              title: h(React.Fragment, null, 'Tell us about the ', h('em', null, 'day')),
              intro: 'A few details help us picture the celebration: the date, the ceremony, the venue and the look you have in mind.',
            }),
            /* The form's submit bubbles here after EnquiryForm has checked the fields. */
            h('div', { className: 'site-after-heading enquire-form', ref: formRef, tabIndex: sent ? -1 : undefined, onSubmit: tried },
              h(Z.EnquiryForm, { onSubmit: send, submitted: sent !== null, successTitle: 'Thank you', successMessage: thanks }))),
          h('aside', { className: 'enquire-aside' },
            h('div', { className: 'enquire-notes' },
              h('div', { className: 'enquire-note' },
                h('h2', { className: 'enquire-note__title t-label' }, 'What happens next'),
                h('p', { className: 'enquire-note__text' },
                  'We write back by email to talk through the day with you.')),
              h('div', { className: 'enquire-note' },
                h('h2', { className: 'enquire-note__title t-label' }, 'Write to us'),
                h('p', { className: 'enquire-note__text' }, 'You are welcome to write to us directly, in your own words.'),
                h('a', { className: 'enquire-note__email', href: 'mailto:' + S.EMAIL }, S.EMAIL))),
            h(Z.ArchFrame, { src: photo.src, alt: photo.alt, caption: photo.caption, position: photo.position })))));
  }

  S.register('enquire', {
    title: 'Enquire · ZC Events',
    description: 'Tell ZC Events about the day: the date, the ceremony, the venue and the look you have in mind.',
  }, EnquirePage);
})(window);
