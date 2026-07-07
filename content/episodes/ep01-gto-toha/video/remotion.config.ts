import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
// Use the pre-installed Chromium instead of downloading one.
Config.setChromiumOpenGlRenderer("angle");
