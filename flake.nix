{
  # Override nixpkgs to use the latest set of node packages
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/master";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem
    (system: let
      pkgs = import nixpkgs {
        inherit system;
      };
    in {
      packages.default = pkgs.buildNpmPackage {
        name = "nixcon-2023";
        src = ./.;
        npmDepsHash = "sha256-tnNSFGorf/jHgjmb+Cozg5jJQBt6y9gEIBuhW9jcolk=";
        installPhase = ''
          mkdir -p $out
          cp -a ./dist/. $out
        '';
      };
    });
}
