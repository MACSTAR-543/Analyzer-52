
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)

## 👥 Project Members

- **Mia A. Cabanza** 
- **Jane G. Corro** 
- **Jorinna E. Espena**
- **Rhia Mae U. Gojar**
- **Morly D. Granado**


## Overview
**IMDb Review Analyzer**

An advanced sentiment analysis tool with Named Entity Recognition (NER) specifically designed for IMDb movie reviews. This application goes beyond simple positive/negative classification by identifying specific movie elements mentioned in the review and analyzing their individual sentiment.

**✨Features**
+ 📊 Advanced Sentiment Analysis: Detects nuanced sentiment beyond binary classification

+ 🏷️Named Entity Recognition (NER): Identifies specific movie elements mentioned in reviews

+ 🎬Element-Specific Sentiment: Analyzes sentiment for individual movie components (plot, acting, cinematography, etc.)

+ ⚡Quick Examples: Pre-loaded sample reviews for instant demonstration

+ 📈Clean Interface: Simple, user-friendly design for easy review analysis


**📖 How to Use**
1. Enter Review: Paste an IMDb movie review into the provided text area

2. Analyze: The system will automatically process the text

3. View Results: See detailed analysis including:
   - Overall sentiment with confidence percentage
   
   - Total entities identified
   
   - Positive vs Negative element breakdown
   
   - Identified movie elements with context and sentiment
   
   - Entity type classification


**🎯 Example Analysis**
  
  Input Review:
"The cinematography was absolutely stunning, with breathtaking visuals throughout. However, the plot felt somewhat predictable and the pacing dragged in the second act."

Analysis Results:



## Identified Elements:

1. 🎥 CINEMATOGRAPHY - Positive

  - Context: "The cinematography was absolutely stunning"
    
  - Sentiment: Praised
    
2. 🖼️ VISUALS - Positive

  - Context: "with breathtaking visuals throughout"
    
  - Sentiment: Praised

3. 📖 PLOT - Negative

  - Context: "the plot felt somewhat predictable"
    
  - Sentiment: Criticized


**🏗️ Entity Types**
The system recognizes various movie-related entity types:

- A. ACTOR - Cast members and performers

- B. CINEMATOGRAPHY - Visual composition and camera work

- C. DIRECTOR - Film direction

- D. SOMETHING - General elements

- E. CHARACTER - Story characters

- F. GENRE - Movie genre classification

- G. SCREENPLAY - Script and writing

- H. ACTING - Performance quality

**🛠️ Technology Stack**

+ Natural Language Processing (NLP) for text analysis

+ Machine Learning models for sentiment analysis with confidence scoring

+ Named Entity Recognition (NER) for movie element extraction

+ Modern web interface for intuitive user interaction

+ Real-time processing for instant analysis

**🚀 Getting Started**

## Prerequisites

+ Modern web browser

+ Internet connection (for processing)


  **Note:** This tool is designed for educational and analytical purposes, providing insights into how sentiment is expressed in movie reviews and what specific elements viewers focus on in their critiques. The analysis results should be interpreted as indicators rather than definitive judgments.
  
### Deployment
https://v0-add-ner-fd.vercel.app/
