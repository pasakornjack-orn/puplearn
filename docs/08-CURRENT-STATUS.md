# Current Status

## Milestone: Mission Engine V1 Core
- **Status:** COMPLETE
- **baseline commit:** 586d1e4
- **checkpoint tag:** mission-engine-v1-core
- **next task:** Mission A5 proof mission

## Migration Details
- Mission 00 migrated: find-one
- Mission A2 migrated: find-one reuse proven config-only
- Mission A3 migrated: find-attribute
- Mission A4 migrated: pick-n
- Mission 07 remains legacy / Level D
- all validated Level A missions now run through MissionEngine
- audio/BGM/bubble behavior preserved

> **Note on Pick-N Generalization:**
> pick-n runtime counting is generic, but current intermediate dialogue config has only one `first_correct` dialogue. Do not claim conversational feedback for pick-3 is generalized yet.

## Previous Milestone: Level A Core V1 (FROZEN)
- [x] Mission 00 / A2 / A3 / A4 validated on real device
- [x] Bingo audio uses approved local MP3
- [x] Pillow audio uses approved local MP3
- [x] Level A normal flow does not use Browser TTS
- [x] Bubble text matches approved recorded dialogue
- [x] BGM / ducking / mute validated
- [x] MissionChoice architecture complete
- [x] Mission 07 remains legacy / Level D

## Historical Notes
- Visual V2 Migration (Completed & Validated)
- Soft 3D Toy World North Star applied to Level A Shell & Core Templates
- Real-child testing verified