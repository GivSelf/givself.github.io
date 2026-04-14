import puppeteer from "puppeteer";

const BASE = "http://10.0.0.20:3033";

// App Store screenshot sizes
const SIZES = [
  { name: "6.7", width: 430, height: 932, scale: 3 },  // 1290x2796
  { name: "5.5", width: 414, height: 736, scale: 3 },  // 1242x2208
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
    console.log(`Capturing ${filename}...`);
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
console.log("Done — App Store screenshots saved to images/");
