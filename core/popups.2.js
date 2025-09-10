export function setupPopups() {
  console.log("Popups-2");
}

/*
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
  setTimeout(() => {
    if (hasUserExited(FLAG_KEY, EXPIRY_KEY)) {
      popupBox.style.display = 'none';
      popupBox.style.opacity = '0';
    } else {
      popupBox.style.display = 'flex';
      popupBox.style.opacity = '1';
    }
  }, 15000);

  // Close: remember for 7 days, then hide
  closeButtons.forEach((btn) =>
    btn.addEventListener('click', () => {
      rememberUserExited(FLAG_KEY, EXPIRY_KEY, HIDE_FOR_DAYS);
      popupBox.style.display = 'none';
      popupBox.style.opacity = '0';
    })
  );
});
*/


document.addEventListener('DOMContentLoaded', function () {
  const popupBox = document.querySelector('.rightnow-media--popup-container');
  const closeButtons = document.querySelectorAll('.rightnow-media--popup-close');

  const FLAG_KEY = 'pastorsPopupWasClosed';
  const EXPIRY_KEY = 'pastorsPopupHidesUntil';

  const FADE_MS = 220;

  function getTimeXDaysFromNow(days) {
    return Date.now() + days * 24 * 60 * 60 * 1000;
  }

  function hasUserExited(flagKey, expiryKey) {
    const hasExited = localStorage.getItem(flagKey);
    const expiresAt = parseInt(localStorage.getItem(expiryKey), 10);
    return hasExited && !isNaN(expiresAt) && Date.now() <= expiresAt;
  }

  function rememberUserExited(flagKey, expiryKey, daysToHide) {
    localStorage.setItem(flagKey, 'yes');
    localStorage.setItem(expiryKey, getTimeXDaysFromNow(daysToHide).toString());
  }

  if (!popupBox) return;

  // Helper to cancel any in-flight animations
  function cancelAnims(el) {
    el.getAnimations?.().forEach(a => a.cancel());
  }

  function fadeIn(el) {
    cancelAnims(el);
    el.style.display = 'flex';       // or 'block' if you prefer
    el.style.opacity = '0';          // ensure starting point
    el.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: FADE_MS, easing: 'ease', fill: 'forwards' }
    );
  }

  function fadeOut(el, cb) {
    cancelAnims(el);
    const anim = el.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: FADE_MS, easing: 'ease', fill: 'forwards' }
    );
    anim.onfinish = () => {
      el.style.display = 'none';
      if (cb) cb();
    };
  }

  // Show/hide based on memory
  if (hasUserExited(FLAG_KEY, EXPIRY_KEY)) {
    popupBox.style.display = 'none';
    popupBox.style.opacity = '0';
  } else {
    fadeIn(popupBox);
  }

  // Close: remember for 7 days, then fade out
  closeButtons.forEach((btn) =>
    btn.addEventListener('click', () => {
      rememberUserExited(FLAG_KEY, EXPIRY_KEY, 7);
      fadeOut(popupBox);
    })
  );
});
