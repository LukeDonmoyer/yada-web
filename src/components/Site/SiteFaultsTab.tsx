import { MutableRefObject, ReactElement, useRef, useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { SiteObject } from '../../store/FirestoreInterfaces';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';

import moment from 'moment';
import { TypeComputedProps } from '@inovua/reactdatagrid-community/types';
import { Button } from 'reactstrap';
import { CSVDownload, CSVLink } from 'react-csv';
import { Data, Headers } from 'react-csv/components/CommonPropTypes';
import CsvDownloadButton from '../Control/CsvDownloadButton';

window.moment = moment;

interface SiteFaultsTabProps {
    site: SiteObject;
}

export default function SiteFaultsTab({
    site,
}: SiteFaultsTabProps): ReactElement {
    const [
        gridRef,
        setGridRef,
    ] = useState<MutableRefObject<TypeComputedProps | null> | null>(null);

    const dateFormat = 'M/D/YYYY hh:mm:ss:SSS A';

    const columns = [
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

    const faults = site.equipmentUnits.flatMap((unit) => {
        return unit.faults.map((fault) => {
            return {
                unitName: unit.name,
                message: fault.message,
                timestamp: moment(fault.timestamp).format(dateFormat),
            };
        });
    });

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
                className={'data-grid'}
                columns={columns}
                dataSource={faults}
                defaultFilterValue={filters}
                defaultSortInfo={[]}
            />
        </>
    );
}
