"use client";

import { useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";

import styles from "./page.module.css";

export default function Home() {
  const [hi, setHi] = useState("");
  const [greet, setGreet] = useState("");
  const [chainInfo, setChainInfo] = useState<string>("");
  const [sender, setSender] = useState<string>("");

  return (
    <main className={styles.main}>
      <div>
        <div style={{ marginBottom: 10 }}>wasm back value: {greet}</div>
        <div style={{ marginBottom: 10 }}>
          <input
            value={hi}
            onChange={(e) => {
              setHi(e.target.value);
            }}
          />
        </div>
        <button
          onClick={async () => {
            const wasm = await import("@kmy_w/rust-wasm-example");
            await wasm.default();
            const str = wasm.greet(hi);
            setGreet(str);
          }}
        >
          call wasm
        </button>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          ---------------------------
        </div>
        <div style={{ marginBottom: 10 }}>polkadt address: {sender}</div>
        <div style={{ marginBottom: 10 }}>polkadt chain value: {chainInfo}</div>
        <button
          onClick={async () => {
            const { web3Enable, web3Accounts } = await import(
              "@polkadot/extension-dapp"
            );
            const extensions = await web3Enable("call-substrate-app");
            if (extensions.length === 0) {
              console.log("No extension found");
              return;
            }
            const allAccounts = await web3Accounts();
            setSender(allAccounts[0].address);
          }}
        >
          connect wallet
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            const wsProvider = new WsProvider("ws://127.0.0.1:9944");
            const api = await ApiPromise.create({
              provider: wsProvider,
            });
            const number = await api.query.collectibles.number();
            setChainInfo(number.toString());
          }}
        >
          get number
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            const wsProvider = new WsProvider("ws://127.0.0.1:9944");
            const api = await ApiPromise.create({ provider: wsProvider });

            const { web3FromAddress, web3Enable } = await import(
              "@polkadot/extension-dapp"
            );
            await web3Enable("call-substrate-app");
            const injector = await web3FromAddress(sender);
            await api.tx.collectibles
              .incrementNumber(1)
              .signAndSend(sender, { signer: injector.signer })
              .then((v) => {
                alert("Success increment number!");
              });
          }}
        >
          add number
        </button>
        <br />
        <br />
        <button
          onClick={async () => {
            const wsProvider = new WsProvider("ws://127.0.0.1:9944");
            const api = await ApiPromise.create({ provider: wsProvider });

            const { web3FromAddress, web3Enable } = await import(
              "@polkadot/extension-dapp"
            );
            await web3Enable("call-substrate-app");
            const injector = await web3FromAddress(sender);
            await api.tx.collectibles
              .decrementNumber()
              .signAndSend(sender, { signer: injector.signer })
              .then((v) => {
                alert("Success decrement number!");
              });
          }}
        >
          sub number
        </button>
      </div>
    </main>
  );
}
