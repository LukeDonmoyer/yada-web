// @ts-nocheck
import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter';
import { TypeColumn } from '@inovua/reactdatagrid-community/types';
import Button, { ButtonType } from 'components/Control/Button';
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import {
    changeEquipmentName,
    createNewEquipment,
    deleteEquipment,
} from 'scripts/Datastore';
import { RootState } from 'store/rootReducer';
import '@inovua/reactdatagrid-community/index.css';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import chevron_right from '../../assets/icons/chevron_right.svg';
import CsvDownloadButton from 'components/Control/CsvDownloadButton';
import { Data } from 'react-csv/components/CommonPropTypes';
import pencilIcon from '../../assets/icons/pencil.svg';
import deleteIcon from '../../assets/icons/delete.svg';

//Default number of items to display per datagrid page.
const DEFAULT_PAGE_LIMIT = 10;

export default function SiteEquipmentTab(): ReactElement {
    const location = useLocation();
    const siteID = location.pathname.split('/')[3];
    const sites = useSelector((state: RootState) => state.sites);
    const loggers = useSelector((state: RootState) => state.loggers);
    const channelTemplates = useSelector((state: RootState) => state.templates);
    const csvHeaders: string[] = [];
    const [redirect, changeRedirect] = useState('');

    const statuses = [
        { id: 'good', label: 'good' },
        { id: 'bad', label: 'bad' },
    ];

    let types: Any[] = [];

    function getAllLoggerData() {
        var allData: any[] = [];

        //add the header for logger id
        csvHeaders.push('logger');

        //for each equipment at the current site
        sites[siteID].equipmentUnits.forEach((unit) => {
            //for each logger uid on the equipment
            unit.loggers.forEach((logger_uid) => {
                //add headers for csv
                for (const [key] of Object.entries(
                    channelTemplates[loggers[logger_uid].channelTemplate].keys
                )) {
                    if (!csvHeaders.includes(key)) {
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
            key: unit.name,
            actions: (
                <div className="actions">
                    {/* <span
                        className="deleteLink"
                        onClick={() => {
                            if (
                                window.confirm(`Delete equipment: ${unit.name}`)
                            ) {
                                deleteEquipment(siteID, unit.name);
                            }
                        }}
                    >
                        delete
                    </span> */}
                    <img
                        className="deleteIcon"
                        src={deleteIcon}
                        alt="delete"
                        onClick={() => {
                            if (
                                window.confirm(`Delete equipment: ${unit.name}`)
                            ) {
                                deleteEquipment(siteID, unit.name);
                            }
                        }}
                    />
                    <img
                        className="openIcon"
                        src={chevron_right}
                        alt="open"
                        onClick={() => {
                            let parsedName = unit.name.replace(' ', '-');
                            changeRedirect(
                                `/app/sites/${siteID}/equipment/${parsedName}`
                            );
                        }}
                    />
                </div>
            ),
        };
    });

    const nameColumn = {
        name: 'name',
        header: 'Name',
        defaultFlex: 9,
        rendersInlineEditor: true,
        render: ({ value }, { cellProps }) => {
            let v = cellProps.editProps.inEdit
                ? cellProps.editProps.value
                : value;
            return (
                <div className="editableTable">
                    <img src={pencilIcon} alt="editable" />
                    <input
                        className="nameColumn"
                        type="text"
                        autoFocus={cellProps.inEdit}
                        value={v}
                        onBlur={(e) => {
                            cellProps.editProps.onComplete();
                        }}
                        onChange={cellProps.editProps.onChange}
                        onFocus={() => cellProps.editProps.startEdit()}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                                cellProps.editProps.onCancel(e);
                            }
                            if (e.key === 'Enter') {
                                cellProps.editProps.onComplete(e);
                            }
                            if (e.key == 'Tab') {
                                e.preventDefault();
                                cellProps.editProps.onTabNavigation(
                                    true,
                                    e.shiftKey ? -1 : 1
                                );
                            }
                        }}
                    />
                </div>
            );
        },
    };

    const columns: TypeColumn[] = [
        nameColumn,
        {
            name: 'health',
            header: 'Health',
            defaultFlex: 3,
            filterEditor: SelectFilter,
            filterEditorProps: {
                placeholder: 'All',
                dataSource: statuses,
            },
            editable: false,
        },
        {
            name: 'type',
            header: 'Type',
            defaultFlex: 3,
            filterEditor: SelectFilter,
            filterEditorProps: {
                placeholder: 'All',
                dataSource: types,
            },
            editable: false,
        },
        {
            name: 'actions',
            header: 'Actions',
            defaultFlex: 2,
            editable: false,
        },
    ];

    const filters = [
        {
            name: 'name',
            operator: 'contains',
            type: 'string',
            value: '',
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

    const onEditComplete = (info: TypeEditInfo) => {
        switch (info.columnId) {
            case 'name': {
                let oldName = rows[info.rowIndex].name;
                let newName = info.value;
                changeEquipmentName(siteID, oldName, newName);
            }
        }
    };

    if (redirect !== '') {
        return <Redirect to={redirect} />;
    }

    return (
        <div className="site-equipment">
            <div className="buttonBar">
                <Button
                    type={ButtonType.tableControl}
                    text={'Create Equipment'}
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
                editable={true}
                onEditComplete={onEditComplete}
                pagination={true}
                defaultLimit={DEFAULT_PAGE_LIMIT}
            />
        </div>
    );
}
