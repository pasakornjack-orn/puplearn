# PupLearn — AGENTS.md

## Purpose

This file defines the permanent operating rules for any coding agent working on PupLearn.

The goal is to reduce repeated human supervision by making the first four validated Level A missions the reference implementation for future missions.

Any agent must read this file before changing the project.

Also read:

- `PUPLEARN-HANDOFF.md`
- `docs/08-CURRENT-STATUS.md` if it exists

---

# 1. Product Direction

PupLearn is a real-life learning web app for children approximately 3–7 years old.

The product teaches through playful missions rather than isolated quizzes.

Core learning skills:

1. Thai
2. Logic
3. Math
4. English

The current validated Level A experience is for approximately age 3–4.

Level A core loop:

**Listen → Look → Tap → See Result → Hear Word → Optional Imitation**

Level A is:

- audio-first
- visual-first
- readable without requiring literacy
- gentle
- exploratory
- playful
- designed around large tap targets

Do not turn Level A into a reading test.

---

# 2. Current Validated Level A Missions

These four missions are the current reference implementation.

## Mission 00 — Find Apple

Instruction:

`ช่วย Bingo หาแอปเปิลหน่อย!`

Mission type:

`find-one`

Choices:

- Apple
- Banana
- Soap
- Toothbrush

Vocabulary:

`Apple`

---

## Mission A2 — Find Banana

Instruction:

`ช่วย Bingo หากล้วยหน่อย!`

Mission type:

`find-one`

Vocabulary:

`Banana`

---

## Mission A3 — Color Hunt

Instruction:

`ช่วย Bingo หาของสีแดงหน่อย!`

Mission type:

`find-attribute`

Beginner rule:

Use exactly four choices with four distinct colors.

Reference choices:

- Red toy car
- Blue ball
- Yellow duck
- Green leaf

Vocabulary:

`Red`

This mission teaches the COLOR concept, not object names.

---

## Mission A4 — Pick 2 Fruits

Instruction:

`ช่วย Bingo เลือกผลไม้ 2 อย่างหน่อย!`

Mission type:

`pick-n`

Correct:

- Apple
- Banana

Incorrect:

- Soap
- Toothbrush

Vocabulary sequence:

1. Apple
2. Banana

Rule:

**ONE WORD = ONE ACTIVE IMAGE**

Do not show both vocabulary objects as equally active during one vocabulary teaching step.

---

# 3. Child-Tested UX Rules — DO NOT BREAK

The first four Level A missions have been tested with a real child and successfully completed.

Protect these behaviors.

## Audio-first

A Level A child may not read.

The child should understand through:

- voice
- object recognition
- visual cues
- movement
- cause and effect

Text is supplementary.

---

## Wrong taps are exploration

A wrong tap is not failure.

For every distinct wrong object:

- respond
- identify the object when useful
- gently redirect
- do not punish
- do not show harsh failure states

If the child taps a new object while speech is playing:

**stop old speech immediately → play newest feedback**

Never allow overlapping mascot voices.

---

## Basket interaction

Validated interaction:

**tap correct item → item moves toward basket → basket reacts → moving item disappears → continue**

Do not leave awkward clipped products inside the basket.

Do not manually position product artwork inside the basket.

---

## English vocabulary

English in Level A is exposure + imitation.

Do NOT add:

- microphone requirements
- speech recognition
- pronunciation scoring

Standard sequence:

`ฟังนะ...`
→ pause
→ vocabulary word
→ pause
→ `พูดตาม Pillow นะ...`
→ pause
→ vocabulary word again

The game controls pauses.

Do not rely on TTS-generated pauses.

---

# 4. Mascots — LOCKED

## Bingo

- Golden Retriever
- yellow theme
- role: Thai / understanding instructions

## Peter

- Border Collie
- purple theme
- role: Logic

## A-Chi

- Corgi
- orange theme
- role: Math

## Pillow

- Beagle
- blue theme
- role: English

Art direction:

**Soft 3D Toy World**

Cute, rounded, premium, bright and expressive.

Do not replace approved mascot assets without explicit instruction.

---

# 5. Typography — LOCKED

Thai / instructions / Thai UI:

`Anuphan`

English display / mascot names / brand-like text:

`Fredoka`

General:

- rounded
- readable
- child-friendly
- avoid dense text

---

# 6. Approved UI — PROTECT IT

The current Level A layouts are approved.

Do not redesign them unless explicitly requested.

Protected screens:

- Home
- Mission Select
- Gameplay
- Vocabulary
- Success

Do not casually change:

- mascot positions
- speech bubble positions
- CTA positions
- basket position
- product board layout
- responsive structure
- white panels/cards
- success hierarchy

A coding refactor should be visually invisible to the child.

---

# 7. Product Layout Architecture

Use:

```text
ProductArea
└── ProductGrid
    ├── ProductSlot
    │   ├── product-tray asset
    │   └── product image
    ├── ProductSlot
    ├── ProductSlot
    └── ProductSlot

Basket
```

