import { UmbModalToken, type UmbPickerModalData, type UmbPickerModalValue } from '@umbraco-cms/backoffice/modal';
import { UMB_CLIPBOARD_ENTRY_PICKER_MODAL_ALIAS } from './constants.js';
import type { UmbClipboardEntryDetailModel } from '../types.js';

export interface UmbClipboardEntryPickerModalData extends UmbPickerModalData<UmbClipboardEntryDetailModel> {}

export interface UmbClipboardEntryPickerModalValue extends UmbPickerModalValue {}

export const UMB_CLIPBOARD_ITEM_PICKER_MODAL = new UmbModalToken<
	UmbClipboardEntryPickerModalData,
	UmbClipboardEntryPickerModalValue
>(UMB_CLIPBOARD_ENTRY_PICKER_MODAL_ALIAS, {
	modal: {
		type: 'sidebar',
		size: 'small',
	},
});
