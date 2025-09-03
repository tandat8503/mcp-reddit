# 🚀 MCP Reddit Server - Quick Start Guide

## 📋 **TỔNG QUAN**

MCP Reddit Server cung cấp 15 tools để tương tác với Reddit API:
- **7 Read-only tools** - Không cần OAuth
- **6 Action tools** - Cần OAuth setup
- **2 OAuth setup tools** - Để cấu hình authentication

---

## ⚡ **KHỞI ĐỘNG NHANH**

### **1. Cài đặt và Build**
```bash
npm install
npm run build
```

### **2. Cấu hình Environment**
```bash
cp env.example .env
# Cập nhật .env với Reddit API credentials
```

### **3. Khởi động MCP Inspector**
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

### **4. Truy cập MCP Inspector**
Mở browser: http://localhost:6274

---

## 🔍 **TEST READ-ONLY TOOLS (Không cần OAuth)**

### **Lấy posts từ subreddit:**
```json
{
  "name": "get_subreddit_posts",
  "arguments": {
    "subreddit": "test",
    "sort": "hot",
    "limit": 5
  }
}
```

### **Tìm kiếm Reddit:**
```json
{
  "name": "search_reddit",
  "arguments": {
    "query": "python tutorial",
    "subreddit": "learnprogramming"
  }
}
```

### **Lấy thông tin subreddit:**
```json
{
  "name": "get_subreddit_info",
  "arguments": {
    "subreddit": "programming"
  }
}
```

### **Lấy subreddit trending:**
```json
{
  "name": "get_trending_subreddits",
  "arguments": {
    "limit": 10
  }
}
```

---

## 🔐 **SETUP OAUTH (Cho Action Tools)**

### **Bước 1: Lấy OAuth URL**
```json
{
  "name": "get_oauth_url",
  "arguments": {
    "state": "my_auth_123"
  }
}
```

### **Bước 2: Authorize trong Browser**
1. Copy URL từ kết quả
2. Mở URL trong browser
3. Đăng nhập Reddit
4. Click "Allow"

### **Bước 3: Lấy Authorization Code**
Từ redirect URL: `http://localhost:8080/?code=AUTHORIZATION_CODE&state=...`
Copy phần `code`

### **Bước 4: Exchange Code**
```json
{
  "name": "exchange_oauth_code",
  "arguments": {
    "code": "YOUR_AUTHORIZATION_CODE",
    "state": "my_auth_123"
  }
}
```

---

## ⚡ **TEST ACTION TOOLS (Sau OAuth)**

### **Tạo bài viết:**
```json
{
  "name": "submit_post",
  "arguments": {
    "subreddit": "test",
    "title": "Test Post from MCP",
    "content": "Hello from MCP Reddit Server!"
  }
}
```

### **Bình luận:**
```json
{
  "name": "submit_comment",
  "arguments": {
    "post_id": "t3_1234567",
    "text": "Great post! Thanks for sharing."
  }
}
```

### **Vote:**
```json
{
  "name": "vote_post",
  "arguments": {
    "post_id": "t3_1234567",
    "direction": "up"
  }
}
```

### **Subscribe subreddit:**
```json
{
  "name": "subscribe_subreddit",
  "arguments": {
    "subreddit": "programming",
    "action": "follow"
  }
}
```

### **Lưu bài viết:**
```json
{
  "name": "save_post",
  "arguments": {
    "post_id": "t3_1234567",
    "action": "save"
  }
}
```

### **Gửi tin nhắn:**
```json
{
  "name": "send_message",
  "arguments": {
    "to": "username",
    "subject": "Hello from MCP",
    "text": "This is a test message"
  }
}
```

---

## 🎯 **TEST SCENARIOS**

### **Scenario 1: Khám phá Reddit**
1. `get_trending_subreddits` → Xem subreddit trending
2. `get_subreddit_info` → Thông tin subreddit
3. `get_subreddit_posts` → Posts từ subreddit
4. `search_reddit` → Tìm kiếm nội dung

### **Scenario 2: Tương tác với Content**
1. Setup OAuth
2. `submit_post` → Tạo bài viết
3. `vote_post` → Vote bài viết
4. `save_post` → Lưu bài viết
5. `subscribe_subreddit` → Subscribe

### **Scenario 3: Social Interaction**
1. `get_user_posts` → Posts của user
2. `get_user_comments` → Comments của user
3. `submit_comment` → Bình luận
4. `send_message` → Gửi tin nhắn

---

## 🔧 **TROUBLESHOOTING**

### **Lỗi OAuth:**
- Kiểm tra `.env` file
- Verify redirect URI trong Reddit app settings
- Đảm bảo `REDDIT_REDIRECT_URI=http://localhost:8080`

### **Lỗi 404:**
- Subreddit không tồn tại
- Post ID không đúng
- API endpoint thay đổi

### **Lỗi 403:**
- Thiếu OAuth permissions
- Token hết hạn
- Insufficient scopes

### **Lỗi 429:**
- Rate limit exceeded
- Chờ vài phút rồi thử lại

---

## 📊 **TOKEN PERSISTENCE**

- Tokens được lưu tự động vào `reddit_tokens.json`
- Server tự động load tokens khi khởi động
- Không cần re-authenticate trừ khi xóa tokens
- Tự động refresh khi access token hết hạn

---

## 🎉 **KẾT LUẬN**

MCP Reddit Server cung cấp đầy đủ chức năng để:
- ✅ Đọc nội dung Reddit
- ✅ Tạo và quản lý posts/comments
- ✅ Vote và save content
- ✅ Subscribe/unsubscribe subreddits
- ✅ Gửi tin nhắn riêng
- ✅ Tìm kiếm và khám phá

**Happy Redditing! 🚀**