Rules:

- CSS Grid is the layout
- tray and product belong to the same ProductSlot
- whole slot is tappable
- no aligning against baked tray coordinates
- no manual per-product nudging

For four Level A choices:

`2 × 2`

Product positions may be shuffled within slots.

Do not randomly place products freely around the screen.

---

# 8. Product Randomization

Level A product choices should be shuffled inside the ProductGrid slots when appropriate.

Randomize:

- on mission start
- on replay

Preserve:

- slot size
- spacing
- tap area
- layout stability

Do not randomize:

- Bingo position
- basket position
- main UI structure
- CTA positions

Avoid repeatedly placing the correct answer in the same slot when practical.

---

# 9. Audio Architecture

Production Level A mascot audio uses approved LOCAL STATIC MP3 assets.

Do NOT call ElevenLabs during gameplay.

Do NOT require ElevenLabs during Vercel build.

Runtime priority:

**local approved MP3 → Browser SpeechSynthesis fallback if asset is missing**

Browser TTS is fallback only.

---

## Shared Pillow audio

Reusable prompts:

```text
listen.mp3
repeat.mp3
```

Meaning:

- `listen.mp3` = `ฟังนะ...`
- `repeat.mp3` = `พูดตาม Pillow นะ...`

Vocabulary words should normally use one reusable file per word.

Example:

```text
apple.mp3
banana.mp3
red.mp3
```

The same word audio can be played twice in one sequence.

Do not create duplicate `*-repeat.mp3` files unless there is a deliberate performance difference.

---

## Vocabulary timing

Standard sequence:

```text
listen.mp3
→ wait 400 ms after completion

word.mp3
→ wait 700 ms after completion

repeat.mp3
→ wait 400 ms after completion

same word.mp3 again
```

The sequence must be cancellable.

If the child:

- mutes sound
- navigates away
- starts another dialogue
- presses replay

cancel the previous sequence cleanly.

---

# 10. Background Music

Level A / Supermarket World BGM:

```text
/audio/bgm/supermarket-loop.mp3
```

Rules:

- loop continuously
- do not create duplicate BGM instances
- do not restart on every rerender
- start/unlock after valid user interaction when required by browser policy
- master sound controls BGM
- BGM must remain subtle

Suggested normal volume:

`~0.12`

Suggested ducked volume during mascot speech:

`~0.04`

Use smooth ducking.

Do not fully pause BGM every time a mascot speaks.

Keep BGM ducked across a complete Pillow vocabulary sequence.

---

# 11. Master Sound

One master sound control is enough.

Sound OFF:

- stop/pause BGM
- stop Bingo
- stop Pillow
- cancel active vocabulary sequence
- cancel Browser SpeechSynthesis
- prevent new audio

Sound ON:

- allow future dialogue
- resume/start BGM appropriately

Do not add a separate music toggle unless explicitly requested.

---

# 12. Mission Engine Goal

The first four missions are not isolated pages.

They are the reference set for building a reusable Mission Engine.

Future mission creation should be primarily:

**mission config + assets + audio**

not:

**new page + copied logic + repeated UI code**

Target architecture:

```text
Mission Config
      ↓
Mission Runner
      ↓
Instruction / Bingo
Product Grid
Answer Logic
Audio Feedback
Basket Interaction
Vocabulary
Success
```

---

# 13. Initial Mission Types

Support only validated patterns first.

## `find-one`

Reference:

- Mission 00
- Mission A2

Flow:

instruction
→ choose 1 of 4
→ wrong/correct feedback
→ basket
→ vocabulary
→ success

---

## `find-attribute`

Reference:

- Mission A3

Flow:

instruction about attribute
→ choose matching object
→ attribute-specific feedback
→ vocabulary concept
→ success

---

## `pick-n`

Reference:

- Mission A4

Flow:

instruction
→ select multiple correct objects
→ track count
→ feedback after first correct
→ complete after N correct selections
→ vocabulary sequence(s)
→ success

Do not over-generalize the engine for mission types that have not been designed yet.

---

# 14. Mission Config Standard

New missions should preferably be represented by config.

Example concept:

```ts
{
  id: "mission00",
  level: "A",
  type: "find-one",

  instruction: {
    text: "ช่วย Bingo หาแอปเปิลหน่อย!",
    audio: "/audio/mission00/bingo/instruction.mp3"
  },

  choices: [
    {
      id: "apple",
      image: "/products/apple.png",
      correct: true
    },
    {
      id: "banana",
      image: "/products/banana.png",
      correct: false,
      wrongAudio: "/audio/mission00/bingo/wrong-banana.mp3"
    }
  ],

  vocabulary: [
    {
      word: "Apple",
      image: "/products/apple.png",
      audio: "/audio/vocabulary/apple.mp3"
    }
  ]
}
```

Exact schema may evolve.

Keep it:

- readable
- typed
- reusable
- simple to extend

Do not introduce a database or CMS yet.

---

# 15. Recommended Mission Engine Structure

