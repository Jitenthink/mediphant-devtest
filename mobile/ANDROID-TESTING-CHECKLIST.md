# Android App Testing Checklist

## 📱 Pre-Testing Setup

### Environment Requirements
- [ ] Web API running on `http://192.168.1.30:3000`
- [ ] Android device/emulator connected
- [ ] APK installed: `app/build/outputs/apk/debug/app-debug.apk`
- [ ] Network connectivity between device and host machine

### Build Verification
- [ ] `./gradlew assembleDebug` completes successfully
- [ ] APK generated without errors
- [ ] App installs on target device/emulator

## 🧪 Functional Testing

### UI Components Testing
- [ ] **TextField**: Can type custom questions
- [ ] **Sample Questions**: All 4 questions are clickable
  - [ ] "How can I improve medication adherence?"
  - [ ] "What are high-risk drug interactions?"
  - [ ] "How should I manage my medication list?"
  - [ ] "What tools can help with taking medications?"
- [ ] **Button**: "Get Answer" button is clickable
- [ ] **Text Display**: Results area shows responses

### Sample Questions Testing
- [ ] **Tap Sample Question 1**: 
  - [ ] TextField populates with question
  - [ ] Tap "Get Answer" → Shows FAQ response
  - [ ] Response includes answer and matches with scores
- [ ] **Tap Sample Question 2**:
  - [ ] TextField populates with question
  - [ ] Tap "Get Answer" → Shows FAQ response
  - [ ] Response includes answer and matches with scores
- [ ] **Tap Sample Question 3**:
  - [ ] TextField populates with question
  - [ ] Tap "Get Answer" → Shows FAQ response
  - [ ] Response includes answer and matches with scores
- [ ] **Tap Sample Question 4**:
  - [ ] TextField populates with question
  - [ ] Tap "Get Answer" → Shows FAQ response
  - [ ] Response includes answer and matches with scores

### Custom Input Testing
- [ ] **Type Custom Question**: Enter "What are side effects of aspirin?"
- [ ] **Submit Custom Question**: Tap "Get Answer"
- [ ] **Verify Response**: Shows formatted answer with matches
- [ ] **Empty Input**: Tap "Get Answer" with empty field → Shows error
- [ ] **Special Characters**: Test with punctuation and numbers

### API Integration Testing
- [ ] **Network Connection**: App connects to `http://192.168.1.30:3000`
- [ ] **API Endpoint**: Calls `/api/faq?q={query}` correctly
- [ ] **JSON Parsing**: Response parsed correctly with kotlinx-serialization
- [ ] **Error Handling**: Network errors show user-friendly messages
- [ ] **Loading State**: Shows "Loading..." during API calls

## 🔧 Technical Testing

### Network Security
- [ ] **HTTP Traffic**: Cleartext HTTP allowed for development domains
- [ ] **Network Config**: `network_security_config.xml` allows `192.168.1.30`
- [ ] **Manifest**: Internet permission granted

### Ktor Integration
- [ ] **HTTP Client**: Ktor client initializes correctly
- [ ] **Content Negotiation**: JSON serialization configured
- [ ] **Request Building**: Query parameters added correctly
- [ ] **Response Handling**: FAQResponse data class deserializes

### UI State Management
- [ ] **Loading State**: Shows loading indicator during API calls
- [ ] **Error State**: Displays error messages for failed requests
- [ ] **Success State**: Shows formatted results
- [ ] **Input State**: TextField updates correctly

## 📊 Performance Testing

### Response Times
- [ ] **Sample Questions**: Response time < 2 seconds
- [ ] **Custom Questions**: Response time < 2 seconds
- [ ] **Network Errors**: Error display < 1 second

### Memory Usage
- [ ] **App Launch**: No memory leaks on startup
- [ ] **Multiple Requests**: Memory stable after multiple API calls
- [ ] **Background**: App handles background/foreground transitions

## 🐛 Error Scenarios

### Network Errors
- [ ] **No Internet**: Shows appropriate error message
- [ ] **Server Down**: Shows connection error
- [ ] **Timeout**: Shows timeout error after reasonable delay
- [ ] **Invalid Response**: Handles malformed JSON gracefully

### Input Validation
- [ ] **Empty Query**: Shows validation error
- [ ] **Very Long Query**: Handles long input appropriately
- [ ] **Special Characters**: Handles Unicode and special chars

## ✅ Expected Results

### Successful API Response Format
```
Answer: [Generated answer based on query]

Matches:
- [Match 1 text] (0.85)
- [Match 2 text] (0.78)
- [Match 3 text] (0.72)
```

### Sample Question Expected Responses
1. **"How can I improve medication adherence?"**
   - Should return information about pill organizers, reminders, etc.
2. **"What are high-risk drug interactions?"**
   - Should return information about anticoagulants, NSAIDs, etc.
3. **"How should I manage my medication list?"**
   - Should return information about keeping updated lists
4. **"What tools can help with taking medications?"**
   - Should return information about adherence tools

## 🚨 Known Issues & Workarounds

### Development Environment
- **Pinecone API**: Falls back to local text matching (expected)
- **Network IP**: May need to update if IP changes
- **Emulator**: Use `10.0.2.2:3000` for emulator testing

### Testing Notes
- **Fallback Mode**: API uses local embeddings when Pinecone unavailable
- **Text Matching**: Simple keyword matching for demo purposes
- **Network Security**: HTTP allowed only for development domains

## 📝 Test Results Template

```
Test Date: ___________
Device: _____________
Android Version: _____
Web API Status: ______

✅ Passed Tests: __/__
❌ Failed Tests: __/__
⚠️ Issues Found: __

Notes:
- 
- 
- 
```

## 🎯 Acceptance Criteria

The Android app passes testing if:
- [ ] All sample questions work correctly
- [ ] Custom input works
- [ ] API integration successful
- [ ] Error handling appropriate
- [ ] UI responsive and intuitive
- [ ] No crashes or memory leaks
- [ ] Network security configured correctly

---

**⚠️ Medical Disclaimer**: This app is for demonstration purposes only. Results are not medical advice.
