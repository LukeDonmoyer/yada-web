import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/rootReducer";
import DynamicNavbar, { DynamicNavLink } from "../DynamicNavbar";
import { useParams } from "react-router-dom";
import { EquipmentUnit, SiteObject } from "../../store/FirestoreInterfaces";
import { SiteEquipmentContent } from "./SiteEquipmentContent";

/**
 * Event handler for adding a new equipment unit.
 *
 * @param event The click event.
 */
function addEquipment(event: any) {
  //TODO: Add equipment unit to current site
}

/**
 * React element to display the equipment for a site in a dynamic sidebar. The current site id is obtained through
 * the url.
 *
 * @constructor
 */
export default function SiteEquipment(): ReactElement {
  const { siteId }: any = useParams();
  const site: SiteObject = useSelector(
    (state: RootState) => state.sites[siteId]
  );

  /**
   * Creates a dynamic navbar link for the given equipment unit.
   *
   * @param unit The EquipmentUnit to create a link for.
   */
  function createEquipmentLink(unit: EquipmentUnit): ReactElement {
    return (
      <DynamicNavLink
        route={unit.name.replace(" ", "-")}
        key={unit.name}
        name={unit.name}
      >
        <SiteEquipmentContent siteName={site.name} unit={unit} />
      </DynamicNavLink>
    );
  }

  return (
    <DynamicNavbar title={"Equipment"} buttonAction={addEquipment}>
      <DynamicNavLink
        route={""}
        key={"default"}
        name={"default route"}
        blockLinkRender={true}
      >
        <SiteEquipmentContent siteName={site.name} />
      </DynamicNavLink>
      {site.equipmentUnits.map(createEquipmentLink) as any}
    </DynamicNavbar>
  );
}
