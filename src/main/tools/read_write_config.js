const fs = require('fs')
const path = require('path')
let initialConfig

const configFilePath = path.join('config')
/**
 * 读取 config.json 文件并返回其内容
 * @returns {Promise<Object>} 返回一个 Promise，解析为 JSON 对象
 */
async function readConfig() {
  try {
    const data = await fs.promises.readFile(configFilePath + '\\config.json', 'utf8')
    const config = JSON.parse(data)
    return config
  } catch (err) {
    console.log(err.code)
    if (err.code === 'ENOENT') {
      // eslint-disable-next-line no-useless-catch
      try {
        // 写入新文件
        await fs.mkdir(configFilePath, { recursive: true }, (err) => {
          throw err
        })
        initialConfig = {
          jx3_path: '',
          jx3_backup_path: ''
        }
        await fs.writeFile(
          configFilePath + '/config.json',
          JSON.stringify(initialConfig, null, 2),
          'utf-8',
          (err) => {
            throw err
          }
        )
        return initialConfig // 返回初始配置对象
      } catch (writeErr) {
        throw writeErr // 重新抛出错误，以便调用者可以处理
      }
    }
  }
}
/**
 * 写入数据到 config.json 文件
 * @param {Object} configObject 要写入的数据对象
 * @returns {Promise<void>} 返回一个 Promise，表示写入操作完成
 */
function writeConfig(configObject) {
  return new Promise((resolve, reject) => {
    const configString = JSON.stringify(configObject, null, 2) // 转换为字符串，并美化格式
    fs.writeFile(configFilePath + '\\config.json', configString, 'utf8', (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

/**
 * 读取 backup_config.json 文件并返回其内容
 * @returns {Promise<Object>} 返回一个 Promise，解析为 JSON 对象
 */
async function readbackuprConfig(userdata) {
  let backup_config = {}
  userdata.forEach((item) => {
    backup_config[item] = ''
  })
  try {
    const data = await fs.promises.readFile(configFilePath + '\\backup_config.json', 'utf8')
    const config = JSON.parse(data)
    return config
  } catch (err) {
    console.log(err.code)
    if (err.code === 'ENOENT') {
      // eslint-disable-next-line no-useless-catch
      try {
        // 写入新文件
        await fs.mkdir(configFilePath, { recursive: true }, (err) => {
          throw err
        })
        await fs.writeFile(
          configFilePath + '/backup_config.json',
          JSON.stringify(backup_config, null, 2),
          'utf-8',
          (err) => {
            throw err
          }
        )
        return backup_config // 返回初始配置对象
      } catch (writeErr) {
        throw writeErr // 重新抛出错误，以便调用者可以处理
      }
    }
  }
}


async function readJson(name) {
  try {
    const data = await fs.promises.readFile(configFilePath + '\\' + name, 'utf8')
    const config = JSON.parse(data)
    return config
  } catch (err) {
    console.log(err.code)
    if (err.code === 'ENOENT') {
      // eslint-disable-next-line no-useless-catch
      try {
        // 写入新文件
        await fs.mkdir(configFilePath, { recursive: true }, (err) => {
          throw err
        })
        if (name === 'ff14_shengchan.json') {
          initialConfig = {
            Marco: [],
            EntryKey: {
              key: '',
              keyCode: ''
            },
            runningDelay: 0,
            loop: 0
          }
        }else {
          initialConfig = {
            jx3_path: '',
            jx3_backup_path: ''
          }
        }
        await fs.writeFile(
          configFilePath + '/' + name,
          JSON.stringify(initialConfig, null, 2),
          'utf-8',
          (err) => {
            throw err
          }
        )
        return initialConfig // 返回初始配置对象
      } catch (writeErr) {
        throw writeErr // 重新抛出错误，以便调用者可以处理
      }
    }
  }
}
/**
 * 写入数据到 config.json 文件
 * @param {Object} configObject 要写入的数据对象
 * @returns {Promise<void>} 返回一个 Promise，表示写入操作完成
 */
function writeJson(configObject, name) {
  return new Promise((resolve, reject) => {
    const configString = JSON.stringify(configObject, null, 2) // 转换为字符串，并美化格式
    fs.writeFile(configFilePath + '\\' + name, configString, 'utf8', (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function get_config() {
  return readConfig()
}
export function put_config(newConfig) {
  writeConfig(newConfig)
    .then(() => {
      console.log('配置已写入')
    })
    .catch((err) => {
      console.error('写入配置时出错:', err)
    })
}
export function get_backup_config(userdata) {
  return readbackuprConfig(userdata)
}

export function get_json(name) {
  return readJson(name)
}
export function put_json(newConfig, name) {
  writeJson(newConfig, name)
    .then(() => {
      console.log('配置已写入')
    })
    .catch((err) => {
      console.error('写入配置时出错:', err)
    })
}
