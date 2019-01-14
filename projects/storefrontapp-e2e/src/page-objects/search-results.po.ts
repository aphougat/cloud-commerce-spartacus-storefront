import { AppPage } from './app.po';
import {
  browser,
  ElementFinder,
  ElementArrayFinder,
  by,
  element
} from 'protractor';
import { E2EUtil } from '../e2e-util';

export class SearchResultsPage extends AppPage {
  readonly YPAGE = 'cx-category-page';

  readonly PRODUCTS_PER_PAGE = 10;

  readonly SORTING_TYPES = {
    RELEVANCE: 'Relevance',
    TOP_RATED: 'Top Rated',
    NAME_ASC: 'Name (ascending)',
    NAME_DESC: 'Name (descending)',
    PRICE_HIGHEST_FIRST: 'Price (highest first)',
    PRICE_LOWEST_FIRST: 'Price (lowest first)'
  };

  readonly page: ElementFinder = element(by.tagName(this.YPAGE));

  readonly pagination: ElementFinder = this.page.element(
    by.tagName('cx-pagination')
  );

  readonly paginationNextPageBtn: ElementFinder = this.pagination.element(
    by.css('.page-item:last-of-type .page-link')
  );

  readonly paginationPreviousPageBtn: ElementFinder = this.pagination.element(
    by.css('.page-item:first-of-type .page-link')
  );

  readonly paginationSelectedPageBtnNumber: ElementFinder = this.pagination.element(
    by.css('.page-item.active > .page-link')
  );

  readonly paginationThirdPageBtn: ElementFinder = this.pagination.element(
    by.css('.page-item:nth-child(4) .page-link')
  );

  readonly viewModeSwitcher: ElementFinder = element(
    by.css('.cx-product-search__sorting--top cx-product-view > div > div')
  );

  readonly facets: ElementArrayFinder = this.page.all(
    by.css('.cx-search-facet-checkbox')
  );

  readonly clearFacets: ElementFinder = this.page.element(
    by.css('.cx-search-facet-filter__pill .close')
  );

  readonly sortingSelect: ElementFinder = this.page.element(
    by.css('cx-sorting .ng-select')
  );

  readonly productListItems: ElementArrayFinder = this.page
    .element(by.tagName('cx-product-list'))
    .all(by.tagName('cx-product-list-item'));

  readonly productGridItems: ElementArrayFinder = this.page
    .element(by.tagName('cx-product-list'))
    .all(by.tagName('cx-product-grid-item'));

  readonly productByNameInResults = (productName: string): ElementFinder =>
    this.productListItems
      .filter(el =>
        el
          .element(by.css('a.cx-product-search-list__name'))
          .getText()
          .then(text => text === productName)
      )
      .first();

  async navigateTo(searchKey: string) {
    await browser.get('/search/' + searchKey);
    await this.waitForReady();
  }

  async waitForReady() {
    await super.waitForReady();
    await E2EUtil.wait4VisibleElement(this.page);
  }

  getAddToCartInProductListItem(product: ElementFinder): ElementFinder {
    return product.element(by.tagName('cx-add-to-cart'));
  }

  async clickAddToCartButton4Product(product: ElementFinder) {
    const addToCartButton = this.getAddToCartInProductListItem(product);
    await addToCartButton.click();
  }

  async selectSortingType(value: string) {
    await E2EUtil.selectNgSelectOptionByText(this.sortingSelect, value);
  }

  getProductQuantitySpan(product: ElementFinder): ElementFinder {
    return product.element(
      by.css('span[class="entry-quantity ng-star-inserted"]')
    );
  }

  getHeaderText() {
    return this.page.element(by.css('header h1')).getText();
  }

  getFirstProductDataFromList() {
    return this.productListItems.get(0).getText();
  }

  getSingleFilterFacet(id: number) {
    return this.facets.get(id);
  }
}
