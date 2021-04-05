import { MutableRefObject, ReactElement, useEffect, useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import {
    EquipmentUnit,
    Fault,
    SiteObject,
} from '../../store/FirestoreInterfaces';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';

import moment from 'moment';
import { TypeComputedProps } from '@inovua/reactdatagrid-community/types';
import { Data } from 'react-csv/components/CommonPropTypes';
import CsvDownloadButton from '../Control/CsvDownloadButton';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';

//Default number of items to display per datagrid page.
const DEFAULT_PAGE_LIMIT = 9;

window.moment = moment; // Needed for date filtering

interface FaultData {
    unitName: string;
    message: string[];
    timestamp: string;
}

interface SiteFaultsTabProps {
    // The site to get faults from
    site: SiteObject;
}

/**
 * Displays the faults tab for a site. This includes the csv download button and the fault table itself.
 *
 * @param site
 * @constructor
 */
export default function SiteFaultsTab({
    site,
}: SiteFaultsTabProps): ReactElement {
    const [faults, setFaults] = useState<FaultData[] | null>(null);
    const loggers = useSelector((state: RootState) => state.loggers);
    const [
        gridRef,
        setGridRef,
    ] = useState<MutableRefObject<TypeComputedProps | null> | null>(null);

    const dateFormat = 'M/D/YYYY hh:mm:ss:SSS A';

    const gridColumns = [
        {
            name: 'timestamp',
            header: 'Timestamp',
            minWidth: 150,
            defaultFlex: 1,
            dateFormat: dateFormat,
            filterEditor: DateFilter,
            filterEditorProps: () => {
                return { dateFormat: dateFormat };
            },
        },
        {
            name: 'message',
            header: 'Fault',
            defaultFlex: 2,
            render: ({ value }: any) =>
                value.map((message: string) => (
                    <>
                        <span>{message}</span>
                        <br />
                    </>
                )),
        },
        {
            name: 'unitName',
            header: 'Unit',
            defaultFlex: 1,
        },
    ];

    const filters = [
        { name: 'timestamp', operator: 'after', type: 'date', value: '' },
        { name: 'message', operator: 'contains', type: 'string', value: '' },
        { name: 'unitName', operator: 'contains', type: 'string', value: '' },
    ];

    //TODO: Change this to use implementation abstraction function
    useEffect(() => {
        async function getFaults(): Promise<FaultData[]> {
            return site.equipmentUnits.flatMap((unit: EquipmentUnit) => {
                return unit.loggers.flatMap((loggerId: string) => {
                    return (
                        loggers[loggerId]?.faults.map((fault: Fault) => {
                            return {
                                unitName: unit.name,
                                message: fault.messages,
                                timestamp: moment(fault.timestamp).format(
                                    dateFormat
                                ),
                            };
                        }) || []
                    );
                });
            });
        }

        getFaults().then(setFaults);
    }, [loggers, site]);

    return (
        <>
            <CsvDownloadButton
                align={'right'}
                headers={[
                    { label: 'Timestamp', key: 'timestamp' },
                    { label: 'Message', key: 'message' },
                    { label: 'Unit', key: 'unitName' },
                ]}
                filename={`${site.name} fault data.csv`}
                createData={() => gridRef?.current?.data as Data}
            />
            <ReactDataGrid
                onReady={setGridRef}
                className={'dataGrid'}
                columns={gridColumns}
                dataSource={faults ?? []}
                defaultFilterValue={filters}
                defaultSortInfo={[]}
                loading={faults === null}
                pagination={true}
                defaultLimit={DEFAULT_PAGE_LIMIT}
            />
        </>
    );
}
