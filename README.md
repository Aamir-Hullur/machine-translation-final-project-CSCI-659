# Neural Machine Translation Web Application

A modern web application that demonstrates and compares different approaches to neural machine translation (NMT) for English to French translation, featuring three translation models:

- **BART**: A fine-tuned BART model for English-French translation
- **Googletrans**: Free and open-source Python library for Google Translate
- **Seq2Seq**: Custom sequence-to-sequence model with attention mechanism

## Project Overview

This project implements a custom neural machine translation system with a modern React frontend and FastAPI backend. It allows users to compare translations from different models side by side.

### Features

- Clean, responsive UI with dark/light mode
- Simultaneous translation using three different models
- Copy translations to clipboard with a single click
- Rate-limited API to prevent overloading models
- Error handling with user-friendly notifications
- Support for GPU acceleration when available

## Core Components

```mermaid
flowchart TD
    classDef frontendStyle fill:#f9f0ff,stroke:#9558B2,stroke-width:2px
    classDef backendStyle fill:#e6f7ff,stroke:#1890ff,stroke-width:2px
    classDef modelStyle fill:#f6ffed,stroke:#52c41a,stroke-width:2px
    classDef utilStyle fill:#fff2e8,stroke:#fa8c16,stroke-width:2px

    User((User)):::utilStyle
    
    subgraph Frontend["Frontend (React)"]
        UI[UI Components]:::frontendStyle
        ReactHooks[React Hooks]:::frontendStyle
        ThemeProvider[Theme Provider]:::frontendStyle
        TranslationComp[Translation Component]:::frontendStyle
        
        UI --> ReactHooks
        UI --> ThemeProvider
        UI --> TranslationComp
        TranslationComp --> ReactHooks
    end
    
    subgraph Backend["Backend (FastAPI)"]
        API[API Endpoints]:::backendStyle
        RateLimiter[Rate Limiter]:::backendStyle
        ErrorHandling[Error Handling]:::backendStyle
        
        API --> RateLimiter
        API --> ErrorHandling
    end
    
    subgraph Models["Translation Models"]
        BART[BART\nFine-tuned Transformer]:::modelStyle
        Googletrans[Googletrans\nPython Package]:::modelStyle
        Seq2Seq[Seq2Seq\nAttention Model]:::modelStyle
    end
    
    User --> UI
    ReactHooks -- API Requests --> API
    API -- Model Selection --> Models
    BART -- Translation --> API
    Googletrans -- Translation --> API
    Seq2Seq -- Translation --> API
    API -- Response --> ReactHooks
    ReactHooks -- Update UI --> TranslationComp
```

## Interaction Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as UI Components
    participant Hook as useTranslate Hook
    participant API as FastAPI Backend
    participant BART as BART Model
    participant Googletrans as Googletrans Package
    participant Seq2Seq as Seq2Seq Model
    
    User->>UI: Enter text to translate
    User->>UI: Click "Translate" button
    activate UI
    UI->>Hook: Call translate() with text
    activate Hook
    
    par Parallel API Requests
        Hook->>API: POST /translate/bart
        activate API
        API->>BART: Process text
        activate BART
        BART-->>API: Return translation
        deactivate BART
        API-->>Hook: BART translation response
        deactivate API
    and
        Hook->>API: POST /translate/google
        activate API
        API->>Googletrans: Process text
        activate Googletrans
        Googletrans-->>API: Return translation
        deactivate Googletrans
        API-->>Hook: Googletrans translation response
        deactivate API
    and
        Hook->>API: POST /translate/seq2seq
        activate API
        API->>Seq2Seq: Process text
        activate Seq2Seq
        Seq2Seq-->>API: Return translation
        deactivate Seq2Seq
        API-->>Hook: Seq2Seq translation response
        deactivate API
    end
    
    Hook-->>UI: Update UI with all translations
    deactivate Hook
    
    UI-->>User: Display translations
    deactivate UI
    
    opt User copies translation
        User->>UI: Click copy button
        UI-->>User: Copy to clipboard
    end
```

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite 
- Tailwind CSS
- TanStack Query

### Backend
- FastAPI for API server
- PyTorch for running the ML models
- Hugging Face Transformers for BART model
- Custom Seq2Seq implementation
- Googletrans package for Google Translate service access
- SlowAPI for rate limiting


## Translation Models

### BART Model
A fine-tuned BART (Bidirectional and Auto-Regressive Transformers) model specifically adapted for English-French translation. The model uses beam search with a width of 4 for generating translations.

### Googletrans
A free and open-source Python library that implements the Google Translate API. It allows for simple and easy access to Google's neural machine translation service without requiring API keys or paid subscriptions.

### Custom Seq2Seq Model
A custom-built sequence-to-sequence model with attention mechanism. It consists of:
- Encoder: Processes the input English text
- Attention Mechanism: Helps the model focus on relevant parts of the source sentence
- Decoder: Generates the French translation

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd web-app/backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
uvicorn app:app --reload
```

The backend will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd web-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## References

- [HuggingFace BART Model](https://huggingface.co/facebook/bart-base)
- [Googletrans Package](https://pypi.org/project/googletrans/)
- [Tatoeba Dataset](https://tatoeba.org/en/downloads)
- [Neural Machine Translation Repository](https://github.com/Guri10/neural-machine-translation)