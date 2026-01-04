/* content of js/modules/schema.js - Enhanced with validation details */
export function init(container, state) {
    const isSchemaValid = state.mcp.checklist.schema.status === 'PASS';

    const html = `
        <div class="schema-layout">
            <div class="schema-editors">
                <!-- Input Schema -->
                <div class="card editor-card">
                    <div class="card-header">
                        <h3>Input Schema (入参定义)</h3>
                        <div class="actions">
                            <button class="btn btn-ghost btn-sm" title="自动补全 description">
                                <span class="material-icons-round">auto_fix_high</span> AI 补全
                            </button>
                            <button class="btn btn-ghost btn-sm" title="生成示例 JSON">
                                <span class="material-icons-round">code</span> 生成示例
                            </button>
                        </div>
                    </div>
                    <div class="editor-content">
<pre class="code-editor" contenteditable="true">{
  "type": "object",
  "properties": {
    "city": {
      "type": "string",
      "description": "要查询天气的城市名称，支持中英文"
    },
    "date": {
      "type": "string",
      "description": "查询日期，格式 YYYY-MM-DD 或 today/tomorrow"
    },
    "units": {
      "type": "string",
      "enum": ["metric", "imperial"],
      "default": "metric",
      "description": "温度单位，metric=摄氏度，imperial=华氏度"
    }
  },
  "required": ["city"]
}</pre>
                    </div>
                </div>

                <!-- Output Schema -->
                <div class="card editor-card">
                    <div class="card-header">
                        <h3>Output Schema (出参定义)</h3>
                    </div>
                    <div class="editor-content">
<pre class="code-editor" contenteditable="true">{
  "type": "object",
  "properties": {
    "temperature": { 
      "type": "number",
      "description": "当前温度"
    },
    "conditions": { 
      "type": "string",
      "description": "天气状况描述（如：晴、多云、雨）"
    },
    "humidity": {
      "type": "number",
      "description": "湿度百分比"
    },
    "wind": {
      "type": "string",
      "description": "风力风向"
    }
  }
}</pre>
                    </div>
                </div>
            </div>

            <!-- Validation Panel -->
            <div class="validation-panel card ${isSchemaValid ? 'valid' : 'invalid'}">
                <div class="panel-header">
                    <h4>校验结果</h4>
                    ${isSchemaValid
            ? '<span class="badge badge-ready">PASS</span>'
            : '<span class="badge badge-error">2 问题</span>'}
                </div>
                
                <div class="validation-summary">
                    <div class="summary-row">
                        <span class="material-icons-round status-icon pass">check_circle</span>
                        <span>Input Schema 结构完整</span>
                    </div>
                    <div class="summary-row">
                        <span class="material-icons-round status-icon pass">check_circle</span>
                        <span>Output Schema 结构完整</span>
                    </div>
                    <div class="summary-row">
                        <span class="material-icons-round status-icon ${isSchemaValid ? 'pass' : 'warn'}">
                            ${isSchemaValid ? 'check_circle' : 'warning'}
                        </span>
                        <span>字段描述检查</span>
                    </div>
                </div>

                ${isSchemaValid ? `
                    <div class="empty-state">
                        <span class="material-icons-round" style="color:var(--color-success); font-size:48px;">verified</span>
                        <p>Schema 校验通过，符合发布标准。</p>
                    </div>
                ` : `
                    <div class="issue-list">
                        <div class="issue-item warn">
                            <span class="material-icons-round">warning</span>
                            <div class="issue-content">
                                <div class="issue-title">建议: 补充 Output 字段描述</div>
                                <div class="issue-path">$.properties.temperature.description</div>
                            </div>
                        </div>
                    </div>
                `}

                <div class="panel-actions">
                    <button class="btn btn-secondary">
                        <span class="material-icons-round">save</span> 保存
                    </button>
                    <button class="btn btn-primary">
                        <span class="material-icons-round">refresh</span> 重新校验
                    </button>
                </div>
            </div>
        </div>
    `;
    container.innerHTML = html;
}
