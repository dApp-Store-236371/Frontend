import { IS_DEBUG } from "../ElectronCommunication/SharedElectronConstants";
import DUMMY_APPS, {
  DUMMY_OWNED,
  DUMMY_PUBLISHED,
} from "./DebugDummies/DummyApps";
import AppData from "../Pages/AppsPage/AppData";
import { createContract, getCurrAccount } from "./Web3Utils";
import {
  DAPPSTORE_ABI,
  DAPPSTORE_CONTRACT_ADDRESS,
} from "./Contracts/dAppContract";
import { Dispatch, SetStateAction } from "react";
import {AppCategories, AppRatings} from "../ReactConstants";
import { ratingEnumToNumber } from "../Pages/Shared/utils";
import { toast } from "react-toastify";

export async function getPublishedApps() {
  if (IS_DEBUG) {
    return DUMMY_PUBLISHED;
  } else {
    let contract = await createContract(
      DAPPSTORE_ABI,
      DAPPSTORE_CONTRACT_ADDRESS
    );
    console.log("Fetching Published apps");
    let res = await contract.methods
      // .getPublishedApps(await getCurrAccount())
      .getPublishedAppsInfo()
      .call({ from: await getCurrAccount() })
      .then((res: any) => {
        console.log("getPublishedApps returned = ", res);
        let publishedApps: Array<AppData> = [];
        
        res.forEach((solidityStruct: any) => {
          const rating = calcRating(solidityStruct.numRatings, solidityStruct.ratingInt, solidityStruct.ratingModulu);

          let app: AppData = {
            id: solidityStruct.id,
            name: solidityStruct.name,
            description: solidityStruct.description,
            price: solidityStruct.price,
            company: solidityStruct.company,
            img_url: solidityStruct.imgUrl,
            owned: solidityStruct.owned,
            rating: rating,
            SHA: solidityStruct.fileSha256,
            version: 1,
            publication_date: "1.1.1",
            published: solidityStruct.creator === getCurrAccount(),
            category: AppCategories.Games,
            magnetLink: solidityStruct.magnetLink,
            myRating: solidityStruct.userRating,
          };
          publishedApps.push(app);
        });
        console.log("getpublished apps res:  ", publishedApps);
        return publishedApps;
      })
      .catch((error: any) => {
        console.log("ERROR in getContractValue", error);
        return [];
      });
    console.log("publishedApps= ", res);
    return res;
  }
}

export async function getOwnedApps() {
  if (IS_DEBUG) {
    return DUMMY_OWNED;
  } else {
    let contract = await createContract(
      DAPPSTORE_ABI,
      DAPPSTORE_CONTRACT_ADDRESS
    );
    console.log("Fetching owned apps");
    let ownedApps = await contract.methods
      // .getPurchasedAppsInfo(await getCurrAccount())
      .getPurchasedAppsInfo()
      .call({from: await getCurrAccount()})
      .then((res: any) => {
        console.log("getOwnedApps returned = ", res);

        let ownedApps: Array<AppData> = [];
        res.forEach((solidityStruct: any) => {
          const rating = calcRating(solidityStruct.numRatings, solidityStruct.ratingInt, solidityStruct.ratingModulu);

          let app: AppData = {
            id: solidityStruct.id,
            name: solidityStruct.name,
            description: solidityStruct.description,
            price: solidityStruct.price,
            company: solidityStruct.company,
            img_url: solidityStruct.imgUrl,
            owned: solidityStruct.owned,
            rating: rating,
            SHA: solidityStruct.fileSha256,
            version: 1,
            publication_date: "1.1.1",
            published: solidityStruct.creator === getCurrAccount(),
            category: AppCategories.Games,
            magnetLink: solidityStruct.magnetLink,
            myRating: solidityStruct.userRating,
          };
          ownedApps.push(app);
        });

        return ownedApps;
      })
      .catch((error: any) => {
        console.log("ERROR in getContractValue", error);
        return [];
      });
    console.log("ownedApps= ", ownedApps);
    return ownedApps;
  }
}

