import {
    EquipmentUnit,
    Fault,
    SiteObject,
} from '../../store/FirestoreInterfaces';
import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import Skeleton from 'react-loading-skeleton';

interface FaultData {
    unitName: string;
    fault: Fault;
}

interface SiteLatestFaultTableProps {
    // Site Object to get faults for
    site: SiteObject;

    // Number of faults to display
    numFaults: number;
}

/**
 * Sub-component of Site Card to display a table of latest faults for the given site.
 *
 * @param site The site to get faults for.
 * @param numFaults The number of faults to display.
 * @constructor
 */
export default function SiteLatestFaultTable({
    site,
    numFaults,
}: SiteLatestFaultTableProps): ReactElement {
    const loggers = useSelector((state: RootState) => state.loggers);
    const [latestFaults, setLatestFaults] = useState<FaultData[]>([]);

    useEffect(() => {
        async function getLatestFaults(): Promise<FaultData[]> {
            return site.equipmentUnits
                .flatMap((unit: EquipmentUnit) => {
                    return unit.loggers.flatMap((loggerId: string) => {
                        return (
                            loggers[loggerId]?.faults.map((fault: Fault) => {
                                return { unitName: unit.name, fault: fault };
                            }) ?? []
                        );
                    });
                })
                .sort((a, b) => a.fault.timestamp - b.fault.timestamp)
                .slice(0, numFaults);
        }

        getLatestFaults().then(setLatestFaults);
    }, [loggers, numFaults, site]);

    if (latestFaults && latestFaults.length <= 0) return <h3>No Faults</h3>;

    return (
        <div className={'fault-table'}>
            <div className={'fault-table-row'}>
                <h4>Equip. name</h4>
                <h4>Fault</h4>
                <h4>Time</h4>
            </div>
            {(latestFaults &&
                latestFaults.map((entry) => {
                    return (
                        <div className={'fault-table-row'}>
                            <div>{entry.unitName}</div>
                            <div>
                                {entry.fault.messages.map((message: string) => (
                                    <div className={'truncate'}>{message}</div>
                                ))}
                            </div>
                            <div>
                                {new Date(
                                    entry.fault.timestamp
                                ).toLocaleString()}
                            </div>
                        </div>
                    );
                })) || <Skeleton count={3} />}
        </div>
    );
}
