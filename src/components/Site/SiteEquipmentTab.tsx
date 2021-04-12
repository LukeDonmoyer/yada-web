// @ts-nocheck
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
import chevron_right from 'assets/icons/chevron_right.svg';
import CsvDownloadButton from 'components/Control/CsvDownloadButton';
import { Data } from 'react-csv/components/CommonPropTypes';
import pencilIcon from 'assets/icons/pencil.svg';
import deleteIcon from 'assets/icons/delete.svg';
import PrivilegeAssert from 'components/Control/PrivilegeAssert';
import { isValidName } from 'scripts/DataValidation';
import { EquipmentUnit, LoggerObject } from 'store/FirestoreInterfaces';
import { timestampToDate } from 'scripts/DataTransformer';

//Default number of items to display per datagrid page.
const DEFAULT_PAGE_LIMIT = 10;

export default function SiteEquipmentTab(): ReactElement {
    const location = useLocation();
    const siteID = location.pathname.split('/')[3];
    const sites = useSelector((state: RootState) => state.sites);
    const loggers = useSelector((state: RootState) => state.loggers);
    const channelTemplates = useSelector((state: RootState) => state.templates);
    const privilege = useSelector((state: RootState) => state.auth.privilege);
    const csvHeaders: string[] = [];
    const [redirect, changeRedirect] = useState('');

    const statuses = [
        { id: 'disabled', label: 'DISABLED'},
        { id: 'active', label: 'ACTIVE'},
        { id: 'inactive', label: 'INACTIVE'},
    ];

    // Computes the status type for the given logger
    const computeStatus = (logger: LoggerObject) => {
        const loggerTime: Date = timestampToDate(logger.data[logger.data.length-1]["timestamp"]);
        const difference: number = new Date().getDay() - loggerTime.getDay();

        if (!logger.status) return statuses[0].label;

        return difference > 1 ? statuses[1].label : statuses[2].label;
    }

    // Creates list of logger statuses for given equipment unit
    const loggerStatus = (unit: EquipmentUnit) => {
        let loggerStatuses: ReactElement[] = [];
            
        unit.loggers.forEach((loggerId: string) => {
            let logger: LoggerObject = loggers[loggerId];

            if (logger)
                loggerStatuses.push(
                    <li> • {logger.name}: {computeStatus(logger)}</li>
                );     
        });

        return loggerStatuses;
    }

    /**
     * Aggregates data from all loggers into a single object.
     * @returns {any[]} all the data in an array
     */
    function getAllLoggerData(): any[] {
        var allData: any[] = [];

        //add the header for logger id
        csvHeaders.push('logger');

        //for each equipment at the current site
        sites[siteID].equipmentUnits.forEach((unit) => {
            //for each logger uid on the equipment
            unit.loggers.forEach((logger_uid) => {
                //for each channel on the template
                for (const [channelName, channelData] of Object.entries(
                    channelTemplates[loggers[logger_uid].channelTemplate]
                        .channels
                )) {
                    //for each value key in the channel
                    for (const [key] of Object.entries(channelData.keys)) {
                        //add headers for csv
                        if (!csvHeaders.includes(key)) {
                            csvHeaders.push(key);
                        }
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
        // pushes row for table
        return {
            name: unit.name,
            status: loggerStatus(unit),
            key: unit.name,
            actions: (
                <div className="actions">
                    {privilege !== 'User' ? (
                        <img
                            className="deleteIcon"
                            src={deleteIcon}
                            alt="delete"
                            onClick={() => {
                                if (
                                    window.confirm(
                                        `Delete equipment: ${unit.name}`
                                    )
                                ) {
                                    deleteEquipment(siteID, unit.name);
                                }
                            }}
                        />
                    ) : (
                        <></>
                    )}
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

    // Defines name editing column, used if user has Power/Admin/Owner privileges
    const nameEditColumn = {
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
                        onBlur={() => {
                            cellProps.editProps.onComplete();
                        }}
                        onChange={cellProps.editProps.onChange}
                        onFocus={() => cellProps.editProps.startEdit()}
                        onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                            if (event.key === 'Escape') {
                                cellProps.editProps.onCancel(event);
                            }
                            if (event.key === 'Enter') {
                                cellProps.editProps.onComplete(event);
                            }
                            if (event.key == 'Tab') {
                                event.preventDefault();
                                cellProps.editProps.onTabNavigation(
                                    true,
                                    event.shiftKey ? -1 : 1
                                );
                            }
                        }}
                    />
                </div>
            );
        },
    };

    // If user has normal positions, simply display the name
    const nameStaticColumn = {
        name: 'name',
        header: 'Name',
        defaultFlex: 9,
        editable: false,
    };

    // Other column definitions
    let columns: TypeColumn[] = [
        {
            name: 'status',
            header: 'Status',
            defaultFlex: 3,
            editable: false,
        },
        {
            name: 'actions',
            header: 'Actions',
            defaultFlex: 2,
            editable: false,
        },
    ];

    // Determines if user sees editable name column or static name column
    if (privilege === 'User') {
        columns.unshift(nameStaticColumn);
    } else {
        columns.unshift(nameEditColumn);
    }

    // Default filter values
    const filters = [
        {
            name: 'name',
            operator: 'contains',
            type: 'string',
            value: '',
        },
    ];

    /**
     * Creates a new equipment row in the data grid with default values.
     */
    function handleNewEquipmentClick(): void {
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

    // Handles name edit completion
    const onEditComplete = (info: TypeEditInfo) => {
        if (info.columnId === 'name'){
            if (!isValidName(info.value)) {
                alert(
                    `Invalid equipment name: only alphabetical characters are allowed, reverting to old name`
                );
                return;
            }
            
            if (privilege !== 'User') {
                changeEquipmentName(siteID, rows[info.rowIndex].name, info.value);
            }
        }
    };

    if (redirect !== '') {
        return <Redirect to={redirect} />;
    }

    return (
        <div className="site-equipment">
            <div className="buttonBar">
                <PrivilegeAssert requiredPrivilege="Power">
                    <Button
                        type={ButtonType.tableControl}
                        text={'Create Equipment'}
                        onClick={() => {
                            handleNewEquipmentClick();
                        }}
                    />
                </PrivilegeAssert>
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
