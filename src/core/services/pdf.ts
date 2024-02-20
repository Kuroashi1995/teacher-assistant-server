const fs = require("fs");
const fsp = fs.promises;
const { mdToPdf } = require("md-to-pdf");

export class PdfService {
  static async createPdfFromMarkdown({
    mdContent,
    pdfPath,
  }: {
    mdContent: string;
    pdfPath: string;
  }) {
    try {
      await mdToPdf({ content: mdContent }, { dest: pdfPath });
      return true;
    } catch (e) {
      throw new Error(`Cannot create pdf: ${e}`);
    }
  }

  static async deletePdf({ pdfPath }: { pdfPath: string }) {
    try {
      await fsp.unlink(pdfPath);
    } catch (e) {
      throw new Error(`Could not delete file: ${e}`);
    }
  }
}
