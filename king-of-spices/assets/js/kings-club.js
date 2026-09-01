/* King's Club membership — join / cancel / status */
document.addEventListener('DOMContentLoaded', () => {
  const joinBtn = document.querySelector('.js-join-club');
  const cancelBtn = document.querySelector('.js-cancel-club');
  const statusDot = document.querySelector('.status-dot');
  const statusText = document.querySelector('.status-text');
  const statusSince = document.querySelector('.status-since');

  function refreshStatus() {
    const m = getMembership();
    if (statusDot) statusDot.classList.toggle('active', !!m.active);
    if (statusText) statusText.textContent = m.active ? "You're a King's Club member" : "You're on the Free plan";
    if (statusSince) statusSince.textContent = m.active && m.since ? ('Member since ' + new Date(m.since).toLocaleDateString()) : 'Join to start saving on every order.';
    if (joinBtn) joinBtn.style.display = m.active ? 'none' : '';
    if (cancelBtn) cancelBtn.style.display = m.active ? '' : 'none';
    if (typeof renderMemberPill === 'function') renderMemberPill();
    document.querySelectorAll('.member-pill').forEach(p => p.classList.toggle('show', !!m.active));
  }

  if (joinBtn) joinBtn.addEventListener('click', () => {
    const membership = { active: true, since: new Date().toISOString() };
    store.set('kos_membership', membership);
    refreshStatus();
    showModal({
      icon: 'fa-crown',
      title: "Welcome to King's Club!",
      detail: [
        ['Plan', "King's Club — ₹99/month"],
        ['Benefits', '10% off orders, free delivery above ₹499'],
        ['Status', 'Active']
      ],
      note: 'Your membership discount will now apply automatically at checkout.'
    });
  });

  if (cancelBtn) cancelBtn.addEventListener('click', () => {
    if (!confirm("Cancel your King's Club membership?")) return;
    store.set('kos_membership', { active: false });
    refreshStatus();
    toast('Membership cancelled.');
  });

  refreshStatus();
});
