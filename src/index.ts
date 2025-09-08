#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import { redditAPI } from './services/reddit-api.js';
import {
  SimpleSubredditPostsSchema,
  SimpleSearchSchema,
  SimpleUserProfileSchema,
  SimpleSubredditInfoSchema,
  SimplePostCommentsSchema,
  SimpleTrendingSubredditsSchema,
  SimpleCrossPostSchema,
  RedditPost,
  RedditComment,
  RedditSubreddit,
  RedditUser
} from './types/index.js';
import { z } from 'zod';

// ========================================
// 🛠️ SMART HELPER FUNCTIONS - Các hàm hỗ trợ format dữ liệu
// ========================================

/**
 * 🧠 SMART AUTO-DETECTION FUNCTIONS
 * Các hàm tự động detect và set default values thông minh
 */


/**
 * Get smart defaults for missing parameters
 * Tự động set default values thông minh cho các tham số thiếu
 */
function getSmartDefaults(params: any, toolType: string) {
  switch (toolType) {
    case 'subreddit_posts':
      return {
        sort: params.sort || 'hot',
        limit: 25, // Fixed reasonable default
        time: 'all' // Fixed reasonable default
      };
    case 'search':
      return {
        sort: 'relevance',
        time: 'all',
        limit: 25
      };
    case 'comments':
      return {
        sort: params.sort || 'best',
        limit: 25
      };
    case 'cross_posts':
      return {
        limit: 25
      };
    case 'trending':
      return {
        limit: 25
      };
    default:
      return {};
  }
}

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
function formatRedditPost(post: RedditPost): string {
  const title = post.title || 'No title';
  const author = post.author || 'Unknown';
  const subreddit = post.subreddit || 'Unknown';
  const score = post.score || 0;
  const comments = post.num_comments || 0;
  const upvoteRatio = post.upvote_ratio ? `${(post.upvote_ratio * 100).toFixed(1)}%` : 'N/A';
  
  // Format creation date
  const createdDate = post.created_utc ? new Date(post.created_utc * 1000).toLocaleDateString() : 'Unknown';
  
  // Format score with emoji
  const scoreEmoji = score > HIGH_SCORE_THRESHOLD ? '🔥' : score > MEDIUM_SCORE_THRESHOLD ? '👍' : score > 0 ? '⬆️' : '➡️';
  
  let result = `📝 **${title}**\n`;
  result += `👤 by u/${author} in r/${subreddit}\n`;
  result += `${scoreEmoji} Score: ${score.toLocaleString()} | 💬 Comments: ${comments.toLocaleString()} | ⬆️ Upvote Ratio: ${upvoteRatio}\n`;
  result += `📅 Created: ${createdDate}\n`;
  
  // Add post content preview if available
  if (post.selftext && post.selftext.length > 0) {
    const preview = post.selftext.length > 200 ? post.selftext.substring(0, 200) + '...' : post.selftext;
    result += `📄 Content: ${preview}\n`;
  }
  
  // Add URL if it's a link post
  if (!post.is_self && post.url) {
    result += `🔗 Link: ${post.url}\n`;
  }
  
  // Add permalink
  result += `🔗 Reddit: https://reddit.com${post.permalink}\n`;
  
  return result;
}

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
 * 💡 Lưu ý: Depth càng cao thì indent càng nhiều để dễ đọc
 */
function formatRedditComment(comment: RedditComment, depth: number = 0): string {
  const indent = '  '.repeat(depth);
  const author = comment.author || 'Unknown';
  const score = comment.score || 0;
  const body = comment.body || 'No content';
  const createdDate = comment.created_utc ? new Date(comment.created_utc * 1000).toLocaleDateString() : 'Unknown';
  
  // Format score with emoji
  const scoreEmoji = score > 100 ? '🔥' : score > 10 ? '👍' : score > 0 ? '⬆️' : '➡️';
  
  let result = `${indent}💬 **u/${author}** (${scoreEmoji} ${score.toLocaleString()}) - ${createdDate}\n`;
  result += `${indent}${body}\n`;
  
  // Add replies if available
  if (comment.replies && comment.replies.length > 0) {
    result += `${indent}📝 Replies:\n`;
    comment.replies.forEach(reply => {
      result += formatRedditComment(reply, depth + 1);
    });
  }
  
  return result;
}

