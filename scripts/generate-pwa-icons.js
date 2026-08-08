const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// HealthBridge SVG Logo for PWA Icon
const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="128" fill="url(#bg_grad)"/>
  <path d="M256 120C180 120 120 180 120 256C120 332 180 392 256 392C332 392 392 332 392 256C392 180 332 120 256 120Z" fill="white" fill-opacity="0.15"/>
  <path d="M256 160C300.183 160 336 195.817 336 240C336 295.4 266.8 345.8 259.4 351C257.4 352.4 254.6 352.4 252.6 351C245.2 345.8 176 295.4 176 240C176 195.817 211.817 160 256 160Z" fill="#F9DF77"/>
  <path d="M220 240H242L249 220L259 265L268 230L274 240H292" stroke="#2F3273" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
  <defs>
    <linearGradient id="bg_grad" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
      <stop stop-color="#2F3273"/>
      <stop offset="1" stop-color="#4D50A2"/>
    </linearGradient>
  </defs>
</svg>
`;

async function generateIcons() {
  const svgBuffer = Buffer.from(svgIcon);

  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192x192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512x512.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(iconsDir, 'maskable-512x512.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'));

  console.log('Successfully generated HealthBridge PWA icons in public/icons/');
}

generateIcons().catch(err => {
  console.error('Failed to generate PWA icons:', err);
});
