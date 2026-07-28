import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
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
      paths: { "@icons/*": ["./src/icons/*"] },
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

const command = join(consumerDirectory, "node_modules/.bin/spreadworks-icons");
for (const args of [
  ["add", "--provider", "fontawesome", "--source", "free-solid", "--icon", "chevron-right", "--target", "icons"],
  ["add", "--provider", "fontawesome", "--source", "free-solid", "--icon", "xmark", "--target", "icons"],
  ["add", "--provider", "svg-file", "--file", "brand.svg", "--name", "brand-logo", "--target", "icons"],
]) {
  execFileSync(command, args, { cwd: consumerDirectory, stdio: "inherit" });
}

const iconDirectory = join(consumerDirectory, "src/icons");
for (const file of ["Icon.tsx", "icon-types.ts", "index.ts", "fontawesome/free-solid/chevron-right.ts", "custom/brand-logo.ts"]) {
  await readFile(join(iconDirectory, file), "utf8");
}
const generatedIcon = await readFile(join(iconDirectory, "fontawesome/free-solid/chevron-right.ts"), "utf8");
if (/from\s+["']@spreadworks\/icons/.test(generatedIcon)) {
  throw new Error("Generated icon must not depend on the generator package.");
}

await writeFile(
  join(consumerDirectory, "src/entry.ts"),
  'import { chevronRight } from "@icons/fontawesome/free-solid/chevron-right"; export { chevronRight };',
);
execFileSync(join(consumerDirectory, "node_modules/.bin/tsc"), ["-p", "tsconfig.json"], { cwd: consumerDirectory, stdio: "inherit" });
const bundle = await build({
  absWorkingDir: consumerDirectory,
  entryPoints: ["src/entry.ts"],
  bundle: true,
  format: "esm",
  minify: true,
  platform: "browser",
  write: false,
});
const bundledCode = bundle.outputFiles[0]?.text ?? "";
if (!bundledCode.includes("chevron-right") || bundledCode.includes("xmark")) {
  throw new Error("A consumer bundle must retain only its imported icon.");
}

process.stdout.write("Consumer owns generated runtime and icon source without a runtime generator dependency.\n");
