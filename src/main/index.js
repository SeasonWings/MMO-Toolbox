import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { get_jx3_user } from './tools/find_jx3_user'
import { get_backup_config, get_config, put_config } from './tools/read_write_config'
import { add_jx3_user_data, put_jx3_user_data } from './tools/file_crypto'
import { delete_jx3_userdata, search_jx3_userdata } from './tools/jx3bak_manager'

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
  //查询jx3角色数据
  ipcMain.handle('find_jx3_user', async () => {
    const path = await get_config()
    return await get_jx3_user(path.jx3_path)
  })
  //备份角色信息
  ipcMain.handle('add_jx3_user_data', async (event, arg) => {
    return add_jx3_user_data(arg.src_path, arg.bak_path, arg.file_name)
  })
  //使用备份的角色信息
  ipcMain.handle('use_jx3_user_data', async (event, arg) => {
    const path = await get_config()
    const encryptedFile = path.jx3_backup_path + '\\' + arg.folder + '\\' + arg.name
    return put_jx3_user_data(encryptedFile, arg.dir)
  })
  //备份角色信息
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
  //获取config
  ipcMain.handle('get_config', async function () {
    return await get_config()
  })
  //上传config
  ipcMain.handle('put_config', async (event, arg) => {
    return put_config(arg)
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
