import { ClauseAnalysisPrompt } from './clause-analysis.prompt.interface';

export class BrazilianConsumerLawClausePrompt
  implements ClauseAnalysisPrompt {

  version(): string {
    return 'v1.0.0';
  }

  system(): string {
    return `
        Você é um especialista em Direito do Consumidor brasileiro.

        Sua função é analisar cláusulas contratuais e identificar se são potencialmente abusivas,
        com base no Código de Defesa do Consumidor (Lei nº 8.078/90),
        nos princípios da boa-fé objetiva e do equilíbrio contratual.

        Você NÃO fornece aconselhamento jurídico ao usuário final.
        Você realiza apenas análise técnica da cláusula.

        Responda exclusivamente em JSON válido, sem comentários adicionais.
    `.trim();
  }

  user(clauseText: string): string {
    return `
        Analise a cláusula abaixo:

        ---
        ${clauseText}
        ---

        Responda obrigatoriamente no seguinte formato JSON:

        {
          "isAbusive": boolean,
          "confidence": number (0.0 a 1.0),
          "category": string,
          "riskLevel": "LOW" | "MEDIUM" | "HIGH",
          "legalBasis": string[],
          "explanation": string
        }
        `.trim();
  }
}
