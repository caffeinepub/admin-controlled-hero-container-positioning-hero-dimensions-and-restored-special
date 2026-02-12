# Specification

## Summary
**Goal:** Expand the Hero theme’s particle effect options so admins can choose from additional particle types, persist the selection, and render each type with a distinct visual style.

**Planned changes:**
- Extend the backend `ParticleEffectType` to include additional particle variants while keeping existing stored hero theme data compatible and leaving the default hero theme unchanged unless updated by an admin.
- Regenerate/propagate backend types to `frontend/src/backend` so the frontend compiles with the new `ParticleEffectType` variants.
- Update `frontend/src/components/admin/HeroThemeManager.tsx` to show the full set of particle types in the “Particle Type” dropdown with clear English labels and correctly reflect the saved selection on reload.
- Update `ParticleEffectLayer` to implement distinct canvas rendering behavior for every selectable particle type (including making existing types visually distinct) and add a safe fallback for unknown/unsupported `effectType` values.

**User-visible outcome:** Admins can select from more hero particle effect types, save the choice, and see the chosen particle style render distinctly in the hero section without errors (with graceful fallback for unsupported types).
