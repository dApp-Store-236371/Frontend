import { useEffect, useState } from "react";
import { DEFAULT_EMPTY_APP } from "../../../ReactConstants";
import { getFeaturedApp } from "../../../Web3Communication/Web3ReactApi";
import AppData from "../AppData";
import "../../../CSS/AppsCatalogPage.css";
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle, MDBRipple } from "mdb-react-ui-kit";
import no_image_alt from "../../../Misc/app_no_image_alt.jpg";
import { checkImage } from "../../Shared/utils";

interface FeaturedAppsTileProps{
    toggleShowModal: any;
    setSelectedAppData: any;
    provider: any
    featuredApp: AppData | undefined;
}

export function FeaturedAppsTile(props: FeaturedAppsTileProps){
  const [imgSrc, setImgSrc] = useState(no_image_alt);



  useEffect(() => {

    checkImage(props.featuredApp?.img_url).then(res => {
      console.log(res)
      if(props.featuredApp?.img_url!==undefined && res){
        setImgSrc(props.featuredApp?.img_url)
      }
      else{
        setImgSrc(no_image_alt)
      }
    })
  }, [props.featuredApp])

    const handleShowDetails = () => {
        props.setSelectedAppData(props.featuredApp);
        props.toggleShowModal();
      };

    if(!props.featuredApp){
        return null;
    }

    return (
        <>
            <div className="featured-app-tile">
            
    <MDBCard
      shadow="3"
      background="primary"
      border="primary"
      style={{
          display: "flex",
          flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        padding: "5px",
        margin: "10px",
        width: "100%",
        height: "20vw",
        color: "white",

      }}
    >
      <MDBRipple
      
        rippleColor="light"
        rippleTag="div"
        className="bg-image hover-overlay"
      >
        <div className={"card_image_div"}>
          <MDBCardImage
            src={imgSrc}
            position="top"
            alt="..."
            className={"featured-app-image"}
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
          width: "22rem",
          color: "white",
        
        }}
      >
        <MDBCardTitle style={{  color: "white",}}>{props.featuredApp.name}</MDBCardTitle>
          <h6 style={{color: "white",}} id="category-paragraph-title">{`Category: ${props.featuredApp.category}`}</h6>
          <h6 style={{color: "white",}} id="category-paragraph-title">{`Price: ${props.featuredApp.price} Wei`}</h6>

          <MDBCardText style={{
            color: "white",

          }}>{props.featuredApp.description}</MDBCardText>
      </MDBCardBody>

      <MDBBtn
        style={{
          marginTop: "20px",
          width: "200px",
          alignSelf: "center",
          backgroundColor: "red"
        }}
        onClick={handleShowDetails}
        href="#"
      >
        Featured App
      </MDBBtn>
    </MDBCard>



                {/* <div className="featured-app-tile-image-div">
                    <img src={featuredApp.img_url} alt={DEFAULT_EMPTY_APP.img_url} />
                </div>

                <MDBBtn
                    style={{
                    marginTop: "20px",
                    width: "120px",
                    alignSelf: "center",
                    }}
                    onClick={handleShowDetails}
                    href="#"
                >
                    Featured App
                </MDBBtn> */}

            </div>
        </>
    )
}