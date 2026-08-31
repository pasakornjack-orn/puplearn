# Antigravity Prompt — Build Level A Missions A2 / A3 / A4

Read the updated /docs first.

Mission 00 is already our validated Level A reference mission.
Use Mission 00 as the structural template.

Do NOT modify Mission 07.
Do NOT add Level B or other missions.

## Goal
Add 3 new Level A missions:

- A2 — Find the Banana
- A3 — Find Something Red
- A4 — Pick 2 Fruits

These are for children around age 3–4.

## Implementation Requirements

### 1. Reuse the Level A mission pattern
Keep the same successful principles from Mission 00:
- audio-first
- no reading dependency
- curiosity-friendly exploration
- no harsh wrong state
- toy basket metaphor
- simple positive completion

### 2. Mission A2 — Find the Banana
Bingo says:
"ช่วย Bingo หากล้วยหน่อย!"

Use the same 4 items:
- Apple
- Banana
- Soap
- Toothbrush

Correct target:
- Banana

Pillow teaching step:
"Banana!"

### 3. Mission A3 — Find Something Red
Bingo says:
"ช่วย Bingo หาของสีแดงหน่อย!"

Use the same 4 items:
- Apple
- Banana
- Soap
- Toothbrush

Correct target:
- Apple

Pillow teaching step:
"Red!"

### 4. Mission A4 — Pick 2 Fruits
Bingo says:
"ช่วย Bingo เลือกผลไม้ 2 อย่างหน่อย!"

Use the same 4 items:
- Apple
- Banana
- Soap
- Toothbrush

Correct targets:
- Apple
- Banana

The child must select both fruits.
The mission should complete only after both are correctly selected.

Pillow teaching step:
"Apple!"
pause
"Banana!"

### 5. Exploration behavior
If the child taps a non-target object:
- animate it
- optionally identify it briefly
- give a gentle context reminder
- do not force a harsh wrong screen

### 6. Audio behavior
Use the current Level A audio approach:
- clear Thai guidance from Bingo
- slower separated English from Pillow
- replay button available
- keep simple and understandable for a 3-year-old

### 7. Preserve architecture
- Reuse the same mission system as Mission 00
- Keep mission data separate from UI
- Do not duplicate the app
- Add these as new Level A mission entries
- Keep product assets and mascot assets asset-driven

### 8. Mission selection screen
Update the mission selection screen so Level A clearly includes:
- Mission 00: หาแอปเปิล
- Mission A2: หากล้วย
- Mission A3: หาของสีแดง
- Mission A4: เลือกผลไม้ 2 อย่าง

Keep it simple and easy for a parent to choose.

### 9. Testing
Test all of the following on mobile:
- Mission 00
- Mission A2
- Mission A3
- Mission A4
- Mission 07 regression check

### Deliverables
1. Summarize the implementation of A2 / A3 / A4
2. Confirm mission selection was updated
3. Confirm Level A audio still works
4. Confirm Mission 07 still works
5. Update /docs/08-CURRENT-STATUS.md

Do not expand beyond these 3 new Level A missions.
