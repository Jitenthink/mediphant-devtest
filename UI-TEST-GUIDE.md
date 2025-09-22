# 🧪 UI Testing Guide for Mediphant DevTest

## 🚀 Getting Started

1. **Start the server**: `cd web && npm run dev`
2. **Open browser**: Navigate to `http://localhost:3000`

## 📋 Test Plan Overview

### ✅ Homepage Tests (`/`)
1. Verify navigation cards are visible
2. Click "Check Interactions →" → Should go to `/interactions`
3. Click "Ask Questions →" → Should go to `/faq`
4. Check responsive design on mobile

---

## 🔄 Interaction Checker Tests (`/interactions`)

### Test Case 1: High-Risk Warfarin + Ibuprofen
```
Steps:
1. Go to http://localhost:3000/interactions
2. Enter "Warfarin" in first field
3. Enter "Ibuprofen" in second field
4. Click "Check Interaction"

Expected Results:
✅ Red "Potentially Risky" badge appears
✅ Reason: "increased bleeding risk"
✅ Advice: "avoid combo; consult clinician; prefer acetaminophen for pain relief"
✅ Medications shown: "Warfarin + Ibuprofen"
✅ Entry appears in "Recent Checks" section
```

### Test Case 2: High-Risk Metformin + Contrast Dye
```
Steps:
1. Clear previous inputs
2. Enter "Metformin" in first field
3. Enter "Contrast Dye" in second field
4. Click "Check Interaction"

Expected Results:
✅ Red "Potentially Risky" badge
✅ Reason: "lactic acidosis risk around imaging contrast"
✅ Advice: "hold metformin per imaging protocol"
```

### Test Case 3: Safe Combination
```
Steps:
1. Enter "Aspirin" in first field
2. Enter "Vitamin C" in second field
3. Click "Check Interaction"

Expected Results:
✅ Green "No Known High Risk" badge
✅ Reason: "no known high-risk interaction in our database"
✅ Advice contains: "consult your healthcare provider"
```

### Test Case 4: Validation Tests
```
Test 4a - Empty Fields:
Steps:
1. Leave both fields empty
2. Click "Check Interaction"
Expected: ❌ Error: "Both medication fields are required"

Test 4b - One Empty Field:
Steps:
1. Enter "Warfarin" in first field
2. Leave second field empty
3. Click "Check Interaction"
Expected: ❌ Error: "Both medication fields are required"

Test 4c - Same Medication:
Steps:
1. Enter "aspirin" in first field
2. Enter "  ASPIRIN  " in second field (with spaces/caps)
3. Click "Check Interaction"
Expected: ❌ Error: "Please enter two different medications"
```

### Test Case 5: Case Insensitivity
```
Steps:
1. Enter "LISINOPRIL" (all caps)
2. Enter "spironolactone" (lowercase)
3. Click "Check Interaction"

Expected Results:
✅ Still detects high-risk interaction
✅ Red "Potentially Risky" badge
✅ Reason: "hyperkalemia risk"
```

### Test Case 6: Recent Checks History
```
Steps:
1. Perform 3-4 different interaction checks
2. Scroll down to "Recent Checks" section

Expected Results:
✅ Shows last 5 checks with timestamps
✅ Each entry shows: medications + risk level + time
✅ Most recent appears at the top
✅ Risk levels show as colored badges (red/green)
```

---

## ❓ FAQ System Tests (`/faq`)

### Test Case 1: Medication Adherence Query
```
Steps:
1. Go to http://localhost:3000/faq
2. Type: "How can I improve medication adherence?"
3. Click "Get Answer"

Expected Results:
✅ Answer mentions: diabetes outcomes, missed doses
✅ Supporting Information section appears
✅ Shows "Medication Adherence" as title
✅ Relevance score shows (should be 80%)
✅ Answer includes fallback note about OpenAI
```

### Test Case 2: Sample Questions
```
Steps:
1. Click on sample question: "How can I improve medication adherence?"
2. Verify text fills the input field
3. Click "Get Answer"

Expected Results:
✅ Query field auto-populated
✅ Same results as manual typing
```

### Test Case 3: Drug Interactions Query
```
Steps:
1. Clear previous query
2. Type: "high risk drug interactions"
3. Click "Get Answer"

Expected Results:
✅ Should match "High-Risk Interactions" content
✅ Answer mentions: anticoagulants, NSAIDs, ACE inhibitors
✅ Supporting info about drug interaction types
```

