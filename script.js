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
    const mcpBadgeWrapper = document.getElementById('mcpBadgeWrapper');
    const mcpBadge = document.getElementById('mcpBadge');
    const mcpTooltipList = document.getElementById('mcpTooltipList');
    const btnSubmitAgent = document.getElementById('btnSubmitAgent');
    const btnAddMcp = document.getElementById('btnAddMcp');

    if (!modal) return;

    // State
    let selectedTools = [
        { name: 'Wind 股票数据', icon: '📊', source: 'wind' },
        { name: 'Wind 财务报表', icon: '📈', source: 'wind' }
    ];

    // Update badge and tooltip
    function updateMcpBadge() {
        if (selectedTools.length > 0) {
            mcpBadgeWrapper.style.display = 'block';
            mcpBadge.textContent = `${selectedTools.length} 个工具`;

            // Update tooltip content
            mcpTooltipList.innerHTML = selectedTools.map(tool => `
                <div class="tooltip-item">
                    <span class="tooltip-item-icon">${tool.icon}</span>
                    <span>${tool.name}</span>
                </div>
            `).join('');
        } else {
            mcpBadgeWrapper.style.display = 'none';
        }
    }

    // Initialize badge
    updateMcpBadge();

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

    // MCP Panel Toggle
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

    // MCP Source Tabs
    const sourceTabs = document.querySelectorAll('.source-tab');
    const sourceContents = document.querySelectorAll('.mcp-source-content');

    sourceTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const source = tab.dataset.source;

            sourceTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            sourceContents.forEach(content => {
                content.classList.toggle('active', content.dataset.source === source);
            });
        });
    });

    // Tool Checkboxes
    const toolCheckboxes = document.querySelectorAll('.tool-mini-item input[type="checkbox"]');
    toolCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateSelectedToolsFromCheckboxes();
        });
    });

    function updateSelectedToolsFromCheckboxes() {
        selectedTools = [];
        document.querySelectorAll('.tool-mini-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox && checkbox.checked) {
                const icon = item.querySelector('.tool-mini-icon')?.textContent || '🔧';
                const name = item.querySelector('.tool-mini-name')?.textContent || 'Unknown';
                selectedTools.push({ name, icon, source: 'wind' });
            }
        });
        updateMcpBadge();
    }

    // Add MCP Button - Opens wizard modal
    if (btnAddMcp) {
        btnAddMcp.addEventListener('click', () => {
            // Open the MCP wizard modal
            const wizardModal = document.getElementById('mcpWizardModal');
            if (wizardModal) {
                mcpPanel.classList.add('hidden');
                wizardModal.classList.remove('hidden');
                setTimeout(() => wizardModal.classList.add('show'), 10);
            }
        });
    }

    // Submit Agent
    if (btnSubmitAgent) {
        btnSubmitAgent.addEventListener('click', () => {
            const requirement = document.getElementById('agentRequirement')?.value || '';

            if (!requirement.trim()) {
                alert('请输入 Agent 需求描述');
                return;
            }

            console.log('Creating Agent:', { requirement, tools: selectedTools });

            const originalContent = btnSubmitAgent.innerHTML;
            btnSubmitAgent.innerHTML = '<span class="btn-icon">⏳</span> 创建中...';
            btnSubmitAgent.disabled = true;

            setTimeout(() => {
                btnSubmitAgent.innerHTML = originalContent;
                btnSubmitAgent.disabled = false;
                closeModal();
                alert(`Agent 创建请求已提交！\n需求: ${requirement.substring(0, 50)}...\n工具: ${selectedTools.length} 个`);
            }, 1500);
        });
    }
}

// ===== MCP Wizard Modal Logic =====
document.addEventListener('DOMContentLoaded', () => {
    initMcpWizardModal();
});

