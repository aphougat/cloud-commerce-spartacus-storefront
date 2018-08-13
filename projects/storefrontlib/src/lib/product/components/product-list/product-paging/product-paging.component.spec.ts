import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductPagingComponent } from './product-paging.component';

describe('ProductPagingComponent', () => {
  let component: ProductPagingComponent;
  let fixture: ComponentFixture<ProductPagingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductPagingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPagingComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
