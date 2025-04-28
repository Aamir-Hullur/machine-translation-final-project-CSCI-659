# Machine Translation Frontend — Project Requirements

## 1. Project Overview
Build a minimal, elegant web frontend that lets users enter arbitrary text, submit it to a FastAPI‐powered translation backend, and display three translation outputs (“BART”, “Google Translate”, and a third model). If the model’s output exactly matches Google’s, highlight it in green; otherwise, highlight in red.

## 2. Tech Stack
- React with Vite  
- Tailwind CSS v4  
- shadcn/ui component library  
- TypeScript  
- Fetch API or axios for HTTP requests  
- ESLint and Prettier for linting and formatting  

## 3. Functional Requirements
1. Input area  
   - Multiline text area with placeholder “Enter text to translate…”  
2. Submit action  
   - Translate button that is disabled while a request is in progress  
3. API interaction  
   - Send a POST request to the root endpoint with JSON body containing the text  
4. Results display  
   - Three labeled panels (“BART”, “Google Translate”, “Third Model”)  
   - Show a loading spinner or skeleton in each panel while waiting for the response  
5. Conditional styling  
   - If the third model’s trimmed output exactly equals the Google output, apply green text styling  
   - Otherwise, apply red text styling  

## 4. UI/UX & Design Guidelines
- Center a card container with max width of 600px, responsive layout  
- Use a neutral background and dark primary text color  
- Apply consistent padding and vertical spacing  
- Use system font stack and readable text sizes  
- Leverage shadcn/ui components for textarea, button, card, and spinner  

## 5. Component Structure
- App  
  - Root component that renders TranslatorCard  
- TranslatorCard  
  - Manages state: input text, loading flag, result object, error state  
  - Handles text change and submit events  
- ResultPanel  
  - Props: label, text value, loading flag, highlight color indicator  
  - Renders spinner when loading, otherwise renders text with conditional color  
- ErrorBanner  
  - Displays error messages from failed API calls  

## 6. API Details
- Base URL configurable via environment variable  
- Request format: JSON object with a single field “text”  
- Expected response: object with three string fields “bart”, “google”, and “thirdModel”  

## 7. Logic for Highlighting
After receiving the response, compare the thirdModel string to the google string (both trimmed). If they match exactly, set highlight color to green; otherwise set it to red. Pass this flag into ResultPanel.

## 8. Setup and Scripts
- Install dependencies with npm install  
- Run development server with npm run dev  
- Build for production with npm run build  

## 9. Suggested Project Structure
src/  
├─ App.tsx  
├─ components/  
│  ├─ TranslatorCard.tsx  
│  ├─ ResultPanel.tsx  
│  └─ ErrorBanner.tsx  
├─ hooks/  
│  └─ useTranslate.ts  


## 10. Tailwind Configuration
- Enable Tailwind v4 in tailwind.config.ts  
- Extend theme only if necessary  
- Optionally set up dark mode with the class strategy  
