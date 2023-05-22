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
        npmDepsHash = "sha256-KegUJItyeaevVtnUR2sheuu1C8XqGWLy9t9oP4O+cis=";
        installPhase = ''
          mkdir -p $out
          cp -a ./dist/. $out
        '';
      };
    });
}
