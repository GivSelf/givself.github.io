import puppeteer from "puppeteer";

const BASE = "http://10.0.0.20:3033";

// Exact App Store required dimensions
const SIZES = [
  { name: "6.5", width: 414, height: 896, scale: 3 },   // 1242x2688
  { name: "6.7", width: 428, height: 926, scale: 3 },   // 1284x2778
];

const PAGES = [
  { name: "dashboard", path: "/" },
  { name: "analytics", path: "/analytics" },
  { name: "schedules", path: "/schedules" },
];

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });

for (const size of SIZES) {
  for (const page of PAGES) {
    const filename = `appstore-${size.name}-${page.name}.png`;
    console.log(`Capturing ${filename} (${size.width * size.scale}x${size.height * size.scale})...`);
    const p = await browser.newPage();
    await p.setViewport({
      width: size.width,
      height: size.height,
      deviceScaleFactor: size.scale,
    });
    await p.goto(`${BASE}${page.path}`, { waitUntil: "networkidle2", timeout: 15000 });
    await new Promise((r) => setTimeout(r, 4000));
    await p.screenshot({ path: `images/${filename}`, type: "png" });
    await p.close();
  }
}

await browser.close();
console.log("Done");
