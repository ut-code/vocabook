{
  description = "vocabook dev environment with working Prisma engines on NixOS";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    prisma-utils.url = "github:VanCoding/nix-prisma-utils";
  };

  outputs =
    { nixpkgs, flake-utils, prisma-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        prisma = prisma-utils.lib.prisma-factory {
          inherit pkgs;
          hash = "sha256-dgsaGFfvH7xYadygnwN6uJwOo6DwHTo219x7to2+1IM=";
          npmLock = ./package-lock.json;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_24
          ];
          env = prisma.env;
        };
      }
    );
}
