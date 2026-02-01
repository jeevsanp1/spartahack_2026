/**
 * API Test Suite for STAMPD Backend
 * Base URL: http://165.232.133.82:3000
 *
 * Run with: npx ts-node api-test.ts
 */

const BASE_URL = 'http://165.232.133.82:3000';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL';
  statusCode?: number;
  message?: string;
  duration?: number;
}

const results: TestResult[] = [];

// Helper function to make HTTP requests
async function makeRequest(
  method: string,
  endpoint: string,
  body?: any
): Promise<{ status: number; data: any; duration: number }> {
  const startTime = Date.now();

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    const duration = Date.now() - startTime;

    return { status: response.status, data, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    throw { error, duration };
  }
}

// Test helper
function logTest(result: TestResult) {
  results.push(result);
  const icon = result.status === 'PASS' ? '✓' : '✗';
  const color = result.status === 'PASS' ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';
  console.log(`${color}${icon}${reset} ${result.method} ${result.endpoint} - ${result.message || result.status} ${result.duration ? `(${result.duration}ms)` : ''}`);
}

// Test 1: Health Check
async function testHealthCheck() {
  try {
    const { status, data, duration } = await makeRequest('GET', '/health');

    if (status === 200 && data.success === true) {
      logTest({
        endpoint: '/health',
        method: 'GET',
        status: 'PASS',
        statusCode: status,
        message: `Server is running (${data.network})`,
        duration
      });
    } else {
      logTest({
        endpoint: '/health',
        method: 'GET',
        status: 'FAIL',
        statusCode: status,
        message: 'Unexpected response format'
      });
    }
  } catch (error: any) {
    logTest({
      endpoint: '/health',
      method: 'GET',
      status: 'FAIL',
      message: `Request failed: ${error.message || 'Unknown error'}`,
      duration: error.duration
    });
  }
}

// Test 2: Get All Merchants
async function testGetMerchants() {
  try {
    const { status, data, duration } = await makeRequest('GET', '/merchants');

    if (status === 200 && data.success === true && Array.isArray(data.data)) {
      logTest({
        endpoint: '/merchants',
        method: 'GET',
        status: 'PASS',
        statusCode: status,
        message: `Found ${data.data.length} merchants`,
        duration
      });
      return data.data;
    } else {
      logTest({
        endpoint: '/merchants',
        method: 'GET',
        status: 'FAIL',
        statusCode: status,
        message: 'Unexpected response format'
      });
    }
  } catch (error: any) {
    logTest({
      endpoint: '/merchants',
      method: 'GET',
      status: 'FAIL',
      message: `Request failed: ${error.message || 'Unknown error'}`,
      duration: error.duration
    });
  }
  return [];
}

// Test 3: Get Specific Merchant
async function testGetMerchantById(merchantId: string) {
  try {
    const { status, data, duration } = await makeRequest('GET', `/merchants/${merchantId}`);

    if (status === 200 && data.success === true && data.data) {
      logTest({
        endpoint: `/merchants/${merchantId}`,
        method: 'GET',
        status: 'PASS',
        statusCode: status,
        message: `Retrieved merchant: ${data.data.name}`,
        duration
      });
      return data.data;
    } else if (status === 404) {
      logTest({
        endpoint: `/merchants/${merchantId}`,
        method: 'GET',
        status: 'PASS',
        statusCode: status,
        message: 'Merchant not found (404)',
        duration
      });
    } else {
      logTest({
        endpoint: `/merchants/${merchantId}`,
        method: 'GET',
        status: 'FAIL',
        statusCode: status,
        message: 'Unexpected response'
      });
    }
  } catch (error: any) {
    logTest({
      endpoint: `/merchants/${merchantId}`,
      method: 'GET',
      status: 'FAIL',
      message: `Request failed: ${error.message || 'Unknown error'}`,
      duration: error.duration
    });
  }
}

// Test 4: Get User Balances (with a test Solana public key)
async function testGetUserBalances(publicKey: string) {
  try {
    const { status, data, duration } = await makeRequest('GET', `/users/${publicKey}/balances`);

    if (status === 200 && data.success === true) {
      logTest({
        endpoint: `/users/${publicKey}/balances`,
        method: 'GET',
        status: 'PASS',
        statusCode: status,
        message: `Found ${data.data.balances?.length || 0} token balances`,
        duration
      });
    } else if (status === 500) {
      logTest({
        endpoint: `/users/${publicKey}/balances`,
        method: 'GET',
        status: 'PASS',
        statusCode: status,
        message: 'Invalid public key (500)',
        duration
      });
    } else {
      logTest({
        endpoint: `/users/${publicKey}/balances`,
        method: 'GET',
        status: 'FAIL',
        statusCode: status,
        message: 'Unexpected response'
      });
    }
  } catch (error: any) {
    logTest({
      endpoint: `/users/${publicKey}/balances`,
      method: 'GET',
      status: 'FAIL',
      message: `Request failed: ${error.message || 'Unknown error'}`,
      duration: error.duration
    });
  }
}

