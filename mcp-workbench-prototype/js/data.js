/* content of js/data.js - Enhanced with complete status model */
export const MCP_TOOL = {
    id: "mcp-weather-v1",
    name: "weather-service-mcp",
    version: "1.2.0",
    description: "提供天气预报和灾害预警服务。支持全球主要城市的实时天气查询、未来7日预报以及极端天气预警推送。",
    status: "DRAFT", // DRAFT, VALIDATING, READY, PUBLISHED, OFFLINE, PUBLISH_FAILED

    // Complete Checklist Model
    checklist: {
        schema: {
            status: "PASS",
            message: "Schema 完整性校验通过",
            detail: "Input/Output 字段结构完整，描述齐全",
            link: "#schema"
        },
        protocol: {
            status: "WARN",
            message: "协议转换配置存在警告",
            detail: "缺少 404/500 错误码映射规则",
            link: "#protocol"
        },
        interfaceTest: {
            status: "FAIL",
            message: "接口测试未通过",
            detail: "最近批量: 13/15 通过 (86.7%)",
            successRate: 86.7,
            link: "#interface-test"
        },
        affinityTest: {
            status: "PASS",
            message: "AI 亲和性良好",
            detail: "平均分 4.8/5.0，命中率 96%",
            avgScore: 4.8,
            hitRate: 96,
            link: "#affinity-test"
        },
        manualReview: {
            status: "PENDING",
            message: "等待人工审核",
            detail: "已提交审核请求，预计 24h 内完成",
            link: null
        }
    },

    // Governance Info
    owners: [
        { name: "张三", avatar: "张", role: "负责人" },
        { name: "李四", avatar: "李", role: "协作人" }
    ],
    createdAt: "2023-09-15T08:00:00Z",
    lastUpdated: "2023-10-27T10:30:00Z",
    createdBy: "张三",

    // Stats
    stats: {
        totalCalls: 15420,
        avgLatency: 120,
        errorRate: 0.3
    }
};

// Interface Test Cases
export const INTERFACE_TEST_CASES = [
    { id: "TC-001", name: "获取北京天气 (正常)", env: "test", status: "PASS", latency: 98, lastRun: "2分钟前" },
    { id: "TC-002", name: "获取上海天气 (正常)", env: "test", status: "PASS", latency: 112, lastRun: "2分钟前" },
    { id: "TC-003", name: "缺少必填参数 city", env: "test", status: "FAIL", latency: 45, lastRun: "2分钟前", error: "参数校验失败: city 为必填项" },
    { id: "TC-004", name: "无效 API Key", env: "test", status: "FAIL", latency: 30, lastRun: "2分钟前", error: "认证失败: API Key 无效" },
    { id: "TC-005", name: "获取东京天气 (边界)", env: "prod", status: "PASS", latency: 156, lastRun: "5分钟前" }
];

// Interface Test Run History
export const INTERFACE_TEST_HISTORY = [
    { runId: "RUN-20231027-001", trigger: "手动执行", caseCount: 15, successRate: 86.7, avgLatency: 105, startTime: "2023-10-27 10:25:00", user: "张三" },
    { runId: "RUN-20231026-002", trigger: "发布前校验", caseCount: 15, successRate: 100, avgLatency: 98, startTime: "2023-10-26 16:30:00", user: "System" },
    { runId: "RUN-20231025-001", trigger: "手动执行", caseCount: 12, successRate: 91.7, avgLatency: 110, startTime: "2023-10-25 09:15:00", user: "李四" }
];

// Affinity Test Cases
export const AFFINITY_TEST_CASES = [
    { id: "AC-001", prompt: "北京今天天气怎么样？", hit: true, status: "PASS", score: 5.0, paramFill: 100, callSuccess: true },
    { id: "AC-002", prompt: "我明天去上海出差，需要带伞吗？", hit: true, status: "PASS", score: 4.8, paramFill: 100, callSuccess: true },
    { id: "AC-003", prompt: "帮我查一下未来三天深圳的温度变化趋势", hit: true, status: "PASS", score: 4.5, paramFill: 80, callSuccess: true },
    { id: "AC-004", prompt: "给我讲个笑话", hit: false, status: "PASS", score: 5.0, paramFill: 0, callSuccess: false, reason: "正确拒绝-非天气查询" },
    { id: "AC-005", prompt: "天气预报", hit: true, status: "WARN", score: 3.5, paramFill: 50, callSuccess: true, reason: "缺少城市参数推断" }
];

// Affinity Test History
export const AFFINITY_TEST_HISTORY = [
    { runId: "AF-20231027-001", llmVersion: "GPT-4-Turbo", caseCount: 20, avgScore: 4.8, hitRate: 96, rounds: 3, startTime: "2023-10-27 10:00:00", user: "张三" },
    { runId: "AF-20231026-001", llmVersion: "GPT-4", caseCount: 20, avgScore: 4.6, hitRate: 94, rounds: 1, startTime: "2023-10-26 14:00:00", user: "李四" }
];
