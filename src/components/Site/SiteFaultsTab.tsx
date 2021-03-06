import { ReactElement } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { SiteObject } from '../../store/FirestoreInterfaces';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';

interface SiteFaultsTabProps {
    site: SiteObject;
}

export default function SiteFaultsTab({
    site,
}: SiteFaultsTabProps): ReactElement {
    const columns = [
        {
            name: 'timestamp',
            header: 'Timestamp',
            filterEditor: DateFilter,
            minWidth: 150,
            defaultFlex: 1,
            render: ({ data }: any) => data.timestamp.toLocaleString(),
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
        { name: 'timestamp', operator: 'before', type: 'date', value: '' },
        { name: 'message', operator: 'contains', type: 'string', value: '' },
        { name: 'unitName', operator: 'contains', type: 'string', value: '' },
    ];

    const faults = site.equipmentUnits.flatMap((unit) => {
        return unit.faults.map((fault) => {
            return {
                unitName: unit.name,
                message: fault.message,
                timestamp: new Date(fault.timestamp),
            };
        });
    });

    return (
        <ReactDataGrid
            className={'data-grid'}
            columns={columns}
            dataSource={faults}
            defaultFilterValue={filters}
        />
    );
}
