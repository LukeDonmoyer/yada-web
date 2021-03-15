import ReactDataGrid from '@inovua/reactdatagrid-community';
import DateFilter from '@inovua/reactdatagrid-community/DateFilter';
import { TypeComputedProps } from '@inovua/reactdatagrid-community/types';
import Button, { ButtonType } from 'components/Control/Button';
import CsvDownloadButton from 'components/Control/CsvDownloadButton';
import { ToggleSwitch } from 'components/Control/ToggleSwitch';
import { MutableRefObject, ReactElement, useState } from 'react';
import { Data } from 'react-csv/components/CommonPropTypes';
import { useSelector } from 'react-redux';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from 'reactstrap';
import {
    addLoggerToEquipment,
    removeLoggerFromEquipment,
    setLoggerChannelTemplate,
    setLoggerIsCollectingData,
} from 'scripts/Implementation';
import {
    ChannelTemplate,
    LoggerCollection,
    LoggerObject,
} from 'store/FirestoreInterfaces';
import { RootState } from 'store/rootReducer';

export interface LoggerTabProps {
    logger: LoggerObject;
    logger_uid: string;
}

export function LoggerTab({
    logger,
    logger_uid,
}: LoggerTabProps): ReactElement {
    const channelTemplates = useSelector((state: RootState) => state.templates);

    const [infoExpanded, setInfoExpanded] = useState(false);

    const handleInfoButton = () => setInfoExpanded(!infoExpanded);

    const dateFormat = 'M/D/YYYY hh:mm:ss:SSS A';

    const [
        gridRef,
        setGridRef,
    ] = useState<MutableRefObject<TypeComputedProps | null> | null>(null);

    const columns: any[] = [
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
    ];

    const filters = [
        { name: 'timestamp', operator: 'after', type: 'date', value: '' },
    ];

    var csvHeaders: string[] = [];

    for (const [key, value] of Object.entries(
        channelTemplates[logger.channelTemplate].keys
    )) {
        if (key !== 'timestamp') {
            columns.push({
                name: key,
                header: key,
                defaultFlex: 1,
            });
            filters.push({
                name: key,
                operator: 'neq',
                type: value,
                value: '',
            });
        }

        csvHeaders.push(key);
    }

    let rows: any[] = [];

    logger.data.forEach((dataPoint, index) => {
        var row = Object.assign({}, dataPoint);
        row['id'] = index;

        //if we have any boolean values, stringify them
        for (const [key, value] of Object.entries(
            channelTemplates[logger.channelTemplate].keys
        )) {
            if (value === 'boolean') {
                row[key] = JSON.stringify(row[key]);
            }
        }

        rows.push(row);
    });

    console.log(rows);

    return (
        <div className="loggerTab">
            <div className="buttonBar">
                <Button
                    text={infoExpanded ? 'hide info ⌃' : 'expand info ⌄'}
                    type={ButtonType.loggerInfoShow}
                    onClick={handleInfoButton}
                />
                <CsvDownloadButton
                    headers={csvHeaders}
                    filename={`${logger.name} data.csv`}
                    createData={() => gridRef?.current?.data as Data}
                />
            </div>
            {infoExpanded ? (
                <LoggerInfo logger={logger} logger_uid={logger_uid} />
            ) : null}

            <ReactDataGrid
                onReady={setGridRef}
                className={'dataGrid'}
                columns={columns}
                dataSource={rows}
                defaultSortInfo={[]}
                defaultFilterValue={filters}
            />
        </div>
    );
}

export interface LoggerSelectorProps {
    //ID of the site the equipment is a part of
    siteId: string;

    // The name of the equipment
    unitName: string;
}

