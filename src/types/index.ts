import { z } from "zod";

// ========================================
// 🚀 REDDIT API INTERFACES
// ========================================

/**
 * Base interface for Reddit posts
 */
export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  upvote_ratio: number;
  num_comments: number;
  created_utc: number;
  url: string;
  selftext?: string;
  is_self: boolean;
  permalink: string;
  domain: string;
  thumbnail?: string;
  preview?: {
    images: Array<{
      source: {
        url: string;
        width: number;
        height: number;
      };
    }>;
  };
}

/**
 * Reddit comment interface
 */
export interface RedditComment {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: number;
  parent_id: string;
  permalink: string;
  replies?: RedditComment[];
}

/**
 * Reddit subreddit interface
 */
export interface RedditSubreddit {
  display_name: string;
  title: string;
  description: string;
  subscribers: number;
  active_user_count: number;
  created_utc: number;
  url: string;
  over18: boolean;
  public_description: string;
  banner_img?: string;
  icon_img?: string;
}

/**
 * Reddit user interface
 */
export interface RedditUser {
  name: string;
  created_utc: number;
  link_karma: number;
  comment_karma: number;
  is_gold: boolean;
  is_mod: boolean;
  has_verified_email: boolean;
  icon_img?: string;
}

/**
 * Reddit search result interface
 */
export interface RedditSearchResult {
  posts: RedditPost[];
  comments: RedditComment[];
  subreddits: RedditSubreddit[];
  users: RedditUser[];
}

// ========================================
// 🎯 SIMPLIFIED MCP TOOL SCHEMAS (TỐI ƯU HÓA)
// ========================================

// ✅ TỐI ƯU: Chỉ cần 2 trường thay vì 4
export const SimpleSubredditPostsSchema = z.object({
  subreddit: z.string().describe("Subreddit name (e.g., 'programming', 'AskReddit')"),
  sort: z.enum(["hot", "new", "top"]).default("hot").describe("Sort order (default: hot)")
});

// ✅ TỐI ƯU: Chỉ cần 2 trường thay vì 5  
export const SimpleSearchSchema = z.object({
  query: z.string().describe("Search query (e.g., 'machine learning', 'python tutorial')"),
  subreddit: z.string().optional().describe("Limit to specific subreddit (optional)")
});

// ✅ TỐI ƯU: Chỉ cần 1 trường thay vì 2
export const SimpleUserProfileSchema = z.object({
  username: z.string().describe("Reddit username to get profile information")
});

// ✅ TỐI ƯU: Chỉ cần 1 trường thay vì 1 (giữ nguyên)
export const SimpleSubredditInfoSchema = z.object({
  subreddit: z.string().describe("Subreddit name to get information about")
});

// ✅ TỐI ƯU: Chỉ cần 2 trường thay vì 3
export const SimplePostCommentsSchema = z.object({
  post_id: z.string().describe("Reddit post ID to get comments for"),
  sort: z.enum(["best", "top", "new"]).default("best").describe("Sort order (default: best)")
});

// ✅ TỐI ƯU: Không cần trường nào (giữ nguyên)
export const SimpleTrendingSubredditsSchema = z.object({});

// ✅ TỐI ƯU: Chỉ cần 1 trường thay vì 2
export const SimpleCrossPostSchema = z.object({
  post_id: z.string().describe("Reddit post ID to find crossposts for")
});

// ========================================
// 🎯 SIMPLIFIED ACTION TOOLS SCHEMAS (TỐI ƯU HÓA)
// ========================================

// ✅ TỐI ƯU: Chỉ cần 3 trường thay vì 6
export const SimpleSubmitPostSchema = z.object({
  subreddit: z.string().describe("Subreddit name to submit post to"),
  title: z.string().describe("Post title"),
  content: z.string().describe("Post content (text or URL)")
});

// ✅ TỐI ƯU: Chỉ cần 2 trường thay vì 3
export const SimpleSubmitCommentSchema = z.object({
  post_id: z.string().describe("Reddit post ID to comment on"),
  text: z.string().describe("Comment text content"),
  parent_id: z.string().optional().describe("Parent comment ID for replies (optional)")
});

// ✅ TỐI ƯU: Chỉ cần 2 trường thay vì 2 (giữ nguyên)
export const SimpleVoteSchema = z.object({
  post_id: z.string().describe("Reddit post/comment ID to vote on"),
  direction: z.enum(["up", "down", "remove"]).describe("Vote action: up, down, or remove")
});

// ✅ TỐI ƯU: Chỉ cần 2 trường thay vì 2 (giữ nguyên)
export const SimpleSavePostSchema = z.object({
  post_id: z.string().describe("Reddit post ID to save/unsave"),
  action: z.enum(["save", "unsave"]).describe("Action: save or unsave")
});

