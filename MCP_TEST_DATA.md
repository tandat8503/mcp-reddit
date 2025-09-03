# 🧪 MCP Reddit Server - Test Data Toàn Diện

## 📋 **TỔNG QUAN**

Dữ liệu test này bao gồm tất cả 15 tools của MCP Reddit Server, được phân loại theo chức năng và mức độ phức tạp.

---

## 🔍 **READ-ONLY TOOLS (7 tools)**

### **1. get_subreddit_posts**
```json
{
  "name": "get_subreddit_posts",
  "arguments": {
    "subreddit": "programming",
    "sort": "hot",
    "limit": 10
  }
}
```

**Test Cases:**
- `{"subreddit": "test", "sort": "new", "limit": 5}`
- `{"subreddit": "funny", "sort": "top", "time": "week", "limit": 8}`
- `{"subreddit": "AskReddit", "sort": "rising", "limit": 15}`

### **2. search_reddit**
```json
{
  "name": "search_reddit",
  "arguments": {
    "query": "machine learning",
    "subreddit": "programming",
    "sort": "relevance",
    "limit": 10
  }
}
```

**Test Cases:**
- `{"query": "python tutorial", "subreddit": "learnprogramming"}`
- `{"query": "crypto news", "sort": "new", "limit": 5}`
- `{"query": "AI", "subreddit": "technology", "time": "month"}`

### **3. get_post_comments**
```json
{
  "name": "get_post_comments",
  "arguments": {
    "post_id": "t3_1234567",
    "sort": "top",
    "limit": 20
  }
}
```

**Test Cases:**
- `{"post_id": "t3_abc123", "sort": "new", "limit": 10}`
- `{"post_id": "t3_def456", "sort": "controversial", "limit": 15}`

### **4. get_user_posts**
```json
{
  "name": "get_user_posts",
  "arguments": {
    "username": "spez",
    "sort": "new",
    "limit": 10
  }
}
```

**Test Cases:**
- `{"username": "AutoModerator", "sort": "top", "limit": 5}`
- `{"username": "reddit", "sort": "hot", "limit": 8}`

### **5. get_user_comments**
```json
{
  "name": "get_user_comments",
  "arguments": {
    "username": "spez",
    "sort": "new",
    "limit": 10
  }
}
```

**Test Cases:**
- `{"username": "AutoModerator", "sort": "top", "limit": 5}`
- `{"username": "reddit", "sort": "controversial", "limit": 8}`

### **6. get_trending_subreddits**
```json
{
  "name": "get_trending_subreddits",
  "arguments": {
    "limit": 20
  }
}
```

**Test Cases:**
- `{"limit": 10}`
- `{"limit": 30}`

### **7. get_subreddit_info**
```json
{
  "name": "get_subreddit_info",
  "arguments": {
    "subreddit": "programming"
  }
}
```

**Test Cases:**
- `{"subreddit": "test"}`
- `{"subreddit": "AskReddit"}`
- `{"subreddit": "funny"}`

---

## ⚡ **ACTION TOOLS (6 tools) - Cần OAuth**

### **8. submit_post**
```json
{
  "name": "submit_post",
  "arguments": {
    "subreddit": "test",
    "title": "Test Post from MCP",
    "content": "This is a test post created by MCP Reddit Server"
  }
}
```

**Test Cases:**
- Text post: `{"subreddit": "test", "title": "My First Post", "content": "Hello Reddit!"}`
- Link post: `{"subreddit": "programming", "title": "Cool Article", "content": "https://example.com"}`
- NSFW post: `{"subreddit": "test", "title": "NSFW Test", "content": "NSFW content", "nsfw": true}`

### **9. submit_comment**
```json
{
  "name": "submit_comment",
  "arguments": {
    "post_id": "t3_1234567",
    "text": "Great post! Thanks for sharing."
  }
}
```

**Test Cases:**
- `{"post_id": "t3_abc123", "text": "Interesting perspective!"}`
- `{"post_id": "t3_def456", "text": "I agree with this point."}`

### **10. vote_post**
```json
{
  "name": "vote_post",
  "arguments": {
    "post_id": "t3_1234567",
    "direction": "up"
  }
}
```

**Test Cases:**
- Upvote: `{"post_id": "t3_abc123", "direction": "up"}`
- Downvote: `{"post_id": "t3_def456", "direction": "down"}`
- Remove vote: `{"post_id": "t3_ghi789", "direction": "neutral"}`

