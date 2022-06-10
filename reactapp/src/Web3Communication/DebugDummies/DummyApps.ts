import AppData from "../../Pages/AppsPage/AppData";
import dummy_car from "../../Misc/product_img/Audi_R8_2017_189_19_610_52_10_76_48_174_14_AWD_2_2_2dr_nUS.jpg";
import {AppCategories} from "../../ReactConstants";

const DUMMY_APPS: AppData[] = [];
for (let i = 0; i < 50; i++) {
  DUMMY_APPS.push({
    id: i,
    company: `John Smith #${i}`,
    description: `Cool Description #${i} Cool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool Description3`,
    img_url:
      i % 3 === 0
        ? "https://mdbcdn.b-cdn.net/img/new/standard/nature/184.webp"
        : i % 3 === 1
        ? dummy_car
        : "",
    price: 10,
    name: `App #${i}`,
    publication_date: "1.5.2022",
    rating: 3,
    SHA: ["256da46546fd"],
    version: 1.0,
    owned: i % 2 === 0 ? true : false,
    published: i % 2 === 0 ? true : false,
    myRating: i % 5 === 0 ? undefined : (i % 5) * 20,
    magnetLink: "cool magnet",
    category: AppCategories.Games
  });
}

export const DUMMY_PUBLISHED: AppData[] = [];

for (let i = 0; i < 20; i++) {
  DUMMY_PUBLISHED.push({
    id: i,
    company: `Carmel Hecht`,
    description: `Cool Description #${i} Cool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool Description3`,
    img_url:
      i % 3 === 0
        ? "https://mdbcdn.b-cdn.net/img/new/standard/nature/184.webp"
        : i % 3 === 1
        ? dummy_car
        : "",
    price: (i % 5) + 1,
    name: `App #${i}`,
    publication_date:
      i % 3 === 0 ? "2.5.2022" : i % 1 === 1 ? "2.4.2078" : "1.1.0000",
    rating: i % 6,
    SHA: ["256da46546fd"],
    version: i % 6,
    owned: i % 2 === 0 ? true : false,
    published: true,
    myRating: i % 5 === 0 ? undefined : (i % 5) * 20,
    category: AppCategories.Games
  });
}

export const DUMMY_OWNED: AppData[] = [];

for (let i = 0; i < 20; i++) {
  DUMMY_OWNED.push({
    id: i,
    company: `Carmel Hecht`,
    description: `Cool Description #${i} Cool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool DescriptionCool Description3`,
    img_url:
      i % 3 === 0
        ? "https://mdbcdn.b-cdn.net/img/new/standard/nature/184.webp"
        : i % 3 === 1
        ? dummy_car
        : "",
    price: (i % 5) + 1,
    name: `App #${i}`,
    publication_date:
      i % 3 === 0 ? "2.5.2022" : i % 1 === 1 ? "2.4.2078" : "1.1.0000",
    rating: i % 6,
    SHA: ["256da46546fd"],
    version: i % 6,
    owned: true,
    published: i % 2 === 0 ? true : false,
    myRating: i % 5 === 0 ? undefined : (i % 5) * 20,
    category: AppCategories.Games
  });
}
export default DUMMY_APPS;
