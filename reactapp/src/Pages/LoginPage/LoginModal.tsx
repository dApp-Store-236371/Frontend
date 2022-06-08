import {
  connectWalletWithModal,
  web3,
} from "../../Web3Communication/Web3Init";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalContent,
  MDBModalDialog,
  MDBModalFooter,
  MDBModalHeader,
  MDBModalTitle,
} from "mdb-react-ui-kit";
import  { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fx from 'fireworks'

interface LoginModalProps {
  setIsWalletConnected: Dispatch<SetStateAction<boolean>>;
  setCurrAccount: Dispatch<SetStateAction<string>>;
  isWalletConnected: boolean;
  provider: any;
  setProvider: Dispatch<SetStateAction<any>>;
  
}
export function LoginModal({
  setIsWalletConnected,
  setCurrAccount,
  isWalletConnected,
  provider,
  setProvider
}: LoginModalProps) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(true);

 function displayFireworks() {
    let range = (n: number) => [...new Array(n)]

    range(20).map( async () =>{
       await new Promise(resolve => setTimeout(resolve, Math.random() *  2000))

      fx({
        x: window.outerWidth * Math.random(),
        y: window.outerHeight * Math.random() ,
        colors: ['#cc3333', '#4CAF50', '#81C784', '#FFEB3B', '#2196F3'],
        particleTimeout: 50000
      })
    }

    )
  }

  useEffect(() => {
    console.log("LoginModal useEffect. waletConnectedChanged");
    setShowModal(!isWalletConnected || !provider)
  }, [isWalletConnected]);

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
                      const provider = web3.eth.currentProvider
                      setProvider(provider)
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
