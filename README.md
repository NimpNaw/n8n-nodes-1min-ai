# n8n-nodes-1min-ai

> Custom n8n node for [1min.AI](https://1min.ai) — access GPT-4o, Claude, Gemini, Llama, DeepSeek and more through a **single API key**, fully compatible with the **n8n AI Agent** node.

---

## Features

- **One API key, 20+ models** — GPT-4o, GPT-4.1, Claude 3.5 Sonnet, Gemini 2.0 Flash, Llama 3.3, DeepSeek R1, Grok 2, Mistral, Perplexity Sonar…
- **AI Agent compatible** — works as a language model sub-node for the n8n AI Agent, Basic LLM Chain, Summarization Chain, and all other LangChain root nodes
- **Conversation history** — passes full message history to the model automatically
- **Optional web search** — let the model browse the web for real-time information
- **Secure credentials** — API key stored once in n8n credentials, never exposed in workflows

---

## Supported Models

| Provider | Model | Value |
|---|---|---|
| OpenAI | GPT-4o | `gpt-4o` |
| OpenAI | GPT-4o Mini | `gpt-4o-mini` |
| OpenAI | GPT-4.1 | `gpt-4.1` |
| OpenAI | GPT-4.1 Mini | `gpt-4.1-mini` |
| OpenAI | GPT-4 Turbo | `gpt-4-turbo` |
| OpenAI | GPT-3.5 Turbo | `gpt-3.5-turbo` |
| Anthropic | Claude 3.5 Sonnet | `claude-3-5-sonnet-20241022` |
| Anthropic | Claude 3.5 Haiku | `claude-3-5-haiku-20241022` |
| Anthropic | Claude 3 Opus | `claude-3-opus-20240229` |
| Google | Gemini 2.0 Flash | `gemini-2.0-flash` |
| Google | Gemini 1.5 Pro | `gemini-1.5-pro` |
| Google | Gemini 1.5 Flash | `gemini-1.5-flash` |
| Meta | Llama 3.3 70B | `meta-llama/Llama-3.3-70B-Instruct-Turbo` |
| Meta | Llama 3.1 405B | `meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo` |
| Mistral | Mistral Large | `mistral-large-latest` |
| Mistral | Mistral Nemo | `mistral-nemo` |
| DeepSeek | DeepSeek Chat | `deepseek-chat` |
| DeepSeek | DeepSeek R1 | `deepseek-reasoner` |
| xAI | Grok 2 | `grok-2` |
| Perplexity | Sonar (web search) | `llama-3.1-sonar-large-128k-online` |

> The complete list of models supported by 1min.AI is available at [1min.ai](https://1min.ai).

---

## Installation

### Option 1 — npm (recommended for production)

```bash
npm install n8n-nodes-1min-ai
```

In your n8n `docker-compose.yml` or environment, add the package to `N8N_CUSTOM_EXTENSIONS` or install it via the n8n GUI under **Settings → Community Nodes**.

### Option 2 — Self-hosted n8n via Docker

This is the recommended method if you run n8n with Docker or Docker Compose.

**Step 1 — Find your container name**

```bash
docker ps | grep n8n
```

**Step 2 — Install the node inside the running container**

```bash
docker exec -it <your_n8n_container_name> sh
```

Inside the container:

```sh
# Go to the n8n custom nodes directory
cd /home/node/.n8n
mkdir -p custom
cd custom

# Initialize if needed
[ -f package.json ] || npm init -y

# Install directly from GitHub
npm install https://github.com/NimpNaw/n8n-nodes-1min-ai

exit
```

**Step 3 — Restart the container**

```bash
docker restart <your_n8n_container_name>
```

The **1min.AI Chat Model** node will appear in n8n after the restart.

> **Tip:** To persist the node across container recreations, add the volume to your `docker-compose.yml`:
> ```yaml
> services:
>   n8n:
>     environment:
>       - N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
>     volumes:
>       - n8n_data:/home/node/.n8n
> ```

### Option 3 — Manual (bare-metal / development)

```bash
# 1. Clone the repo
git clone https://github.com/NimpNaw/n8n-nodes-1min-ai.git
cd n8n-nodes-1min-ai

# 2. Install dependencies and build
npm install
npm run build

# 3. Link to your local n8n installation
npm link
cd ~/.n8n/custom   # or wherever your n8n custom nodes live
npm link n8n-nodes-1min-ai
```

Then restart n8n.

---

## Configuration

### 1. Add credentials

1. In n8n, go to **Credentials → New Credential**
2. Search for **1min.AI API**
3. Paste your API key from [app.1min.ai → Settings → API](https://app.1min.ai)
4. Click **Save & Test** — n8n will validate the key against the API

### 2. Use in a workflow

#### With the AI Agent node

```
┌─────────────────┐        ┌──────────────────────┐
│   AI Agent      │◄───────│  1min.AI Chat Model   │
│  (root node)    │ Model  │  (sub-node)            │
└─────────────────┘        └──────────────────────┘
```

1. Add an **AI Agent** node to your workflow
2. Under the AI Agent, click **+** on the **Model** connection
3. Select **1min.AI Chat Model**
4. Choose your credentials and model
5. (Optional) Configure Temperature, Max Tokens, Web Search

#### With Basic LLM Chain

Same as above — the 1min.AI Chat Model node connects to any LangChain root node that accepts a language model.

---

## Node Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| **Model** | Select | `gpt-4o-mini` | The AI model to use |
| **Max Tokens** | Number | `2048` | Maximum words in the response |
| **Temperature** | Number (0–1) | `0.7` | Randomness: 0 = deterministic, 1 = creative |
| **Web Search** | Boolean | `false` | Allow the model to browse the web |
| **Number of Sites** | Number (1–10) | `3` | Web pages to consult (only when Web Search = true) |

---

## API Reference

This node uses the [1min.AI Features API](https://docs.1min.ai/docs/api/intro):

```
POST https://api.1min.ai/api/features
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "type": "CHAT_WITH_AI",
  "model": "gpt-4o-mini",
  "promptObject": {
    "prompt": "Your message here",
    "isMixed": false,
    "imageList": [],
    "webSearch": false,
    "numOfSite": 3,
    "maxWord": 2048,
    "messages": [
      { "role": "user", "content": "Previous message" },
      { "role": "assistant", "content": "Previous response" }
    ]
  }
}
```

---

## Development

```bash
# Clone
git clone https://github.com/NimpNaw/n8n-nodes-1min-ai.git
cd n8n-nodes-1min-ai

# Install
npm install

# Build (TypeScript → dist/)
npm run build

# Watch mode
npm run dev

# Lint
npm run lint
npm run lintfix
```

### Project Structure

```
n8n-nodes-1min-ai/
├── credentials/
│   └── MinAiApi.credentials.ts   # 1min.AI API key credential
├── nodes/
│   └── LmChat1MinAi/
│       ├── LmChat1MinAi.node.ts  # n8n node definition (ISupplyData)
│       ├── MinAiChatModel.ts     # LangChain BaseChatModel implementation
│       └── 1minai.svg            # Node icon
├── index.ts                      # Package exports
├── package.json
├── tsconfig.json
└── README.md
```

### Architecture

The node implements the `ISupplyData` interface from `n8n-workflow`, which is how n8n sub-nodes (like language models, memory, tools) expose themselves to root nodes (like AI Agent).

`MinAiChatModel` extends `@langchain/core`'s `BaseChatModel`, making it a first-class citizen of the LangChain ecosystem used internally by n8n's AI nodes.

```
n8n AI Agent
    │
    │  NodeConnectionType.AiLanguageModel
    ▼
LmChat1MinAi.node.ts   (supplyData → returns MinAiChatModel instance)
    │
    ▼
MinAiChatModel.ts      (extends BaseChatModel → calls 1min.AI REST API)
    │
    ▼
https://api.1min.ai/api/features
```

---

## Troubleshooting

### "401 Unauthorized"
Your API key is invalid or expired. Regenerate it at [app.1min.ai](https://app.1min.ai) → Settings → API.

### "400 Bad Request — model should not be empty"
The model value is missing. Make sure a model is selected in the node parameters.

### Node not appearing in n8n
- Ensure the package is installed and n8n has been restarted
- Check that `dist/` exists (run `npm run build`)
- Verify the `n8n` section in `package.json` points to the correct dist paths

### Response format error
The 1min.AI API response format may change. Open an [issue](https://github.com/NimpNaw/n8n-nodes-1min-ai/issues) with the raw API response.

---

## Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes
4. Push and open a PR

---

## License

MIT © NimpNaw

---

## Links

- [1min.AI website](https://1min.ai)
- [1min.AI API documentation](https://docs.1min.ai)
- [n8n documentation](https://docs.n8n.io)
- [n8n community nodes guide](https://docs.n8n.io/integrations/creating-nodes/)
