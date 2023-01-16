import * as sinon from 'sinon';
import chai from 'chai';
import chaiHttp = require('chai-http');

import { Response } from 'superagent';
import app from '../app';
import NotebookScraping from '../scraping/NotebookScraping';

import { returnGetNotebookDetailByIdMethod } from './mocks/notebookScraping.mock';
import { notebookNotFoundErrorResponse } from './mocks/error.mock';
import ErrorGenerator from '../utils/ErrorGenerator';
import { expectedNotebook } from './mocks/notebookService.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /notebook/:id', () => {
  describe('It is possible to successfully make a request', () => {
    beforeEach(async () => {
      sinon
        .stub(NotebookScraping, 'getNotebookDetailById')
        .resolves(returnGetNotebookDetailByIdMethod);
    });
    afterEach(() => {
      (NotebookScraping.getNotebookDetailById as sinon.SinonStub).restore();
    });
    it('Should return a 200 status code and notebook details', async () => {
      const httpResponse: Response = await chai
        .request(app)
        .get('/notebook/548');
      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal(expectedNotebook);
    });
  });

  describe('An error occurred while making a request', () => {
    beforeEach(async () => {
      sinon
        .stub(NotebookScraping, 'getNotebookDetailById')
        .throws(new ErrorGenerator(404, 'Notebook not found!'));
    });
    afterEach(() => {
      (NotebookScraping.getNotebookDetailById as sinon.SinonStub).restore();
    });
    it('should return a status code 404', async () => {
      const httpResponse: Response = await chai
        .request(app)
        .get('/notebook/434343');
      expect(httpResponse.status).to.equal(404);
      expect(httpResponse.body).to.deep.equal(notebookNotFoundErrorResponse);
    });
  });
});
