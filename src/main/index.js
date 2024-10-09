import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { get_jx3_user } from './tools/jx3_find_user'
import {
  get_backup_config,
  get_config,
  get_json,
  put_config,
  put_json
} from './tools/read_write_config'
import { add_jx3_user_data, put_jx3_user_data } from './tools/file_crypto'
import { delete_jx3_userdata, search_jx3_userdata } from './tools/jx3_bak_manager'
import { queryjx3path } from './tools/jx3_find_reg_path'
import { ff14_shengchan_script } from './tools/ff14_auto_shengchan'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 630,
    frame: false,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  // IPC Handle
  // 退出程序
  ipcMain.on('close_windows', function () {
    app.quit()
  })
  // 最小化
  ipcMain.on('minimize_windows', function () {
    mainWindow.minimize()
  })
  // 切换置顶
  ipcMain.handle('toggle_on_top', async () => {
    const currentState = mainWindow.isAlwaysOnTop()
    mainWindow.setAlwaysOnTop(!currentState)
    return !currentState // 返回新的置顶状态
  })
  // 取消置顶
  ipcMain.handle('cancel_on_top', async () => {
    if (mainWindow.isAlwaysOnTop()) {
      mainWindow.setAlwaysOnTop(false)
    }
  })
  //查询jx3角色数据
  ipcMain.handle('find_jx3_user', async () => {
    const path = await get_config()
    return await get_jx3_user(path.jx3_path)
  })
  //添加jx3角色信息
  ipcMain.handle('add_jx3_user_data', async (event, arg) => {
    return add_jx3_user_data(arg.src_path, arg.bak_path, arg.file_name)
  })
  //使用备份的jx3角色信息
  ipcMain.handle('use_jx3_user_data', async (event, arg) => {
    const path = await get_config()
    const encryptedFile = path.jx3_backup_path + '\\' + arg.folder + '\\' + arg.name
    return put_jx3_user_data(encryptedFile, arg.dir)
  })
  //备份jx3角色信息
  ipcMain.handle('search_jx3_user_data', async (event, arg) => {
    return search_jx3_userdata(arg.dir, arg.keywords)
  })
  //删除角色信息备份
  ipcMain.handle('delete_jx3_user_data', async (event, arg) => {
    return delete_jx3_userdata(arg.dir, arg.file_name)
  })
  //查询jx3角色数据记录
  ipcMain.handle('read_jx3_user_backup', async (event, arg) => {
    return get_backup_config(arg.username)
  })
  //寻找jx3安装目录
  ipcMain.handle('query_jx3_path', async () => {
    return await queryjx3path()
  })
  //FF14自动生产
  ipcMain.handle('ff14_auto_shengchan', async () => {
    return ff14_shengchan_script()
  })

  //获取config
  ipcMain.handle('get_config', async function () {
    return await get_config()
  })
  //上传config
  ipcMain.handle('put_config', async (event, arg) => {
    return put_config(arg)
  })
  //获取json
  ipcMain.handle('get_json', async (event, arg) => {
    return await get_json(arg.name)
  })
  //上传json
  ipcMain.handle('put_json', async (event, arg) => {
    return put_json(arg.json, arg.name)
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
