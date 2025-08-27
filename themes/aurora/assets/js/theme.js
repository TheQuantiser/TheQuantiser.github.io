// Manage light and dark theme switching
(() => {
  const KEY = "theme";
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  let btn = null;

  const isValid = v => v === "light" || v === "dark";
  const getStored = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const setStored = v => { try { isValid(v) ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch {} };

  const explicitAttr = () => root.getAttribute("data-theme");
  const systemTheme  = () => (media.matches ? "dark" : "light");
  const currentTheme = () => (isValid(explicitAttr()) ? explicitAttr() : systemTheme());

  const apply = v => {
    if (isValid(v)) root.setAttribute("data-theme", v);
    else root.removeAttribute("data-theme");
    updateButton();
  };

  const updateButton = () => {
    if (!btn) return;
    const now = currentTheme();
    const next = now === "dark" ? "light" : "dark";
    btn.textContent = now === "dark" ? "☀️" : "🌙";
    const label = `Switch to ${next} theme`;
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
    btn.setAttribute("aria-pressed", now === "dark" ? "true" : "false");
  };

  const toggle = () => {
    const from = explicitAttr() || currentTheme();
    const to = from === "dark" ? "light" : "dark";
    setStored(to);
    apply(to);
  };

  const onSystemChange = () => {
    if (!getStored()) apply(null);
    else updateButton();
  };

  const onStorage = e => {
    if (e.key === KEY) apply(getStored());
  };

  document.addEventListener("DOMContentLoaded", () => {
    btn = document.getElementById("theme-toggle");
    apply(getStored());
    if (btn) btn.addEventListener("click", toggle);
  });

  if (typeof media.addEventListener === "function") media.addEventListener("change", onSystemChange);
  else if (typeof media.addListener === "function") media.addListener(onSystemChange);

  window.addEventListener("storage", onStorage);
})();