### Test Case 4: Medication Management
```
Steps:
1. Type: "medication list management"
2. Click "Get Answer"

Expected Results:
✅ Matches "Medication Management" content
✅ Answer about keeping up-to-date lists
✅ Mentions clinic/hospital visits
```

### Test Case 5: Professional Consultation
```
Steps:
1. Type: "when to consult pharmacist"
2. Click "Get Answer"

Expected Results:
✅ Matches "Professional Consultation" content
✅ Answer about consulting when in doubt
✅ Mentions incomplete online lists
```

### Test Case 6: Validation Tests
```
Test 6a - Empty Query:
Steps:
1. Leave question field empty
2. Click "Get Answer"
Expected: ❌ Error: "Please enter a question"

Test 6b - Very Long Query:
Steps:
1. Enter a very long question (200+ characters)
2. Click "Get Answer"
Expected: ✅ Should still process normally
```

---

## 📱 Responsive Design Tests

### Test on Different Screen Sizes
```
Steps:
1. Open browser dev tools (F12)
2. Test various screen sizes (tablet, mobile, desktop)
3. Test both pages

Expected Results:
✅ Forms stack vertically on smaller screens
✅ Buttons are appropriately sized
✅ Text remains readable
✅ Navigation works on all screen sizes
✅ Result cards adapt to screen width
```

---

## 🔧 API Direct Testing

### Manual API Tests (using curl/browser)

**Interaction API:**
```bash
# Test in terminal:
curl -X POST http://localhost:3000/api/interactions \
  -H "Content-Type: application/json" \
  -d '{"medA":"Warfarin","medB":"Ibuprofen"}'

Expected JSON response with isPotentiallyRisky: true
```

**FAQ API:**
```bash
# Test in terminal:
curl "http://localhost:3000/api/faq?q=medication+adherence"

Expected JSON with answer and matches array
```

**Browser API Tests:**
```
Visit in browser:
- http://localhost:3000/api/faq?q=medication+adherence
- http://localhost:3000/api/faq?q=drug+interactions

Should see JSON responses, not error pages
```

### Expected API Responses

**Interaction API Success:**
```json
{
  "pair": ["Warfarin", "Ibuprofen"],
  "isPotentiallyRisky": true,
  "reason": "increased bleeding risk",
  "advice": "avoid combo; consult clinician; prefer acetaminophen for pain relief"
}
```

**FAQ API Success:**
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

---

## 🎯 Performance & UX Tests

### Loading States
```
Steps:
1. Open browser dev tools → Network tab
2. Set network to "Slow 3G" throttling
3. Submit forms and observe loading states

Expected Results:
✅ "Checking..." or "Getting answer..." appears
✅ Submit buttons are disabled during loading
✅ No double-submissions possible
```

### Error Handling
```
Steps:
1. Stop the development server
2. Try submitting forms

Expected Results:
✅ Clear error messages appear
✅ No browser crashes or white screens
✅ User can retry when server comes back
```

---

## ✅ Success Criteria Checklist

**Interaction Checker:**
- [ ] All 3 high-risk combinations detected
- [ ] Safe combinations return low risk
- [ ] Case insensitivity works
- [ ] Input validation prevents errors
- [ ] Recent checks history updates
- [ ] Responsive design works on all screen sizes

**FAQ System:**
- [ ] All 6 corpus topics can be queried
- [ ] Fallback search returns relevant results
- [ ] Sample questions work correctly
- [ ] Results show relevance scores
- [ ] Empty queries are handled gracefully
- [ ] Long queries work without issues

**General:**
- [ ] Navigation between pages works
- [ ] Medical disclaimers are prominent
- [ ] No JavaScript errors in console
- [ ] Fast page load times
- [ ] Professional, accessible design

---

## 🐛 Common Issues & Solutions

**FAQ returns "no information":**
- This is expected without OpenAI/Pinecone configured
- Fallback mode should still find text matches
- Check that `retrieval/fallback-embeddings.json` exists

**Interaction checker not working:**
- Check browser console for JavaScript errors
- Verify server is running on port 3000
- Test API directly with curl

**Responsive layout issues:**
- Use browser dev tools to test different screen sizes
- Check that Tailwind CSS classes are working
- Verify no horizontal scrolling occurs

**Performance issues:**
- Check Network tab for slow requests
- Verify no memory leaks in React components
- Test with browser throttling enabled
