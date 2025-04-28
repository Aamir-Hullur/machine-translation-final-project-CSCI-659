import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner"
import { useTranslate } from "@/hooks/useTranslate";
import { Skeleton } from "@/components/ui/skeleton";

export const TranslationComparison = () => {
  const [inputText, setInputText] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { translate, isLoading, data: results } = useTranslate();

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    
    translate(inputText, {
      onError: (error: Error) => {
        toast.error("Translation failed", {
          description: error.message || "There was an error translating your text. Please try again.",
        });
      }
    });
  };

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 p-4 relative z-50">
      <div className="space-y-4">
        <Textarea
          placeholder="Enter text to translate..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleTranslate();
            }
          }}
          className="min-h-[120px] resize-none p-4"
        />
        <Button
          onClick={handleTranslate}
          disabled={isLoading || !inputText.trim()}
          className="w-full cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Translating...
            </>
          ) : (
            "Translate"
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { name: "BART", description: "Fine-tuned BART model for English-French translation" },
          { name: "Google Translate", description: "Professional translation service" },
          { name: "Seq2Seq", description: "Custom sequence-to-sequence model with attention" }
        ].map((model, index) => (
          <Card key={model.name} className="p-4 relative flex flex-col">
            <div className="space-y-2 mb-4">
              <h3 className="flex justify-center font-bold text-lg text-card-foreground">{model.name}</h3>
            </div>
            
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : results ? (
              <div className="space-y-2">
                <div className="p-3 rounded-md bg-muted/50 min-h-[80px] relative group">
                  <p className="whitespace-pre-wrap break-words pr-8">
                    {index === 0
                      ? results.bart || "No translation available"
                      : index === 1
                      ? results.google || "No translation available"
                      : results.seq2seq || "No translation available"}
                  </p>
                  <button
                    onClick={() => handleCopy(
                      index === 0 ? results.bart || "No translation available" : 
                      index === 1 ? results.google || "No translation available" : 
                      results.seq2seq || "No translation available",
                      index
                    )}
                    className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all duration-200"
                    aria-label="Copy translation"
                  >
                    {copiedIndex === index ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 cursor-pointer" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 border-2 border-dashed rounded-md">
                <p className="text-muted-foreground text-sm">
                  Translation will appear here
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};