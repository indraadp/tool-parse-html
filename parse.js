(function () {
  var root = document.documentElement;

  var toggle = document.getElementById("themeToggle");
  var label = document.getElementById("themeLabel");

  var textarea = document.getElementById("somewhere");
  var btnCopy = document.getElementById("button-link");
  var toast = document.getElementById("btnInfo");

  function applyTheme(mode) {
    root.setAttribute("data-theme", mode);
    try { localStorage.setItem("theme", mode); } catch (e) {}
    var isDark = mode === "dark";
    if (toggle) toggle.setAttribute("aria-checked", isDark ? "true" : "false");
    if (label) label.textContent = isDark ? "Dark" : "Light";
  }

  applyTheme(root.getAttribute("data-theme") || "light");

  if (toggle) {
    toggle.addEventListener("click", function () {
      var now = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(now);
    });
  }

  function showCopy() {
    if (btnCopy) btnCopy.classList.remove("is-hidden");
  }

  function hideCopy() {
    if (btnCopy) btnCopy.classList.add("is-hidden");
  }

  function showToast() {
    if (!toast) return;
    toast.classList.remove("collapse");
    toast.style.display = "block";
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      toast.style.display = "none";
      toast.classList.add("collapse");
    }, 1600);
  }

  window.hideToast = function () {
    if (!toast) return;
    toast.style.display = "none";
    toast.classList.add("collapse");
  };

  window.convert = function () {
    if (!textarea) return;

    var replaced = textarea.value || "";
    replaced = replaced.replace(/&/ig, "&amp;");
    replaced = replaced.replace(/</ig, "&lt;");
    replaced = replaced.replace(/>/ig, "&gt;");
    replaced = replaced.replace(/"/ig, "&quot;");
    replaced = replaced.replace(/'/ig, "&#039;");
    replaced = replaced.replace(/&#177;/ig, "&plusmn;");
    replaced = replaced.replace(/&#169;/ig, "&copy;");
    replaced = replaced.replace(/&#174;/ig, "&reg;");
    replaced = replaced.replace(/ya'll/ig, "ya'll");

    textarea.value = replaced;

    if ((textarea.value || "").trim().length > 0) showCopy();
  };

  window.cdClear = function () {
    if (textarea) textarea.value = "";
    window.hideToast();
    hideCopy();
  };

  async function copyText(text) {
    if (!text || !text.trim()) return false;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {}

    try {
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      var ok = document.execCommand("copy");
      window.getSelection().removeAllRanges();
      return !!ok;
    } catch (e) {
      return false;
    }
  }

  if (btnCopy) {
    btnCopy.addEventListener("click", async function () {
      var ok = await copyText(textarea ? textarea.value : "");
      if (ok) showToast();
    });
  }
})();