/**
 * Format subreddit information for display
 * Hàm này format thông tin subreddit thành text dễ đọc
 * 
 * @param subreddit - Dữ liệu subreddit từ Reddit API (RedditSubreddit interface)
 * @returns String được format với thông tin chi tiết về subreddit
 * 
 * 📝 Cách sử dụng: Gọi khi cần hiển thị thông tin subreddit cho user
 * 🔍 Dữ liệu hiển thị: Tên, mô tả, số subscribers, ngày tạo, URL
 * 💡 Lưu ý: Số subscribers được format với comma separator để dễ đọc
 */
function formatSubredditInfo(subreddit: RedditSubreddit): string {
  const name = subreddit.display_name || 'Unknown';
  const title = subreddit.title || 'No title';
  const description = subreddit.description || 'No description';
  const subscribers = subreddit.subscribers || 0;
  const activeUsers = subreddit.active_user_count || 0;
  const createdDate = subreddit.created_utc ? new Date(subreddit.created_utc * 1000).toLocaleDateString() : 'Unknown';
  const over18 = subreddit.over18 || false;
  
  let result = `🏠 **r/${name}**\n`;
  result += `📝 ${title}\n`;
  result += `📄 Description: ${description}\n`;
  result += `👥 Subscribers: ${subscribers.toLocaleString()}\n`;
  result += `🟢 Active Users: ${activeUsers.toLocaleString()}\n`;
  result += `📅 Created: ${createdDate}\n`;
  result += `🔞 NSFW: ${over18 ? 'Yes' : 'No'}\n`;
  
  if (subreddit.public_description) {
    result += `📋 Public Description: ${subreddit.public_description}\n`;
  }
  
  result += `🔗 URL: https://reddit.com/r/${name}\n`;
  
  return result;
}

/**
 * Format user profile information for display
 * Hàm này format thông tin user profile thành text dễ đọc
 * 
 * @param user - Dữ liệu user từ Reddit API (RedditUser interface)
 * @returns String được format với thông tin chi tiết về user
 * 
 * 📝 Cách sử dụng: Gọi khi cần hiển thị thông tin user cho user
 * 🔍 Dữ liệu hiển thị: Username, karma, ngày tạo, gold status
 * 💡 Lưu ý: Karma được format với comma separator, ngày được convert từ timestamp
 */
function formatUserProfile(user: RedditUser): string {
  const name = user.name || 'Unknown';
  const linkKarma = user.link_karma || 0;
  const commentKarma = user.comment_karma || 0;
  const createdDate = user.created_utc ? new Date(user.created_utc * 1000).toLocaleDateString() : 'Unknown';
  const isGold = user.is_gold || false;
  const isMod = user.is_mod || false;
  const hasVerifiedEmail = user.has_verified_email || false;
  
  let result = `👤 **u/${name}**\n`;
  result += `📊 Link Karma: ${linkKarma.toLocaleString()}\n`;
  result += `💬 Comment Karma: ${commentKarma.toLocaleString()}\n`;
  result += `📅 Created: ${createdDate}\n`;
  result += `🥇 Gold: ${isGold ? 'Yes' : 'No'}\n`;
  result += `🛡️ Moderator: ${isMod ? 'Yes' : 'No'}\n`;
  result += `✅ Verified Email: ${hasVerifiedEmail ? 'Yes' : 'No'}\n`;
  result += `🔗 Profile: https://reddit.com/user/${name}\n`;
  
  return result;
}

/**
 * Create standardized error response - Tạo response lỗi chuẩn cho MCP
 * Hàm này tạo ra error response theo đúng format của MCP protocol
 * 
 * @param message - Thông báo lỗi chính (bắt buộc)
 * @param error - Chi tiết lỗi bổ sung (tùy chọn)
 * @returns Object response theo MCP protocol với content type text
 * 
 * 📝 Cách sử dụng: Gọi khi có lỗi xảy ra trong tool handler
 * 🔍 Format: Content array với type "text" và text chứa thông báo lỗi
 * 💡 Lưu ý: Luôn sử dụng hàm này để đảm bảo consistency trong error handling
 */
