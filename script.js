/* =========================================================
   ELIT MEMBERS — interações
   ========================================================= */
(function () {
  'use strict';

  /* marca que o JS está ativo (habilita animações de reveal) */
  document.documentElement.classList.add('js');

  /* ---- Header muda ao rolar ---- */
  var header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
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
