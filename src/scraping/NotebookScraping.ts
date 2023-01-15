import puppeteer from 'puppeteer';
import INotebook from '../interfaces/INotebook';
import INotebookDetails from '../interfaces/INotebookDetails';
import IVersionNotebook from '../interfaces/IVersionNotebook';
import ErrorGenerator from '../utils/ErrorGenerator';

export default class NotebookScraping {
  static async getAllNotebooks(): Promise<INotebook[]> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
    });
    const page = await browser.newPage();
    await page.goto(
      'https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops',
    );
    try {
      await page.waitForSelector('.thumbnail', { timeout: 2000 });
      const notebooks = await page.$$eval('.thumbnail', (elements) =>
        elements.map((element) => ({
          id: Number(
            element
              .querySelector('.title')
              ?.getAttributeNode('href')
              ?.textContent?.replace(
                '/test-sites/e-commerce/allinone/product/',
                '',
              ),
          ),
          title: element.querySelector('.title')?.textContent || '',
          price: {
            value: Number(
              element.querySelector('.price')?.textContent?.replace('$', ''),
            ),
            currency: 'USD',
          },
          description: element.querySelector('.description')?.textContent || '',
          rating: {
            qtyReviews: Number(
              element
                .querySelector('.ratings > p.pull-right')
                ?.textContent?.replace(' reviews', ''),
            ),
            ratingLevel: Number(
              element
                .querySelector('.ratings > p:nth-child(2)')
                ?.getAttribute('data-rating'),
            ),
          },
        })),
      );
      await browser.close();
      return notebooks;
    } catch (e) {
      await browser.close();
      throw new ErrorGenerator(500, 'Internal Server Error!');
    }
  }

  static async getNotebookDetailById(id: number): Promise<INotebookDetails> {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
      ],
    });
    const page = await browser.newPage();
    await page.goto(
      `https://webscraper.io/test-sites/e-commerce/allinone/product/${id}`,
    );
    try {
      await page.waitForSelector('.caption', { timeout: 2000 });
      const title =
        (await page.$eval(
          '.caption > h4:nth-child(2)',
          (element) => element.textContent,
        )) || '';
      const description =
        (await page.$eval(
          '.caption > .description',
          (element) => element.textContent,
        )) || '';
      const rating = {
        qtyReviews: Number(
          await page.$eval('.ratings > p', (element) =>
            element.textContent?.replace(' reviews', ''),
          ),
        ),
        ratingLevel: await page.$$eval(
          '.glyphicon-star',
          (elements) => elements.length,
        ),
      };
      const versions: IVersionNotebook[] = await page.$$eval(
        '.swatches > button',
        (elements) =>
          elements.map((element) => {
            element.click();
            const price = {
              value: Number(
                document.querySelector('.price')?.textContent?.replace('$', ''),
              ),
              currency: 'USD',
            };
            const hdd =
              document.querySelector('.btn-primary')?.textContent || '';
            const isAvailable = !document
              .querySelector('.btn-primary')
              ?.className.includes('disabled');
            return {
              price,
              hdd,
              available: isAvailable,
            };
          }),
      );
      await browser.close();
      return {
        title,
        description,
        versions,
        rating,
      };
    } catch (e) {
      await browser.close();
      throw new ErrorGenerator(404, 'Notebook not found!');
    }
  }
}
