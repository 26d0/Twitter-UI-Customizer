import fs from "node:fs/promises";
import path from "node:path";

import ChromeExtenson from "crx";
import { Plugin } from "vite";

function generateCRX() {
    const crx = new ChromeExtenson({
        codebase: `https://github.com/${process.env.GITHUB_REPO}/releases/latest/download/Twitter_UI_Customizer_Chromium.crx`,
        privateKey: process.env.CHROME_EXTENSION_KEY,
    });

    crx.load(path.resolve("dist"))
        .then(() => {
            crx.pack()
                .then((crxBuffer) => {
                    fs.writeFile("crxupdate.xml", crx.generateUpdateXML());
                    fs.writeFile("Twitter_UI_Customizer_Chromium.crx", crxBuffer);
                })
                .catch(console.error);
        })
        .catch(console.error);
}

export default async (mode: string): Promise<Plugin> => {
    return {
        name: "generate-crx",
        enforce: "post",
        apply: "build",
        closeBundle() {
            if (mode === "chromiumCRX") {
                generateCRX();
                console.log("\x1b[32m✓\x1b[0m CRX generated.");
            }
        },
    };
};
