/* Fast video gallery: shows a YouTube thumbnail first and loads the heavy
   player only when the visitor taps play. Public pages only. */
(function () {
  var css =
    ".lite-yt{position:absolute;inset:0;width:100%;height:100%;border:0;padding:0;cursor:pointer;background:#000 center/cover no-repeat;display:block}" +
    ".lite-yt::after{content:'';position:absolute;left:50%;top:50%;width:68px;height:48px;transform:translate(-50%,-50%);border-radius:14px;background:rgba(191,148,86,.92) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M8 5v14l11-7z'/%3E%3C/svg%3E\") center/28px no-repeat;box-shadow:0 6px 20px rgba(0,0,0,.35);transition:transform .2s}" +
    ".lite-yt:hover::after{transform:translate(-50%,-50%) scale(1.08)}";
  var s = document.createElement("style");
  s.textContent = css;
  document.head.appendChild(s);

  function idOf(src) {
    var m = /youtube(?:-nocookie)?\.com\/embed\/([\w-]{6,})/.exec(src || "");
    return m && m[1];
  }
  function convert(root) {
    var frames = (root || document).querySelectorAll(".video-card iframe[src*='youtube']:not([data-played])");
    for (var i = 0; i < frames.length; i++) {
      var f = frames[i], id = idOf(f.getAttribute("src"));
      if (!id) continue;
      var b = document.createElement("button");
      b.type = "button";
      b.className = "lite-yt";
      b.setAttribute("aria-label", "ভিডিও চালান");
      b.style.backgroundImage = "url(https://i.ytimg.com/vi/" + id + "/hqdefault.jpg)";
      b.dataset.src = f.getAttribute("src");
      b.dataset.allow = f.getAttribute("allow") || "";
      b.addEventListener("click", play);
      f.replaceWith(b);
    }
  }
  function play() {
    var f = document.createElement("iframe");
    var src = this.dataset.src;
    f.src = src + (src.indexOf("?") > -1 ? "&" : "?") + "autoplay=1";
    f.setAttribute("allow", this.dataset.allow + "; autoplay");
    f.setAttribute("allowfullscreen", ""); f.setAttribute("data-played", "1");
    f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    this.replaceWith(f);
  }
  function start() {
    convert();
    new MutationObserver(function () { convert(); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
