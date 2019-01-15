import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { StoreFinderGridComponent } from './store-finder-grid.component';
import { StoreFinderService } from '../../services/store-finder.service';
import { SpinnerModule } from '../../../ui/components/spinner/spinner.module';

import * as fromReducers from '../../store';
import { Pipe, PipeTransform, Component, Input } from '@angular/core';
import { RoutingService } from '@spartacus/core';

const countryIsoCode = 'CA';
const regionIsoCode = 'CA-QC';

class StoreFinderServiceMock {
  viewAllStoresForCountry(_countryIso: string) {}
  viewAllStoresForRegion(_countryIso: string, _regionIso: string) {}
}

@Component({
  selector: 'cx-store-finder-list-item',
  template: ''
})
export class MockStoreFinderListItemComponent {
  @Input()
  location;
}

const location = {
  name: 'testName'
};

const mockActivatedRoute = {
  snapshot: {
    params: {}
  }
};

@Pipe({
  name: 'cxTranslateUrl'
})
class MockTranslateUrlPipe implements PipeTransform {
  transform() {}
}

describe('StoreFinderGridComponent', () => {
  let component: StoreFinderGridComponent;
  let fixture: ComponentFixture<StoreFinderGridComponent>;
  let storeFinderService: StoreFinderService;
  const mockRoutingService = {
    go: jasmine.createSpy('go')
  };

  it('should create with country routing parameter', () => {
    mockActivatedRoute.snapshot.params = { country: countryIsoCode };
    configureTestBed();
    spyOn(storeFinderService, 'viewAllStoresForCountry');

    createComponent();

    expect(component).toBeTruthy();
    expect(storeFinderService.viewAllStoresForCountry).toHaveBeenCalledWith(
      countryIsoCode
    );
  });

  it('should create with country and region routing parameters', () => {
    mockActivatedRoute.snapshot.params = {
      country: countryIsoCode,
      region: regionIsoCode
    };
    configureTestBed();
    spyOn(storeFinderService, 'viewAllStoresForRegion');

    createComponent();

    expect(component).toBeTruthy();
  });

  it('should route when viewStore is called with region', () => {
    mockActivatedRoute.snapshot.params = {
      country: countryIsoCode,
      region: regionIsoCode
    };
    configureTestBed();
    spyOn(storeFinderService, 'viewAllStoresForRegion');
    createComponent();

    component.viewStore(location);

    expect(mockRoutingService.go).toHaveBeenCalledWith({
      route: [
        'storeFinder',
        {
          name: 'storeDescription',
          params: {
            country: countryIsoCode,
            region: regionIsoCode,
            store: location.name
          }
        }
      ]
    });
    expect(storeFinderService.viewAllStoresForRegion).toHaveBeenCalledWith(
      countryIsoCode,
      regionIsoCode
    );
  });

  it('should route when viewStore is called without region', () => {
    mockActivatedRoute.snapshot.params = {
      country: countryIsoCode
    };
    configureTestBed();
    spyOn(storeFinderService, 'viewAllStoresForCountry');
    createComponent();

    component.viewStore(location);

    expect(mockRoutingService.go).toHaveBeenCalledWith({
      route: [
        'storeFinder',
        {
          name: 'storeDescription',
          params: {
            region: '',
            country: countryIsoCode,
            store: location.name
          }
        }
      ]
    });
  });

  function configureTestBed(): void {
    const bed = TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature('stores', fromReducers.reducers),
        RouterTestingModule,
        SpinnerModule
      ],
      declarations: [
        StoreFinderGridComponent,
        MockStoreFinderListItemComponent,
        MockTranslateUrlPipe
      ],
      providers: [
        { provide: StoreFinderService, useClass: StoreFinderServiceMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: RoutingService, useValue: mockRoutingService }
      ]
    });
    bed.compileComponents();

    storeFinderService = bed.get(StoreFinderService);
  }

  function createComponent() {
    fixture = TestBed.createComponent(StoreFinderGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }
});
