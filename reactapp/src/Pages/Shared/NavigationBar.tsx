import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "../../CSS/NavigationBar.css";
import { AiOutlineSearch } from "react-icons/ai";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction, useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import {AppCategories, APPS_PER_PAGE, PagePaths} from "../../ReactConstants";
import AppData from "../AppsPage/AppData";
import {
  getDisplayedApps,
  getDisplayedAppsObj,
} from "../../Web3Communication/Web3ReactApi";
import {
  MDBBtn,
  MDBDropdown,
  MDBDropdownDivider,
  MDBDropdownItem,
  MDBDropdownLink,
  MDBDropdownMenu,
  MDBDropdownToggle
} from "mdb-react-ui-kit";


interface NavigationBarProps {
  setDisplayedApps: Dispatch<SetStateAction<Array<AppData>>>;
  setNumberOfPages: Dispatch<SetStateAction<number>>;
  currAccount: string;
}

export default function NavigationBar({
  setNumberOfPages,
  setDisplayedApps,
  currAccount,
}: NavigationBarProps) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(AppCategories.All)

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault(); //Otherwise refreshes the page

    getDisplayedApps(
      0,
      APPS_PER_PAGE,
      setDisplayedApps,
      setNumberOfPages,
      searchQuery,
        selectedCategory
    );

    //Reset the search query
    //setSearchQuery('')
  };

  const renderSearchbar = () => {
    if (location.pathname === PagePaths.AppsPagePath) {

      return (
        <div className={'search-div'}>

            <select className="mdb-select md-form" onChange={(e) => {
              console.log("Category: ", e.target.value)
              setSelectedCategory(e.target.value)

              getDisplayedApps(
                  0,
                  APPS_PER_PAGE,
                  setDisplayedApps,
                  setNumberOfPages,
                  searchQuery,
                  selectedCategory
              );

            }} defaultValue={AppCategories.All}>
              <option  value="" >{AppCategories.All} </option>
              {Object.values(AppCategories).filter(category => category !== AppCategories.All).map( (category) => (
                  <option id={category} value={category}>{category}</option>
              ) )}
            </select>


          <form
            className="searchArea d-flex input-group w-auto"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="search"
              className="form-control rounded"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="search-addon"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <AiOutlineSearch />
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
      );
    } else {
    }
  };

  return (
    <>
      <nav className="navbar sticky-top navbar-light bg-light">
        <div className="container-fluid">
          <a className="navbar-brand">dAppstore</a>
          <h6 id="curr-account-text"> {`Account: ${currAccount}`}</h6>
          {renderSearchbar()}
        </div>
      </nav>
    </>
  );
}