// ✅ TỐI ƯU: Chỉ cần 3 trường thay vì 3 (giữ nguyên)
export const SimpleMessageSchema = z.object({
  to: z.string().describe("Username to send message to"),
  subject: z.string().describe("Message subject"),
  text: z.string().describe("Message body text")
});

// ✅ TỐI ƯU: Chỉ cần 2 trường thay vì 2 (giữ nguyên)
export const SimpleSubscribeSchema = z.object({
  subreddit: z.string().describe("Subreddit name to subscribe/unsubscribe"),
  action: z.enum(["follow", "unfollow"]).describe("Action: follow or unfollow")
});

// ========================================
// 🔄 BACKWARD COMPATIBILITY SCHEMAS (Để hỗ trợ advanced users)
// ========================================

// Legacy schemas for advanced users who want more control
export const AdvancedSubredditPostsSchema = z.object({
  subreddit: z.string().describe("Subreddit name"),
  sort: z.enum(["hot", "new", "top", "rising", "controversial"]).default("hot"),
  limit: z.number().min(1).max(100).default(25),
  time: z.enum(["hour", "day", "week", "month", "year", "all"]).optional()
});

export const AdvancedSearchSchema = z.object({
  query: z.string().describe("Search query"),
  subreddit: z.string().optional(),
  sort: z.enum(["relevance", "hot", "top", "new", "comments"]).default("relevance"),
  time: z.enum(["hour", "day", "week", "month", "year", "all"]).default("all"),
  limit: z.number().min(1).max(100).default(25)
});

export const AdvancedSubmitPostSchema = z.object({
  subreddit: z.string().describe("Subreddit name"),
  title: z.string().describe("Post title"),
  content: z.string().describe("Post content"),
  kind: z.enum(["self", "link"]).optional(),
  nsfw: z.boolean().optional(),
  spoiler: z.boolean().optional()
});

// ========================================
// ⚙️ CONFIGURATION TYPES
// ========================================

export interface ServerConfig {
  redditClientId: string;
  redditClientSecret: string;
  redditUserAgent: string;
  timeoutSeconds: number;
}

export interface ApiCallResult {
  success: boolean;
  data?: any;
  error?: string;
  endpoint: string;
  timestamp: number;
}

// ========================================
// 📝 ENDPOINT CONFIGURATION
// ========================================

export interface EndpointConfig {
  path: string;
  method: "GET" | "POST";
  description: string;
  requiredParams: string[];
  optionalParams: string[];
  maxDataParams: Record<string, any>;
  responseType: string;
  dataVolume: "high" | "medium" | "low";
}

export const REDDIT_ENDPOINTS: Record<string, EndpointConfig> = {
  "r/{subreddit}/hot": {
    path: "/r/{subreddit}/hot.json",
    method: "GET",
    description: "Get hot posts from a subreddit",
    requiredParams: ["subreddit"],
    optionalParams: ["limit", "after", "before"],
    maxDataParams: { limit: 100 },
    responseType: "Listing<Post>",
    dataVolume: "medium"
  },
  "r/{subreddit}/new": {
    path: "/r/{subreddit}/new.json",
    method: "GET",
    description: "Get new posts from a subreddit",
    requiredParams: ["subreddit"],
    optionalParams: ["limit", "after", "before"],
    maxDataParams: { limit: 100 },
    responseType: "Listing<Post>",
    dataVolume: "medium"
  },
  "r/{subreddit}/top": {
    path: "/r/{subreddit}/top.json",
    method: "GET",
    description: "Get top posts from a subreddit",
    requiredParams: ["subreddit"],
    optionalParams: ["limit", "after", "before", "t"],
    maxDataParams: { limit: 100, t: "all" },
    responseType: "Listing<Post>",
    dataVolume: "medium"
  },
  "search": {
    path: "/search.json",
    method: "GET",
    description: "Search Reddit posts and comments",
    requiredParams: ["q"],
    optionalParams: ["subreddit", "sort", "t", "limit", "after", "before"],
    maxDataParams: { limit: 100, t: "all" },
    responseType: "Listing<Post>",
    dataVolume: "high"
  },
  "user/{username}/about": {
    path: "/user/{username}/about.json",
    method: "GET",
    description: "Get user profile information",
    requiredParams: ["username"],
    optionalParams: [],
    maxDataParams: {},
    responseType: "User",
    dataVolume: "low"
  },
  "r/{subreddit}/about": {
    path: "/r/{subreddit}/about.json",
    method: "GET",
    description: "Get subreddit information",
    requiredParams: ["subreddit"],
    optionalParams: [],
    maxDataParams: {},
    responseType: "Subreddit",
    dataVolume: "low"
  },
  "comments/{article}": {
    path: "/comments/{article}.json",
    method: "GET",
    description: "Get comments for a specific post",
    requiredParams: ["article"],
    optionalParams: ["limit", "sort", "depth"],
    maxDataParams: { limit: 100, depth: 8 },
    responseType: "Listing<Comment>",
    dataVolume: "medium"
  }
};
