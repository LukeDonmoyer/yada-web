import React, { ReactElement, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";
import { createNewSite } from "../FireConfig";
import DynamicNavbar, { DynamicNavLink } from "./DynamicNavbar";
import { EquipmentUnit, SiteObject, Sites } from "../store/FirestoreInterfaces";
import { useRouteMatch } from "react-router-dom";
import { create } from "domain";

function addEquipment(event: any) {}

interface SiteEquipmentProps {
  siteId: keyof Sites;
}

export default function SiteEquipment({
  siteId,
}: SiteEquipmentProps): ReactElement {
  const { path, url } = useRouteMatch();
  const sites: Sites = useSelector(
    (state: RootState) => state.updateSites.sites
  );

  function createEquipmentLink(site: EquipmentUnit): ReactElement {
    return (
      <DynamicNavLink
        route={`/app/sites/equipment/${site.name.replace(" ", "-")}`}
        key={site.name}
        name={site.name}
      >
        <SiteEquipmentContent />
      </DynamicNavLink>
    );
  }

  return (
    <DynamicNavbar title={"Equipment"} buttonAction={addEquipment}>
      {sites[siteId].equipmentUnits.map(createEquipmentLink)}
      <DynamicNavLink
        route={`/app/sites/equipment`}
        key={"default"}
        name={"default route"}
        blockLinkRender={true}
      >
        <p>Please select a piece of equipment</p>
      </DynamicNavLink>
    </DynamicNavbar>
  );
}

export function SiteEquipmentContent(): ReactElement {
  return <h1>Content</h1>;
}
