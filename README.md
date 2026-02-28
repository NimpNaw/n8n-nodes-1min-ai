# n8n-nodes-1min-ai

> Custom n8n nodes for [1min.AI](https://1min.ai) — access GPT-4o, DeepSeek R1, Mistral, Text-to-Speech and Image Generation through a **single API key**, fully compatible with the **n8n AI Agent**.

---

## Features

- **Multi-Model Chat** — Premium models like GPT-4o, DeepSeek R1 (Reasoner), and Mistral Large.
- **AI Agent Compatible** — Use 1min.AI as a language model sub-node for any LangChain root node.
- **Audio Suite** — High-quality Text-to-Speech (TTS) and Speech-to-Text (STT) via Whisper and OpenAI models.
- **Image Generation** — Support for DALL-E 3, Midjourney, and Stable Diffusion.
- **Optimized for Stability** — Models and options are pre-filtered based on confirmed API compatibility.
- **Detailed Capacity Map** — Check real-world test results in [1minapi_capacity.md](./1minapi_capacity.md).

---

## Included Nodes

### 1. 1min.AI Chat Model (Sub-node)
Connects to the **AI Agent** or **Basic LLM Chain**.
- **Confirmed Models**: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `deepseek-chat`, `deepseek-reasoner`, `mistral-large-latest`.
- **Supports Tool Calling**: Fully compatible with "Tools Agent" mode.

### 2. 1min.AI Audio (Action node)
- **Text-to-Speech**: Convert text to MP3 using OpenAI `tts-1` models.
- **Speech-to-Text**: Transcribe audio URLs using `whisper-1`.

### 3. 1min.AI Image (Action node)
- **Text-to-Image**: Generate visuals using `dall-e-3`, `midjourney`, or `flux-pro`.
- *Note: Image generation is currently marked as unstable in the API. Check the capacity map.*

---

## Installation

### Self-hosted n8n (Docker)

```bash
docker exec -it <your_n8n_container_name> sh
```

Inside the container:

```sh
# Go to custom nodes directory
cd /home/node/.n8n/custom
rm -rf node_modules
npm cache clean --force

# Install from GitHub
npm install https://github.com/NimpNaw/n8n-nodes-1min-ai

# Force build (if needed)
cd node_modules/n8n-nodes-1min-ai && npm run build

exit
```

**Restart the container** to apply changes:
```bash
docker restart <your_n8n_container_name>
```

---

## Configuration

1. In n8n, go to **Credentials → New Credential**.
2. Search for **1min.AI API**.
3. Paste your API key from [app.1min.ai → Settings → API](https://app.1min.ai).
4. Save and start building!

---

## Troubleshooting

### "401 Unauthorized"
Your API key is invalid or expired. Regenerate it at [app.1min.ai](https://app.1min.ai).

### "Node type unknown" or "Node not recognized"
Ensure you have run `npm run build` inside the node folder and restarted n8n. Use the "clean install" procedure mentioned in the Installation section.

### "Model not supported"
You are trying to use a model that is not enabled for your specific API key or the selected feature. Stick to the confirmed models list or check [1minapi_capacity.md](./1minapi_capacity.md).

---

## License

MIT © NimpNaw
