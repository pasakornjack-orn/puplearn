# Mission Engine

## Purpose
Mission content should be data-driven and reusable rather than hard-coded screen by screen.

## Example Mission Template

```yaml
type: buy_within_budget
required_items:
  - toothbrush
  - toothpaste
budget: 20
skills:
  thai: 0.25
  logic: 0.25
  math: 0.30
  english: 0.20
final_question:
  type: english_object_recognition
difficulty: beginner
```

## Variables
- Required items
- Number of items
- Prices
- Budget
- Distractor items
- Instruction complexity
- Audio on/off
- English question
- Hint strength

## Mission Types — Initial Ideas
1. Find one item
2. Find two items
3. Choose a quantity
4. Buy within budget
5. Choose the cheaper item
6. Choose the correct category
7. Find what is missing
8. Follow two-step instruction
9. Count items
10. Calculate total
11. Calculate money left
12. Avoid exceeding budget
13. Choose breakfast items
14. Choose bathroom items
15. English object recognition
16. English category recognition
17. Mixed Thai + Math mission
18. Mixed Logic + English mission
