import { access, readFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";

type IconsConfig = { aliases?: Record<string, string> };
type TsConfig = { compilerOptions?: { paths?: Record<string, string[]> } };

function isWithin(parent: string, child: string): boolean {
  const path = relative(parent, child);
  return path === "" || (!path.startsWith("..") && !isAbsolute(path));
}

export async function resolveTargetDirectory(options: {
  configPath: string;
  target: string;
}): Promise<string> {
  const configPath = resolve(options.configPath);
  const projectRoot = dirname(configPath);
  const config = JSON.parse(await readFile(configPath, "utf8")) as IconsConfig;
  const alias = config.aliases?.[options.target];
  if (!alias) throw new Error(`icons.json does not define the "${options.target}" target.`);

  const tsconfigPath = resolve(projectRoot, "tsconfig.json");
  const tsconfig = JSON.parse(await readFile(tsconfigPath, "utf8")) as TsConfig;
  const pathPattern = `${alias}/*`;
  const mappedPaths = tsconfig.compilerOptions?.paths?.[pathPattern];
  if (!mappedPaths?.length) {
    throw new Error(`tsconfig.json must map "${pathPattern}" for the "${options.target}" target.`);
  }

  const sourcePattern = mappedPaths[0]!;
  if (!sourcePattern.endsWith("/*")) throw new Error(`The "${pathPattern}" path mapping must end in "/*".`);
  const outputDirectory = resolve(projectRoot, sourcePattern.slice(0, -2));
  if (!isWithin(projectRoot, outputDirectory)) throw new Error("Icon target must resolve inside the project root.");
  return outputDirectory;
}

export async function findIconsConfig(startDirectory: string): Promise<string> {
  let directory = resolve(startDirectory);
  while (true) {
    const candidate = resolve(directory, "icons.json");
    try {
      await access(candidate);
      return candidate;
    } catch {
      const parent = dirname(directory);
      if (parent === directory) throw new Error("Could not find icons.json. Pass --config <path> to select a project.");
      directory = parent;
    }
  }
}
