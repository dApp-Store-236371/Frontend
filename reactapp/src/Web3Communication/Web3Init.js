import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "7ac5f849f3984d56a7bea36e745ce0a4",
    },
  },
};

export const web3 = new Web3();

export async function connectWalletWithModal(net = "rinkeby") {
  try {
    const web3Modal = new Web3Modal({
      network: net,
      theme: "dark",
      cacheProvider: false,
      disableInjectedProvider: false,
      providerOptions,
    });
    console.log("Changing provider from ", web3.currentProvider);

    var provider = await web3Modal.connect();

    web3.setProvider(provider);

    console.log("To new Provider:", web3.currentProvider);
    console.log("web3: ", web3);
  } catch (error) {
    console.log("connectWalletWithModal() error: ", error);
  }
}
