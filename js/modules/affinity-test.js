/* content of js/modules/affinity-test.js - Enhanced with sub-tabs */
import { AFFINITY_TEST_CASES, AFFINITY_TEST_HISTORY } from '../data.js';

export function init(container, state) {
    const cases = [...AFFINITY_TEST_CASES];
    let currentSubTab = 'debug';

    const renderSubTabs = () => `
        <div class="sub-tabs">
            <button class="sub-tab ${currentSubTab === 'debug' ? 'active' : ''}" data-subtab="debug">
                <span class="material-icons-round">chat</span> 单句调试
            </button>
            <button class="sub-tab ${currentSubTab === 'cases' ? 'active' : ''}" data-subtab="cases">
                <span class="material-icons-round">list_alt</span> 测试用例
            </button>
            <button class="sub-tab ${currentSubTab === 'batch' ? 'active' : ''}" data-subtab="batch">
                <span class="material-icons-round">psychology</span> 批量评测
            </button>
            <button class="sub-tab ${currentSubTab === 'history' ? 'active' : ''}" data-subtab="history">
                <span class="material-icons-round">history</span> 历史报告
            </button>
        </div>
    `;

    const renderDebugPanel = () => `
        <div class="affinity-debug">
            <div class="prompt-input card">
                <h4>输入自然语言指令</h4>
                <textarea class="input-control prompt-textarea" placeholder="例如：帮我查一下明天上海的天气预报"></textarea>
                <div class="prompt-actions">
                    <select class="input-control" style="width:180px;">
                        <option>GPT-4-Turbo</option>
                        <option>GPT-4</option>
                        <option>Claude-3</option>
                    </select>
                    <button class="btn btn-primary">
                        <span class="material-icons-round">send</span> 测试亲和性
                    </button>
                </div>
            </div>
            
            <div class="affinity-result card">
                <h4>评测结果</h4>
                <div class="result-grid">
                    <div class="result-item">
                        <label>是否命中 MCP</label>
                        <div class="result-value hit">
                            <span class="material-icons-round">check_circle</span> 是
                        </div>
                    </div>
                    <div class="result-item">
                        <label>生成的 MCP Input</label>
                        <pre class="result-code">{ "city": "上海", "date": "tomorrow" }</pre>
                    </div>
                    <div class="result-item">
                        <label>参数完整率</label>
                        <div class="result-value">
                            <div class="mini-progress">
                                <div class="mini-fill" style="width:80%"></div>
                            </div>
                            <span>80% (4/5 必填)</span>
                        </div>
                    </div>
                    <div class="result-item">
                        <label>调用成功</label>
                        <div class="result-value hit">
                            <span class="material-icons-round">check_circle</span> 是
                        </div>
                    </div>
                    <div class="result-item">
                        <label>综合评分</label>
                        <div class="result-value score">
                            <span class="score-num">4.5</span> / 5.0
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const renderCasesPanel = () => `
        <div class="cases-panel">
            <div class="toolbar">
                <div class="toolbar-left">
                    <input type="text" class="input-control" placeholder="搜索 Prompt..." style="width:250px;">
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
                            <th>Prompt (提示词)</th>
                            <th>命中?</th>
                            <th>参数完整率</th>
                            <th>调用成功</th>
                            <th>得分</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${cases.map(c => `
                            <tr>
                                <td><input type="checkbox"></td>
                                <td><code>${c.id}</code></td>
                                <td style="max-width:300px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${c.prompt}">"${c.prompt}"</td>
                                <td>
                                    ${c.hit
            ? '<span class="badge badge-ready">是</span>'
            : '<span class="badge badge-offline">否</span>'}
                                </td>
                                <td>${c.paramFill}%</td>
                                <td>
                                    ${c.callSuccess
            ? '<span class="material-icons-round status-icon pass" style="font-size:16px">check_circle</span>'
            : '<span class="material-icons-round status-icon fail" style="font-size:16px">cancel</span>'}
                                </td>
                                <td>
                                    <span class="score-badge ${c.score >= 4.5 ? 'good' : c.score >= 3.5 ? 'warn' : 'bad'}">
                                        ${c.score}
                                    </span>
                                </td>
                                <td>
                                    <button class="btn btn-ghost btn-sm" title="调试"><span class="material-icons-round">bug_report</span></button>
                                    <button class="btn btn-ghost btn-sm" title="编辑"><span class="material-icons-round">edit</span></button>
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
                <h4>批量评测配置</h4>
                <div class="config-grid">
                    <div class="input-group">
                        <label class="input-label">选择用例集</label>
                        <select class="input-control">
                            <option>全部用例 (${cases.length})</option>
                            <option>核心场景 Suite (10)</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label class="input-label">LLM 版本</label>
                        <select class="input-control">
                            <option>GPT-4-Turbo</option>
                            <option>GPT-4</option>
                            <option>Claude-3</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label class="input-label">执行轮次 (稳定性)</label>
                        <select class="input-control">
                            <option>1 轮</option>
                            <option>3 轮 (推荐)</option>
                            <option>5 轮</option>
                        </select>
                    </div>
                </div>
                <div class="batch-actions">
                    <button class="btn btn-primary btn-lg">
                        <span class="material-icons-round">psychology</span> 开始批量评测
                    </button>
                </div>
            </div>
            
            <!-- Stats Preview -->
            <div class="stats-preview">
                <div class="stat-card card">
                    <div class="stat-label">平均得分</div>
                    <div class="stat-value primary">4.8 <small>/ 5.0</small></div>
                </div>
                <div class="stat-card card">
                    <div class="stat-label">命中率</div>
                    <div class="stat-value success">96%</div>
                </div>
                <div class="stat-card card">
                    <div class="stat-label">参数完整率</div>
                    <div class="stat-value">88%</div>
                </div>
                <div class="stat-card card">
                    <div class="stat-label">调用成功率</div>
                    <div class="stat-value success">100%</div>
                </div>
            </div>
        </div>
    `;

    const renderHistoryPanel = () => `
        <div class="history-panel">
            <div class="card" style="padding:0; overflow:hidden;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>执行 ID</th>
                            <th>LLM 版本</th>
                            <th>用例数</th>
                            <th>执行轮次</th>
                            <th>平均分</th>
                            <th>命中率</th>
                            <th>执行时间</th>
                            <th>执行人</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${AFFINITY_TEST_HISTORY.map(h => `
                            <tr>
                                <td><code>${h.runId}</code></td>
                                <td>${h.llmVersion}</td>
                                <td>${h.caseCount}</td>
                                <td>${h.rounds} 轮</td>
                                <td>
                                    <span class="score-badge ${h.avgScore >= 4.5 ? 'good' : 'warn'}">
                                        ${h.avgScore}
                                    </span>
                                </td>
                                <td>${h.hitRate}%</td>
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

        container.querySelectorAll('.sub-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                currentSubTab = tab.dataset.subtab;
                render();
            });
        });
    };

    render();
}
