/**
 * ClaimShield AI — Mock Evidence Assets for Design System Showcase
 * Uses embedded high-precision SVG vector graphics of damaged vehicles and AI heatmaps
 */

// Vehicle damage baseline image (Front Bumper Impact)
export const MOCK_DAMAGE_IMAGE_1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%231e293b"/>
      <stop offset="100%" stop-color="%230f172a"/>
    </linearGradient>
    <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="%23334155"/>
      <stop offset="50%" stop-color="%2364748b"/>
      <stop offset="100%" stop-color="%23475569"/>
    </linearGradient>
    <linearGradient id="damageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23991b1b"/>
      <stop offset="50%" stop-color="%237f1d1d"/>
      <stop offset="100%" stop-color="%23450a0a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(%23bgGrad)"/>
  <!-- Workshop / Road Grid -->
  <line x1="0" y1="420" x2="800" y2="420" stroke="%23334155" stroke-width="2"/>
  <line x1="100" y1="420" x2="0" y2="500" stroke="%231e293b" stroke-width="2"/>
  <line x1="300" y1="420" x2="200" y2="500" stroke="%231e293b" stroke-width="2"/>
  <line x1="500" y1="420" x2="400" y2="500" stroke="%231e293b" stroke-width="2"/>
  <line x1="700" y1="420" x2="600" y2="500" stroke="%231e293b" stroke-width="2"/>
  
  <!-- Vehicle Body Silhouette -->
  <path d="M 120 380 L 140 280 L 260 210 L 520 210 L 660 270 L 720 340 L 720 390 L 640 400 L 600 340 L 520 340 L 480 400 L 240 400 L 200 340 L 140 340 Z" fill="url(%23metalGrad)" stroke="%230f172a" stroke-width="3"/>
  <!-- Windshield -->
  <polygon points="270,220 500,220 460,270 240,270" fill="%230284c7" fill-opacity="0.4" stroke="%2338bdf8" stroke-width="1.5"/>
  <!-- Wheels -->
  <circle cx="170" cy="370" r="45" fill="%23020617" stroke="%23475569" stroke-width="4"/>
  <circle cx="170" cy="370" r="22" fill="%23334155"/>
  <circle cx="560" cy="370" r="45" fill="%23020617" stroke="%23475569" stroke-width="4"/>
  <circle cx="560" cy="370" r="22" fill="%23334155"/>

  <!-- Collision Deformation Damage Area (Front Right Quarter Panel & Bumper) -->
  <path d="M 640 275 Q 670 290 710 320 L 715 365 L 670 380 L 650 350 Q 640 300 640 275 Z" fill="url(%23damageGrad)" stroke="%23ef4444" stroke-width="2" stroke-dasharray="4,2"/>
  <!-- Scratches and Crumple lines -->
  <line x1="655" y1="290" x2="690" y2="330" stroke="%23fca5a5" stroke-width="2"/>
  <line x1="665" y1="310" x2="705" y2="345" stroke="%23fca5a5" stroke-width="1.5"/>
  <line x1="645" y1="320" x2="685" y2="360" stroke="%23fca5a5" stroke-width="2"/>
  
  <!-- Timestamp / Metadata Watermark -->
  <text x="30" y="470" fill="%2394a3b8" font-family="monospace" font-size="14">EXIF: 2026-08-12 14:22:18 UTC | CAM: SONY-IMX890 | GPS: 33.7490° N, 84.3880° W</text>
  <text x="30" y="40" fill="%23f8fafc" font-family="sans-serif" font-weight="bold" font-size="18">EVIDENCE #IMG-88421-A1 (Front Right Impact)</text>
