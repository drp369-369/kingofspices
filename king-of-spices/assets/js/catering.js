/* Catering & Events — package selection, live estimate, form submit */
document.addEventListener('DOMContentLoaded', () => {
  const PACKAGES = { basic: 299, premium: 499, royal: 799 };
  const cards = document.querySelectorAll('.pkg-card');
  const packageInput = document.getElementById('cat-package');
  const guestsInput = document.getElementById('cat-guests');
  const estAmt = document.querySelector('.estimate-box .amt');
  const estNote = document.querySelector('.estimate-box .note');
  const form = document.getElementById('catering-form');
  const eventDate = document.getElementById('cat-date');
  if (eventDate) {
    const today = new Date();
    eventDate.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  function selectPackage(key) {
    packageInput.value = key;
    cards.forEach(c => c.classList.toggle('selected', c.dataset.pkg === key));
    updateEstimate();
  }

  cards.forEach(c => c.addEventListener('click', () => selectPackage(c.dataset.pkg)));
  if (cards.length) selectPackage(cards[0].dataset.pkg);

  function updateEstimate() {
    const guests = parseInt(guestsInput.value, 10) || 0;
    const price = PACKAGES[packageInput.value] || 0;
    const amount = guests * price;
    estAmt.textContent = '₹' + amount.toLocaleString('en-IN');
    estNote.textContent = guests > 0
      ? `${guests} guests × ₹${price}/person`
      : 'Enter guest count to see your estimate';
  }
  if (guestsInput) guestsInput.addEventListener('input', updateEstimate);
  updateEstimate();

  function showError(id, show) {
    const el = document.querySelector(`[data-error-for="${id}"]`);
    if (el) el.classList.toggle('show', show);
  }

  if (form) form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const required = ['cat-name', 'cat-email', 'cat-phone', 'cat-event-type', 'cat-date', 'cat-guests'];
    required.forEach(id => {
      const field = document.getElementById(id);
      const ok = field.value && field.checkValidity();
      showError(id, !ok);
      if (!ok) valid = false;
    });
    if (!valid) { toast('Please fix the highlighted fields.'); return; }

    const guests = parseInt(guestsInput.value, 10);
    const price = PACKAGES[packageInput.value];
    const amount = guests * price;
    const refId = 'CAT' + Date.now().toString().slice(-8);

    const requests = store.get('kos_catering_requests', []);
    requests.unshift({
      refId,
      name: document.getElementById('cat-name').value,
      email: document.getElementById('cat-email').value,
      phone: document.getElementById('cat-phone').value,
      eventType: document.getElementById('cat-event-type').value,
      date: document.getElementById('cat-date').value,
      guests, package: packageInput.value, amount,
      notes: document.getElementById('cat-notes').value,
      submittedAt: new Date().toISOString()
    });
    store.set('kos_catering_requests', requests);

    showModal({
      icon: 'fa-champagne-glasses',
      title: 'Catering request submitted successfully!',
      detail: [
        ['Event type', document.getElementById('cat-event-type').value],
        ['Guests', guests],
        ['Package', packageInput.value.charAt(0).toUpperCase() + packageInput.value.slice(1) + ' (₹' + price + '/person)'],
        ['Estimated amount', '₹' + amount.toLocaleString('en-IN')],
        ['Reference ID', refId]
      ],
      note: "Our events team will reach out to confirm availability and finalize your menu."
    });

    form.reset();
    selectPackage(cards[0].dataset.pkg);
    updateEstimate();
  });
});
