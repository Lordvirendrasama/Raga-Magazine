
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { generateArticle } from "@/ai/flows/generate-article-flow";
import { Loader2 } from "lucide-react";

export function SeoAiTools() {
  const { toast } = useToast();
  const [topic, setTopic] = useState("");
  const [generatedArticle, setGeneratedArticle] = useState<{ title: string, body: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      toast({
        variant: "destructive",
        title: "Topic is required",
        description: "Please enter a topic to generate an article.",
      });
      return;
    }
    
    setIsLoading(true);
    setGeneratedArticle(null);

    try {
      const result = await generateArticle({ topic });
      setGeneratedArticle(result);
      toast({
        title: "Article Generated Successfully",
        description: "Your new draft has been created below.",
      });
    } catch (error) {
      console.error("Failed to generate article:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Could not generate an article for this topic. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to Clipboard",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO & AI Content Tools</CardTitle>
        <CardDescription>
          Use AI to generate draft articles for your magazine. Provide a topic and let the AI do the heavy lifting.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="article-topic">Article Topic</Label>
          <Textarea
            id="article-topic"
            placeholder="e.g., 'The resurgence of vinyl records in the digital age' or 'A profile of artist Kendrick Lamar'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Generating...' : 'Generate Article Draft'}
        </Button>
      </CardContent>

      {generatedArticle && (
        <CardFooter className="flex-col items-start gap-4 border-t pt-6">
           <div className="w-full space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold font-headline">{generatedArticle.title}</h3>
                    <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(generatedArticle.title)}>Copy Title</Button>
                </div>
              </div>

              <div>
                 <div className="flex justify-between items-center mb-2">
                    <Label className="text-base">Article Body</Label>
                    <Button variant="outline" size="sm" onClick={() => handleCopyToClipboard(generatedArticle.body)}>Copy Body</Button>
                </div>
                <div className="prose dark:prose-invert max-w-none rounded-md border bg-muted p-4 h-64 overflow-y-auto">
                    {generatedArticle.body.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
              </div>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
