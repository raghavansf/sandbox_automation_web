# How it Works

1. This application exposes REST api which will be called by CORE -WebToLead application for trial sandbox provisioning .
2. Upon receiving requests will ingest the request metadata to data store (postgresql vs redis in consideration) .
3. Application will be deployed in Heroku as Webapp
4. This application will delegate all sandbox provisioning related requests to Worker app which is responsible for doing the heavy lifting.
5. It addresses all basic API requests from CORE such as Status for SandboxRequest against underlying Data store(postgresql)
6. All the configurations are abstracted from code using dotenv npm package and load during the time it requires
7. Used ES6 syntax and configured as "module" (refer package.json)

## Module Dependencies

1. Dotenv
2. postgresql
3. Node14>= supported
4. Express ,handle-bars (for basic UI templating)

## How to run

1. Install npm dependencies using "npm install" at the folder where package.json is located
2. Run the command "npm run start" which will start the application and if PORT not provided will be using "5000"

## Not Implemented

1. No validations for the incoming data at this point -Assumption : CORE webtolead will take care of this
2. Any cleanup of DB old records -Archiving
3. Automatic DB migration tooling (similar to liquibase/flyway).

## Status Mapping - How it works

COMBINATIONS ARE AS BELOW(processing logic)

- REQUESTED + NEW
- REQUESTED + IN PROGRESS
- REQUESTED + COMPLETED --> ACTIVE+COMPLETED
- FAILED+COMPLETED
- EXPIRED+COMPLETED
- ACTIVE + NEW --> INTERPRET AS RENEWAL
- EXPIRED+ NEW --> INTERPRET AS DELETION

## APIs exposed

1. /provision - POST
2. /provision/expire/{provisionReferenceId} - POST
3. /provision/renew/{provisionReferenceId} - POST

4. /weblead - TEST WebLead Form
