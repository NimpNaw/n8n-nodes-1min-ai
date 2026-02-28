# 1min.AI API Capacities (Theory vs. Reality)

This document lists the features promised by the 1min.AI API for each model type, along with technical observations made during n8n integration.

---

## 1. Language Models (Chat & Text)
Used via the `/api/features` endpoint with the `CHAT_WITH_AI` type.

### 🟢 CONFIRMED Models (Tested & Functional)
These models respond correctly to standard chat requests via the 1min.AI API.

| Provider | Model | API Identifier | Characteristics & Strengths |
| :--- | :--- | :--- | :--- |
| **OpenAI** | GPT-4o | `gpt-4o` | **Most versatile**. Excellent balance of speed, intelligence, and complex instruction following. |
| **OpenAI** | GPT-4o Mini | `gpt-4o-mini` | **Ultra-fast and economical**. Ideal for simple tasks, classification, or short responses. |
| **OpenAI** | GPT-4 Turbo | `gpt-4-turbo` | **Robust**. Previous version of GPT-4, very reliable for code and logical reasoning. |
| **DeepSeek**| DeepSeek Chat | `deepseek-chat` | **High-performance alternative**. Excellent quality/price ratio. |
| **DeepSeek**| DeepSeek R1 | `deepseek-reasoner` | **Reasoning Specialist**. Uses "Chain of Thought" (CoT). Ideal for math, code, and complex logical problems. |
| **Mistral** | Mistral Large | `mistral-large-latest` | **Quality & Nuance**. French flagship model, excellent for high-quality writing and nuanced understanding. |

### ⚠️ WARNING: Hallucination Danger (Web Search)
Following intensive testing on February 27, 2026, regarding real-time sporting events, here are the behaviors observed when forcing Web Search activation via the 1min.AI API:

1. **OpenAI Models (GPT-4o, etc.)**: Maintain their internal safety filters and generally **refuse** to answer about immediate news, ignoring provided search data.
2. **DeepSeek (Chat & R1)**: Attempt to answer but mix real data with **major factual errors** (e.g., inventing Champions League matches).
3. **Mistral Large**: **VERY DANGEROUS**. Generates extremely detailed, structured, and credible lists of results (scores, scorers, rankings) that are **entirely invented**. 

**Conclusion:** For n8n, never rely on the `webSearch` option integrated into this API for factual data. Always use an external search node (Google Search, Serper, etc.).

### 🔴 UNSUPPORTED Models (Error 400)
These models, although advertised on the website, return an `UNSUPPORTED_MODEL` error when called via this specific Chat API endpoint.

- **Anthropic Claude**: `claude-3-5-sonnet`, `claude-3-opus`, `claude-3-haiku`.
- **Google Gemini**: `gemini-1.5-pro`, `gemini-1.5-flash`, `gemini-pro`.
- **Meta Llama**: `llama-3.1-70b`, `llama-3.1-405b`.

### Promised vs. Actual Capacities
| Feature | Description | Status (n8n Tests) |
| :--- | :--- | :--- |
| **Multi-Model** | Access to a wide range of AIs. | **PARTIAL**: Mainly limited to OpenAI, DeepSeek, and Mistral via the Chat API. |
| **Web Search** | Real-time internet search. | **⚠️ BROKEN**: The API does not correctly pass results to the model. Models (especially OpenAI) hallucinate responses. |
| **Conversation** | History management via `messages`. | **FUNCTIONAL** |
| **Vision** | Image analysis via `imageList`. | **❌ FAILED**: The API does not transmit the image to the model. The AI consistently claims it "cannot see images." |

---

## 2. Image Models
Used via the `TEXT_TO_IMAGE` type.

### Promised Capacities
- **Generation (Text-to-Image)**: ⚠️ **UNSTABLE**. Models like `dall-e-3` and `midjourney` are referenced but often return `UNSUPPORTED_MODEL` errors or require very specific fields.
- **Editing**: Upscaling, background removal. **NOT TESTED**.

---

## 3. Audio & Video Models
Used via `TEXT_TO_SPEECH`, `SPEECH_TO_TEXT`, or `TEXT_TO_VIDEO` types.

### Promised Capacities
- **Voice (TTS)**: ✅ **FUNCTIONAL**. Supports `tts-1` and `tts-1-hd`. Generates valid S3 URLs.
- **Transcription (STT)**: ⚠️ **UNSTABLE**. Supports `whisper-1`. Requires an audio URL. Recent tests returned 500 errors (Internal Server Error).
- **Video**: Clip generation (Luma, Kling). **NOT TESTED**.

---

## 4. Critical Technical Observations

### 1. Model Identifier Inconsistency
The API does not always accept "standard" model names. Stick to the confirmed list above.

### 2. The Web Search Issue
During tests on March 2026 cinema releases:
- Models claimed to search but **invented movie titles**.
- Injecting the current date helps the AI orient itself but doesn't fix the lack of real data from the aggregator.

### 3. The Vision Issue
Tests showed that even with models like GPT-4o:
- The `imageList` field is ignored by the 1min.AI API.
- The AI never receives the visual content of the provided URL.

### 4. Credits and Quotas
- Each request consumes credits proportional to the model size.
- `UNSUPPORTED_MODEL` errors do not appear to deduct credits.

---

## 5. Recommendations for n8n
For reliable use, it is recommended to:
1. Use this node strictly for **reasoning** and **synthesis**.
2. Delegate **fresh information retrieval** to native n8n nodes (Google Search, Serper, RSS).
3. Prioritize **OpenAI** models via 1min.AI, as they are the best supported by their Chat interface.
