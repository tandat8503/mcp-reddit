# MCP Reddit Server

A Model Context Protocol (MCP) server that provides read-only access to Reddit's API through a standardized interface. This server focuses on content discovery and analysis without requiring OAuth authentication.

## 🚀 Features

- **7 Read-Only Tools**: Comprehensive Reddit content access without authentication
- **No OAuth Required**: Works immediately without any setup or configuration
- **Type-Safe Architecture**: Full TypeScript with Zod schema validation and z.infer types
- **Error Handling**: Robust error handling with dynamic troubleshooting tips
- **Clean Code Patterns**: Consistent tool handlers with reduced boilerplate
- **MCP Standard**: Compliant with Model Context Protocol specifications
- **Smart Defaults**: Intelligent parameter defaults for better user experience

## 🔐 No Authentication Required

This server provides **read-only access** to Reddit's public API without requiring any authentication. All tools work immediately without OAuth setup or API credentials.

### Reddit API Access

The server uses Reddit's public API endpoints that don't require authentication:
- **Public Posts**: Access to all public subreddit posts
- **Public Comments**: Access to all public comments
- **Public Profiles**: Access to public user information
- **Public Subreddits**: Access to subreddit information and metadata

## 🛠️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mcp-reddit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

## ⚙️ Configuration

No configuration required! The server works immediately without any setup.

### Optional Environment Variables

You can create a `.env` file for optional configuration:

```env
# Optional: Custom User-Agent (recommended)
REDDIT_USER_AGENT=Your-App-Name/1.0.0 (by /u/YourUsername)

# Optional: Request timeout
TIMEOUT_SECONDS=30
```

### User-Agent String

While not required, it's recommended to set a custom User-Agent string to identify your application:
- Format: `AppName/Version (by /u/YourUsername)`
- Example: `MCP-Reddit-Server/1.0.0 (by /u/YourUsername)`

## 🧪 Testing

### Using MCP Inspector
1. **Start MCP Inspector**:
```bash
   npx @modelcontextprotocol/inspector node dist/index.js
   ```

2. **Open browser**: http://localhost:6274

3. **Test tools**: Use the comprehensive test data in `test-data.json`

### Quick Start Testing
All tools work immediately without any setup:

1. **`get_subreddit_posts`** - Get posts from any subreddit
2. **`search_reddit`** - Search across Reddit or specific subreddits
3. **`get_user_profile`** - Get user profile information
4. **`get_subreddit_info`** - Get subreddit details
5. **`get_post_comments`** - Get comments for any post
6. **`get_trending_subreddits`** - Get trending subreddits
7. **`get_cross_posts`** - Find crossposts of a post

## 🎯 Available Tools

### 📖 Read-Only Tools (7 tools - No Authentication Required)
1. **`get_subreddit_posts`** - Get posts from a subreddit with sorting options
2. **`search_reddit`** - Search for posts across Reddit or within specific subreddits
3. **`get_user_profile`** - Get detailed profile information for any Reddit user
4. **`get_subreddit_info`** - Get comprehensive subreddit information
5. **`get_post_comments`** - Get comments for a specific post with sorting
6. **`get_trending_subreddits`** - Get trending and popular subreddits
7. **`get_cross_posts`** - Find crossposts of a specific post

## 📖 Tool Usage Examples

### Read-Only Tools (No Authentication Required)

#### Get Subreddit Posts
```json
{
  "name": "get_subreddit_posts",
  "arguments": {
    "subreddit": "programming",
    "sort": "hot"
  }
}
```

#### Search Reddit
```json
{
  "name": "search_reddit",
  "arguments": {
    "query": "python tutorial",
    "subreddit": "learnprogramming"
  }
}
```

#### Get User Profile
```json
{
  "name": "get_user_profile",
  "arguments": {
    "username": "spez"
  }
}
```

#### Get Subreddit Info
```json
{
  "name": "get_subreddit_info",
  "arguments": {
    "subreddit": "programming"
  }
}
```

#### Get Post Comments
```json
{
  "name": "get_post_comments",
  "arguments": {
    "post_id": "1n1nlse",
    "sort": "best"
  }
}
```

#### Get Trending Subreddits
```json
{
  "name": "get_trending_subreddits",
  "arguments": {}
}
```

#### Get Cross Posts
```json
{
  "name": "get_cross_posts",
  "arguments": {
    "post_id": "1n1nlse"
  }
}
```

