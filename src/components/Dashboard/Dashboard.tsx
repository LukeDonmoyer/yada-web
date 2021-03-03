/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/dashboard'
 * purpose: currently displays the logged in user's UID and provides a button to log out
 */

import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import React, { ReactElement, useState } from "react";
import Content from "../Content";
import SearchBar from "./SearchBar";
import SiteCard from "./SiteCard";

export default function Dashboard() {
  const sites = useSelector((state: RootState) => state.sites);
  const currentUser = useSelector((state: RootState) => state.auth.userUID);
  const [searchQuery, setSearchQuery] = useState("");

  console.log(sites);

  return (
    <div className={"dashboard"}>
      <h1>Site Overview</h1>
      <SearchBar hint={"Search"} />
      <div className={"card-container"}>
        <SiteCard site={sites["SyUr5CsHDmi8wbdu9HjS"]} />
      </div>
    </div>
  );
}
