# shell.nix
{ pkgs ? import <nixpkgs> {} }:

let
  node = pkgs.nodejs_22;
in
pkgs.mkShell {
  packages = with pkgs; [
    node
    pnpm                              # fallback if Corepack isn’t available
    nodePackages.typescript
    nodePackages.typescript-language-server
    biome
    esbuild                           # useful for tsup/vite plugins
  ];

  # avoid global npm writes
  NPM_CONFIG_PREFIX = "${toString ./.}/.npm-global";
  NODE_ENV = "development";

  shellHook = ''
    # project-local shims for Corepack
    export COREPACK_HOME="$PWD/.corepack"
    export PATH="$COREPACK_HOME/shims:$PWD/node_modules/.bin:$PATH"

    # prefer Corepack-pinned pnpm; fall back to nixpkgs pnpm
    if command -v corepack >/dev/null 2>&1; then
      # use your repo pin if present; otherwise grab a sensible default
      corepack prepare pnpm@10 --activate >/dev/null 2>&1 || true
    else
      echo "[devshell] Corepack not found in this Node build; using nixpkgs pnpm."
    fi
  '';
}

