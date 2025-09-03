# 📝 MCP Reddit Server - Inline Comments Summary

## 🎯 **Mục đích thêm Inline Comments**

Để giúp developers và users hiểu rõ cách sử dụng từng tool và function trong khi MCP server đang hoạt động, tôi đã thêm các inline comments chi tiết với:

- **🎯 Chức năng**: Mô tả rõ ràng tool làm gì
- **📝 Parameters**: Giải thích từng parameter và ý nghĩa
- **🔍 Output**: Mô tả dữ liệu trả về
- **💡 Use case**: Ví dụ cụ thể khi nào sử dụng
- **🔍 Đặc biệt**: Tính năng đặc biệt của tool
- **⚠️ Lưu ý**: Cảnh báo quan trọng về OAuth, permissions

---

## 🔍 **READ-ONLY TOOLS - Inline Comments**

### **1. get_subreddit_posts**
```typescript
// Tool 1: Get Subreddit Posts - Lấy danh sách bài viết từ subreddit
// 🎯 Chức năng: Lấy posts từ một subreddit cụ thể với các option sort khác nhau
// 📝 Parameters: subreddit (tên subreddit), sort (hot/new/top/rising), limit (số lượng), time (thời gian)
// 🔍 Output: Danh sách posts được format đẹp với thông tin chi tiết
// 💡 Use case: Hiển thị trending posts, khám phá nội dung mới, theo dõi subreddit yêu thích
```

### **2. search_reddit**
```typescript
// Tool 2: Search Reddit - Tìm kiếm posts và comments trên Reddit
// 🎯 Chức năng: Tìm kiếm nội dung trên Reddit với các filter và sort option
// 📝 Parameters: query (từ khóa), subreddit (giới hạn trong subreddit), sort (sắp xếp), time (thời gian), limit (số lượng)
// 🔍 Output: Kết quả tìm kiếm được format đẹp với thông tin chi tiết
// 💡 Use case: Tìm kiếm thông tin cụ thể, khám phá nội dung mới, research topics
```

### **3. get_user_profile**
```typescript
// Tool 3: Get User Profile - Lấy thông tin chi tiết về user Reddit
// 🎯 Chức năng: Lấy profile của một user Reddit bao gồm karma, tuổi account, verification status
// 📝 Parameters: username (tên user cần tìm)
// 🔍 Output: Thông tin user được format đẹp với karma, ngày tạo, gold status, moderator status
// 💡 Use case: Kiểm tra profile user, xem karma và reputation, verify user identity
```

### **4. get_subreddit_info**
```typescript
// Tool 4: Get Subreddit Information - Lấy thông tin chi tiết về subreddit
// 🎯 Chức năng: Lấy thông tin về một subreddit bao gồm mô tả, số subscribers, ngày tạo
// 📝 Parameters: subreddit (tên subreddit cần tìm)
// 🔍 Output: Thông tin subreddit được format đẹp với subscribers, mô tả, NSFW status, URL
// 💡 Use case: Khám phá subreddit mới, xem thống kê community, kiểm tra nội dung policy
```

### **5. get_post_comments**
```typescript
// Tool 5: Get Post Comments - Lấy comments của một post Reddit
// 🎯 Chức năng: Lấy comments của một post cụ thể với các option sort khác nhau
// 📝 Parameters: post_id (ID của post), limit (số lượng comments), sort (sắp xếp comments)
// 🔍 Output: Comments được format đẹp với tree structure, indent cho replies, score và author
// 💡 Use case: Đọc comments của post, theo dõi discussion, xem replies và nested comments
```

### **6. get_trending_subreddits**
```typescript
// Tool 6: Get Trending Subreddits - Lấy danh sách subreddits phổ biến/trending
// 🎯 Chức năng: Lấy danh sách các subreddit đang trending hoặc phổ biến trên Reddit
// 📝 Parameters: limit (số lượng subreddits cần lấy)
// 🔍 Output: Danh sách subreddits trending được format đẹp với subscribers, mô tả, URL
// 💡 Use case: Khám phá subreddits mới, xem community nào đang hot, tìm nội dung thú vị
```

