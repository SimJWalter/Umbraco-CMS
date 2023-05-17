import type { Observable } from 'rxjs';
import { ItemResponseModelBaseModel } from '@umbraco-cms/backoffice/backend-api';
import { UmbStore } from './store.interface';

export interface UmbItemStore<T extends ItemResponseModelBaseModel = any> extends UmbStore<T> {
	items: (uniques: Array<string>) => Observable<Array<T>>;
}
