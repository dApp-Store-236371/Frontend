import { useEffect, useState } from "react";
import { DEFAULT_EMPTY_APP } from "../../../ReactConstants";
import { getFeaturedApp } from "../../../Web3Communication/Web3ReactApi";
import AppData from "../AppData";


interface FeaturedAppsTileProps{
    toggleShowModal: any;
    setSelectedAppData: any;
}

export function FeaturedAppsTile(props: FeaturedAppsTileProps){

    const [featuredApp, setFeaturedApp] = useState<AppData>(DEFAULT_EMPTY_APP);
    
    useEffect( () => {

        const updateFeaturedApp = async () => {
            const newFeaturedApp = await getFeaturedApp();
            setFeaturedApp(newFeaturedApp);

        }
        
        updateFeaturedApp();
    }, [])
    

    return (
        <>
            <div className="featured-app-tile">
                <div className="featured-app-tile-image-div">
                    <img src={featuredApp.img_url} alt={DEFAULT_EMPTY_APP.img_url} />
                </div>
            </div>
        </>
    )
}