export interface getDisplayedAppsObj {
  displayedApps: Array<AppData>;
  pageCount: number;
}

export const getDisplayedApps = async (
  pageNum: number,
  itemsPerPage: number,
  setDisplayedApps: Dispatch<SetStateAction<Array<AppData>>>,
  setNumberOfPages: Dispatch<SetStateAction<number>>,
  useServer: boolean,
  textFilter?: string,
  selectedCategory?: string,
  selectedRating?: AppRatings,
) => {
  //request to fetch apps [(pageNum*itemsPerPage + 1), (pageNum*itemsPerPage + itemsPerPage) )
  let res: getDisplayedAppsObj;
  if (IS_DEBUG) {
    res = await fetchDummyDisplayedApps(itemsPerPage, pageNum, textFilter);
    setDisplayedApps(res.displayedApps);
    setNumberOfPages(res.pageCount);
  } else {
    res = await fetchDisplayedApps(itemsPerPage, pageNum);

    let appsToDisplay: AppData[] = [];
    if( (!selectedCategory || selectedCategory === AppCategories.All) && (!selectedRating || selectedRating === AppRatings.All) && (textFilter === "" || !textFilter)){ 
      // console.log("AAAA", textFilter, selectedCategory, selectedRating);
      console.log("no filters: ", res.displayedApps)
      appsToDisplay = res.displayedApps;
    }
    else{
      if(useServer){
        const  { index, requested_len, numberOfPages } = await calcRequestedAppsRange(itemsPerPage, pageNum);
        appsToDisplay = await getFilteredAppsFromDB(index, requested_len, textFilter, selectedCategory, selectedRating);
      }
      else{
          appsToDisplay = await res.displayedApps.filter( (app) => {
          return appSatisfiesFilters(app, textFilter, selectedCategory, selectedRating);
      })
      }

  }
    console.log("filtered apps: ", appsToDisplay)
    setDisplayedApps(appsToDisplay);
    setNumberOfPages(res.pageCount);
  }
};


const appSatisfiesFilters = (app: AppData, textFilter?: string, selectedCategory?: string, selectedRating?: AppRatings) => {
  console.log("appSatisfiesFilters", textFilter, selectedCategory, selectedRating);

  let satisfiesTextFilter: boolean = false
  let satisfiesCategoryFilter: boolean = false
  let satisfiesRatingFilter: boolean = false

  if(!textFilter || textFilter === "" || app.name.includes(textFilter)){
    satisfiesTextFilter = true;
  }
  if(!selectedCategory || selectedCategory === AppCategories.All || selectedCategory === app.category){
    satisfiesCategoryFilter = true;
  }
  if(!selectedRating || selectedRating === AppRatings.All || ratingEnumToNumber(selectedRating) <= app.rating){
    satisfiesRatingFilter = true;
  }

  return satisfiesTextFilter && satisfiesCategoryFilter && satisfiesRatingFilter;

}




const fetchDummyDisplayedApps = async (
  itemsPerPage: number,
  currPageNum: number,
  filter?: string
) => {
  let appsPool = DUMMY_APPS;
  if (filter) {
    appsPool = appsPool.filter((app) => app.name?.includes(filter as string));
  }

  let appsList = appsPool.slice(
    currPageNum * itemsPerPage,
    currPageNum * itemsPerPage + itemsPerPage
  );
  console.log(
    `getDisplayedApps(pageNum: ${currPageNum}, itemsPerPage:${itemsPerPage}`,
    `filter: ${filter}`,
    appsList
  );
  let numberOfPages = Math.ceil(appsPool.length / itemsPerPage);
  return { displayedApps: appsList, pageCount: numberOfPages };
};

