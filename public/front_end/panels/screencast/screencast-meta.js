import * as o from '../../core/common/common.js'
import * as e from '../../ui/legacy/legacy.js'
import { ScreencastApp } from './screencast.js'

e.Toolbar.registerToolbarItem({
  loadItem: async () => ScreencastApp.ToolbarButtonProvider.instance(),
  order: 1,
  location: e.Toolbar.ToolbarItemLocation.MAIN_TOOLBAR_LEFT,
  showLabel: void 0,
  condition: void 0,
  separator: void 0,
  actionId: void 0,
})
o.AppProvider.registerAppProvider({
  loadAppProvider: async () => ScreencastApp.ScreencastAppProvider.instance(),
  order: 1,
  condition: void 0,
})
e.ContextMenu.registerItem({
  location: e.ContextMenu.ItemLocation.MAIN_MENU,
  order: 10,
  actionId: 'components.request-app-banner',
})
