# 🧪 MCP Reddit Server - Test Commands

## 📋 **Quick Start Testing**

### 1. **Setup & Build**
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start MCP server
npm start
```

### 2. **Quick Test Script**
```bash
# Run quick connectivity test
node quick-test.js

# Run comprehensive test
node test-mcp-tools.cjs
```

---

## 🔍 **Read-Only Tools Testing**

### **1. get_subreddit_posts**
```json
{
  "name": "get_subreddit_posts",
  "arguments": {
    "subreddit": "programming",
    "sort": "hot"
  }
}
```

### **2. search_reddit**
```json
{
  "name": "search_reddit", 
  "arguments": {
    "query": "programming",
    "subreddit": "programming"
  }
}
```

### **3. get_user_profile**
```json
{
  "name": "get_user_profile",
  "arguments": {
    "username": "AwkwardTension4482"
  }
}
```

### **4. get_subreddit_info**
```json
{
  "name": "get_subreddit_info",
  "arguments": {
    "subreddit": "programming"
  }
}
```

### **5. get_post_comments**
```json
{
  "name": "get_post_comments",
  "arguments": {
    "post_id": "1n1nlse",
    "sort": "best"
  }
}
```

### **6. get_trending_subreddits**
```json
{
  "name": "get_trending_subreddits",
  "arguments": {}
}
```

### **7. get_cross_posts**
```json
{
  "name": "get_cross_posts",
  "arguments": {
    "post_id": "1n1nlse"
  }
}
```

---

## 🎯 **Action Tools Testing (OAuth Required)**

### **8. submit_post**
```json
{
  "name": "submit_post",
  "arguments": {
    "subreddit": "test",
    "title": "MCP Reddit Server Test Post",
    "content": "This is a test post from MCP Reddit Server."
  }
}
```

### **9. submit_comment**
```json
{
  "name": "submit_comment",
  "arguments": {
    "post_id": "1n1nlse",
    "text": "Test comment from MCP Reddit Server"
  }
}
```

### **10. vote_post**
```json
{
  "name": "vote_post",
  "arguments": {
    "post_id": "1n1nlse",
    "direction": "up"
  }
}
```

### **11. save_post**
```json
{
  "name": "save_post",
  "arguments": {
    "post_id": "1n1nlse",
    "action": "save"
  }
}
```

### **12. send_message**
```json
{
  "name": "send_message",
  "arguments": {
    "to": "AwkwardTension4482",
    "subject": "MCP Reddit Server Test",
    "text": "This is a test message sent via MCP Reddit Server."
  }
}
```

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

---

## 🛠️ **MCP Client Integration**

### **Claude Desktop (MCP Client)**
```json
{
  "mcpServers": {
    "reddit": {
      "command": "node",
      "args": ["/path/to/mcp-reddit/dist/index.js"],
      "env": {
        "REDDIT_CLIENT_ID": "your_client_id",
        "REDDIT_CLIENT_SECRET": "your_client_secret",
        "REDDIT_USER_AGENT": "Your-App-Name/1.0.0 (by /u/YourUsername)"
      }
    }
  }
}
```

### **Test with MCP Inspector**
```bash
# Install MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Start inspector
mcp-inspector

# Connect to your MCP server
# Server command: node dist/index.js
```

---

## 📊 **Expected Responses**

### **Success Response Format**
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

### **Error Response Format**
```json
{
  "content": [
    {
      "type": "text",
      "text": "❌ **Error message with details**"
    }
  ]
}
```

---

## 🔧 **Troubleshooting**

### **Common Issues**

1. **401 Unauthorized**
   - Check Client ID and Client Secret
   - Verify User-Agent string
   - Ensure proper OAuth scopes

2. **403 Forbidden**
   - Check Reddit app configuration
   - Verify redirect URI matches exactly
   - Ensure app is not suspended

3. **Rate Limit Exceeded**
   - Wait for rate limit reset (60 requests/minute)
   - Implement proper rate limiting

4. **MCP Server Won't Start**
   - Check if project is built: `npm run build`
   - Verify Node.js version >= 18.0.0
   - Check environment variables

### **Debug Commands**
```bash
# Check build status
ls -la dist/

# Test Reddit API directly
curl -H "User-Agent: Your-App-Name/1.0.0" \
     "https://www.reddit.com/r/programming.json?limit=1"

# Test MCP server startup
node dist/index.js
```

---

## 📈 **Performance Testing**

### **Load Test Script**
```bash
# Test multiple requests
for i in {1..10}; do
  echo "Test $i:"
  # Your MCP client test command here
  sleep 1
done
```

### **Rate Limit Test**
```bash
# Test rate limiting
for i in {1..70}; do
  echo "Request $i:"
  # Your MCP client test command here
  sleep 1
done
```

---

## ✅ **Validation Checklist**

- [ ] MCP server starts without errors
- [ ] All 13 tools are available
- [ ] Read-only tools work without OAuth
- [ ] Action tools require proper OAuth
- [ ] Responses match expected format
- [ ] Error handling works correctly
- [ ] Rate limiting is respected
- [ ] Data formatting is consistent

---

## 🎯 **Test Scenarios**

### **Scenario 1: Basic Functionality**
1. Start MCP server
2. Test `get_subreddit_posts` with r/programming
3. Test `get_subreddit_info` with r/programming
4. Test `get_trending_subreddits`
5. Verify all responses are properly formatted

### **Scenario 2: Search & Discovery**
1. Test `search_reddit` with "programming"
2. Test `get_user_profile` with a known user
3. Test `get_post_comments` with a popular post
4. Test `get_cross_posts` with a cross-posted content

### **Scenario 3: OAuth Actions (Advanced)**
1. Setup OAuth2 Authorization Code flow
2. Test `submit_post` in r/test
3. Test `submit_comment` on a post
4. Test `vote_post` functionality
5. Test `save_post` and `unsave_post`
6. Test `send_message` to yourself
7. Test `subscribe_subreddit` and `unsubscribe`

---

## 🚀 **Ready for Production**

Your MCP Reddit Server is ready when:
- ✅ All 13 tools respond correctly
- ✅ OAuth2 flow works for action tools
- ✅ Error handling is comprehensive
- ✅ Rate limiting is properly implemented
- ✅ Data formatting is consistent
- ✅ Documentation is complete

**Happy Testing!** 🎉