export const uploadDummyApps = async (num: number) => {
  //console.log("Dummyapps before upload: ", DUMMY_APPS);
  for (let i = 0; i < Math.max(num, DUMMY_APPS.length); i++) {
    uploadDummyApp(DUMMY_APPS[i]);
  }
  console.log("Uploaded All Dummy Apps");
};

const uploadDummyApp = async (app: AppData) => {
  console.log("Uploading App: ", app);

  let contract = await createContract(
    DAPPSTORE_ABI,
    DAPPSTORE_CONTRACT_ADDRESS
  );

  await contract.methods
    .upload(
      app.name,
      app.description,
      app.SHA,
      app.img_url,
      app.magnetLink,
      app.company,
      app.price
    )
    .send({ from: await getCurrAccount() })
    .then(() => {
      console.log("Finished Uploading");
    })
    .catch((err: any) => {
      console.log("Error uploading contract: ", err);
    });
};

export const uploadApp = async (
  name: string,
  magnetLink: string,
  description: string,
  company: string,
  img_url: string,
  price: number,
  sha: string,
  category: string
) => {
  console.log("Uploading App: ", name, magnetLink);
  

  let contract = await createContract(
    DAPPSTORE_ABI,
    DAPPSTORE_CONTRACT_ADDRESS
  );

  console.log("params: ", name, magnetLink, description, company, img_url, price, sha, category);

  await contract.methods
    .createNewApp(name, description, magnetLink, img_url, company, price,  category, sha)
    .send({ from: await getCurrAccount() })
    .then(() => {
      console.log("Finished Uploading");
    })
    .catch((err: any) => {
      console.log("Error uploading contract: ", err);
      throw err;
    });
};

export const purchase = async (id: number, price: number) => {
  console.log("Purchasing App with id: ", id);
  let contract = await createContract(
    DAPPSTORE_ABI,
    DAPPSTORE_CONTRACT_ADDRESS
  );

  await contract.methods
    .purchaseApp(id)
    .send({ from: await getCurrAccount(), value: price })
    .then(() => {
      console.log("Finished Purchasing");
    })
    .catch((err: any) => {
      console.log("Error purchasing app: ", err);
      throw err;
    });
};

export const updateApp = async (
  id: number,
  magnetLink: string,
  description: string,
  img_url: string,
  price: number,
  sha: string
) => {
  console.log("Uploading App: ");
  console.log(
    `id: ${id}, magnetLink: ${magnetLink}, description: ${description}, img_url: ${img_url}, price: ${price}, sha: ${sha}`
  );
  let contract = await createContract(
    DAPPSTORE_ABI,
    DAPPSTORE_CONTRACT_ADDRESS
  );
  const do_not_change_name = ""
  await contract.methods
    .updateApp(id,do_not_change_name, description,magnetLink,img_url, price, sha)
    .send({ from: await getCurrAccount() })
    .then(() => {
      console.log("Finished Updating");
    })
    .catch((err: any) => {
      console.log("Error updating contract: ", err);
      throw err;
    });
};


async function fetchAppById(id: number) {
  const app_arr = await (await fetchDisplayedApps(1, id)).displayedApps;
  if(app_arr.length === 0){
    return null;
  }
  return app_arr[0];
}

