# 🧠 Spaced Repetition Flash Cards with AI Images

A simple, effective flash card app that uses spaced repetition for optimal learning and Google's Gemini API (Nano Banana) for AI-generated images.

## ✨ Features

- **Spaced Repetition Algorithm**: Uses the SM-2 algorithm for optimal review timing
- **AI Image Generation**: Create images on-the-fly during review using Google's Gemini API
- **Clean Interface**: Simple, intuitive design focused on learning
- **Local Storage**: Your cards are saved locally in your browser
- **Mobile Friendly**: Works great on all devices

## 🚀 Getting Started

### 1. Get a Google Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for use in the app

### 2. Run the App

Simply open `index.html` in your web browser. No server needed!

### 3. Add Your First Cards

1. Click "Manage Cards" tab
2. Click "+ Add Card" 
3. Enter your question/prompt on the front
4. Enter the answer on the back
5. Save the card

### 4. Start Reviewing

1. Click "Review" tab
2. Cards ready for review will appear
3. Read the front, think of the answer
4. Click "Show Answer" to flip
5. Rate your recall: Hard, Good, or Easy

### 5. Add AI Images During Review

1. While reviewing a card, click "+ Add AI Image"
2. Enter your Gemini API key (saved for future use)
3. Describe the image you want
4. Choose front or back of card
5. Click "Generate Image" 
6. Save the generated image to your card

## 🎯 AI Image Tips

**Great prompts for flash cards:**
- "A colorful cartoon illustration of [concept]"
- "A simple diagram showing [process]" 
- "A memorable visual metaphor for [idea]"
- "An educational infographic about [topic]"

**Example:** Instead of just memorizing "Paris is the capital of France", add an image prompt like "The Eiffel Tower with a French flag and the word 'Capital' in elegant text".

## 🧠 How Spaced Repetition Works

The app uses the SM-2 algorithm:
- **Easy**: Card appears again in 2+ weeks
- **Good**: Card appears in a few days to a week  
- **Hard**: Card appears again soon (1-2 days)

The more you get a card right, the longer the intervals become. Cards you struggle with appear more frequently.

## 🔧 Technical Details

- **Frontend Only**: Pure HTML, CSS, JavaScript - no backend needed
- **Storage**: Uses browser localStorage
- **AI**: Google Gemini API for image generation
- **Algorithm**: SM-2 spaced repetition
- **Framework**: Vanilla JavaScript for simplicity

## 📱 Usage Tips

- **Create cards in batches** then review regularly
- **Use images wisely** - add them when you think of a helpful visual
- **Keep front/back concise** - aim for quick recall
- **Review daily** for best results
- **Rate honestly** - the algorithm learns from your feedback

## 🛠 Customization

The code is well-structured and easy to modify:
- `app.js` - Main application logic
- `styles.css` - All styling
- `index.html` - HTML structure

Feel free to customize colors, fonts, or add new features!

## 🔐 Privacy

- All cards stored locally in your browser
- API key stored locally (not sent anywhere else)
- Images generated are cached locally
- No data sent to external servers except Google's Gemini API

---

Happy learning! 🎓