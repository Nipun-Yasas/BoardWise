"use client";

import { Button } from "@/app/_components/Button";
import {
  ArrowRight,
  Check,
  DollarSign,
  Lightbulb,
  Loader2,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

interface Recommendation {
  boardingId: string;
  boardingName: string;
  matchScore: number;
  rank: number;
  bestRoom: {
    roomId: string;
    roomName: string;
    price: number;
    totalMonthlyCost: number;
    availableSpots: number;
  };
  matchReasoning: {
    budgetMatch: string;
    distanceMatch: string;
    amenitiesMatch: string;
    valueProposition: string;
  };
  pros?: string[];
  cons?: string[];
  keyHighlights?: string[];
  recommendation: string;
}

interface ExtractedPreferences {
  summary: string;
  criticalRequirements: string[];
}

const EXAMPLE_PROMPTS = [
  "I need a furnished AC room near University of Moratuwa, budget under Rs 25,000. WiFi and attached bathroom are must-haves.",
  "Looking for a girls-only boarding close to SLIIT with vegetarian meals included. Budget around Rs 20,000-30,000.",
  "Need a quiet place near University of Colombo for studying. Budget flexible, but want good security and WiFi.",
  "Searching for affordable boarding near NSBM, budget Rs 15,000-20,000. Shared room is okay, need parking for bike.",
];

interface SmartRecommendationProps {
  onClose: () => void;
}

const SmartRecommendation: React.FC<SmartRecommendationProps> = ({
  onClose,
}) => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [extractedPreferences, setExtractedPreferences] =
    useState<ExtractedPreferences | null>(null);
  const [alternativeSuggestions, setAlternativeSuggestions] = useState("");

  const getRecommendations = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setRecommendations([]);
    setExtractedPreferences(null);

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentPrompt: prompt }),
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations);
        setExtractedPreferences(data.extractedPreferences);
        setAlternativeSuggestions(data.alternativeSuggestions || "");
      } else {
        toast.error(
          "Failed to get recommendations: " + (data.error || "Unknown error"),
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const useExamplePrompt = (example: string) => {
    setPrompt(example);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-600";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  AI-Powered Boarding Finder
                </h1>
                <p className="text-textSecondary">
                  Find your perfect boarding in seconds
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Main Content Card */}
          <div className="bg-backgroundSecondary rounded-2xl shadow-2xl border border-borderPrimary overflow-hidden">
            {/* Input Section */}
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-3 mb-4">
                <Lightbulb className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-xl font-semibold text-textPrimary mb-2">
                    Describe Your Ideal Boarding
                  </h2>
                  <p className="text-textSecondary text-sm">
                    Tell us what you&apos;re looking for in natural language.
                    Include budget, university, amenities, and preferences.
                  </p>
                </div>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: I'm looking for a fully furnished AC room near University of Colombo, budget under 25000 rupees. I need WiFi, attached bathroom, and prefer vegetarian meals..."
                className="w-full p-4 border-2 border-borderPrimary rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none min-h-[140px] resize-none bg-input text-textPrimary placeholder:text-textSecondary/50 transition-all"
                disabled={loading}
              />

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button
                  onClick={getRecommendations}
                  disabled={loading || !prompt.trim()}
                  className="flex-1 sm:flex-none"
                  frontIcon={
                    loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )
                  }
                >
                  {loading ? "Analyzing..." : "Find Best Matches"}
                </Button>
              </div>

              {/* Example Prompts */}
              <div className="mt-6">
                <p className="text-sm font-medium text-textSecondary mb-3">
                  💡 Try these examples:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {EXAMPLE_PROMPTS.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => useExamplePrompt(example)}
                      className="text-left p-3 bg-backgroundSecondary hover:bg-hoverPrimary border border-borderPrimary hover:border-hoverPrimary rounded-lg text-xs text-textSecondary transition-all"
                      disabled={loading}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Section */}
            {(extractedPreferences || recommendations.length > 0) && (
              <div className="p-6 md:p-8 space-y-6">
                {/* Extracted Preferences */}
                {extractedPreferences && (
                  <div className="bg-backgroundSecondary rounded-xl p-6 border border-borderPrimary">
                    <h3 className="text-lg font-semibold text-textPrimary mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      What We Understood:
                    </h3>
                    <p className="text-textSecondary mb-4">
                      {extractedPreferences.summary}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {extractedPreferences.criticalRequirements?.map(
                        (req, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-primary text-white rounded-full text-sm font-medium"
                          >
                            {req}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {recommendations.length > 0 ? (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-primary" />
                      Top {recommendations.length} Recommendations
                    </h3>

                    {recommendations.map((rec) => (
                      <div
                        key={rec.boardingId}
                        className="bg-backgroundSecondary rounded-xl shadow-lg border border-borderPrimary overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        {/* Header with Score */}
                        <div
                          className={`p-4 bg-gradient-to-r ${getScoreColor(rec.matchScore)}`}
                        >
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                              <span className="text-white text-sm font-semibold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                #{rec.rank} Best Match
                              </span>
                              <span className="text-3xl font-bold text-white">
                                {rec.matchScore}%
                              </span>
                            </div>
                            <h4 className="text-2xl font-bold text-white">
                              {rec.boardingName}
                            </h4>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-5">
                          {/* Recommendation Summary */}
                          <p className="text-textPrimary text-lg font-medium leading-relaxed">
                            {rec.recommendation}
                          </p>

                          {/* Best Room Info */}
                          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                            <h5 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                              <Check className="w-5 h-5" />
                              Recommended Room: {rec.bestRoom.roomName}
                            </h5>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-textSecondary flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  Monthly Rent
                                </span>
                                <p className="font-semibold text-textPrimary text-lg">
                                  Rs {rec.bestRoom.price.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <span className="text-textSecondary flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  Total Cost
                                </span>
                                <p className="font-semibold text-textPrimary text-lg">
                                  Rs{" "}
                                  {rec.bestRoom.totalMonthlyCost.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <span className="text-textSecondary flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  Available
                                </span>
                                <p className="font-semibold text-textPrimary text-lg">
                                  {rec.bestRoom.availableSpots} spot
                                  {rec.bestRoom.availableSpots !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Key Highlights */}
                          {rec.keyHighlights && rec.keyHighlights.length > 0 && (
                            <div>
                              <h5 className="font-semibold text-textPrimary mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                Key Highlights
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {rec.keyHighlights.map((highlight, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1.5 bg-primary text-white rounded-full text-sm font-medium"
                                  >
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Pros and Cons */}
                          {(rec.pros && rec.pros.length > 0) || (rec.cons && rec.cons.length > 0) ? (
                            <div className="grid md:grid-cols-2 gap-4">
                              {rec.pros && rec.pros.length > 0 && (
                                <div>
                                  <h5 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                                    <Check className="w-5 h-5" />
                                    Pros
                                  </h5>
                                  <ul className="space-y-2">
                                    {rec.pros.map((pro, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-textSecondary flex items-start gap-2"
                                      >
                                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>{pro}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {rec.cons && rec.cons.length > 0 && (
                                <div>
                                  <h5 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                                    <X className="w-5 h-5" />
                                    Cons
                                  </h5>
                                  <ul className="space-y-2">
                                    {rec.cons.map((con, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-textSecondary flex items-start gap-2"
                                      >
                                        <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>{con}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ) : null}

                          {/* Match Reasoning */}
                          <div className="bg-backgroundSecondary rounded-lg p-4 space-y-2 text-sm">
                            <h5 className="font-semibold text-textPrimary mb-3">
                              Why This Match?
                            </h5>
                            <div className="space-y-2.5">
                              <p className="text-textSecondary">
                                <strong className="text-textPrimary">
                                  💰 Budget:
                                </strong>{" "}
                                {rec.matchReasoning.budgetMatch}
                              </p>
                              <p className="text-textSecondary">
                                <strong className="text-textPrimary">
                                  📍 Distance:
                                </strong>{" "}
                                {rec.matchReasoning.distanceMatch}
                              </p>
                              <p className="text-textSecondary">
                                <strong className="text-textPrimary">
                                  ✨ Amenities:
                                </strong>{" "}
                                {rec.matchReasoning.amenitiesMatch}
                              </p>
                              <p className="text-textSecondary">
                                <strong className="text-textPrimary">
                                  💎 Value:
                                </strong>{" "}
                                {rec.matchReasoning.valueProposition}
                              </p>
                            </div>
                          </div>

                          {/* Action Button */}
                          <Link href={`/boarding/${rec.boardingId}`}>
                            <Button
                              backIcon={<ArrowRight className="w-5 h-5" />}
                            >
                              View Full Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  !loading && (
                    <div className="text-center py-12">
                      <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                        <Lightbulb className="w-10 h-10 text-yellow-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-textPrimary mb-2">
                        No Perfect Matches Found
                      </h3>
                      {alternativeSuggestions && (
                        <p className="text-textSecondary max-w-2xl mx-auto">
                          {alternativeSuggestions}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendation;