const fetchDisplayedApps = async (
  itemsPerPage: number,
  currPageNum: number

) => {
  let contract = await createContract(
    DAPPSTORE_ABI,
    DAPPSTORE_CONTRACT_ADDRESS
  );
  console.log(`fetchDisplayedApp: from: ${currPageNum * itemsPerPage}, to: ${currPageNum * itemsPerPage + itemsPerPage}`);

  // const random_offset = 3;

  const  { index, requested_len, numberOfPages }: { index: number; requested_len: number; numberOfPages: number; } = await calcRequestedAppsRange(itemsPerPage, currPageNum);

  let appDatas = await contract.methods
    .getAppBatch(index , requested_len)
    .call({ from: await getCurrAccount() })
    .then((res: any) => {
      console.log("fetchDisplayedApps returned = ", res);
      
      let appsToDisplay: Array<AppData> = [];
      res.forEach((solidityStruct: any) => {
        console.log("Type of num price (app batch): ",  typeof(solidityStruct.price));
        const rating = calcRating(solidityStruct.numRatings, solidityStruct.ratingInt, solidityStruct.ratingModulu);
        console.log("rating: ", rating);
        console.log("my rating: ", solidityStruct.userRating);
        let app: AppData = {
          id: solidityStruct.id,
          name: solidityStruct.name,
          description: solidityStruct.description,
          price: solidityStruct.price,
          company: solidityStruct.company,
          img_url: solidityStruct.imgUrl,
          owned: solidityStruct.owned,
          rating: rating,
          SHA: solidityStruct.fileSha256,
          version: 1,
          publication_date: "1.1.1",
          published: solidityStruct.creator === getCurrAccount(),
          category: solidityStruct.category ? solidityStruct.category : AppCategories.Games,
          magnetLink: solidityStruct.magnetLink,
          myRating: solidityStruct.userRating,

        };
        appsToDisplay.push(app);
      });

      return appsToDisplay
    })
    .catch((error: any) => {
      console.error("ERROR in getContractValue", error);
      return  []
    });

  console.log("res= ", appDatas);
  console.log("pageCount: ", numberOfPages)
  return { displayedApps: appDatas, pageCount: numberOfPages };

};


function calcRating(numRatings: number, ratingInt: number, ratingModulu: number){
  console.log("calcRating params: ", "numRating: ", numRatings, "ratingInt ", ratingInt, "ratingModulo ",ratingModulu);
  console.log("Num rating type: ", typeof numRatings);


  numRatings= parseInt(numRatings.toString())
  ratingInt= parseInt(ratingInt.toString())
  ratingModulu= parseInt(ratingModulu.toString())

  if(numRatings === 0){
    console.log("calcRating returns zero")
    return 0;
  }

  const rating = ratingInt + ratingModulu/numRatings
  return rating;
}

async function calcRequestedAppsRange(itemsPerPage: number, currPageNum: number) {
  const totalNumOfApps = await getTotalNumOfApps();

  const numberOfPages = Math.ceil(totalNumOfApps / itemsPerPage);
  const appsOnLastPage = totalNumOfApps % itemsPerPage;
  console.log("totalNumOfApps", totalNumOfApps);
  console.log("itemsPerPage", itemsPerPage);
  console.log("appsOnLastPage: ", appsOnLastPage);

  let index: number = currPageNum * itemsPerPage;
  let requested_len = itemsPerPage;


  if (currPageNum === numberOfPages - 1) {
    console.log("Last Page. marking appsOnLastPage: ", Math.max(1, appsOnLastPage));
    requested_len = Math.max(1, appsOnLastPage);
  }

  console.log("page: ", currPageNum);
  console.log("index: ", index);
  console.log("length: ", requested_len);
  return { index, requested_len, numberOfPages };
}

export async function getTotalNumOfApps() {
  let contract = await createContract(
    DAPPSTORE_ABI,
    DAPPSTORE_CONTRACT_ADDRESS
  );
  return await contract.methods.getAppCount()
                                .call()
                                .catch((error: any) => {
                                  console.log("ERROR in getContractValue", error);
                                  return  0
                                  });
  
}

export async function getFeaturedApp() : Promise<AppData|undefined> {
    //TODO: fetch number of apps, and then an app randomly.
    try{
    console.log("Fetching features app")

      //dummy call to get length quick and very very dirty
    const totalNumOfApps = await getTotalNumOfApps() 
    console.log("Featured App, total Num Of Apps: ", totalNumOfApps)
    const featuredAppRandomness: number =  Math.floor((Math.random() * totalNumOfApps)) % totalNumOfApps;
    console.log("Featured App, randomness: ", featuredAppRandomness)
    const featuresApp = (await fetchDisplayedApps(1, featuredAppRandomness)).displayedApps[0];
    console.log("Featured app: ", featuresApp);
    return featuresApp;

  
    // //Meanwhile:
    // const numOfApps = DUMMY_APPS.length;
    // const featuredAppIndex =Math.floor(Math.random() * numOfApps-1);
    // return DUMMY_APPS[featuredAppIndex];
    }
    catch(err){
        console.log("Error fetching featured app: ", err);
        return undefined;
    }

}

