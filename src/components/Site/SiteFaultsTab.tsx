import { ReactElement } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { SiteObject } from '../../store/FirestoreInterfaces';

interface SiteFaultsTabProps {
    site: SiteObject;
}

export default function SiteFaultsTab({
    site,
}: SiteFaultsTabProps): ReactElement {
    /*const faults = site.equipmentUnits
        .flatMap((unit) => {
            return unit.faults
                .map((fault) => {
                    return {
                        unitName: unit.name,
                        fault: fault
                    }
                });
        });*/

    let columns = [
        {
            name: 'unitName',
            header: 'Unit',
            defaultFlex: 1,
        },
        {
            name: 'message',
            header: 'Fault',
            defaultFlex: 2,
        },
        {
            name: 'timestamp',
            header: 'Timestamp',
            minWidth: 150,
            defaultFlex: 1,
            render: ({ data }: any) => data.timestamp.toLocaleString(),
        },
    ];

    let data = [
        {
            id: 1,
            unitName: 'Test Unit',
            message: 'Error detected',
            timestamp: new Date(),
        },
        {
            id: 2,
            unitName: 'Test Unit 2',
            message: 'Error detected',
            timestamp: new Date(),
        },
    ];

    return (
        <ReactDataGrid
            className={'data-grid'}
            columns={columns}
            dataSource={data}
        />
    );
}
