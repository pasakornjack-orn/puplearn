# Antigravity Prompt — Build Mission 00 (Level A)

Read the updated /docs first.

Do NOT modify or remove Mission 07.
Mission 07 remains our Level D / advanced reference mission.

## Goal
Add a new Level A prototype for a 3-year-old:

Mission 00 — Find the Apple.

This mission is designed for a child who cannot yet read.

## Core Flow
1. Bingo introduces:
"ช่วย Bingo หาแอปเปิลหน่อย!"

2. The Start button should use a subtle child-friendly attention animation:
- gentle pulse or bounce
- 1–2 cycles
- not continuous flashing

3. Shopping screen:
Show 4 large familiar product objects:
- Apple
- Banana
- Soap
- Toothbrush

Do NOT show:
- prices
- budget
- calculations
- arithmetic symbols

4. Exploration behavior:
The child is allowed to tap any object.

If a non-target object is tapped:
- animate it gently
- do not show a harsh wrong state
- optionally identify the object
- keep the child in the mission
- Bingo may gently remind the child to find the apple

The purpose is to support curiosity, not punish exploration.

5. Correct Apple selection:
- animate the apple moving into a visually recognizable toy basket
- the basket must look like a basket, not a generic panel
- Bingo gives positive feedback

6. Pillow English interaction:
Introduce only the single word:
"Apple!"

Do NOT ask a multiple-choice English question for this level.

7. Mission complete:
Simple short celebration.
Offer:
- play again
- return

## Architecture
- Mission 00 and Mission 07 must use the same reusable mission system where practical.
- Add a difficulty/level field if one does not exist.
- Do not duplicate the whole app just for Mission 00.
- Keep mission data separate from UI.
- Preserve all existing Mission 07 behavior.

## Important UX
- mobile-first
- large touch targets
- minimal text
- audio-ready
- no reading required to understand the interaction
- curiosity-friendly
- no harsh wrong feedback

## Test
Test Mission 00 end-to-end on mobile.
Also verify Mission 07 still works unchanged.

## Deliverables
1. Summarize Mission 00 implementation.
2. Explain how Level A differs from Level D.
3. Confirm Mission 07 regression test passed.
4. Update /docs/08-CURRENT-STATUS.md.

Do not add other missions yet.
