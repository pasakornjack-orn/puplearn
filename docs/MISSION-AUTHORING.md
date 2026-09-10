# PupLearn Level A Mission Authoring Workflow

This guide details the standard operating procedure for creating new Level A missions in PupLearn. By following this standard, AI agents and human creators can reliably produce validated missions without modifying the core `MissionEngine`.

---

## 1. Technical Sources of Truth

*   **Mission Gameplay Logic**: `src/engine/MissionEngine.tsx`
*   **Mission Content Configuration**: `src/data/missions.ts`
*   **Mission Lifecycle / Enabled Registry**: `src/data/levelARegistry.ts` (exporting `levelAMissionCatalog` and `levelARegistry`)
*   **Production Audio Mapping**: `src/config/audio/manifest.ts` (`audioIdMap`)
*   **Physical Audio Assets**: `public/audio/`
*   **Authoring Readiness Validator**: `npm run mission-check -- <missionId>`
*   **Production Strict Validator**: `npm run validate-missions`

Do not duplicate these responsibilities. 

---

## 2. Standard Mission Spec Format

Missions must first be described in a human-readable Mission Spec before writing TypeScript config. The Spec describes *content and learning intent*.

### Example: `find-one` Spec
```yaml
id: mission_A6
title: Find Soap
learningGoal: Identify a common household item
type: find-one

choices:
  - soap
  - apple
  - banana
  - redCar

target:
  soap

dialogue:
  instruction: "ช่วย Bingo หาสบู่หน่อย!"
  correct: "ใช่แล้ว! สบู่!"
  wrong:
    apple: "นี่คือแอปเปิล... ลองหาสบู่อีกทีนะ!"
    banana: "นี่คือกล้วย... ลองหาสบู่อีกทีนะ!"
    redCar: "นี่คือรถของเล่น... ลองหาสบู่อีกทีนะ!"

vocabulary:
  - text: "Soap"
    productId: soap
```

### Spec Variants

**`find-attribute`**
Requires a validation rule instead of a strict target ID:
```yaml
type: find-attribute
validation:
  field: colorName
  equals: red
```

**`pick-n`**
Requires multiple targets, a target count, and intermediate dialogue:
```yaml
type: pick-n
targetIds: [apple, banana]
targetCount: 2
dialogue:
  instruction: "ช่วย Bingo เลือกผลไม้ 2 อย่างหน่อย!"
  first_correct: "ใช่แล้ว! ผลไม้! หาอีกหนึ่งอย่างนะ!"
  complete: "เก่งมาก! ได้ผลไม้สองอย่างแล้ว!"
vocabulary:
  - text: "Apple"
    productId: apple
  - text: "Banana"
    productId: banana
```

---

## 3. Spec to TypeScript Config Rules

The Spec is converted deterministically into TypeScript config (`src/data/missions.ts`):
*   **Spec wrong feedback** → `MissionChoice.wrongFeedback`
*   **Spec vocabulary** → `vocabularyConfigs`
*   **Spec target** → `targetIds`
*   **Spec attribute rule** → `validation` (e.g., `{ kind: 'attribute', field: 'colorName', equals: 'red' }`)
*   **Spec lifecycle** → `levelAMissionCatalog` entry with explicit `status`.

---

## 4. Audio Conventions

### Audio ID Naming Standard
Production audio maps explicit IDs to MP3s in `audioIdMap`.
*   **Bingo specific**: `mission_<ID>.instruction`, `mission_<ID>.wrong_<choice>`, `mission_<ID>.correct`, `mission_<ID>.first_correct`, `mission_<ID>.complete`
*   **Vocabulary**: `vocab.<concept>`
*   **Shared / Reused**: `pillow.listen`, `pillow.repeat`

Do not regenerate existing reusable audio.

### Physical File Naming Convention
*   **Bingo Audio**: `public/audio/a6/bingo/` (lowercase mission ID folder)
*   **Vocabulary Audio**: `public/audio/vocabulary/`
*   **File format**: Exact lowercase casing is strongly preferred, but exact matches strictly matter for Windows/Linux CI (e.g. `apple.mp3`, `instruction.mp3`).
*   Git tracking is mandatory.

***CRITICAL: Do not infer runtime MP3 paths dynamically. `audioIdMap` must remain explicit.***

---

## 5. Mission Lifecycle Authoring States

*   **`draft`**: Config exists but is incomplete.
*   **`audio_pending`**: Config is structurally valid but requires production MP3s to be recorded/mapped.
*   **`ready_to_enable`**: `mission-check` passes strict production requirements (all audio verified), but mission is kept hidden.
*   **`enabled`**: Mission is actively served in the child-facing registry.
*   **`validated`**: Mission is enabled and has passed real-device child QA.

---

## 6. Human Approval Gates

AI agents **must wait for human approval** before:
1. Finalizing a Mission Spec (Learning goals)
2. Recording or generating new production voice assets
3. Enabling a new mission for children (setting status to `enabled`)
4. Marking a mission as `validated`

---

## 7. Standard Agent Workflows & Prompt Templates

Agents should use the following prompt templates and steps to execute mission additions safely.

### A. Implementation Prompt (Spec → Config)
Use this prompt when a Mission Spec is approved, and you want the agent to draft it.

**Prompt Template:**
> Please implement the following APPROVED Mission Spec. 
> 
> 1. Create the TypeScript config in `missions.ts`.
> 2. Reuse `productsDB` and existing vocabulary/audio where possible.
> 3. Add the mission to `levelAMissionCatalog` as `audio_pending`.
> 4. Do NOT enable the mission.
> 5. Do NOT modify `MissionEngine.tsx`.
> 6. Run `npm run mission-check -- <missionId>`.
> 7. Return the resulting missing audio checklist directly to me.
> 8. STOP and wait for me to provide the audio files.
>
> [PASTE APPROVED MISSION SPEC HERE]

### B. Audio-Install Prompt (MP3s → Readiness)
Use this prompt after manually generating and placing the required MP3 files into the `public/audio` folders.

**Prompt Template:**
> The missing audio files for `<missionId>` have been placed in the file system.
>
> 1. Inspect the physical files to verify exact case matches.
> 2. Ensure they are tracked in Git.
> 3. Wire the required entries explicitly into `audioIdMap` in `manifest.ts`.
> 4. Run `npm run mission-check -- <missionId>`.
> 5. If everything passes, update the catalog status to `ready_to_enable`.
> 6. Report the results. Do NOT change the status to `enabled` unless explicitly told to.

### C. Enable Prompt (Approval to Deploy)
Use this prompt to activate the mission for actual gameplay.

**Prompt Template:**
> I APPROVE ENABLING `<missionId>`.
> 
> 1. Confirm `mission-check` passes with no structural or audio errors.
> 2. Change the mission's lifecycle status to `enabled` in `levelAMissionCatalog`.
> 3. Run `npm run validate-missions`.
> 4. Run `npm run lint`.
> 5. Run `npm run build`.
> 6. Report the results. Do NOT perform any gameplay refactors.

---

## 8. Generate Checklist from Config

Do not manually maintain an audio checklist document. The true checklist is always derived directly from the TypeScript config:

```bash
npm run mission-check -- <missionId>
```

This command parses the config and generates the live, exact list of audio IDs, their fallback text, and their current physical asset status (whether they exist, are missing, or are successfully reused).
