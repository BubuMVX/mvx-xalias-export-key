import {ALWAYS} from "userscripter/run-time/environment";
import {stylesheet, Stylesheets} from "userscripter/run-time/stylesheets";
import {SELECTOR_BTN_CONTAINER} from "~src/config";

const STYLESHEETS = {
    main: stylesheet({
        condition: ALWAYS,
        css: `
            ${SELECTOR_BTN_CONTAINER} {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        `,
    }),
} as const;

// This trick uncovers type errors in STYLESHEETS while retaining the static knowledge of its properties (so we can still write e.g. STYLESHEETS.foo):
const _: Stylesheets = STYLESHEETS;
void _;

export default STYLESHEETS;
