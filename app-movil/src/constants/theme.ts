import { vars } from "nativewind";

export const themes = {
  dark: vars({
    "--color-background": "11 15 23", // #0B0F17
    "--color-surface": "17 24 38",
    "--color-surface-alt": "23 32 51",
    "--color-border": "30 41 59",
    "--color-foreground": "255 255 255",
    "--color-muted": "100 116 139", // #64748B
    "--color-primary": "0 214 143", // #00D68F
    "--color-accent": "0 180 216", // #00B4D8
    "--color-danger": "240 69 63",
    "--color-warning": "245 130 32",
    "--color-caution": "230 184 0",
  }),
  light: vars({
    "--color-background": "244 247 250",
    "--color-surface": "255 255 255",
    "--color-surface-alt": "234 240 245",
    "--color-border": "213 222 231",
    "--color-foreground": "11 17 24",
    "--color-muted": "100 116 139",
    "--color-primary": "0 168 116",
    "--color-accent": "0 144 173",
    "--color-danger": "224 53 48",
    "--color-warning": "224 111 12",
    "--color-caution": "201 154 0",
  }),
};

/** Valores hex para props que no aceptan className (iconos, gradientes). */
export const palette = {
  primary: "#00D68F",
  accent: "#00B4D8",
  muted: "#64748B",
  danger: "#F0453F",
  warning: "#F58220",
  caution: "#E6B800",
};
