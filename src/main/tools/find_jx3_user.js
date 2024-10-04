const fs = require('fs').promises // 使用fs的promises API
const path = require('path')

// 异步递归函数来遍历目录
async function traverseDir(dir) {
  let userdicts = []
  // eslint-disable-next-line no-useless-catch
  try {
    const files = await fs.readdir(dir)
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = await fs.stat(filePath)

      if (stat.isDirectory()) {
        if (checkPathMatchesPattern(filePath)) {
          let parts = path.dirname(filePath).split('\\')
          let Area = [parts[parts.length - 2], parts[parts.length - 1]]

          const userdict = {
            username: path.basename(filePath),
            dir: path.dirname(filePath) + '\\' + path.basename(filePath),
            area: Area
          }
          userdicts.push(userdict)
        }
        // 递归遍历子目录
        const subDirUserdicts = await traverseDir(filePath)
        userdicts = [...userdicts, ...subDirUserdicts]
      }
    }
  } catch (err) {
    throw err
  }

  return userdicts
}

// 检查路径是否符合模式
function checkPathMatchesPattern(filePath) {
  const pattern = /\\Game\\JX3\\bin\\zhcn_hd\\userdata\\[^\\]+\\.{2}区\\[^\\]+\\([^\\]+)$/
  return pattern.test(filePath)
}

export async function get_jx3_user(path) {
  try {
    return { code: 1, msg: await traverseDir(path) }
  } catch (err) {
    return { code: 0, msg: '错误：' + err }
  }
}
