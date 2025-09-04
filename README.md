# MCP Reddit Server

A Model Context Protocol (MCP) server that provides access to Reddit's API through a standardized interface. This server supports both read-only operations and authenticated actions using OAuth2.

## 🚀 Features

- **14 Comprehensive Tools**: 7 read-only + 6 action + 1 Smart OAuth setup tool
- **OAuth2 Support**: Full OAuth2 Authorization Code flow with redirect URI
- **Persistent Token Storage**: Tokens are automatically saved and restored across server restarts
- **Advanced Rate Limiting**: Built-in rate limiting with Reddit API header monitoring
- **Type-Safe Architecture**: Full TypeScript with Zod schema validation and z.infer types
- **Error Handling**: Robust error handling with dynamic troubleshooting tips
- **Clean Code Patterns**: Consistent tool handlers with reduced boilerplate
- **MCP Standard**: Compliant with Model Context Protocol specifications

## 🔐 OAuth2 Authentication

This server uses **OAuth2 Authorization Code flow** which is required by Reddit for authenticated operations. The flow works as follows:

1. **User Authorization**: User visits Reddit authorization URL
2. **Callback**: Reddit redirects to our callback URL with authorization code
3. **Token Exchange**: Server exchanges code for access token
4. **API Access**: Server uses access token for authenticated API calls

### Required Reddit App Configuration

Your Reddit app must be configured as:
- **App Type**: `script` (personal use script)
- **Redirect URI**: `http://localhost:8080` (must match exactly)
- **OAuth Scopes**: `read submit vote history privatemessages subscribe`

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

3. **Set up environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your Reddit API credentials
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

5. **Start the server**:
   ```bash
   npm start
   ```

## ⚙️ Configuration

Create a `.env` file with the following variables:

```env
# Reddit API Configuration
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USER_AGENT=Your-App-Name/1.0.0 (by /u/YourUsername)
REDDIT_REDIRECT_URI=http://localhost:8080
REDDIT_OAUTH_SCOPES=read submit vote history privatemessages subscribe
TIMEOUT_SECONDS=30
```

### Getting Reddit API Credentials

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Click "create application" or "create another app"
3. Fill in the form:
   - **Name**: Your app name
   - **App Type**: Select "script"
   - **Description**: Brief description
   - **About URL**: (optional)
   - **Redirect URI**: `http://localhost:8080`
4. Click "create app"
5. Copy the **Client ID** (under the app name) and **Client Secret**

## 🧪 Testing

### Using MCP Inspector
1. **Start MCP Inspector**:
   ```bash
   npx @modelcontextprotocol/inspector node dist/index.js
   ```

2. **Open browser**: http://localhost:6274

3. **Test tools**: Use the comprehensive test data in `test-data.json`

### Quick Start Testing
1. **Read-only tools** (no OAuth required):
   - `get_subreddit_posts`
   - `search_reddit`
   - `get_subreddit_info`
   - `get_trending_subreddits`

2. **OAuth setup**:
   - `setup_oauth_smart` → Check status, get URL, exchange code

3. **Action tools** (after OAuth):
   - `submit_post`
   - `submit_comment`
   - `vote_post`
   - `save_post`
   - `send_message`
   - `subscribe_subreddit`

## 🎯 Available Tools

### 📖 Read-Only Tools (7 tools - No OAuth Required)
1. **`get_subreddit_posts`** - Get posts from a subreddit with sorting options
2. **`search_reddit`** - Search for posts across Reddit or within specific subreddits
3. **`get_post_comments`** - Get comments for a specific post with sorting
4. **`get_user_posts`** - Get posts by a specific user
5. **`get_user_comments`** - Get comments by a specific user
6. **`get_trending_subreddits`** - Get trending and popular subreddits
7. **`get_subreddit_info`** - Get comprehensive subreddit information

### 🔐 Smart OAuth Setup Tool (1 tool)
8. **`setup_oauth_smart`** - Smart OAuth setup with multiple modes for AI agents

### ⚡ Action Tools (6 tools - OAuth Required)
9. **`submit_post`** - Create a new text or link post in a subreddit
10. **`submit_comment`** - Submit a comment on a post or reply to another comment
11. **`vote_post`** - Vote on posts or comments (upvote/downvote/neutral)
12. **`save_post`** - Save or unsave posts to your saved collection
13. **`send_message`** - Send private messages to other Reddit users
14. **`subscribe_subreddit`** - Subscribe or unsubscribe from subreddits

## 📖 Tool Usage Examples

### Read-Only Tools (No OAuth Required)

#### Get Subreddit Posts
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