### 🔧 Tool Features
- **Smart Defaults**: Intelligent parameter defaults for better UX
- **Type Safety**: Full TypeScript validation with Zod schemas
- **Error Handling**: Comprehensive error messages with troubleshooting tips
- **Rate Limiting**: Built-in protection against API rate limits
- **Inline Documentation**: Detailed descriptions with examples for each tool

## 🚀 Getting Started Workflow

### Step 1: Setup and Build
```bash
npm install
npm run build
```

### Step 2: Start MCP Inspector
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

### Step 3: Open Browser
Navigate to http://localhost:6274

### Step 4: Test All Tools
All tools work immediately without any setup:

1. **`get_trending_subreddits`** - See what's popular on Reddit
2. **`get_subreddit_info`** - Get details about any subreddit
3. **`get_subreddit_posts`** - Browse posts from any subreddit
4. **`search_reddit`** - Search for content across Reddit
5. **`get_user_profile`** - Get information about any Reddit user
6. **`get_post_comments`** - Read comments on any post
7. **`get_cross_posts`** - Find crossposts of any post

## 📊 Rate Limiting

### Rate Limits
- **Public API**: 60 requests per minute (Reddit default)
- **Built-in Protection**: Server includes rate limiting to prevent API abuse
- **Header Monitoring**: Automatically reads `X-Ratelimit-Remaining` and `X-Ratelimit-Reset` headers
- **Smart Warnings**: Logs warnings when approaching rate limits
- **Graceful Handling**: Returns helpful error messages when rate limits are exceeded

## 🚨 Troubleshooting

### Common Issues

1. **403 Forbidden**
   - Check User-Agent string format in `.env` file
   - Ensure User-Agent follows Reddit's guidelines
   - Verify app is not suspended on Reddit

2. **Rate Limit Exceeded**
   - Server automatically monitors rate limits
   - Check console for rate limit warnings
   - Wait for the reset time shown in error messages
   - Consider implementing request queuing for high-volume usage

3. **404 Not Found**
   - Verify subreddit name is correct (without r/ prefix)
   - Check if post ID is valid
   - Ensure username exists on Reddit

### Debug Steps

1. **Test with MCP Inspector**:
   ```bash
   npx @modelcontextprotocol/inspector node dist/index.js
   ```

2. **Verify Environment** (optional):
   ```bash
   cat .env
   ```

3. **Test All Tools**:
   - Start with `get_trending_subreddits` to verify basic connectivity
   - Try `get_subreddit_posts` with popular subreddits like "programming"
   - Use `search_reddit` to test search functionality

## 🏗️ Technical Improvements

### Code Quality Enhancements
- **Type Safety**: All tools now use `z.infer<typeof Schema>` for compile-time type checking
- **Consistent Patterns**: Unified `createToolHandler` wrapper eliminates boilerplate try-catch blocks
- **Magic Number Constants**: Replaced hardcoded values with named constants for better maintainability
- **Error Handling**: Dynamic error messages with context-specific troubleshooting tips

### Architecture Improvements
- **Rate Limit Intelligence**: Real-time monitoring of Reddit API rate limit headers
- **Smart Defaults**: Intelligent parameter defaults based on tool context
- **Clean Code**: Consistent patterns and reduced boilerplate

### Developer Experience
- **Inline Documentation**: Comprehensive tool descriptions with examples and usage patterns
- **TypeScript Strict Mode**: Full type safety with strict TypeScript configuration
- **Consistent Error Responses**: Standardized error format across all tools
- **Build Validation**: Automated TypeScript compilation with error checking

## 📁 Project Structure

```
mcp-reddit/
├── src/
│   ├── services/
│   │   └── reddit-api.ts      # Reddit API service
│   ├── types/
│   │   └── index.ts           # TypeScript types and Zod schemas
│   └── index.ts               # Main MCP server with 7 read-only tools
├── test-data.json            # Comprehensive test data for all tools
├── MCP_TEST_DATA.md          # Detailed testing guide
├── QUICK_START.md            # Quick start guide
├── .env                       # Optional environment variables
├── env.example               # Environment template
└── README.md                 # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Reddit API Documentation](https://www.reddit.com/dev/api)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Reddit App Preferences](https://www.reddit.com/prefs/apps)
- [Reddit App Preferences](https://www.reddit.com/prefs/apps)