import { useEffect, useState } from "react";
import { DEFAULT_EMPTY_APP } from "../../../ReactConstants";
import { getFeaturedApp } from "../../../Web3Communication/Web3ReactApi";
import AppData from "../AppData";
import "../../../CSS/AppsCatalogPage.css";
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle, MDBRipple } from "mdb-react-ui-kit";
import no_image_alt from "../../../Misc/app_no_image_alt.jpg";

interface FeaturedAppsTileProps{
    toggleShowModal: any;
    setSelectedAppData: any;
    provider: any
}

export function FeaturedAppsTile(props: FeaturedAppsTileProps){

    const [featuredApp, setFeaturedApp] = useState<AppData | undefined >(undefined);
    
    useEffect( () => {
        console.log("provider changed")
        const updateFeaturedApp = async () => {
            const newFeaturedApp = await getFeaturedApp();
            
            setFeaturedApp(newFeaturedApp);

        }

        updateFeaturedApp();
    }, [props.provider ])
    
    const handleShowDetails = () => {
        props.setSelectedAppData(featuredApp);
        props.toggleShowModal();
      };

    if(!featuredApp){
        return null;
    }

    return (
        <>
            <div className="featured-app-tile">
            
    <MDBCard
      shadow="3"
      background="white"
      style={{
          display: "flex",
          flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        padding: "5px",
        margin: "10px",
        width: "100%",
        height: "20vw"

      }}
    >
      <MDBRipple
      
        rippleColor="light"
        rippleTag="div"
        className="bg-image hover-overlay"
      >
        <div className={"card_image_div"}>
          <MDBCardImage
            src={featuredApp.img_url ? featuredApp.img_url : no_image_alt}
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
        
        }}
      >
        <MDBCardTitle>{featuredApp.name}</MDBCardTitle>
          <h6 id="category-paragraph-title">{`Category: ${featuredApp.category}`}</h6>
          <h6 id="category-paragraph-title">{`Price: ${featuredApp.price} Wei`}</h6>

          <MDBCardText style={{


          }}>{featuredApp.description}</MDBCardText>
      </MDBCardBody>

      <MDBBtn
        style={{
          marginTop: "20px",
          width: "200px",
          alignSelf: "center",
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