function initMcpWizardModal() {
    const modal = document.getElementById('mcpWizardModal');
    const btnOpen = document.getElementById('btnOpenMcpWizard');
    const btnClose = document.querySelector('.mcp-wizard-close');
    const btnCancel = document.getElementById('btnWizardCancel');
    const btnPrev = document.getElementById('btnWizardPrev');
    const btnNext = document.getElementById('btnWizardNext');
    const btnFinish = document.getElementById('btnWizardFinish');
    const btnTestConnection = document.getElementById('btnTestConnection');

    if (!modal) return;

    // State
    let currentStep = 1;
    const totalSteps = 3;
    let connectionStatus = 'disconnected';
    let discoveredTools = [];

    // Open Wizard Modal
    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('show'), 10);
            resetWizard();
        });
    }

    // Close Modal
    function closeWizardModal() {
        modal.classList.remove('show');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }

    if (btnClose) btnClose.addEventListener('click', closeWizardModal);
    if (btnCancel) btnCancel.addEventListener('click', closeWizardModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeWizardModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeWizardModal();
        }
    });

    // Step Navigation
    function updateStep(step) {
        currentStep = step;

        // Update step indicators
        document.querySelectorAll('.step-item').forEach((item, index) => {
            const stepNum = index + 1;
            item.classList.remove('active', 'completed');
            if (stepNum === currentStep) {
                item.classList.add('active');
            } else if (stepNum < currentStep) {
                item.classList.add('completed');
            }
        });

        // Update connectors
        document.querySelectorAll('.step-connector').forEach((connector, index) => {
            connector.classList.toggle('completed', index < currentStep - 1);
        });

        // Update step content
        document.querySelectorAll('.wizard-step').forEach((stepEl) => {
            const stepNum = parseInt(stepEl.dataset.step);
            stepEl.classList.toggle('active', stepNum === currentStep);
        });

        // Update navigation buttons
        btnPrev.classList.toggle('hidden', currentStep === 1);
        btnNext.classList.toggle('hidden', currentStep === totalSteps);
        btnFinish.classList.toggle('hidden', currentStep !== totalSteps);

        // If entering step 3, trigger tool discovery
        if (currentStep === 3) {
            discoverTools();
        }
    }

    function validateStep(step) {
        if (step === 1) {
            const serverName = document.getElementById('mcpServerName').value.trim();
            const serverUrl = document.getElementById('mcpServerUrl').value.trim();
            if (!serverName) {
                showValidationError('请输入服务器名称');
                return false;
            }
            if (!serverUrl) {
                showValidationError('请输入 SSE 端点地址');
                return false;
            }
            if (!serverUrl.startsWith('http://') && !serverUrl.startsWith('https://')) {
                showValidationError('请输入有效的 URL 地址');
                return false;
            }
        }
        if (step === 2) {
            const authType = document.querySelector('.auth-type-btn.active')?.dataset.auth;
            if (authType === 'bearer') {
                const token = document.getElementById('bearerToken').value.trim();
                if (!token) {
                    showValidationError('请输入 Bearer Token');
                    return false;
                }
            }
            if (authType === 'apikey') {
                const header = document.getElementById('apiKeyHeader').value.trim();
                const key = document.getElementById('apiKeyValue').value.trim();
                if (!header || !key) {
                    showValidationError('请填写完整的 API Key 配置');
                    return false;
                }
            }
            if (authType === 'oauth2') {
                const clientId = document.getElementById('oauth2ClientId').value.trim();
                const clientSecret = document.getElementById('oauth2ClientSecret').value.trim();
                const authUrl = document.getElementById('oauth2AuthUrl').value.trim();
                const tokenUrl = document.getElementById('oauth2TokenUrl').value.trim();
                if (!clientId || !clientSecret || !authUrl || !tokenUrl) {
                    showValidationError('请填写完整的 OAuth 2.0 配置');
                    return false;
                }
            }
        }
        return true;
    }

    function showValidationError(message) {
        alert(message);
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                updateStep(currentStep + 1);
            }
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentStep > 1) {
                updateStep(currentStep - 1);
            }
        });
    }

    if (btnFinish) {
        btnFinish.addEventListener('click', () => {
            const selectedTools = discoveredTools.filter(t => t.enabled);
            const config = {
                serverName: document.getElementById('mcpServerName').value,
                serverUrl: document.getElementById('mcpServerUrl').value,
                authType: document.querySelector('.auth-type-btn.active')?.dataset.auth,
                tools: selectedTools
            };
            console.log('MCP Configuration:', config);

            btnFinish.innerHTML = '<span class="btn-icon">⏳</span> 保存中...';
            btnFinish.disabled = true;

            setTimeout(() => {
                btnFinish.innerHTML = '<span class="btn-icon">✓</span> 完成配置';
                btnFinish.disabled = false;
                closeWizardModal();
                alert(`MCP 服务器配置完成！\n服务器: ${config.serverName}\n已启用 ${selectedTools.length} 个工具`);
            }, 1500);
        });
    }

    // Test Connection
    if (btnTestConnection) {
        btnTestConnection.addEventListener('click', () => {
            const serverUrl = document.getElementById('mcpServerUrl').value.trim();
            if (!serverUrl) {
                showValidationError('请先输入 SSE 端点地址');
                return;
            }

            const statusEl = document.getElementById('connectionStatus');
            const resultEl = document.getElementById('connectionResult');

            // Set testing state
            statusEl.className = 'connection-status testing';
            statusEl.querySelector('.status-text').textContent = '测试中...';

            btnTestConnection.disabled = true;
            btnTestConnection.innerHTML = '<span class="btn-icon">⏳</span> 测试中...';

            // Simulate connection test
            setTimeout(() => {
                const success = Math.random() > 0.3; // 70% success rate for demo

                if (success) {
                    statusEl.className = 'connection-status connected';
                    statusEl.querySelector('.status-text').textContent = '已连接';
                    connectionStatus = 'connected';

                    resultEl.className = 'connection-result success';
                    resultEl.querySelector('.result-icon').textContent = '✅';
                    resultEl.querySelector('.result-title').textContent = '连接成功';
                    resultEl.querySelector('.result-message').textContent = '已成功连接到 MCP 服务器，可以继续配置。';
                } else {
                    statusEl.className = 'connection-status failed';
                    statusEl.querySelector('.status-text').textContent = '连接失败';
                    connectionStatus = 'failed';

                    resultEl.className = 'connection-result error';
                    resultEl.querySelector('.result-icon').textContent = '❌';
                    resultEl.querySelector('.result-title').textContent = '连接失败';
                    resultEl.querySelector('.result-message').textContent = '无法连接到服务器，请检查地址是否正确或网络是否可达。';
                }

                resultEl.classList.remove('hidden');
                btnTestConnection.disabled = false;
                btnTestConnection.innerHTML = '<span class="btn-icon">🔗</span> 测试连接';
            }, 2000);
        });
    }

    // Auth Type Switching
    const authTypeBtns = document.querySelectorAll('.auth-type-btn');
    authTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            authTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const authType = btn.dataset.auth;
            document.querySelectorAll('.auth-config').forEach(config => {
                config.classList.toggle('active', config.dataset.auth === authType);
            });
        });
    });

    // Password Toggle
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const targetId = toggle.dataset.target;
            const input = document.getElementById(targetId);
            if (input) {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                toggle.querySelector('.eye-icon').textContent = isPassword ? '🙈' : '👁️';
            }
        });
    });

    // Tool Discovery
    function discoverTools() {
        const loadingEl = document.getElementById('toolLoading');
        const listEl = document.getElementById('toolList');
        const emptyEl = document.getElementById('toolEmpty');
        const countEl = document.getElementById('toolCount');

        loadingEl.classList.remove('hidden');
        listEl.classList.add('hidden');
        listEl.innerHTML = '';
        emptyEl.classList.add('hidden');

        // Simulate tool discovery
        setTimeout(() => {
            // Sample tools for demo
            discoveredTools = [
                { id: 'get_exposure', name: 'get_exposure', desc: '获取主体敞口信息，包括授信额度、已用额度、担保关系等', enabled: true },
                { id: 'list_risk_events', name: 'list_risk_events', desc: '列出指定主体在时间范围内的风险事件记录', enabled: true },
                { id: 'get_internal_rating', name: 'get_internal_rating', desc: '获取主体的内部评级信息及评级历史变动', enabled: true },
                { id: 'search_notes', name: 'search_notes', desc: '在知识库中搜索相关研究笔记和调研记录', enabled: true },
                { id: 'get_weekly_template', name: 'get_weekly_template', desc: '获取周报模板和格式化规范', enabled: false },
                { id: 'submit_compliance', name: 'submit_compliance', desc: '提交合规审批工单并返回审批状态', enabled: false }
            ];

            loadingEl.classList.add('hidden');

            if (discoveredTools.length === 0) {
                emptyEl.classList.remove('hidden');
            } else {
                listEl.classList.remove('hidden');
                renderToolList();
                countEl.textContent = `${discoveredTools.length} 个工具`;
            }
        }, 1500);
    }

    function renderToolList() {
        const listEl = document.getElementById('toolList');
        const searchTerm = document.getElementById('toolSearch')?.value.toLowerCase() || '';

        const filteredTools = discoveredTools.filter(tool =>
            tool.name.toLowerCase().includes(searchTerm) ||
            tool.desc.toLowerCase().includes(searchTerm)
        );

        listEl.innerHTML = filteredTools.map(tool => `
            <div class="tool-card ${tool.enabled ? '' : 'disabled'}" data-tool-id="${tool.id}">
                <div class="tool-icon">🔧</div>
                <div class="tool-info">
                    <div class="tool-name">${tool.name}</div>
                    <div class="tool-desc">${tool.desc}</div>
                    <span class="tool-schema">📋 查看 Schema</span>
                </div>
                <label class="tool-toggle">
                    <input type="checkbox" ${tool.enabled ? 'checked' : ''} data-tool-id="${tool.id}">
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `).join('');

        // Bind toggle events
        listEl.querySelectorAll('.tool-toggle input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const toolId = e.target.dataset.toolId;
                const tool = discoveredTools.find(t => t.id === toolId);
                if (tool) {
                    tool.enabled = e.target.checked;
                    e.target.closest('.tool-card').classList.toggle('disabled', !tool.enabled);
                }
                updateSelectedCount();
            });
        });
    }

    function updateSelectedCount() {
        const countEl = document.getElementById('toolCount');
        const enabledCount = discoveredTools.filter(t => t.enabled).length;
        countEl.textContent = `${enabledCount}/${discoveredTools.length} 个已选`;
    }

    // Tool Search
    const toolSearch = document.getElementById('toolSearch');
    if (toolSearch) {
        toolSearch.addEventListener('input', () => {
            renderToolList();
        });
    }

    // Select All / None
    const btnSelectAll = document.getElementById('btnSelectAll');
    const btnSelectNone = document.getElementById('btnSelectNone');

    if (btnSelectAll) {
        btnSelectAll.addEventListener('click', () => {
            discoveredTools.forEach(t => t.enabled = true);
            renderToolList();
            updateSelectedCount();
        });
    }

    if (btnSelectNone) {
        btnSelectNone.addEventListener('click', () => {
            discoveredTools.forEach(t => t.enabled = false);
            renderToolList();
            updateSelectedCount();
        });
    }

    // Reset Wizard
    function resetWizard() {
        currentStep = 1;
        connectionStatus = 'disconnected';
        discoveredTools = [];

        // Reset form fields
        document.getElementById('mcpServerName').value = '';
        document.getElementById('mcpServerUrl').value = '';
        document.getElementById('connectionStatus').className = 'connection-status';
        document.getElementById('connectionStatus').querySelector('.status-text').textContent = '未连接';
        document.getElementById('connectionResult').classList.add('hidden');
        document.getElementById('bearerToken').value = '';
        document.getElementById('apiKeyHeader').value = '';
        document.getElementById('apiKeyValue').value = '';
        document.getElementById('oauth2ClientId').value = '';
        document.getElementById('oauth2ClientSecret').value = '';
        document.getElementById('oauth2AuthUrl').value = '';
        document.getElementById('oauth2TokenUrl').value = '';

        // Reset auth type to none
        document.querySelectorAll('.auth-type-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.auth-type-btn[data-auth="none"]').classList.add('active');
        document.querySelectorAll('.auth-config').forEach(c => c.classList.remove('active'));
        document.querySelector('.auth-config[data-auth="none"]').classList.add('active');

        // Reset steps
        updateStep(1);
    }
}

