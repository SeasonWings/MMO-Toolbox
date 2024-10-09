const fs = require('fs')
const path = require('path')
const configFilePath = path.join('config')
const { keyboard } = require('@nut-tree/nut-js')

// FUCK U SBJS
const KeyCodeTable = {
  32: 'Space_0',
  27: 'Escape_1',
  9: 'Tab_2',
  164: 'LeftAlt_3',
  162: 'LeftControl_4',
  165: 'RightAlt_5',
  163: 'RightControl_6',
  160: 'LeftShift_7',
  161: 'RightShift_9',
  112: 'F1_11',
  113: 'F2_12',
  114: 'F3_13',
  115: 'F4_14',
  116: 'F5_15',
  117: 'F6_16',
  118: 'F7_17',
  119: 'F8_18',
  120: 'F9_19',
  121: 'F10_20',
  122: 'F11_21',
  123: 'F12_22',
  48: 'Num0_35',
  49: 'Num1_36',
  50: 'Num2_37',
  51: 'Num3_38',
  52: 'Num4_39',
  53: 'Num5_40',
  54: 'Num6_41',
  55: 'Num7_42',
  56: 'Num8_43',
  57: 'Num9_44',
  65: 'A_45',
  66: 'B_46',
  67: 'C_47',
  68: 'D_48',
  69: 'E_49',
  70: 'F_50',
  71: 'G_51',
  72: 'H_52',
  73: 'I_53',
  74: 'J_54',
  75: 'K_55',
  76: 'L_56',
  77: 'M_57',
  78: 'N_58',
  79: 'O_59',
  80: 'P_60',
  81: 'Q_61',
  82: 'R_62',
  83: 'S_63',
  84: 'T_64',
  85: 'U_65',
  86: 'V_66',
  87: 'W_67',
  88: 'X_68',
  89: 'Y_69',
  90: 'Z_70',
  8: 'Backspace_74',
  37: 'Left_84',
  38: 'Up_85',
  39: 'Right_86',
  40: 'Down_87',
  13: 'Enter_101',
  96: 'NumPad0_102',
  97: 'NumPad1_103',
  98: 'NumPad2_104',
  99: 'NumPad3_105',
  100: 'NumPad4_106',
  101: 'NumPad5_107',
  102: 'NumPad6_108',
  103: 'NumPad7_109',
  104: 'NumPad8_110',
  106: 'NumPad9_111',
  20: 'CapsLock_112'
}

function VK_to_FuckCode(VK) {
  return Number(KeyCodeTable[VK].split('_')[1])
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function press_keyboard() {
  try {
    const data = await fs.promises.readFile(configFilePath + '\\ff14_shengchan.json', 'utf8')
    const config = JSON.parse(data)

    for (let i = 0; i < 4; i++) {
      await keyboard.pressKey(VK_to_FuckCode(config.EntryKey.keyCode))
      await keyboard.releaseKey(VK_to_FuckCode(config.EntryKey.keyCode))
      await delay(400)
    }
    for (let item of config.Marco) {
      await delay(config.runningDelay * 1000)
      await keyboard.pressKey(VK_to_FuckCode(item.keyCode))
      await keyboard.releaseKey(VK_to_FuckCode(item.keyCode))
      await delay(item.MarcoDelay * 1000)
    }

    await delay(config.runningDelay * 1000)

    return { code: 1, msg: 'success' }
  } catch (err) {
    return { code: 0, msg: err }
  }
}

export function ff14_shengchan_script() {
  return press_keyboard()
}
