# Britishce44 WebRTC End-to-End Test Plan

## Prerequisites
- 2+ browsers (Chrome + Firefox recommended)
- Docker services running locally
- Camera + microphone access

## Test 1: Basic Connectivity

### Steps:
1. Open http://localhost:80 in Browser A
2. Log in as: `britishce44@gmail.com` / `admin123`
3. Navigate to Classroom 1
4. Verify: WebRTC connects (green "Live" indicator), local video tile appears
5. Open http://localhost:80 in Browser B (incognito)
6. Log in as: `suhair.almojahid` / `teacher123`
7. Navigate to Classroom 1
8. Verify: Both users see each other's tiles. Audio/video flows.

### Expected:
```
Browser A: Sees own tile + Browser B's tile (with video)
Browser B: Sees own tile + Browser A's tile (with video)
Status bar: "🟢 Live"
```

## Test 2: Mute / Camera Controls

### Steps:
1. In Browser A, click the mic button (🔇)
2. Verify: Mic indicator tile shows red dot, Browser B hears silence
3. Click camera button (🚫📹)
4. Verify: Video freezes, avatar appears
5. Re-enable both
6. Verify: Audio/video resumes

## Test 3: Screen Share

### Steps:
1. Browser A (teacher): Click 💻 Share button in controls bar
2. Select a window to share in the browser dialog
3. Verify: Screen share tile appears for Browser B
4. Click "Stop Share"
5. Verify: Screen share ends

## Test 4: Chat

### Steps:
1. Click 💬 button in header
2. Type a message and send
3. Verify: Message appears in Browser B's chat panel
4. Browser B replies
5. Verify: Message appears in Browser A's chat panel

## Test 5: Hand Raise

### Steps:
1. Browser B clicks ✋ Hand in controls bar
2. Verify: Floating hand animation appears on Browser B's tile (visible to both users)

## Test 6: Whiteboard

### Steps:
1. Click whiteboard area
2. Select pen tool (✏️)
3. Draw on the canvas
4. Switch to rectangle (⬜), draw a rectangle
5. Select text tool (🔤), click and type
6. Change color via color picker
7. Test undo (↩)
8. Test clear (🗑)

## Test 7: Emoji Reactions

### Steps:
1. Click 👍 React in controls bar
2. Select an emoji from the picker
3. Verify: Emoji floats up with animation. Chat message shows "User reacted 👍"

## Test 8: Timer

### Steps:
1. Click ⏱ Timer in header
2. Study mode: Set 25 min, Start
3. Verify: Circular progress decreases
4. Click Pause, then Resume
5. Switch to Break mode
6. Minimize timer (─), restore by clicking
7. Close timer

## Test 9: Monkey Bot Quiz

### Steps:
1. Click 🐵 Quiz in controls bar
2. Verify: Quiz popup appears with 5 questions, 15s countdown
3. Answer questions
4. Verify: Score updates, progress dots advance
5. After all questions: "Quiz Complete!" with score
6. Click "Play Again" to restart

## Test 10: Learning Tools Modal

### Steps:
1. Click 📱 More in controls bar
2. Verify: 12 tool cards appear (Calculator, Notes, Dictionary, etc.)
3. Click outside to close
4. Verify: Modal closes with scale animation

## Test 11: Teacher Desktop Panel

### Steps:
1. Log in as teacher (`suhair.almojahid`)
2. Click 👨‍🏫 Manage in controls bar
3. Verify: Panel slides in from right
4. Click "Mute All"
5. Verify: All students muted
6. Click "Lock" to lock room
7. Click spotlight on a student
8. Hover over a student → Eject button appears

## Test 12: Poll

### Steps:
1. Teacher: Click 📊 Poll in controls bar
2. Enter question "What is 2+2?"
3. Add options: 3, 4, 5, 6
4. Click "Launch Poll"
5. Student: Verify poll appears, select an option
6. Verify: Live results bar chart updates immediately

## Test 13: Recording

### Steps:
1. Teacher: Click 🔴 Record in controls bar
2. Verify: Recording indicator appears in header (pulsing red dot, timer)
3. Click ⏸ Pause
4. Verify: Timer pauses
5. Click ▶ Resume
6. Verify: Timer resumes
7. Click ⏹ Stop
8. Verify: Recording indicator disappears

## Test 14: Breakout Rooms

### Steps:
1. Teacher: Click 🏠 Breakout in header
2. Enter room name "Discussion Group 1"
3. Set 15 min auto-close
4. Click Create
5. Verify: Breakout room appears in list
6. Student: Click the breakout room name to join
7. Verify: "Breakout" badge appears
8. Click "Leave Breakout" to return

## Test 15: Responsive / RTL

### Steps:
1. Resize browser to mobile width (375px)
2. Verify: Controls bar buttons remain visible
3. Edit ClassroomInterior: Set dir="rtl"
4. Verify: Layout flips right-to-left
5. Set dir="ltr" to restore

---

## Test Results

| Test | Status | Notes |
|------|--------|-------|
| 1. Basic Connectivity | `___/___` | |
| 2. Mute/Camera | `___/___` | |
| 3. Screen Share | `___/___` | |
| 4. Chat | `___/___` | |
| 5. Hand Raise | `___/___` | |
| 6. Whiteboard | `___/___` | |
| 7. Emoji Reactions | `___/___` | |
| 8. Timer | `___/___` | |
| 9. Monkey Bot | `___/___` | |
| 10. Learning Tools | `___/___` | |
| 11. Teacher Panel | `___/___` | |
| 12. Polls | `___/___` | |
| 13. Recording | `___/___` | |
| 14. Breakout Rooms | `___/___` | |
| 15. Responsive/RTL | `___/___` | |

## Pass Criteria: All 15 tests pass
