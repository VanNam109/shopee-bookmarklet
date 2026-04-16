const installLink = document.getElementById("installBookmarklet");
const copyButton = document.getElementById("copyBookmarklet");
const copyStatus = document.getElementById("copyStatus");

function buildBookmarkletSource(runnerUrl) {
  return `javascript:(function(){if(!/shopee\\.vn$/.test(location.hostname)){alert('Hãy mở shopee.vn và đăng nhập trước khi dùng.');return;}var existing=document.getElementById('shopee-stats-runner');if(existing){existing.remove();}var s=document.createElement('script');s.id='shopee-stats-runner';s.src='${runnerUrl}?t='+Date.now();document.body.appendChild(s);})();`;
}

function setupBookmarklet() {
  const runnerUrl = new URL("shopee-runner.js", window.location.href).href;
  const source = buildBookmarkletSource(runnerUrl);
  installLink.href = source;
  copyButton.dataset.bookmarklet = source;
}

async function copyBookmarklet() {
  const source = copyButton.dataset.bookmarklet || "";

  try {
    await navigator.clipboard.writeText(source);
    copyStatus.textContent = "Đã sao chép bookmarklet. Hãy tạo bookmark mới và dán vào ô URL nếu cần.";
  } catch (_error) {
    copyStatus.textContent = "Không sao chép tự động được. Hãy kéo thả nút bookmarklet hoặc sao chép thủ công.";
  }
}

copyButton.addEventListener("click", copyBookmarklet);
setupBookmarklet();
