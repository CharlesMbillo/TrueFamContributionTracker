{ pkgs }: {
  deps = [
    pkgs.nano
    pkgs.openssh
    pkgs.imagemagick
    pkgs.jdk17
    pkgs.android-tools
    pkgs.gradle
  ];
}