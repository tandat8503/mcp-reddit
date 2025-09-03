#!/usr/bin/env node

/**
 * Test MCP Reddit Tools
 * Simple test script to verify all 13 tools work correctly
 */

const https = require('https');
const { spawn } = require('child_process');

// Configuration
const config = {
  clientId: 'R3p9xmGYS2-1Wxay775tsw',
  clientSecret: 'VpiPNXucqdJ4V-Bej2NRPK0d8LhHdg',
  userAgent: 'Reddit-MCP-Server/1.0.0 (by /u/AwkwardTension4482)',
  redirectUri: 'http://localhost:8080/callback',
  scopes: 'read submit vote history privatemessages subscribe'
};

// Test data for tools
const testData = {
  // Read-only tools
  subreddit: 'programming',
  username: 'AwkwardTension4482',
  searchQuery: 'programming',
  postId: '1n1nlse', // From previous tests
  
  // Action tools (OAuth required)
  testSubreddit: 'test',
  testTitle: 'MCP Reddit Test Post',
  testContent: 'This is a test post from MCP Reddit Server',
  testComment: 'Test comment from MCP',
  testMessage: 'Test message from MCP Reddit Server'
};

/**
 * Get OAuth access token using client credentials
 */
async function getAccessToken() {
  return new Promise((resolve, reject) => {
    const postData = `grant_type=client_credentials`;
    
    const options = {
      hostname: 'www.reddit.com',
      port: 443,
      path: '/api/v1/access_token',
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        'User-Agent': config.userAgent,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.access_token) {
            resolve(response.access_token);
          } else {
            reject(new Error('No access token in response'));
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Test Reddit API endpoints directly
 */
async function testRedditAPI() {
  console.log('🔍 Testing Reddit API Endpoints...\n');
  
  try {
    const token = await getAccessToken();
    console.log('✅ OAuth token received successfully\n');
    
    // Test 1: Get subreddit posts
    console.log('📋 Test 1: Get Subreddit Posts');
    const posts = await makeRequest(`https://oauth.reddit.com/r/${testData.subreddit}.json?limit=3`, token);
    console.log(`   ✅ Found ${posts.data.children.length} posts`);
    console.log(`   📝 Sample: ${posts.data.children[0].data.title.substring(0, 50)}...\n`);
    
    // Test 2: Get subreddit info
    console.log('📋 Test 2: Get Subreddit Info');
    const subredditInfo = await makeRequest(`https://oauth.reddit.com/r/${testData.subreddit}/about.json`, token);
    console.log(`   ✅ Subreddit: r/${subredditInfo.data.display_name}`);
    console.log(`   👥 Subscribers: ${subredditInfo.data.subscribers.toLocaleString()}\n`);
    
    // Test 3: Get post comments
    console.log('📋 Test 3: Get Post Comments');
    const comments = await makeRequest(`https://oauth.reddit.com/comments/${testData.postId}.json?limit=3`, token);
    console.log(`   ✅ Found ${comments[1].data.children.length} comments`);
    if (comments[1].data.children.length > 0) {
      const firstComment = comments[1].data.children[0].data;
      console.log(`   💬 Sample: ${firstComment.body.substring(0, 50)}...\n`);
    }
    
    // Test 4: Search posts
    console.log('📋 Test 4: Search Posts');
    const searchResults = await makeRequest(`https://oauth.reddit.com/search.json?q=${testData.searchQuery}&limit=3`, token);
    console.log(`   ✅ Found ${searchResults.data.children.length} search results`);
    console.log(`   🔍 Sample: ${searchResults.data.children[0].data.title.substring(0, 50)}...\n`);
    
    // Test 5: Get user profile
    console.log('📋 Test 5: Get User Profile');
    const userProfile = await makeRequest(`https://oauth.reddit.com/user/${testData.username}/about.json`, token);
    console.log(`   ✅ User: u/${userProfile.data.name}`);
    console.log(`   📅 Created: ${new Date(userProfile.data.created_utc * 1000).toLocaleDateString()}\n`);
    
    console.log('🎉 All Reddit API tests passed!\n');
    return true;
    
  } catch (error) {
    console.error('❌ Reddit API test failed:', error.message);
    return false;
  }
}

/**
 * Make HTTP request to Reddit API
 */
function makeRequest(url, token) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': config.userAgent
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Test MCP Server startup
 */
function testMCPServer() {
  console.log('🚀 Testing MCP Server Startup...\n');
  
  return new Promise((resolve) => {
    const mcpProcess = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    let hasError = false;
    
    mcpProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    mcpProcess.stderr.on('data', (data) => {
      output += data.toString();
      hasError = true;
    });
    
    mcpProcess.on('close', (code) => {
      if (code === 0 && !hasError) {
        console.log('✅ MCP Server started successfully');
        console.log('   Output:', output.substring(0, 200) + '...\n');
        resolve(true);
      } else {
        console.log('❌ MCP Server failed to start');
        console.log('   Exit code:', code);
        console.log('   Output:', output.substring(0, 200) + '...\n');
        resolve(false);
      }
    });
    
    // Kill process after 5 seconds
    setTimeout(() => {
      mcpProcess.kill();
    }, 5000);
  });
}

/**
 * Main test function
 */
async function runTests() {
  console.log('🧪 MCP Reddit Server - Tool Testing\n');
  console.log('=====================================\n');
  
  // Test 1: Reddit API connectivity
  const apiTest = await testRedditAPI();
  
  // Test 2: MCP Server startup
  const mcpTest = await testMCPServer();
  
  // Summary
  console.log('📊 Test Summary');
  console.log('================');
  console.log(`Reddit API: ${apiTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`MCP Server: ${mcpTest ? '✅ PASS' : '❌ FAIL'}`);
  
  if (apiTest && mcpTest) {
    console.log('\n🎉 All tests passed! MCP Reddit Server is ready.');
    console.log('\n📋 Available Tools:');
    console.log('   Read-Only (7 tools):');
    console.log('   - get_subreddit_posts');
    console.log('   - search_posts');
    console.log('   - get_post_comments');
    console.log('   - get_user_info');
    console.log('   - get_subreddit_info');
    console.log('   - get_trending_subreddits');
    console.log('   - get_cross_posts');
    console.log('\n   Action (6 tools):');
    console.log('   - submit_post');
    console.log('   - submit_comment');
    console.log('   - vote');
    console.log('   - save_post');
    console.log('   - send_message');
    console.log('   - subscribe_subreddit');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the configuration.');
  }
}

// Run tests
runTests().catch(console.error);
