import { type NextRequest, NextResponse } from "next/server"

const entityPatterns = {
  ACTOR: /\b(actor|actress|cast|star|performer|lead|supporting|ensemble|protagonist actor)\b/gi,
  DIRECTOR: /\b(director|directed by|filmmaker|helmed|vision|directorial)\b/gi,
  CHARACTER: /\b(character|protagonist|antagonist|hero|villain|role|portrayal)\b/gi,
  PLOT: /\b(plot|story|storyline|narrative|script|tale|pacing|arc|twist)\b/gi,
  CINEMATOGRAPHY: /\b(cinematography|visuals|camera work|shots|filming|photography|frames|lighting|composition)\b/gi,
  SOUNDTRACK: /\b(soundtrack|music|score|songs|audio|sound|theme|composition)\b/gi,
  SCREENPLAY: /\b(screenplay|writing|dialogue|script|lines|conversation)\b/gi,
  ACTING: /\b(acting|performance|portrayed|played|delivery|expression|chemistry)\b/gi,
  MOVIE: /\b(movie|film|picture|flick|feature)\b/gi,
}

const positiveWords = [
  "excellent",
  "amazing",
  "wonderful",
  "brilliant",
  "fantastic",
  "great",
  "perfect",
  "outstanding",
  "superb",
  "phenomenal",
  "incredible",
  "masterpiece",
  "stunning",
  "beautiful",
  "impressive",
  "compelling",
  "engaging",
  "captivating",
  "love",
  "loved",
  "best",
  "favorite",
  "good",
  "well",
  "powerful",
  "strong",
  "breathtaking",
  "remarkable",
  "magnificent",
  "spectacular",
  "exceptional",
  "masterful",
  "flawless",
  "riveting",
  "gripping",
  "mesmerizing",
  "unforgettable",
  "award-worthy",
]

const negativeWords = [
  "terrible",
  "awful",
  "horrible",
  "bad",
  "worst",
  "disappointing",
  "poor",
  "weak",
  "boring",
  "dull",
  "mediocre",
  "waste",
  "failed",
  "lacking",
  "rushed",
  "underwhelming",
  "forgettable",
  "cliche",
  "predictable",
  "hate",
  "hated",
  "annoying",
  "confusing",
  "mess",
  "disaster",
  "ridiculous",
  "forced",
  "bland",
  "uninspired",
  "tedious",
  "clumsy",
  "dragged",
  "disappointing",
]

function extractEntities(text: string) {
  const entities: Array<{
    text: string
    label: string
    sentiment: "positive" | "negative" | "neutral"
    context: string
  }> = []
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim())

  for (const [label, pattern] of Object.entries(entityPatterns)) {
    const matches = text.match(pattern)
    if (matches) {
      const uniqueMatches = [...new Set(matches)]

      uniqueMatches.forEach((match) => {
        // Find the sentence containing this entity
        const containingSentence = sentences.find((s) => s.toLowerCase().includes(match.toLowerCase())) || ""

        // Determine sentiment of this entity based on surrounding context
        const sentiment = analyzeSentenceContext(containingSentence)

        // Only add if we have meaningful context
        if (containingSentence.trim()) {
          entities.push({
            text: match.toLowerCase(),
            label,
            sentiment,
            context: containingSentence.trim(),
          })
        }
      })
    }
  }

  const uniqueEntities = entities.filter(
    (entity, index, self) =>
      index ===
      self.findIndex((e) => e.text === entity.text && e.label === entity.label && e.context === entity.context),
  )

  return uniqueEntities
}

function analyzeSentenceContext(sentence: string): "positive" | "negative" | "neutral" {
  const lowerSentence = sentence.toLowerCase()

  let positiveScore = 0
  let negativeScore = 0

  // Check for negation words that flip sentiment
  const negationWords = ["not", "never", "no", "neither", "nor", "hardly", "barely", "scarcely"]
  const hasNegation = negationWords.some((word) => lowerSentence.includes(word))

  positiveWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = lowerSentence.match(regex)
    if (matches) {
      // If negation is present, reduce the positive score
      positiveScore += hasNegation ? matches.length * 0.3 : matches.length
    }
  })

  negativeWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = lowerSentence.match(regex)
    if (matches) {
      negativeScore += matches.length
    }
  })

  // Require a minimum threshold to avoid false neutrals
  const threshold = 0.5

  if (positiveScore > negativeScore + threshold) return "positive"
  if (negativeScore > positiveScore + threshold) return "negative"
  return "neutral"
}

function analyzeSentiment(text: string) {
  const lowerText = text.toLowerCase()
  let positiveScore = 0
  let negativeScore = 0

  positiveWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = lowerText.match(regex)
    if (matches) positiveScore += matches.length
  })

  negativeWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi")
    const matches = lowerText.match(regex)
    if (matches) negativeScore += matches.length
  })

  const totalScore = positiveScore + negativeScore
  const sentiment = positiveScore > negativeScore ? "positive" : "negative"

  let confidence = 0.5
  if (totalScore > 0) {
    confidence = Math.max(positiveScore, negativeScore) / totalScore
    // Boost confidence for clearer signals
    confidence = Math.min(confidence * 1.15, 0.98)
  }

  return { sentiment, confidence }
}

export async function POST(request: NextRequest) {
  try {
    const { review } = await request.json()

    if (!review || typeof review !== "string") {
      return NextResponse.json({ error: "Invalid review text" }, { status: 400 })
    }

    const { sentiment, confidence } = analyzeSentiment(review)
    const entities = extractEntities(review)

    const stats = {
      totalEntities: entities.length,
      positiveEntities: entities.filter((e) => e.sentiment === "positive").length,
      negativeEntities: entities.filter((e) => e.sentiment === "negative").length,
      neutralEntities: entities.filter((e) => e.sentiment === "neutral").length,
    }

    return NextResponse.json({
      sentiment,
      confidence,
      entities,
      stats,
    })
  } catch (error) {
    console.error("Error in sentiment analysis:", error)
    return NextResponse.json({ error: "Failed to analyze review" }, { status: 500 })
  }
}
