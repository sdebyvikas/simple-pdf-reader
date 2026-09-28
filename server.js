import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import pdfParse from "pdf-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Multer Memory Storage (File ko disk par save karne ki bhi zaroorat nahi, direct RAM buffer se padhenge)
const upload = multer({ storage: multer.memoryStorage() });

// =========================================================================
// 🎯 PURE NON-AI PDF EXTRACTION API
// =========================================================================
app.post("/api/extract", upload.single("pdfFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Kripya ek PDF file select karein!" });
    }

    const startTime = Date.now();
    const fileBuffer = req.file.buffer; // RAM me byte buffer

    // 1. pdf-parse chala kar text decode karein (No AI needed)
    const pdfData = await pdfParse(fileBuffer);
    const text = pdfData.text || "";
    const executionTimeMs = Date.now() - startTime;

    // Generic PDF text extraction only.
    // User can extract any text from any PDF and use their own specific command or keywords later.
    res.json({
      success: true,
      fileName: req.file.originalname,
      fileSizeBytes: req.file.size,
      totalPages: pdfData.numpages,
      executionTimeMs,
      characterCount: text.length,
      wordCount: text.trim().split(/\s+/).filter(Boolean).length,
      rawText: text
    });

  } catch (err) {
    console.error("PDF Parsing Error:", err);
    res.status(500).json({
      success: false,
      error: "PDF read karne me error aayi: " + err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Simple PDF Reader App running at: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
