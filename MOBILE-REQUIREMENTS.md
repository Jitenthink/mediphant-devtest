# Mobile Development Requirements - Mediphant DevTest

## 📱 Overview

Build a native mobile application that integrates with the existing Mediphant web API to provide medication interaction checking and FAQ functionality on mobile devices.

## 🎯 Objectives

Create a **tiny native mobile app** that demonstrates:
- End-to-end integration with existing Next.js API endpoints
- Professional mobile UX patterns
- Error handling and offline considerations
- Clean architecture suitable for healthcare applications

**Time Estimate**: 45-60 minutes for core functionality

## 🏗️ Technical Requirements

### Platform Choice
Choose **ONE** platform:
- **iOS**: Swift/SwiftUI (iOS 15+)
- **Android**: Kotlin/Jetpack Compose (API 24+)
- **React Native**: TypeScript (if preferred for cross-platform)

### API Integration
The mobile app must consume the existing API endpoints:

**Base URL**: `http://localhost:3000` (development) / `https://your-domain.com` (production)

**Endpoints to integrate**:
1. `POST /api/interactions` - Medication interaction checker
2. `GET /api/faq?q={query}` - FAQ search with vector retrieval

### Required Features

#### 1. Medication Interaction Checker
**UI Requirements**:
- Two text input fields for medications (medA, medB)
- Submit button with loading state
- Results display with clear risk indication
- Error handling for network/validation issues

**Functionality**:
- Input validation (non-empty, different medications)
- API call to `/api/interactions` endpoint
- Display results with appropriate visual treatment:
  - **High Risk**: Red indication with warning UI
  - **Low Risk**: Green indication with safe UI
- Show advice text prominently
- Handle edge cases (same medication, network errors)

#### 2. FAQ Search
**UI Requirements**:
- Search input field with placeholder text
- Submit/search button or real-time search
- Results list with relevance scores
- Loading states and empty states

**Functionality**:
- API call to `/api/faq` endpoint
- Display synthesized answer prominently
- Show supporting information with relevance scores
- Handle no results gracefully
- Optional: Sample question buttons for better UX

#### 3. Navigation & Structure
**Required Screens**:
- Main/Home screen with navigation to features
- Interaction Checker screen
- FAQ Search screen

**Navigation Pattern**:
- Tab navigation (preferred) OR
- Bottom navigation OR  
- Stack navigation with clear back buttons

#### 4. Professional Polish
**UI/UX Requirements**:
- Medical disclaimer prominently displayed
- Clean, professional design suitable for healthcare
- Proper loading states and error messages
- Responsive design for different screen sizes
- Accessibility considerations (contrast, text size)

## 📋 API Specifications

### Interaction Checker API

**Request**:
```http
POST /api/interactions
Content-Type: application/json

{
  "medA": "Warfarin",
  "medB": "Ibuprofen"
}
```

**Response**:
```json
{
  "pair": ["Warfarin", "Ibuprofen"],
  "isPotentiallyRisky": true,
  "reason": "increased bleeding risk",
  "advice": "avoid combo; consult clinician; prefer acetaminophen for pain relief"
}
```

**Error Response**:
```json
{
  "error": "Invalid input",
  "details": ["Medication A is required"]
}
```

### FAQ API

**Request**:
```http
GET /api/faq?q=How%20can%20I%20improve%20medication%20adherence%3F
```

**Response**:
```json
{
  "answer": "Based on the available information: Medication adherence improves outcomes in diabetes...",
  "matches": [
    {
      "text": "Medication adherence improves outcomes in diabetes; missed doses are a leading cause of poor control.",
      "score": 0.9,
      "title": "Medication Adherence"
    }
  ]
}
```

## 🧪 Testing Requirements

### Unit Tests
**Required Test Coverage**:
- API client functions (mock network calls)
- Input validation logic
- Data model parsing
- Error handling scenarios

**Test Cases**:
```
✅ API Client Tests:
- Successful API calls return expected data
- Network errors are handled gracefully
- Invalid responses are handled
- Request formatting is correct

✅ Validation Tests:
- Empty input fields are rejected
- Identical medications are detected
- Whitespace is trimmed properly

✅ UI Tests (if time permits):
- Loading states display correctly
- Error messages appear as expected
- Results are formatted properly
```

### Manual Testing Checklist
**Interaction Checker**:
- [ ] Enter "Warfarin" + "Ibuprofen" → Shows high risk
- [ ] Enter "Aspirin" + "Vitamin C" → Shows low risk  
- [ ] Enter same medication → Shows appropriate message
- [ ] Test network error handling (airplane mode)
- [ ] Test with empty fields → Shows validation error

**FAQ Search**:
- [ ] Search "medication adherence" → Returns relevant results
- [ ] Search "drug interactions" → Returns relevant results
- [ ] Search nonsense query → Handles gracefully
- [ ] Test network error scenarios

**General**:
- [ ] App launches without crashes
- [ ] Navigation works smoothly
- [ ] Medical disclaimers are visible
- [ ] Loading states work correctly
- [ ] Error states are user-friendly

