import React, { ReactElement } from "react";

import "./siteCard.scss";
import { SiteObject } from "../../store/FirestoreInterfaces";
import Statistic from "./Statistic";

interface SiteCardProps {
  site: SiteObject;
}

export default function SiteCard({ site }: SiteCardProps): ReactElement {
  const sum = (x: number, y: number) => x + y;

  if (!site) return <></>;

  return (
    <div className={"card"}>
      <div>
        <h3>{site.name}</h3>
      </div>
      <div>
        <Statistic value={site.equipmentUnits.length} label={"Total units"} />
        <Statistic
          value={site.equipmentUnits
            .map((unit) => unit.loggers.length)
            .reduce(sum)}
          label={"Total loggers"}
        />
      </div>
      <div>
        <Statistic
          valueClassName={"fault-statistic"}
          value={site.equipmentUnits
            .map((site) => site.faults.length)
            .reduce(sum)}
          label={"Total faults"}
        />
      </div>
      <div></div>
    </div>
  );
}
