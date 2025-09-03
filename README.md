# MCP Reddit Server

A Model Context Protocol (MCP) server that provides access to Reddit's API through a standardized interface. This server supports both read-only operations and authenticated actions using OAuth2.

## 🚀 Features

- **13 Comprehensive Tools**: Covering both read-only and action-based operations
- **OAuth2 Support**: Full OAuth2 Authorization Code flow with redirect URI
- **Rate Limiting**: Built-in rate limiting to respect Reddit's API limits
- **Error Handling**: Robust error handling and logging
- **TypeScript**: Fully typed with strict TypeScript configuration
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
REDDIT_REDIRECT_URI=http://localhost:8080/callback
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

### Quick OAuth2 Test
Test the complete OAuth2 flow:
```bash
node oauth2-test.cjs
```

### Basic API Test
Test basic API connectivity:
```bash
node quick-oauth-test.cjs
```

### Detailed OAuth Test
Comprehensive OAuth testing:
```bash
node detailed-oauth-test.cjs
```

## 🎯 Available Tools

### 📖 Read-Only Tools (Public API)
1. **`get_subreddit_posts`** - Get posts from a subreddit
2. **`search_posts`** - Search for posts across Reddit
3. **`get_post_comments`** - Get comments for a specific post
4. **`get_user_info`** - Get user profile information
5. **`get_trending_subreddits`** - Get trending subreddits
6. **`get_subreddit_info`** - Get subreddit information
7. **`get_user_posts`** - Get posts by a specific user

### 🎯 Action Tools (OAuth Required)
8. **`submit_post`** - Submit a new post to a subreddit
9. **`submit_comment`** - Submit a comment on a post
10. **`vote`** - Vote on posts or comments
11. **`save_post`** - Save or unsave a post
12. **`send_message`** - Send a private message
13. **`subscribe_subreddit`** - Subscribe/unsubscribe to subreddits

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

## 📊 Rate Limiting & OAuth Scopes

### Rate Limits
- **OAuth Apps**: 60 requests per minute
- **Public API**: 30 requests per minute
- **Built-in Protection**: Server includes rate limiting to prevent API abuse

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
   - Check Client ID and Client Secret
   - Verify app type is "script"
   - Ensure OAuth scopes are set correctly

2. **Redirect URI Mismatch**
   - Redirect URI in `.env` must match Reddit app settings exactly
   - Default: `http://localhost:8080`

3. **403 Forbidden**
   - Check User-Agent string
   - Verify app is not suspended
   - Ensure proper OAuth scopes

4. **Rate Limit Exceeded**
   - Wait for rate limit reset
   - Implement proper rate limiting in your application

### Debug Steps

1. **Test Basic Connectivity**:
   ```bash
   node network-test.cjs
   ```

2. **Test OAuth Flow**:
   ```bash
   node oauth2-test.cjs
   ```

3. **Check Credentials**:
   ```bash
   node check-credentials.cjs
   ```

## 📁 Project Structure

```
mcp-reddit/
├── src/
│   ├── services/
│   │   ├── config.ts          # Configuration management
│   │   └── reddit-api.ts      # Reddit API service
│   ├── types/
│   │   └── index.ts           # TypeScript types and schemas
│   └── index.ts               # Main MCP server
├── tests/                     # Test scripts
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
