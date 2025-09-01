import { useState } from "react";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FeedbackPanelProps {
  problemId: string;
}

export default function FeedbackPanel({ problemId }: FeedbackPanelProps) {
  const [accuracyRating, setAccuracyRating] = useState(0);
  const [clarityRating, setClarityRating] = useState<string>("");
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleStarClick = (rating: number) => {
    setAccuracyRating(rating);
  };

  const handleClarityClick = (clarity: string) => {
    setClarityRating(clarity);
  };

  const handleSubmitFeedback = async () => {
    if (accuracyRating === 0) {
      toast({
        title: "Error",
        description: "Please provide an accuracy rating",
        variant: "destructive",
      });
      return;
    }

    if (!clarityRating) {
      toast({
        title: "Error",
        description: "Please rate the clarity of the explanation",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/feedback", {
        problemId,
        accuracyRating,
        clarityRating,
        comments: comments.trim() || undefined,
        isHelpful: accuracyRating >= 3,
      });

      toast({
        title: "Thank you!",
        description: "Your feedback has been submitted successfully",
      });

      // Reset form
      setAccuracyRating(0);
      setClarityRating("");
      setComments("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Solution Feedback</h3>

        <div className="space-y-4">
          {/* Accuracy Rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              How accurate was this solution?
            </label>
            <div className="flex items-center space-x-1" data-testid="rating-accuracy">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`text-lg transition-colors ${
                    star <= accuracyRating ? "text-yellow-400" : "text-gray-300"
                  } hover:text-yellow-500`}
                  data-testid={`star-${star}`}
                >
                  <Star className="w-5 h-5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Clarity Rating */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              How clear were the explanations?
            </label>
            <div className="flex space-x-2" data-testid="rating-clarity">
              {["Very Clear", "Somewhat Clear", "Unclear"].map((clarity) => (
                <button
                  key={clarity}
                  onClick={() => handleClarityClick(clarity)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    clarityRating === clarity
                      ? "feedback-glow bg-green-100 text-green-800"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                  data-testid={`clarity-${clarity.toLowerCase().replace(" ", "-")}`}
                >
                  {clarity}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Additional Comments
            </label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Share your thoughts on the solution..."
              className="resize-none"
              rows={3}
              data-testid="input-comments"
            />
          </div>

          <Button
            onClick={handleSubmitFeedback}
            disabled={isSubmitting || accuracyRating === 0 || !clarityRating}
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
            data-testid="button-submit-feedback"
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
