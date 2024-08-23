const fs = require('fs')
const tar = require('tar-fs')
const crypto = require('crypto')
const path = require('path')
const rimraf = require('rimraf');

/**
 * 打包并加密文件夹
 * @param {string} sourceDir 源文件夹路径
 * @param {string} outputDir 目标文件夹路径（用于保存加密后的文件）
 * @param {string} outputFilename 输出文件名（包括扩展名，如'output.bak'）
 */
function packAndEncryptFolder(sourceDir, outputDir, outputFilename) {
  const outputFile = path.join(outputDir, outputFilename)

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 创建一个加密的写入流
  const cipher = crypto.createCipher('aes-256-cbc', 'Bee~Bee~HoneyBee Lovely~')
  const outputStream = fs.createWriteStream(outputFile)

  // 打包并加密
  tar
    .pack(sourceDir, { gzip: false }) // 注意：这里不使用gzip压缩
    .pipe(cipher) // 将tar流通过加密流
    .pipe(outputStream) // 将加密后的数据写入文件
    .on('finish', () => {
      console.log(`打包并加密完成，文件已保存到 ${outputFile}`)
    })
    .on('error', (err) => {
      console.error(`打包并加密过程中发生错误: ${err.message}`)
    })
}

/**
 * 解密并解压文件到指定文件夹
 * @param {string} encryptedFilePath 加密文件的路径
 * @param {string} targetDir 目标文件夹路径（用于保存解密后的文件）
 */
function decryptAndExtractFile(encryptedFilePath, targetDir) {
  // 确保目标目录存在
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true })
  }

  // 创建一个解密的读取流
  const decipher = crypto.createDecipher('aes-256-cbc', 'Bee~Bee~HoneyBee Lovely~')
  const inputStream = fs.createReadStream(encryptedFilePath)

  // 解密并解压
  inputStream
    .pipe(decipher) // 解密流
    .pipe(tar.extract(targetDir)) // 解压到目标目录
    .on('finish', () => {
      console.log(`解密并解压完成，内容已保存到 ${targetDir}`)
    })
    .on('error', (err) => {
      console.error(`解密或解压过程中发生错误: ${err.message}`)
    })
}

export function add_jx3_user_data(sourceFolder, targetFolder, outputFile) {
  try {
    packAndEncryptFolder(sourceFolder, targetFolder, outputFile)
    return { code: 1, msg: '生成该角色的键位配置文件成功！' }
  } catch (err) {
    return { code: 0, msg: '生成该角色的键位配置文件失败！错误信息：' + err }
  }
}
export function put_jx3_user_data(encryptedFile, encryptFolder) {
  try {
    rimraf.sync(encryptFolder);
    decryptAndExtractFile(encryptedFile, encryptFolder)
    return { code: 1, msg: 'success' }
  } catch (err) {
    return { code: 0, msg: '生成该角色的键位配置文件失败！错误信息：' + err }
  }
}


