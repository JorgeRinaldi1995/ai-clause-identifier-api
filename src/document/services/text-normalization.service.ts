import { Injectable } from '@nestjs/common';

@Injectable()
export class TextNormalizationService {

  normalize(rawText: string): string {
    let text = rawText;

    text = this.basicCleanup(text);
    text = this.fixHyphenation(text);
    text = this.normalizeWhitespace(text);
    text = this.normalizePunctuation(text);
    text = this.normalizeClauses(text);
    text = this.normalizeLegalTerms(text);
    text = this.removeNoise(text);

    return text.trim();
  }

  /**
   * Remove caracteres invisíveis, espaços duplicados e quebras estranhas
   */
  private basicCleanup(text: string): string {
    return text
      .replace(/\r/g, '')
      .replace(/\u00A0/g, ' ') // non-breaking space
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n');
  }

  /**
   * Corrige palavras quebradas por hífen no fim da linha
   * Ex: "indeniza-\nção" → "indenização"
   */
  private fixHyphenation(text: string): string {
    return text.replace(/(\w+)-\n(\w+)/g, '$1$2');
  }

  /**
   * Normaliza espaçamento após OCR
   */
  private normalizeWhitespace(text: string): string {
    return text
      .replace(/\s+([,.;:])/g, '$1')
      .replace(/([,.;:])([^\s])/g, '$1 $2')
      .replace(/\s*\n\s*/g, '\n');
  }

  /**
   * Padroniza pontuação e travessões
   */
  private normalizePunctuation(text: string): string {
    return text
      .replace(/\s*-\s*/g, ' – ')
      .replace(/“|”/g, '"')
      .replace(/‘|’/g, "'");
  }

  /**
   * Padroniza referências jurídicas comuns
   */
  private normalizeClauses(text: string): string {
    return text
      .replace(/cl[aá]usula\s*(\d+)/gi, 'Cláusula $1')
      .replace(/art\.?\s*(\d+)/gi, 'Art. $1')
      .replace(/§\s*(\d+)/g, '§$1');
  }

  /**
   * Normaliza expressões jurídicas semanticamente equivalentes
   */
  private normalizeLegalTerms(text: string): string {
    const replacements: Record<string, string> = {
      'renúncia de direitos': 'renúncia a direitos',
      'não será responsável': 'não se responsabiliza',
      'isenta-se de qualquer responsabilidade': 'exonera-se de responsabilidade',
      'fica isento de responsabilidade': 'exonera-se de responsabilidade',
    };

    for (const [from, to] of Object.entries(replacements)) {
      const regex = new RegExp(from, 'gi');
      text = text.replace(regex, to);
    }

    return text;
  }

  /**
   * Remove ruídos comuns de PDF jurídico
   */
  private removeNoise(text: string): string {
    return text.replace(
      /(p[aá]gina\s*\d+|documento assinado eletronicamente.*)$/gim,
      ''
    );
  }

  /**
   * Divide o texto por cláusulas (ideal para embeddings)
   */
  chunkByClauses(text: string): { clause: string; text: string }[] {
    return text
      .split(/(?=Cláusula\s+\d+)/g)
      .map(chunk => {
        const match = chunk.match(/Cláusula\s+\d+/);
        return {
          clause: match?.[0] ?? 'Desconhecida',
          text: chunk.trim(),
        };
      })
      .filter(c => c.text.length > 50);
  }
}
