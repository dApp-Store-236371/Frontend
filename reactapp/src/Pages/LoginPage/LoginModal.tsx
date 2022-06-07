import {
  connectWalletToGanacheNoModal,
  connectWalletWithModal,
  web3,
} from "../../Web3Communication/Web3Init";
import {
  MDBBtn,
  MDBCardImage,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
} from "mdb-react-ui-kit";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PagePaths } from "../../ReactConstants";
import isElectron from "is-electron";
import { uploadDummyApps } from "../../Web3Communication/Web3ReactApi";
import fx from 'fireworks'

interface LoginModalProps {
  setIsWalletConnected: Dispatch<SetStateAction<boolean>>;
  setCurrAccount: Dispatch<SetStateAction<string>>;
}
export function LoginModal({
  setIsWalletConnected,
  setCurrAccount,
}: LoginModalProps) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(true);

 function displayFireworks() {
    let range = (n: number) => [...new Array(n)]

    range(20).map( async () =>{
      fx({
        x: window.outerWidth * Math.random(),
        y: window.outerHeight * Math.random() ,
        colors: ['#cc3333', '#4CAF50', '#81C784', '#FFEB3B', '#2196F3'],
      })
       await new Promise(resolve => setTimeout(resolve, 1500))
    }

    )
  }

  return (
    <>
      <MDBModal show={showModal} tabIndex={-1} staticBackdrop={true}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Connect Wallet</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>
              {" "}
              <h2 className="h1-responsive">
                Welcome to <span className="h2color" style={{'color': 'red'}}>dAppstore</span>!
                First, you will need to connect your wallet
              </h2>
              <MDBBtn
                onClick={() => {

                  setShowModal(false);
                  connectWalletWithModal()
                    .then(() => {
                      setIsWalletConnected(true);
                      web3.eth.getAccounts().then((accounts) => {
                        console.log("Accounts: ", accounts);
                        setCurrAccount(accounts[0]);
                        displayFireworks()
                      });
                    })
                    .catch((error) => {
                      setShowModal(true);
                      console.log(error);
                    });
                }}
              >
                Connect (Rinkeby Test Network)
              </MDBBtn>

            </MDBModalBody>

            <MDBModalFooter></MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
