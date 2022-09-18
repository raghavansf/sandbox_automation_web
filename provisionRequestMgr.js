import {} from 'dotenv/config';
import pg from 'pg';
import logger from './logger.js';
const { Pool } = pg;

const dbURL = process.env.DATABASE_URL;
/*
const pgPool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABSE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});
*/
const pgPool = new Pool({
  dbURL,
});

export class ProvisionRequestMgr {
  async createProvisionRequest(provisionRequest) {
    try {
      logger.info('Ingesting provision request to the data store', {
        meta: provisionRequest,
      });

      const client = await pgPool.connect();

      const result = await client
        .query(
          `INSERT INTO "provision_req_t"
      ("email_address","country","status","company_info","first_name","last_name","additional_contacts","request_processing_status")
      VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
          [
            provisionRequest.emailAddress,
            provisionRequest.country,
            provisionRequest.status,
            provisionRequest.companyInfo,
            provisionRequest.firstName,
            provisionRequest.lastName,
            JSON.stringify(provisionRequest.additionalContactAddress),
            provisionRequest.requestProcessingStatus,
          ]
        )
        .then((result) => {
          return {
            status: 'Success',
            provisionRequestId: result.rows[0].id,
            message: `Provisioned Request Initiated and ID for your reference is ${result.rows[0].id}`,
          };
        });
      client.release();
      return result;
    } catch (err) {
      logger.log('error', 'createProvisionRequest:', err);
      return false;
    }
  }

  async getProvisionRequestDetails(provisionRequestID) {
    try {
      const client = await pgPool.connect();
      const result = await client
        .query(
          'select id,email_address,status,country,additional_contacts,first_name,last_name,sandbox_id,sandbox_details from provision_req_t where id IN ($1)',
          [provisionRequestID]
        )
        .then((result) => {
          if (result.rowCount <= 0) {
            logger.warn('No Record found for the id', provisionRequestID);
            return {
              message: `No Record found for the Provided Id [${provisionRequestID}]`,
            };
          }
          if (result.rowCount == 1) return result.rows[0];
        });
      client.release();
      return result;
    } catch (err) {
      logger.log('error', 'getProvisionRequestDetails:', err);
      return false;
    }
  }

  async expireProvisionedRequest(provisionRequestID) {
    try {
      const client = await pgPool.connect();
      const result = await client
        .query(
          `update provision_req_t set  "request_processing_status"=$1 where id IN($2) and "status"=$3`,
          ['DELETE', provisionRequestID, 'ACTIVE']
        )
        .then((result) => {
          if (result.rowCount <= 0) {
            logger.warn('No Record found for the id', provisionRequestID);
            return {
              message: `No Record found for the Provided Id [${provisionRequestID}]`,
            };
          }
          if (result.rowCount == 1) return result.rows[0];
        });
      client.release();
      return result;
    } catch (err) {
      logger.log('error', 'expireProvisionedRequest:', err);
      return false;
    }
  }
  //TODO : Need to check how to return updated Records

  async renewProvisionedRequest(provisionRequestID) {
    try {
      const client = await pgPool.connect();
      const result = await client
        .query(
          `update provision_req_t set "status"=$1 , "request_processing_status"=$2 where id IN($3)`,
          ['ACTIVE', 'NEW', provisionRequestID]
        )
        .then((result) => {
          if (result.rowCount <= 0) {
            logger.warn('No Record found for the id', provisionRequestID);
            return {
              message: `No Record found for the Provided Id [${provisionRequestID}]`,
            };
          }
          if (result.rowCount == 1) return result.rows[0];
        });
      client.release();
      return result;
    } catch (err) {
      logger.log('error', 'renewProvisionedRequest:', err);
      return false;
    }
  }
}
