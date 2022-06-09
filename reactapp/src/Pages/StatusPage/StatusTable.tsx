import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";

import {  TorrentData } from "../Shared/utils";

import "../../CSS/PublishedTable.css";
// import { GlobalFilter } from "./GlobalFilter";
import Button from "react";
import isElectron from "is-electron";
import { MDBBtn } from "mdb-react-ui-kit";
import FallbackImg from "../../../Misc/fix-invalid-image-error.png";
import { toast } from "react-toastify";
import AppData from "../AppsPage/AppData";
import ElectronMessages from "../../ElectronCommunication/ElectronMessages";

interface StatusTableProps {
    activeTorrents: TorrentData[];
}

export function StatusTable(props: StatusTableProps)
{
 

  const columns = useMemo(
    () => [
        {
            Header: "App",
            accessor: "appName",
        },
      {
        Header: "File",
        accessor: "name",
      },

      {
        Header: "Magnet 🧲",
        accessor: "magnet",
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
       )
        },
      {
        Header: "Download Speed B/s",
        accessor: "downloadSpeed",
      },
      {
        Header: "Upload Speed B/s",
        accessor: "uploadSpeed",
      },
      {
        Header: "Progress",
        accessor: "progress",
        Cell: (value: any) => {
            let resStr = value.value*100 + "%"
            if (value.value === 1){
                resStr += " (Seeding)"
            }
            return resStr
        }
        },
      {
        Header: "Peers Count",
        accessor: "peersNum",
      },
      {
        Header: "Remove",
        accessor: "none",
        Cell: (value: any) => (
        
            <MDBBtn
            size={"sm"}
            onClick={() => {
              const torrentData = value.cell.row.original
              console.log(value.cell.row.original)
              
              if(isElectron()){
                const { ipcRenderer } = window.require("electron");
                ipcRenderer.invoke(ElectronMessages.ElectronMessages.REMOVE_TORRENT, JSON.stringify({magnet: torrentData.magnet}))
              }

            }}
            >
              🛑
            </MDBBtn>)

      },
    ],
    []
  );
  const data = useMemo(() => props.activeTorrents, [props.activeTorrents]);

  const tableInstance = useTable(
    { columns: columns as any, data: data },
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
  } = tableInstance;

  const { pageIndex } = state;

  

  return (
    <>
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
