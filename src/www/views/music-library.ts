import { LiteElement, customElement, html, css, property, query } from '@vandeurenglenn/lite'
import { LibraryTrack } from '../../types/library.js'
import { StyleList } from '@vandeurenglenn/lite/element'
import '@vandeurenglenn/flex-elements/container.js'

@customElement('music-library-view')
export class MusicLibraryView extends LiteElement {
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
        <music-library-songs-view data-route="music-library-songs"></music-library-songs-view>
        <music-library-recents-view data-route="music-library-recents"></music-library-recents-view>
        <music-library-playlists-view data-route="music-library-playlists"></music-library-playlists-view>

        <music-library-albums-view data-route="music-library-albums"></music-library-albums-view>
        <music-library-artists-view data-route="music-library-artists"></music-library-artists-view>
      </custom-pages>
    `
  }
}
