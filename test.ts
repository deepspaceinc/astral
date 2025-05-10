// This file is bananas-- i was using Ava, but it didn't work.
// This needs to be reworked entirely


// Simple standalone test without using ava
import { checkOs } from './src/utils/terminal.js';
import * as os from 'node:os';

// Basic testing function
function assertEqual(actual: any, expected: any, message: string) {
  if (actual === expected) {
    console.log(`✅ PASS: ${message}`);
    return true;
  } else {
    console.error(`❌ FAIL: ${message}`);
    console.error(`  Expected: ${expected}`);
    console.error(`  Actual: ${actual}`);
    return false;
  }
}

// Run tests
console.log('🧪 Running checkOs() test...');
const directOs = os.platform();
const funcOs = checkOs();

// Verify the function returns the correct OS
const test1 = assertEqual(funcOs, directOs, 'checkOs() should return the current platform');

// Verify the OS is a known value
const validPlatforms = ['darwin', 'linux', 'win32', 'aix', 'freebsd', 'openbsd', 'sunos'];
const test2 = assertEqual(
  validPlatforms.includes(funcOs), 
  true, 
  `Platform should be one of: ${validPlatforms.join(', ')}`
);

// Summary
console.log('\n--- Test Summary ---');
console.log(`Platform detected: ${funcOs}`);
if (test1 && test2) {
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  console.error('⚠️ Some tests failed');
  process.exit(1);
}