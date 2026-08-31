# Current Status

## Product Stage
Visual V2 migration

## North Star
/docs/reference/visual-v2-north-star.png

## DONE
- Mission 07 Level D prototype
- Level A validation
- Level A audio
- Level A mission types
- mascot asset system
- product asset system
- content system
- first layout diversification
- real-child testing
- **Visual V2 Migration (In Progress)**:
  - Deployed the new Visual V2 Shell matching the "Soft 3D Toy World" North Star direction.
  - Built a new Supermarket `home` screen with a large Bingo hero and clear start CTA.
  - Rebuilt `mission_select` screen with rounded card UI, prominent icons, and session shortcut.
  - Implemented the V2 Shared Header (Home icon, Progress dots, Audio toggle icon).
  - Refactored `MascotBubble` into a V2 free-floating style (removed circular portrait constraints, added soft shadows, pointer arrow, and dynamic borders).
  - Integrated final V2 environment assets (`supermarket-home-bg.png`, `mission-select-bg.png`, `supermarket-interior-bg.png`) into the V2 shell using responsive positioning and readability overlays.
  - **QA + Interaction Pass Completed:**
    - Cleaned up Home screen duplication and aligned hero layout.
    - Fixed Mission Selection `z-index` bug that made cards invisible.
    - Improved `MascotBubble` layout logic to perfectly `object-contain` tall assets (like Pillow) without clipping.
    - Upgraded V2 Header: Real Audio toggle (mutes TTS system-wide) and precise Session progress dots (hides during single-mission play).
    - Polished Success Screen secondary navigation with matching V2 Home SVG icons.
  - **Final Micro-Interaction Polish:**
    - Increased mascot scale presence (by ~15-25%) in `MascotBubble` while preserving safe layout limits.
    - Home Screen: Enlarged Bingo by ~10% (`w-[65%]`), added a realistic breathing animation with a pulsing ground shadow, and animated subtle drifting clouds in the background sky.
    - Buttons: Added `hover:scale` and `active:scale-95` tap feedback to all CTA buttons, Header buttons, and Mission Select cards.
    - Added an occasional gentle pulse (`animate-pulse-occasional`) to the primary "เริ่มเล่น" button.
    - Added CSS `prefers-reduced-motion` fallbacks to ensure accessibility.
  - Mission 00 and Mission 07 remain functionally identical and regression-tested.

## 2. V2 Visual Migration (Phase 2)
  - **Phase 2: Refactoring to Modular Layout (COMPLETED)**
    - Replaced the rigid `product-display-v2.png` 4-slot image approach with a new modular CSS `ProductDisplayV2` component (cream/pastel theme).
    - Implemented a new `ProductSlot` architecture that dynamically generates a grid over the CSS base without relying on background perspective.
    - Simplified correct-item animation: object flies to basket, disappears upon landing, triggers a basket bounce and sparkle effect.
    - **Mascot Layout System Overhaul**: Rebuilt `MascotBubble` with reusable variants (`mascot-top-left`, `mascot-left`, `mascot-celebrate`).
    - Integrated mascots directly into the scene for Gameplay, Vocabulary, and Success screens instead of pasting them in generic headers.
    - **Structural UI/UX Cleanup**:
      - Streamlined Home screen: brought mascot closer to the main CTA.
      - Refactored Mission Select: replaced long lists with grouped, expandable sections (Level A and Advanced), and used final image assets.
      - Removed redundant Pre-Mission intro screen; gameplay starts immediately.
      - Cleaned up Success Screen: removed overlapping/redundant 3D stars and typography, yielding a clear hierarchy (Mascot → Celebration Banner → Actions).
    - Successfully integrated and tested all components for `Mission 00 (Find Apple)` and `Mission A2 (Find Banana)`.
    - Mission 07 remains functionally identical and has passed regression testing.
    - **Second Structural & Composition Pass**:
    - **Third Polish Pass**:
    - **Third Polish Pass**:
      - Gameplay Scene: Replaced `mascot-left-floating` with `mascot-gameplay-v2` to decouple the speech bubble, moving it into the safe upper-left area while pinning a much larger Bingo (scaled to 12rem/48px) at the bottom-left, allowing him to layer behind the basket if necessary. Moved `.basket-target` directly to the `img` element for more accurate fly-to-basket targets.
      - Vocabulary Screen: Shrunk the target object significantly to balance with a newly enlarged Pillow mascot (also using the decoupled `mascot-gameplay-v2` variant).
      - Success Screen: Fully eliminated the heavy white card panel. The scene is now a full-screen composition floating directly over the blurred background, matching the clean modern aesthetic.
      - Mission Select: Localized titles to Thai (เลือกภารกิจ / ด่าน), reduced vertical gap spacing, and implemented dynamic visual states (Locked, Current, Completed) using `localStorage`.
      - Home Screen: Added the top-right Sound toggle alongside the new Settings icon. Slightly adjusted Mascot scaling/margin again for maximum tightness.
## CURRENT
Rebuild PupLearn presentation layer toward Visual V2 North Star.

## FIRST V2 SCOPE
1. World/Home
2. Mission Selection
3. Shared Header
4. Mascot Speech Component
5. Visual Progress Component

## NEXT
After V2 shell approval:
1. Rebuild Find One template
2. Rebuild Color Hunt template
3. Rebuild Pick Two template
4. Rebuild Vocabulary Teaching
5. Rebuild Success
6. Child test again

## RULE
Preserve validated learning logic while rebuilding presentation.
