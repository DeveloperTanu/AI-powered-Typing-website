from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from langchain_mistralai import ChatMistralAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from dotenv import load_dotenv
from pathlib import Path
import random
import uvicorn

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI()

templates = Jinja2Templates(
    directory=str(BASE_DIR / "templates")
)

app.mount(
    "/src",
    StaticFiles(directory=str(BASE_DIR / "src")),
    name="src"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = ChatMistralAI(
    model="mistral-small-2506",
    temperature=0.9
)

parser = StrOutputParser()

prompt = ChatPromptTemplate.from_messages([
    ("system", """
Generate exactly ONE typing practice sentence about {topic}.

Rules:
- 25 to 60 characters.
- Complete sentence.
- Easy English.
- No quotes.
- No numbering.
- No emojis.
- No explanation.
- Do NOT mention cats.
- Do NOT mention dogs.
- Avoid animals completely.
- Make every response different.

Random seed: {seed}
""")
])

chain = prompt | model | parser


@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )


@app.get("/generate-text")
def generate_text():
    seed = random.randint(1, 1_000_000)

    topics = [
        "coding",
        "music",
        "space",
        "rain",
        "books",
        "travel",
        "food",
        "design",
        "games",
        "dreams",
        "mountains",
        "coffee",
        "learning",
        "technology",
        "cities",
        "creativity",
        "morning",
        "ocean",
    ]

    topic = random.choice(topics)

    sentence = chain.invoke({
        "seed": seed,
        "topic": topic
    }).strip()

    return JSONResponse(
        content={
            "text": sentence,
            "topic": topic
        },
        headers={"Cache-Control": "no-store"}
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )