import React, { ReactElement } from "react";

import "./siteCard.scss";
import { SiteObject } from "../../store/FirestoreInterfaces";
import Statistic from "./Statistic";
import { Link } from "react-router-dom";

interface SiteCardProps {
  site: SiteObject;
  siteId: string;
}

export default function SiteCard({
  site,
  siteId,
}: SiteCardProps): ReactElement {
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
      <div className={"details-button"}>
        <Link to={`/app/sites/${siteId}`}>
          <div className={"details-link"}>View Details</div>
        </Link>
        <svg width={24} height={24} viewBox="0 0 24 24">
          <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
        </svg>
      </div>
    </div>
  );
}
