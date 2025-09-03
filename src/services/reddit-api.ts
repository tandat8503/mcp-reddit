import { config } from "./config.js";
import {
  RedditPost,
  RedditComment,
  RedditSubreddit,
  RedditUser,
  RedditSearchResult,
  ApiCallResult,
} from "../types/index.js";

/**
 * Reddit API Service
 * Handles all API calls to Reddit with proper error handling and rate limiting
 * Supports both Client Credentials and Authorization Code OAuth flows
 */
export class RedditAPIService {
  private clientId: string;
  private clientSecret: string;
  private userAgent: string;
  private timeout: number;
  private redirectUri: string;
  private oauthScopes: string[];
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private refreshToken: string | null = null;

  constructor() {
    this.clientId = config.redditClientId;
    this.clientSecret = config.redditClientSecret;
    this.userAgent = config.redditUserAgent;
    this.timeout = config.timeoutSeconds * 1000;
    this.redirectUri = config.redditRedirectUri;
    this.oauthScopes = config.redditOAuthScopes;
  }

  /**
   * Get OAuth authorization URL for user to authorize the app
   */
  public getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      state: state || 'mcp_reddit_auth',
      redirect_uri: this.redirectUri,
      duration: 'permanent',
      scope: this.oauthScopes.join(' ')
    });

    return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  public async exchangeCodeForToken(authorizationCode: string): Promise<boolean> {
    try {
      const response = await fetch("https://www.reddit.com/api/v1/access_token", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": this.userAgent,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: authorizationCode,
          redirect_uri: this.redirectUri
        }),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OAuth code exchange failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.refreshToken = data.refresh_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);

      // OAuth authorization successful
      // Token expires in: ${data.expires_in} seconds
      // Scopes granted: ${data.scope}

      return true;
    } catch (error) {
      // OAuth code exchange failed: ${error instanceof Error ? error.message : 'Unknown error'}
      return false;
    }
  }

  /**
   * Get OAuth access token for Reddit API
   * Tries Authorization Code flow first, falls back to Client Credentials
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Try to refresh token if available
    if (this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        return this.accessToken!;
      }
    }

    // Fall back to client credentials flow
    return this.getClientCredentialsToken();
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch("https://www.reddit.com/api/v1/access_token", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": this.userAgent,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken!
        }),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get access token using client credentials flow (fallback)
   */
  private async getClientCredentialsToken(): Promise<string> {
    try {
      const response = await fetch("https://www.reddit.com/api/v1/access_token", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": this.userAgent,
        },
        body: "grant_type=client_credentials",
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`OAuth failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);

              // Using Client Credentials flow (limited scope)
      return this.accessToken!;
    } catch (error) {
      throw new Error(`Failed to get access token: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Check if we have a valid OAuth token with proper scopes
   */
  public hasValidOAuthToken(): boolean {
    return this.accessToken !== null && Date.now() < this.tokenExpiry;
  }

  /**
   * Get current OAuth scopes
   */
  public getCurrentScopes(): string[] {
    return this.oauthScopes;
  }

  /**
   * Make a GET request to Reddit API
   */
  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, any> = {},
  ): Promise<ApiCallResult> {
    try {
      const accessToken = await this.getAccessToken();

      // Build URL with parameters
      const url = new URL(`https://oauth.reddit.com${endpoint}`);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });

      // Make the request
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "User-Agent": this.userAgent,
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Reddit API Error ${response.status}: ${errorText}`,
          endpoint,
          timestamp: Date.now(),
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
        endpoint,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        endpoint,
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get posts from a subreddit
   */
  async getSubredditPosts(
    subreddit: string,
    sort: "hot" | "new" | "top" | "rising" | "controversial" = "hot",
    limit: number = 25,
    time?: "hour" | "day" | "week" | "month" | "year" | "all",
  ): Promise<ApiCallResult> {
    const params: Record<string, any> = { limit };
    if (time && (sort === "top" || sort === "controversial")) {
      params.t = time;
    }

    return this.makeRequest<{ data: { children: Array<{ data: RedditPost }> } }>(
      `/r/${subreddit}/${sort}.json`,
      params,
    );
  }

  /**
   * Search Reddit posts and comments
   */
  async searchReddit(
    query: string,
    subreddit?: string,
    sort: "relevance" | "hot" | "top" | "new" | "comments" = "relevance",
    time: "hour" | "day" | "week" | "month" | "year" | "all" = "all",
    limit: number = 25,
  ): Promise<ApiCallResult> {
    const params: Record<string, any> = { q: query, sort, t: time, limit };
    if (subreddit) {
      params.restrict_sr = "on";
      params.subreddit = subreddit;
    }

    return this.makeRequest<{ data: { children: Array<{ data: RedditPost }> } }>(
      "/search.json",
      params,
    );
  }

  /**
   * Get user profile information
   */
  async getUserProfile(username: string): Promise<ApiCallResult> {
    return this.makeRequest<{ data: RedditUser }>(
      `/user/${username}/about.json`,
    );
  }

  /**
   * Get subreddit information
   */
  async getSubredditInfo(subreddit: string): Promise<ApiCallResult> {
    return this.makeRequest<{ data: RedditSubreddit }>(
      `/r/${subreddit}/about.json`,
    );
  }

  /**
   * Get comments for a specific post
   */
  async getPostComments(
    postId: string,
    limit: number = 25,
    sort: "best" | "top" | "new" | "controversial" | "old" | "qa" = "best",
  ): Promise<ApiCallResult> {
    const params: Record<string, any> = { limit, sort };

    return this.makeRequest<Array<{ data: { children: Array<{ data: RedditComment }> } }>>(
      `/comments/${postId}.json`,
      params,
    );
  }

  /**
   * Get trending subreddits
   */
  async getTrendingSubreddits(limit: number = 25): Promise<ApiCallResult> {
    return this.makeRequest<{ data: { children: Array<{ data: RedditSubreddit }> } }>(
      "/subreddits/popular.json",
      { limit },
    );
  }

  /**
   * Get crossposts for a specific post
   */
  async getCrossPosts(postId: string, limit: number = 25): Promise<ApiCallResult> {
    return this.makeRequest<{ data: { children: Array<{ data: RedditPost }> } }>(
      `/duplicates/${postId}.json`,
      { limit },
    );
  }

  // ========================================
  // 🎯 ACTION METHODS (OAuth Required)
  // ========================================

  /**
   * Submit a new post to a subreddit
   */
  async submitPost(
    subreddit: string,
    title: string,
    content: string,
    kind: "self" | "link" = "self",
    nsfw: boolean = false,
    spoiler: boolean = false
  ): Promise<ApiCallResult> {
    const params: Record<string, any> = {
      sr: subreddit,
      title,
      kind,
      nsfw: nsfw ? "on" : "off",
      spoiler: spoiler ? "on" : "off"
    };

    if (kind === "self") {
      params.text = content;
    } else {
      params.url = content;
    }

    return this.makePostRequest("/api/submit", params);
  }

  /**
   * Submit a comment on a post
   */
  async submitComment(
    postId: string,
    text: string,
    parentId?: string
  ): Promise<ApiCallResult> {
    const params: Record<string, any> = {
      thing_id: parentId || postId,
      text
    };

    return this.makePostRequest("/api/comment", params);
  }

  /**
   * Vote on a post or comment
   */
  async vote(
    postId: string,
    direction: "1" | "0" | "-1"
  ): Promise<ApiCallResult> {
    const params = {
      id: postId,
      dir: direction
    };

    return this.makePostRequest("/api/vote", params);
  }

  /**
   * Save or unsave a post
   */
  async savePost(
    postId: string,
    action: "save" | "unsave"
  ): Promise<ApiCallResult> {
    const params = {
      id: postId
    };

    const endpoint = action === "save" ? "/api/save" : "/api/unsave";
    return this.makePostRequest(endpoint, params);
  }

  /**
   * Send a private message
   */
  async sendMessage(
    to: string,
    subject: string,
    text: string
  ): Promise<ApiCallResult> {
    const params = {
      to,
      subject,
      text
    };

    return this.makePostRequest("/api/compose", params);
  }

  /**
   * Subscribe or unsubscribe from a subreddit
   */
  async subscribeSubreddit(
    subreddit: string,
    action: "sub" | "unsub"
  ): Promise<ApiCallResult> {
    const params = {
      sr: subreddit,
      action
    };

    return this.makePostRequest("/api/subscribe", params);
  }

  /**
   * Make a POST request to Reddit API
   */
  private async makePostRequest<T>(
    endpoint: string,
    params: Record<string, any> = {},
  ): Promise<ApiCallResult> {
    try {
      const accessToken = await this.getAccessToken();

      // Build URL
      const url = new URL(`https://oauth.reddit.com${endpoint}`);

      // Make the POST request
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": this.userAgent,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(params),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `Reddit API Error ${response.status}: ${errorText}`,
          endpoint,
          timestamp: Date.now(),
        };
      }

      const data = await response.json();

      return {
        success: true,
        data,
        endpoint,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        endpoint,
        timestamp: Date.now(),
      };
    }
  }
}

// Export singleton instance
export const redditAPI = new RedditAPIService();
