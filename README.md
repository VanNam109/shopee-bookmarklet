# Shopee Stats Bookmarklet

Bản online thay cho extension, phù hợp khi không muốn phát hành qua Chrome Web Store.

Tác giả: Nam

## Cách hoạt động

1. Host tĩnh thư mục này lên một domain bất kỳ.
2. Người dùng mở `index.html`.
3. Nếu chưa thấy thanh bookmarks, bấm `Ctrl + Shift + B` để hiện ra.
4. Kéo nút bookmarklet lên thanh bookmarks hoặc sao chép bookmarklet.
5. Khi đang ở `https://shopee.vn` và đã đăng nhập, bấm bookmark đó để chạy thống kê.

## File chính

- `index.html`: trang hướng dẫn cài bookmarklet
- `app.js`: sinh đường dẫn bookmarklet theo domain hiện tại
- `shopee-runner.js`: script được bookmarklet nạp vào trang Shopee
- `styles.css`: giao diện trang hướng dẫn

## Gợi ý triển khai

- Có thể host bằng GitHub Pages, Netlify, Vercel hoặc bất kỳ static hosting nào.
- Sau khi deploy, bookmarklet sẽ tự nạp `shopee-runner.js` từ cùng domain đó.

## Lưu ý

- Script đang dùng API web nội bộ của Shopee nên có thể hỏng nếu Shopee thay đổi.
- Người dùng phải đang đăng nhập Shopee trên trình duyệt đang dùng bookmarklet.
