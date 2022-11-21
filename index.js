import express from 'express';

import { engine } from 'express-handlebars';
import {} from 'dotenv/config';
import { ProvisionRequestMgr } from './provisionRequestMgr.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('port', process.env.PORT || 5000);

app.engine('handlebars', engine());

app.set('view engine', 'handlebars');
app.set('views', './views');

// provisioning request status .Shouldnot be NULL or EMPTY .
//Always initialize with REQUESTED
const STATUS = {
  REQUESTED: 'REQUESTED',
  FAILED: 'FAILED',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
};

/**
 *****  PROVISION STATUS --> REQUESTPROCESSINGSTATUS MAPPINGS ****
 * COMBINATIONS ARE AS BELOW
 * REQUESTED + NEW
 * REQUESTED + IN PROGRESS
 * REQUESTED + COMPLETED --> ACTIVE+COMPLETED
 * FAILED+COMPLETED
 * EXPIRED+COMPLETED
 * ACTIVE + NEW --> INTERPRET AS RENEWAL
 * EXPIRED+ NEW --> INTERPRET AS DELETION
 */
const REQUEST_PROCESSING_STATUS = {
  NEW: 'NEW',
  INITIATED: 'SANDBOX_INITIATED',
  DELETED: 'SANDBOX_DELETED',
  PROVISIONED: 'SANDBOX_PROVISIONED',
};

// just config value testing ..
app.use('/config', function (req, res) {
  console.log('Displaying DB Config  values ..', {
    message: process.env.DATABASE_URL,
  });
});

/**
 * This route is to initialize WebLead form  - For testing purposes!!!
 */
app.get('/weblead', (req, res) => {
  res.render('weblead');
});
/**
 * This endpoint is responsible for taking the new Provision Request
 * It will be invoked by CORE platform for any new sandbox requests
 */
app.post('/provision', (req, res) => {
  const body = req.body;
  const provisioningRequest = {
    requestProcessingStatus: REQUEST_PROCESSING_STATUS.DELETED,
    status: STATUS.REQUESTED,
    country: body.country,
    companyInfo: body.companyInfo,
    firstName: body.firstName,
    lastName: body.lastName,
    emailAddress: body.emailAddress,
    additionalContactAddress: [
      {
        fullName: body.addnContactFullName1,
        emailAddress: body.addnContactEmailAddress1,
      },
      {
        fullName: body.addnContactFullName2,
        emailAddress: body.addnContactEmailAddress2,
      },
    ],
  };

  console.log('ProvisionRequest submitted for creation', provisioningRequest);

  const provisionMgr = new ProvisionRequestMgr();
  provisionMgr
    .createProvisionRequest(provisioningRequest)
    .then((result) => res.json(result))
    .catch((err) => console.log('Error During ProvisionRequest Creation', err));
  // Need to return response with Provisioned Request ID
});
/**
 * This endpoint is responsible for getting the status for  respective Provisioned Request
 * This  will be invoked by CORE platform as part of  status check
 */
app.get('/provision/:requestId', (req, res) => {
  const provisionMgr = new ProvisionRequestMgr();
  provisionMgr
    .getProvisionRequestDetails(req.params.requestId)
    .then((result) => res.json(result))
    .catch((err) =>
      console.log('Error occured during gettingProvisionDetails', err)
    );
});

/**
 * This endpoint is responsible for expire the sandbox ahead of time
 * due to  reasons
 *
 */
app.post('/provision/delete/:requestId', (req, res) => {
  const provisionMgr = new ProvisionRequestMgr();
  provisionMgr
    .expireProvisionedRequest(req.params.requestId)
    .then((result) => res.json(result))
    .catch((err) =>
      console.log('Error occured during DeleteProvisionRequest', err)
    );
});

app.delete('/provision/:requestId', (req, res) => {
  const provisionMgr = new ProvisionRequestMgr();
  provisionMgr
    .expireProvisionedRequest(req.params.requestId)
    .then((result) => res.json(result))
    .catch((err) =>
      console.log('Error occured During Fetching ProvisionByRequestID', err)
    );
});

/**
 * This endpoint is responsible for renew the sandbox ahead of time
 * due to  reasons
 *
 */
app.post('/provision/renew/:requestId', (req, res) => {
  const provisionMgr = new ProvisionRequestMgr();
  provisionMgr
    .renewProvisionedRequest(req.params.requestId)
    .then((result) => res.json(result))
    .catch((err) =>
      console.log('Error occured During Renewal of  ProvisionByRequestID', err)
    );
});

app.listen(app.get('port'), () =>
  console.log(
    `Sandbox Provisioning Web App listening to port ${app.get('port')}`
  )
);
