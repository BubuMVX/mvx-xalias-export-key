xAlias Export Key Userscript

# Intro

This is an userscript to help you export your private key from xAlias, one of the login methods on MultiversX.

It allows you to retrieve your private key in various formats:

- Seed: a simple text file with your seed/mnemonic words. Be careful how you store it.
- JSON: a keystore protected with a password. With a strong password, you can almost store it as it is.
- PEM: a raw private key, without any protection. Be careful how you store it.

This program works by injecting itself into the xAlias web page, and adding functionalities to it.

![Preview of this userscript](preview.png)

# Usage

1. Install
   Tampermonkey ([Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) / [Firefox](https://addons.mozilla.org/fr/firefox/addon/tampermonkey/))
   or any userscript tool for your browser.
2. Add the script [dist/xalias-export-key.user.js](dist/xalias-export-key.user.js) into Tampermonkey
   or [click here for an automatic installation](https://github.com/BubuMVX/mvx-xalias-export-key/raw/main/dist/xalias-export-key.user.js).
3. Visit https://xalias.com/ and login to get access to the export options.

# Build

For security reasons, this script is fully open source. You can review the code and build it by yourself.

```sh
git clone https://github.com/BubuMVX/mvx-xalias-export-key
cd mvx-xalias-export-key
npm install
```

If you want the source maps to help you work on the code:

```sh
npm run build
```

If you want to build a minified version:

```sh
npm run dist
```

If you get an error related to `fs` in the lib `@multiversx/sdk-bls-wasm`, I didn't find any other solution than
patching this lib once installed:

1. Open `/node_modules/@multiversx/sdk-bls-wasm/bls_c.js`
2. Search for `if(!nodeFS)nodeFS=require("fs");`
3. Comment it

# Credits

This tool exists thanks to the amazing [Userscripter](https://github.com/SimonAlling/userscripter).
