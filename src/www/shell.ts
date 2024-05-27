import '@vandeurenglenn/lite-elements/theme.js'
import '@vandeurenglenn/lite-elements/pages.js'
import '@vandeurenglenn/lite-elements/selector.js'
import icons from './icons.js'
import '@vandeurenglenn/lite-elements/icon-button.js'
import '@vandeurenglenn/lite-elements/drawer-item.js'
import '@vandeurenglenn/lite-elements/toggle-button.js'
import '@vandeurenglenn/flex-elements/it.js'

// @ts-ignore
import style from './shell.css' assert { type: 'css' }
import { LiteElement, property, html, query } from '@vandeurenglenn/lite'

class JouleyShell extends LiteElement {
  static styles = [style]

  @property({ type: Boolean, reflect: true, attribute: 'drawer-open' })
  accessor drawerOpen: boolean = false

  @property() accessor selected

  @query('custom-pages')
  accessor _pages

  @query('custom-pages .custom-selected')
  accessor _selectedView

  async _selected({ detail }) {
    this.selected = detail
    if (!customElements.get(`${detail}-view`)) await import(`./${detail}.js`)
    this._pages.select(detail)
  }

  async _subRouteSelected({ detail }) {
    if (!customElements.get(`${detail}-view`)) await import(`./${detail}.js`)
    console.log(this._selectedView)

    this._selectedView.select(detail)
  }

  _renderCleanSubRail() {
    return html`
      <custom-drawer-item route="remove-empty-folders">
        <custom-icon icon="folder"></custom-icon>
        <flex-it></flex-it>
        <custom-typography size="medium">remove empty folders</custom-typography>
      </custom-drawer-item>

      <custom-drawer-item route="remove-empty-files">
        <custom-icon icon="draft"></custom-icon>
        <flex-it></flex-it>
        <custom-typography size="medium">remove empty files</custom-typography>
      </custom-drawer-item>
    `
  }

  _renderAutomateSubRail() {
    return html`
      <custom-drawer-item route="auto-move">
        <custom-icon icon="move"></custom-icon>
        <flex-it></flex-it>
        <custom-typography size="medium">move</custom-typography>
      </custom-drawer-item>

      <custom-drawer-item route="auto-remove">
        <custom-icon icon="delete"></custom-icon>
        <flex-it></flex-it>
        <custom-typography size="medium">remove</custom-typography>
      </custom-drawer-item>
    `
  }

  _switchSubRail() {
    switch (this.selected) {
      case 'clean':
        return this._renderCleanSubRail()
      case 'automate':
        return this._renderAutomateSubRail()
      case 'optimize':
        return this._renderOptimizeSubRail()
      default:
        return ''
    }
  }

  render() {
    return html`
      ${icons}
      <custom-theme load-symbols="false"></custom-theme>
      <aside>
        <custom-selector class="rail" attr-for-selected="route" @selected=${this._selected.bind(this)}>
          <custom-drawer-item route="clean">
            <custom-icon icon="mop"></custom-icon>
            <flex-it></flex-it>
            <custom-typography size="medium">clean</custom-typography>
          </custom-drawer-item>

          <custom-drawer-item route="automate">
            <custom-icon icon="event_repeat"></custom-icon>
            <flex-it></flex-it>
            <custom-typography size="medium">automate</custom-typography>
          </custom-drawer-item>

          <flex-it></flex-it>

          <custom-drawer-item route="settings">
            <custom-icon icon="settings"></custom-icon>
            <flex-it></flex-it>
            <custom-typography size="medium">settings</custom-typography>
          </custom-drawer-item>
        </custom-selector>

        <custom-selector attr-for-selected="route" @selected=${this._subRouteSelected.bind(this)}>
          <!--<custom-drawer-item route="music-library-dashboard">
            <custom-icon icon="dashboard"></custom-icon>
            <flex-it></flex-it>
            <custom-typography size="medium">dashboard</custom-typography>
          </custom-drawer-item>-->

          ${this._switchSubRail()}
        </custom-selector>
      </aside>
      <main>
        <header>
          <custom-toggle-button
            @click=${() => (this.drawerOpen = !this.drawerOpen)}
            .togglers=${['menu', 'menu_open']}
          ></custom-toggle-button>
          <search-component></search-component>
          <notification-component></notification-component>
        </header>
        <custom-pages attr-for-selected="route">
          <settings-view route="settings"></settings-view>
          <clean-view route="clean"></clean-view>
        </custom-pages>
      </main>
    `
  }
}

customElements.define('jouley-shell', JouleyShell)
