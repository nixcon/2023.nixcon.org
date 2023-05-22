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
        name = "site";
        src = ./.;
        npmDepsHash = "sha256-5clY4iqaHl09aeQxaZpKOzZmU3KY3FUaLClpzsZ2s/s=";
        installPhase = ''
          mkdir -p $out
          cp -a ./dist/. $out
        '';
      };
    });
}
