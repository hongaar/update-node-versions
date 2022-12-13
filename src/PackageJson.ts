// https://github.com/ffflorian/schemastore-updater/blob/main/schemas/package/index.d.ts
export type PackageJson = {
  name?: string;
  version?: string;
  description?: string;
  keywords?: string[];
  homepage?:
    | {
        [k: string]: any;
      }
    | ".";
  bugs?:
    | {
        [k: string]: any;
      }
    | string;
  license?: string;
  licenses?: {
    type?: string;
    url?: string;
    [k: string]: any;
  }[];
  author?: Person;
  contributors?: Person[];
  maintainers?: Person[];
  type?: "module" | "commonjs";
  files?: string[];
  main?: string;
  bin?:
    | string
    | {
        [k: string]: any;
      };
  types?: string;
  typings?: string;
  man?: string[];
  directories?: {
    bin?: string;
    doc?: string;
    example?: string;
    lib?: string;
    man?: string;
    test?: string;
    [k: string]: any;
  };
  repository?:
    | {
        [k: string]: any;
      }
    | string;
  scripts?: {
    [k: string]: string | undefined;
  };
  config?: {
    [k: string]: any;
  };
  dependencies?: Dependency;
  devDependencies?: Dependency;
  optionalDependencies?: Dependency;
  peerDependencies?: Dependency;
  resolutions?: Dependency;
  engines?: {
    [k: string]: string;
  };
  engineStrict?: boolean;
  os?: string[];
  cpu?: string[];
  preferGlobal?: boolean;
  private?: boolean;
  publishConfig?: {
    [k: string]: any;
  };
  dist?: {
    shasum?: string;
    tarball?: string;
    [k: string]: any;
  };
  readme?: string;
  module?: string;
  esnext?:
    | string
    | {
        [k: string]: any;
      };
  workspaces?: string[];
  [k: string]: any;
};

type Person =
  | {
      [k: string]: any;
    }
  | string;

type Dependency = {
  [k: string]: string;
};
