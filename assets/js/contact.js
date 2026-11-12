/* Contact page: field checks, then email through send-enquiry.php. */
(function () {
  var calm = { required: 'This field is required.' };
  var msg = {
    firstName: 'Enter your first name.',
    email: 'Enter an email like you@company.com.', phone: 'Enter a phone number with at least 7 digits.',
    service: 'Select a service.', details: 'Tell us about your goals, timeline and budget.'
  };

  function check(el) {
    var ok = el.value.trim() !== '';
    if (el.type === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim());
    if (el.type === 'tel') ok = el.value.replace(/\D/g, '').length >= 7;
    var f = el.closest('.field');
    f.classList.toggle('is-bad', !ok);
    f.querySelector('.err').textContent = ok ? '' : (msg[el.name] || calm.required);
    el.setAttribute('aria-invalid', !ok);
    return ok;
  }
  function wire(form) {
    var req = Array.prototype.slice.call(form.querySelectorAll('[required]'));
    var note = form.querySelector('.c-note');
    req.forEach(function (el) {
      ['input', 'change'].forEach(function (ev) {
        el.addEventListener(ev, function () { if (el.closest('.field').classList.contains('is-bad')) check(el); });
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = req.filter(function (el) { return !check(el); });
      if (bad.length) { bad[0].focus(); return; }
      window.sendEnquiryForm(form, note, 'Contact page', function () { form.dispatchEvent(new Event('sent')); });
    });
  }

  var counter = document.getElementById('cCount');
  var details = document.getElementById('cDetails');
  var message = document.getElementById('projectForm');
  details.addEventListener('input', function () { counter.textContent = details.value.length + '/1000'; });
  message.addEventListener('sent', function () { counter.textContent = '0/1000'; });
  wire(message);
})();
