const { exec } = require('child_process')

/**
 * 查询注册表项的值
 * @param {string} path 注册表路径
 * @param {string} valueName 要查询的项的名称
 * @returns {Promise<string|null>} 返回一个Promise，解析为项的值或null（如果未找到）
 */
function queryRegistryValue(path, valueName) {
  return new Promise((resolve, reject) => {
    const command = `reg query "${path}" /v ${valueName}`

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`执行命令出错: ${error}`))
      } else if (stderr) {
        reject(new Error(`命令输出错误: ${stderr}`))
      } else {
        const regex = new RegExp(`${valueName}\\s+REG_SZ\\s+(.+)`, 'i')
        const match = stdout.match(regex)

        if (match) {
          resolve(match[1].trim())
        } else {
          resolve('未找到值') // 修改为更清晰的错误信息
        }
      }
    })
  })
}

export async function queryjx3path() {
  try {
    const path = await queryRegistryValue(
      'HKLM\\SOFTWARE\\Kingsoft\\SeasunGame\\JX3',
      'InstallPath'
    )
    return { code: 1, msg: path }
  } catch (error) {
    return { code: 0, msg: error }
  }
}
