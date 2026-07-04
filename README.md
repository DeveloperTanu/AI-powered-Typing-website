# AI-Powered Typing Website

An AI-powered typing practice application that generates unique typing exercises using Mistral AI. Each session provides fresh sentences to help improve typing speed and accuracy.

## Live Demo

https://ai-powered-typing-website.onrender.com/

## Features

- AI-generated typing sentences
- Interactive on-screen keyboard
- Real-time key highlighting
- Backspace support
- Reload for new typing challenges
- Responsive and minimal interface

## Tech Stack

- FastAPI
- JavaScript
- Tailwind CSS
- LangChain
- Mistral AI

## Run Locally

```bash
git clone https://github.com/DeveloperTanu/AI-powered-Typing-website.git
cd AI-powered-Typing-website

pip install -r requirements.txt
uvicorn main:app --reload
```

Create a `.env` file and add your Mistral API key:

```env
MISTRAL_API_KEY=your_api_key
```

## License

This project is open source and available under the MIT License.
