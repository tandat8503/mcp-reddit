# 🚀 MCP Reddit Server - Quick Start Guide

## 📋 **Tổng quan**

MCP Reddit Server cung cấp **13 tools** để tương tác với Reddit API thông qua Model Context Protocol (MCP). Tất cả tools đều có hướng dẫn inline chi tiết trong code.

---

## ⚡ **Khởi động nhanh**

### **1. Build & Start**
```bash
# Build project
npm run build

# Start MCP server
npm start
```

### **2. Kết nối MCP Client**
```json
{
  "mcpServers": {
    "reddit": {
      "command": "node",
      "args": ["/path/to/mcp-reddit/dist/index.js"]
    }
  }
}
```

---

## 🔍 **READ-ONLY TOOLS (7 tools) - Không cần OAuth**

### **1. 📖 get_subreddit_posts**
**Lấy posts từ subreddit**
```json
{
  "name": "get_subreddit_posts",
  "arguments": {
    "subreddit": "programming",
    "sort": "hot"
  }
}
```
**Examples:**
- `{"subreddit": "programming"}` - Lấy hot posts
- `{"subreddit": "AskReddit", "sort": "new"}` - Lấy new posts
- `{"subreddit": "MachineLearning", "sort": "top"}` - Lấy top posts

### **2. 🔍 search_reddit**
**Tìm kiếm trên Reddit**
```json
{
  "name": "search_reddit",
  "arguments": {
    "query": "machine learning",
    "subreddit": "programming"
  }
}
```
**Examples:**
- `{"query": "machine learning"}` - Tìm kiếm global
- `{"query": "python tutorial", "subreddit": "programming"}` - Tìm trong subreddit
- `{"query": "TypeScript", "subreddit": "typescript"}` - Tìm tech content

### **3. 👤 get_user_profile**
**Lấy thông tin user**
```json
{
  "name": "get_user_profile",
  "arguments": {
    "username": "spez"
  }
}
```
**Examples:**
- `{"username": "spez"}` - Profile của CEO Reddit
- `{"username": "AwkwardTension4482"}` - Profile test user
- `{"username": "gallowboob"}` - Profile user nổi tiếng

### **4. 🏠 get_subreddit_info**
**Lấy thông tin subreddit**
```json
{
  "name": "get_subreddit_info",
  "arguments": {
    "subreddit": "programming"
  }
}
```
**Examples:**
- `{"subreddit": "programming"}` - Info r/programming
- `{"subreddit": "AskReddit"}` - Info r/AskReddit
- `{"subreddit": "MachineLearning"}` - Info r/MachineLearning

### **5. 💬 get_post_comments**
**Lấy comments của post**
```json
{
  "name": "get_post_comments",
  "arguments": {
    "post_id": "1n1nlse",
    "sort": "best"
  }
}
```
**Examples:**
- `{"post_id": "1n1nlse"}` - Lấy comments
- `{"post_id": "1n1nlse", "sort": "best"}` - Best comments
- `{"post_id": "1n1nlse", "sort": "new"}` - New comments

### **6. 🔥 get_trending_subreddits**
**Lấy subreddits trending**
```json
{
  "name": "get_trending_subreddits",
  "arguments": {}
}
```
**Examples:**
- `{}` - Lấy trending subreddits

### **7. 🔄 get_cross_posts**
**Tìm crossposts**
```json
{
  "name": "get_cross_posts",
  "arguments": {
    "post_id": "1n1nlse"
  }
}
```
**Examples:**
- `{"post_id": "1n1nlse"}` - Tìm crossposts
- `{"post_id": "1abc123"}` - Check shares

---

## 🎯 **ACTION TOOLS (6 tools) - Cần OAuth**

### **8. 📝 submit_post**
**Đăng post mới**
```json
{
  "name": "submit_post",
  "arguments": {
    "subreddit": "test",
    "title": "MCP Test Post",
    "content": "Testing MCP Reddit Server"
  }
}
```
**Examples:**
- `{"subreddit": "test", "title": "My Post", "content": "Post content"}` - Text post
- `{"subreddit": "programming", "title": "Cool Article", "content": "https://example.com"}` - Link post
- `{"subreddit": "test", "title": "MCP Test", "content": "Testing MCP Reddit Server"}` - Test post

### **9. 💬 submit_comment**
**Đăng comment**
```json
{
  "name": "submit_comment",
  "arguments": {
    "post_id": "1n1nlse",
    "text": "Great post!"
  }
}
```
**Examples:**
- `{"post_id": "1n1nlse", "text": "Great post!"}` - New comment
- `{"post_id": "1n1nlse", "text": "I agree", "parent_id": "t1_abc123"}` - Reply comment
- `{"post_id": "1n1nlse", "text": "Test comment from MCP"}` - Test comment

