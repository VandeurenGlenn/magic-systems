import { LiteElement, customElement, html, css, property, query } from '@vandeurenglenn/lite'
import { StyleList } from '@vandeurenglenn/lite/element'
import '@vandeurenglenn/flex-elements/container.js'

@customElement('clean-view')
export class CleanView extends LiteElement {
  @query('custom-pages') accessor pages

  select(selected) {
    this.pages.select(selected)
  }

  static styles?: StyleList = [
    css`
      :host {
        display: flex;
        flex-direction: column;

        align-items: center;
        overflow-y: auto;
      }

      .container {
        max-width: 1470px;
        width: 100%;
        padding: 24px;
        box-sizing: border-box;
      }
    `
  ]

  render() {
    return html`
      <custom-pages attr-for-selected="data-route">
        <remove-empty-folders-view data-route="remove-empty-folders"></remove-empty-folders-view>
      </custom-pages>
    `
  }
}
