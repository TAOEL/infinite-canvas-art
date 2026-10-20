const sharp = require("sharp");
const toIco = require("to-ico");
const fs = require("fs");
const path = require("path");

const svgPath = path.join(__dirname, "app", "logo.svg");
const icoPath = path.join(__dirname, "build", "icon.ico");
const pngDir = path.join(__dirname, "build");
fs.mkdirSync(pngDir, { recursive: true });

const sizes = [16, 32, 48, 64, 128, 256];

(async () => {
    const pngBuffers = [];
    for (const size of sizes) {
        const buf = await sharp(svgPath, { density: 384 })
            .resize(size, size)
            .png()
            .toBuffer();
        pngBuffers.push(buf);
        console.log(`generated ${size}x${size} png (${buf.length} bytes)`);
    }
    const ico = await toIco(pngBuffers);
    fs.writeFileSync(icoPath, ico);
    console.log(`wrote ${icoPath} (${ico.length} bytes)`);
})().catch((err) => {
    console.error(err);
    process.exit(1);
});
