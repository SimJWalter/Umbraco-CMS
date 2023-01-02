import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { IRoutingInfo, RouterSlot } from 'router-slot';
import { map } from 'rxjs';

import { UmbObserverMixin } from '@umbraco-cms/observable-api';
import { createExtensionElement } from '@umbraco-cms/extensions-api';
import { umbExtensionsRegistry } from '@umbraco-cms/extensions-registry';
import { UmbContextConsumerMixin } from '@umbraco-cms/context-api';
import type { ManifestWithMeta, ManifestWorkspaceView, ManifestWorkspaceViewCollection } from '@umbraco-cms/models';

import '../../body-layout/body-layout.element';
import '../../extension-slot/extension-slot.element';

/**
 * @element umb-workspace-entity
 * @description
 * @slot icon - Slot for rendering the entity icon
 * @slot name - Slot for rendering the entity name
 * @slot footer - Slot for rendering the entity footer
 * @slot actions - Slot for rendering the entity actions
 * @slot default - slot for main content
 * @export
 * @class UmbWorkspaceEntity
 * @extends {UmbContextConsumerMixin(LitElement)}
 */
@customElement('umb-workspace-entity')
export class UmbWorkspaceEntity extends UmbContextConsumerMixin(UmbObserverMixin(LitElement)) {
	static styles = [
		UUITextStyles,
		css`
			:host {
				display: block;
				width: 100%;
				height: 100%;
			}

			uui-input {
				width: 100%;
			}

			uui-tab-group {
				--uui-tab-divider: var(--uui-color-border);
				border-left: 1px solid var(--uui-color-border);
				border-right: 1px solid var(--uui-color-border);
			}
			router-slot {
				height: 100%;
			}

			umb-extension-slot[slot='actions'] {
				display: flex;
				gap: 6px;
			}
		`,
	];

	/**
	 * Alias of the workspace. The Layout will render the workspace views that are registered for this workspace alias.
	 * @public
	 * @type {string}
	 * @attr
	 * @default ''
	 */
	@property()
	public headline = '';

	@property()
	public alias = '';

	@state()
	private _workspaceViews: Array<ManifestWorkspaceView | ManifestWorkspaceViewCollection> = [];

	@state()
	private _currentView = '';

	@state()
	private _routes: Array<any> = [];

	private _routerFolder = '';

	connectedCallback(): void {
		super.connectedCallback();

		this._observeWorkspaceViews();

		/* TODO: find a way to construct absolute urls */
		this._routerFolder = window.location.pathname.split('/view')[0];
	}

	private _observeWorkspaceViews() {
		this.observe<ManifestWorkspaceView[]>(
			umbExtensionsRegistry
				.extensionsOfTypes(['workspaceView', 'workspaceViewCollection'])
				.pipe(
					map((extensions) =>
						extensions.filter((extension) => (extension as ManifestWithMeta).meta.workspaces.includes(this.alias))
					)
				),
			(workspaceViews) => {
				this._workspaceViews = workspaceViews;
				this._createRoutes();
			}
		);
	}

	private async _createRoutes() {
		if (this._workspaceViews.length > 0) {
			this._routes = [];

			this._routes = this._workspaceViews.map((view) => {
				return {
					path: `view/${view.meta.pathname}`,
					component: () => {
						if (view.type === 'workspaceViewCollection') {
							console.log('!!!!!workspaceViewCollection');
							return import(
								'src/backoffice/core/components/workspace/workspace-content/views/collection/workspace-view-collection.element'
							);
						}
						return createExtensionElement(view);
					},
					setup: (component: Promise<HTMLElement> | HTMLElement, info: IRoutingInfo) => {
						this._currentView = info.match.route.path;
						// When its using import, we get an element, when using createExtensionElement we get a Promise.
						(component as any).manifest = view;
						if ((component as any).then) {
							(component as any).then((el: any) => (el.manifest = view));
						}
					},
				};
			});

			this._routes.push({
				path: '**',
				redirectTo: `view/${this._workspaceViews?.[0].meta.pathname}`,
			});

			this.requestUpdate();
			await this.updateComplete;

			this._forceRouteRender();
		}
	}

	// TODO: Figure out why this has been necessary for this case. Come up with another case
	private _forceRouteRender() {
		const routerSlotEl = this.shadowRoot?.querySelector('router-slot') as RouterSlot;
		if (routerSlotEl) {
			routerSlotEl.render();
		}
	}

	private _renderTabs() {
		return html`
			${this._workspaceViews?.length > 0
				? html`
						<uui-tab-group slot="tabs">
							${this._workspaceViews.map(
								(view: ManifestWorkspaceView | ManifestWorkspaceViewCollection) => html`
									<uui-tab
										.label="${view.meta.label || view.name}"
										href="${this._routerFolder}/view/${view.meta.pathname}"
										?active="${this._currentView.includes(view.meta.pathname)}">
										<uui-icon slot="icon" name="${view.meta.icon}"></uui-icon>
										${view.meta.label || view.name}
									</uui-tab>
								`
							)}
						</uui-tab-group>
				  `
				: nothing}
		`;
	}

	render() {
		return html`
			<umb-body-layout .headline=${this.headline}>
				<slot name="header" slot="header"></slot>
				${this._renderTabs()}

				<router-slot .routes="${this._routes}"></router-slot>
				<slot></slot>

				<slot name="footer" slot="footer"></slot>
				<umb-extension-slot
					slot="actions"
					type="workspaceAction"
					.filter=${(extension: any) => extension.meta.workspaces.includes(this.alias)}></umb-extension-slot>
				<slot name="actions" slot="actions"></slot>
			</umb-body-layout>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-entity': UmbWorkspaceEntity;
	}
}
