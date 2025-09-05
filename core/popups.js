export function setupPopups() {
  console.log("Popups-1");
}
document.addEventListener('DOMContentLoaded', function () {
  const popupBox = document.querySelector('.rightnow-media--popup-container');
  const closeButtons = document.querySelectorAll('.rightnow-media--popup-close');

  const FLAG_KEY = 'pastorsPopupWasClosed';
  const EXPIRY_KEY = 'pastorsPopupHidesUntil';
  const HIDE_FOR_DAYS = 7;

  function getTimeXDaysFromNow(days) {
    return Date.now() + days * 24 * 60 * 60 * 1000;
  }

  function hasUserExited(flagKey, expiryKey) {
    const hasExited = localStorage.getItem(flagKey) === 'yes';
    const expiresAt = Number(localStorage.getItem(expiryKey));
    return hasExited && Number.isFinite(expiresAt) && Date.now() <= expiresAt;
  }

  function rememberUserExited(flagKey, expiryKey, daysToHide) {
    localStorage.setItem(flagKey, 'yes');
    localStorage.setItem(expiryKey, String(getTimeXDaysFromNow(daysToHide)));
  }

  if (!popupBox) return;

  // Show/hide (no CSS classes, no transitions)
  if (hasUserExited(FLAG_KEY, EXPIRY_KEY)) {
    popupBox.style.display = 'none';
    popupBox.style.opacity = '0';
  } else {
    popupBox.style.display = 'flex';  // or 'block' if that's what you use
    popupBox.style.opacity = '1';
  }

  // Close: remember for 7 days, then hide
  closeButtons.forEach((btn) =>
    btn.addEventListener('click', () => {
      rememberUserExited(FLAG_KEY, EXPIRY_KEY, HIDE_FOR_DAYS);
      popupBox.style.display = 'none';
      popupBox.style.opacity = '0';
    })
  );
});