function createErrorResponse(message: string, error?: any): any {
  let errorText = `❌ **${message}**`;
  
  if (error) {
    errorText += `\n\n🔍 **Error Details:** ${error}`;
  }
  
  // Add troubleshooting tips based on error type
  if (message.includes('OAuth') || message.includes('authorization') || message.includes('401')) {
    errorText += `\n\n🔧 **Troubleshooting:**\n` +
      `• Check your Reddit API credentials in .env file\n` +
      `• Verify Client ID and Client Secret are correct\n` +
      `• Ensure your Reddit app is configured as 'script' type\n` +
      `• For action tools, setup OAuth2 Authorization Code flow first`;
  } else if (message.includes('403') || message.includes('Forbidden')) {
    errorText += `\n\n🔧 **Troubleshooting:**\n` +
      `• Check your User-Agent string in .env file\n` +
      `• Verify your Reddit app is not suspended\n` +
      `• Ensure proper OAuth scopes are configured\n` +
      `• Check if you have permission to access this resource`;
  } else if (message.includes('404') || message.includes('not found')) {
    errorText += `\n\n🔧 **Troubleshooting:**\n` +
      `• Verify the subreddit name is correct (without r/ prefix)\n` +
      `• Check if the post ID is valid\n` +
      `• Ensure the username exists on Reddit\n` +
      `• Try with a different subreddit or post ID`;
  } else if (message.includes('rate limit') || message.includes('429')) {
    errorText += `\n\n🔧 **Troubleshooting:**\n` +
      `• Wait a few minutes before trying again\n` +
      `• Reddit allows 60 requests/minute for OAuth apps\n` +
      `• Consider implementing request delays\n` +
      `• Check if you're making too many requests`;
  } else {
    errorText += `\n\n🔧 **Troubleshooting:**\n` +
      `• Check your internet connection\n` +
      `• Verify Reddit API is accessible\n` +
      `• Check the .env file configuration\n` +
      `• Try again in a few moments`;
  }
  
  return {
    content: [{
      type: "text",
      text: errorText
    }]
  };
}

/**
 * Create standardized success response - Tạo response thành công chuẩn cho MCP
 * Hàm này tạo ra success response theo đúng format của MCP protocol
 * 
 * @param text - Nội dung response thành công (bắt buộc)
 * @returns Object response theo MCP protocol với content type text
 * 
 * 📝 Cách sử dụng: Gọi khi tool thực hiện thành công
 * 🔍 Format: Content array với type "text" và text chứa thông tin thành công
 * 💡 Lưu ý: Luôn sử dụng hàm này để đảm bảo consistency trong success handling
 * 🎯 Đặc điểm: Text thường chứa thông tin được format đẹp với emoji và markdown
 */
function createSuccessResponse(text: string): any {
  return {
    content: [{
      type: "text",
      text: text
    }]
  };
}

/**
 * Validate API response and extract data - Validate response và extract data
 * Hàm này validate API response và extract data từ Reddit API
 * 
 * @param result - API call result từ RedditAPIService
 * @param expectedStructure - Tên structure mong đợi (posts, comments, etc.)
 * @returns Array of data items
 * 
 * 📝 Cách sử dụng: Thay thế duplicate validation logic trong tools
 * 🔍 Đặc điểm: Centralized validation với consistent error messages
 * 💡 Lợi ích: DRY principle, consistent error handling
 */
function validateApiResponse(result: any, expectedStructure: string): any[] {
  if (!result.success) {
    throw new Error(result.error || 'API call failed');
  }
  
  const data = result.data;
  if (!data || !data.data || !data.data.children) {
    throw new Error(`No ${expectedStructure} found`);
  }
  
  return data.data.children.map((child: any) => child.data);
}

/**
 * Format data list with limits - Format danh sách data với giới hạn hiển thị
 * Hàm này format danh sách data với preview limits và "more available" message
 * 
 * @param items - Array of items to format
 * @param formatter - Function để format từng item
 * @param limit - Số lượng items hiển thị
 * @param itemType - Tên loại item (posts, comments, etc.)
 * @returns Formatted string với preview và more message
 * 
 * 📝 Cách sử dụng: Thay thế duplicate formatting logic trong tools
 * 🔍 Đặc điểm: Consistent formatting với preview limits
 * 💡 Lợi ích: DRY principle, consistent UX
 */
