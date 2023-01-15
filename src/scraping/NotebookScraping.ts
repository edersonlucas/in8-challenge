import puppeteer from 'puppeteer';
import INotebook from '../interfaces/INotebook';
import ErrorGenerator from '../utils/ErrorGenerator';

export default class NotebookScraping {
  static async getAllNotebooks(): Promise<INotebook[]> {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(
      'https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops',
    );
    try {
      await page.waitForSelector('.thumbnail');
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
      throw new ErrorGenerator(404, 'No notebook found!');
    }
  }

}