export function LoggerSelector({ siteId, unitName }: LoggerSelectorProps) {
    const loggers: LoggerCollection = useSelector(
        (state: RootState) => state.loggers
    );

    var loggerCard: any = [];

    for (const [id, loggerData] of Object.entries(loggers)) {
        const data = loggerData as LoggerObject;

        //check that the logger does not have an equipment specified
        if (!data.equipment) {
            loggerCard.push(
                <div
                    className="loggerCard"
                    onClick={() => handleLoggerCardClick(id)}
                >
                    <h2>{data.name || '<logger.name>'}</h2>
                    {id}
                </div>
            );
        }
    }

    function handleLoggerCardClick(logger_id: string) {
        addLoggerToEquipment(siteId, unitName, logger_id);
    }

    return (
        <div className="loggerSelector">
            <h1>Select Logger</h1>

            {loggerCard}
        </div>
    );
}

export interface LoggerInfoProps {
    logger: LoggerObject;
    logger_uid: string;
}

export function LoggerInfo({ logger, logger_uid }: LoggerInfoProps) {
    const [templateDropDownOpen, setTemplateDropDownOpen] = useState(false);
    const toggleTemplateDropDown = () =>
        setTemplateDropDownOpen(!templateDropDownOpen);

    const [selectedTemplateId, setSelectedTemplateId] = useState(
        logger.channelTemplate
    );

    const channelTemplates = useSelector((state: RootState) => state.templates);

    var templateDropdownItems: any = [];

    for (const [id, data] of Object.entries(channelTemplates)) {
        const template = data as ChannelTemplate;

        //check that the logger does not have an equipment specified
        templateDropdownItems.push(
            <DropdownItem
                onClick={() => {
                    setSelectedTemplateId(id);
                    setLoggerChannelTemplate(logger_uid, id);
                }}
            >
                {template.name}
            </DropdownItem>
        );
    }

    const enableDataCollection = () => {
        setLoggerIsCollectingData(logger_uid, true);
    };
    const disableDataCollection = () => {
        setLoggerIsCollectingData(logger_uid, false);
    };

    const handleRemoveLogger = () => {
        removeLoggerFromEquipment(logger.site, logger_uid, logger.equipment);
    };

    return (
        <div className="loggerInfo">
            <div className="info">
                <LoggerInfoItem
                    label="Status"
                    value={logger.status ? 'active' : 'inactive'}
                />
                <LoggerInfoItem label="IP" value={logger.ip || '<unknown>'} />
                <LoggerInfoItem label="MAC" value={logger.mac || '<unknown>'} />
                <LoggerInfoItem label="Notes" value={logger.notes} />
            </div>
            <div className="controls">
                <div className="control">
                    <h2>Collecting Data</h2>
                    <ToggleSwitch
                        enabledDefault={logger.collectingData}
                        onEnable={enableDataCollection}
                        onDisable={disableDataCollection}
                    />
                </div>
                <h3>Logger uptime: {logger.uptime}</h3>
                <div className="control">
                    <h2>Template:</h2>
                    <div className="bootStrapStyles dropdown">
                        <Dropdown
                            isOpen={templateDropDownOpen}
                            toggle={toggleTemplateDropDown}
                        >
                            <DropdownToggle caret>
                                {selectedTemplateId
                                    ? channelTemplates[selectedTemplateId].name
                                    : '<template> ' + templateDropDownOpen}
                            </DropdownToggle>
                            <DropdownMenu className="dropdownMenu">
                                {templateDropdownItems}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div className="control">
                    <div>
                        {/* this is a spacer div to get the button to align correctly */}
                    </div>
                    <Button
                        type={ButtonType.warning}
                        text={'Remove Logger'}
                        onClick={handleRemoveLogger}
                    />
                </div>
            </div>
        </div>
    );
}

export interface LoggerInfoItemProps {
    label: string;
    value: string;
}

export function LoggerInfoItem({ label, value }: LoggerInfoItemProps) {
    return (
        <div className="loggerInfoItem">
            <h2>{label}</h2>
            <div className="value">{value}</div>
        </div>
    );
}
