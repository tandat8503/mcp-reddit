#!/usr/bin/env node

/**
 * 🧪 Direct MCP Server Test
 * Test MCP server trực tiếp với các tool
 */

const { spawn } = require('child_process');

console.log('🧪 MCP Reddit Server - Direct Test\n');
console.log('==================================\n');

// Test data
const testCommands = [
  {
    name: 'get_subreddit_posts',
    params: {
      subreddit: 'programming',
      sort: 'hot'
    },
    description: 'Lấy posts từ r/programming'
  },
  {
    name: 'get_subreddit_info',
    params: {
      subreddit: 'programming'
    },
    description: 'Lấy thông tin r/programming'
  },
  {
    name: 'get_trending_subreddits',
    params: {},
    description: 'Lấy subreddits trending'
  }
];

/**
 * Test MCP server với một tool cụ thể
 */
function testMCPTool(toolName, params) {
  return new Promise((resolve) => {
    console.log(`🔍 Testing tool: ${toolName}`);
    console.log(`   Params: ${JSON.stringify(params)}`);
    
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
    
    // Gửi MCP request
    const mcpRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: params
      }
    };
    
    mcpProcess.stdin.write(JSON.stringify(mcpRequest) + '\n');
    mcpProcess.stdin.end();
    
    mcpProcess.on('close', (code) => {
      if (code === 0 && !hasError) {
        console.log('   ✅ Tool executed successfully');
        console.log(`   📝 Output: ${output.substring(0, 200)}...\n`);
        resolve(true);
      } else {
        console.log('   ❌ Tool execution failed');
        console.log(`   📝 Output: ${output.substring(0, 200)}...\n`);
        resolve(false);
      }
    });
    
    // Timeout after 10 seconds
    setTimeout(() => {
      mcpProcess.kill();
      console.log('   ⏰ Test timeout\n');
      resolve(false);
    }, 10000);
  });
}

/**
 * Test MCP server startup
 */
function testMCPServerStartup() {
  return new Promise((resolve) => {
    console.log('🚀 Testing MCP Server Startup...');
    
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
        console.log('✅ MCP Server started successfully\n');
        resolve(true);
      } else {
        console.log('❌ MCP Server failed to start');
        console.log(`   Exit code: ${code}`);
        console.log(`   Output: ${output.substring(0, 200)}...\n`);
        resolve(false);
      }
    });
    
    // Kill process after 3 seconds
    setTimeout(() => {
      mcpProcess.kill();
    }, 3000);
  });
}

/**
 * Main test function
 */
async function runDirectTest() {
  try {
    // Test 1: MCP Server startup
    const startupTest = await testMCPServerStartup();
    
    if (!startupTest) {
      console.log('❌ MCP Server startup failed. Cannot continue testing.\n');
      return;
    }
    
    // Test 2: Individual tools
    console.log('🔧 Testing Individual Tools:\n');
    
    let successCount = 0;
    for (const test of testCommands) {
      const result = await testMCPTool(test.name, test.params);
      if (result) successCount++;
    }
    
    // Summary
    console.log('📊 Test Summary');
    console.log('================');
    console.log(`MCP Server Startup: ${startupTest ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Tools Tested: ${successCount}/${testCommands.length} passed`);
    
    if (startupTest && successCount > 0) {
      console.log('\n🎉 MCP Reddit Server is working!');
      console.log('\n📋 Available Tools:');
      console.log('   Read-Only (7 tools):');
      console.log('   - get_subreddit_posts');
      console.log('   - search_reddit');
      console.log('   - get_user_profile');
      console.log('   - get_subreddit_info');
      console.log('   - get_post_comments');
      console.log('   - get_trending_subreddits');
      console.log('   - get_cross_posts');
      console.log('\n   Action (6 tools):');
      console.log('   - submit_post');
      console.log('   - submit_comment');
      console.log('   - vote_post');
      console.log('   - save_post');
      console.log('   - send_message');
      console.log('   - subscribe_subreddit');
      
      console.log('\n🚀 Ready to use with MCP client!');
    } else {
      console.log('\n⚠️  Some tests failed. Please check:');
      console.log('• Project build status: npm run build');
      console.log('• Environment variables in .env file');
      console.log('• Reddit API credentials');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run direct test
runDirectTest();
