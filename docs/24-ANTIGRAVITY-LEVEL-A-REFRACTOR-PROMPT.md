# Antigravity Prompt — Refactor Level A for Visual Variety

Read the updated /docs first.

Do NOT add new educational levels.
Do NOT modify Mission 07 logic.

## Goal
Refactor Level A so missions can use different layout templates instead of reusing the exact same screen structure.

## Required Templates
Implement support for:

1. Find One Grid
2. Color Hunt
3. Pick Two

Use:
- Mission 00 / A2 → Find One Grid
- A3 → Color Hunt
- A4 → Pick Two

## A3 — Important Change
A3 must no longer behave like "find Apple".

Change it to a real color-recognition mission.

Target:
"ช่วย Bingo หาของสีแดงหน่อย!"

Use a mixed set of objects where color is the learning concept.

Until new assets are available, use existing assets/placeholders temporarily, but structure the mission so it can later use:
- red ball
- red car
- strawberry
- blue object
- yellow object
- green object

The correct answer should be based on product color metadata, not a hardcoded Apple ID.

## A4 — Pick Two
Use a layout that visually communicates:
- child needs 2 selections
- basket can hold 2 targets
- selected count/state is clear

Do not make it look identical to Find One.

## Data Model
Product data should support metadata such as:
- category
- color
- displayName
- image
- englishWord

Mission data should support:
- missionType
- targetCategory
- targetColor
- targetCount
- layoutTemplate

Do not hardcode future mission logic into components.

## Preserve
- Level A audio behavior
- curiosity-friendly taps
- mascot roles
- current product/mascot asset architecture
- Mission 07 behavior

## Deliverables
1. Implement the 3 layout templates.
2. Refactor A3 to be color-driven.
3. Refactor A4 to use Pick Two presentation.
4. Confirm Mission 00 and A2 still work.
5. Confirm Mission 07 regression passes.
6. Update /docs/08-CURRENT-STATUS.md.

Do not add more missions yet.
