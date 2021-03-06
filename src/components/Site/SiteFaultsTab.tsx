import { ReactElement } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { SiteObject } from '../../store/FirestoreInterfaces';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';

import moment from 'moment';
window.moment = moment;

interface SiteFaultsTabProps {
    site: SiteObject;
}

export default function SiteFaultsTab({
    site,
}: SiteFaultsTabProps): ReactElement {
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
        <ReactDataGrid
            className={'data-grid'}
            columns={columns}
            dataSource={faults}
            defaultFilterValue={filters}
        />
    );
}
