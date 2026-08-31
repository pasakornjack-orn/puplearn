# Antigravity Prompt — Begin PupLearn Visual V2

Read all updated /docs first.

The visual North Star is:
`/docs/reference/visual-v2-north-star.png`

Also read:
- 25-VISUAL-DESIGN-SYSTEM-V2.md
- 26-SCREEN-TEMPLATES-V2.md
- 27-VISUAL-V2-MIGRATION-PLAN.md

## Goal
Begin Visual V2 without changing validated learning logic.

## Important
Do NOT add new missions.
Do NOT rewrite the mission engine.
Do NOT change Mission 07 logic.
Do NOT change Level A learning rules.

## First implementation scope ONLY
Build the V2 shell:
1. Supermarket World / Home screen
2. Mission Selection screen
3. Shared V2 header
4. Shared mascot speech component
5. Shared visual progress component

## Visual Target
Match the North Star direction:
- illustrated Soft 3D Toy World
- bright, playful, premium
- larger mascot presence
- environmental context
- rounded game-like components
- less generic white-card UI
- mobile-first

## Architecture
Keep components reusable. Do not hardcode each mission page independently.

## Temporary Assets
If a final environment/background asset does not exist yet:
- use a clean placeholder / CSS composition
- clearly identify which final visual assets are still required
- do not fabricate complex final assets inside code

## Preserve
- current fonts: Anuphan + Fredoka
- current audio system
- product data
- mascot data
- progress storage

## Test
After implementation:
- Mission selection must still open existing missions
- Mission 00 must still be playable
- Mission 07 must still open and work

## Deliverables
1. Show what V2 shell was built.
2. List files/components changed.
3. List missing final visual assets.
4. Confirm Mission 00 and Mission 07 regression tests.
5. Update /docs/08-CURRENT-STATUS.md.

Stop after the V2 shell. Do not rebuild all mission screens yet.
