import { html, customElement, property, css, state, repeat } from '@umbraco-cms/backoffice/external/lit';
import { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/extension-registry';
import { UmbLitElement } from '@umbraco-cms/internal/lit-element';
import type { UmbPropertyEditorConfigCollection } from '@umbraco-cms/backoffice/property-editor';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';

type BlockGridColumn = {
	columnSpan: number;
};

@customElement('umb-property-editor-ui-block-grid-column-span')
export class UmbPropertyEditorUIBlockGridColumnSpanElement extends UmbLitElement implements UmbPropertyEditorUiElement {
	@property({ type: Array })
	value: Array<BlockGridColumn> = [];

	@state()
	private _columnsArray = Array.from(Array(12).keys());

	@property({ attribute: false })
	public set config(config: UmbPropertyEditorConfigCollection | undefined) {
		const maxColumns = config?.getValueByAlias('maxColumns');
		if (typeof maxColumns === 'number') {
			this._columnsArray = Array.from(Array(maxColumns).keys());
		}
	}

	#pickColumn(index: number) {
		const value = this.value ?? [];
		const exists = value.find((column) => column.columnSpan === index);

		if (exists) {
			this.value = value.filter((column) => column.columnSpan !== index);
		} else {
			this.value = [...value, { columnSpan: index }];
		}

		this.dispatchEvent(new CustomEvent('property-value-change'));
	}

	render() {
		const template = repeat(
			this._columnsArray,
			(index) => index,
			(index) => {
				const number = index + 1;
				let classes = 'default';

				if (this.value && this.value.length > 0) {
					const applied = this.value.find((column) => column.columnSpan >= index);
					const picked = this.value.find((column) => column.columnSpan === index);
					classes = picked ? 'picked applied' : applied ? 'applied' : 'default';
				}

				return html`<div class="${classes}" data-index=${index}>
					<span>${number}</span>
					<button type="button" aria-label=${number} @click=${() => this.#pickColumn(index)}></button>
				</div>`;
			},
		);

		return html`<div id="wrapper">${template}</div>`;
	}

	static styles = [
		UmbTextStyles,
		css`
			#wrapper {
				box-sizing: border-box;
				display: flex;
				flex-wrap: nowrap;
				border: 1px solid var(--uui-color-divider-emphasis);
			}

			#wrapper div {
				color: var(--uui-color-divider-emphasis);
				position: relative;
				flex-grow: 1;
				min-height: 35px;
				box-sizing: border-box;
				display: flex;
				justify-content: flex-end;
				padding-left: 5px;
				border-right: 1px solid transparent;
			}

			#wrapper div:not(.picked) {
				border-right: 1px solid var(--uui-color-divider-standalone);
			}

			#wrapper div.picked,
			#wrapper div:has(button:hover) {
				color: var(--uui-color-interactive);
			}

			#wrapper div:last-child {
				border-right: 1px solid transparent;
			}

			#wrapper:has(button:hover) div:not(:has(button:hover) ~ div) {
				background-color: var(--uui-color-interactive-emphasis);
			}

			#wrapper div span {
				user-select: none;
				position: absolute;
				padding: var(--uui-size-6);
				transform: translate(50%, -75%);
			}

			#wrapper div button {
				border: none;
				position: absolute;
				z-index: 1;
				transform: translateX(50%);
				inset: -1px;
				opacity: 0;
			}

			#wrapper .picked::after {
				content: '';
				position: absolute;
				transform: translateX(50%);
				width: 4px;
				border-right: 1px solid var(--uui-color-interactive);
				background-color: var(--uui-color-surface);
				top: 0;
				right: 0;
				bottom: 0;
			}

			#wrapper .applied {
				background-color: var(--uui-color-interactive);
			}
		`,
	];
}

export default UmbPropertyEditorUIBlockGridColumnSpanElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-block-grid-column-span': UmbPropertyEditorUIBlockGridColumnSpanElement;
	}
}
