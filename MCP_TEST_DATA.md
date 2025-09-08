# 🧪 MCP Reddit Server - Test Data Toàn Diện

## 📋 **TỔNG QUAN**

Dữ liệu test này bao gồm tất cả 7 read-only tools của MCP Reddit Server, không cần OAuth authentication.

---

## 🔍 **READ-ONLY TOOLS (7 tools - No Authentication Required)**

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

### **4. get_user_profile**
```json
{
  "name": "get_user_profile",
  "arguments": {
    "username": "spez"
  }
}
```

**Test Cases:**
- `{"username": "gallowboob"}`
- `{"username": "AutoModerator"}`
- `{"username": "reddit"}`
- `{"username": "AwkwardTension4482"}`

### **5. get_trending_subreddits**
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

### **6. get_subreddit_info**
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
- `{"subreddit": "MachineLearning"}`

### **7. get_cross_posts**
```json
{
  "name": "get_cross_posts",
  "arguments": {
    "post_id": "1n1nlse"
  }
}
```

**Test Cases:**
- `{"post_id": "1abc123"}`
- `{"post_id": "1def456"}`

---

## 🎯 **TEST SCENARIOS**

### **Scenario 1: Content Discovery**
1. `get_trending_subreddits` → Lấy danh sách subreddit trending
2. `get_subreddit_info` → Lấy thông tin subreddit
3. `get_subreddit_posts` → Lấy posts từ subreddit
4. `search_reddit` → Tìm kiếm nội dung

### **Scenario 2: User Exploration**
1. `get_user_profile` → Lấy thông tin user
2. `get_post_comments` → Lấy comments từ post
3. `get_cross_posts` → Tìm crossposts của post

### **Scenario 3: Comprehensive Testing**
1. `get_trending_subreddits` → Khám phá subreddit trending
2. `get_subreddit_info` → Chi tiết subreddit
3. `get_subreddit_posts` → Posts từ subreddit
4. `get_user_profile` → Thông tin user
5. `get_post_comments` → Comments của post
6. `search_reddit` → Tìm kiếm nội dung
7. `get_cross_posts` → Crossposts của post

---

## 🚀 **QUICK TEST COMMANDS**

### **MCP Inspector JSON Commands:**

```json
// Initialize
{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test-client", "version": "1.0.0"}}}

// List tools
{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}

// Test read-only tool
{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "get_subreddit_posts", "arguments": {"subreddit": "test", "sort": "hot"}}}

// Test user profile
{"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "get_user_profile", "arguments": {"username": "spez"}}}

// Test search
{"jsonrpc": "2.0", "id": 5, "method": "tools/call", "params": {"name": "search_reddit", "arguments": {"query": "python tutorial", "subreddit": "learnprogramming"}}}
```

---

## 📊 **TEST RESULTS EXPECTED**

### **✅ Success Responses:**
- All tools: Data with posts/comments/subreddits/users
- Formatted output with emoji and clear structure
- Smart defaults applied automatically

### **❌ Error Responses:**
- 403: Forbidden (check User-Agent)
- 404: Resource not found (invalid subreddit/username/post_id)
- 429: Rate limit exceeded

---

## 💡 **TESTING TIPS**

1. **All tools work immediately** - No setup required
2. **Use popular subreddits** like "programming", "AskReddit", "funny"
3. **Test with real usernames** like "spez", "gallowboob"
4. **Check rate limits** - Don't spam requests
5. **Test error handling** with invalid parameters
6. **Use MCP Inspector** for easy testing

**Happy Testing! 🚀**
