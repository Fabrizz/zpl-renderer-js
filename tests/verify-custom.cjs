const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const zlib = require("node:zlib");
const { buildCustom, detectAdapterModule, parseTarget } = require("../build-custom.js");

const PNG_SIGNATURE = "89504e470d0a1a0a";

function readPng(base64) {
  const bytes = Buffer.from(base64, "base64");
  assert.equal(bytes.subarray(0, 8).toString("hex"), PNG_SIGNATURE);
  let offset = 8;
  let width;
  let height;
  let bitDepth;
  let colorType;
  const idat = [];
  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.subarray(offset + 4, offset + 8).toString("ascii");
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === "IDAT") {
      idat.push(data);
    }
    offset += length + 12;
    if (type === "IEND") break;
  }
  assert.equal(bitDepth, 8, "verification expects an 8-bit PNG");
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[colorType];
  assert.ok(channels, `unsupported PNG color type ${colorType}`);
  const rowSize = width * channels;
  const packed = zlib.inflateSync(Buffer.concat(idat));
  const rows = [];
  let previous = Buffer.alloc(rowSize);
  let cursor = 0;
  const paeth = (a, b, c) => {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y += 1) {
    const filter = packed[cursor++];
    const row = Buffer.from(packed.subarray(cursor, cursor + rowSize));
    cursor += rowSize;
    for (let x = 0; x < rowSize; x += 1) {
      const left = x >= channels ? row[x - channels] : 0;
      const up = previous[x];
      const upperLeft = x >= channels ? previous[x - channels] : 0;
      if (filter === 1) row[x] = (row[x] + left) & 0xff;
      else if (filter === 2) row[x] = (row[x] + up) & 0xff;
      else if (filter === 3) row[x] = (row[x] + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) row[x] = (row[x] + paeth(left, up, upperLeft)) & 0xff;
      else assert.equal(filter, 0, `unsupported PNG filter ${filter}`);
    }
    rows.push(row);
    previous = row;
  }
  return { width, height, channels, rows };
}

function darkBounds(png) {
  let left = png.width;
  let right = -1;
  let top = png.height;
  let bottom = -1;
  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      if (png.rows[y][x * png.channels] < 128) {
        left = Math.min(left, x);
        right = Math.max(right, x);
        top = Math.min(top, y);
        bottom = Math.max(bottom, y);
      }
    }
  }
  assert.ok(right >= left && bottom >= top, "expected dark pixels");
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

async function main() {
  const root = path.resolve(__dirname, "..");
  const requested = process.argv[2] || "github.com/Gobbo89/zebrash@v1.40.0";
  const sourceFiles = ["zebrash/main.go", "zebrash/go.mod", "zebrash/go.sum", "src/wasm_exec.js"];
  const before = sourceFiles.map((file) => fs.readFileSync(path.join(root, file)));
  const assertSourceUnchanged = () => sourceFiles.forEach((file, index) =>
    assert.deepEqual(fs.readFileSync(path.join(root, file)), before[index], file));

  assert.equal(detectAdapterModule(before[0].toString("utf8")), "github.com/ingridhq/zebrash");
  assert.deepEqual(parseTarget(requested).modulePath, "github.com/Gobbo89/zebrash");
  for (const invalid of [
    "", "--help", "../local@v1", "github.com/x/y", "github.com/x/y@v1;echo hi",
    "github.com/x/y@../local", "github.com/x/y@-bad",
  ]) {
    assert.throws(() => parseTarget(invalid), /Usage/);
  }

  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "custom-build-test-"));
  try {
    const metadata = buildCustom(root, requested, { temporaryRoot });
    assert.equal(metadata.requested, requested);
    assert.equal(metadata.adapterModule, "github.com/ingridhq/zebrash");
    assert.equal(metadata.module.Path, "github.com/Gobbo89/zebrash");
    assert.equal(metadata.module.Version, "v1.40.0");
    assert.deepEqual(fs.readdirSync(temporaryRoot), [], "temporary build directory was not removed");
  } finally {
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
  assertSourceUnchanged();

  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "custom-cli-test-"));
  try {
    fs.copyFileSync(path.join(root, "build-custom.js"), path.join(fixture, "build-custom.js"));
    fs.cpSync(path.join(root, "zebrash"), path.join(fixture, "zebrash"), { recursive: true });
    fs.mkdirSync(path.join(fixture, "src"));
    fs.copyFileSync(path.join(root, "src", "wasm_exec.js"), path.join(fixture, "src", "wasm_exec.js"));
    fs.mkdirSync(path.join(fixture, "external"));
    const sentinel = path.join(fixture, "external", "custom-zebrash.wasm");
    fs.writeFileSync(sentinel, "previous successful build");
    const env = { ...process.env };
    for (const key of Object.keys(env)) if (key.toLowerCase() === "path") delete env[key];
    env.PATH = fixture;
    const failure = spawnSync(process.execPath, [path.join(fixture, "build-custom.js"), requested], {
      env,
      encoding: "utf8",
    });
    assert.equal(failure.status, 1, failure.stderr);
    assert.match(failure.stderr, /Custom WASM build failed/);
    assert.equal(fs.readFileSync(sentinel, "utf8"), "previous successful build");
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
  assertSourceUnchanged();

  const external = require(path.join(root, "dist", "index.external.cjs.js"));
  const wasmBytes = fs.readFileSync(path.join(root, "external", "custom-zebrash.wasm"));
  await external.init({ wasmBytes });
  const render = async (zpl, width = 80, height = 50, dpmm = 8) => {
    const base64 = await external.zplToBase64Async(zpl, width, height, dpmm);
    assert.ok(base64.length > 100);
    return readPng(base64);
  };

  await render("^XA^FO10,10^A0N,28^FDHello from custom Zebrash^FS^XZ");
  const ean8 = darkBounds(await render("^XA^FO10,10^BY2^B8N,96,N,N^FD2001101^FS^XZ"));
  assert.equal(ean8.width, 134, "EAN-8 should contain 67 modules at BY2");
  const code128 = darkBounds(await render("^XA^FO10,10^BY3^BCN,100,N,N,N^FD>:ABC>512345678^FS^XZ", 100, 50, 8));
  assert.equal(code128.width, 369, "Code 128 should use subset C after >5");
  const graphic = darkBounds(await render("^XA^FO10,10^GFA,4,4,1,FF FF FF FF^FS^XZ"));
  assert.deepEqual({ width: graphic.width, height: graphic.height }, { width: 8, height: 4 });

  const labels = await external.zplToBase64MultipleAsync(
    "^XA^FO10,10^FDfirst^FS^XZ^XA^FO10,10^FDsecond^FS^XZ",
    60,
    40,
    8,
  );
  assert.equal(labels.length, 2);
  labels.forEach((base64) => assert.equal(Buffer.from(base64, "base64").subarray(0, 8).toString("hex"), PNG_SIGNATURE));
  assertSourceUnchanged();
  console.log("PASS: custom build, input rejection, cleanup, failure preservation, external loading, text, EAN-8, Code 128, graphics, and multi-label rendering.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