Suggested direction:

```text
src/
  missions/
    types.ts
    mission00.ts
    missionA2.ts
    missionA3.ts
    missionA4.ts

  engine/
    MissionRunner.tsx
    FindOneMission.tsx
    FindAttributeMission.tsx
    PickNMission.tsx
```

Use the existing project architecture if a cleaner equivalent already exists.

Do not rename/restructure the whole project without a strong reason.

---

# 16. Migration Strategy

Do NOT refactor all missions at once.

Recommended order:

1. freeze/commit current Level A Core V1
2. migrate Mission 00 only
3. regression test
4. migrate A2
5. regression test `find-one`
6. migrate A3
7. regression test `find-attribute`
8. migrate A4
9. regression test `pick-n`
10. full Level A regression

At every step:

**behavior and visuals must remain unchanged**

---

# 17. Regression Requirements

After engine or shared-component changes, verify:

## Mission 00

- instruction
- all wrong objects
- correct Apple
- basket interaction
- Apple vocabulary
- replay
- mute

## A2

- instruction
- wrong feedback
- correct Banana
- Banana vocabulary
- replay
- mute

## A3

- instruction
- distinct colors
- wrong color feedback
- correct Red
- Red vocabulary
- replay
- mute

## A4

- instruction
- wrong objects
- first correct fruit
- second correct fruit
- Apple vocabulary
- Banana vocabulary
- success

Also verify:

- product shuffle
- audio interruption
- no overlapping voices
- BGM ducking
- mission reset
- progress/session state
- mobile
- desktop

---

# 18. Mission 07

Mission 07 is the Level D reference mission.

Do not simplify Mission 07 into a toddler mission.

Do not break Mission 07 while refactoring Level A.

Mission 07 includes:

- Thai instruction
- product selection
- logic
- money / budget
- English

Treat it as advanced content.

---

# 19. What Agents Should Automate

The goal is to reduce human repetitive work.

For future missions, agents should handle as much as possible:

- create mission config
- reuse approved mission runner
- wire product assets
- wire audio assets
- configure correct/wrong logic
- configure vocabulary
- add mission to Mission Select
- preserve product shuffle
- run tests
- check responsive behavior
- report missing assets
- report regressions

The human should mainly decide:

- learning goal
- educational appropriateness
- whether the mission feels fun
- whether visual/audio quality is acceptable
- child-test outcome

---

# 20. New Mission Workflow

When given a new learning goal:

1. identify the most suitable existing mission type
2. propose the mission content
3. define instruction
4. define choices
5. define correct answer(s)
6. define wrong feedback
7. define vocabulary
8. list required visual assets
9. list required audio assets
10. create mission config
11. integrate using the existing engine
12. test
13. report results

Do not create a new custom page unless the mission genuinely requires a new interaction pattern.

---

# 21. Batch Mission Creation

Once Mission Engine is proven, agents may create missions in small batches.

Recommended batch size:

`3–4 missions`

For each batch:

- generate mission specs
- reuse existing types
- identify reusable vocabulary/audio
- create configs
- integrate
- run regression
- stop for human review

Do not generate dozens of missions without review.

---

# 22. Scope Discipline

Current priority:

- Level A Core stability
- Mission Engine
- reusable mission production
- child validation
- small controlled content expansion

Not current priority:

- login
- payments
- school dashboard
- multiplayer
- voice recognition
- parent account system
- XP
- coins
- streaks
- large mission economy
- CMS
- database-driven mission editor

Do not expand into these areas unless explicitly requested.

---

# 23. Coding Agent Behavior

Before editing:

1. read this file
2. read `PUPLEARN-HANDOFF.md`
3. inspect current code
4. identify affected files
5. protect approved UX

For risky/refactor tasks:

- explain the plan first if requested
- work incrementally
- prefer small reversible changes
- preserve Git safety
- do not destroy working code unnecessarily

After implementation:

- run available tests
- run build/typecheck/lint as appropriate
- regression test affected missions
- report files changed
- report risks
- report unresolved issues

Do not claim a test passed if it was not actually run.

---

# 24. Definition of Done for a New Level A Mission

A new mission is complete only when:

- learning goal is clear
- instruction is understandable without reading
- four-choice layout remains age-appropriate when applicable
- wrong taps give useful feedback
- correct interaction works
- basket interaction works when applicable
- audio works
- no overlapping speech
- vocabulary follows One Word = One Active Image
- replay works
- mute works
- BGM ducking works
- product shuffle works where appropriate
- success screen works
- mission progression works
- mobile layout works
- desktop layout works
- existing Level A missions still work

---

# 25. Core Principle

Protect this priority order:

1. child understands what to do
2. tap produces useful feedback
3. learning concept is visually clear
4. interaction is stable
5. then make it beautiful

Do not sacrifice validated child behavior for visual polish.

The first four Level A missions are the behavioral reference.

Future work should make PupLearn easier to expand without requiring the human owner to supervise every implementation detail.
