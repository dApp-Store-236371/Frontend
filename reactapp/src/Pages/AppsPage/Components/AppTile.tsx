import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardImage,
  MDBBtn,
  MDBRipple,
} from "mdb-react-ui-kit";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import no_image_alt from "../../../Misc/app_no_image_alt.jpg";
import dummy_car from "../../../Misc/product_img/Audi_R8_2017_189_19_610_52_10_76_48_174_14_AWD_2_2_2dr_nUS.jpg";
import AppData from "../AppData";
import "../../../CSS/appImage.css";
import React from "react";

interface AppTileProps {
  appData: AppData;
  toggleShowModal: any;
  setSelectedAppData: any;
}

function AppTile({
  appData,
  toggleShowModal,
  setSelectedAppData,
}: AppTileProps) {
  //console.log("AppTile: AppData = ", appData)

  const handleShowDetails = () => {
    setSelectedAppData(appData);
    toggleShowModal();
  };
  return (
    <MDBCard
      shadow="3"
      border="dark"
      background="white"
      style={{
        maxWidth: "22rem",
        padding: "3px",
        margin: "10px",
        marginTop: "20px",
        width: "100%"
      }}
    >
      <MDBRipple
        rippleColor="light"
        rippleTag="div"
        className="bg-image hover-overlay"
      >
        <div className={"card_image_div"}>
          <MDBCardImage
            src={appData.img_url ? appData.img_url : no_image_alt}
            position="top"
            alt="..."

            className={"app-image"}
          />
        </div>
        <a>
          <div
            className="mask"
            style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
          ></div>
        </a>
      </MDBRipple>
      <MDBCardBody
        className="text-dark"
        style={{
          height: "230px",
          overflowY: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <MDBCardTitle>{appData.name}</MDBCardTitle>
          <h6 id="category-paragraph-title">{`Category: ${appData.category}`}</h6>
          <h6 id="category-paragraph-title">{`Price: ${appData.price} Wei`}</h6>

          <MDBCardText style={{


          }}>{appData.description}</MDBCardText>
      </MDBCardBody>

      <MDBBtn
        style={{
          marginTop: "20px",
          width: "90px",
          alignSelf: "center",
        }}
        onClick={handleShowDetails}
        href="#"
      >
        Details
      </MDBBtn>
    </MDBCard>
  );
}

export default AppTile;
