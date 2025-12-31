
async function ensureVisionLicense(env) {
  try {
    await env.AI.run(
      "@cf/meta/llama-3.2-11b-vision-instruct",
      { prompt: "agree" }
    );
  } catch (e) {
    // Ignore: already accepted or temporarily unavailable
  }
}

export default {
  async fetch(request, env) {
    await ensureVisionLicense(env);

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return new Response(
        "Use POST with JSON: { imageDataUrl }",
        { status: 400, headers }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON body", { status: 400, headers });
    }

    const { imageDataUrl } = body;

    if (
      !imageDataUrl ||
      typeof imageDataUrl !== "string" ||
      !imageDataUrl.startsWith("data:image")
    ) {
      return new Response(
        "Missing or invalid imageDataUrl",
        { status: 400, headers }
      );
    }

    try {
      /* ===============================
         1️⃣ ADVANCED STEM OCR
      =============================== */

      const ocrPrompt = `
Classify this image as one of:
- PHYSICS_DIAGRAM
- CHEMISTRY_DIAGRAM
- PURE_MATH
- TEXT_ONLY
Return only the label.

You are a PHYSICS OCR ENGINE, NOT A SOLVER.

ABSOLUTE RULES:
- DO NOT interpret meaning
- DO NOT infer physics
- DO NOT simplify
- DO NOT rename variables

SCAN THE IMAGE IN 4 PASSES:
PASS 1: Printed question text
PASS 2: Diagram objects
PASS 3: Diagram labels
PASS 4: Options (A–D)

Output format:
RAW_TEXT:
DIAGRAM_OBJECTS:
DIAGRAM_LABELS:
OPTIONS:

You are a CHEMISTRY MCQ STRUCTURE TRANSCRIBER.
Describe each option structure exactly as drawn.

You are a MATHEMATICAL OCR ENGINE.
Transcribe symbols exactly.

RAW_TEXT:
EQUATIONS:
`.trim();

      const ocrResult = await env.AI.run(
        "@cf/meta/llama-3.2-11b-vision-instruct",
        {
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: ocrPrompt },
                { type: "image_url", image_url: { url: imageDataUrl } }
              ]
            }
          ],
          temperature: 0,
          max_tokens: 2000
        }
      );

      const ocrText =
        typeof ocrResult?.response === "string"
          ? ocrResult.response.trim()
          : JSON.stringify(ocrResult);

      if (!ocrText) {
        return new Response("OCR failed", { status: 500, headers });
      }

      /* ===============================
         2️⃣ EXTRACT CLEAN QUESTION
      =============================== */

      const match = ocrText.match(/CLEAN_QUESTION:\s*([\s\S]*)$/i);
      const cleanQuestion = match ? match[1].trim() : ocrText;

      /* ===============================
         3️⃣ SOLVER
      =============================== */

      const solverPrompt = `
You are a UNIVERSAL STEM SOLVER.

MATH SAFETY RULES:
- Never expand (a ± b)^x unless x is a known integer.
- Verify identities by substitution.

PHYSICS SAFETY RULES:
- Magnetic field + conductor + resistance implies electromagnetic damping.

QUESTION:
${cleanQuestion}

DERIVATION STEPS:
Step 1:
$$ <governing equation> $$
Step 2:
$$ <definitions> $$
Step 3:
$$ <simplification> $$
Step 4:
$$ <required quantity> $$
Step 5:
$$ <substitution> $$

ANSWER:
Final Answer:
- Value with units
- If MCQ: Correct Option (A/B/C/D)
`.trim();

      const solutionResult = await env.AI.run(
        "@cf/meta/llama-3.1-70b-instruct",
        {
          messages: [{ role: "user", content: solverPrompt }],
          max_tokens: 1500,
          temperature: 0.1,
        }
      );

      const solution =
        typeof solutionResult?.response === "string"
          ? solutionResult.response.trim()
          : JSON.stringify(solutionResult);

      return new Response(
        JSON.stringify(
          {
            ocr_full: ocrText,
            clean_question: cleanQuestion,
            solution,
          },
          null,
          2
        ),
        {
          status: 200,
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      return new Response(
        "Server error: " + err.message,
        { status: 500, headers }
      );
    }
  },
};
