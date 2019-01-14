import { browser, by, element, ElementFinder } from 'protractor';
import { AppPage } from '../app.po';
import { E2EUtil } from '../../e2e-util';

export class OrderHistoryPage extends AppPage {
  readonly page: ElementFinder = element(by.tagName('cx-order-history-page'));

  readonly orderHistoryComponent: ElementFinder = this.page.element(
    by.tagName('cx-order-history')
  );
  readonly historyHeader: ElementFinder = this.orderHistoryComponent.element(
    by.css('.cx-order-history__header h3')
  );
  readonly historyTable: ElementFinder = this.orderHistoryComponent.element(
    by.tagName('table')
  );
  readonly historyItem = (itemNo: number): ElementFinder =>
    this.historyTable.all(by.css('tbody tr')).get(itemNo);

  async navigateTo() {
    await browser.get('/my-account/orders');
    await this.waitForReady();
  }

  async waitForReady() {
    await super.waitForReady();
    await E2EUtil.wait4VisibleElement(this.historyTable);
  }
}
