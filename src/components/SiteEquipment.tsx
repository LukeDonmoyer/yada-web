import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";
import DynamicNavbar, { DynamicNavLink } from "./DynamicNavbar";
import { useParams, useRouteMatch } from "react-router-dom";
import { EquipmentUnit, SiteCollection } from "../store/FirestoreInterfaces";

function addEquipment(event: any) {}

export default function SiteEquipment(): ReactElement {
  const { siteId }: any = useParams();
  const { url } = useRouteMatch();
  const sites: SiteCollection = useSelector(
    (state: RootState) => state.updateSites.sites
  );

  function createEquipmentLink(unit: EquipmentUnit): ReactElement {
    return (
      <DynamicNavLink
        route={`${url}/${unit.name.replace(" ", "-")}`}
        key={unit.name}
        name={unit.name}
      >
        <SiteEquipmentContent />
      </DynamicNavLink>
    );
  }

  return (
    <DynamicNavbar title={"Equipment"} buttonAction={addEquipment}>
      <DynamicNavLink
        route={url}
        key={"default"}
        name={"default route"}
        blockLinkRender={true}
      >
        <p>Please select a piece of equipment</p>
      </DynamicNavLink>
      {sites[siteId].equipmentUnits.map(createEquipmentLink) as any}
    </DynamicNavbar>
  );
}

export function SiteEquipmentContent(): ReactElement {
  return <h1>Content</h1>;
}
