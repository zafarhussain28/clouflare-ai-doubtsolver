# STEM Solver AI — AI-Powered STEM Question Solver

An open-source AI-powered STEM question-solving system that transforms images of mathematical, physics, and chemistry questions into structured text and AI-generated solutions.

Upload a question image, and the system uses computer vision and large language models to extract the question and generate a step-by-step explanation.

**Live Demo: https://clouflare-ai-doubtsolver.vercel.app/

**Source Code: https://github.com/zafarhussain28/clouflare-ai-doubtsolver

---

## What Is STEM Solver AI?

STEM Solver AI is a reusable AI-powered question-solving system designed for educational platforms, learning management systems, online examination applications, and other educational software.

It accepts an image containing a STEM question and processes it through two AI stages:

1. **Vision AI — Question Extraction:** Analyzes the uploaded image and extracts the question, equations, mathematical expressions, diagram descriptions, labels, and answer options.
2. **LLM — Solution Generation:** Processes the extracted question and generates a structured explanation and solution.

The backend is implemented using Cloudflare Workers AI, making it possible to integrate the question-solving functionality into applications without hosting your own AI inference server.

The Worker backend source code is included in this repository so developers can deploy and customize their own API.

## Live Demo

Try the deployed application:

**https://clouflare-ai-doubtsolver.vercel.app/**

Upload a question image and test the complete image-to-solution workflow.

The live demo uses the project's deployed backend. For your own application or production deployment, follow the instructions below to deploy your own Worker and use your own API endpoint.

---

## How Does It Work?

```text
        User uploads a question image
                    |
                    v
             React Frontend
                    |
                    v
          Cloudflare Worker API
                    |
                    v
          Vision AI Model (OCR)
                    |
                    v
          Extracted STEM Question
                    |
                    v
            LLM Solver Model
                    |
                    v
          Structured AI Solution
                    |
                    v
             Frontend Display
```

### Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| Backend | Cloudflare Workers |
| AI Infrastructure | Cloudflare Workers AI |
| Vision Model | Llama 3.2 11B Vision Instruct |
| Solution Model | Llama 3.1 70B Instruct |
| API Communication | REST API |
| Deployment | Vercel + Cloudflare Workers |

## Key Features

- Image-based STEM question input.
- AI-powered question extraction using a vision-language model.
- Extraction of mathematical expressions, equations, and diagram information.
- AI-generated question solutions and explanations.
- REST API that can be integrated into external applications.
- Serverless backend using Cloudflare Workers.
- React-based responsive interface.
- Open-source backend implementation that developers can customize.

## Why Is This Useful for Other Applications?

You can use this project as an AI question-solving backend for:

- **EdTech platforms:** Allow students to upload questions and receive explanations.
- **Learning Management Systems:** Add image-based question-solving functionality to existing learning portals.
- **Online tutoring applications:** Help tutors and students analyze STEM questions.
- **Educational chatbots:** Give chatbots the ability to understand questions submitted as images.
- **Exam preparation platforms:** Add AI-powered question analysis to practice and revision tools.
- **Custom AI applications:** Reuse the API as a foundation for your own AI-powered educational features.

Instead of building the complete image-processing and AI-inference pipeline from scratch, developers can deploy the Worker and connect their application to its REST API.

---

# Getting Started

There are two ways to use this project:

1. Run the complete frontend and backend locally.
2. Deploy your own backend and integrate its API into an existing application.

## 1. Clone the Repository

```bash
git clone https://github.com/zafarhussain28/clouflare-ai-doubtsolver.git

cd clouflare-ai-doubtsolver
```

