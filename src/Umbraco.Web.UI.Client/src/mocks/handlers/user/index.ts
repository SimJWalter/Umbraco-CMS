import { handlers as detailHandlers } from './detail.handlers.js';
import { handlers as itemHandlers } from './item.handlers.js';
import { handlers as currentHandlers } from './current.handlers.js';
import { handlers as setUserGroupsHandlers } from './set-user-groups.handlers.js';
import { handlers as enableHandlers } from './enable.handlers.js';
import { handlers as disableHandlers } from './disable.handlers.js';
import { handlers as changePasswordHandler } from './change-password.handlers.js';

export const handlers = [
	...itemHandlers,
	...currentHandlers,
	...enableHandlers,
	...disableHandlers,
	...setUserGroupsHandlers,
	...changePasswordHandler,
	...detailHandlers,
];
