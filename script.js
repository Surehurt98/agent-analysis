// ===== DOM Elements =====
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initDirectoryTabs();
    initMarketTicker();
    initStatusTime();
    initHoverEffects();
});

// ===== Tab Switching =====
function initTabs() {
    const tabs = document.querySelectorAll('.tab-bar .tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Don't switch if clicking close button
            if (e.target.classList.contains('tab-close')) {
                e.stopPropagation();
                handleTabClose(tab);
                return;
            }

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });

    // Tab close functionality
    const closeButtons = document.querySelectorAll('.tab-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tab = btn.closest('.tab');
            handleTabClose(tab);
        });
    });
}

function handleTabClose(tab) {
    const isActive = tab.classList.contains('active');
    const tabs = document.querySelectorAll('.tab-bar .tab');
    const tabIndex = Array.from(tabs).indexOf(tab);

    tab.style.opacity = '0';
    tab.style.transform = 'translateY(-10px)';

    setTimeout(() => {
        tab.remove();

        // If closed tab was active, activate previous or next
        if (isActive) {
            const remainingTabs = document.querySelectorAll('.tab-bar .tab');
            if (remainingTabs.length > 0) {
                const newActiveIndex = Math.min(tabIndex, remainingTabs.length - 1);
                remainingTabs[newActiveIndex].classList.add('active');
            }
        }
    }, 200);
}

// ===== Directory Tabs =====
function initDirectoryTabs() {
    const dirTabs = document.querySelectorAll('.dir-tab');
    const agentItems = document.querySelectorAll('.agent-list-item');

    dirTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');

            // Update active state
            dirTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter items with a simple animation
            agentItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (category === 'all' || category === itemCategory) {
                    item.style.display = 'flex';
                    // Trigger a small reflow and animate
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(10px)';

                    requestAnimationFrame(() => {
                        item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ===== Market Ticker Animation =====
function initMarketTicker() {
    const tickerScroll = document.querySelector('.ticker-scroll');
    if (!tickerScroll) return;

    // Clone items for seamless scroll
    const items = tickerScroll.innerHTML;
    tickerScroll.innerHTML = items + items;

    // Random price updates
    setInterval(() => {
        updateMarketPrices();
    }, 3000);
}

function updateMarketPrices() {
    const marketItems = document.querySelectorAll('.market-item');

    marketItems.forEach(item => {
        const valueEl = item.querySelector('.market-value');
        const changeEl = item.querySelector('.market-change');
        const percentEl = item.querySelector('.market-percent');

        if (valueEl && valueEl.textContent !== '-') {
            // Simulate small price changes
            const currentValue = parseFloat(valueEl.textContent.replace(/,/g, ''));
            if (!isNaN(currentValue)) {
                const change = (Math.random() - 0.5) * currentValue * 0.001;
                const newValue = currentValue + change;

                // Update value
                if (newValue > 1000) {
                    valueEl.textContent = newValue.toFixed(2);
                } else {
                    valueEl.textContent = newValue.toFixed(4);
                }

                // Update color based on change
                const isUp = change > 0;
                valueEl.classList.toggle('up', isUp);
                valueEl.classList.toggle('down', !isUp);

                if (changeEl) {
                    changeEl.classList.toggle('up', isUp);
                    changeEl.classList.toggle('down', !isUp);
                }
                if (percentEl) {
                    percentEl.classList.toggle('up', isUp);
                    percentEl.classList.toggle('down', !isUp);
                }
            }
        }
    });
}

// ===== Status Time =====
function initStatusTime() {
    const timeEl = document.querySelector('.status-time');
    if (!timeEl) return;

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeEl.textContent = `${hours}:${minutes}:${seconds}`;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// ===== Hover Effects =====
function initHoverEffects() {
    // Card ripple effect
    const cards = document.querySelectorAll('.agent-card, .quick-link, .directory-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Button click feedback
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Create ripple
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Search Functionality =====
const searchInputs = document.querySelectorAll('.search-input, .dir-search-input');
searchInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.style.width = input.classList.contains('dir-search-input') ? '250px' : '180px';
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.style.width = input.classList.contains('dir-search-input') ? '200px' : '140px';
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            input.value = '';
            input.blur();
        }
    });
});

// ===== Navigation Scroll Effect =====
const primaryNav = document.querySelector('.primary-nav');
if (primaryNav) {
    let isScrolling = false;

    primaryNav.addEventListener('wheel', (e) => {
        e.preventDefault();
        primaryNav.scrollLeft += e.deltaY;
    });
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Ctrl+K for search
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const mainSearch = document.querySelector('.search-input');
        if (mainSearch) mainSearch.focus();
    }

    // Escape to close active elements
    if (e.key === 'Escape') {
        document.activeElement.blur();
    }
});

