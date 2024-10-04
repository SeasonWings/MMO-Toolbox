const fs = require('fs').promises
const path = require('path')

async function traverseDir(dir, targetText) {
  let results = []
  try {
    const files = await fs.readdir(dir, { withFileTypes: true })
    for (const dirent of files) {
      const filePath = path.join(dir, dirent.name)
      if (
        dirent.isFile() &&
        dirent.name.includes(targetText) &&
        path.extname(dirent.name) === '.jx3bak'
      ) {
        // 如果是文件且满足条件，则添加到结果列表中
        results.push(path.basename(filePath))
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err)
  }
  return results
}

/**
 * 删除指定文件夹中所有指定名字的文件
 * @param {string} dirPath 文件夹路径
 * @param {string} fileName 要删除的文件名（包括扩展名）
 */
async function deleteFilesByName(dirPath, fileName) {
  try {
    const files = await fs.readdir(dirPath)
    for (const file of files) {
      const filePath = path.join(dirPath, file)
      if (file === fileName) {
        await fs.unlink(filePath)
        console.log(`文件 ${filePath} 已删除`)
      }
    }
  } catch (err) {
    console.error('操作出错:', err)
  }
}

export async function search_jx3_userdata(dir, keywords) {
  try {
    return { code: 1, msg: await traverseDir(dir, keywords) }
  } catch (err) {
    return { code: 0, msg: '查询角色已有设置存档出现错误！错误内容：' + err }
  }
}
export async function delete_jx3_userdata(dir, fileName) {
  try {
    await deleteFilesByName(dir, fileName)
    return { code: 1, msg: 'success' }
  } catch (err) {
    return { code: 0, msg: err }
  }
}

// const dir = 'D:\\test\\c\\曲冷冷@眉间雪';
// const keywords = '曲冷冷@眉间雪';
// const res = traverseDir(dir, keywords)

// const dirPath = 'D:\\test\\c\\心间月@剑胆琴心';
// const fileName = '心间月@剑胆琴心_20240818021608.jx3bak';
// deleteFilesByName(dirPath, fileName);
