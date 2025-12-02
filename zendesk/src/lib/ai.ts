/**
 * Integração com serviço de IA do backend para analisar tickets.
 */
import { api, ApiResponse } from "./api";

/** Payload de requisição para análise de ticket pela IA */
export type AiAnalyzeRequest = {
    title: string;
    description: string;
    doneActions?: string[];
    rejectedActions?: string[];
    priorSuggestions?: string[];
};

/** Resposta de análise com sugestões, departamento e confiança (quando aplicável) */
export type AiAnalyzeResponse = {
    suggestions: string[];
    predictedDepartmentId?: number | null;
    predictedDepartmentName?: string | null;
    confidence?: number | null;
    priorityHint?: string | null;
    rationale?: string | null;
    source?: string | null;
    nextAction?: string | null;
    followUpQuestions?: string[];
};

/** Envia título/descrição para a IA e retorna sugestões/insights */
export async function analyzeTicket(req: AiAnalyzeRequest): Promise<AiAnalyzeResponse> {
    const res = await api.post<ApiResponse<AiAnalyzeResponse>>("/ai/analyze", req);
    return res.data.data;
}