### **11. save_post**
```json
{
  "name": "save_post",
  "arguments": {
    "post_id": "t3_1234567",
    "action": "save"
  }
}
```

**Test Cases:**
- Save: `{"post_id": "t3_abc123", "action": "save"}`
- Unsave: `{"post_id": "t3_def456", "action": "unsave"}`

### **12. send_message**
```json
{
  "name": "send_message",
  "arguments": {
    "to": "username",
    "subject": "Hello from MCP",
    "text": "This is a test message from MCP Reddit Server"
  }
}
```

**Test Cases:**
- `{"to": "AutoModerator", "subject": "Test", "text": "Hello!"}`
- `{"to": "reddit", "subject": "Feedback", "text": "Great platform!"}`

### **13. subscribe_subreddit**
```json
{
  "name": "subscribe_subreddit",
  "arguments": {
    "subreddit": "test",
    "action": "follow"
  }
}
```

**Test Cases:**
- Subscribe: `{"subreddit": "programming", "action": "follow"}`
- Unsubscribe: `{"subreddit": "test", "action": "unfollow"}`

---

## 🔐 **OAUTH SETUP TOOLS (2 tools)**

### **14. get_oauth_url**
```json
{
  "name": "get_oauth_url",
  "arguments": {
    "state": "test_auth_123"
  }
}
```

**Test Cases:**
- `{"state": "mcp_test_456"}`
- `{}` (no state)

### **15. exchange_oauth_code**
```json
{
  "name": "exchange_oauth_code",
  "arguments": {
    "code": "AUTHORIZATION_CODE_HERE",
    "state": "test_auth_123"
  }
}
```

**Test Cases:**
- `{"code": "abc123def456", "state": "mcp_test_456"}`
- `{"code": "xyz789ghi012"}` (no state)

---

## 🎯 **TEST SCENARIOS**

### **Scenario 1: Read-Only Testing**
1. `get_trending_subreddits` → Lấy danh sách subreddit trending
2. `get_subreddit_info` → Lấy thông tin subreddit
3. `get_subreddit_posts` → Lấy posts từ subreddit
4. `get_post_comments` → Lấy comments từ post
5. `search_reddit` → Tìm kiếm nội dung

### **Scenario 2: OAuth Setup**
1. `get_oauth_url` → Lấy OAuth URL
2. Manual browser authorization
3. `exchange_oauth_code` → Đổi code lấy token

### **Scenario 3: Action Tools Testing**
1. `submit_post` → Tạo bài viết test
2. `vote_post` → Vote bài viết
3. `save_post` → Lưu bài viết
4. `subscribe_subreddit` → Subscribe subreddit
5. `send_message` → Gửi tin nhắn

### **Scenario 4: User Content**
1. `get_user_posts` → Lấy posts của user
2. `get_user_comments` → Lấy comments của user
3. `submit_comment` → Bình luận trên post

---

## 🚀 **QUICK TEST COMMANDS**

### **MCP Inspector JSON Commands:**

```json
// Initialize
{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test-client", "version": "1.0.0"}}}

// List tools
{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}

// Test read-only tool
{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "get_subreddit_posts", "arguments": {"subreddit": "test", "sort": "hot", "limit": 5}}}

// Test OAuth setup
{"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "get_oauth_url", "arguments": {"state": "test_123"}}}

// Test action tool (after OAuth)
{"jsonrpc": "2.0", "id": 5, "method": "tools/call", "params": {"name": "submit_post", "arguments": {"subreddit": "test", "title": "Test Post", "content": "Hello from MCP!"}}}
```

---

## 📊 **TEST RESULTS EXPECTED**

### **✅ Success Responses:**
- Read-only tools: Data with posts/comments/subreddits
- OAuth tools: Success messages with tokens
- Action tools: Success confirmations with IDs/URLs

### **❌ Error Responses:**
- 401: OAuth required but not authenticated
- 403: Insufficient permissions
- 404: Resource not found
- 429: Rate limit exceeded

---

## 💡 **TESTING TIPS**

1. **Start with read-only tools** - No OAuth required
2. **Setup OAuth** before testing action tools
3. **Use test subreddit** (`test`) for safe testing
4. **Check rate limits** - Don't spam requests
5. **Verify tokens** in `reddit_tokens.json`
6. **Test error handling** with invalid parameters

**Happy Testing! 🚀**
