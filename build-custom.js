const { execFileSync } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const usage = "Usage: npm run build:custom -- <canonical-module@version-or-ref>";

function parseTarget(value) {
  if (typeof value !== "string" || value.startsWith("-")) {
    throw new Error(usage);
  }

  const separator = value.lastIndexOf("@");
  const modulePath = value.slice(0, separator);
  const query = value.slice(separator + 1);
  const validModule = /^[A-Za-z0-9][A-Za-z0-9._~-]*(?:\/[A-Za-z0-9._~-]+)+$/;
  const validQuery = /^[A-Za-z0-9][A-Za-z0-9._+~\/-]*$/;

  if (
    separator <= 0 ||
    !validModule.test(modulePath) ||
    !validQuery.test(query) ||
    modulePath.split("/").some((part) => part === "." || part === "..") ||
    query.split("/").some((part) => part === "." || part === "..")
  ) {
    throw new Error(usage);
  }

  return { modulePath, query, target: value };
}

function detectAdapterModule(source) {
  const modules = new Set();
  const importPattern = /"([A-Za-z0-9][A-Za-z0-9._~-]*(?:\/[A-Za-z0-9._~-]+)*\/zebrash)(?:\/[^"\r\n]+)?"/g;
  for (const match of source.matchAll(importPattern)) modules.add(match[1]);
  if (modules.size !== 1) {
    throw new Error(`Expected exactly one canonical Zebrash module in the adapter, found ${modules.size}.`);
  }
  return [...modules][0];
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeRuntime(source) {
  return source.replace(/\r\n/g, "\n").trim();
}

function selectModuleMetadata(module) {
  const selected = {};
  for (const key of ["Path", "Version", "Query", "Time", "Sum", "GoModSum", "GoVersion"]) {
    if (module[key] !== undefined) selected[key] = module[key];
  }
  return selected;
}

function buildCustom(root, requestedTarget, options = {}) {
  const target = parseTarget(requestedTarget);
  const adapterDir = path.join(root, "zebrash");
  const adapterFiles = fs.readdirSync(adapterDir)
    .filter((file) => file.endsWith(".go") || file === "go.mod" || file === "go.sum");
  if (!adapterFiles.includes("main.go") || !adapterFiles.includes("go.mod")) {
    throw new Error("Expected zebrash/main.go and zebrash/go.mod in the source checkout.");
  }

  const sourceModule = detectAdapterModule(fs.readFileSync(path.join(adapterDir, "main.go"), "utf8"));
  const temporaryRoot = options.temporaryRoot || os.tmpdir();
  const temporary = fs.mkdtempSync(path.join(temporaryRoot, "zebrash-custom-"));
  const env = {
    ...process.env,
    GOWORK: "off",
    GOOS: "js",
    GOARCH: "wasm",
    CGO_ENABLED: "0",
  };
  const runGo = (args, capture = false) => execFileSync("go", args, {
    cwd: temporary,
    env,
    stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
    encoding: capture ? "utf8" : undefined,
  });

  try {
    for (const file of adapterFiles) {
      fs.copyFileSync(path.join(adapterDir, file), path.join(temporary, file));
    }

    const importPattern = new RegExp(`"${escapeRegExp(sourceModule)}(\\/[^"\\r\\n]+)?"`, "g");
    for (const file of adapterFiles.filter((name) => name.endsWith(".go"))) {
      const filePath = path.join(temporary, file);
      const source = fs.readFileSync(filePath, "utf8");
      fs.writeFileSync(filePath, source.replace(importPattern, (_match, suffix = "") =>
        `"${target.modulePath}${suffix}"`));
    }

    runGo(["mod", "edit", `-droprequire=${sourceModule}`]);
    runGo(["get", target.target]);
    runGo(["mod", "tidy"]);

    const goroot = runGo(["env", "GOROOT"], true).trim();
    const runtimePath = ["lib", "misc"]
      .map((directory) => path.join(goroot, directory, "wasm", "wasm_exec.js"))
      .find((candidate) => fs.existsSync(candidate));
    const bundledRuntimePath = path.join(root, "src", "wasm_exec.js");
    if (
      !runtimePath ||
      normalizeRuntime(fs.readFileSync(runtimePath, "utf8")) !==
        normalizeRuntime(fs.readFileSync(bundledRuntimePath, "utf8"))
    ) {
      throw new Error(
        "Go wasm_exec.js differs from src/wasm_exec.js. Use the matching Go toolchain " +
        "(GOTOOLCHAIN), or update the bundled runtime and rebuild/test the JS package first."
      );
    }

    const temporaryWasm = path.join(temporary, "custom-zebrash.wasm");
    runGo(["build", "-o", temporaryWasm, "-trimpath", "-buildvcs=false", "-ldflags=-s -w", "."]);
    const resolvedModule = JSON.parse(runGo(["list", "-m", "-json", target.modulePath], true));
    const runtimeBytes = fs.readFileSync(bundledRuntimePath);
    const metadata = {
      schemaVersion: 1,
      requested: target.target,
      adapterModule: sourceModule,
      module: selectModuleMetadata(resolvedModule),
      compiler: runGo(["version"], true).trim(),
      target: { GOOS: "js", GOARCH: "wasm", CGO_ENABLED: "0" },
      wasmExecSha256: crypto.createHash("sha256").update(runtimeBytes).digest("hex"),
    };
    const temporaryMetadata = path.join(temporary, "custom-zebrash.json");
    fs.writeFileSync(temporaryMetadata, `${JSON.stringify(metadata, null, 2)}\n`);

    const output = path.join(root, "external");
    fs.mkdirSync(output, { recursive: true });
    fs.copyFileSync(temporaryWasm, path.join(output, "custom-zebrash.wasm"));
    fs.copyFileSync(temporaryMetadata, path.join(output, "custom-zebrash.json"));
    console.log(`Built ${target.target}: ${path.join(output, "custom-zebrash.wasm")}`);
    return metadata;
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

if (require.main === module) {
  try {
    if (process.argv.length !== 3) throw new Error(usage);
    buildCustom(__dirname, process.argv[2]);
  } catch (error) {
    console.error(`Custom WASM build failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { buildCustom, detectAdapterModule, parseTarget };
