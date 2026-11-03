/* Reservation form — validation + confirmation */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form[name="reservation-form"]');
  if (!form) return;

  const dateField = form.querySelector('[name="date"]');
  if (dateField) {
    const today = new Date();
    dateField.min = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const data = Object.fromEntries(new FormData(form).entries());
    const refId = 'RSV' + Date.now().toString().slice(-8);
    const bookings = store.get('kos_reservations', []);
    bookings.unshift({ ...data, refId, bookedAt: new Date().toISOString() });
    store.set('kos_reservations', bookings);

    showModal({
      icon: 'fa-utensils',
      title: 'Table reserved successfully!',
      detail: [
        ['Name', data.name],
        ['Guests', data['no-of-persons']],
        ['Date', data.date],
        ['Time', data.time],
        ['Reference ID', refId]
      ],
      note: 'We will confirm your booking via email or phone shortly.'
    });
    form.reset();
  });
});