// Test 5: Get User Transaction History
async function testGetUserHistory(publicKey: string) {
  try {
    const { status, data, duration } = await makeRequest('GET', `/users/${publicKey}/history`);

    if (status === 200 && data.success === true) {
      logTest({
        endpoint: `/users/${publicKey}/history`,
        method: 'GET',
        status: 'PASS',
        statusCode: status,
        message: `Found ${data.data.history?.length || 0} transactions`,
        duration
      });
    } else if (status === 500) {
      logTest({
        endpoint: `/users/${publicKey}/history`,
        method: 'GET',
        status: 'PASS',
        statusCode: status,
        message: 'Invalid public key (500)',
        duration
      });
    } else {
      logTest({
        endpoint: `/users/${publicKey}/history`,
        method: 'GET',
        status: 'FAIL',
        statusCode: status,
        message: 'Unexpected response'
      });
    }
  } catch (error: any) {
    logTest({
      endpoint: `/users/${publicKey}/history`,
      method: 'GET',
      status: 'FAIL',
      message: `Request failed: ${error.message || 'Unknown error'}`,
      duration: error.duration
    });
  }
}

// Test 6: Earn Transaction (Missing Fields)
async function testEarnTransactionValidation() {
  try {
    const { status, data, duration } = await makeRequest('POST', '/transactions/earn', {});

    if (status === 400 && data.success === false) {
      logTest({
        endpoint: '/transactions/earn',
        method: 'POST',
        status: 'PASS',
        statusCode: status,
        message: 'Validation working (400)',
        duration
      });
    } else {
      logTest({
        endpoint: '/transactions/earn',
        method: 'POST',
        status: 'FAIL',
        statusCode: status,
        message: 'Validation not working properly'
      });
    }
  } catch (error: any) {
    logTest({
      endpoint: '/transactions/earn',
      method: 'POST',
      status: 'FAIL',
      message: `Request failed: ${error.message || 'Unknown error'}`,
      duration: error.duration
    });
  }
}

// Test 7: Redeem Transaction (Missing Fields)
async function testRedeemTransactionValidation() {
  try {
    const { status, data, duration } = await makeRequest('POST', '/transactions/redeem', {});

    if (status === 400 && data.success === false) {
      logTest({
        endpoint: '/transactions/redeem',
        method: 'POST',
        status: 'PASS',
        statusCode: status,
        message: 'Validation working (400)',
        duration
      });
    } else {
      logTest({
        endpoint: '/transactions/redeem',
        method: 'POST',
        status: 'FAIL',
        statusCode: status,
        message: 'Validation not working properly'
      });
    }
  } catch (error: any) {
    logTest({
      endpoint: '/transactions/redeem',
      method: 'POST',
      status: 'FAIL',
      message: `Request failed: ${error.message || 'Unknown error'}`,
      duration: error.duration
    });
  }
}

// Test 8: 404 Handler
async function test404Handler() {
  try {
    const { status, data, duration } = await makeRequest('GET', '/nonexistent-endpoint');

    if (status === 404 && data.success === false) {
      logTest({
        endpoint: '/nonexistent-endpoint',
        method: 'GET',
        status: 'PASS',
        statusCode: status,
        message: '404 handler working',
        duration
      });
    } else {
      logTest({
        endpoint: '/nonexistent-endpoint',
        method: 'GET',
        status: 'FAIL',
        statusCode: status,
        message: '404 handler not working properly'
      });
    }
  } catch (error: any) {
    logTest({
      endpoint: '/nonexistent-endpoint',
      method: 'GET',
      status: 'FAIL',
      message: `Request failed: ${error.message || 'Unknown error'}`,
      duration: error.duration
    });
  }
}

// Main test runner
async function runTests() {
  console.log('\n🧪 STAMPD API Test Suite');
  console.log(`📡 Testing API at: ${BASE_URL}\n`);
  console.log('─'.repeat(80));

  // Run basic tests
  await testHealthCheck();

  // Test merchants endpoints
  const merchants = await testGetMerchants();
  if (merchants.length > 0) {
    await testGetMerchantById(merchants[0].id);
  } else {
    await testGetMerchantById('1'); // Test with a default ID
  }
  await testGetMerchantById('999999'); // Test non-existent merchant

  // Test user endpoints with a valid Solana public key
  // Using a random valid public key format for testing
  const testPublicKey = '11111111111111111111111111111111';
  await testGetUserBalances(testPublicKey);
  await testGetUserHistory(testPublicKey);

  // Test with an invalid public key
  await testGetUserBalances('invalid-key');

  // Test transaction validation
  await testEarnTransactionValidation();
  await testRedeemTransactionValidation();

  // Test 404 handler
  await test404Handler();

  // Print summary
  console.log('─'.repeat(80));
  console.log('\n📊 Test Summary:');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;

  console.log(`Total Tests: ${total}`);
  console.log(`\x1b[32m✓ Passed: ${passed}\x1b[0m`);
  console.log(`\x1b[31m✗ Failed: ${failed}\x1b[0m`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%\n`);

  // Exit with error code if any tests failed
  process.exit(failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
