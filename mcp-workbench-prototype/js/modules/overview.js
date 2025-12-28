/* content of js/modules/overview.js - Enhanced with complete publish status */
export function render(container, mcpData) {
    const getStatusBadge = (status) => {
        const map = {
            'DRAFT': { class: 'badge-draft', label: '草稿' },
            'VALIDATING': { class: 'badge-validating', label: '校验中' },
            'READY': { class: 'badge-ready', label: '可发布' },
            'PUBLISHED': { class: 'badge-published', label: '已发布' },
            'OFFLINE': { class: 'badge-offline', label: '已下线' },
            'PUBLISH_FAILED': { class: 'badge-error', label: '发布失败' }
        };
        return map[status] || map['DRAFT'];
    };

    const renderChecklistItem = (label, check) => {
        const iconMap = {
            'PASS': { icon: 'check_circle', class: 'pass' },
            'FAIL': { icon: 'cancel', class: 'fail' },
            'WARN': { icon: 'warning', class: 'warn' },
            'PENDING': { icon: 'schedule', class: 'pending' }
        };
        const st = iconMap[check.status] || iconMap['PENDING'];

        return `
            <div class="checklist-item" data-link="${check.link || ''}">
                <div class="check-status">
                    <span class="material-icons-round status-icon ${st.class}">${st.icon}</span>
                </div>
                <div class="check-content">
                    <div class="check-label">${label}</div>
                    <div class="check-message">${check.message}</div>
                    <div class="check-detail">${check.detail || ''}</div>
                </div>
                ${check.link ? `
                <div class="check-action">
                   <button class="btn btn-ghost btn-sm" title="跳转定位">
                        <span class="material-icons-round" style="font-size:16px">arrow_forward</span>
                   </button>
                </div>
                ` : ''}
            </div>
        `;
    };

    const statusInfo = getStatusBadge(mcpData.status);

    const html = `
        <div class="overview-grid">
            <!-- Left Card: Tool Info & Status (2/3 width) -->
            <div class="card overview-main">
                <div class="overview-header">
                    <div class="tool-identity">
                        <div class="tool-icon">
                            <span class="material-icons-round">cloud</span>
                        </div>
                        <div>
                            <h1 class="tool-name">${mcpData.name}</h1>
                            <div class="tool-meta">
                                <span class="version">v${mcpData.version}</span>
                                <span class="badge badge-lg ${statusInfo.class}">${statusInfo.label}</span>
                            </div>
                        </div>
                    </div>
                    <div class="tool-actions">
                         ${getActionButtons(mcpData.status)}
                    </div>
                </div>
                
                <p class="tool-desc">${mcpData.description}</p>

                <!-- Status Summary Bar -->
                <div class="status-summary">
                    <div class="summary-item">
                        <span class="material-icons-round">api</span>
                        <span>总调用量: <strong>${mcpData.stats?.totalCalls?.toLocaleString() || 'N/A'}</strong></span>
                    </div>
                    <div class="summary-item">
                        <span class="material-icons-round">timer</span>
                        <span>平均延迟: <strong>${mcpData.stats?.avgLatency || 'N/A'}ms</strong></span>
                    </div>
                    <div class="summary-item">
                        <span class="material-icons-round">error_outline</span>
                        <span>错误率: <strong>${mcpData.stats?.errorRate || 'N/A'}%</strong></span>
                    </div>
                </div>
                
                <!-- Checklist Section -->
                <div class="checklist-section">
                    <div class="section-header">
                        <h3 class="section-title">发布检查清单</h3>
                        <button class="btn btn-ghost btn-sm" id="btn-run-validation">
                            <span class="material-icons-round">refresh</span> 重新校验
                        </button>
                    </div>
                    <div class="checklist-grid">
                        ${renderChecklistItem('Schema 完整性', mcpData.checklist.schema)}
                        ${renderChecklistItem('协议转换配置', mcpData.checklist.protocol)}
                        ${renderChecklistItem('接口测试 (最近批量)', mcpData.checklist.interfaceTest)}
                        ${renderChecklistItem('AI 亲和性 (最近批量)', mcpData.checklist.affinityTest)}
                        ${renderChecklistItem('人工审核', mcpData.checklist.manualReview)}
                    </div>
                </div>
            </div>

            <!-- Right Card: Governance (1/3 width) -->
            <div class="card overview-side">
                <h3 class="section-title">治理信息</h3>
                
                <div class="gov-item">
                    <label>负责人 / 协作人</label>
                    <div class="owner-list">
                        ${mcpData.owners.map(o => `
                            <div class="owner-chip">
                                <div class="avatar" style="background:${o.role === '负责人' ? 'var(--color-primary)' : 'var(--color-border-hover)'}">${o.avatar}</div>
                                <div class="owner-info">
                                    <span class="owner-name">${o.name}</span>
                                    <span class="owner-role">${o.role}</span>
                                </div>
                            </div>
                        `).join('')}
                        <button class="btn btn-ghost btn-sm add-owner-btn">
                            <span class="material-icons-round">person_add</span>
                        </button>
                    </div>
                </div>

                <div class="gov-item">
                    <label>创建信息</label>
                    <div class="val">${mcpData.createdBy} 于 ${new Date(mcpData.createdAt).toLocaleDateString('zh-CN')}</div>
                </div>

                <div class="gov-item">
                    <label>最后更新</label>
                    <div class="val">${new Date(mcpData.lastUpdated).toLocaleString('zh-CN')}</div>
                </div>

                <div class="gov-item">
                    <label>可见性</label>
                    <div class="val" style="display:flex; align-items:center; gap:6px;">
                        <span class="material-icons-round" style="font-size:16px;">lock</span>
                        私有 (仅团队可见)
                    </div>
                </div>

                <!-- Quick Links -->
                <div class="gov-item quick-links">
                    <label>快捷操作</label>
                    <div class="link-list">
                        <a href="#" class="link-item"><span class="material-icons-round">history</span> 查看版本历史</a>
                        <a href="#" class="link-item"><span class="material-icons-round">content_copy</span> 复制 MCP 配置</a>
                        <a href="#" class="link-item"><span class="material-icons-round">download</span> 导出文档</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Bind Actions
    bindActions(container);
}

function bindActions(container) {
    // Publish Button
    const publishBtn = container.querySelector('#btn-request-publish');
    if (publishBtn) {
        publishBtn.addEventListener('click', () => {
            publishBtn.innerHTML = '<span class="material-icons-round spin">sync</span> 校验中...';
            publishBtn.disabled = true;
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('mcp:status-change', { detail: { status: 'VALIDATING' } }));
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('mcp:status-change', { detail: { status: 'READY' } }));
                }, 3000);
            }, 800);
        });
    }

    // Publish Now Button
    const publishNowBtn = container.querySelector('#btn-publish-now');
    if (publishNowBtn) {
        publishNowBtn.addEventListener('click', () => {
            if (confirm('确认发布到生产环境注册中心？')) {
                window.dispatchEvent(new CustomEvent('mcp:status-change', { detail: { status: 'PUBLISHED' } }));
            }
        });
    }

    // Checklist item click to navigate
    container.querySelectorAll('.checklist-item[data-link]').forEach(item => {
        item.addEventListener('click', () => {
            const link = item.dataset.link;
            if (link && link !== 'null') {
                const tabId = link.replace('#', '');
                const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
                if (tabBtn) tabBtn.click();
            }
        });
    });
}

function getActionButtons(status) {
    if (status === 'DRAFT' || status === 'PUBLISH_FAILED') {
        return `
            <button class="btn btn-secondary">
                <span class="material-icons-round">save</span> 保存草稿
            </button>
            <button class="btn btn-primary" id="btn-request-publish">
                <span class="material-icons-round">rocket_launch</span>
                发起校验
            </button>
        `;
    } else if (status === 'VALIDATING') {
        return `
            <button class="btn btn-secondary" disabled>
                <span class="material-icons-round spin">sync</span>
                校验中...
            </button>
        `;
    } else if (status === 'READY') {
        return `
            <button class="btn btn-secondary">
                <span class="material-icons-round">visibility</span> 预览
            </button>
            <button class="btn btn-primary" id="btn-publish-now" style="background:var(--color-success)">
                <span class="material-icons-round">publish</span>
                立即发布
            </button>
        `;
    } else if (status === 'PUBLISHED') {
        return `
            <button class="btn btn-secondary">
                <span class="material-icons-round">edit</span> 编辑新版本
            </button>
            <button class="btn btn-secondary" style="color:var(--color-error); border-color:var(--color-error)">
                <span class="material-icons-round">power_settings_new</span>
                下线
            </button>
        `;
    } else if (status === 'OFFLINE') {
        return `
            <button class="btn btn-primary">
                <span class="material-icons-round">redo</span> 重新上线
            </button>
        `;
    }
    return '';
}