### **10. ⬆️ vote_post**
**Vote post/comment**
```json
{
  "name": "vote_post",
  "arguments": {
    "post_id": "1n1nlse",
    "direction": "up"
  }
}
```
**Examples:**
- `{"post_id": "1n1nlse", "direction": "up"}` - Upvote
- `{"post_id": "1n1nlse", "direction": "down"}` - Downvote
- `{"post_id": "1n1nlse", "direction": "remove"}` - Remove vote

### **11. 💾 save_post**
**Lưu/bỏ lưu post**
```json
{
  "name": "save_post",
  "arguments": {
    "post_id": "1n1nlse",
    "action": "save"
  }
}
```
**Examples:**
- `{"post_id": "1n1nlse", "action": "save"}` - Save post
- `{"post_id": "1n1nlse", "action": "unsave"}` - Unsave post

### **12. 📧 send_message**
**Gửi tin nhắn riêng**
```json
{
  "name": "send_message",
  "arguments": {
    "to": "username",
    "subject": "Hello",
    "text": "Hi there!"
  }
}
```
**Examples:**
- `{"to": "username", "subject": "Hello", "text": "Hi there!"}` - Send message
- `{"to": "AwkwardTension4482", "subject": "MCP Test", "text": "Test from MCP"}` - Test message

### **13. 🔔 subscribe_subreddit**
**Subscribe/unsubscribe subreddit**
```json
{
  "name": "subscribe_subreddit",
  "arguments": {
    "subreddit": "programming",
    "action": "follow"
  }
}
```
**Examples:**
- `{"subreddit": "programming", "action": "follow"}` - Subscribe
- `{"subreddit": "programming", "action": "unfollow"}` - Unsubscribe
- `{"subreddit": "test", "action": "follow"}` - Test subscribe

---

## 🔐 **OAuth Setup cho Action Tools**

### **1. Tạo Reddit App**
1. Vào [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Click "create application"
3. Chọn "script" type
4. Set redirect URI: `http://localhost:8080`
5. Copy Client ID và Client Secret

### **2. Cấu hình .env**
```env
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USER_AGENT=Your-App-Name/1.0.0 (by /u/YourUsername)
REDDIT_REDIRECT_URI=http://localhost:8080
REDDIT_OAUTH_SCOPES=read submit vote history privatemessages subscribe
```

### **3. OAuth Scopes**
- `read`: Read posts, comments, subreddits
- `submit`: Submit posts and comments
- `vote`: Upvote/downvote posts and comments
- `history`: Save/unsave posts
- `privatemessages`: Send private messages
- `subscribe`: Subscribe/unsubscribe to subreddits

---

## 🔧 **Troubleshooting**

### **Common Errors & Solutions**

#### **❌ 401 Unauthorized**
```
🔧 Troubleshooting:
• Check your Reddit API credentials in .env file
• Verify Client ID and Client Secret are correct
• Ensure your Reddit app is configured as 'script' type
• For action tools, setup OAuth2 Authorization Code flow first
```

#### **❌ 403 Forbidden**
```
🔧 Troubleshooting:
• Check your User-Agent string in .env file
• Verify your Reddit app is not suspended
• Ensure proper OAuth scopes are configured
• Check if you have permission to access this resource
```

#### **❌ 404 Not Found**
```
🔧 Troubleshooting:
• Verify the subreddit name is correct (without r/ prefix)
• Check if the post ID is valid
• Ensure the username exists on Reddit
• Try with a different subreddit or post ID
```

#### **❌ Rate Limit Exceeded**
```
🔧 Troubleshooting:
• Wait a few minutes before trying again
• Reddit allows 60 requests/minute for OAuth apps
• Consider implementing request delays
• Check if you're making too many requests
```

---

## 📊 **Response Format**

### **✅ Success Response**
```json
{
  "content": [
    {
      "type": "text",
      "text": "✅ **Success message with formatted data**"
    }
  ]
}
```

### **❌ Error Response**
```json
{
  "content": [
    {
      "type": "text",
      "text": "❌ **Error message with troubleshooting tips**"
    }
  ]
}
```

---

## 🎯 **Test Commands**

### **Quick Test**
```bash
# Test basic functionality
node simple-test.js

# Test all tools
node final-test.cjs
```

### **MCP Client Test**
```bash
# Start MCP server
npm start

# Connect your MCP client and test tools
```

---

## 🚀 **Ready to Use!**

MCP Reddit Server đã sẵn sàng với:
- ✅ **13 tools** hoạt động hoàn hảo
- ✅ **Hướng dẫn inline** chi tiết cho mỗi tool
- ✅ **Examples** cụ thể cho từng use case
- ✅ **Error handling** với troubleshooting tips
- ✅ **OAuth2 support** đầy đủ
- ✅ **Smart auto-detection** cho parameters

**Happy Reddit-ing!** 🎉
