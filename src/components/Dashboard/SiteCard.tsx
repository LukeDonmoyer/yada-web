import React, { ReactElement } from "react";

import "./siteCard.scss";
import { SiteObject } from "../../store/FirestoreInterfaces";

interface SiteCardProps {
  site: SiteObject;
}

export default function SiteCard({ site }: SiteCardProps): ReactElement {
  if (!site) return <></>;

  return (
    <div className={"card"}>
      <div>
        <h3>{site.name}</h3>
      </div>
      <div>
        <Statistic value={10} label={"Total units"} />
      </div>
      <div></div>
      <div></div>
    </div>
  );
}

interface StatisticProps {
  value: number;
  valueClassName?: string;
  label: string;
}

function Statistic({
  value,
  valueClassName,
  label,
}: StatisticProps): ReactElement {
  return (
    <div className={"statistics"}>
      <div className={valueClassName ?? "statistic-value"}>{value}</div>
      {label}
    </div>
  );
}
