import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBCardImage,
  MDBCardText,
} from "mdb-react-ui-kit";
import appData from "../AppData";
import no_image_alt from "../../../Misc/app_no_image_alt.jpg";
import { Rating } from "react-simple-star-rating";
import SpinnerButton from "@vlsergey/react-bootstrap-button-with-spinner";
import isElectron from "is-electron";
import "../../../CSS/appImage.css";
import { toast } from "react-toastify";
import { purchase } from "../../../Web3Communication/Web3ReactApi";
import { startDownload, TorrentData } from "../../Shared/utils";

interface AppDetailsModalProps {
  app: appData;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  toggleShowModal: any;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  activeTorrents: TorrentData[];
  downloadPath: string;
}

export default function AppDetailsModal({
  app,
  showModal,
  setShowModal,
  toggleShowModal,
  isLoading,
  setIsLoading,
  activeTorrents,
  downloadPath
}: AppDetailsModalProps) {
  const [rating, setRating] = useState<number>(0); // initial rating value
  const [ownedState, setOwnedStateState] = useState<boolean>(false);

  const setAppOwned = (new_owned: boolean) => {
    setOwnedStateState(new_owned);
    app.owned = new_owned;
    if (new_owned) {
    }
  };

  useEffect(() => {
    setRating(app.myRating === undefined ? 0 : app.myRating);
    setOwnedStateState(app.owned);
  }, [app]);

  const handleRatingChanged = (newRating: number) => {
    console.log(newRating);
    //setRating(newRating);
    app.myRating = newRating;

    //send to backend/blockchain.
  };

  function getMyRating() {
    return app.myRating === undefined ? 0 : app.myRating;
  }
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handlePurchseOrDownloadBtn = async () => {
    //TODO: Add error handling.

    if (ownedState) {
      //Download
      startDownload(app, downloadPath);
    } else {
      setIsLoading(true);
      let purchasingToastId = toast(`Purchasing ${app.name}...`, {
        autoClose: false,
      });

      purchase(app.id, app.price)
        .then(() => {
          toast.update(purchasingToastId, {
            render: `Purchsed ${app.name}! :)`,
            type: "success",
            isLoading: false,
            autoClose: 5000,
          });
        })
        .catch((error: any) => {
          toast.update(purchasingToastId, {
            render: `Failed to purchase ${app.name}... :(`,
            type: "error",
            isLoading: false,
            autoClose: 5000,
          });
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });

      /*
      return fetch("https://reqres.in/api/users/1")
        .then((response) => response.json())
        .then((data) => console.log(data))
        .then(() => new Promise((resolve) => setTimeout(resolve, 3000)))
        .then(() => setAppOwned(true))
        .then(() => {
          toast.dismiss();
          toast("Success!");
        })

        .catch((err) => {

          toast.dismiss();
          toast("Error...");
        })
        .finally(() => setIsLoading(false));
      */
    }
  };

  const getBtnText = () => {
    if(ownedState) {
      if(activeTorrents.filter((t) => t.magnet === app.magnetLink).length > 0){
        return "Downloading.";
      }
      else{
        return "Download";


      }
    }
    else {
      return "Purchase";
    }
  };

  return (
    <>
      <MDBModal
        show={showModal}
        setShow={setShowModal}
        tabIndex={-1}
        staticBackdrop={isLoading}

      >
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <div>
                <MDBModalTitle>{app.name} </MDBModalTitle>


              </div>
              {ownedState ? (
                <Rating onClick={handleRatingChanged} ratingValue={rating} />
              ) : (
                <></>
              )}

            </MDBModalHeader>
            <MDBModalBody>

              <MDBCardImage
                src={app.img_url ? app.img_url : no_image_alt}
                alt="..."
                className="app-image"
              />
              <h4 id="description-paragraph-title">Description:</h4>



              <p id="description-paragraph" className="card-text">
                {app.description}
              </p>

            </MDBModalBody>

            <MDBModalFooter  style={{display: "block"}}>

              <div style={{display: "flex", justifyContent: "space-around", textAlign: "center", margin: "auto"}}>
                <h6 id="category-paragraph-modal-elem">{`Category`}  <br/> {app.category}</h6>
                <h6 id="category-paragraph-modal-elem">{`Price`} <br/>{app.price} Wei</h6>
                <h6 id="category-paragraph-modal-elem">{`Developer`} <br/> {app.company} </h6>
                <h6 id="category-paragraph-modal-elem">{`Rating`} <br/> {app.rating == -1 ? "Not Rated" : app.rating}</h6>
              </div>
              <hr />
              <SpinnerButton onClick={handlePurchseOrDownloadBtn}
                disabled={activeTorrents.filter((t) => t.magnet === app.magnetLink).length > 0}
              >
                {getBtnText()}
              </SpinnerButton>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
/*              <MDBBtn>Purchase</MDBBtn>
 */
