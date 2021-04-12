[![Netlify Status](https://api.netlify.com/api/v1/badges/9b313cfb-f006-45d9-9b5b-acd41fcd2d65/deploy-status)](https://app.netlify.com/sites/yada-demo/deploys)

# yada-web

This project is an HVAC system management, analysis, and fault detection application. This repo is the React powered front end dashboard for the aggregated data. The accompanying repo that powers the HVAC loggers can be found here {to be implemented}. Currently similar platforms are extremely expensive. This is not an all inclusive HVAC dashboard solution, the features are listed below.

## Features

- Register pi units conencted to HVAC units to push data to our server
- Configure Sites of HVAC units 
- Configure loggers associated with each HVAC unit
- Write custom python scripts to run on the hvac units that logs data. These python scripts can be edited and will update automatically on the pi.
- View live and historical data from the hvac units 
- Download data from any site, hvac unit, and equipment
- Receive fault notifications
- Manage users who have access to the webapp

## File structure breakdown
- src/assets/components: css styles for every component. Future refactoring to use scoped css inside the component files would be more ideal
- src/assets/designLangauge: css styles commonly re-used by components
- src/components: stores all the tyepscript components for the webapp. Files in this directory are further broken down into directories of similar components.
- src/scripts: contains datastore scripts.
- src/store: contains redux scripts.

# Installation

- Clone the repo
- install dependencies with yarn or npm
- Implement datastore queries
- Implement email & sms handling
- Deploy to a server

In depth details on the installation procedure can be found in the wiki


## Contributing

This repository will not be maintained past April 2021. Any contributions are welcome. 

### Recommended contributions

- Change firestore datastore implementation to sync only portions of data from loggers/equipments to reduce memory footprint
