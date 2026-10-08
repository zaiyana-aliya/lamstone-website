/**
 * Gold & Navy Editorial Theme Configuration for the About page (/about)
 * 
 * Palette:
 * - Navy (Text, Headings): #0F2A4A
 * - Deep Blue (Dark Bands): #173A6B
 * - Gold (Accents, Frames, Badges): #B8934A
 * - Cream: #FBF7F0
 * - Warm Ivory: #FFFDF9
 * - Soft Sand: #F3EADB / #F1E2CC / #F3E6D3
 * - Warm Parchment: #F6EEDF
 */

export const ABOUT_EDITORIAL_THEME = {
  colors: {
    // Section Backgrounds
    cream: "#FBF7F0",              // Section 1: Our Story
    softSandVision: "#F3EADB",     // Section 2: Vision & Mission
    deepBlueBand: "#173A6B",       // Section 3: Ecosystem Band & Section 6: Growth Roadmap
    warmIvory: "#FFFDF9",          // Section 4: Our Values & Section 8: Why Lamstone
    softSandCampus: "#F1E2CC",     // Section 5: Modern Infrastructure
    softSandCampusFrame: "#E2CBB0",// Modern Infrastructure photo frame
    warmParchment: "#F6EEDF",      // Section 7: Core Leadership
    softSandPills: "#F3E6D3",      // Section 8: Feature pills

    // Core Brand Colors
    navy: "#0F2A4A",
    deepBlue: "#173A6B",
    deepNavy: "#0B1E36",
    navyMuted: "#243E5E",
    gold: "#B8934A",
    goldLight: "rgba(184, 147, 74, 0.15)",
    cardWhite: "#FFFFFF",
    cardCream: "#FBF7F0",
  },

  shadows: {
    card: "0 1px 2px rgba(15,42,74,0.06), 0 12px 32px rgba(15,42,74,0.08)",
    cardHover: "0 4px 8px rgba(15,42,74,0.08), 0 16px 40px rgba(184,147,74,0.12)",
  },

  borders: {
    goldHairline: "rgba(184, 147, 74, 0.25)",
    hairlineNavy: "rgba(15, 42, 74, 0.12)",
    hairlineDivider: "rgba(15, 42, 74, 0.08)",
  },

  sections: {
    story: {
      type: "light",
      bg: "#FBF7F0", // cream
      text: "#0F2A4A",
      accent: "#B8934A",
      buttonBg: "#0F2A4A",
    },
    visionMission: {
      type: "light",
      bg: "#F3EADB", // soft sand
      cardVision: "#FFFFFF",
      cardMission: "#FFFFFF",
      iconBadge: "#0F2A4A",
      accent: "#B8934A",
      text: "#0F2A4A",
    },
    photoBand: {
      type: "darkGradient",
      gradient: "from-[#0B1E36]/95 via-[#0F2A4A]/80 to-[#173A6B]/50",
      text: "#FFFFFF",
      accent: "#B8934A",
    },
    values: {
      type: "lightPattern",
      bg: "#FFFDF9", // warm ivory
      patternColor: "#B8934A",
      cardBg: "#FFFFFF",
      cardBorder: "rgba(184, 147, 74, 0.25)",
      iconBadge: "#B8934A",
      accent: "#B8934A",
      text: "#0F2A4A",
    },
    campus: {
      type: "light",
      bg: "#F1E2CC", // soft sand
      frameBorder: "#B8934A",
      cardBg: "#FFFFFF",
      accent: "#B8934A",
      text: "#0F2A4A",
    },
    milestones: {
      type: "darkBand",
      bg: "#173A6B", // deep blue
      cardBg: "#FBF7F0",
      accent: "#B8934A",
      text: "#0F2A4A",
      headingText: "#FFFFFF",
    },
    leadership: {
      type: "light",
      bg: "#F6EEDF", // warm parchment
      frameBorder: "#B8934A",
      text: "#0F2A4A",
      accent: "#B8934A",
    },
    whyLamstone: {
      type: "light",
      bg: "#FFFDF9", // warm ivory
      cardBg: "#F3E6D3", // sand pills
      cardBorder: "rgba(184, 147, 74, 0.25)",
      iconBadge: "#B8934A",
      text: "#0F2A4A",
      accent: "#B8934A",
      buttonBg: "#0F2A4A",
    },
  },
} as const;

export type AboutEditorialTheme = typeof ABOUT_EDITORIAL_THEME;

// Backward compatibility alias
export const ABOUT_ORANGE_THEME = ABOUT_EDITORIAL_THEME;
