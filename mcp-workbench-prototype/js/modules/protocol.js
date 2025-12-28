/* content of js/modules/protocol.js */
export function init(container, state) {
    const html = `
        <div class="protocol-grid">
            <!-- HTTP Definition -->
            <div class="card">
                <div class="card-header">
                    <h3>原始接口定义 (HTTP)</h3>
                </div>
                <div style="padding: var(--space-md);">
                    <div class="input-group">
                        <label class="input-label">Method & URL</label>
                        <div style="display:flex; gap:8px;">
                            <select class="input-control" style="width:100px;">
                                <option>GET</option>
                                <option>POST</option>
                            </select>
                            <input type="text" class="input-control" value="https://api.weather.com/v3/current" style="flex:1;">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mapping Table -->
            <div class="card">
                <div class="card-header">
                    <h3>参数映射 (Input -> HTTP)</h3>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>MCP 入参字段</th>
                            <th>目标类型</th>
                            <th>目标 Key</th>
                            <th>默认值</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>city</code></td>
                            <td><span class="badge badge-draft">Query</span></td>
                            <td>q</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td><code>units</code></td>
                            <td><span class="badge badge-draft">Query</span></td>
                            <td>units</td>
                            <td>metric</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Error Codes -->
            <div class="card">
                <div class="card-header">
                    <h3>错误码映射</h3>
                    <button class="btn btn-ghost btn-sm">+ 添加规则</button>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>HTTP 状态码</th>
                            <th>MCP 错误码</th>
                            <th>错误信息模版</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>401</td>
                            <td>Example: Forbidden</td>
                            <td>Invalid API Key</td>
                        </tr>
                        <tr style="background:var(--color-warning-bg)">
                            <td>404</td>
                            <td>--</td>
                            <td>(缺少映射)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    container.innerHTML = html;
}
