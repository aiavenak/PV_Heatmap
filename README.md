# SCAffold

Empty node express+angular application with UI and API components.

## Requirements

* node.js
* npm
* bower
* pm2
* mongoDB

## Setup

* Clone this repository
* Enter ui folder and run `npm install`
* Enter ui/public folder and run `bower install`
* Enter api folder and run `npm install`
* Enter ui folder and run `cp config.js.sample config.js`
* Edit config.js to meet your needs

## Running

Run `./start.sh` 
The API and UI will be initialized in pm2 and logging will be shown.

Browse to http://localhost:12808/ to see the UI (default port). 

## Using

SCAffold is intended to expedite the process of getting a functional SCA prototype working.   It includes an example table with a CRUD (Create,Read,Update,Delete) API backing it.  It also includes CAS login functionality which is verified and used by the API to secure sensitive operations.  Here are some useful files to edit to start customizing SCAffold:

* `api/controllers.js` - Defines the available API calls
* `api/models.js` - Sets the schema for the mongoDB collections
* `ui/js/app.js` - defines the angular app and sets the routing (which controller/template to use)
* `ui/js/controllers.js` - Angular controllers
* `ui/t/` - HTML templates used by angular
* `ui/index.pug` - Rendered by express to index.html.  This is where client-side javascript and css libraries are loaded
