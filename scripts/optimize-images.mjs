import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const imagesDir = path.join(root, "imagenes");
const optimizedDir = path.join(imagesDir, "optimized");
const docsDir = path.join(root, "docs");

fs.mkdirSync(optimizedDir, { recursive: true });
fs.mkdirSync(docsDir, { recursive: true });

const reportRows = [];

function bytesToKb(bytes) {
  return Number((bytes / 1024).toFixed(2));
}

function savingPct(oldBytes, newBytes) {
  if (oldBytes === 0) return 0;
  return Number((((oldBytes - newBytes) / oldBytes) * 100).toFixed(2));
}

function pushReport(name, oldFormat, newFormat, oldBytes, newBytes, oldFile, newFile) {
  reportRows.push({
    nombre: name,
    formatoAntiguo: oldFormat,
    formatoNuevo: newFormat,
    pesoAntiguoKB: bytesToKb(oldBytes),
    pesoNuevoKB: bytesToKb(newBytes),
    mejoraPorcentaje: savingPct(oldBytes, newBytes),
    archivoAntiguo: oldFile,
    archivoNuevo: newFile,
  });
}

async function optimizeRasterOriginals() {
  const originalRasterFiles = [
    "dg.jpg",
    "ntpq.jpg",
    "Netflix.jpg",
    "s.jpg",
    "banderaes.png",
    "Banderain.png",
  ];

  for (const file of originalRasterFiles) {
    const sourcePath = path.join(imagesDir, file);
    if (!fs.existsSync(sourcePath)) continue;

    const parsed = path.parse(file);
    let outputPath;
    let newFormat;

    if (parsed.ext.toLowerCase() === ".png") {
      const webpPath = path.join(optimizedDir, `${parsed.name}-opt.webp`);
      const pngPath = path.join(optimizedDir, `${parsed.name}-opt.png`);

      await sharp(sourcePath)
        .rotate()
        .webp({ quality: 78, effort: 6 })
        .toFile(webpPath);

      await sharp(sourcePath)
        .rotate()
        .png({ compressionLevel: 9, palette: true, quality: 90 })
        .toFile(pngPath);

      const webpSize = fs.statSync(webpPath).size;
      const pngSize = fs.statSync(pngPath).size;

      if (pngSize <= webpSize) {
        outputPath = pngPath;
        newFormat = "png";
      } else {
        outputPath = webpPath;
        newFormat = "webp";
      }
    } else {
      outputPath = path.join(optimizedDir, `${parsed.name}-opt.webp`);
      newFormat = "webp";

      await sharp(sourcePath)
        .rotate()
        .webp({ quality: 78, effort: 6 })
        .toFile(outputPath);
    }

    const oldBytes = fs.statSync(sourcePath).size;
    const newBytes = fs.statSync(outputPath).size;
    pushReport(
      parsed.base,
      parsed.ext.replace(".", ""),
      newFormat,
      oldBytes,
      newBytes,
      path.relative(root, sourcePath),
      path.relative(root, outputPath)
    );
  }
}

async function generateResponsiveFromSvg(baseName) {
  const sourcePath = path.join(imagesDir, `${baseName}.svg`);
  if (!fs.existsSync(sourcePath)) return;

  const widths = [480, 960, 1440];
  for (const width of widths) {
    await sharp(sourcePath)
      .resize({ width })
      .avif({ quality: 50, effort: 6 })
      .toFile(path.join(optimizedDir, `${baseName}-${width}.avif`));

    await sharp(sourcePath)
      .resize({ width })
      .webp({ quality: 80, effort: 6 })
      .toFile(path.join(optimizedDir, `${baseName}-${width}.webp`));

    await sharp(sourcePath)
      .resize({ width })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(optimizedDir, `${baseName}-${width}.jpg`));
  }

}

async function generateArtDirectionCrops(baseName) {
  const sourcePath = path.join(imagesDir, `${baseName}.svg`);
  if (!fs.existsSync(sourcePath)) return;

  await sharp(sourcePath)
    .resize({ width: 680, height: 860, fit: "cover", position: "centre" })
    .webp({ quality: 82, effort: 6 })
    .toFile(path.join(optimizedDir, `${baseName}-hero-mobile.webp`));

  await sharp(sourcePath)
    .resize({ width: 1400, height: 620, fit: "cover", position: "centre" })
    .webp({ quality: 82, effort: 6 })
    .toFile(path.join(optimizedDir, `${baseName}-hero-desktop.webp`));
}

function buildMarkdownTable(rows) {
  const header = [
    "| Imagen | Formato antiguo | Formato nuevo | Peso antiguo (KB) | Peso nuevo (KB) | Mejora (%) |",
    "|---|---|---|---:|---:|---:|",
  ];

  const body = rows
    .map((row) => {
      return `| ${row.nombre} | ${row.formatoAntiguo} | ${row.formatoNuevo} | ${row.pesoAntiguoKB} | ${row.pesoNuevoKB} | ${row.mejoraPorcentaje} |`;
    })
    .join("\n");

  return `${header.join("\n")}\n${body}`;
}

async function main() {
  await optimizeRasterOriginals();

  const bases = ["comida-entrada", "comida-principal", "comida-postre"];
  for (const base of bases) {
    await generateResponsiveFromSvg(base);
  }

  await generateArtDirectionCrops("comida-principal");
  await generateArtDirectionCrops("comida-postre");

  const sorted = reportRows.sort((a, b) => b.mejoraPorcentaje - a.mejoraPorcentaje);

  fs.writeFileSync(
    path.join(docsDir, "image-optimization-report.json"),
    JSON.stringify(sorted, null, 2),
    "utf8"
  );

  fs.writeFileSync(path.join(docsDir, "image-optimization-table.md"), buildMarkdownTable(sorted), "utf8");

  const averageSaving =
    sorted.reduce((acc, current) => acc + current.mejoraPorcentaje, 0) /
    (sorted.length || 1);

  console.log(`Imagenes procesadas: ${sorted.length}`);
  console.log(`Ahorro medio: ${averageSaving.toFixed(2)}%`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
