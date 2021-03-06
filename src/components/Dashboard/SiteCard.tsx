import React, { ReactElement } from 'react';

import './siteCard.scss';
import { EquipmentUnit, SiteObject } from '../../store/FirestoreInterfaces';
import Statistic from './Statistic';
import { Link } from 'react-router-dom';

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

    console.log(Date.now().toString());

    let latestFaults = site.equipmentUnits
        .flatMap((unit) => {
            return unit.faults.map((fault) => {
                return { fault: fault, unitName: unit.name };
            });
        })
        .sort((a, b) => a.fault.timestamp - b.fault.timestamp)
        .slice(0, 3);

    return (
        <div className={'card'}>
            <div>
                <div className={'site-information'}>
                    <div>
                        <h3>{site.name}</h3>
                    </div>
                    <div>
                        <Statistic
                            value={site.equipmentUnits.length}
                            label={'Total units'}
                        />
                        <Statistic
                            value={site.equipmentUnits
                                .map((unit) => unit.loggers.length)
                                .reduce(sum, 0)}
                            label={'Total loggers'}
                        />
                    </div>
                    <div>
                        <Statistic
                            valueClassName={'fault-statistic'}
                            value={site.equipmentUnits
                                .map((site) => site.faults.length)
                                .reduce(sum, 0)}
                            label={'Total faults'}
                        />
                    </div>
                </div>
                <SiteLatestFaultTable site={site} />
            </div>
            <div className={'details-button'}>
                <Link to={`/app/sites/${siteId}`}>
                    <div className={'details-link'}>View Details</div>
                </Link>
                <svg width={24} height={24} viewBox="0 0 24 24">
                    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                </svg>
            </div>
        </div>
    );
}

interface SiteLatestFaultTable {
    site: SiteObject;
}

function SiteLatestFaultTable({ site }: SiteLatestFaultTable): ReactElement {
    let latestFaults = site.equipmentUnits
        .flatMap((unit) => {
            return unit.faults.map((fault) => {
                return { fault: fault, unitName: unit.name };
            });
        })
        .sort((a, b) => a.fault.timestamp - b.fault.timestamp)
        .slice(0, 3);

    if (latestFaults.length <= 0) return <h3>No Faults</h3>;

    return (
        <div className={'fault-table'}>
            <div className={'fault-table-row'}>
                <h4>Equip. name</h4>
                <h4>Fault</h4>
                <h4>Time</h4>
            </div>
            {latestFaults.map((x) => {
                return (
                    <div className={'fault-table-row'}>
                        <div>{x.unitName}</div>
                        <div>{x.fault.message}</div>
                        <div>
                            {new Date(x.fault.timestamp).toLocaleString()}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
