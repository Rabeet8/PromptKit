# PromptKit

Your all-in-one AI developer toolkit for mobile.

PromptKit brings essential AI utilities into a beautifully designed mobile app—helping developers, prompt engineers, and AI builders work smarter, faster, and on the go.

## Features

### Prompt Linter
Analyze prompts for clarity, detect weaknesses, and instantly receive:
* A quality score
* Identified issues
* A rewritten "improved prompt"
* Helpful analysis & recommendations

### Token Counter
Get instant token and character counts with support for multiple LLMs. Perfect for budgeting API usage and optimizing prompt costs.

### Schema Generator
Generate JSON Schema, valid examples, and invalid examples from any text description. Includes:
* Fixed-height scrollable JSON viewer
* Copy-to-clipboard support
* API-powered schema generation

### LLM Cost Estimator
Calculate API cost usage based on:
* Model
* Input tokens
* Output tokens
* Calls per day
* Cache hit rate

Returns detailed daily & monthly estimates using backend-calculated values.

### Dynamic Model Support
Models are fetched directly from the backend to ensure your app stays updated with the latest LLMs.

## Tech Stack

* React Native (Expo)
* TypeScript
* REST API integration
* Custom reusable components (dropdowns, sliders, cards, etc.)
* expo-clipboard for copy support
* Nested ScrollViews for JSON viewer
* Clean, theme-consistent UI

##  Folder Structure
```
src/
 ├─ api/
 │   ├─ costts
 │   ├─ modelsts
 │   ├─ lint.ts
 │   ├─ tokenize.ts
 │   └─ schema.apits
 │
 ├─ components/
 │   ├─ Button.tsx
 │   ├─ CacheSlider.tsx
 │   ├─ CostCard.tsx
 │   ├─ DescriptionInput.tsx
 │   ├─ Header.tsx
 │   ├─ InputCard.tsx
 │   ├─ InputRows.tsx
 │   └─ ModelDropdown.tsx
 │
 ├─ screens/
 │   ├─ PromptLinterScreen.tsx
 │   ├─ TokenCalculatorScreen.tsx
 │   ├─ SchemaGeneratorScreen.tsx
 │   └─ CostCalculatorScreen.tsx
 │
 └─ utils/
     └─ apiClient.ts
```

## Installation
```bash
git clone https://github.com/your-github/promptkit.git
cd promptkit
npm install
npx expo start
```

## Environment Variables

Create an `.env` file:
```env
API_BASE_URL=https://your-api-url.com
```

The app automatically pulls models and uses real API endpoints for:
* `/lint`
* `/tokenize`
* `/schema`
* `/cost`
* `/models`

## Contributing

Contributions are welcome! If you'd like to improve UI components, add new AI utilities, or enhance performance, feel free to open a pull request.

## Developers:-

Syed Rabeet & Huzaifa Ghori
