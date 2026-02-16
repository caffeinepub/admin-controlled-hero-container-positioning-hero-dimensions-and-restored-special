# Specification

## Summary
**Goal:** Prevent duplicate patient review submissions and improve admin blog authoring plus footer navigation, while expanding and hardening the hero theme effects/background controls.

**Planned changes:**
- Update the review creation flow (UI + backend) to ensure a single intended submission creates exactly one stored/displayed review, including protection against double-clicks, retries, and re-renders; ensure editing updates in-place.
- Add a user-friendly rich text formatting toolbar to the admin blog editor (headings, bold/italic/underline, links, lists, quotes) and ensure formatted content is stored and rendered correctly on blog list/detail pages without breaking existing posts.
- Add a “Blogs” item to Footer Quick Links that routes to the blogs page via existing hash-based navigation without full page refresh, keeping current quick-link behaviors intact.
- Expand hero theme options with additional Material Design-inspired effects/transitions and support enabling multiple effects simultaneously with smooth switching and no unsupported “no-op” options.
- Strengthen hero background controls with clearer admin configurability, safe defaults/validation, graceful fallbacks for missing backgrounds (including dark-mode variants), and readable hero text/buttons via overlays/gradients.

**User-visible outcome:** Reviews no longer duplicate from repeated submissions or retries; admins can format blog content with a toolbar and see it render correctly; the footer includes a working “Blogs” quick link; the hero supports more (and combined) Material-like effects with smoother transitions and more reliable, readable background behavior.