#### Search Reddit
```json
{
  "name": "search_reddit",
  "arguments": {
    "query": "python tutorial",
    "subreddit": "learnprogramming",
    "sort": "relevance"
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

### Smart OAuth Setup (Required for Action Tools)

#### Check OAuth Status
```json
{
  "name": "setup_oauth_smart",
  "arguments": {}
}
```

#### Get Authorization URL
```json
{
  "name": "setup_oauth_smart",
  "arguments": {
    "mode": "url"
  }
}
```

#### Exchange Authorization Code
```json
{
  "name": "setup_oauth_smart",
  "arguments": {
    "mode": "exchange",
    "code": "AUTHORIZATION_CODE_FROM_REDDIT"
  }
}
```

### Action Tools (After OAuth Setup)

#### Submit Post
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

#### Vote on Post
```json
{
  "name": "vote_post",
  "arguments": {
    "post_id": "t3_1234567",
    "direction": "up"
  }
}
```

#### Subscribe to Subreddit
```json
{
  "name": "subscribe_subreddit",
  "arguments": {
    "subreddit": "programming",
    "action": "follow"
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

### Step 2: Configure Environment
```bash
cp env.example .env
# Edit .env with your Reddit API credentials
```

### Step 3: Start MCP Inspector
```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

### Step 4: Test Read-Only Tools
Start with tools that don't require OAuth:
- `get_trending_subreddits` - See what's popular
- `get_subreddit_info` - Get subreddit details
- `get_subreddit_posts` - Browse posts
- `search_reddit` - Search for content

### Step 5: Setup OAuth (For Action Tools)
1. Use `setup_oauth_smart` to check OAuth status
2. Use `setup_oauth_smart` with `mode: "url"` to get authorization URL
3. Visit URL in browser and authorize
4. Copy authorization code from redirect
5. Use `setup_oauth_smart` with `mode: "exchange"` to get access token

### Step 6: Test Action Tools
After OAuth setup, test authenticated actions:
- `submit_post` - Create posts
- `vote_post` - Vote on content
- `save_post` - Save interesting posts
- `subscribe_subreddit` - Follow subreddits
- `send_message` - Send private messages

## 🔄 OAuth2 Flow Details

### Authorization URL
The server generates an authorization URL that users visit to grant permissions:
```
https://www.reddit.com/api/v1/authorize?
  client_id=YOUR_CLIENT_ID&
  response_type=code&
  state=mcp_reddit_auth&
  redirect_uri=http://localhost:8080&
  duration=permanent&
  scope=read submit vote history privatemessages subscribe
```

### Callback Handling
The server starts a local HTTP server on port 8080 to receive the authorization callback from Reddit.

### Token Management
- **Access Token**: Used for API calls (expires in 1 hour)
- **Refresh Token**: Used to refresh access token (permanent)
- **Automatic Refresh**: Server automatically refreshes expired tokens
- **Persistent Storage**: Tokens are saved to `reddit_tokens.json` and restored on startup
- **Smart Recovery**: Server automatically loads valid tokens and handles expired ones gracefully

## 📊 Rate Limiting & OAuth Scopes

### Rate Limits
- **OAuth Apps**: 60 requests per minute
- **Public API**: 30 requests per minute
- **Built-in Protection**: Server includes rate limiting to prevent API abuse
- **Header Monitoring**: Automatically reads `X-Ratelimit-Remaining` and `X-Ratelimit-Reset` headers
- **Smart Warnings**: Logs warnings when approaching rate limits
- **Graceful Handling**: Returns helpful error messages when rate limits are exceeded

### OAuth Scopes
- **`read`**: Read posts, comments, subreddits
- **`submit`**: Submit posts and comments
- **`vote`**: Upvote/downvote posts and comments
- **`history`**: Save/unsave posts
- **`privatemessages`**: Send private messages
- **`subscribe`**: Subscribe/unsubscribe to subreddits

## 🚨 Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check Client ID and Client Secret in `.env` file
   - Verify app type is "script" in Reddit app settings
   - Ensure OAuth scopes are set correctly
   - Check if tokens in `reddit_tokens.json` are expired

2. **Redirect URI Mismatch**
   - Redirect URI in `.env` must match Reddit app settings exactly
   - Default: `http://localhost:8080` (not `/callback`)
   - Ensure no trailing slashes or extra paths

3. **403 Forbidden**
   - Check User-Agent string format
   - Verify app is not suspended on Reddit
   - Ensure proper OAuth scopes are granted
   - Try re-authenticating with OAuth flow

4. **Rate Limit Exceeded**
   - Server automatically monitors rate limits
   - Check console for rate limit warnings
   - Wait for the reset time shown in error messages
   - Consider implementing request queuing for high-volume usage

5. **Token Issues**
   - Delete `reddit_tokens.json` to force re-authentication
   - Check if tokens are being saved correctly
   - Verify OAuth flow completed successfully

### Debug Steps

1. **Test with MCP Inspector**:
   ```bash
   npx @modelcontextprotocol/inspector node dist/index.js
   ```

2. **Check Token File**:
   ```bash
   cat reddit_tokens.json
   ```

3. **Verify Environment**:
   ```bash
   cat .env
   ```

4. **Test Read-Only Tools First**:
   - Start with `get_subreddit_posts` or `get_trending_subreddits`
   - These don't require OAuth and will verify basic connectivity

## 🏗️ Technical Improvements

### Code Quality Enhancements
- **Type Safety**: All tools now use `z.infer<typeof Schema>` for compile-time type checking
- **Consistent Patterns**: Unified `createToolHandler` wrapper eliminates boilerplate try-catch blocks
- **Magic Number Constants**: Replaced hardcoded values with named constants for better maintainability
- **Error Handling**: Dynamic error messages with context-specific troubleshooting tips

### Architecture Improvements
- **Persistent Token Storage**: Automatic token persistence in `reddit_tokens.json`
- **Rate Limit Intelligence**: Real-time monitoring of Reddit API rate limit headers
- **Smart Defaults**: Intelligent parameter defaults based on tool context
- **Clean Separation**: Clear separation between read-only and action-based tools

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
│   │   └── reddit-api.ts      # Reddit API service with token persistence
│   ├── types/
│   │   └── index.ts           # TypeScript types and Zod schemas
│   └── index.ts               # Main MCP server with 15 tools
├── reddit_tokens.json         # Persistent token storage (auto-generated)
├── test-data.json            # Comprehensive test data for all tools
├── MCP_TEST_DATA.md          # Detailed testing guide
├── QUICK_START.md            # Quick start guide
├── .env                       # Environment variables
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