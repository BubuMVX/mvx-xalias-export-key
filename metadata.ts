import {Metadata} from "userscript-metadata";
import {BuildConfig,} from "userscripter/build-time";

import U from "./src/userscript";

export default function (_: BuildConfig): Metadata {
    return {
        name: U.name,
        version: U.version,
        description: U.description,
        author: U.author,
        homepageURL: "https://x.com/BubuMVX",
        match: [
            `https://${U.hostname}/*`,
        ],
        namespace: U.namespace,
        run_at: U.runAt,
        icon: "https://www.google.com/s2/favicons?sz=64&domain=xalias.com",
        downloadURL: "https://github.com/BubuMVX/mvx-xalias-export-key/raw/main/dist/xalias-export-key.user.js",
    };
}
