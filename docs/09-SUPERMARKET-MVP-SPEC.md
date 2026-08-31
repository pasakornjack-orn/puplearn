# Supermarket MVP Specification

## Goal
Build one complete, polished Supermarket world that proves the core product loop:
Listen/Read → Understand → Think → Calculate → Use English.

## Target
Children aged 3–7, with difficulty adapted by skill level.

## Core Mission Flow
1. Child enters Supermarket.
2. Mascot introduces the mission.
3. Instruction is shown and/or spoken.
4. Child finds and selects products.
5. Basket updates visually.
6. System checks task constraints.
7. If needed, give a gentle hint.
8. Child completes a short English interaction.
9. Mission Complete.
10. Progress is saved.

## First Playable Vertical Slice
Mission:
"ซื้อแปรงสีฟัน 1 อัน และยาสีฟัน 1 หลอด มีเงิน 20 บาท"

Flow:
- Bingo gives Thai instruction.
- Child selects products.
- Peter helps if the selected items do not satisfy the mission.
- A-Chi shows total price and budget.
- Pillow asks: "What did you buy?"
- Child chooses: Toothbrush / Toothpaste / Soap.
- Mission completes and progress is stored.

## Difficulty Levels

### Level 1 — Listen & Find
- Audio-first
- One target item
- No price calculation
- 3–4 visible choices

### Level 2 — Word & Object
- Thai word + optional audio
- Match word to object
- 4–5 visible choices

### Level 3 — Quantity
- Select item + quantity
- Counting 1–5
- Example: "หยิบนม 2 กล่อง"

### Level 4 — Two-Step Mission
- Two required items
- Simple prices
- Child must satisfy both requirements

### Level 5 — Budget Mission
- Two or more items
- Must stay within budget
- Simple addition / comparison

### Level 6 — Applied Reasoning
- Less direct instruction
- Example: "ซื้อของสำหรับอาหารเช้า 2 อย่าง โดยใช้เงินไม่เกิน 30 บาท"

## Initial Mission Types
1. Find one item
2. Find two items
3. Match Thai word to object
4. Select quantity
5. Count objects
6. Choose cheaper item
7. Choose more expensive item
8. Buy within budget
9. Calculate total
10. Calculate money left
11. Choose correct category
12. Find the missing item
13. Follow a two-step instruction
14. Choose items for a real-life purpose
15. English object recognition
16. English category recognition
17. Mixed Thai + Math
18. Mixed Logic + English

## Hint System
Hint 1: Repeat instruction.
Hint 2: Highlight the relevant shelf/category.
Hint 3: Reduce distractors.
Hint 4: Mascot gives a simple clue.

Never immediately reveal the answer.

## Success Feedback
- Short celebration
- Mascot reaction
- 1–3 stars optional
- Avoid excessive rewards or endless loops

## Failure / Retry
Do not show harsh "wrong" feedback.
Use gentle language such as:
- "ลองดูอีกครั้งนะ"
- "เงินของเราพอไหมนะ?"
- "ยังขาดของอีกหนึ่งอย่าง"

## Progress Data to Save
- mission_id
- mission_type
- difficulty
- skills_used
- attempts
- hints_used
- completion_time
- completed
- selected_answers
- skill_result_summary

## Out of Scope for V1
- Voice recognition
- Multiplayer
- School dashboard
- Multiple worlds
- Complex currency system
- In-app ads
