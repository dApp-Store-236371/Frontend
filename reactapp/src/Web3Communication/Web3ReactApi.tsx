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
import {AppCategories} from "../ReactConstants";

export async function getPublishedApps() {
  if (IS_DEBUG) {
    return DUMMY_PUBLISHED;
  } else {
    let contract = await createContract(
      DAPPSTORE_ABI,
      DAPPSTORE_CONTRACT_ADDRESS
    );
    console.log("Fetching owned apps");
    let res = await contract.methods
      .getPublishedApps(await getCurrAccount())
      .call()
      .then((res: any) => {
        console.log("getPublishedApps returned = ", res);
        let publishedApps: Array<AppData> = [];
        res.forEach((solidityStruct: any) => {
          let app: AppData = {
            id: solidityStruct.id,
            name: solidityStruct.name,
            description: solidityStruct.description,
            price: solidityStruct.price,
            company: solidityStruct.company,
            img_url: solidityStruct.imgUrl,
            owned: solidityStruct.owned,
            rating: solidityStruct.rating,
            SHA: solidityStruct.fileSha256,
            version: 1,
            publication_date: "1.1.1",
            published: solidityStruct.creator === getCurrAccount(),
            category: AppCategories.Games
          };
          publishedApps.push(app);
        });

        return res;
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
      .getPurchasedApps(await getCurrAccount())
      .call()
      .then((res: any) => {
        console.log("getOwnedApps returned = ", res);
        let ownedApps: Array<AppData> = [];
        res.forEach((solidityStruct: any) => {
          let app: AppData = {
            id: solidityStruct.id,
            name: solidityStruct.name,
            description: solidityStruct.description,
            price: solidityStruct.price,
            company: solidityStruct.company,
            img_url: solidityStruct.imgUrl,
            owned: solidityStruct.owned,
            rating: solidityStruct.rating,
            SHA: solidityStruct.fileSha256,
            version: 1,
            publication_date: "1.1.1",
            published: solidityStruct.creator === getCurrAccount(),
            category: AppCategories.Games
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
  filter?: string,
  selectedCategory?: string
) => {
  //request to fetch apps [(pageNum*itemsPerPage + 1), (pageNum*itemsPerPage + itemsPerPage) )
  let res: getDisplayedAppsObj;
  if (IS_DEBUG) {
    res = await fetchDummyDisplayedApps(itemsPerPage, pageNum, filter);
    setDisplayedApps(res.displayedApps);
    setNumberOfPages(res.pageCount);
  } else {
    res = await fetchDisplayedApps(itemsPerPage, pageNum, filter, selectedCategory);
    setDisplayedApps(res.displayedApps);
    setNumberOfPages(res.pageCount);
  }
};

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
  console.log("Uploading App: ", name);

  let contract = await createContract(
    DAPPSTORE_ABI,
    DAPPSTORE_CONTRACT_ADDRESS
  );

  await contract.methods
    .upload(name, description, sha, img_url, magnetLink, company, price)
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
    .purchase(id)
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

  await contract.methods
    .update(id, description, sha, img_url, magnetLink, price)
    .send({ from: await getCurrAccount() })
    .then(() => {
      console.log("Finished Updating");
    })
    .catch((err: any) => {
      console.log("Error updating contract: ", err);
      throw err;
    });
};

const fetchDisplayedApps = async (
  itemsPerPage: number,
  currPageNum: number,
  filter?: string,
  selectedCategory?: string
) => {
  let contract = await createContract(
    DAPPSTORE_ABI,
    DAPPSTORE_CONTRACT_ADDRESS
  );
  console.log(
    `from: ${currPageNum * itemsPerPage}, to: ${
      currPageNum * itemsPerPage + itemsPerPage
    }`
  );
  let from_index: number = currPageNum * itemsPerPage + 1;
  let to_index: number = from_index + itemsPerPage;
  let res = await contract.methods
    .getApps(from_index, to_index, await getCurrAccount())
    .call()
    .then((res: any) => {
      console.log("fetchDisplayedApps returned = ", res);
      console.log("result returned apps array: ", res.result);
      console.log("result returned totalNumOfApps: ", res.totalNumOfApps);

      let appsToDisplay: Array<AppData> = [];
      res.result.forEach((solidityStruct: any) => {
        let app: AppData = {
          id: solidityStruct.id,
          name: solidityStruct.name,
          description: solidityStruct.description,
          price: solidityStruct.price,
          company: solidityStruct.company,
          img_url: solidityStruct.imgUrl,
          owned: solidityStruct.owned,
          rating: solidityStruct.rating,
          SHA: solidityStruct.fileSha256,
          version: 1,
          publication_date: "1.1.1",
          published: solidityStruct.creator === getCurrAccount(),
          category: AppCategories.Games
        };
        appsToDisplay.push(app);
      });
      let numberOfPages = Math.ceil(res.totalNumOfApps / itemsPerPage);

      return { displayedApps: appsToDisplay, pageCount: numberOfPages };
    })
    .catch((error: any) => {
      console.log("ERROR in getContractValue", error);
      return { displayedApps: [], pageCount: 1 };
    });
  console.log("res= ", res);
  return res;
};
