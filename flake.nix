{
  description = "AniDesk desktop client";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      lib = nixpkgs.lib;
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      forAllSystems = lib.genAttrs systems;
    in
    {
      packages = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
          electron = pkgs.electron;
        in
        {
          default = self.packages.${system}.anidesk;

          anidesk = pkgs.buildNpmPackage rec {
            pname = "anidesk";
            version = "0.0.1-beta.7";

            src = ./.;
            npmDepsHash = "sha256-hNZL9kBaydNu6D29sD3g3Zs6i4piCPz9naNGPw7gv+A=";
            npmBuildScript = "build";
            makeCacheWritable = true;

            env.ELECTRON_SKIP_BINARY_DOWNLOAD = "1";

            nativeBuildInputs = [
              pkgs.copyDesktopItems
              pkgs.makeWrapper
            ];

            installPhase = ''
              runHook preInstall

              mkdir -p $out/bin $out/share/anidesk $out/share/pixmaps

              cp -r package.json src public node_modules $out/share/anidesk/
              install -Dm644 public/assets/icons/anidesk-icon.png $out/share/pixmaps/anidesk.png

              makeWrapper ${lib.getExe electron} $out/bin/anidesk \
                --add-flags "$out/share/anidesk" \
                --set ELECTRON_FORCE_IS_PACKAGED 1 \
                --set ELECTRON_OVERRIDE_DIST_PATH "${electron}/libexec" \
                --run "cd $out/share/anidesk"

              runHook postInstall
            '';

            desktopItems = [
              (pkgs.makeDesktopItem {
                name = "anidesk";
                exec = "anidesk %U";
                icon = "anidesk";
                desktopName = "AniDesk";
                genericName = "Anime desktop client";
                categories = [
                  "AudioVideo"
                  "Video"
                ];
              })
            ];

            meta = {
              description = "Unofficial desktop client of Anixart";
              homepage = "https://github.com/theDesConnet/AniDesk";
              license = lib.licenses.gpl2Only;
              mainProgram = "anidesk";
              platforms = systems;
            };
          };
        }
      );

      apps = forAllSystems (
        system:
        {
          default = {
            type = "app";
            program = "${self.packages.${system}.default}/bin/anidesk";
            meta.description = "Run AniDesk";
          };
        }
      );

      devShells = forAllSystems (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            packages = [
              pkgs.nodejs
              pkgs.electron
            ];

            ELECTRON_SKIP_BINARY_DOWNLOAD = "1";
          };
        }
      );

      nixosModules.default =
        { pkgs, ... }:
        let
          system = pkgs.stdenv.hostPlatform.system;
        in
        {
          environment.systemPackages = [
            self.packages.${system}.default
          ];
        };
    };
}
