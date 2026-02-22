# Specification

## Summary
**Goal:** Add comprehensive text formatting controls in the admin panel for homepage sections, allowing separate customization of headings and body text across hero, overview/about, services, and footer sections.

**Planned changes:**
- Create a new "Text Formatting" tab in the admin panel
- Add backend storage for text formatting settings organized by section (hero, overview/about, services, footer) with separate configurations for headings and body text
- Build TextFormattingManager component with controls for font size, font family, font weight, letter spacing, and text transform
- Apply formatting settings to Hero component text elements (headline uses heading settings, subtext uses body settings)
- Apply formatting settings to Overview/About component text elements (titles use heading settings, descriptions use body settings)
- Apply formatting settings to Services component text elements (service titles use heading settings, descriptions use body settings)
- Apply formatting settings to Footer component text elements (section titles use heading settings, content text uses body settings)

**User-visible outcome:** Admin users can access a dedicated "Text Formatting" section to independently customize the appearance of headings and body text for each homepage section (hero, overview/about, services, footer), with changes applied in real-time to the homepage while leaving blog pages unaffected.
