export interface TranslationRequest {
  text: string;
}

export interface TranslationResponse {
  translation: string;
  model: string;
}

export interface AllTranslationsResponse {
  text: string;
  translations: Array<{
    model: string;
    translation?: string;
    error?: string;
  }>;
}
