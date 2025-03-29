// Debug utilities - import this in your main.js

const DEBUG_MODE = new URLSearchParams(window.location.search).has('debug');

export function debugLog(message, type = 'log') {
  if (!DEBUG_MODE) return;
  
  const timestamp = new Date().toISOString();
  console[type](`[${timestamp}] ${message}`);
}

export function wrapWithDebug(fn, name = 'anonymous') {
  return function(...args) {
    try {
      debugLog(`Executing ${name}`, 'debug');
      const result = fn.apply(this, args);
      debugLog(`${name} completed`, 'debug');
      return result;
    } catch (error) {
      debugLog(`${name} failed: ${error.message}`, 'error');
      throw error;
    }
  };
}

export function measurePerformance(fn, name = 'anonymous') {
  return function(...args) {
    const start = performance.now();
    try {
      const result = fn.apply(this, args);
      const duration = performance.now() - start;
      debugLog(`${name} took ${duration.toFixed(2)}ms`, 'info');
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      debugLog(`${name} failed after ${duration.toFixed(2)}ms: ${error.message}`, 'error');
      throw error;
    }
  };
}