/* Shine Republic Car Wash & Valet — demo interactions (vanilla JS, no dependencies) */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var WHATSAPP_NUMBER = '27000000000';            // placeholder: international format, no +
  var EMAIL = 'hello@shinerepublic.example';      // placeholder
  // Opening hours per weekday (0 = Sunday): [openH, openM, closeH, closeM]
  var HOURS = { 0: [8, 0, 14, 0], 1: [7, 0, 18, 0], 2: [7, 0, 18, 0], 3: [7, 0, 18, 0], 4: [7, 0, 18, 0], 5: [7, 0, 18, 0], 6: [7, 0, 17, 0] };

  // Header background on scroll
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  function setNav(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('open', open);
    if (open) header.classList.add('scrolled'); else onScroll();
  }
  toggle.addEventListener('click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });

  // Active nav link + reveal on scroll
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (l) { var s = document.querySelector(l.getAttribute('href')); if (s) spy.observe(s); });
    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rev.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { rev.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Open / closed status in South African time (UTC+2, no daylight saving)
  var now = new Date(Date.now() + (new Date().getTimezoneOffset() + 120) * 60000);
  var day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes(), h = HOURS[day];
  var openM = h[0] * 60 + h[1], closeM = h[2] * 60 + h[3];
  function fmt(hh, mm) { return String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0'); }
  var pill = document.getElementById('open-status');
  if (pill) {
    if (mins >= openM && mins < closeM) pill.textContent = 'Open now \u00b7 until ' + fmt(h[2], h[3]);
    else {
      var nd = (day + 1) % 7, nh = HOURS[nd];
      pill.textContent = mins < openM ? 'Opens today at ' + fmt(h[0], h[1]) : 'Closed \u00b7 opens ' + fmt(nh[0], nh[1]) + ' tomorrow';
      pill.classList.add('closed');
    }
  }
  document.querySelectorAll('.hours tr[data-days]').forEach(function (tr) {
    if (tr.getAttribute('data-days').split(',').indexOf(String(day)) > -1) tr.classList.add('today');
  });

  // Package buttons preselect the service in the booking form
  var serviceSel = document.getElementById('f-service');
  document.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      var v = a.getAttribute('data-service');
      Array.prototype.forEach.call(serviceSel.options, function (o) { if (o.text === v) serviceSel.value = o.value; });
    });
  });

  // Gallery lightbox
  var lb = document.getElementById('lightbox');
  if (lb && typeof lb.showModal === 'function') {
    var lbImg = lb.querySelector('img'), lbCap = lb.querySelector('.lightbox-caption');
    document.querySelectorAll('.g-item').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        lbImg.src = a.getAttribute('href');
        lbImg.alt = a.querySelector('img').alt;
        lbCap.textContent = a.getAttribute('data-caption') || '';
        lb.showModal();
      });
    });
    lb.querySelector('.lightbox-close').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
  }

  // Booking form -> WhatsApp or email (no backend)
  var form = document.getElementById('booking-form');
  var err = document.getElementById('form-error');
  var dateInput = document.getElementById('f-date');
  dateInput.min = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');

  var channel = 'whatsapp';
  form.querySelectorAll('button[data-channel]').forEach(function (b) {
    b.addEventListener('click', function () { channel = b.getAttribute('data-channel'); });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var required = ['f-name', 'f-phone', 'f-date', 'f-time'];
    var missing = required.filter(function (id) {
      var el = document.getElementById(id), bad = !el.value.trim();
      el.setAttribute('aria-invalid', String(bad));
      return bad;
    });
    if (missing.length) {
      err.textContent = 'Please fill in: ' + missing.map(function (id) { return form.querySelector('label[for="' + id + '"]').textContent.trim(); }).join(', ') + '.';
      err.hidden = false;
      document.getElementById(missing[0]).focus();
      return;
    }
    err.hidden = true;
    var d = new FormData(form);
    var lines = [
      'Hi Shine Republic! Booking request from the website:',
      '',
      'Service: ' + d.get('service'),
      'Vehicle: ' + d.get('vehicle'),
      'Date: ' + d.get('date') + ' at ' + d.get('time'),
      'Name: ' + d.get('name'),
      'Phone: ' + d.get('phone')
    ];
    if (d.get('message')) lines.push('Notes: ' + d.get('message'));
    var text = lines.join('\n');
    if (channel === 'email') {
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Booking: ' + d.get('service') + ' - ' + d.get('name')) + '&body=' + encodeURIComponent(text);
    } else {
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    }
  });

  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
