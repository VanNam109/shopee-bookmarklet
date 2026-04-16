(function () {
  const OVERLAY_ID = "shopee-stats-overlay";
  const STYLE_ID = "shopee-stats-style";
  const API_URL = "https://shopee.vn/api/v4/order/get_order_list";
  const PAGE_SIZE = 20;

  if (document.getElementById(OVERLAY_ID)) {
    document.getElementById(OVERLAY_ID).remove();
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${OVERLAY_ID} {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        background: rgba(15, 23, 42, 0.56);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      #${OVERLAY_ID} * { box-sizing: border-box; font-family: Inter, Arial, sans-serif; }
      #${OVERLAY_ID} .panel {
        width: min(520px, 100%);
        border-radius: 24px;
        overflow: hidden;
        background: linear-gradient(180deg, #fff7ed 0%, #ffffff 36%);
        box-shadow: 0 22px 50px rgba(15, 23, 42, 0.28);
      }
      #${OVERLAY_ID} .hero {
        padding: 22px 22px 20px;
        background: linear-gradient(135deg, #ea580c, #fb923c);
        color: #fff7ed;
      }
      #${OVERLAY_ID} .hero.level-khong-nghien {
        background: linear-gradient(135deg, #0f766e, #14b8a6);
      }
      #${OVERLAY_ID} .hero.level-chom-nghien {
        background: linear-gradient(135deg, #0369a1, #38bdf8);
      }
      #${OVERLAY_ID} .hero.level-nghien-vua {
        background: linear-gradient(135deg, #7c3aed, #a78bfa);
      }
      #${OVERLAY_ID} .hero.level-nghien-nang {
        background: linear-gradient(135deg, #ea580c, #fb923c);
      }
      #${OVERLAY_ID} .hero.level-het-thuoc-cuu {
        background: linear-gradient(135deg, #b91c1c, #ef4444);
      }
      #${OVERLAY_ID} .hero-label {
        display: inline-block;
        margin-bottom: 10px;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(255, 247, 237, 0.18);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }
      #${OVERLAY_ID} .hero h2 {
        margin: 0 0 8px;
        font-size: 36px;
        line-height: 1.12;
        font-weight: 800;
      }
      #${OVERLAY_ID} .hero p {
        margin: 0;
        line-height: 1.6;
        font-size: 15px;
      }
      #${OVERLAY_ID} .hero-level {
        display: block;
        margin-top: 14px;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.02em;
        opacity: 0.98;
      }
      #${OVERLAY_ID} .body {
        padding: 18px 22px 22px;
      }
      #${OVERLAY_ID} .status {
        margin: 0 0 14px;
        padding: 12px 14px;
        border-radius: 14px;
        background: #fff;
        color: #334155;
        line-height: 1.6;
      }
      #${OVERLAY_ID} .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      #${OVERLAY_ID} .card {
        background: #fff;
        border-radius: 16px;
        padding: 14px;
        box-shadow: 0 8px 22px rgba(15, 23, 42, 0.07);
      }
      #${OVERLAY_ID} .label {
        display: block;
        font-size: 12px;
        color: #64748b;
        margin-bottom: 8px;
      }
      #${OVERLAY_ID} .value {
        font-size: 19px;
        font-weight: 800;
        color: #0f172a;
      }
      #${OVERLAY_ID} .footer {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        margin-top: 16px;
        align-items: center;
      }
      #${OVERLAY_ID} .meta {
        font-size: 12px;
        color: #64748b;
      }
      #${OVERLAY_ID} .close {
        border: 0;
        border-radius: 12px;
        background: #ea580c;
        color: #fff;
        font-weight: 700;
        padding: 11px 14px;
        cursor: pointer;
      }
      @media (max-width: 520px) {
        #${OVERLAY_ID} .grid { grid-template-columns: 1fr; }
      }
    `;
    document.head.appendChild(style);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("vi-VN").format(value || 0);
  }

  function toCurrency(rawValue) {
    if (typeof rawValue !== "number" || Number.isNaN(rawValue)) {
      return 0;
    }

    return rawValue / 100000;
  }

  function buildFunnySummary(totalSpent) {
    if (totalSpent <= 5000000) {
      return {
        key: "khong-nghien",
        title: "Không nghiện",
        headline: "Ví vẫn còn thở đều",
        detail: "Bạn vẫn kiểm soát được cuộc chơi. Shopee mới chỉ biết bạn là khách ghé qua chào hỏi."
      };
    }

    if (totalSpent <= 15000000) {
      return {
        key: "chom-nghien",
        title: "Chớm nghiện",
        headline: "Ngón tay bắt đầu tự bấm mua",
        detail: "Bạn đã hơi quen mùi sale. Ví tiền có giật mình, nhưng vẫn chưa cần gọi cứu hộ."
      };
    }

    if (totalSpent <= 30000000) {
      return {
        key: "nghien-vua",
        title: "Nghiện vừa",
        headline: "Shipper đi ngang thấy hơi quen",
        detail: "Bạn đã có phản xạ canh sale rất mượt. Shopee bắt đầu coi bạn là người quen biết mặt."
      };
    }

    if (totalSpent <= 50000000) {
      return {
        key: "nghien-nang",
        title: "Nghiện nặng",
        headline: "Ví mỏng đi theo từng đợt sale",
        detail: "Shopee đã bắt đầu nhớ mặt đặt tên. Mỗi lần flash sale đi qua là ngân sách lại bốc hơi một đoạn."
      };
    }

    return {
      key: "het-thuoc-cuu",
      title: "Hết thuốc cứu",
      headline: "Ngân sách chỉ còn biết im lặng",
      detail: "Shipper có thể xem nhà bạn như trạm dừng cố định. Đây không còn là mua sắm, đây là số phận."
    };
  }

  function createOverlay() {
    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    overlay.innerHTML = `
      <div class="panel">
        <div id="shopee-stats-hero" class="hero">
          <span class="hero-label">Chẩn đoán hôm nay</span>
          <h2 id="shopee-stats-title">Đang quét mức độ nghiện...</h2>
          <p id="shopee-stats-detail">Đang xin Shopee kê khai lịch sử mua sắm...</p>
          <span id="shopee-stats-level" class="hero-level">Level: Đang phân tích</span>
        </div>
        <div class="body">
          <div id="shopee-stats-status" class="status">Đang tải dữ liệu, vui lòng chờ một chút.</div>
          <div class="grid">
            <div class="card">
              <span class="label">Tổng đã chi</span>
              <span id="value-spent" class="value">-</span>
            </div>
            <div class="card">
              <span class="label">Tổng đơn hàng</span>
              <span id="value-orders" class="value">-</span>
            </div>
            <div class="card">
              <span class="label">Tổng sản phẩm</span>
              <span id="value-items" class="value">-</span>
            </div>
            <div class="card">
              <span class="label">Tiết kiệm ước tính</span>
              <span id="value-saved" class="value">-</span>
            </div>
          </div>
          <div class="footer">
            <span id="shopee-stats-meta" class="meta">Chỉ dùng dữ liệu của phiên đăng nhập hiện tại.</span>
            <button id="shopee-stats-close" class="close">Đóng</button>
          </div>
        </div>
      </div>
    `;

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        overlay.remove();
      }
    });

    overlay.querySelector("#shopee-stats-close").addEventListener("click", () => {
      overlay.remove();
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function readOrderStats(order) {
    const finalTotal = toCurrency(order?.info_card?.final_total || 0);
    let originalTotal = 0;
    let itemCount = 0;
    const orderCards = order?.info_card?.order_list_cards || [];

    for (const orderCard of orderCards) {
      const itemGroups = orderCard?.product_info?.item_groups || [];

      for (const itemGroup of itemGroups) {
        const items = itemGroup?.items || [];

        for (const item of items) {
          originalTotal += toCurrency(item?.order_price || 0);
          itemCount += Number(item?.amount || 0);
        }
      }
    }

    return { finalTotal, originalTotal, itemCount };
  }

  async function fetchOrders(offset) {
    const url = new URL(API_URL);
    url.searchParams.set("list_type", "3");
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("limit", String(PAGE_SIZE));

    const response = await fetch(url.toString(), {
      credentials: "include",
      headers: { accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Shopee API lỗi: ${response.status}`);
    }

    const payload = await response.json();
    return payload?.data?.details_list || [];
  }

  async function collectShopeeStats() {
    let offset = 0;
    let totalOrders = 0;
    let totalSpent = 0;
    let totalOriginal = 0;
    let totalItems = 0;
    let keepFetching = true;

    while (keepFetching) {
      const orders = await fetchOrders(offset);
      totalOrders += orders.length;

      for (const order of orders) {
        const stats = readOrderStats(order);
        totalSpent += stats.finalTotal;
        totalOriginal += stats.originalTotal;
        totalItems += stats.itemCount;
      }

      keepFetching = orders.length >= PAGE_SIZE;
      offset += PAGE_SIZE;
    }

    return {
      totalOrders,
      totalSpent,
      totalItems,
      totalSaved: Math.max(0, totalOriginal - totalSpent)
    };
  }

  function setText(root, selector, text) {
    const node = root.querySelector(selector);
    if (node) {
      node.textContent = text;
    }
  }

  function updateHeroLevel(root, summary) {
    const hero = root.querySelector("#shopee-stats-hero");
    if (!hero) {
      return;
    }

    hero.className = `hero level-${summary.key}`;
    setText(root, "#shopee-stats-level", `Level: ${summary.title}`);
  }

  injectStyles();
  const overlay = createOverlay();

  collectShopeeStats()
    .then((stats) => {
      const summary = buildFunnySummary(stats.totalSpent);
      setText(overlay, "#shopee-stats-title", summary.headline);
      setText(overlay, "#shopee-stats-detail", summary.detail);
      updateHeroLevel(overlay, summary);
      setText(
        overlay,
        "#shopee-stats-status",
        "Tra cứu xong. Shopee đã khai thật, ví tiền cũng không chối được nữa."
      );
      setText(overlay, "#value-spent", `${formatNumber(stats.totalSpent)} VNĐ`);
      setText(overlay, "#value-orders", `${formatNumber(stats.totalOrders)} đơn`);
      setText(overlay, "#value-items", `${formatNumber(stats.totalItems)} sản phẩm`);
      setText(overlay, "#value-saved", `${formatNumber(stats.totalSaved)} VNĐ`);
      setText(
        overlay,
        "#shopee-stats-meta",
        `Cập nhật lúc: ${new Date().toLocaleString("vi-VN")}`
      );
    })
    .catch((error) => {
      setText(overlay, "#shopee-stats-title", "Chưa tra cứu được");
      setText(
        overlay,
        "#shopee-stats-detail",
        "Hãy kiểm tra xem bạn đã mở Shopee và đăng nhập tài khoản chưa."
      );
      setText(overlay, "#shopee-stats-level", "Level: Chưa đủ dữ liệu");
      setText(overlay, "#shopee-stats-status", error.message || "Đã xảy ra lỗi.");
    });
})();
