/* content of js/modules/interface-test.js - Enhanced with sub-tabs */
import { INTERFACE_TEST_CASES, INTERFACE_TEST_HISTORY } from '../data.js';

export function init(container, state) {
    let cases = [...INTERFACE_TEST_CASES];
    let currentSubTab = 'debug';

    const renderSubTabs = () => `
        <div class="sub-tabs">
            <button class="sub-tab ${currentSubTab === 'debug' ? 'active' : ''}" data-subtab="debug">
                <span class="material-icons-round">bug_report</span> 即时调试
            </button>
            <button class="sub-tab ${currentSubTab === 'cases' ? 'active' : ''}" data-subtab="cases">
                <span class="material-icons-round">list_alt</span> 测试用例
            </button>
            <button class="sub-tab ${currentSubTab === 'batch' ? 'active' : ''}" data-subtab="batch">
                <span class="material-icons-round">play_circle</span> 批量执行
            </button>
            <button class="sub-tab ${currentSubTab === 'history' ? 'active' : ''}" data-subtab="history">
                <span class="material-icons-round">history</span> 历史记录
            </button>
        </div>
    `;

    const renderDebugPanel = () => `
        <div class="debug-panel">
            <div class="debug-input card">
                <h4>请求参数 (MCP Input)</h4>
                <div class="editor-wrapper">
<pre class="code-editor" contenteditable="true">{
  "city": "北京",
  "units": "metric"
}</pre>
                </div>
                <div class="debug-actions">
                    <select class="input-control" style="width:120px;">
                        <option>Test 环境</option>
                        <option>Prod 环境</option>
                    </select>
                    <button class="btn btn-primary" id="btn-debug-run">
                        <span class="material-icons-round">send</span> 发送请求
                    </button>
                </div>
            </div>
            <div class="debug-output card">
                <h4>响应结果 (MCP Output)</h4>
                <div class="output-tabs">
                    <button class="output-tab active">Response</button>
                    <button class="output-tab">Headers</button>
                    <button class="output-tab">Logs</button>
                </div>
                <div class="editor-wrapper output">
<pre class="code-output">{
  "temperature": 22,
  "conditions": "晴",
  "humidity": 45,
  "wind": "东北风 3级"
}

// 耗时: 98ms | 状态: 200 OK</pre>
                </div>
            </div>
        </div>
    `;

    const renderCasesPanel = () => `
        <div class="cases-panel">
            <div class="toolbar">
                <div class="toolbar-left">
                    <input type="text" class="input-control" placeholder="搜索用例..." style="width:200px;">
                    <select class="input-control" style="width:120px;">
                        <option>所有环境</option>
                        <option>Test</option>
                        <option>Prod</option>
                    </select>
                    <select class="input-control" style="width:120px;">
                        <option>所有状态</option>
                        <option>通过</option>
                        <option>失败</option>
                    </select>
                </div>
                <div class="toolbar-right">
                    <button class="btn btn-secondary">
                        <span class="material-icons-round">upload</span> 导入
                    </button>
                    <button class="btn btn-primary">
                        <span class="material-icons-round">add</span> 新增用例
                    </button>
                </div>
            </div>
            <div class="card" style="padding:0; overflow:hidden;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th style="width:40px;"><input type="checkbox"></th>
                            <th>ID</th>
                            <th>用例名称</th>
                            <th>环境</th>
                            <th>结果</th>
                            <th>耗时</th>
                            <th>最后执行</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cases.map(c => `
                            <tr>
                                <td><input type="checkbox"></td>
                                <td><code>${c.id}</code></td>
                                <td style="font-weight:500;">${c.name}</td>
                                <td><span class="badge badge-draft">${c.env}</span></td>
                                <td>
                                    <span class="status-chip ${c.status === 'PASS' ? 'pass' : 'fail'}">
                                        <span class="material-icons-round">${c.status === 'PASS' ? 'check_circle' : 'cancel'}</span>
                                        ${c.status === 'PASS' ? '通过' : '失败'}
                                    </span>
                                </td>
                                <td><code>${c.latency}ms</code></td>
                                <td style="color:var(--text-secondary);">${c.lastRun}</td>
                                <td>
                                    <button class="btn btn-ghost btn-sm" title="编辑"><span class="material-icons-round">edit</span></button>
                                    <button class="btn btn-ghost btn-sm" title="运行"><span class="material-icons-round">play_arrow</span></button>
                                    <button class="btn btn-ghost btn-sm" title="复制"><span class="material-icons-round">content_copy</span></button>
                                    <button class="btn btn-ghost btn-sm" title="删除"><span class="material-icons-round">delete</span></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const renderBatchPanel = () => `
        <div class="batch-panel">
            <div class="batch-config card">
                <h4>执行配置</h4>
                <div class="config-grid">
                    <div class="input-group">
                        <label class="input-label">选择用例集</label>
                        <select class="input-control">
                            <option>全部用例 (${cases.length})</option>
                            <option>冒烟测试 Suite (5)</option>
                            <option>回归测试 Suite (15)</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label class="input-label">执行环境</label>
                        <select class="input-control">
                            <option>Test 环境</option>
                            <option>Prod 环境</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label class="input-label">执行方式</label>
                        <select class="input-control">
                            <option>后台异步 (推荐)</option>
                            <option>前台同步</option>
                        </select>
                    </div>
                </div>
                <div class="batch-actions">
                    <button class="btn btn-primary btn-lg" id="btn-start-batch">
                        <span class="material-icons-round">play_arrow</span> 开始批量执行
                    </button>
                </div>
            </div>
            
            <div class="progress-area" id="batch-progress" style="display:none;">
                <div class="progress-header">
                    <span class="material-icons-round spin">sync</span>
                    <span>批量执行中...</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: 0%"></div>
                </div>
                <div class="progress-stats">
                    <span>0 / ${cases.length} 完成</span>
                    <span>已用时: 0s</span>
                </div>
            </div>
        </div>
    `;

    const renderHistoryPanel = () => `
        <div class="history-panel">
            <div class="toolbar">
                <div class="toolbar-left">
                    <span style="color:var(--text-secondary);">共 ${INTERFACE_TEST_HISTORY.length} 条历史记录</span>
                </div>
                <div class="toolbar-right">
                    <button class="btn btn-ghost">
                        <span class="material-icons-round">filter_list</span> 筛选
                    </button>
                </div>
            </div>
            <div class="card" style="padding:0; overflow:hidden;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>执行 ID</th>
                            <th>触发方式</th>
                            <th>用例数</th>
                            <th>成功率</th>
                            <th>平均耗时</th>
                            <th>执行时间</th>
                            <th>执行人</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${INTERFACE_TEST_HISTORY.map(h => `
                            <tr>
                                <td><code>${h.runId}</code></td>
                                <td>${h.trigger}</td>
                                <td>${h.caseCount}</td>
                                <td>
                                    <span class="rate-chip ${h.successRate >= 95 ? 'good' : h.successRate >= 80 ? 'warn' : 'bad'}">
                                        ${h.successRate}%
                                    </span>
                                </td>
                                <td><code>${h.avgLatency}ms</code></td>
                                <td>${h.startTime}</td>
                                <td>${h.user}</td>
                                <td>
                                    <button class="btn btn-ghost btn-sm" title="查看报告"><span class="material-icons-round">description</span></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const render = () => {
        let panelContent = '';
        switch (currentSubTab) {
            case 'debug': panelContent = renderDebugPanel(); break;
            case 'cases': panelContent = renderCasesPanel(); break;
            case 'batch': panelContent = renderBatchPanel(); break;
            case 'history': panelContent = renderHistoryPanel(); break;
        }

        container.innerHTML = `
            <div class="module-container">
                ${renderSubTabs()}
                <div class="sub-panel">
                    ${panelContent}
                </div>
            </div>
        `;

        // Bind sub-tab clicks
        container.querySelectorAll('.sub-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                currentSubTab = tab.dataset.subtab;
                render();
            });
        });

        // Bind batch run
        const batchBtn = container.querySelector('#btn-start-batch');
        if (batchBtn) {
            batchBtn.addEventListener('click', runBatch);
        }
    };

    const runBatch = () => {
        const progressArea = container.querySelector('#batch-progress');
        const fill = progressArea.querySelector('.progress-bar-fill');
        const stats = progressArea.querySelector('.progress-stats');

        progressArea.style.display = 'block';
        let width = 0;
        let done = 0;

        const interval = setInterval(() => {
            width += 20;
            done = Math.floor((width / 100) * cases.length);
            fill.style.width = width + '%';
            stats.innerHTML = `<span>${done} / ${cases.length} 完成</span><span>已用时: ${Math.floor(width / 20)}s</span>`;
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    alert('批量执行完成！成功率: 86.7%');
                    currentSubTab = 'history';
                    render();
                }, 500);
            }
        }, 500);
    };

    render();
}
