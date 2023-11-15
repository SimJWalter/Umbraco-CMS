import type { ProblemDetails } from '@umbraco-cms/backoffice/backend-api';
import type { UmbApi } from '@umbraco-cms/backoffice/extension-api';

// TODO add response types folder folders
export interface UmbFolderRepository extends UmbApi {
	createFolderScaffold(unique: string | null): Promise<{
		data?: any;
		error?: ProblemDetails;
	}>;
	createFolder(
		unique: string,
		parentUnique: string | null,
		name: string,
	): Promise<{
		data?: string;
		error?: ProblemDetails;
	}>;

	requestFolder(unique: string): Promise<{
		data?: any;
		error?: ProblemDetails;
	}>;

	updateFolder(
		unique: string,
		name: string,
	): Promise<{
		data?: any;
		error?: ProblemDetails;
	}>;

	deleteFolder(unique: string): Promise<{
		error?: ProblemDetails;
	}>;
}
