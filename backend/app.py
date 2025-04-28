from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from googletrans import Translator
import sys
import os
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../neural-machine-translation')))

# Import seq2seq components after path adjustment
from models.encoder import Encoder
from models.attention import Attention
from models.decoder import Decoder
from models.seq2seq import Seq2Seq
from scripts.dataset import TranslationDataset
from scripts.inference_beam_eval import translate_sentence_beam

translator = Translator()

if torch.cuda.is_available():
    device = torch.device("cuda")
elif getattr(torch.backends, "mps", None) is not None and torch.backends.mps.is_available():
    device = torch.device("mps")
else:
    device = torch.device("cpu")

print(f"Using device: {device}")

CHECKPOINT = "../../checkpoint/test2"
tokenizer = AutoTokenizer.from_pretrained(CHECKPOINT)
model = AutoModelForSeq2SeqLM.from_pretrained(CHECKPOINT).to(device)
model.eval()

NMT_ROOT = "../../neural-machine-translation"
TRAIN_DATA_PATH = os.path.join(NMT_ROOT, "data/processed/train.csv")
SEQ2SEQ_CHECKPOINT = os.path.join(NMT_ROOT, "checkpoints/seq2seq_fulldata_best_bleu_20250427-000059.pt")


try:
    dataset = TranslationDataset(TRAIN_DATA_PATH)
    en_vocab = dataset.en_vocab
    fr_vocab = dataset.fr_vocab

    attn = Attention(512, 512)
    encoder = Encoder(len(en_vocab), 256, 512, 1, 0.5)
    decoder = Decoder(len(fr_vocab), 256, 512, 1, 0.5, attn)
    seq2seq_model = Seq2Seq(encoder, decoder, device).to(device)

    # Load checkpoint
    seq2seq_model.load_state_dict(torch.load(SEQ2SEQ_CHECKPOINT, map_location=device))
    seq2seq_model.eval()
    seq2seq_loaded = True
    print("Seq2Seq model loaded successfully")
except Exception as e:
    print(f"Error loading Seq2Seq model: {e}")
    seq2seq_loaded = False

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="Machine Translation API",
    description="API for machine translation services",
    version="1.0.0"
)

# Add rate limit exceeded handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HealthResponse(BaseModel):
    status: str
    version: str
    device: str

class TranslateRequest(BaseModel):
    text: str

class TranslateResponse(BaseModel):
    translation: str
    model: str
    
@app.get("/")
async def root():
    return {"message": "Welcome to the Machine Translation API"}
  
@app.post("/translate/bart", response_model=TranslateResponse)
@limiter.limit("10/minute")
async def translate_bart(request: Request, req: TranslateRequest):
    if not req.text.strip():
        raise HTTPException(400, "Input text is empty")
    
    try:
        inputs = tokenizer(req.text, return_tensors="pt", truncation=True).to(device)
        with torch.no_grad():
            ids = model.generate(**inputs, max_length=128, num_beams=4)
        bart_output = tokenizer.decode(ids[0], skip_special_tokens=True)
        return TranslateResponse(translation=bart_output, model="bart")
    except Exception as e:
        raise HTTPException(500, f"BART translation failed: {str(e)}")

@app.post("/translate/google", response_model=TranslateResponse)
@limiter.limit("10/minute")
async def translate_google(request: Request, req: TranslateRequest):
    if not req.text.strip():
        raise HTTPException(400, "Input text is empty")
    
    try:
        google_result = await translator.translate(req.text, dest="fr")
        return TranslateResponse(translation=google_result.text, model="google")
    except Exception as e:
        raise HTTPException(500, f"Google translation failed: {str(e)}")

@app.post("/translate/seq2seq", response_model=TranslateResponse)
@limiter.limit("10/minute")
async def translate_seq2seq(request: Request, req: TranslateRequest):
    if not req.text.strip():
        raise HTTPException(400, "Input text is empty")
    
    if not seq2seq_loaded:
        raise HTTPException(503, "Seq2seq model is not loaded")
    
    try:
        seq2seq_output = translate_sentence_beam(seq2seq_model, req.text, en_vocab, fr_vocab, device, beam_width=5)
        return TranslateResponse(translation=seq2seq_output, model="seq2seq")
    except Exception as e:
        raise HTTPException(500, f"Seq2seq translation failed: {str(e)}")

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify API status
    """
    return HealthResponse(
        status="healthy",
        version="1.0.1",
        device=str(device)
    )