import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { OccConfig } from '../../occ/config/occ-config';
import * as fromStore from '../store/index';

/**
 * Facade that provides easy access to language state, actions and selectors.
 */
@Injectable()
export class LanguageService {
  constructor(
    private store: Store<fromStore.StateWithSiteContext>,
    private config: OccConfig
  ) {}

  /**
   * Represents all the languages supported by the current store.
   */
  getAll(): Observable<fromStore.LanguagesEntities> {
    this.store.dispatch(new fromStore.LoadLanguages());
    return this.store.pipe(select(fromStore.getAllLanguages));
  }

  /**
   * Represents the isocode of the active language.
   */
  getActive(): Observable<string> {
    return this.store.pipe(select(fromStore.getActiveLanguage));
  }

  /**
   * Initializes by loading all languages and select the active language.
   */
  initialize() {
    this.loadAll();
    this.initSessionLanguage();
  }

  /**
   * Selects the active language by isocode.
   */
  select(isocode: string) {
    this.store.dispatch(new fromStore.SetActiveLanguage(isocode));
  }

  /**
   * Loads all the languages of the current store.
   */
  protected loadAll() {
    this.store.dispatch(new fromStore.LoadLanguages());
  }

  /**
   * Initials the active language. The active language is either given
   * by the last visit (stored in session storage) or by the
   * default session language of the store.
   */
  protected initSessionLanguage() {
    if (sessionStorage && !!sessionStorage.getItem('language')) {
      this.select(sessionStorage.getItem('language'));
    } else {
      this.select(this.config.site.language);
    }
  }
}