## 2. Set Up the Frontend

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_URL=https://YOUR-WORKER-NAME.YOUR-SUBDOMAIN.workers.dev/
```

Replace the URL with your own deployed Cloudflare Worker endpoint.

Start the development server:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

The production build is generated inside the `dist/` directory.

---

# Deploy Your Own AI Backend

The repository includes the Cloudflare Worker source code in `woker.js`.

You can use this code to deploy your own question-solving API.

### Prerequisites

- A Cloudflare account.
- Access to Cloudflare Workers.
- Workers AI enabled for your account.
- Basic knowledge of JavaScript and REST APIs.

### Step 1: Create a Cloudflare Worker

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages**.
3. Create a new Worker.
4. Open its code editor.

### Step 2: Add the Worker Source Code

Open `woker.js` from this repository.

Copy its implementation into your Cloudflare Worker's editor.

The Worker contains the backend logic for:

- Receiving image data through HTTP POST requests.
- Processing images with the Vision AI model.
- Extracting the question content.
- Sending the extracted question to the solution model.
- Returning the result as JSON.

### Step 3: Configure the Workers AI Binding

Your Worker requires access to Cloudflare Workers AI.

In your Cloudflare Worker:

1. Open **Settings**.
2. Navigate to **Bindings**.
3. Add a **Workers AI** binding.
4. Set the variable name to:

```text
AI
```

The binding name must match the code's `env.AI` reference.

Official documentation: [Cloudflare Workers AI Bindings](https://developers.cloudflare.com/workers/configuration/bindings/).

### Step 4: Deploy the Worker

Save and deploy your Worker.

Cloudflare will provide a Worker URL similar to:

```text
https://your-worker-name.your-subdomain.workers.dev/
```

This is your backend API endpoint.

**Important:** The deployed Worker uses your Cloudflare account's AI resources and usage limits. Review Cloudflare's current Workers AI pricing and usage policies before production use.

---

# Integrate the API Into Your Own Application

Once your Worker is deployed, you can connect it to any application that supports HTTP requests.

The API does not require you to use the React frontend included in this repository.

You can integrate it into:

- React applications
- Next.js applications
- Vue applications
- Angular applications
- Mobile applications
- Existing educational platforms
- Other backend services

## API Reference

### Endpoint

```http
POST YOUR_WORKER_URL
```

### Request Headers

```http
Content-Type: application/json
```

### Request Body

The API accepts an image encoded as a Base64 Data URL.

```json
{
  "imageDataUrl": "data:image/png;base64,YOUR_BASE64_IMAGE_DATA"
}
```

Supported image formats in the provided frontend:

- PNG
- JPG / JPEG
- WEBP

The frontend currently limits images to 5 MB. The Worker and any custom client should also enforce appropriate request-size limits.

### Example: JavaScript Integration

You can call the API from your own application using the Fetch API:

```javascript
async function solveSTEMQuestion(imageDataUrl) {
  const response = await fetch("YOUR_WORKER_URL", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      imageDataUrl
    })
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const result = await response.json();

  return result;
}
```

### Example: Using an Uploaded Image in a Browser

```javascript
function convertImageToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}
```

Usage:

```javascript
const imageDataUrl = await convertImageToDataURL(file);

const result = await solveSTEMQuestion(imageDataUrl);

console.log("Extracted Question:", result.clean_question);
console.log("OCR Output:", result.ocr_full);
console.log("AI Solution:", result.solution);
```

## API Response

A successful request returns a JSON response with three fields:

```json
{
  "ocr_full": "Complete output generated by the vision model",
  "clean_question": "Extracted STEM question",
  "solution": "AI-generated step-by-step solution"
}
```

| Field | Description |
|---|---|
| `ocr_full` | Full vision-model extraction output. |
| `clean_question` | Extracted question content prepared for the solver. |
| `solution` | Solution generated by the LLM. |

Your frontend can use these fields to display the extracted question and its solution separately.

---

# Deploy the Frontend

You can deploy the included React frontend independently of the Worker backend.

### Deploy with Vercel

1. Push the repository to GitHub.
2. Open [Vercel](https://vercel.com/).
3. Import the repository.
4. Select **Vite** as the framework preset.
5. Configure the following settings:

| Setting | Value |
|---|---|
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

6. Add the environment variable:

```env
VITE_API_URL=YOUR_DEPLOYED_WORKER_URL
```

7. Deploy the project.

Your frontend will now communicate with your own Cloudflare Worker.

---

# Customization and Extension

The backend source code is available for developers who want to customize the implementation.

Possible extensions include:

- Supporting additional AI models.
- Improving mathematical OCR accuracy.
- Adding subject-specific solution prompts.
- Supporting additional image formats.
- Returning structured solution steps.
- Integrating authentication and user-specific quotas.
- Adding rate limiting and request validation.
- Connecting the API to existing educational platforms.
- Building mobile applications around the API.

You can modify the Worker implementation to suit your application's requirements.

## Security and Production Considerations

Before using the API in a production application:

- Deploy your own Worker instead of relying on the public demo endpoint.
- Configure appropriate rate limiting and request-size limits.
- Restrict CORS to trusted application origins where appropriate.
- Add authentication and usage quotas if your application requires them.
- Avoid exposing private credentials or API tokens in frontend code.
- Handle AI usage costs and service limits.
- Validate uploaded files and API responses.
- Add monitoring and error handling.

The included implementation is a starting point. Production security and operational requirements should be evaluated for your particular application.

---

# Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork this repository.
2. Create a new branch.
3. Make your changes.
4. Test your implementation.
5. Submit a pull request.

---

# Author

**Zafar Hussain**

GitHub: https://github.com/zafarhussain28

If you find this project useful, consider giving the repository a star.

---

**STEM Solver AI — Making AI-powered STEM question solving easier to integrate into educational applications.**