function formatDataList<T>(
  items: T[],
  formatter: (item: T) => string,
  limit: number,
  itemType: string
): string {
  const displayItems = items.slice(0, limit);
  const formattedItems = displayItems.map(formatter).join('\n\n');
  const moreText = items.length > limit ? `\n\n... and more ${itemType} available` : '';
  
  return `${formattedItems}${moreText}`;
}

/**
 * Create tool handler wrapper - Tạo wrapper để giảm boilerplate code
 * Hàm này bọc logic handler và tự động xử lý try-catch
 * 
 * @param handler - Function xử lý logic chính của tool
 * @returns Wrapped handler với error handling tự động
 * 
 * 📝 Cách sử dụng: Thay thế try-catch blocks trong tool definitions
 * 🔍 Đặc điểm: Tự động log errors và tạo error response chuẩn
 * 💡 Lợi ích: Giảm code duplication và đảm bảo error handling consistency
 */
function createToolHandler<T>(handler: (params: T) => Promise<any>) {
  return async (params: T) => {
    try {
      return await handler(params);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Tool execution failed:`, error);
      return createErrorResponse("An unexpected error occurred in the tool", errorMessage);
    }
  };
}

// ========================================
// 📊 CONSTANTS - Magic Numbers
// ========================================

// Display limits for better UX
const POST_PREVIEW_LIMIT = 10;           // Number of posts to show in preview
const COMMENT_PREVIEW_LIMIT = 10;        // Number of comments to show in preview  
const SEARCH_RESULT_LIMIT = 8;           // Number of search results to show
const TRENDING_SUBREDDIT_LIMIT = 15;     // Number of trending subreddits to show
const USER_POST_LIMIT = 10;              // Number of user posts to show
const USER_COMMENT_LIMIT = 10;           // Number of user comments to show

// Score thresholds for formatting
const HIGH_SCORE_THRESHOLD = 1000;       // Posts with score > 1000 are considered "hot"
const MEDIUM_SCORE_THRESHOLD = 100;      // Posts with score > 100 are considered "popular"

// ========================================
// 🚀 MCP SERVER SETUP
// ========================================

const server = new McpServer({
  name: "reddit-mcp",
  version: "1.0.0"
});

// ========================================
// 🛠️ MCP TOOLS (Reddit API Endpoints) - Định nghĩa các tool cho MCP client
// ========================================
//
// 📋 Cấu trúc Tool Definition:
// - server.tool(name, description, schema, handler)
// - name: Tên tool để MCP client gọi
// - description: Mô tả chức năng của tool
// - schema: Zod schema để validate input parameters
// - handler: Function xử lý logic của tool
//
// 🔍 Error Handling:
// - Tất cả tool đều có try-catch
// - Sử dụng createErrorResponse() cho lỗi
// - Sử dụng createSuccessResponse() cho thành công
//
// 💡 Response Format:
// - Tất cả response đều theo MCP protocol standard
// - Content type: text với format đẹp và emoji
// - Error message rõ ràng và hữu ích

// Tool 1: Get Subreddit Posts - Lấy danh sách bài viết từ subreddit
// 🎯 Chức năng: Lấy posts từ một subreddit cụ thể với các option sort khác nhau
// 📝 Parameters: subreddit (tên subreddit), sort (hot/new/top/rising), limit (số lượng), time (thời gian)
// 🔍 Output: Danh sách posts được format đẹp với thông tin chi tiết
// 💡 Use case: Hiển thị trending posts, khám phá nội dung mới, theo dõi subreddit yêu thích
server.tool(
  "get_subreddit_posts",
  "📖 Get posts from a subreddit\n" +
  "🎯 What it does: Fetches posts from any Reddit subreddit with sorting options\n" +
  "📝 Required: subreddit name (e.g., 'programming', 'AskReddit', 'MachineLearning')\n" +
  "⚙️ Optional: sort ('hot', 'new', 'top')\n" +
  "💡 Examples:\n" +
  "   • Get hot posts: {\"subreddit\": \"programming\"}\n" +
  "   • Get new posts: {\"subreddit\": \"AskReddit\", \"sort\": \"new\"}\n" +
  "   • Get top posts: {\"subreddit\": \"MachineLearning\", \"sort\": \"top\"}\n" +
  "🔍 Output: Formatted list with title, author, score, comments, date, and Reddit link",
  SimpleSubredditPostsSchema.shape,
  createToolHandler(async (params: z.infer<typeof SimpleSubredditPostsSchema>) => {
      const { subreddit, sort } = params;
      
      // 🧠 Smart defaults for missing parameters
      const smartDefaults = getSmartDefaults(params, 'subreddit_posts');
      const finalParams = { ...smartDefaults, subreddit, sort: sort || smartDefaults.sort };
      
      const result = await redditAPI.getSubredditPosts(
        finalParams.subreddit, 
        finalParams.sort, 
        finalParams.limit, 
        finalParams.time as any
      );

    // ✅ DRY: Sử dụng validateApiResponse helper
    const posts = validateApiResponse(result, "posts");
      
      if (posts.length === 0) {
        return createSuccessResponse(`No posts found in r/${subreddit}`);
      }

      const summary = `📊 Found ${posts.length} posts from r/${subreddit} (sorted by ${sort})`;
      
    // ✅ DRY: Sử dụng formatDataList helper
    const postDetails = formatDataList(posts, formatRedditPost, POST_PREVIEW_LIMIT, "posts");

    const resultText = `${summary}\n\n${postDetails}`;
      return createSuccessResponse(resultText);
  })
);

// Tool 2: Search Reddit - Tìm kiếm posts và comments trên Reddit
// 🎯 Chức năng: Tìm kiếm nội dung trên Reddit với các filter và sort option
// 📝 Parameters: query (từ khóa), subreddit (giới hạn trong subreddit), sort (sắp xếp), time (thời gian), limit (số lượng)
// 🔍 Output: Kết quả tìm kiếm được format đẹp với thông tin chi tiết
// 💡 Use case: Tìm kiếm thông tin cụ thể, khám phá nội dung mới, research topics
// 🔍 Đặc biệt: Có thể tìm kiếm trong toàn bộ Reddit hoặc giới hạn trong một subreddit cụ thể
server.tool(
  "search_reddit",
  "🔍 Search Reddit posts and comments\n" +
  "🎯 What it does: Searches across Reddit or within a specific subreddit\n" +
  "📝 Required: query (search terms)\n" +
  "⚙️ Optional: subreddit (limit search to specific subreddit)\n" +
  "💡 Examples:\n" +
  "   • Global search: {\"query\": \"machine learning\"}\n" +
  "   • Subreddit search: {\"query\": \"python tutorial\", \"subreddit\": \"programming\"}\n" +
  "   • Tech search: {\"query\": \"TypeScript\", \"subreddit\": \"typescript\"}\n" +
  "🔍 Output: Formatted search results with title, author, subreddit, score, and link",
  SimpleSearchSchema.shape,
  createToolHandler(async (params: z.infer<typeof SimpleSearchSchema>) => {
      const { query, subreddit } = params;
      
      // 🧠 Smart defaults for missing parameters
      const smartDefaults = getSmartDefaults(params, 'search');
      const finalParams = { ...smartDefaults, query, subreddit };
      
      const result = await redditAPI.searchReddit(
        finalParams.query, 
        finalParams.subreddit, 
        finalParams.sort, 
        finalParams.time as any, 
        finalParams.limit
      );

    // ✅ DRY: Sử dụng validateApiResponse helper
    const posts = validateApiResponse(result, "search results");
      
      if (posts.length === 0) {
        const searchContext = subreddit ? ` in r/${subreddit}` : '';
        return createSuccessResponse(`No results found for "${query}"${searchContext}`);
      }

      const searchContext = subreddit ? ` in r/${subreddit}` : '';
      const summary = `🔍 Found ${posts.length} results for "${query}"${searchContext} (sorted by ${finalParams.sort})`;
      
    // ✅ DRY: Sử dụng formatDataList helper
    const postDetails = formatDataList(posts, formatRedditPost, SEARCH_RESULT_LIMIT, "results");

    const resultText = `${summary}\n\n${postDetails}`;
      return createSuccessResponse(resultText);
  })
);

// Tool 3: Get User Profile - Lấy thông tin chi tiết về user Reddit
// 🎯 Chức năng: Lấy profile của một user Reddit bao gồm karma, tuổi account, verification status
// 📝 Parameters: username (tên user cần tìm)
// 🔍 Output: Thông tin user được format đẹp với karma, ngày tạo, gold status, moderator status
// 💡 Use case: Kiểm tra profile user, xem karma và reputation, verify user identity
// 🔍 Đặc biệt: Có thể lấy thông tin của bất kỳ user nào trên Reddit (public data)
server.tool(
  "get_user_profile",
  "👤 Get Reddit user profile information\n" +
  "🎯 What it does: Fetches detailed profile info for any Reddit user\n" +
  "📝 Required: username (Reddit username without u/ prefix)\n" +
  "💡 Examples:\n" +
  "   • Get profile: {\"username\": \"spez\"}\n" +
  "   • Check user: {\"username\": \"AwkwardTension4482\"}\n" +
  "   • View profile: {\"username\": \"gallowboob\"}\n" +
  "🔍 Output: User info with karma, account age, gold status, moderator status, and profile link",
  SimpleUserProfileSchema.shape,
  createToolHandler(async (params: z.infer<typeof SimpleUserProfileSchema>) => {
      const { username } = params;
      
      const result = await redditAPI.getUserProfile(username);

      if (!result.success) {
        return createErrorResponse("Error getting user profile", result.error);
      }

      const data = result.data;
      if (!data || !data.data) {
        return createErrorResponse("User profile not found");
      }

      const user = data.data;
      const userInfo = formatUserProfile(user);
      
      return createSuccessResponse(userInfo);
  })
);

// Tool 4: Get Subreddit Information - Lấy thông tin chi tiết về subreddit
// 🎯 Chức năng: Lấy thông tin về một subreddit bao gồm mô tả, số subscribers, ngày tạo
// 📝 Parameters: subreddit (tên subreddit cần tìm)
// 🔍 Output: Thông tin subreddit được format đẹp với subscribers, mô tả, NSFW status, URL
// 💡 Use case: Khám phá subreddit mới, xem thống kê community, kiểm tra nội dung policy
// 🔍 Đặc biệt: Hiển thị số active users real-time và public description của subreddit
server.tool(
  "get_subreddit_info",
  "🏠 Get subreddit information\n" +
  "🎯 What it does: Fetches detailed info about any Reddit subreddit\n" +
  "📝 Required: subreddit name (without r/ prefix)\n" +
  "💡 Examples:\n" +
  "   • Get info: {\"subreddit\": \"programming\"}\n" +
  "   • Check subreddit: {\"subreddit\": \"AskReddit\"}\n" +
  "   • View details: {\"subreddit\": \"MachineLearning\"}\n" +
  "🔍 Output: Subreddit details with description, subscribers, active users, creation date, NSFW status, and URL",
  SimpleSubredditInfoSchema.shape,
  createToolHandler(async (params: z.infer<typeof SimpleSubredditInfoSchema>) => {
      const { subreddit } = params;
      
      const result = await redditAPI.getSubredditInfo(subreddit);

      if (!result.success) {
        return createErrorResponse("Error getting subreddit info", result.error);
      }

      const data = result.data;
      if (!data || !data.data) {
        return createErrorResponse("Subreddit not found");
      }

      const subredditInfo = data.data;
      const formattedInfo = formatSubredditInfo(subredditInfo);
      
      return createSuccessResponse(formattedInfo);
  })
);

// Tool 5: Get Post Comments - Lấy comments của một post Reddit
// 🎯 Chức năng: Lấy comments của một post cụ thể với các option sort khác nhau
// 📝 Parameters: post_id (ID của post), limit (số lượng comments), sort (sắp xếp comments)
// 🔍 Output: Comments được format đẹp với tree structure, indent cho replies, score và author
// 💡 Use case: Đọc comments của post, theo dõi discussion, xem replies và nested comments
// 🔍 Đặc biệt: Hỗ trợ nested replies với indent tăng dần theo độ sâu, hiển thị score và timestamp
server.tool(
  "get_post_comments",
  "💬 Get comments for a Reddit post\n" +
  "🎯 What it does: Fetches comments and replies for any Reddit post\n" +
  "📝 Required: post_id (Reddit post ID, found in post URLs)\n" +
  "⚙️ Optional: sort ('best', 'top', 'new')\n" +
  "💡 Examples:\n" +
  "   • Get comments: {\"post_id\": \"1n1nlse\"}\n" +
  "   • Best comments: {\"post_id\": \"1n1nlse\", \"sort\": \"best\"}\n" +
  "   • New comments: {\"post_id\": \"1n1nlse\", \"sort\": \"new\"}\n" +
  "🔍 Output: Formatted comment tree with author, score, timestamp, and nested replies",
  SimplePostCommentsSchema.shape,
  createToolHandler(async (params: z.infer<typeof SimplePostCommentsSchema>) => {
      const { post_id, sort } = params;
      
      // 🧠 Smart defaults for missing parameters
      const smartDefaults = getSmartDefaults(params, 'comments');
      const finalParams = { ...smartDefaults, post_id, sort: sort || smartDefaults.sort };
      
      const result = await redditAPI.getPostComments(post_id, finalParams.limit, finalParams.sort);

      if (!result.success) {
        return createErrorResponse("Error getting post comments", result.error);
      }

      const data = result.data;
      if (!data || !Array.isArray(data) || data.length === 0) {
        return createErrorResponse("No comments found for this post");
      }

      // The first element contains the post, the second contains comments
      const commentsData = data[1];
      if (!commentsData || !commentsData.data || !commentsData.data.children) {
        return createErrorResponse("No comments found for this post");
      }

      const comments = commentsData.data.children.map((child: any) => child.data);
      
      if (comments.length === 0) {
        return createSuccessResponse("No comments found for this post");
      }

      const summary = `💬 Found ${comments.length} comments for post ${post_id} (sorted by ${sort})`;
      
    // ✅ DRY: Sử dụng formatDataList helper
    const commentDetails = formatDataList(comments, formatRedditComment, COMMENT_PREVIEW_LIMIT, "comments");

    const resultText = `${summary}\n\n${commentDetails}`;
      return createSuccessResponse(resultText);
  })
);

// Tool 6: Get Trending Subreddits - Lấy danh sách subreddits phổ biến/trending
// 🎯 Chức năng: Lấy danh sách các subreddit đang trending hoặc phổ biến trên Reddit
// 📝 Parameters: limit (số lượng subreddits cần lấy)
// 🔍 Output: Danh sách subreddits trending được format đẹp với subscribers, mô tả, URL
// 💡 Use case: Khám phá subreddits mới, xem community nào đang hot, tìm nội dung thú vị
// 🔍 Đặc biệt: Hiển thị số subscribers real-time và public description của mỗi subreddit
server.tool(
  "get_trending_subreddits",
  "🔥 Get trending/popular subreddits\n" +
  "🎯 What it does: Fetches list of currently popular and trending subreddits\n" +
  "📝 Required: None (no parameters needed)\n" +
  "💡 Examples:\n" +
  "   • Get trending: {}\n" +
  "   • Simple call: {}\n" +
  "🔍 Output: List of trending subreddits with name, title, subscribers, description, and URL",
  SimpleTrendingSubredditsSchema.shape,
  createToolHandler(async (params: z.infer<typeof SimpleTrendingSubredditsSchema>) => {
      // 🧠 Smart defaults - no parameters needed
      const smartDefaults = getSmartDefaults(params, 'trending');
      const finalParams = { ...smartDefaults };
      
      const result = await redditAPI.getTrendingSubreddits(finalParams.limit || 25);

    // ✅ DRY: Sử dụng validateApiResponse helper
    const subreddits = validateApiResponse(result, "trending subreddits");
      
      if (subreddits.length === 0) {
        return createSuccessResponse("No trending subreddits found");
      }

      const summary = `🔥 Found ${subreddits.length} trending subreddits`;
      
    // ✅ DRY: Sử dụng formatDataList helper với custom formatter
    const subredditFormatter = (subreddit: any) => {
        const name = subreddit.display_name || 'Unknown';
        const title = subreddit.title || 'No title';
        const subscribers = subreddit.subscribers || 0;
        const description = subreddit.public_description || 'No description';
        
        let result = `🏠 **r/${name}** - ${title}\n`;
        result += `👥 ${subscribers.toLocaleString()} subscribers\n`;
        if (description.length > 100) {
          result += `📄 ${description.substring(0, 100)}...\n`;
        } else {
          result += `📄 ${description}\n`;
        }
        result += `🔗 https://reddit.com/r/${name}\n`;
        
        return result;
    };
    
    const subredditDetails = formatDataList(subreddits, subredditFormatter, TRENDING_SUBREDDIT_LIMIT, "subreddits");

    const resultText = `${summary}\n\n${subredditDetails}`;
    return createSuccessResponse(resultText);
  })
);

