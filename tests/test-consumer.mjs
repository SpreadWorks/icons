import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build } from "esbuild";

const consumerDirectory = await mkdtemp(join(tmpdir(), "spreadworks-icons-consumer-"));
const packed = JSON.parse(
  execFileSync("npm", ["pack", "--json", "--pack-destination", consumerDirectory, "--ignore-scripts"], {
    encoding: "utf8",
    env: { ...process.env, npm_config_dry_run: "false" },
  }),
);
const tarball = join(consumerDirectory, packed[0].filename);
await writeFile(join(consumerDirectory, "package.json"), JSON.stringify({ name: "icons-consumer", private: true, type: "module" }));
await writeFile(join(consumerDirectory, "icons.json"), JSON.stringify({ aliases: { icons: "@icons" } }));
await writeFile(
  join(consumerDirectory, "tsconfig.json"),
  JSON.stringify({
    compilerOptions: {
      strict: true,
      noEmit: true,
      jsx: "react-jsx",
      module: "ESNext",
      moduleResolution: "Bundler",
      skipLibCheck: true,
      baseUrl: ".",
      paths: {
        "@icons": ["./src/icons/index.ts"],
        "@icons/*": ["./src/icons/*"],
        "@fortawesome/react-fontawesome": ["./src/icons/fontawesome/FontAwesomeIcon.tsx"],
        "@fortawesome/*": ["./src/icons/fontawesome/*"],
      },
    },
    include: ["src"],
  }),
);
await writeFile(join(consumerDirectory, "brand.svg"), '<svg viewBox="0 0 10 10"><rect width="10" height="10"/></svg>');
execFileSync(
  "npm",
  ["install", "--ignore-scripts", "--no-package-lock", tarball, "react@^18.3.1", "@types/react@^18.3.0", "typescript@^5.6.0"],
  { cwd: consumerDirectory, stdio: "inherit", env: { ...process.env, npm_config_dry_run: "false" } },
);

const proPackageDirectory = join(consumerDirectory, "node_modules/@fortawesome/pro-light-svg-icons");
await mkdir(proPackageDirectory, { recursive: true });
await writeFile(join(proPackageDirectory, "package.json"), JSON.stringify({ name: "@fortawesome/pro-light-svg-icons", type: "module", exports: "./index.js" }));
await writeFile(
  join(proPackageDirectory, "index.js"),
  'export const faChevronRight = { icon: [320, 512, [], "f054", "M0 0h320v512H0z"] };',
);

const command = join(consumerDirectory, "node_modules/.bin/spreadworks-icons");
for (const args of [
  ["add", "--provider", "fontawesome", "--source", "free-solid", "--icon", "chevron-right", "--target", "icons"],
  ["add", "--provider", "fontawesome", "--source", "free-solid", "--icon", "xmark", "--target", "icons"],
  ["add", "--provider", "fontawesome", "--source", "pro-light", "--icon", "chevron-right", "--target", "icons"],
  ["add", "--provider", "svg-file", "--file", "brand.svg", "--name", "brand-logo", "--target", "icons"],
]) {
  execFileSync(command, args, { cwd: consumerDirectory, stdio: "inherit" });
}

const iconDirectory = join(consumerDirectory, "src/icons");
for (const file of [
  "Icon.tsx",
  "icon-types.ts",
  "index.ts",
  "fontawesome/FontAwesomeIcon.tsx",
  "fontawesome/fontawesome-svg-core/styles.css",
  "fontawesome/free-solid-svg-icons/faChevronRight.ts",
  "fontawesome/pro-light-svg-icons/faChevronRight.ts",
  "custom/brand-logo.ts",
]) {
  await readFile(join(iconDirectory, file), "utf8");
}
const generatedIcon = await readFile(join(iconDirectory, "fontawesome/free-solid-svg-icons/faChevronRight.ts"), "utf8");
if (/from\s+["']@spreadworks\/icons/.test(generatedIcon)) {
  throw new Error("Generated icon must not depend on the generator package.");
}
if (!generatedIcon.includes("export const faChevronRight")) {
  throw new Error("Generated Font Awesome icon must preserve its export name.");
}

await writeFile(
  join(consumerDirectory, "src/entry.tsx"),
  [
    'import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";',
    'import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight";',
    'import "@fortawesome/fontawesome-svg-core/styles.css";',
    'export const legacyIcon = <FontAwesomeIcon icon={faChevronRight} size="sm" flip="horizontal" />;',
  ].join("\n"),
);
execFileSync(join(consumerDirectory, "node_modules/.bin/tsc"), ["-p", "tsconfig.json"], { cwd: consumerDirectory, stdio: "inherit" });
const bundle = await build({
  absWorkingDir: consumerDirectory,
  entryPoints: ["src/entry.tsx"],
  bundle: true,
  format: "esm",
  minify: true,
  platform: "browser",
  outdir: "out",
  write: false,
});
const bundledCode = bundle.outputFiles.find((file) => file.path.endsWith(".js"))?.text ?? "";
if (!bundledCode.includes("chevron-right") || bundledCode.includes("faXmark") || bundledCode.includes("@spreadworks/icons")) {
  throw new Error("A consumer bundle must retain only its imported icon.");
}

process.stdout.write("Consumer owns generated runtime and icon source without a runtime generator dependency.\n");
