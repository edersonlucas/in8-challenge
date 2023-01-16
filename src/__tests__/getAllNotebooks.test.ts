import * as sinon from 'sinon';
import chai from 'chai';
import chaiHttp = require('chai-http');

import { Response } from 'superagent';
import app from '../app';
import NotebookScraping from '../scraping/NotebookScraping';

import { returnGetAllNotebooksMethod } from './mocks/notebookScraping.mock';
import {
  expectedNotebooks,
  expectedNotebooksFromLenovo,
} from './mocks/notebookService.mock';
import { internalServerErrorResponse } from './mocks/error.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /notebooks', () => {
  describe('It is possible to successfully make a request', () => {
    beforeEach(async () => {
      sinon
        .stub(NotebookScraping, 'getAllNotebooks')
        .resolves(returnGetAllNotebooksMethod);
    });
    afterEach(() => {
      (NotebookScraping.getAllNotebooks as sinon.SinonStub).restore();
    });
    it('Should return a 200 status code and all notebooks', async () => {
      const httpResponse: Response = await chai.request(app).get('/notebooks');
      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal(expectedNotebooks);
    });
  });

  describe('It is possible to successfully make a request by passing query parameter name', () => {
    beforeEach(async () => {
      sinon
        .stub(NotebookScraping, 'getAllNotebooks')
        .resolves(returnGetAllNotebooksMethod);
    });
    afterEach(() => {
      (NotebookScraping.getAllNotebooks as sinon.SinonStub).restore();
    });

    it('Should return a status code 200 and all lenovo notebooks', async () => {
      const httpResponse: Response = await chai
        .request(app)
        .get('/notebooks?name=lenovo');
      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal(expectedNotebooksFromLenovo);
    });

    it('Should return a status code 200 and no notebooks', async () => {
      const httpResponse: Response = await chai
        .request(app)
        .get('/notebooks?name=in8');
      expect(httpResponse.status).to.equal(200);
      expect(httpResponse.body).to.deep.equal([]);
    });
  });

  describe('An error occurred while making a request', () => {
    beforeEach(async () => {
      sinon
        .stub(NotebookScraping, 'getAllNotebooks')
        .throws(new Error('Internal Server Error!'));
    });
    afterEach(() => {
      (NotebookScraping.getAllNotebooks as sinon.SinonStub).restore();
    });
    it('should return a status code 500', async () => {
      const httpResponse: Response = await chai.request(app).get('/notebooks');
      expect(httpResponse.status).to.equal(500);
      expect(httpResponse.body).to.deep.equal(internalServerErrorResponse);
    });
  });
});
