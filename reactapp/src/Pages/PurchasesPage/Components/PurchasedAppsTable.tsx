import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import AppData from "../../AppsPage/AppData";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";

import "../../../CSS/PurchasedTable.css";
import { GlobalFilter } from "./GlobalFilter";
import Button from "react";
import isElectron from "is-electron";
import { MDBBtn } from "mdb-react-ui-kit";
import FallbackImg from "../../../Misc/fix-invalid-image-error.png";
import { startDownload, TorrentData } from "../../Shared/utils";
import { toast } from "react-toastify";
interface purchasedAppsTableProps {
  ownedApps: AppData[];
  setSelectedAppData: Dispatch<SetStateAction<AppData>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  activeTorrents: TorrentData[];
  downloadPath: string;
}



export function PurchasedAppsTable({
  ownedApps,
  setSelectedAppData,
  setShowModal,
  activeTorrents,
  downloadPath,
}: purchasedAppsTableProps) {


  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "img_url",
        Cell: (value: any) => {
          console.log("img cell value: ", value.value);
          return (
            <div>
              <img
                src={value.value}
                className={"my-purchases-app-image"}
                alt={""}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = FallbackImg;
                }}
              />
            </div>
          );
        },
      },
      {
        Header: "",
        accessor: "name",
      },

      {
        Header: "Description",
        accessor: "description",
        Cell: (value: any) => {
          return value.value;
        },
      },
      {
        Header: "Magnet 🧲",
        accessor: "magnetLink",
        Cell: (value: any) => (
          <div>
          <MDBBtn
          size={"sm"}
          onClick={() => {
            navigator.clipboard.writeText(value?.value)
            toast.success("Copied to clipboard! 🎉 ", )
          }}
          style={{
            'backgroundColor': "#00bcd4",
            'color': "white",
            'margin': "1px",
          }}
        >
          📋
        </MDBBtn>
        </div>
     )},
      {
        Header: "📥",
        accessor: "action",
        Cell: (value: any) => (
          <div>
            <MDBBtn
              size={"sm"}
              disabled={activeTorrents.filter(torrent => torrent.magnet === value.cell.row.original.magnetLink).length > 0}
              onClick={() => downloadBtnHandler(value.cell.row.original)}
            >
              {isElectron()
                ? ["Download"]
                : [
                    "Get Desktop Client",
                  ]}
            </MDBBtn>
          </div>
        ),
      },
    ],
    [activeTorrents]
  );
  const data = useMemo(() => ownedApps, [ownedApps]);

  const tableInstance = useTable(
    { columns: columns as any, data: data },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    setGlobalFilter,
  } = tableInstance;

  const { pageIndex, globalFilter } = state;

  const downloadBtnHandler = async (rowData: AppData) => {
    if (isElectron() || true) {
      console.log("Row data to download: ", rowData);
      setSelectedAppData(rowData);
      // setShowModal(true);
      await startDownload(rowData, downloadPath)
    } else {
      window.open("https://easyupload.io/ihr4mn");
    }
  };

  return (
    <>
      <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      <table {...getTableProps()} className="purchased-table">
        <thead>
          {headerGroups.map((headerGroup) => {
            const { key } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...headerGroup.getHeaderGroupProps}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? "🔽"
                          : "🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <span>
          Page{" "}
          <strong>
            {" "}
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <button
          onClick={() => previousPage()}
          className="table-nav-btn"
          disabled={!canPreviousPage}
        >
          {" < "}
        </button>
        <button
          onClick={() => nextPage()}
          className="table-nav-btn"
          disabled={!canNextPage}
        >
          {" > "}
        </button>
      </div>
    </>
  );
}