// Tool 7: Get Cross Posts - Tìm crossposts của một post Reddit
// 🎯 Chức năng: Tìm các crossposts (bài viết được share lại) của một post cụ thể
// 📝 Parameters: post_id (ID của post gốc), limit (số lượng crossposts cần lấy)
// 🔍 Output: Danh sách crossposts được format đẹp với thông tin chi tiết
// 💡 Use case: Theo dõi nội dung được share lại, xem post được post ở subreddits nào khác
// 🔍 Đặc biệt: Hiển thị thông tin đầy đủ của mỗi crosspost bao gồm subreddit đích và engagement
server.tool(
  "get_cross_posts",
  "🔄 Find crossposts of a Reddit post\n" +
  "🎯 What it does: Finds posts that were cross-posted from the original post\n" +
  "📝 Required: post_id (Reddit post ID to find crossposts for)\n" +
  "💡 Examples:\n" +
  "   • Find crossposts: {\"post_id\": \"1n1nlse\"}\n" +
  "   • Check shares: {\"post_id\": \"1abc123\"}\n" +
  "🔍 Output: List of crossposts with title, author, subreddit, score, and Reddit link",
  SimpleCrossPostSchema.shape,
  createToolHandler(async (params: z.infer<typeof SimpleCrossPostSchema>) => {
      const { post_id } = params;
      
      // 🧠 Smart defaults for missing parameters
      const smartDefaults = getSmartDefaults(params, 'cross_posts');
      const finalParams = { ...smartDefaults, post_id };
      
      const result = await redditAPI.getCrossPosts(post_id, finalParams.limit || 25);

    // ✅ DRY: Sử dụng validateApiResponse helper
    const crossPosts = validateApiResponse(result, "crossposts");
      
      if (crossPosts.length === 0) {
        return createSuccessResponse("No crossposts found for this post");
      }

      const summary = `🔄 Found ${crossPosts.length} crossposts for post ${post_id}`;
      
    // ✅ DRY: Sử dụng formatDataList helper
    const crossPostDetails = formatDataList(crossPosts, formatRedditPost, 8, "crossposts");

    const resultText = `${summary}\n\n${crossPostDetails}`;
      return createSuccessResponse(resultText);
  })
);

