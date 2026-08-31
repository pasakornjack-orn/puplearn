# Asset Production Plan — PupLearn V1

## Goal
Create the first production-ready asset pack for Mission 07 in the Supermarket world.

## Production Order
### Phase 1 — Mascot Assets
1. Bingo — guide / neutral
2. Bingo — happy
3. Peter — thinking
4. Peter — hint
5. A-Chi — neutral
6. A-Chi — explaining money
7. Pillow — asking
8. Pillow — happy

### Phase 2 — Product Assets
- Toothbrush blue
- Toothbrush pink
- Toothpaste pink
- Toothpaste mint
- Soap
- Apple

### Phase 3 — UI Decorative Assets
- Toy basket / cart illustration
- Shelf / product tray
- Mission card decoration
- Success star
- Sparkle set
- Empty basket placeholder

## Art Direction
### Overall Style
Soft 3D Toy World

### Visual Rules
- cute, warm, premium, rounded, original
- clear silhouette
- readable at small sizes
- minimal clutter
- soft lighting and shadows
- bright but gentle colors
- background removed for character/product assets

## Technical Specs
### Mascot Assets
- PNG
- transparent background
- full body visible
- centered
- recommended size: 1536×1536 or larger

### Product Assets
- PNG
- transparent background
- centered object
- recommended size: 1024×1024 or larger

### UI Decorative Assets
- PNG
- transparent unless it is a panel/shelf element

## Folder Structure
```text
public/
  mascots/
    bingo-guide.png
    bingo-happy.png
    peter-thinking.png
    peter-hint.png
    a-chi-neutral.png
    a-chi-money.png
    pillow-asking.png
    pillow-happy.png

  products/
    toothbrush-blue.png
    toothbrush-pink.png
    toothpaste-pink.png
    toothpaste-mint.png
    soap.png
    apple.png

  ui/
    basket-toy.png
    shelf-panel.png
    mission-card-decoration.png
    success-star.png
    sparkles-01.png
    basket-empty.png
```

## Naming Rules
- lowercase filenames
- hyphen-separated
- descriptive names
- one asset per file
- no UI text baked into the image

## Important Production Rule
Do not generate every asset at once.

Recommended workflow:
1. finish mascot set first
2. plug mascots into app
3. test visual fit
4. then generate product assets
5. then generate UI decorative assets