## 📱 Platform-Specific Guidance

### iOS (Swift/SwiftUI)
**Recommended Architecture**:
```
Sources/
├── App/
│   ├── MediphantApp.swift          # App entry point
│   └── ContentView.swift           # Main navigation
├── Features/
│   ├── InteractionChecker/
│   │   ├── InteractionCheckerView.swift
│   │   └── InteractionCheckerViewModel.swift
│   └── FAQ/
│       ├── FAQView.swift
│       └── FAQViewModel.swift
├── Services/
│   ├── APIClient.swift             # Network layer
│   └── Models.swift                # Data models
└── Common/
    ├── LoadingView.swift
    └── ErrorView.swift
```

**Key Technologies**:
- SwiftUI for UI
- Combine for reactive programming
- URLSession for networking
- MVVM architecture pattern

### Android (Kotlin)
**Recommended Architecture**:
```
app/src/main/java/com/mediphant/
├── MainActivity.kt
├── ui/
│   ├── interactions/
│   │   ├── InteractionCheckerFragment.kt
│   │   └── InteractionCheckerViewModel.kt
│   └── faq/
│       ├── FAQFragment.kt
│       └── FAQViewModel.kt
├── data/
│   ├── api/
│   │   ├── ApiService.kt
│   │   └── Models.kt
│   └── repository/
│       └── MediphantRepository.kt
└── di/
    └── AppModule.kt
```

**Key Technologies**:
- Jetpack Compose for UI
- Retrofit for networking
- ViewModel + LiveData/StateFlow
- Hilt for dependency injection

### React Native (TypeScript)
**Recommended Structure**:
```
src/
├── App.tsx
├── screens/
│   ├── InteractionChecker.tsx
│   └── FAQ.tsx
├── services/
│   ├── apiClient.ts
│   └── types.ts
├── components/
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
└── navigation/
    └── AppNavigator.tsx
```

**Key Technologies**:
- React Navigation for navigation
- React Query for API state management
- TypeScript for type safety
- Styled Components or NativeWind for styling

## 🚀 Getting Started

### 1. Set Up Development Environment
**iOS**:
- Install Xcode 15+
- Create new iOS project or Swift Package

**Android**:
- Install Android Studio
- Create new Kotlin project with Compose

**React Native**:
- Install React Native CLI
- Create new TypeScript project

### 2. Test API Connection
First, verify the web API is running:
```bash
cd web
npm run dev
# Verify: http://localhost:3000
```

Test endpoints manually:
```bash
# Test interaction endpoint
curl -X POST http://localhost:3000/api/interactions \
  -H "Content-Type: application/json" \
  -d '{"medA":"Warfarin","medB":"Ibuprofen"}'

# Test FAQ endpoint  
curl "http://localhost:3000/api/faq?q=medication+adherence"
```

### 3. Implementation Order
1. **Set up basic project structure**
2. **Create API client with one endpoint**
3. **Build basic UI for interaction checker**
4. **Add error handling and loading states**
5. **Implement FAQ search**
6. **Add navigation between screens**
7. **Polish UI and add medical disclaimers**
8. **Write basic tests**

## 📋 Deliverables

### Code Structure
```
mobile/
├── [ios/android/react-native]/     # Platform-specific code
│   ├── src/                        # Source code
│   ├── tests/                      # Unit tests
│   └── README.md                   # Setup instructions
└── TESTING.md                      # Test results and manual testing guide
```

### Documentation Required
1. **README.md**: Setup and build instructions
2. **TESTING.md**: Test results and manual testing checklist
3. **Screenshots**: 3-4 key screens showing the app in action

## ⚠️ Important Notes

### Medical Disclaimers
**Required Text** (must be prominently displayed):
> "For informational purposes only. Not medical advice. Always consult your healthcare provider about medication interactions."

### Network Configuration
- **Development**: Point to `http://localhost:3000`
- **Production**: Update base URL for deployed API
- Handle network errors gracefully
- Consider offline states (basic error messaging)

### Time Management
- **Core functionality first**: Basic API integration and UI
- **Polish second**: Error handling, loading states, navigation
- **Nice-to-haves**: Animations, caching, advanced error recovery

### Shortcuts Allowed
- Use platform default styling initially
- Mock/skip complex state management
- Basic error messages are sufficient
- Single screen navigation if needed to save time

## 🎯 Success Criteria

**Minimum Viable Product**:
- [ ] App launches and displays basic UI
- [ ] Can check medication interactions via API
- [ ] Can search FAQ via API  
- [ ] Shows results clearly with risk indication
- [ ] Handles basic errors gracefully
- [ ] Medical disclaimers are present

**Polished Experience**:
- [ ] Professional, clean UI design
- [ ] Smooth navigation between features
- [ ] Loading states for all API calls
- [ ] Comprehensive error handling
- [ ] Unit tests for core functionality
- [ ] Responsive design for different screen sizes

This mobile app will complete the end-to-end Mediphant experience, demonstrating full-stack development capabilities from web APIs to native mobile applications! 📱
