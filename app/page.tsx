"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, TrendingUp, TrendingDown, Minus, Film, User, Clapperboard, FileText } from "lucide-react"

interface EntityResult {
  text: string
  label: string
  sentiment: "positive" | "negative" | "neutral"
  context: string
}

interface AnalysisResult {
  sentiment: "positive" | "negative"
  confidence: number
  entities: EntityResult[]
  stats: {
    totalEntities: number
    positiveEntities: number
    negativeEntities: number
    neutralEntities: number
  }
}

export default function SentimentAnalysisPage() {
  const [review, setReview] = useState("")
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)

  const analyzeReview = async () => {
    if (!review.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error analyzing review:", error)
    } finally {
      setLoading(false)
    }
  }

  const getEntityIcon = (label: string) => {
    const icons: Record<string, React.ReactNode> = {
      ACTOR: <User className="w-3.5 h-3.5" />,
      DIRECTOR: <Clapperboard className="w-3.5 h-3.5" />,
      CHARACTER: <User className="w-3.5 h-3.5" />,
      PLOT: <FileText className="w-3.5 h-3.5" />,
      CINEMATOGRAPHY: <Film className="w-3.5 h-3.5" />,
      SOUNDTRACK: <Sparkles className="w-3.5 h-3.5" />,
      SCREENPLAY: <FileText className="w-3.5 h-3.5" />,
      ACTING: <User className="w-3.5 h-3.5" />,
      MOVIE: <Film className="w-3.5 h-3.5" />,
    }
    return icons[label] || <Sparkles className="w-3.5 h-3.5" />
  }

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === "positive") return <TrendingUp className="w-4 h-4" />
    if (sentiment === "negative") return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "positive") return "text-chart-3"
    if (sentiment === "negative") return "text-chart-5"
    return "text-muted-foreground"
  }

  const examples = [
    "The cinematography was absolutely stunning, with breathtaking visuals throughout. However, the plot felt somewhat predictable and the pacing dragged in the second act.",
    "Tom Hanks delivered an incredible performance as the lead character. The director masterfully crafted each scene, but the soundtrack was forgettable and didn't enhance the emotional moments.",
    "A masterpiece of modern cinema! The acting was phenomenal, the plot kept me engaged, and the cinematography was award-worthy. Only the dialogue felt a bit forced at times.",
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="relative border-b border-border bg-gradient-to-b from-primary/5 to-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-5xl mx-auto px-4 py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <Badge variant="secondary" className="text-xs font-mono border-primary/20">
              AI-Powered Analysis
            </Badge>
          </div>
          <h1 className="text-5xl font-bold text-balance mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-accent to-primary">
            IMDb Review Analyzer
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl leading-relaxed">
            Advanced sentiment analysis with Named Entity Recognition. Identify specific movie elements and their
            sentiment beyond simple positive/negative classification.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Card className="mb-6 border-border/50 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Film className="w-5 h-5 text-primary" />
              Enter Movie Review
            </CardTitle>
            <CardDescription className="text-base">
              Paste an IMDb movie review to analyze sentiment and extract specific movie elements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: The acting was phenomenal, especially the lead actor's performance. However, the plot felt rushed and the cinematography was underwhelming..."
              className="min-h-32 resize-none text-base bg-muted/30 border-border/50 focus:bg-background transition-colors"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Quick examples:</span>
              {examples.map((example, idx) => (
                <Button key={idx} variant="outline" size="sm" onClick={() => setReview(example)} className="text-xs">
                  Example {idx + 1}
                </Button>
              ))}
            </div>

            <Button onClick={analyzeReview} disabled={loading || !review.trim()} className="w-full" size="lg">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Review...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Review
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-border/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-foreground">
                    {result.sentiment === "positive" ? (
                      <span className="text-chart-3">Positive</span>
                    ) : (
                      <span className="text-chart-5">Negative</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Overall Sentiment</div>
                  <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        result.sentiment === "positive" ? "bg-chart-3" : "bg-chart-5"
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {(result.confidence * 100).toFixed(1)}% confidence
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-foreground">{result.stats.totalEntities}</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Entities</div>
                  <div className="text-xs text-muted-foreground mt-3">Identified elements</div>
                </CardContent>
              </Card>

              <Card className="border-border/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-chart-3">{result.stats.positiveEntities}</div>
                  <div className="text-sm text-muted-foreground mt-1">Positive</div>
                  <div className="text-xs text-muted-foreground mt-3">Praised elements</div>
                </CardContent>
              </Card>

              <Card className="border-border/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-chart-5">{result.stats.negativeEntities}</div>
                  <div className="text-sm text-muted-foreground mt-1">Negative</div>
                  <div className="text-xs text-muted-foreground mt-3">Criticized elements</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Identified Movie Elements</CardTitle>
                <CardDescription className="text-base">
                  Specific aspects mentioned in the review with their sentiment and context
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.entities.length > 0 ? (
                  <div className="space-y-3">
                    {result.entities.map((entity, idx) => (
                      <div
                        key={idx}
                        className="group p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="font-mono text-xs gap-1">
                                {getEntityIcon(entity.label)}
                                {entity.label}
                              </Badge>
                              <span className="font-semibold text-foreground capitalize">{entity.text}</span>
                            </div>
                            <p className="text-sm text-muted-foreground italic line-clamp-2">{entity.context}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge
                              variant={entity.sentiment === "positive" ? "default" : "destructive"}
                              className={`gap-1 ${
                                entity.sentiment === "neutral"
                                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                  : ""
                              }`}
                            >
                              {getSentimentIcon(entity.sentiment)}
                              {entity.sentiment}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Film className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No specific movie elements detected in this review</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-primary/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Entity Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    "ACTOR",
                    "DIRECTOR",
                    "CHARACTER",
                    "PLOT",
                    "CINEMATOGRAPHY",
                    "SOUNDTRACK",
                    "SCREENPLAY",
                    "ACTING",
                  ].map((label) => (
                    <Badge key={label} variant="secondary" className="justify-start gap-1.5 font-mono text-xs py-2">
                      {getEntityIcon(label)}
                      {label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
