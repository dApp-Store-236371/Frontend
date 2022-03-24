import dummy_car from "./Pages/AppsPage/product_img/Audi_R8_2017_189_19_610_52_10_76_48_174_14_AWD_2_2_2dr_nUS.jpg";
import AppData from "./Pages/AppsPage/AppData";

export const PagePaths = {
  AppsPagePath: "/",
  PurchasesPagePath: "/purchases",
  UploadPagePath: "/upload",
  NotFoundPagePath: "*",
};

export const APPS_PER_PAGE: number = 16;

export const DEFAULT_EMPTY_APP: AppData = {
  id: 0,
  creator: `Cool Dev`,
  description: `Cool Dummy App. Cool Dummy App. Cool Dummy App. Cool Dummy App. Cool Dummy App. Cool Dummy App. Cool Dummy App. Cool Dummy App. Cool Dummy App. Cool Dummy App. Cool Dummy App. Cool Dummy App.  `,
  img_url: "https://mdbcdn.b-cdn.net/img/new/standard/nature/184.webp",
  price: 10,
  name: `Dummy App`,
  publication_date: "1.5.2022",
  rating: 5,
  SHA: "256da46546fd",
  version: 1.0,
  owned: true,
};
