import type { UserGroupItemResponseModel, UserGroupResponseModel } from '@umbraco-cms/backoffice/external/backend-api';

export type UmbMockUserGroupModel = UserGroupResponseModel & UserGroupItemResponseModel;

export const data: Array<UmbMockUserGroupModel> = [
	{
		id: 'user-group-administrators-id',
		name: 'Administrators',
		alias: 'admin',
		icon: 'icon-medal',
		documentStartNode: { id: 'all-property-editors-document-id' },
		fallbackPermissions: [
			'Umb.Document.Read',
			'Umb.Document.Create',
			'Umb.Document.Update',
			'Umb.Document.Delete',
			'Umb.Document.CreateBlueprint',
			'Umb.Document.Notifications',
			'Umb.Document.Publish',
			'Umb.Document.Permissions',
			'Umb.Document.Unpublish',
			'Umb.Document.Duplicate',
			'Umb.Document.Move',
			'Umb.Document.Sort',
			'Umb.Document.CultureAndHostnames',
			'Umb.Document.PublicAccess',
			'Umb.Document.Rollback',
		],
		permissions: [
			{
				$type: 'DocumentPermissionPresentationModel',
				verbs: ['Umb.Document.Rollback'],
				document: { id: 'simple-document-id' },
			},
		],
		sections: [
			'Umb.Section.Content',
			'Umb.Section.Media',
			'Umb.Section.Settings',
			'Umb.Section.Members',
			'Umb.Section.Packages',
			'Umb.Section.Translation',
			'Umb.Section.Users',
		],
		languages: [],
		hasAccessToAllLanguages: true,
		documentRootAccess: true,
		mediaRootAccess: true,
		aliasCanBeChanged: false,
		isDeletable: false,
	},
	{
		id: 'user-group-editors-id',
		name: 'Editors',
		alias: 'editors',
		icon: 'icon-tools',
		documentStartNode: { id: 'all-property-editors-document-id' },
		fallbackPermissions: [
			'Umb.Document.Read',
			'Umb.Document.Create',
			'Umb.Document.Update',
			'Umb.Document.Delete',
			'Umb.Document.CreateBlueprint',
			'Umb.Document.Notifications',
			'Umb.Document.Publish',
			'Umb.Document.Unpublish',
			'Umb.Document.Duplicate',
			'Umb.Document.Move',
			'Umb.Document.Sort',
			'Umb.Document.PublicAccess',
			'Umb.Document.Rollback',
		],
		permissions: [],
		sections: ['Umb.Section.Content', 'Umb.Section.Media'],
		languages: [],
		hasAccessToAllLanguages: true,
		documentRootAccess: true,
		mediaRootAccess: true,
		aliasCanBeChanged: true,
		isDeletable: true,
	},
	{
		id: 'user-group-sensitive-data-id',
		name: 'Sensitive data',
		alias: 'sensitive-data',
		icon: 'icon-lock',
		documentStartNode: { id: 'all-property-editors-document-id' },
		fallbackPermissions: [],
		permissions: [],
		sections: [],
		languages: [],
		hasAccessToAllLanguages: true,
		documentRootAccess: true,
		mediaRootAccess: true,
		aliasCanBeChanged: false,
		isDeletable: false,
	},
	{
		id: 'user-group-translators-id',
		name: 'Translators',
		alias: 'translators',
		icon: 'icon-globe',
		documentStartNode: { id: 'all-property-editors-document-id' },
		fallbackPermissions: ['Umb.Document.Read', 'Umb.Document.Update'],
		permissions: [],
		sections: ['Umb.Section.Translation'],
		languages: [],
		hasAccessToAllLanguages: true,
		documentRootAccess: true,
		mediaRootAccess: true,
		aliasCanBeChanged: true,
		isDeletable: true,
	},
	{
		id: 'user-group-writers-id',
		name: 'Writers',
		alias: 'writers',
		icon: 'icon-edit',
		documentStartNode: { id: 'all-property-editors-document-id' },
		fallbackPermissions: [
			'Umb.Document.Read',
			'Umb.Document.Create',
			'Umb.Document.Update',
			'Umb.Document.Notifications',
		],
		permissions: [],
		sections: ['Umb.Section.Content'],
		languages: [],
		hasAccessToAllLanguages: true,
		documentRootAccess: true,
		mediaRootAccess: true,
		aliasCanBeChanged: true,
		isDeletable: true,
	},
];
