import { EquipmentUnit } from "../../store/FirestoreInterfaces";
import React, { ReactElement } from "react";
import { SiteEquipmentBackButton } from "./SiteEquipmentBackButton";

interface SiteEquipmentContentProps {
  // The name of the site that the equipment is a part of
  siteName: string;

  // The unit to be displayed. If this is undefined, a message will be shown instead.
  unit?: EquipmentUnit;
}

/**
 * Displays the actual content for a selected piece of equipment.
 *
 * @constructor
 */
export function SiteEquipmentContent({
  siteName,
  unit,
}: SiteEquipmentContentProps): ReactElement {
  return (
    <div className={"site-equipment"}>
      <SiteEquipmentBackButton label={siteName} />
      {unit ? (
        <h1>{unit.name}</h1>
      ) : (
        <div className={"message"}>Add or select a piece of equipment.</div>
      )}
      {/*TODO display equipment details here*/}
    </div>
  );
}