### **7. get_cross_posts**
```typescript
// Tool 7: Get Cross Posts - Tìm crossposts của một post Reddit
// 🎯 Chức năng: Tìm các crossposts (bài viết được share lại) của một post cụ thể
// 📝 Parameters: post_id (ID của post gốc), limit (số lượng crossposts cần lấy)
// 🔍 Output: Danh sách crossposts được format đẹp với thông tin chi tiết
// 💡 Use case: Theo dõi nội dung được share lại, xem post được post ở subreddits nào khác
```

---

## 🎯 **ACTION TOOLS - Inline Comments**

### **8. submit_post**
```typescript
// Tool 8: Submit Post - Đăng bài viết mới lên subreddit
// 🎯 Chức năng: Đăng một bài viết mới (text hoặc link) lên một subreddit cụ thể
// 📝 Parameters: subreddit (tên subreddit), title (tiêu đề), content (nội dung), kind (loại), nsfw (18+), spoiler
// 🔍 Output: Thông báo thành công với post ID và link Reddit
// 💡 Use case: Đăng bài viết mới, chia sẻ nội dung, tham gia discussion
// ⚠️ Lưu ý: Cần OAuth scope 'submit' và user phải có quyền post trong subreddit
```

### **9. submit_comment**
```typescript
// Tool 9: Submit Comment - Đăng comment lên một post Reddit
// 🎯 Chức năng: Đăng comment mới lên một post hoặc reply vào comment khác
// 📝 Parameters: post_id (ID của post), text (nội dung comment), parent_id (ID comment cha nếu là reply)
// 🔍 Output: Thông báo thành công với comment ID và thông tin chi tiết
// 💡 Use case: Tham gia discussion, reply comment, đưa ra ý kiến
// ⚠️ Lưu ý: Cần OAuth scope 'submit' và user phải có quyền comment trong subreddit
```

### **10. vote_post**
```typescript
// Tool 10: Vote on Post/Comment - Upvote/downvote post hoặc comment
// 🎯 Chức năng: Thực hiện vote (upvote/downvote) trên một post hoặc comment Reddit
// 📝 Parameters: post_id (ID của post/comment), direction (hướng vote: 1=upvote, -1=downvote, 0=unvote)
// 🔍 Output: Thông báo thành công với action đã thực hiện
// 💡 Use case: Upvote nội dung hay, downvote nội dung không phù hợp, remove vote đã thực hiện
// ⚠️ Lưu ý: Cần OAuth scope 'vote' và user phải đăng nhập để thực hiện vote
```

### **11. save_post**
```typescript
// Tool 11: Save/Unsave Post - Lưu hoặc bỏ lưu post vào favorites
// 🎯 Chức năng: Lưu post vào favorites để đọc sau hoặc bỏ lưu post đã lưu
// 📝 Parameters: post_id (ID của post), action (save hoặc unsave)
// 🔍 Output: Thông báo thành công với action đã thực hiện
// 💡 Use case: Lưu post hay để đọc sau, bookmark nội dung quan trọng, quản lý favorites
// ⚠️ Lưu ý: Cần OAuth scope 'history' và user phải đăng nhập để lưu/unsave
```

### **12. send_message**
```typescript
// Tool 12: Send Private Message - Gửi tin nhắn riêng tư cho user Reddit
// 🎯 Chức năng: Gửi tin nhắn riêng tư (private message) cho một user Reddit cụ thể
// 📝 Parameters: to (username người nhận), subject (tiêu đề), text (nội dung tin nhắn)
// 🔍 Output: Thông báo thành công với thông tin tin nhắn đã gửi
// 💡 Use case: Liên lạc riêng tư với user khác, gửi thông báo, trao đổi thông tin
// ⚠️ Lưu ý: Cần OAuth scope 'privatemessages' và user phải đăng nhập để gửi tin nhắn
```

### **13. subscribe_subreddit**
```typescript
// Tool 13: Subscribe/Unsubscribe Subreddit - Theo dõi hoặc bỏ theo dõi subreddit
// 🎯 Chức năng: Subscribe (theo dõi) hoặc unsubscribe (bỏ theo dõi) một subreddit
// 📝 Parameters: subreddit (tên subreddit), action (sub để subscribe, unsub để unsubscribe)
// 🔍 Output: Thông báo thành công với action đã thực hiện
// 💡 Use case: Theo dõi subreddit yêu thích, quản lý subscriptions, khám phá nội dung mới
// ⚠️ Lưu ý: Cần OAuth scope 'subscribe' và user phải đăng nhập để thay đổi subscriptions
```

