# Antigravity Build Prompt — First Vertical Slice

You are the lead engineer for the PupLearn project.

Before coding:
1. Read every file in `/docs`.
2. Treat `/docs` as the product source of truth.
3. Do not invent features outside the MVP scope.
4. If implementation conflicts with the docs, follow the docs.

## Task
Build the FIRST PLAYABLE VERTICAL SLICE only.

### Mission
"ซื้อแปรงสีฟัน 1 อัน และยาสีฟัน 1 หลอด มีเงิน 20 บาท"

The flow must be playable end-to-end:

1. Child enters the Supermarket.
2. Bingo introduces the Thai mission.
3. Show a small set of products with clear price tags.
4. Child selects or drags items into a basket.
5. Basket shows selected items.
6. A-Chi shows:
   - Budget: 20 THB
   - Current total
   - Remaining money
7. The system validates:
   - toothbrush selected
   - toothpaste selected
   - total price <= 20
8. If invalid, give a gentle hint.
9. If valid, Pillow asks:
   "What did you buy?"
10. Child answers using simple visual/text choices.
11. Show Mission Complete.
12. Save a simple local progress result.

## UX Requirements
- Designed for children age 3–7.
- Large touch targets.
- Minimal text.
- Beginner-friendly.
- Clear visual hierarchy.
- No harsh error message.
- No addictive reward loops.
- Mobile-first but responsive on desktop.
- Follow Soft 3D Toy World visual direction from docs.
- Use temporary placeholder assets if final artwork is not yet available.

## Technical Requirements
- Keep mission data separate from UI components.
- Do not hard-code all future missions into screens.
- Create a reusable mission data structure.
- Keep components modular.
- Use local/mock data first.
- No payment.
- No school dashboard.
- No voice recognition.
- No authentication unless already required by the existing project.

## Deliverables
After implementation:
1. Run the app.
2. Test the full mission in browser.
3. Fix obvious UI/runtime errors.
4. Summarize files created/changed.
5. Update `/docs/08-CURRENT-STATUS.md` with:
   - DONE
   - CURRENT
   - NEXT
   - KNOWN BUGS

## Important
Do not proceed to Mission 02, 03, etc.
The goal is one polished vertical slice, not breadth.
