import { LiteElement, customElement, html, css, property, map } from '@vandeurenglenn/lite'
import type { StyleList } from '@vandeurenglenn/lite/element'
import '@vandeurenglenn/flex-elements/display.js'
import '@vandeurenglenn/flex-elements/it.js'
import '@vandeurenglenn/lite-elements/button.js'
import '@vandeurenglenn/lite-elements/toggle-button.js'
import { posixify } from '../../../utils/posixify.js'
import './../../animations/busy.js'

@customElement('remove-empty-folders-view')
export class RemoveEmptyFoldersView extends LiteElement {
  @property({ type: Array }) accessor directories: string[]
  @property({ type: Array }) accessor emptyDirs: string[]
  @property({ type: Boolean }) accessor busy

  static styles?: StyleList = [
    css`
      :host {
        display: flex;
        flex-direction: column;

        align-items: center;
        overflow-y: auto;
      }

      .container {
        max-width: 1200px;
        width: 100%;
        padding: 24px;
        box-sizing: border-box;
        height: 100%;
        background: var(--md-sys-color-surface-container-highest);
        color: var(--md-sys-color-surface-on-container-highest);
        overflow-y: auto;
      }

      .directory-container {
        box-sizing: border-box;
        margin: 24px 0px;
        padding: 12px;
      }

      .dir {
        display: flex;
        flex-direction: row;
        padding: 12px 24px;
        box-sizing: border-box;
        border-bottom: var(--md-sys-color-outline);
        width: 100%;
      }
      .actions {
        max-width: 1200px;
      }
    `
  ]

  async _showDirectoryPicker() {
    const dir = await api.selectFolder()
    if (dir) {
      if (!this.directories) this.directories = [posixify(dir)]
      else {
        this.directories.push(posixify(dir))
      }

      this.requestRender()
    }

    // const [fileHandle] = await window.showOpenFilePicker();
    // const file = await fileHandle.getFile();
    // return file;
  }

  _clear() {
    this.directories = []
    this.emptyDirs = []
  }

  async _scan() {
    this.busy = true
    const emptyDirs = await api.execTask({ task: 'get-empty-dirs', input: this.directories })
    this.busy = false

    this.emptyDirs = emptyDirs
    this.requestRender()
  }

  async _remove() {
    this.busy = true
    const emptyDirs = await api.execTask({ task: 'remove-empty-dirs', input: this.emptyDirs })
    this.busy = false

    for (const dir of emptyDirs) {
      this.emptyDirs.splice(this.emptyDirs.indexOf(dir), 1)
    }
    if (this.emptyDirs.length === 0) {
      this.directories = []
    }
    this.requestRender()
  }

  render() {
    return this.busy
      ? html`<h3>${this.emptyDirs?.length > 0 ? html`Removing` : html`Scanning`}</h3>
          <busy-animation></busy-animation>`
      : html`
          <flex-display
            direction="column"
            class="container">
            <flex-display
              direction="column"
              class="directory-container">
              ${this.emptyDirs?.length > 0
                ? map(
                    this.emptyDirs,
                    dir =>
                      html`<span class="dir"
                        >${dir} <flex-it></flex-it>
                        <custom-toggle-button togglers='["check_box", "check_box_unchecked"]'></custom-toggle-button
                      ></span>`
                  )
                : map(this.directories, dir => html`<span class="dir">${dir}</span>`)}
            </flex-display>
          </flex-display>
          <flex-it></flex-it>
          <flex-display
            direction="row"
            class="actions">
            ${this.emptyDirs?.length > 0
              ? html`
                  <custom-button
                    @click=${this._clear.bind(this)}
                    label="clear">
                    <custom-icon
                      icon="cancel"
                      slot="icon"></custom-icon>
                  </custom-button>
                  <flex-it></flex-it>
                  <custom-button
                    @click=${this._remove.bind(this)}
                    label="remove">
                    <custom-icon
                      icon="delete"
                      slot="icon"></custom-icon>
                  </custom-button>
                `
              : html`
                  <custom-button
                    @click=${this._showDirectoryPicker.bind(this)}
                    label="add directory">
                    <custom-icon
                      icon="add"
                      slot="icon"></custom-icon>
                  </custom-button>
                  <flex-it></flex-it>
                  <custom-button
                    @click=${this._scan.bind(this)}
                    label="scan">
                    <custom-icon
                      icon="travel_explore"
                      slot="icon"></custom-icon>
                  </custom-button>
                `}
          </flex-display>
        `
  }
}
