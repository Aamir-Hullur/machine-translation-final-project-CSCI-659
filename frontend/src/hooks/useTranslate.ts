import { useMutation } from "@tanstack/react-query";
import { TranslationResponse } from "@/types/translation";

interface TranslationResults {
  bart?: string;
  google?: string;
  seq2seq?: string;
}

const translateWithModel = async (text: string, model: string): Promise<TranslationResponse> => {
  const response = await fetch(`http://localhost:8000/translate/${model}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(`Rate limit exceeded for ${model} translation. Please wait a minute before trying again.`);
    }
    throw new Error(`${model} translation failed`);
  }

  return response.json();
};

export const useTranslate = () => {
  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const results: TranslationResults = {};
      
      const [bartResult, googleResult, seq2seqResult] = await Promise.allSettled([
        translateWithModel(text, "bart"),
        translateWithModel(text, "google"),
        translateWithModel(text, "seq2seq"),
      ]);

      if (bartResult.status === "fulfilled") {
        results.bart = bartResult.value.translation;
      } else if (bartResult.reason?.message.includes("Rate limit")) {
        throw new Error(bartResult.reason.message);
      }
      
      if (googleResult.status === "fulfilled") {
        results.google = googleResult.value.translation;
      } else if (googleResult.reason?.message.includes("Rate limit")) {
        throw new Error(googleResult.reason.message);
      }
      
      if (seq2seqResult.status === "fulfilled") {
        results.seq2seq = seq2seqResult.value.translation;
      } else if (seq2seqResult.reason?.message.includes("Rate limit")) {
        throw new Error(seq2seqResult.reason.message);
      }

      return results;
    }
  });

  return {
    translate: mutation.mutate,
    isLoading: mutation.isPending,
    data: mutation.data,
  };
};