</svg>`;

// AI Heatmap Overlay Image (Thermal activation on front bumper crumple)
export const MOCK_HEATMAP_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <radialGradient id="heatHot" cx="83%" cy="65%" r="25%" fx="83%" fy="65%">
      <stop offset="0%" stop-color="%23ff0055" stop-opacity="0.95"/>
      <stop offset="40%" stop-color="%23ff5500" stop-opacity="0.75"/>
      <stop offset="70%" stop-color="%23ffcc00" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="%230066ff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="heatSecondary" cx="30%" cy="50%" r="15%" fx="30%" fy="50%">
      <stop offset="0%" stop-color="%23ffcc00" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="%230066ff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="500" fill="%23000000" fill-opacity="0"/>
  <!-- Primary High-Activation Zone (Damage area) -->
  <circle cx="670" cy="330" r="160" fill="url(%23heatHot)"/>
  <!-- Secondary Activation Zone (Pre-existing wear) -->
  <circle cx="240" cy="260" r="80" fill="url(%23heatSecondary)"/>
</svg>`;

// Historical Duplicate Claim Damage Image (Claim #CLM-44012)
export const MOCK_HISTORICAL_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="%231e1e2e"/>
      <stop offset="100%" stop-color="%230d0d17"/>
    </linearGradient>
    <linearGradient id="metalGrad2" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="%23475569"/>
      <stop offset="50%" stop-color="%2364748b"/>
      <stop offset="100%" stop-color="%23334155"/>
    </linearGradient>
    <linearGradient id="damageGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="%23991b1b"/>
      <stop offset="100%" stop-color="%23450a0a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(%23bgGrad2)"/>
  <line x1="0" y1="420" x2="800" y2="420" stroke="%23334155" stroke-width="2"/>
  
  <!-- Vehicle Body Silhouette -->
  <path d="M 120 380 L 140 280 L 260 210 L 520 210 L 660 270 L 720 340 L 720 390 L 640 400 L 600 340 L 520 340 L 480 400 L 240 400 L 200 340 L 140 340 Z" fill="url(%23metalGrad2)" stroke="%230f172a" stroke-width="3"/>
  <polygon points="270,220 500,220 460,270 240,270" fill="%230284c7" fill-opacity="0.3" stroke="%2338bdf8" stroke-width="1.5"/>
  <circle cx="170" cy="370" r="45" fill="%23020617" stroke="%23475569" stroke-width="4"/>
  <circle cx="560" cy="370" r="45" fill="%23020617" stroke="%23475569" stroke-width="4"/>

  <!-- Identical Deformation Zone from 2025 Claim -->
  <path d="M 640 275 Q 670 290 710 320 L 715 365 L 670 380 L 650 350 Q 640 300 640 275 Z" fill="url(%23damageGrad2)" stroke="%23ef4444" stroke-width="2" stroke-dasharray="4,2"/>
  <line x1="655" y1="290" x2="690" y2="330" stroke="%23fca5a5" stroke-width="2"/>
  <line x1="665" y1="310" x2="705" y2="345" stroke="%23fca5a5" stroke-width="1.5"/>
  <line x1="645" y1="320" x2="685" y2="360" stroke="%23fca5a5" stroke-width="2"/>
  
  <text x="30" y="470" fill="%2394a3b8" font-family="monospace" font-size="14">EXIF: 2025-11-14 09:15:02 UTC | CAM: APPLE-IPHONE14 | GPS: 33.7485° N, 84.3872° W</text>
  <text x="30" y="40" fill="%23fbbf24" font-family="sans-serif" font-weight="bold" font-size="18">HISTORICAL MATCH #CLM-44012 (Adjudicated SIU Fraud)</text>
</svg>`;

export const MOCK_DAMAGE_IMAGE_2 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <rect width="800" height="500" fill="%230f172a"/>
  <circle cx="400" cy="250" r="180" fill="%231e293b" stroke="%23334155" stroke-width="4"/>
  <path d="M 320 200 L 480 300 M 340 300 L 460 200" stroke="%23f43f5e" stroke-width="6" stroke-linecap="round"/>
  <text x="30" y="40" fill="%23f8fafc" font-family="sans-serif" font-weight="bold" font-size="18">EVIDENCE #IMG-88421-B2 (Odometer & Dash EXIF)</text>
  <text x="400" y="400" fill="%2338bdf8" text-anchor="middle" font-family="monospace" font-size="20">ODOMETER: 42,890 MI (Reported: 18,200 MI)</text>
</svg>`;
