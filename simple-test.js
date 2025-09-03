#!/usr/bin/env node

/**
 * 🧪 Simple Test Script for MCP Reddit Server
 * Test cơ bản để verify MCP server hoạt động
 */

console.log('🧪 MCP Reddit Server - Simple Test\n');
console.log('==================================\n');

// Test data đơn giản
const testData = {
  // Read-only tools - có thể test ngay
  readOnlyTests: [
    {
      tool: 'get_subreddit_posts',
      params: { subreddit: 'programming', sort: 'hot' },
      description: 'Lấy posts từ r/programming'
    },
    {
      tool: 'get_subreddit_info', 
      params: { subreddit: 'programming' },
      description: 'Lấy thông tin r/programming'
    },
    {
      tool: 'get_trending_subreddits',
      params: {},
      description: 'Lấy subreddits trending'
    },
    {
      tool: 'search_reddit',
      params: { query: 'programming', subreddit: 'programming' },
      description: 'Tìm kiếm "programming" trong r/programming'
    }
  ],
  
  // Action tools - cần OAuth
  actionTests: [
    {
      tool: 'submit_post',
      params: { 
        subreddit: 'test', 
        title: 'MCP Test Post', 
        content: 'Test post from MCP Reddit Server' 
      },
      description: 'Đăng post test (cần OAuth)',
      requiresOAuth: true
    }
  ]
};

console.log('📋 Test Data Summary:\n');

console.log('🔍 Read-Only Tools (4 tests):');
testData.readOnlyTests.forEach((test, index) => {
  console.log(`   ${index + 1}. ${test.tool}`);
  console.log(`      Params: ${JSON.stringify(test.params)}`);
  console.log(`      Description: ${test.description}\n`);
});

console.log('🎯 Action Tools (1 test):');
testData.actionTests.forEach((test, index) => {
  console.log(`   ${index + 1}. ${test.tool}`);
  console.log(`      Params: ${JSON.stringify(test.params)}`);
  console.log(`      Description: ${test.description}`);
  console.log(`      OAuth Required: ${test.requiresOAuth ? 'Yes' : 'No'}\n`);
});

console.log('🚀 How to Test:\n');

console.log('1. Build the project:');
console.log('   npm run build\n');

console.log('2. Start MCP server:');
console.log('   npm start\n');

console.log('3. Connect MCP client and test tools:\n');

console.log('   📖 Read-Only Tools (test these first):');
testData.readOnlyTests.forEach((test, index) => {
  console.log(`   • ${test.tool}:`);
  console.log(`     ${JSON.stringify(test.params, null, 2)}`);
});

console.log('\n   🎯 Action Tools (require OAuth setup):');
testData.actionTests.forEach((test, index) => {
  console.log(`   • ${test.tool}:`);
  console.log(`     ${JSON.stringify(test.params, null, 2)}`);
});

console.log('\n📊 Expected Results:\n');

console.log('✅ Success Response:');
console.log('   {');
console.log('     "content": [');
console.log('       {');
console.log('         "type": "text",');
console.log('         "text": "✅ **Success message with formatted data**"');
console.log('       }');
console.log('     ]');
console.log('   }');

console.log('\n❌ Error Response:');
console.log('   {');
console.log('     "content": [');
console.log('       {');
console.log('         "type": "text",');
console.log('         "text": "❌ **Error message with details**"');
console.log('       }');
console.log('     ]');
console.log('   }');

console.log('\n🔧 Troubleshooting:\n');

console.log('• If MCP server won\'t start:');
console.log('  - Check if project is built: npm run build');
console.log('  - Verify .env file exists with Reddit credentials');
console.log('  - Check Node.js version >= 18.0.0');

console.log('\n• If tools return errors:');
console.log('  - Check Reddit API credentials in .env');
console.log('  - Verify internet connection');
console.log('  - Check Reddit API status');

console.log('\n• For OAuth action tools:');
console.log('  - Setup OAuth2 Authorization Code flow');
console.log('  - Get user authorization');
console.log('  - Exchange code for access token');

console.log('\n🎉 Ready to test! Use the commands above with your MCP client.\n');
