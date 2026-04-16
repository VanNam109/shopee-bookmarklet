(function () {
  const OVERLAY_ID = "shopee-stats-overlay";
  const STYLE_ID = "shopee-stats-style";
  const API_URL = "https://shopee.vn/api/v4/order/get_order_list";
  const PAGE_SIZE = 20;
  const SCRIPT_BASE_URL = new URL("./", document.currentScript?.src || window.location.href);
  const LEVEL_IMAGES = [
    "assets/levels/1.jpg",
    "assets/levels/2.jpeg",
    "assets/levels/3.webp",
    "assets/levels/4.webp",
    "assets/levels/5.webp",
    "assets/levels/6.jpg",
    "assets/levels/1.jpg",
    "assets/levels/3.webp",
    "assets/levels/5.webp",
    "assets/levels/6.jpg"
  ].map((path) => new URL(path, SCRIPT_BASE_URL).href);

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
        max-height: min(92vh, 900px);
        display: flex;
        flex-direction: column;
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
      #${OVERLAY_ID} .hero.level-mua-cho-vui {
        background: linear-gradient(135deg, #0891b2, #22d3ee);
      }
      #${OVERLAY_ID} .hero.level-san-sale-nhap-mon {
        background: linear-gradient(135deg, #0369a1, #38bdf8);
      }
      #${OVERLAY_ID} .hero.level-tay-nhanh-hon-nao {
        background: linear-gradient(135deg, #2563eb, #60a5fa);
      }
      #${OVERLAY_ID} .hero.level-thanh-vien-than-quen {
        background: linear-gradient(135deg, #7c3aed, #a78bfa);
      }
      #${OVERLAY_ID} .hero.level-truong-phong-chot-don {
        background: linear-gradient(135deg, #9333ea, #c084fc);
      }
      #${OVERLAY_ID} .hero.level-dai-su-nganh-hang {
        background: linear-gradient(135deg, #7c2d12, #f97316);
      }
      #${OVERLAY_ID} .hero.level-he-tam-linh-vi-dien-tu {
        background: linear-gradient(135deg, #ea580c, #fb923c);
      }
      #${OVERLAY_ID} .hero.level-trum-cuoi-flash-sale {
        background: linear-gradient(135deg, #dc2626, #fb7185);
      }
      #${OVERLAY_ID} .hero.level-huyen-thoai-tieu-dung {
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
      #${OVERLAY_ID} .hero-media {
        margin-top: 16px;
        padding: 8px;
        border-radius: 18px;
        background: rgba(255, 247, 237, 0.16);
      }
      #${OVERLAY_ID} .hero-image {
        display: block;
        width: min(100%, 280px);
        height: 140px;
        margin: 0 auto;
        object-fit: contain;
        border-radius: 14px;
        background: rgba(255, 247, 237, 0.2);
      }
      #${OVERLAY_ID} .body {
        flex: 1;
        padding: 18px 22px 22px;
        overflow-y: auto;
        overscroll-behavior: contain;
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
        gap: 16px;
        align-items: flex-end;
        padding: 18px 28px 24px 22px;
        background: #fff;
        border-top: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow: 0 -8px 24px rgba(15, 23, 42, 0.04);
      }
      #${OVERLAY_ID} .meta {
        font-size: 12px;
        color: #64748b;
        line-height: 1.5;
        margin-right: auto;
      }
      #${OVERLAY_ID} .close {
        border: 0;
        border-radius: 12px;
        background: #ea580c;
        color: #fff;
        font-weight: 700;
        padding: 11px 16px;
        cursor: pointer;
        flex-shrink: 0;
        margin-right: 2px;
        margin-bottom: 2px;
      }
      @media (max-width: 520px) {
        #${OVERLAY_ID} .grid { grid-template-columns: 1fr; }
        #${OVERLAY_ID} {
          padding: 12px;
          align-items: stretch;
        }
        #${OVERLAY_ID} .panel {
          width: 100%;
          max-height: 100%;
          border-radius: 20px;
        }
        #${OVERLAY_ID} .hero h2 {
          font-size: 30px;
        }
        #${OVERLAY_ID} .footer {
          align-items: stretch;
          flex-direction: column;
          padding: 14px 18px 20px;
        }
        #${OVERLAY_ID} .close {
          width: 100%;
          margin-right: 0;
          margin-bottom: 0;
        }
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
    if (totalSpent <= 100000) {
      return {
        key: "khong-nghien",
        title: "Level 1 - Dạo cho biết mùi",
        headline: "Ví vẫn tươi, chưa phải báo người nhà",
        detail:
          "Bạn mới lướt Shopee kiểu xã giao cho có lệ. Số dư vẫn còn nguyên khí, ngân hàng chưa cần gọi điện hỏi thăm.",
        imageUrl: LEVEL_IMAGES[0],
        imageAlt: "Minh hoa vui nhon level 1 luot cho vui",
      };
    }

    if (totalSpent <= 500000) {
      return {
        key: "mua-cho-vui",
        title: "Level 2 - Chốt đơn bằng phản xạ",
        headline: "Ngón tay bắt đầu có chính kiến riêng",
        detail:
          "Mới vài món thôi nhưng đã bắt đầu hay nói câu rất nguy hiểm: 'mua chút xíu à, đáng bao nhiêu đâu'. Đây là câu mở đầu cho nhiều bi kịch.",
        imageUrl: LEVEL_IMAGES[1],
        imageAlt: "Minh hoa vui nhon level 2 chot nhe",
      };
    }

    if (totalSpent <= 2000000) {
      return {
        key: "san-sale-nhap-mon",
        title: "Level 3 - Tân binh săn sale",
        headline: "Voucher vừa thò mặt ra là bạn lao tới",
        detail:
          'Bạn đã thuộc lòng giờ sale, mã freeship và thần chú "em không tiêu tiền, em đang tối ưu chi phí". Nghe rất tài chính nhưng cuối cùng vẫn là mua.',
        imageUrl: LEVEL_IMAGES[2],
        imageAlt: "Minh hoa vui nhon level 3 san sale",
      };
    }

    if (totalSpent <= 5000000) {
      return {
        key: "tay-nhanh-hon-nao",
        title: "Level 4 - Não chưa duyệt, tay đã duyệt",
        headline: "Đơn xác nhận trước khi lý trí kịp online",
        detail:
          "Quy trình mua hàng của bạn rất gọn: thấy deal, chốt đơn, trả tiền, rồi ngồi đơ 7 giây để tự hỏi ai đã cầm điện thoại của mình nãy giờ.",
        imageUrl: LEVEL_IMAGES[3],
        imageAlt: "Minh hoa vui nhon level 4 tay nhanh",
      };
    }

    if (totalSpent <= 10000000) {
      return {
        key: "thanh-vien-than-quen",
        title: "Level 5 - Khách quen hệ kim cương",
        headline: "Shipper nhìn địa chỉ là thở dài nhẹ",
        detail:
          "Bạn nhớ mã giảm giá nhanh hơn lịch họp, mở Shopee nhanh hơn app ngân hàng, và shipper đã thuộc mặt bạn như người thân thất lạc lâu năm.",
        imageUrl: LEVEL_IMAGES[4],
        imageAlt: "Minh hoa vui nhon level 5 thanh vien than quen",
      };
    }

    if (totalSpent <= 30000000) {
      return {
        key: "truong-phong-chot-don",
        title: "Level 6 - Trưởng phòng tiêu dùng",
        headline: "Mỗi cú chốt đơn đều có biên bản nội tâm",
        detail:
          "Bạn không còn mua đồ nữa, bạn đang điều hành cả một quy trình gồm: khảo giá, so voucher, canh giờ, rồi tự duyệt ngân sách bằng cảm xúc.",
        imageUrl: LEVEL_IMAGES[5],
        imageAlt: "Minh hoa vui nhon level 6 truong phong chot don",
      };
    }

    if (totalSpent <= 70000000) {
      return {
        key: "dai-su-nganh-hang",
        title: "Level 7 - Đại sứ chốt đơn đa ngành",
        headline: "Shopee nhìn bạn như khách VIP toàn sàn",
        detail:
          "Từ gia dụng, mỹ phẩm đến mấy món mua xong chưa biết để làm gì, bạn vẫn có thể thuyết trình 15 phút để chứng minh đó là nhu cầu cấp thiết.",
        imageUrl: LEVEL_IMAGES[6],
        imageAlt: "Minh hoa vui nhon level 7 dai su nganh hang",
      };
    }

    if (totalSpent <= 120000000) {
      return {
        key: "he-tam-linh-vi-dien-tu",
        title: "Level 8 - Hệ tâm linh ví điện tử",
        headline: "Ví vừa ting một cái là linh hồn rời cơ thể",
        detail:
          "Mỗi mùa sale đi qua là trái tim bạn nở hoa, còn số dư tài khoản thì âm thầm đi học khóa 'chấp nhận sự thật'. Mối quan hệ này rất độc hại nhưng bạn vẫn đắm say.",
        imageUrl: LEVEL_IMAGES[7],
        imageAlt: "Minh hoa vui nhon level 8 vi dien tu",
      };
    }

    if (totalSpent <= 200000000) {
      return {
        key: "trum-cuoi-flash-sale",
        title: "Level 9 - Trùm cuối của mọi đợt sale",
        headline: "Lịch sử mua hàng dài hơn chuyện tình cũ",
        detail:
          "Bạn phát hiện voucher bằng giác quan thứ sáu, canh sale bằng bản năng sinh tồn, và chốt đơn quyết liệt tới mức người ngoài tưởng bạn đang gánh KPI cho cả sàn.",
        imageUrl: LEVEL_IMAGES[8],
        imageAlt: "Minh hoa vui nhon level 9 trum cuoi flash sale",
      };
    }

    return {
      key: "huyen-thoai-tieu-dung",
      title: "Level 10 - Tượng đài tiêu dùng bất diệt",
      headline: "Ngân hàng thấy tên bạn là tự bật báo động nội bộ",
      detail:
        "Bạn không còn mua sắm nữa, bạn đang viết sử thi cho giỏ hàng bằng chính hạn mức thanh toán của mình. Bảng sao kê nhìn xong cũng phải ngồi xuống uống nước cho đỡ sốc.",
      imageUrl: LEVEL_IMAGES[9],
      imageAlt: "Minh hoa vui nhon level 10 huyen thoai tieu dung",
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
          <span id="shopee-stats-level" class="hero-level">Đang phân tích level...</span>
          <div class="hero-media">
            <img
              id="shopee-stats-image"
              class="hero-image"
              src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=shopee-loading"
              alt="Minh hoa dang phan tich muc do mua sam"
            />
          </div>
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
            <div class="card">
              <span class="label">Cú chốt đau ví nhất</span>
              <span id="value-max-order" class="value">-</span>
            </div>
            <div class="card">
              <span class="label">Đơn mua cho vui nhưng vẫn tính</span>
              <span id="value-min-order" class="value">-</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <span id="shopee-stats-meta" class="meta">Chỉ dùng dữ liệu của phiên đăng nhập hiện tại.</span>
          <button id="shopee-stats-close" class="close">Đóng</button>
        </div>
      </div>
    `;

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        overlay.remove();
      }
    });

    overlay
      .querySelector("#shopee-stats-close")
      .addEventListener("click", () => {
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
      headers: { accept: "application/json" },
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
    let maxOrderValue = 0;
    let minOrderValue = Number.POSITIVE_INFINITY;
    let keepFetching = true;

    while (keepFetching) {
      const orders = await fetchOrders(offset);
      totalOrders += orders.length;

      for (const order of orders) {
        const stats = readOrderStats(order);
        totalSpent += stats.finalTotal;
        totalOriginal += stats.originalTotal;
        totalItems += stats.itemCount;
        if (stats.finalTotal > maxOrderValue) {
          maxOrderValue = stats.finalTotal;
        }
        if (stats.finalTotal > 0 && stats.finalTotal < minOrderValue) {
          minOrderValue = stats.finalTotal;
        }
      }

      keepFetching = orders.length >= PAGE_SIZE;
      offset += PAGE_SIZE;
    }

    return {
      totalOrders,
      totalSpent,
      totalItems,
      totalSaved: Math.max(0, totalOriginal - totalSpent),
      maxOrderValue,
      minOrderValue: Number.isFinite(minOrderValue) ? minOrderValue : 0,
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
    setText(root, "#shopee-stats-level", summary.title);
    const imageNode = root.querySelector("#shopee-stats-image");
    if (imageNode) {
      imageNode.src = summary.imageUrl;
      imageNode.alt = summary.imageAlt;
    }
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
        "Tra cứu xong. Shopee đã lên tiếng, lịch sử mua hàng đã khai hết, còn ví tiền thì đang xin được giữ quyền im lặng.",
      );
      setText(overlay, "#value-spent", `${formatNumber(stats.totalSpent)} VNĐ`);
      setText(
        overlay,
        "#value-orders",
        `${formatNumber(stats.totalOrders)} đơn`,
      );
      setText(
        overlay,
        "#value-items",
        `${formatNumber(stats.totalItems)} sản phẩm`,
      );
      setText(overlay, "#value-saved", `${formatNumber(stats.totalSaved)} VNĐ`);
      setText(
        overlay,
        "#value-max-order",
        `${formatNumber(stats.maxOrderValue)} VNĐ`,
      );
      setText(
        overlay,
        "#value-min-order",
        `${formatNumber(stats.minOrderValue)} VNĐ`,
      );
      setText(
        overlay,
        "#shopee-stats-meta",
        `Cập nhật lúc: ${new Date().toLocaleString("vi-VN")}`,
      );
    })
    .catch((error) => {
      setText(overlay, "#shopee-stats-title", "Chưa tra cứu được");
      setText(
        overlay,
        "#shopee-stats-detail",
        "Hãy kiểm tra xem bạn đã mở Shopee và đăng nhập tài khoản chưa.",
      );
      setText(overlay, "#shopee-stats-level", "Chưa đủ dữ liệu để chẩn đoán");
      setText(
        overlay,
        "#shopee-stats-status",
        error.message || "Đã xảy ra lỗi.",
      );
    });
})();
