# 🎨 Pixora AI

> A conversational AI assistant with on-demand AI image generation, built on n8n.

**Created by:** Arihant Pratap Singh — VIT Vellore

---

## 🧠 What is Pixora AI?

Pixora AI is an intelligent chatbot that combines natural conversation (powered by Google Gemini) with AI image generation (powered by Cloudflare Workers AI — Flux Schnell). Users can chat normally, and whenever they request an image, Pixora generates it and delivers a shareable link — all within the same chat interface.

working link - https://pixora-image-gen.lovable.app 

---

## ✨ Features

- 💬 **Natural Conversation** — Responds to any question or message conversationally
- 🖼️ **AI Image Generation** — Generates images from text prompts using Flux Schnell
- ☁️ **Auto Cloud Storage** — Images are automatically uploaded to Google Drive and shared publicly
- 🔗 **Instant Links** — Returns a thumbnail preview and a direct download link
- 🛡️ **Size Validation** — Rejects requests exceeding 1 megapixel (1024×1024) to prevent API errors

---

## 🏗️ Architecture
<img width="1790" height="847" alt="image" src="https://github.com/user-attachments/assets/bc7f65c8-2118-4e17-b29f-4d8666eb977d" />



Pixora AI runs on two n8n workflows:

### 1. Main Workflow
```
Chat Trigger → Edit Fields → AI Agent (Gemini) → [Tool: Subworkflow]
```

| Node | Role |
|---|---|
| **Chat Trigger** | Receives user messages via public webhook |
| **Edit Fields** | Maps incoming message to `chatInput` |
| **AI Agent** | Gemini-powered agent; decides whether to call image tool or respond in text |
| **Subworkflow Tool** | Called only when image generation is requested |

### 2. Image Generation Subworkflow
```
Trigger → Setup → Size Check → Cloudflare API → Convert to File → Google Drive Upload → Share → Return Links
```

| Node | Role |
|---|---|
| **Setup Workflow** | Sets defaults (1024×1024, random seed, 4 steps) |
| **Check Image Size** | Blocks requests > 1 megapixel |
| **Get Accounts** | Fetches Cloudflare Account ID dynamically |
| **Get Flux Schnell Image** | Calls Cloudflare Workers AI to generate the image |
| **Convert to File** | Converts base64 result to binary file |
| **Upload File** | Uploads to a designated Google Drive folder |
| **Share File** | Sets public read permissions |
| **Edit Fields** | Returns `thumbnailLink` and `webContentLink` to main workflow |

---

## 🔧 Tech Stack

| Component | Technology |
|---|---|
| Workflow Automation | [n8n](https://n8n.io) |
| LLM / Chat | Google Gemini (via n8n LangChain node) |
| Image Generation | Cloudflare Workers AI — `flux-1-schnell` |
| File Storage | Google Drive |
| Interface | n8n Public Chat Widget |

---

## 🚀 Setup Guide

### Prerequisites
- n8n instance (cloud or self-hosted)
- Cloudflare account with Workers AI enabled
- Google account with Drive API access

### Steps

1. **Import both workflows** into your n8n instance.

2. **Configure Cloudflare credentials**
   - Create a Cloudflare API token with permissions:
     - `Accounts → Account Settings (Read)`
     - `Workers AI (Edit)`
   - Add it as a **Bearer Auth** credential in n8n.

3. **Configure Google Drive credentials**
   - Set up Google Drive OAuth2 in n8n.
   - Update the **Upload File** node with your target folder ID.

4. **Activate both workflows** — subworkflow first, then the main workflow.

5. **Share the chat link** from the Chat Trigger node.

---

## 💬 Usage Examples

| User Input | Pixora Response |
|---|---|
| `"What is machine learning?"` | Answers conversationally, no image generated |
| `"Generate an image of a sunset over mountains"` | Generates and returns image link |
| `"Give me a picture of a cyberpunk city at night"` | Generates and returns image link |
| `"Who made you?"` | *"I was created by Arihant Pratap Singh, student at VIT Vellore"* |

---

## ⚠️ Limitations

- Max image size: **1024 × 1024 px** (1 megapixel)
- Image generation uses Cloudflare's free-tier Workers AI quota
- Response time depends on Cloudflare and Google Drive API latency

---

## 📁 Project Structure

```
pixora-ai/
├── main-workflow.json        # AI Agent + Chat Trigger
└── subworkflow-flux.json     # Image generation pipeline
```

---

*Built with ❤️ using n8n, Cloudflare Workers AI, and Google Gemini*
