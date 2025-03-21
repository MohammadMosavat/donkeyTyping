const themes = [
  {
    name: "Indigo Emerald",
    class: "theme-indigo-emerald",
    colors: {
      primary: "#f9fafb", // Lightest shade
      secondary: "#a1a7f7", // Lighter, but with less brightness
      third: "#4f46e5", // Base color
      fourth: "#3531a3", // Darker base color
    },
  },
  {
    name: "Coral Lavender",
    class: "theme-coral-lavender",
    colors: {
      primary: "#f8ede3", // Lightest shade
      secondary: "#f1bba4", // Lighter and less bright
      third: "#ff7e67", // Base color
      fourth: "#cc5a43", // Darker base color
    },
  },
  {
    name: "Ocean Breeze",
    class: "theme-ocean-breeze",
    colors: {
      primary: "#caf0f8", // Lightest shade
      secondary: "#80c8da", // Lighter, less bright
      third: "#0077b6", // Base color
      fourth: "#005a80", // Darker base color
    },
  },
  {
    name: "Sunset Glow",
    class: "theme-sunset-glow",
    colors: {
      primary: "#ffcad4", // Lightest shade
      secondary: "#ff9fa1", // Lighter, less bright
      third: "#ff9f1c", // Base color
      fourth: "#c67214", // Darker base color
    },
  },
  {
    name: "Dark Mode",
    class: "theme-dark",
    colors: {
      primary: "#ffffff", // Lightest shade
      secondary: "#b3b3b3", // Lighter, less bright
      third: "#121212", // Base color
      fourth: "#0a0a0a", // Darker base color
    },
  },
  {
    name: "Matrix",
    class: "theme-matrix",
    colors: {
      primary: "#00ff00", // Lightest shade
      secondary: "#80ff80", // Lighter, less bright
      third: "#025202", // Base color
      fourth: "#001f00", // Darker base color
    },
  },
  {
    name: "Cyberpunk Neon",
    class: "theme-cyberpunk-neon",
    colors: {
      primary: "#ff99bb", // Lightest shade
      secondary: "#ff6699", // Lighter, less bright
      third: "#ff0055", // Base color
      fourth: "#cc0044", // Darker base color
    },
  },
  {
    name: "Solarized",
    class: "theme-solarized",
    colors: {
      primary: "#fdf6e3", // Lightest shade
      secondary: "#d5e4ff", // Lighter, less bright
      third: "#268bd2", // Base color
      fourth: "#1e6bb8", // Darker base color
    },
  },
  
  {
    name: "Mellow Mint",
    class: "theme-mellow-mint",
    colors: {
      primary: "#e0f7fa", // Lightest shade
      secondary: "#b2dfdb", // Lighter, less bright
      third: "#004d40", // Base color
      fourth: "#002e28", // Darker base color
    },
  },
  {
    name: "Midnight Sky",
    class: "theme-midnight-sky",
    colors: {
      primary: "#0c1b2b", // Lightest shade
      secondary: "#f9b84b", // Lighter, less bright
      third: "#00c8d8", // Base color
      fourth: "#009da3", // Darker base color
    },
  },
  {
    name: "Rosewood",
    class: "theme-rosewood",
    colors: {
      primary: "#f9c8d1", // Lightest shade
      secondary: "#f2a0a1", // Lighter, less bright
      third: "#8b4f4f", // Base color
      fourth: "#5e3333", // Darker base color
    },
  },
  {
    name: "Tropical Breeze",
    class: "theme-tropical-breeze",
    colors: {
      primary: "#f0e68c", // Lightest shade
      secondary: "#ffdb58", // Lighter, less bright
      third: "#ff6347", // Base color
      fourth: "#e23d32", // Darker base color
    },
  },
  {
    name: "Urban Jungle",
    class: "theme-urban-jungle",
    colors: {
      primary: "#9dbe8b", // Lightest shade
      secondary: "#7fae70", // Lighter, less bright
      third: "#468f6f", // Base color
      fourth: "#2e6d55", // Darker base color
    },
  },
  {
    name: "Lime Crush",
    class: "theme-lime-crush",
    colors: {
      primary: "#a9e34b", // Lightest shade
      secondary: "#ffcc5c", // Lighter, less bright
      third: "#ff4c00", // Base color
      fourth: "#e03600", // Darker base color
    },
  },
  {
    name: "Cherry Blossom",
    class: "theme-cherry-blossom",
    colors: {
      primary: "#f9e2e2", // Lightest shade
      secondary: "#f3c1c6", // Lighter, less bright
      third: "#ff9b9b", // Base color
      fourth: "#cc6e6e", // Darker base color
    },
  },
  {
    name: "Neon Purple",
    class: "theme-neon-purple",
    colors: {
      primary: "#c8a0ff", // Lightest shade
      secondary: "#9a6eff", // Lighter, less bright
      third: "#d500f9", // Base color
      fourth: "#a300d3", // Darker base color
    },
  },
  {
    name: "Golden Hour",
    class: "theme-golden-hour",
    colors: {
      primary: "#ffcc00", // Lightest shade
      secondary: "#ffb600", // Lighter, less bright
      third: "#ff7800", // Base color
      fourth: "#e86000", // Darker base color
    },
  },
 
  {
    name: "Obsidian Night",
    class: "theme-obsidian-night",
    colors: {
      primary: "#353535", // Lightest shade
      secondary: "#252525", // Lighter, less bright
      third: "#ffcc00", // Base color
      fourth: "#b39200", // Darker base color
    },
  },
  {
    name: "Midnight Noir",
    class: "theme-midnight-noir",
    colors: {
      primary: "#333333", // Lightest shade
      secondary: "#484848", // Lighter, less bright
      third: "#f05454", // Base color
      fourth: "#d13f3f", // Darker base color
    },
  },
  {
    name: "Eclipse",
    class: "theme-eclipse",
    colors: {
      primary: "#4e4e4e", // Lightest shade
      secondary: "#3a3a3a", // Lighter, less bright
      third: "#ff4500", // Base color
      fourth: "#cc3700", // Darker base color
    },
  },
  {
    name: "Shadow Realm",
    class: "theme-shadow-realm",
    colors: {
      primary: "#1e1e1e", // Lightest shade
      secondary: "#3a3a3a", // Lighter, less bright
      third: "#58a6ff", // Base color
      fourth: "#387bb5", // Darker base color
    },
  },
  {
    name: "Dark Nebula",
    class: "theme-dark-nebula",
    colors: {
      primary: "#301d5f", // Lightest shade
      secondary: "#6b3fb0", // Lighter, less bright
      third: "#9400d3", // Base color
      fourth: "#6600a3", // Darker base color
    },
  },
  {
    name: "Red Black",
    class: "theme-red-black",
    colors: {
      primary: "#ff0000", // Lightest shade
      secondary: "#8c0000", // Lighter, less bright
      third: "#9d0000", // Base color
      fourth: "#520202", // Darker base color
    },
  },
];

export default themes;
