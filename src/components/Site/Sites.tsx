/**
 * Dashboard component
 * author: Shaun Jorstad
 *
 * route: '/app/sites'
 * purpose: page that will provide access to manage sites
 */

import { createNewEquipment, createNewSite } from '../../scripts/Datastore';
import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { SiteObject } from 'store/FirestoreInterfaces';
import { RootState } from 'store/rootReducer';
import DynamicNavbar, { DynamicNavLink } from '../DynamicNavbar';
import SiteEquipment from './SiteEquipment';
import TabView, { TabViewItem } from '../TabView';
import Button, { ButtonType } from 'components/Button';
import { basename } from 'path';
import ConfigTab from './SiteConfigContent';
import SiteFaultsTab from './SiteFaultsTab';
import { Data } from 'react-csv/components/CommonPropTypes';
import CsvDownloadButton from 'components/CsvDownloadButton';
import SiteEquipmentTab from './SiteEquipmentTab';

export default function Sites() {
    const sites = useSelector((state: RootState) => state.sites);
    let navLinks: any = [];

    for (const [id, siteData] of Object.entries(sites)) {
        const data = siteData as SiteObject;
        navLinks.push(
            <DynamicNavLink route={id} key={id} name={data.name}>
                <SiteContent site={sites[id]} siteId={id} />
            </DynamicNavLink>
        );
    }

    return (
        <Switch>
            <Route path={'/app/sites/:siteId/equipment'}>
                <SiteEquipment />
            </Route>
            <Route path={'/app/sites'}>
                <DynamicNavbar title={'Sites'} buttonAction={createNewSite}>
                    {navLinks}
                    <DynamicNavLink
                        route={''}
                        key={'default'}
                        name={'default route'}
                        blockLinkRender={true}
                    >
                        <div className={'message'}>Please select a site</div>
                    </DynamicNavLink>
                </DynamicNavbar>
            </Route>
        </Switch>
    );
}

export interface SiteContentProps {
    site: SiteObject;
    siteId: string;
}

function SiteContent({ site, siteId }: SiteContentProps): ReactElement {
    return (
        <div className={'sites'}>
            <h1>{site.name}</h1>
            <TabView>
                <TabViewItem label={'Equipment'} exact default>
                    <SiteEquipmentTab />
                </TabViewItem>
                <TabViewItem label={'Faults'} route={'faults'}>
                    <SiteFaultsTab site={site} />
                </TabViewItem>
                <TabViewItem label={'Config'} route={'config'}>
                    <ConfigTab site={site} siteId={siteId} />
                </TabViewItem>
            </TabView>
        </div>
    );
}

        //TODO: MOVE NEW STUFF FOR CSV DOWNLOAD TO THE NEW COMPONENT FILE
function EquipmentTab(): ReactElement {
    const [filter, updateFilter] = useState('');
    const location = useLocation();
    const siteID = location.pathname.split('/')[3];
    const sites = useSelector((state: RootState) => state.sites);
    const loggers = useSelector((state: RootState) => state.loggers);
    const channelTemplates = useSelector((state:RootState) => state.templates);
    const csvHeaders: string[] = [];
    const [redirect, changeRedirect] = useState('');

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

    function filterSearch(unit: any) {
        return unit.name.includes(filter);
    }

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'name', flex: 1 },
        { field: 'health', headerName: 'health', flex: 1 },
        { field: 'type', headerName: 'type', flex: 1 },
    ];

    let rows: any[] = [];

    // creates rows
    sites[siteID]['equipmentUnits']
        .filter((unit) => filterSearch(unit))
        .forEach((unit) => {
            rows.push({
                name: unit.name,
                health: unit.health,
                type: unit.type,
                id: unit.name,
            });
        });

    function handleRowClick(row: any) {
        // alert(`navigating to ${row.row.name} unit`);
        let equipmentName = row.row.name.replace(' ', '-');
        changeRedirect(`/app/sites/${siteID}/equipment/${equipmentName}`);
    }

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
    //TODO Make site equipment tab
    return (
        <div className="table">
            <div className="tableControls">
                <input
                    className="input"
                    type={'text'}
                    value={filter}
                    placeholder={'filter'}
                    onChange={(event) => {
                        updateFilter(event.target.value);
                    }}
                />
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
            <div className="dataGrid">
                <DataGrid
                    rows={rows}
                    columns={columns}
                    onRowClick={(row) => handleRowClick(row)}
                    // pageSize={5}
                    components={{
                        Toolbar: GridToolbar,
                    }}
                    // autoHeight={true}
                />
            </div>
        </div>
    );
}

