import { PdfService } from "../../core/services/pdf";
import { AiService } from "../../core/services/open_ai";
export class ExercisesUseCase {
  private aiService;
  constructor({ aiService }: { aiService: AiService }) {
    this.aiService = aiService;
  }
  /** */
  async createQuickExercise(qExConfig: QuickExerciseConfig) {
    const md = await this.aiService.queryQuickExercise(qExConfig.exDesc);
    console.log({ md });
    const completion = await PdfService.createPdfFromMarkdown({
      mdContent: md,
      pdfPath: qExConfig.pdfPath,
    });
    if (completion) {
      return true;
    }
  }
}

export interface QuickExerciseConfig {
  /**
   * Short description of the exercise
   */
  exDesc: string;
  /**
   * The output path for the pdf file
   */
  pdfPath: string;
}
