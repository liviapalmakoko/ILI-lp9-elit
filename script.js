/* =========================================================
   ELIT MEMBERS — interações
   ========================================================= */
(function () {
  'use strict';

  /* marca que o JS está ativo (habilita animações de reveal) */
  document.documentElement.classList.add('js');

  /* ---- Header muda ao rolar ---- */
  var header = document.getElementById('header');
  var mobileStickyCta = document.getElementById('mobileStickyCta');
  var hero = document.getElementById('hero');
  var formSection = document.getElementById('formulario');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    if (mobileStickyCta && hero && formSection) {
      var passedHero = hero.getBoundingClientRect().bottom < window.innerHeight * .35;
      var beforeForm = formSection.getBoundingClientRect().top > window.innerHeight * .68;
      mobileStickyCta.classList.toggle('is-visible', passedHero && beforeForm);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Menu mobile ---- */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- FAQ: mantém apenas uma resposta aberta por vez ---- */
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---- Galeria de experiências ---- */
  var gallery = document.getElementById('experienceGallery');
  var lightbox = document.getElementById('galleryLightbox');

  if (gallery && lightbox) {
    var galleryItems = Array.from(gallery.querySelectorAll('.gallery-item'));
    var lightboxImage = lightbox.querySelector('figure img');
    var lightboxDestination = lightbox.querySelector('figcaption strong');
    var lightboxCounter = lightbox.querySelector('figcaption span');
    var lightboxClose = lightbox.querySelector('.lightbox-close');
    var lightboxPrev = lightbox.querySelector('.lightbox-prev');
    var lightboxNext = lightbox.querySelector('.lightbox-next');
    var activeItems = galleryItems;
    var activeDestination = '';
    var currentPhoto = 0;

    var destinationOptions = Array.from(document.querySelectorAll('.destination-option'));
    var destinationPanels = Array.from(gallery.querySelectorAll('.destination-panel'));

    function activateDestination(option) {
      var panelId = option.dataset.panel;
      destinationOptions.forEach(function (button) {
        var active = button === option;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      destinationPanels.forEach(function (panel) {
        var active = panel.id === panelId;
        panel.hidden = !active;
        panel.classList.toggle('is-active', active);
      });
    }

    destinationOptions.forEach(function (option, index) {
      option.addEventListener('mouseenter', function () { activateDestination(option); });
      option.addEventListener('focus', function () { activateDestination(option); });
      option.addEventListener('click', function () { activateDestination(option); });
      option.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight' && event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
        event.preventDefault();
        var forward = event.key === 'ArrowRight' || event.key === 'ArrowDown';
        var next = destinationOptions[(index + (forward ? 1 : -1) + destinationOptions.length) % destinationOptions.length];
        activateDestination(next);
        next.focus();
      });
    });

    function showPhoto(index) {
      currentPhoto = (index + activeItems.length) % activeItems.length;
      var item = activeItems[currentPhoto];
      var image = item.querySelector('img');
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightboxDestination.textContent = activeDestination;
      lightboxCounter.textContent = (currentPhoto + 1) + ' / ' + activeItems.length;
    }

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        activeDestination = item.dataset.destination;
        activeItems = galleryItems.filter(function (photo) {
          return photo.dataset.destination === activeDestination;
        });
        showPhoto(activeItems.indexOf(item));
        lightbox.showModal();
        document.body.classList.add('lightbox-open');
      });
    });

    function closeLightbox() {
      lightbox.close();
      document.body.classList.remove('lightbox-open');
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', function () { showPhoto(currentPhoto - 1); });
    lightboxNext.addEventListener('click', function () { showPhoto(currentPhoto + 1); });
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    lightbox.addEventListener('close', function () {
      document.body.classList.remove('lightbox-open');
    });
    lightbox.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') showPhoto(currentPhoto - 1);
      if (event.key === 'ArrowRight') showPhoto(currentPhoto + 1);
    });
  }

  /* ---- Máscara simples de telefone (BR) ---- */
  var tel = document.getElementById('telefone');
  if (tel) {
    tel.addEventListener('input', function () {
      var v = tel.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 6) v = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
      else if (v.length > 2) v = '(' + v.slice(0, 2) + ') ' + v.slice(2);
      else if (v.length > 0) v = '(' + v;
      tel.value = v;
    });
  }

  /* ---- Validação + envio do formulário ---- */
  var form = document.getElementById('leadForm');
  var msg = document.getElementById('formMsg');

  function setError(field, on) {
    var wrap = field.closest('.field');
    if (wrap) wrap.classList.toggle('invalid', on);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.className = 'form-msg';
    msg.textContent = '';

    var required = form.querySelectorAll('[required]');
    var ok = true;
    required.forEach(function (f) {
      var valid = f.type === 'checkbox' ? f.checked : f.value.trim() !== '';
      if (f.type === 'email') valid = valid && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value);
      if (f.type !== 'checkbox') setError(f, !valid);
      if (!valid) ok = false;
    });

    if (!ok) {
      msg.classList.add('err');
      msg.textContent = 'Por favor, preencha os campos obrigatórios corretamente.';
      return;
    }

    /* TODO: integrar com backend / CRM / e-mail da Ilikia.
       Por enquanto o envio é simulado no front-end. */
    var btn = form.querySelector('button[type="submit"]');
    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    setTimeout(function () {
      form.reset();
      btn.disabled = false;
      btn.textContent = original;
      msg.classList.add('ok');
      msg.textContent = 'Recebemos seus dados! Em breve a equipe Ilikia entrará em contato. ✦';
    }, 900);
  });

  /* limpa erro ao digitar */
  form.querySelectorAll('input, select, textarea').forEach(function (f) {
    f.addEventListener('input', function () { setError(f, false); });
  });

  /* ---- Ano dinâmico não usado: mantido fixo em 2026 conforme campanha ---- */
})();
