# PROMPTS.md: Boutique Hotel Amenities UI (Maison Alder)

## Context
Client staff track hotel amenity requests on paper and Excel, causing data loss and slowdowns. Goal: a digital "Amenities Desk" built with plain HTML, CSS and JavaScript (no libraries).

## Prompt 1: Base build
> Build a digital Boutique Hotel Amenities UI for floor staff. Include a header, hero, amenity cards (8 amenities, 4 categories) with status badges and hours, search and category filters, a request form with validation, a request history list, and a footer. Use vanilla HTML/CSS/JS, a 16/32/48px spacing scale, accessible markup, and no external fonts or libraries.

**Result:** working page with all sections, monochrome palette, CSS variables in `:root`.

## Prompt 2: Visual restyle
> Restyle the page: monogram logo, hover underlines in the nav, dark hero with serif headline and a stats panel, icon tiles on cards, white panels for form and history on a light band, dark footer.

**Result:** polished corporate layout with the same behaviour.

## Prompt 3: Red and black theme
> Give the red and black theme to this.

**Result:** red accent line under header and above footer, black-to-red hero, red buttons, selected filter, focus rings and history stripe; warm-tinted neutrals.
**Note:** the brief asked for a monochrome look; red and black was requested explicitly. All colors live in `:root` variables so the palette can be reverted in one place.

## Prompt 4: Complete theme and dynamic behaviour
> Apply the theme completely and make it a dynamic website.

**Result:**
- "Open now" status is computed from the current hour and refreshes every minute
- Live search and category filtering
- "Request" button preselects the amenity and focuses the form
- Validation with inline messages, red outlines and `aria-invalid`
- Requests saved in `localStorage` (wrapped in try/catch), surviving reloads
- Status flow: Pending → In progress → Done, plus delete and "Clear completed"
- Hero counters (open now, pending, completed) update instantly
- User text is inserted with `textContent` to avoid injection

## Verification checklist
- [ ] Submit an empty form and confirm all errors show
- [ ] Submit a valid request and reload; it should persist
- [ ] Advance a request through all statuses
- [ ] Filter by category and search by name
- [ ] Tab through the page and check focus rings
- [ ] Resize to mobile width

## Reflection
Splitting the work into base, restyle, theme and behaviour prompts kept each change reviewable. Next time I would state the palette decision up front to avoid re-theming.