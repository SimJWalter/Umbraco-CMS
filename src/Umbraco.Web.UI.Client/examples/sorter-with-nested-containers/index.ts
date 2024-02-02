import type { ManifestTypes } from '@umbraco-cms/backoffice/extension-registry';

export const manifests: Array<ManifestTypes> = [
	{
		type: 'dashboard',
		name: 'Example Sorter Dashboard',
		alias: 'example.dashboard.dataset',
		element: () => import('./sorter-dashboard.js'),
		weight: 900,
		meta: {
			label: 'Sorter example',
			pathname: 'sorter-example',
		},
	},
];
