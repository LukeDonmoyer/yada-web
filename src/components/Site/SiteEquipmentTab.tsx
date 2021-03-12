// @ts-nocheck
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import { TypeColumn } from '@inovua/reactdatagrid-community/types';
import Button, { ButtonType } from 'components/Button';
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { createNewEquipment } from 'scripts/Datastore';
import { RootState } from 'store/rootReducer';
import '@inovua/reactdatagrid-community/index.css';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import CsvDownloadButton from 'components/CsvDownloadButton';
import { Data } from 'react-csv/components/CommonPropTypes';

export default function SiteEquipmentTab(): ReactElement {
    const location = useLocation();
    const siteID = location.pathname.split('/')[3];
    const sites = useSelector((state: RootState) => state.sites);
    const loggers = useSelector((state: RootState) => state.loggers);
    const channelTemplates = useSelector((state:RootState) => state.templates);
    const csvHeaders: string[] = [];
    const [redirect, changeRedirect] = useState('');

    const statuses = [
        { id: 'good', label: 'good' },
        { id: 'bad', label: 'bad' },
    ];

    let types: Any[] = [];

    const onCellClick = (event, cellProps) => {
        const { data } = cellProps;
        let parsedName = data.name.replace(' ', '-');
        changeRedirect(`/app/sites/${siteID}/equipment/${parsedName}`);
    };

    function getAllLoggerData(){
        var allData: any[] = [];

        //add the header for logger id
        csvHeaders.push('logger');

        //for each equipment at the current site
        sites[siteID].equipmentUnits.forEach((unit) => {
            //for each logger uid on the equipment
            unit.loggers.forEach((logger_uid)=>{
                
                //add headers for csv
                for (const [key, value] of Object.entries(
                    channelTemplates[loggers[logger_uid].channelTemplate].keys
                )) {
                    if(!csvHeaders.includes(key)){
                        csvHeaders.push(key);
                    }
                }

                //add data points from logger and tag with logger uid
                loggers[logger_uid].data.forEach((dataPoint, index) => {
                    var dataEntry = Object.assign({}, dataPoint);
                    dataEntry['logger'] = logger_uid;

                    allData.push(dataEntry);
                });
            });
        });

        return allData;
    }

    // creates rows
    const rows = sites[siteID]['equipmentUnits'].map((unit) => {
        // Pushes select option for types filter
        let typeFound = false;
        types.forEach((type) => {
            if (type.id === unit.type) {
                typeFound = true;
            }
        });
        if (!typeFound) {
            types.push({
                id: unit.type,
                label: unit.type,
            });
        }

        // pushes row for table
        return {
            name: unit.name,
            health: unit.health,
            type: unit.type,
        };
    });

    const columns: TypeColumn[] = [
        {
            name: 'name',
            header: 'name',
            defaultFlex: 1,
        },
        {
            name: 'health',
            header: 'health',
            defaultFlex: 1,
            filterEditor: SelectFilter,
            filterEditorProps: {
                placeholder: 'All',
                dataSource: statuses,
            },
        },
        {
            name: 'type',
            header: 'type',
            defaultFlex: 1,
            filterEditor: SelectFilter,
            filterEditorProps: {
                placeholder: 'All',
                dataSource: types,
            },
        },
    ];

    const filters = [
        {
            name: 'name',
            operator: 'contains',
            type: 'string',
            value: null,
        },
        {
            name: 'health',
            operator: 'eq',
            type: 'select',
            value: null,
        },
        {
            name: 'type',
            operator: 'eq',
            type: 'select',
            value: null,
        },
    ];

    function handleNewEquipmentClick() {
        let baseName = 'New Equipment ';
        let nameNum = 0;

        while (
            sites[siteID]['equipmentUnits'].find(
                (element) => element.name === baseName + String(nameNum)
            ) !== undefined
        ) {
            nameNum++;
        }

        createNewEquipment(siteID, baseName + String(nameNum));
    }

    if (redirect !== '') {
        return <Redirect to={redirect} />;
    }

    return (
        <div className='site-equipment'>
            <div className="buttonBar">
                <Button
                    type={ButtonType.tableControl}
                    text={'create equipment'}
                    onClick={() => {
                        handleNewEquipmentClick();
                    }}
                />
                <CsvDownloadButton
                    headers={csvHeaders}
                    filename={`${sites[siteID].name}-all-data.csv`}
                    createData={() => getAllLoggerData() as Data}
                />
            </div>
            <ReactDataGrid
                className={'dataGrid'}
                columns={columns}
                dataSource={rows}
                defaultFilterValue={filters}
                onCellClick={onCellClick}
            />
        </div>
    );
}
