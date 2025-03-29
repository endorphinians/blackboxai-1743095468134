// Debug configuration
const DEBUG_MODE = new URLSearchParams(window.location.search).has('debug');
let debugLogs = [];

function debugLog(message, type = 'log') {
  if (!DEBUG_MODE) return;
  
  const timestamp = new Date().toISOString();
  const logEntry = {timestamp, message, type};
  debugLogs.push(logEntry);
  
  console[type](`[${timestamp}] ${message}`);
  updateDebugPanel();
}

// Initialize animations and interactions
document.addEventListener('DOMContentLoaded', () => {
  debugLog('DOM fully loaded and parsed', 'info');
  
  try {
    // Activate tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    debugLog(`Found ${tooltipElements.length} tooltip elements`, 'info');
    
    tooltipElements.forEach(el => {
      el.addEventListener('mouseenter', showTooltip);
      el.addEventListener('mouseleave', hideTooltip);
    });

    // Enhanced card animations
    const cards = document.querySelectorAll('.card');
    debugLog(`Found ${cards.length} card elements`, 'info');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        debugLog(`Card hover started: ${card.id || card.className}`, 'debug');
        card.style.transform = 'translateY(-10px) rotateX(5deg) scale(1.05)';
        card.style.boxShadow = '0 25px 40px rgba(0,0,0,0.2)';
      });
      card.addEventListener('mouseleave', () => {
        debugLog(`Card hover ended: ${card.id || card.className}`, 'debug');
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });

    // Parallax effect
    window.addEventListener('scroll', () => {
      const startTime = performance.now();
      const parallax = document.querySelector('.parallax-section');
      
      if (parallax) {
        const scrollPosition = window.pageYOffset;
        parallax.style.backgroundPositionY = `${scrollPosition * 0.7}px`;
        debugLog(`Parallax updated (scrollY: ${scrollPosition}px)`, 'debug');
      }
      
      const duration = performance.now() - startTime;
      if (duration > 16) {
        debugLog(`Parallax scroll handler took ${duration.toFixed(2)}ms (may cause jank)`, 'warn');
      }
    });
    
  } catch (error) {
    debugLog(`Initialization error: ${error.message}`, 'error');
    console.error(error);
  }
});

function showTooltip(e) {
  try {
    if (!this.dataset.tooltip) {
      debugLog('Tooltip element has no data-tooltip attribute', 'warn');
      return;
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = this.dataset.tooltip;
    tooltip.setAttribute('role', 'tooltip');
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    
    // Position calculation with boundary checks
    let leftPos = rect.left + rect.width/2 - tooltipWidth/2;
    let topPos = rect.top - tooltipHeight - 10;
    
    // Ensure tooltip stays within viewport
    leftPos = Math.max(10, Math.min(leftPos, window.innerWidth - tooltipWidth - 10));
    topPos = Math.max(10, topPos);
    
    tooltip.style.left = `${leftPos}px`;
    tooltip.style.top = `${topPos}px`;
    
    debugLog(`Tooltip shown: "${this.dataset.tooltip}" at (${leftPos},${topPos})`, 'debug');
    
  } catch (error) {
    debugLog(`Tooltip error: ${error.message}`, 'error');
    console.error(error);
  }
}

function hideTooltip() {
  try {
    const tooltip = document.querySelector('.custom-tooltip');
    if (tooltip) {
      tooltip.remove();
      debugLog('Tooltip hidden', 'debug');
    }
  } catch (error) {
    debugLog(`Tooltip removal error: ${error.message}`, 'error');
    console.error(error);
  }
}

// Debug panel functions
function createDebugPanel() {
  if (!DEBUG_MODE) return;
  
  const panel = document.createElement('div');
  panel.id = 'debug-panel';
  panel.style.position = 'fixed';
  panel.style.bottom = '0';
  panel.style.right = '0';
  panel.style.width = '300px';
  panel.style.height = '200px';
  panel.style.overflow = 'auto';
  panel.style.backgroundColor = 'rgba(0,0,0,0.7)';
  panel.style.color = 'white';
  panel.style.padding = '10px';
  panel.style.zIndex = '9999';
  panel.style.fontFamily = 'monospace';
  panel.style.fontSize = '12px';
  
  document.body.appendChild(panel);
  debugLog('Debug panel initialized', 'info');
}

function updateDebugPanel() {
  if (!DEBUG_MODE) return;
  
  let panel = document.getElementById('debug-panel');
  if (!panel) {
    createDebugPanel();
    panel = document.getElementById('debug-panel');
  }
  
  // Show last 10 log entries
  const recentLogs = debugLogs.slice(-10);
  panel.innerHTML = recentLogs.map(log => 
    `<div style="color:${getLogColor(log.type)}">[${log.timestamp.split('T')[1]}] ${log.message}</div>`
  ).join('');
}

function getLogColor(type) {
  const colors = {
    error: '#ff6b6b',
    warn: '#feca57',
    info: '#48dbfb',
    debug: '#1dd1a1',
    log: '#ffffff'
  };
  return colors[type] || colors.log;
}

// Initialize debug panel when DOM is ready
if (DEBUG_MODE) {
  document.addEventListener('DOMContentLoaded', createDebugPanel);
}