// ========================================
// 🎯 READ-ONLY TOOLS ONLY - Chỉ có các tool đọc dữ liệu
// ========================================
//
// 📋 Đặc điểm của Read-Only Tools:
// - Không cần OAuth authentication
// - Chỉ đọc dữ liệu từ Reddit API
// - Hoạt động ngay lập tức không cần setup
// - Rate limit: 60 requests/minute (Reddit default)
// - An toàn và dễ sử dụng
//
// 💡 Cách sử dụng: Có thể sử dụng ngay lập tức mà không cần cấu hình gì


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
// - Ideal cho local development và production deployment
//
// 💡 Error Handling:
// - Try-catch cho server startup
// - Process exit với code 1 nếu có lỗi
// - Graceful shutdown khi nhận SIGINT/SIGTERM

async function main() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } catch (error) {
    // Failed to start MCP server: ${error}
    process.exit(1);
  }
}

// Handle process termination - Xử lý tín hiệu kết thúc process
// 📋 Signal Handling:
// - SIGINT: Interrupt signal (Ctrl+C từ terminal)
// - SIGTERM: Termination signal (từ system hoặc process manager)
// - Graceful shutdown: Đóng server an toàn trước khi exit
//
// 🔧 Process Management:
// - Exit code 0: Thành công, shutdown bình thường
// - Exit code 1: Có lỗi, shutdown do error
// - Đảm bảo server được đóng đúng cách
process.on('SIGINT', () => {
  process.exit(0);
});

process.on('SIGTERM', () => {
  process.exit(0);
});

// Start the server - Khởi động MCP server
// 📋 Startup Flow:
// - Gọi main() function để khởi tạo server
// - Catch error nếu có vấn đề trong quá trình startup
// - Exit với code 1 nếu startup thất bại
// - Log error để debug (đã comment để tránh MCP protocol violation)
main().catch((error) => {
  // Failed to start server: ${error}
  process.exit(1);
});