---

## 🛠️ **HELPER FUNCTIONS - Inline Comments**

### **formatRedditPost**
```typescript
/**
 * Format Reddit post information for display
 * Hàm này chuyển đổi dữ liệu post từ Reddit API thành text dễ đọc
 * 
 * @param post - Dữ liệu post từ Reddit API (RedditPost interface)
 * @returns String được format đẹp với emoji và thông tin chi tiết
 * 
 * 📝 Cách sử dụng: Gọi khi cần hiển thị thông tin post cho user
 * 🔍 Dữ liệu input: Phải có đầy đủ các field bắt buộc (id, title, author, etc.)
 */
```

### **formatRedditComment**
```typescript
/**
 * Format Reddit comment information for display
 * Hàm này format comment và replies theo cấu trúc tree với indent
 * 
 * @param comment - Dữ liệu comment từ Reddit API (RedditComment interface)
 * @param depth - Độ sâu của comment (0 = comment gốc, 1 = reply, 2 = reply của reply)
 * @returns String được format với indent và thông tin comment
 * 
 * 📝 Cách sử dụng: Gọi khi cần hiển thị comment tree cho user
 * 🔍 Đặc điểm: Tự động xử lý nested replies với indent tăng dần
 */
```

### **createErrorResponse & createSuccessResponse**
```typescript
/**
 * Create standardized error/success response - Tạo response chuẩn cho MCP
 * Hàm này tạo ra response theo đúng format của MCP protocol
 * 
 * 📝 Cách sử dụng: Gọi khi cần trả về response cho MCP client
 * 🔍 Format: Content array với type "text" và text chứa thông tin
 * 💡 Lưu ý: Luôn sử dụng hàm này để đảm bảo consistency
 */
```

---

## 🚀 **SERVER STARTUP - Inline Comments**

### **Main Function**
```typescript
// ========================================
// 🚀 START SERVER - Khởi động MCP Reddit Server
// ========================================
//
// 📋 Chức năng chính:
// - Khởi tạo MCP server với tên "reddit-mcp"
// - Thiết lập StdioServerTransport để giao tiếp với MCP client
// - Kết nối server với transport
// - Xử lý graceful shutdown khi nhận signal
//
// 🔧 Transport Type: StdioServerTransport
// - Giao tiếp qua stdin/stdout (standard input/output)
// - Tương thích với hầu hết MCP clients
// - Không cần network configuration
```

### **Process Handling**
```typescript
// Handle process termination - Xử lý tín hiệu kết thúc process
// 📋 Signal Handling:
// - SIGINT: Interrupt signal (Ctrl+C từ terminal)
// - SIGTERM: Termination signal (từ system hoặc process manager)
// - Graceful shutdown: Đóng server an toàn trước khi exit
//
// 🔧 Process Management:
// - Exit code 0: Thành công, shutdown bình thường
// - Exit code 1: Có lỗi, shutdown do error
```

---

## 💡 **Lợi ích của Inline Comments**

### **🔍 Cho Developers:**
- Hiểu rõ chức năng của từng tool
- Biết cách sử dụng parameters
- Hiểu output format và error handling
- Dễ dàng debug và maintain code

### **🎯 Cho Users:**
- Biết tool nào phù hợp với nhu cầu
- Hiểu rõ parameters cần truyền
- Biết OAuth scope nào cần thiết
- Hiểu use case cụ thể của từng tool

### **📚 Cho Documentation:**
- Code tự document chính nó
- Dễ dàng generate API docs
- Giảm thiểu việc viết documentation riêng
- Luôn đồng bộ với code implementation

---

## 🎉 **Kết quả cuối cùng**

**MCP Reddit Server đã có inline comments hoàn chỉnh:**
- ✅ **13 Tools**: Mỗi tool có comments chi tiết
- ✅ **Helper Functions**: Mỗi function có documentation đầy đủ
- ✅ **Server Setup**: Comments cho startup và process handling
- ✅ **Error Handling**: Giải thích cách xử lý lỗi
- ✅ **OAuth Scopes**: Lưu ý rõ ràng về permissions cần thiết

**Code giờ đây dễ hiểu và maintain hơn nhiều!** 🚀