export const getMagnetLink = async (appId: string) => {
  console.log("Fetching magnet link of app: ", appId);
  let contract = await createContract(
    DAPPSTORE_ABI,
    DAPPSTORE_CONTRACT_ADDRESS
  );

  await contract.methods
    .getMagnetLink(appId)
    .send({ from: await getCurrAccount()})
    .then(() => {
      console.log("Magnet link acquired");
    })
    .catch((err: any) => {
      console.log("Error retrieveing magnet link: ", err);
      throw err;
    });
}
async function getFilteredAppsFromDB(offset: number, length: number, textFilter: string | undefined, selectedCategory: string|undefined, selectedRating: AppRatings | undefined): Promise<AppData[]> {
  const API_URL = 'https://db-dapp-store.herokuapp.com'
  // //const API_URL =  'http://127.0.0.1:5000'
  // const API_URL =  'http://127.0.0.1:5001'
   //const API_URL =  'http://127.0.0.1:5002'

  textFilter = textFilter ? textFilter : "";

  let seletedRatingStr = undefined
  switch(selectedRating) {
    case AppRatings.All:
      seletedRatingStr = "0";
      break;
    case AppRatings.One:
      seletedRatingStr = "1";
      break;
    case AppRatings.Two:
      seletedRatingStr = "2";
      break;
    case AppRatings.Three:
      seletedRatingStr = "3";
      break;
    case AppRatings.Four:
      seletedRatingStr = "4";
      break;
    case AppRatings.Five:
      seletedRatingStr = "5";
      break;
    default:
      seletedRatingStr = "0";
      break;
  }

  if (selectedCategory === AppCategories.All || selectedCategory === undefined) {
    selectedCategory = "ALL";
  }
  // await fetch(`${API_URL}/hello`, {method: "POST"})
  try{
    const url = `${API_URL}/apps/filtered/${offset}/${length}/${seletedRatingStr}/${selectedCategory}/${textFilter}`
    console.log("db request url: ", url)
    const res = await fetch(url)
 
    .then(res => {
      console.log("getFilteredAppsFromDB: GOT RES, res: ", res);
      if (res.status === 200) {
        return res.json();
      }
      else{
        throw new Error("Error in getFilteredAppsFromDB: " + res.status);
      }
    })
    const filteredApps: AppData[] = []
    for (let appId of res) {
      console.log("getFilteredAppsFromDB appId: ", appId);
      filteredApps.push(await fetchAppById(appId));

    }
    console.log("Returning Filtered Apps: ", filteredApps)
    return filteredApps;
  }
  catch(err){
    console.log("Error fetching filtered apps: ", err);
    toast.error("Server is not available. Disable server usage under 'Settings' or try again later.")
    return []
  }


}


export async function rateApp(appId: number, rated: number){
  console.log("Rating app ", appId)

  const contract = await createContract(
    DAPPSTORE_ABI,
    DAPPSTORE_CONTRACT_ADDRESS
  );

  rated = Math.min(Math.ceil(rated / 20), 5)

  console.log("rated 1 to 5: ", rated)
  toast.info("Rating app... Don't forget to confirm the transaction in your wallet.")
    try{
      await contract.methods.rateApp(appId, rated).send({ from: await getCurrAccount()})
      toast.success("Rating app successful!")
      return true
    }
    catch (err){
      console.log("Error rating app: ", err);
      toast.error("Could not rate app")
      return false
    }



}


  



