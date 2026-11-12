/* Sends a checked form to the AWS Lambda URL set in the enquiry-endpoint meta tag. Shared by Home and Contact. */
window.sendEnquiryForm = function (form, note, source, done) {
  var btn = form.querySelector('[type=submit]'), label = btn.querySelector('span'), text = label.textContent;
  var meta = document.querySelector('meta[name="enquiry-endpoint"]'), ep = meta ? meta.content : '';
  var data = new FormData(form);
  data.append('source', source);
  btn.disabled = true; label.textContent = 'Sending...';
  note.classList.remove('is-ok', 'is-fail');
  (ep ? fetch(ep, { method: 'POST', body: new URLSearchParams(data) }) : Promise.reject(null))
    .then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.ok, msg: j.message, code: r.status }; }); })
    .then(function (r) {
      if (!r.ok) throw r;
      note.textContent = 'Thank you! Your enquiry has been sent. We will reply within 24 hours.';
      note.classList.add('is-ok');
      form.reset(); done();
    })
    .catch(function (r) {
      note.textContent = r && r.code === 429 ? r.msg : 'Message could not be sent. Please email business@avyentra.com or WhatsApp +91 81463 81611.';
      note.classList.add('is-fail');
    })
    .then(function () { btn.disabled = false; label.textContent = text; });
};
