/**
 * Opens a dedicated standalone video call popup window (similar to WhatsApp Desktop/Web call window)
 * @param {string} url - The full or relative call URL (e.g. /call/channel_id)
 */
export const openVideoCallPopup = (url) => {
  if (!url) return null;
  const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;

  const screenW = window.screen.availWidth || window.screen.width || 1280;
  const screenH = window.screen.availHeight || window.screen.height || 720;

  const width = Math.min(1400, Math.floor(screenW * 0.92));
  const height = Math.min(850, Math.floor(screenH * 0.92));

  const left =
    window.screen.availLeft !== undefined
      ? window.screen.availLeft + Math.floor((screenW - width) / 2)
      : Math.floor((screenW - width) / 2);
  const top =
    window.screen.availTop !== undefined
      ? window.screen.availTop + Math.floor((screenH - height) / 2)
      : Math.floor((screenH - height) / 2);

  const windowFeatures = [
    `width=${width}`,
    `height=${height}`,
    `left=${Math.max(0, left)}`,
    `top=${Math.max(0, top)}`,
    "menubar=no",
    "toolbar=no",
    "location=no",
    "status=no",
    "resizable=yes",
    "scrollbars=no",
  ].join(",");

  const windowName = "AnvaVideoCallPopup";
  const popup = window.open(fullUrl, windowName, windowFeatures);
  if (popup && !popup.closed) {
    popup.focus();
  }
  return popup;
};
