import {Mnemonic, UserSecretKey, UserWallet} from "@multiversx/sdk-wallet/out";
import {Decryptor, EncryptedData} from "@multiversx/sdk-wallet/out/crypto";
import {log} from "userscripter";
import {ALWAYS} from "userscripter/run-time/environment";
import {Operation, operation} from "userscripter/run-time/operations";
import {SELECTOR_BTN_CONTAINER} from "~src/config";
import {download, strChunk} from "~src/utils";

type xaliasWalletType = {
    seed: string,
    address: string,
    secretKey: UserSecretKey,
}

const OPERATIONS: ReadonlyArray<Operation<any>> = [
    operation({
        description: "export buttons",
        condition: ALWAYS,
        dependencies: {mainDiv: SELECTOR_BTN_CONTAINER},
        action: () => {
            const hidden = "hidden";
            const btnCss = `${hidden} inline-block whitespace-nowrap rounded-lg bg-rose-500 px-4 py-2 text-sm leading-tight text-white`;
            const container = document.querySelector(SELECTOR_BTN_CONTAINER);
            let xaliasWallet: xaliasWalletType | null = null;

            if (container == null) {
                return;
            }

            const decode = async () => {
                if (xaliasWallet != null) {
                    return xaliasWallet
                }

                const encryptedJson = JSON.parse(localStorage.session).encrypted
                const response = await fetch("https://api.xalias.com/user/key", {
                    credentials: "include",
                    method: "POST",
                });
                const data = await response.json()

                try {
                    const encrypted = EncryptedData.fromJSON(encryptedJson)
                    const seed = Decryptor.decrypt(encrypted, data.key).toString()

                    const mnemonic = Mnemonic.fromString(seed)
                    const secretKey = mnemonic.deriveKey(0)
                    const address = secretKey.generatePublicKey().toAddress().bech32()

                    xaliasWallet = {
                        seed,
                        address,
                        secretKey,
                    }
                } catch (error) {
                    log.error("Can't decrypt private key: " + error)
                    xaliasWallet = null
                }

                return xaliasWallet
            }

            const msgLoading = document.createElement("span");
            msgLoading.className = "whitespace-nowrap text-sm text-white grow px-4";
            msgLoading.innerText = "Loading private key...";
            container.appendChild(msgLoading);

            const btnExportSeed = document.createElement("button");
            btnExportSeed.className = btnCss;
            btnExportSeed.innerText = "Get seed";
            btnExportSeed.onclick = (event) => {
                event.preventDefault();
                decode().then(data => {
                    if (data == null) {
                        alert("An error occured while exporting your key :(")
                        return
                    }

                    const nl = "\r\n"
                    const text = "Address:" + nl
                        + data.address + nl + nl
                        + `Seed phrase:` + nl
                        + data.seed

                    download(text, "text/plain", `${data.address}.txt`);
                    alert('Seed downloaded successfully!');
                })
            }
            container.appendChild(btnExportSeed);

            const btnExportJson = document.createElement("button");
            btnExportJson.className = btnCss;
            btnExportJson.innerText = "Get JSON";
            btnExportJson.onclick = (event) => {
                event.preventDefault();
                decode().then(data => {
                    if (data == null) {
                        alert("An error occured while exporting your key :(");
                        return;
                    }

                    const password = prompt("Type a password to protect your keystore:");

                    if (password === null) {
                        return;
                    }

                    if (password === "") {
                        alert("Your password can't be empty");
                        return;
                    }

                    const confirmPassword = prompt("Confirm your password:")

                    if (confirmPassword === null || confirmPassword !== password) {
                        alert('Wrong password confirmation, try again');
                        return;
                    }

                    const userWallet = UserWallet.fromSecretKey({
                        secretKey: data.secretKey,
                        password,
                    });

                    download(JSON.stringify(userWallet.toJSON()), "application/json", `${data.address}.json`);
                    alert('JSON keystore downloaded successfully!');
                });
            }
            container.appendChild(btnExportJson);

            const btnExportPem = document.createElement("button");
            btnExportPem.className = btnCss;
            btnExportPem.innerText = "Get PEM";
            btnExportPem.onclick = (event) => {
                event.preventDefault();
                decode().then(data => {
                    if (data == null) {
                        alert("An error occured while exporting your key :(")
                        return
                    }

                    const nl = "\n"
                    const key = btoa(data.secretKey.hex() + data.secretKey.generatePublicKey().hex())
                    const chunks = strChunk(key, 64)
                    const pem = `-----BEGIN PRIVATE KEY for ${data.address}-----` + nl
                        + chunks.join(nl) + nl
                        + `-----END PRIVATE KEY for ${data.address}-----`

                    download(pem, "text/plain", `${data.address}.pem`)
                    alert('PEM downloaded successfully!');
                })
            }
            container.appendChild(btnExportPem);

            decode().then(() => {
                msgLoading.classList.add(hidden)
                btnExportSeed.classList.remove(hidden)
                btnExportJson.classList.remove(hidden)
                btnExportPem.classList.remove(hidden)
            });
        },
    }),
];

export default OPERATIONS;
