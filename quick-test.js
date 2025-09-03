#!/usr/bin/env node

/**
 * 🚀 Quick Test Script for MCP Reddit Server
 * Test các tool read-only nhanh chóng
 */

import { spawn } from 'child_process';
import fs from 'fs';

// Test data từ file JSON
const testData = JSON.parse(fs.readFileSync('./test-data.json', 'utf8'));

console.log('🧪 MCP Reddit Server - Quick Test\n');
console.log('==================================\n');

/**
 * Test MCP Server startup
 */
function testMCPServer() {
  return new Promise((resolve) => {
    console.log('🚀 Starting MCP Server...');
    
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
        console.log('   Exit code:', code);
        console.log('   Output:', output.substring(0, 200) + '...\n');
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
 * Test Reddit API connectivity
 */
async function testRedditAPI() {
  console.log('🔍 Testing Reddit API connectivity...');
  
  try {
    const https = await import('https');
    
    // Test basic Reddit API endpoint
    const response = await new Promise((resolve, reject) => {
      const req = https.get('https://www.reddit.com/r/programming.json?limit=1', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (error) {
            reject(error);
          }
        });
      });
      req.on('error', reject);
      req.setTimeout(10000, () => reject(new Error('Request timeout')));
    });
    
    if (response && response.data && response.data.children) {
      console.log('✅ Reddit API is accessible');
      console.log(`   📝 Found ${response.data.children.length} posts`);
      console.log(`   📋 Sample: ${response.data.children[0].data.title.substring(0, 50)}...\n`);
      return true;
    } else {
      console.log('❌ Reddit API response format unexpected\n');
      return false;
    }
    
  } catch (error) {
    console.log('❌ Reddit API test failed:', error.message, '\n');
    return false;
  }
}

/**
 * Display test data summary
 */
function displayTestData() {
  console.log('📋 Available Test Data:\n');
  
  console.log('🔍 Read-Only Tools (7 tools):');
  Object.entries(testData.readOnlyTools).forEach(([toolName, toolData]) => {
    console.log(`   • ${toolName}: ${toolData.description}`);
    console.log(`     Test cases: ${toolData.testCases.length}`);
  });
  
  console.log('\n🎯 Action Tools (6 tools):');
  Object.entries(testData.actionTools).forEach(([toolName, toolData]) => {
    console.log(`   • ${toolName}: ${toolData.description}`);
    console.log(`     OAuth required: ${toolData.requiresOAuth ? 'Yes' : 'No'}`);
    if (toolData.requiresOAuth) {
      console.log(`     Required scope: ${toolData.requiredScope}`);
    }
  });
  
  console.log('\n📊 Test Scenarios:');
  Object.entries(testData.testScenarios).forEach(([scenarioName, scenarioData]) => {
    console.log(`   • ${scenarioName}: ${scenarioData.description}`);
    console.log(`     Tools: ${scenarioData.tools ? scenarioData.tools.length : 'N/A'}`);
    console.log(`     Time: ${scenarioData.estimatedTime || 'N/A'}`);
  });
  
  console.log('\n');
}

/**
 * Generate MCP client test commands
 */
function generateTestCommands() {
  console.log('🛠️  MCP Client Test Commands:\n');
  
  console.log('1. Start MCP Server:');
  console.log('   npm run build && npm start\n');
  
  console.log('2. Connect MCP Client and test tools:\n');
  
  // Read-only tools
  console.log('   📖 Read-Only Tools:');
  Object.entries(testData.readOnlyTools).forEach(([toolName, toolData]) => {
    const testCase = toolData.testCases[0];
    console.log(`   • ${toolName}:`);
    console.log(`     Params: ${JSON.stringify(testCase.params, null, 6)}`);
  });
  
  console.log('\n   🎯 Action Tools (require OAuth):');
  Object.entries(testData.actionTools).forEach(([toolName, toolData]) => {
    const testCase = toolData.testCases[0];
    console.log(`   • ${toolName}:`);
    console.log(`     Params: ${JSON.stringify(testCase.params, null, 6)}`);
    console.log(`     Scope: ${toolData.requiredScope}`);
  });
  
  console.log('\n');
}

/**
 * Main test function
 */
async function runQuickTest() {
  try {
    // Display test data
    displayTestData();
    
    // Test Reddit API
    const apiTest = await testRedditAPI();
    
    // Test MCP Server
    const mcpTest = await testMCPServer();
    
    // Generate test commands
    generateTestCommands();
    
    // Summary
    console.log('📊 Quick Test Summary');
    console.log('=====================');
    console.log(`Reddit API: ${apiTest ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`MCP Server: ${mcpTest ? '✅ PASS' : '❌ FAIL'}`);
    
    if (apiTest && mcpTest) {
      console.log('\n🎉 Ready for testing!');
      console.log('\n📋 Next Steps:');
      console.log('1. Build the project: npm run build');
      console.log('2. Start MCP server: npm start');
      console.log('3. Connect your MCP client');
      console.log('4. Use test data from test-data.json');
      console.log('5. Test each tool with provided parameters');
    } else {
      console.log('\n⚠️  Some tests failed. Please check:');
      console.log('• Internet connection');
      console.log('• Reddit API accessibility');
      console.log('• Project build status');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run quick test
runQuickTest();
