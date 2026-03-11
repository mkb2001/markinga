import Tesseract from "tesseract.js";

export interface OcrResult {
  text: string;
  confidence: number;
}

export async function processOcr(fileBuffer: Buffer): Promise<OcrResult> {
  const result = await Tesseract.recognize(fileBuffer, "eng", {
    logger: () => {},
  });

  const text = result.data.text.trim();
  const confidence = result.data.confidence;

  return { text, confidence };
}