console.log('🚀 Wind Financial Terminal UI Loaded');

// ===== Auto-Create Agent Modal Logic =====
document.addEventListener('DOMContentLoaded', () => {
    initCreateAgentModal();
});

function initCreateAgentModal() {
    const modal = document.getElementById('createAgentModal');
    const btnOpen = document.getElementById('btnAutoCreate');
    const btnClose = document.querySelector('#createAgentModal .modal-close');

    // MCP Panel Elements
    const btnMcpEntry = document.getElementById('btnMcpEntry');
    const mcpPanel = document.getElementById('mcpPanel');
    const btnCloseMcpPanel = document.getElementById('btnCloseMcpPanel');
    const mcpStatusDot = document.getElementById('mcpStatusDot');
    const btnSubmitAgent = document.getElementById('btnSubmitAgent');
    const oauthModal = document.getElementById('oauthModal');

    if (!modal) return;

    // ===== Lightweight MCP State =====
    const mcpState = {
        thirdParty: {
            notion: { connected: false, accessToken: null, name: 'Notion' },
            youdao: { connected: false, accessToken: null, name: '有道云笔记' }
        },
        builtIn: {
            'file-handler': { enabled: true, name: '文件处理' },
            'windows-cmd': { enabled: true, name: 'Windows 命令' },
            'browser-ops': { enabled: false, name: '浏览器操作' }
        }
    };

    // Update MCP Status Dot
    function updateMcpStatusDot() {
        const hasConnectedThirdParty = Object.values(mcpState.thirdParty).some(s => s.connected);
        const hasEnabledBuiltIn = Object.values(mcpState.builtIn).some(t => t.enabled);
        const hasEnabledTools = hasConnectedThirdParty || hasEnabledBuiltIn;

        if (mcpStatusDot) {
            mcpStatusDot.classList.toggle('active', hasEnabledTools);
            mcpStatusDot.classList.toggle('inactive', !hasEnabledTools);
        }
    }

    // Initialize status dot
    updateMcpStatusDot();

    // ===== Third-Party OAuth Connect =====
    document.querySelectorAll('.connect-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const service = btn.dataset.service;
            handleOAuthConnect(service, btn);
        });
    });

    function handleOAuthConnect(service, btn) {
        const serviceInfo = mcpState.thirdParty[service];
        if (!serviceInfo) return;

        // If already connected, toggle disconnect
        if (serviceInfo.connected) {
            if (confirm(`确定要断开与 ${serviceInfo.name} 的连接吗？`)) {
                serviceInfo.connected = false;
                serviceInfo.accessToken = null;
                updateIntegrationUI(service, false);
                updateMcpStatusDot();
                showToast(`${serviceInfo.name} 已断开连接`, 'info');
            }
            return;
        }

        // Show OAuth loading modal
        const oauthServiceName = document.getElementById('oauthServiceName');
        if (oauthServiceName) {
            oauthServiceName.textContent = serviceInfo.name;
        }
        if (oauthModal) {
            oauthModal.classList.remove('hidden');
        }

        // Simulate OAuth redirect flow
        // In real implementation, this would open a popup or redirect to OAuth provider
        setTimeout(() => {
            // Simulate successful authorization callback
            if (oauthModal) {
                oauthModal.classList.add('hidden');
            }

            // Update state
            serviceInfo.connected = true;
            serviceInfo.accessToken = 'mock_token_' + Date.now();

            // Update UI
            updateIntegrationUI(service, true);
            updateMcpStatusDot();

            showToast(`${serviceInfo.name} 连接成功！`, 'success');
        }, 2500);
    }

    function updateIntegrationUI(service, connected) {
        const item = document.querySelector(`.mcp-integration-item[data-service="${service}"]`);
        if (!item) return;

        const btn = item.querySelector('.connect-btn');
        const connectText = btn.querySelector('.connect-text');
        const connectArrow = btn.querySelector('.connect-arrow');

        if (connected) {
            item.classList.add('connected');
            btn.classList.add('connected');
            connectText.textContent = '已连接';
            if (connectArrow) connectArrow.style.display = 'none';
        } else {
            item.classList.remove('connected');
            btn.classList.remove('connected');
            connectText.textContent = '去连接';
            if (connectArrow) connectArrow.style.display = '';
        }
    }

    // ===== Built-in Tool Toggles =====
    document.querySelectorAll('.mcp-builtin-item input[type="checkbox"]').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const tool = e.target.dataset.tool;
            const enabled = e.target.checked;

            if (mcpState.builtIn[tool]) {
                mcpState.builtIn[tool].enabled = enabled;
            }

            const item = e.target.closest('.mcp-builtin-item');
            if (item) {
                item.classList.toggle('enabled', enabled);
            }

            updateMcpStatusDot();
        });
    });

    // ===== Toast Notification =====
    function showToast(message, type = 'info') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ===== Modal Controls =====

    // Open Modal
    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('show'), 10);
        });
    }

    // Close Modal
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => modal.classList.add('hidden'), 300);
        if (mcpPanel) mcpPanel.classList.add('hidden');
        if (oauthModal) oauthModal.classList.add('hidden');
    }

    if (btnClose) btnClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // ===== MCP Panel Toggle =====
    if (btnMcpEntry) {
        btnMcpEntry.addEventListener('click', () => {
            mcpPanel.classList.toggle('hidden');
        });
    }

    if (btnCloseMcpPanel) {
        btnCloseMcpPanel.addEventListener('click', () => {
            mcpPanel.classList.add('hidden');
        });
    }

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (mcpPanel && !mcpPanel.classList.contains('hidden')) {
            if (!mcpPanel.contains(e.target) && !btnMcpEntry.contains(e.target)) {
                mcpPanel.classList.add('hidden');
            }
        }
    });

    // ===== Submit Agent =====
    function getEnabledToolsSummary() {
        const connectedServices = Object.entries(mcpState.thirdParty)
            .filter(([_, s]) => s.connected)
            .map(([_, s]) => s.name);

        const enabledBuiltIn = Object.entries(mcpState.builtIn)
            .filter(([_, t]) => t.enabled)
            .map(([_, t]) => t.name);

        return {
            thirdParty: connectedServices,
            builtIn: enabledBuiltIn,
            total: connectedServices.length + enabledBuiltIn.length
        };
    }

    if (btnSubmitAgent) {
        btnSubmitAgent.addEventListener('click', () => {
            const requirement = document.getElementById('agentRequirement')?.value || '';

            if (!requirement.trim()) {
                alert('请输入 Agent 需求描述');
                return;
            }

            const toolsSummary = getEnabledToolsSummary();

            console.log('Creating Agent:', {
                requirement,
                tools: toolsSummary
            });

            const originalContent = btnSubmitAgent.innerHTML;
            btnSubmitAgent.innerHTML = '<span class="btn-icon">⏳</span> 创建中...';
            btnSubmitAgent.disabled = true;

            setTimeout(() => {
                btnSubmitAgent.innerHTML = originalContent;
                btnSubmitAgent.disabled = false;
                closeModal();

                let toolsMsg = '';
                if (toolsSummary.thirdParty.length > 0) {
                    toolsMsg += `\n第三方集成: ${toolsSummary.thirdParty.join(', ')}`;
                }
                if (toolsSummary.builtIn.length > 0) {
                    toolsMsg += `\n内置工具: ${toolsSummary.builtIn.join(', ')}`;
                }

                showToast('Agent 创建请求已提交！', 'success');
            }, 1500);
        });
    }
}

