import {
  _keyMapDefaults,
  _actionMap,
  _keyMap,
  _chordMaps,
  _chordLayout,
  actionMap,
  oldAsciiKeyReplacementDictionary,
} from '../controls/maps';
import hex2Bin from 'hex-to-bin';
import { replace, split, toUpper } from 'lodash';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

export class MainControls {
  public static serialPort: any;
  public static portReader: any;
  public static lineReader: any;
  public static lineReaderDone: any;
  public static abortController1 = new AbortController();
  public static abortController2 = new AbortController();
  // public static decoder = new TextDecoderStream();
  public static _chordmapId: any = 'Default';
  public static _chordmapCountOnDevice: any = 50;
  public static _firmwareVersion: any = '0';
  public static _chordMapIdCounter = 0;
  public static count = 0;

  public static CONFIG_ID_ENABLE_SERIAL_LOG = '01';
  public static CONFIG_ID_ENABLE_SERIAL_RAW = '02';
  public static CONFIG_ID_ENABLE_SERIAL_CHORD = '03';
  public static CONFIG_ID_ENABLE_SERIAL_KEYBOARD = '04';
  public static CONFIG_ID_ENABLE_SERIAL_MOUSE = '05';
  public static CONFIG_ID_ENABLE_SERIAL_DEBUG = '06';
  public static CONFIG_ID_ENABLE_SERIAL_HEADER = '07';
  public static CONFIG_ID_ENABLE_HID_KEYBOARD = '0A';
  public static CONFIG_ID_PRESS_THRESHOLD = '0B';
  public static CONFIG_ID_RELEASE_THRESHOLD = '0C';
  public static CONFIG_ID_ENABLE_HID_MOUSE = '14';
  public static CONFIG_ID_SCROLL_DELAY = '15';
  public static CONFIG_ID_ENABLE_SPURRING = '1E';
  public static CONFIG_ID_SPUR_KILLER_TOGGLE = '1F';
  public static CONFIG_ID_SPUR_KILLER = '20';
  public static CONFIG_ID_ENABLE_CHORDING = '28';
  public static CONFIG_ID_CHAR_KILLER_TOGGLE = '29';
  public static CONFIG_ID_CHAR_COUNTER_KILLER = '2A';
}
const BaseLevelSpecialCharactersLibrary = {
  '2D': '-', //301, Keyboard - and _ (US English)
  '2E': '=', //302, Keyboard = and + (US English)
  '2F': '[', //303, Keyboard [ and { (US English)
  '30': ']', //304, Keyboard ] and } (US English)
  '31': "'", //305, Keyboard \ and | (US English)
  '32': '#', //306, Keyboard Non-US # and ~ (US English)
  '33': ';', //307, Keyboard ; and : (US English)
  '34': "'", //308, Keyboard ' and " (US English)
  '35': '`', //309, Keyboard ` and ~ (US English)
  '36': ',', //310, Keyboard , and < (US English)
  '37': '.', //311, Keyboard . and > (US English)
  '38': '/', //312, Keyboard / and ? (US English)
};

const ModifierCharactersLibrary = {
  KEY_1: '!', //286, Keyboard 1 and ! (US English)
  KEY_2: '@', //287, Keyboard 2 and @ (US English)
  KEY_3: '#', //288, Keyboard 3 and # (US English)
  KEY_4: '$', //289, Keyboard 4 and $ (US English)
  KEY_5: '%', //290, Keyboard 5 and % (US English)
  KEY_6: '^', //291, Keyboard 6 and ^ (US English)
  KEY_7: '&', //292, Keyboard 7 and & (US English)
  KEY_8: '*', //293, Keyboard 8 and * (US English)
  KEY_9: '(', //294, Keyboard 9 and ( (US English)
  KEY_0: ')', //295, Keyboard 0 and ) (US English)
  KSC_2C: 'Space', //300, Keyboard Space (US English)
  KSC_2D: '_', //301, Keyboard - and _ (US English)
  KSC_2E: '+', //302, Keyboard = and + (US English)
  KSC_2F: '{', //303, Keyboard [ and { (US English)
  KSC_30: '}', //304, Keyboard ] and } (US English)
  KSC_31: '|', //305, Keyboard \ and | (US English)
  KSC_32: '~', //306, Keyboard Non-US # and ~ (US English)
  KSC_33: ':', //307, Keyboard ; and : (US English)
  KSC_34: '"', //308, Keyboard ' and " (US English)
  KSC_35: '~', //309, Keyboard ` and ~ (US English)
  KSC_36: '<', //310, Keyboard , and < (US English)
  KSC_37: '>', //311, Keyboard . and > (US English)
  KSC_38: '?', //312, Keyboard / and ? (US English)
};

const ReverseModifierCharactersLibrary = {
  '!': 286,
  '@': 287,
  '#': 288,
  $: 289,
  '%': 290,
  '^': 291,
  '&': 292,
  '*': 293,
  '(': 294,
  ')': 295,
  ' ': 300,
  _: 301,
  '-': 301,
  '+': 302,
  '=': 302,
  '{': 303,
  '[': 303,
  ']': 304,
  '}': 304,
  //"\'": 305,
  '|': 305,
  ':': 307,
  ';': 307,
  '"': 308,
  "'": 308,
  '~': 309,
  '`': 309,
  '<': 310,
  ',': 310,
  '>': 311,
  '.': 311,
  '?': 312,
};

const ReverseLookUpTable = {
  KSC_00: 256,
  KSC_01: 257,
  KSC_02: 258,
  KSC_03: 259,
  KEY_A: 260,
  KEY_B: 261,
  KEY_C: 262,
  KEY_D: 263,
  KEY_E: 264,
  KEY_F: 265,
  KEY_G: 266,
  KEY_H: 267,
  KEY_I: 268,
  KEY_J: 269,
  KEY_K: 270,
  KEY_L: 271,
  KEY_M: 272,
  KEY_N: 273,
  KEY_O: 274,
  KEY_P: 275,
  KEY_Q: 276,
  KEY_R: 277,
  KEY_S: 278,
  KEY_T: 279,
  KEY_U: 280,
  KEY_V: 281,
  KEY_W: 282,
  KEY_X: 283,
  KEY_Y: 284,
  KEY_Z: 285,
  KEY_1: 286,
  KEY_2: 287,
  KEY_3: 288,
  KEY_4: 289,
  KEY_5: 290,
  KEY_6: 291,
  KEY_7: 292,
  KEY_8: 293,
  KEY_9: 294,
  KEY_0: 295,
  ENTER: 296,
  ESC: 297,
  BKSP: 298,
  TAB: 299,
  ' ': 300,
  KSC_2D: 301,
  KSC_2E: 302,
  KSC_2F: 303,
  KSC_30: 304,
  KSC_31: 305,
  KSC_32: 306,
  KSC_33: 307,
  KSC_34: 308,
  KSC_35: 309,
  KSC_36: 310,
  KSC_37: 311,
  KSC_38: 312,
  CAPSLOCK: 313,
  F1: 314,
  F2: 315,
  LEFT_CTRL: 512,
  LEFT_SHIFT: 513,
  LEFT_ALT: 514,
  LEFT_GUI: 515,
  RIGHT_CTRL: 516,
  RIGHT_SHIFT: 517,
  RIGHT_ALT: 518,
  /*
  'F3', //316, Keyboard F3
  'F4', //317, Keyboard F4
  'F5', //318, Keyboard F5
  'F6', //319, Keyboard F6
  'F7', //320, Keyboard F7
  'F8', //321, Keyboard F8
  'F9', //322, Keyboard F9
  'F10', //323, Keyboard F10
  'F11', //324, Keyboard F11
  'F12', //325, Keyboard F12
  'PRTSCN', //326, Keyboard Print Screen
  'SCRLK', //327, Keyboard Scroll Lock
  'PAUSE', //328, Keyboard Pause
  'INSERT', //329, Keyboard Insert
  'HOME', //330, Keyboard Home
  'PGUP', //331, Keyboard Page Up
  'DELETE', //332, Keyboard Delete Forward
  'END', //333, Keyboard End
  'PGDN', //334, Keyboard Page Down
  'ARROW_RT', //335, Keyboard Right Arrow
  'ARROW_LF', //336, Keyboard Left Arrow
  'ARROW_DN', //337, Keyboard Down Arrow
  'ARROW_UP', //338, Keyboard Up Arrow
  'NUMLOCK', //339, Keyboard Num Lock and Clear
  'KP_SLASH', //340, Keypad /
  'KP_ASTER', //341, Keypad *
  'KP_MINUS', //342, Keypad -
  'KP_PLUS', //343, Keypad +
  'KP_ENTER', //344, Keypad Enter
  'KP_1', //345, Keypad 1 and End
  'KP_2', //346, Keypad 2 and Down Arrow
  'KP_3', //347, Keypad 3 and Page Down
  'KP_4', //348, Keypad 4 and Left Arrow
  'KP_5', //349, Keypad 5
  'KP_6', //350, Keypad 6 and Right Arrow
  'KP_7', //351, Keypad 7 and Home
  'KP_8', //352, Keypad 8 and Up Arrow
  'KP_9', //353, Keypad 9 and Page Up
  'KP_0', //354, Keypad 0 and Insert
  'KP_DOT', //355, Keypad . and Delete
  'KSC_64', //356, Keyboard Non-US \ and | (US English)
  'COMPOSE', //357, Keyboard Application
  'POWER', //358, Keyboard Power
  'KP_EQUAL', //359, Keypad =
  'F13', //360, Keyboard F13
  'F14', //361, Keyboard F14
  'F15', //362, Keyboard F15
  'F16', //363, Keyboard F16
  'F17', //364, Keyboard F17
  'F18', //365, Keyboard F18
  'F19', //366, Keyboard F19
  'F20', //367, Keyboard F20
  'F21', //368, Keyboard F21
  'F22', //369, Keyboard F22
  'F23', //370, Keyboard F23
  'F24', //371, Keyboard F24
  'EXECUTE', //372, Keyboard Execute
  'HELP', //373, Keyboard Help
  'MENU', //374, Keyboard Menu
  'SELECT', //375, Keyboard Select
  'STOP', //376, Keyboard Stop
  'AGAIN', //377, Keyboard Again
  'UNDO', //378, Keyboard Undo
  'CUT', //379, Keyboard Cut
  'COPY', //380, Keyboard Copy
  'PASTE', //381, Keyboard Paste
  'FIND', //382, Keyboard Find
  'MUTE', //383, Keyboard Mute
  'VOL_UP', //384, Keyboard Volume Up
  'VOL_DN', //385, Keyboard Volume Down
  'KSC_82', //386, Keyboard Locking Caps Lock
  'KSC_83', //387, Keyboard Locking Num Lock
  'KSC_84', //388, Keyboard Locking Scroll Lock
  'KP_COMMA', //389, Keypad Comma
  'KSC_86', //390, Keypad Equals Sign - intepret this
  'INTL1', //391, Keyboard International1
  'INTL2', //392, Keyboard International2
  'INTL3', //393, Keyboard International3
  'INTL4', //394, Keyboard International4
  'INTL5', //395, Keyboard International5
  'INTL6', //396, Keyboard International6
  'INTL7', //397, Keyboard International7
  'INTL8', //398, Keyboard International8
  'INTL9', //399, Keyboard International9
  'LANG1', //400, Keyboard LANG1
  'LANG2', //401, Keyboard LANG2
  'LANG3', //402, Keyboard LANG3
  'LANG4', //403, Keyboard LANG4
  'LANG5', //404, Keyboard LANG5
  'LANG6', //405, Keyboard LANG6
  'LANG7', //406, Keyboard LANG7
  'LANG8', //407, Keyboard LANG8
  'LANG9', //408, Keyboard LANG9
  'KSC_99', //409, Keyboard Alternate Erase
  'KSC_9A', //410, Keyboard SysReq/Attention
  'KSC_9B', //411, Keyboard Cancel
  'KSC_9C', //412, Keyboard Clear
  'KSC_9D', //413, Keyboard Prior
  'KSC_9E', //414, Keyboard Return
  'KSC_9F', //415, Keyboard Separator
  'KSC_A0', //416, Keyboard Out
  'KSC_A1', //417, Keyboard Oper
  'KSC_A2', //418, Keyboard Clear/Again
  'KSC_A3', //419, Keyboard CrSel/Props
  'KSC_A4', //420, Keyboard ExSel
  'KSC_A5', //421,
  'KSC_A6', //422,
  'KSC_A7', //423,
  'KSC_A8', //424,
  'KSC_A9', //425,
  'KSC_AA', //426,
  'KSC_AB', //427,
  'KSC_AC', //428,
  'KSC_AD', //429,
  'KSC_AE', //430,
  'KSC_AF', //431,
  'KSC_B0', //432, Keypad 00
  'KSC_B1', //433, Keypad 000
  'KSC_B2', //434, Thousands Separator
  'KSC_B3', //435, Decimal Separator
  'KSC_B4', //436, Currency Unit
  'KSC_B5', //437, Currency Sub-unit
  'KSC_B6', //438, Keypad (
  'KSC_B7', //439, Keypad )
  'KSC_B8', //440, Keypad {
  'KSC_B9', //441, Keypad }
  'KSC_BA', //442, Keypad Tab
  'KSC_BB', //443, Keypad Backspace
  'KSC_BC', //444, Keypad A
  'KSC_BD', //445, Keypad B
  'KSC_BE', //446, Keypad C
  'KSC_BF', //447, Keypad D
  'KSC_C0', //448, Keypad E
  'KSC_C1', //449, Keypad F
  'KSC_C2', //450, Keypad XOR
  'KSC_C3', //451, Keypad ^
  'KSC_C4', //452, Keypad %
  'KSC_C5', //453, Keypad <
  'KSC_C6', //454, Keypad >
  'KSC_C7', //455, Keypad &
  'KSC_C8', //456, Keypad &&
  'KSC_C9', //457, Keypad |
  'KSC_CA', //458, Keypad ||
  'KSC_CB', //459, Keypad :
  'KSC_CC', //460, Keypad #
  'KSC_CD', //461, Keypad Space
  'KSC_CE', //462, Keypad @
  'KSC_CF', //463, Keypad !
  'KSC_D0', //464, Keypad Memory Store
  'KSC_D1', //465, Keypad Memory Recall
  'KSC_D2', //466, Keypad Memory Clear
  'KSC_D3', //467, Keypad Memory Add
  'KSC_D4', //468, Keypad Memory Subtract
  'KSC_D5', //469, Keypad Memory Multiply
  'KSC_D6', //470, Keypad Memory Divide
  'KSC_D7', //471, Keypad +/-
  'KSC_D8', //472, Keypad Clear
  'KSC_D9', //473, Keypad Clear Entry
  'KSC_DA', //474, Keypad Binary
  'KSC_DB', //475, Keypad Octal
  'KSC_DC', //476, Keypad Decimal
  'KSC_DD', //477, Keypad Hexadecimal
  'KSC_DE', //478,
  'KSC_DF', //479,
  'KSC_E0', //480, Keyboard Left Control
  'KSC_E1', //481, Keyboard Left Shift
  'KSC_E2', //482, Keyboard Left Alt
  'KSC_E3', //483, Keyboard Left GUI
  'KSC_E4', //484, Keyboard Right Control
  'KSC_E5', //485, Keyboard Right Shift
  'KSC_E6', //486, Keyboard Right Alt
  'KSC_E7', //487, Keyboard Right GUI
  'KSC_E8', //488, Media Play Pause
  'KSC_E9', //489, Media Stop CD
  'KSC_EA', //490, Media Previous Song
  'KSC_EB', //491, Media Next Song
  'KSC_EC', //492, Media Eject CD
  'KSC_ED', //493, Media Volume Up
  'KSC_EE', //494, Media Volume Down
  'KSC_EF', //495, Media Mute
  'KSC_F0', //496, Media www
  'KSC_F1', //497, Media Back
  'KSC_F2', //498, Media Forward
  'KSC_F3', //499, Media Stop
  'KSC_F4', //500, Media Find
  'KSC_F5', //501, Media Scroll Up
  'KSC_F6', //502, Media Scroll Down
  'KSC_F7', //503, Media Edit
  'KSC_F8', //504, Media Sleep
  'KSC_F9', //505, Media Coffee
  'KSC_FA', //506, Media Refresh
  'KSC_FB', //507, Media Calc
  'KSC_FC', //508,
  'KSC_FD', //509,
  'KSC_FE', //510,
  'KSC_FF', //511,
  'LEFT_CTRL', //512, Left Control Keyboard Modifier
  'LEFT_SHIFT', //513, Left Shift Keyboard Modifier
  'LEFT_ALT', //514, Left Alt Keyboard Modifier
  'LEFT_GUI', //515, Left GUI Keyboard Modifier
  'RIGHT_CTRL', //516, Right Control Keyboard Modifier
  'RIGHT_SHIFT', //517, Right Shift Keyboard Modifier
  'RIGHT_ALT', //518, Right Alt Keyboard Modifier
  'RIGHT_GUI', //519, Right GUI Keyboard Modifier
  'RELEASE_MOD', //520, Release all keyboard modifiers
  'RELEASE_ALL', //521, Release all keys and keyboard modifiers
  'RELEASE_KEYS', //522, Release all keys, but not keyboard modifiers
  '', //523,
  '', //524,
  '', //525,
  '', //526,
  '', //527,
  'RESTART', //528, Restart Device
  '', //529,
  'BOOT', //530, Bootloader Mode
  '', //531,
  'GTM', //532, Toggle GTM
  '', //533,
  'IMPULSE', //534, Toggle Impulse
  '', //535,
  'DUP', //536, Repeat Last Note
  '', //537,
  'SPUR', //538, Spur Toggle
  '', //539,
  'AMBILEFT', //540, AmbiThrow (left)
  '', //541,
  'AMBIRIGHT', //542, AmbiThrow (right)
  '', //543,
  'SPACERIGHT', //544, Right Spacebar (eg CC Lite)
  '', //545,
  '', //546,
  '', //547,
  'KM_1_L', //548, Primary Keymap (left key)
  'KM_1_R', //549, Primary Keymap (right key)
  'KM_2_L', //550, Secondary Keymap [Num-shift] (left key)
  'KM_2_R', //551, Secondary Keymap [Num-shift] (right key)
  'KM_3_L', //552, Tertiary Keymap (left key)
  'KM_3_R', //553, Tertiary Keymap (left key)
  '', //554,
  '', //555,
  '', //556,
  '', //557,
  '', //558,
  '', //559,
  '', //560,
  '', //561,
  'MS_CLICK_LF', //562, Mouse Left Button Press and Release
  'MS_CLICK_RT', //563, Mouse Right Button Press and Release
  'MS_CLICK_MD', //564, Mouse Middle Button Press and Release
  'MS_MOVE_RT', //565, Mouse Move Right
  'MS_MOVE_LF', //566, Mouse Move Left
  'MS_MOVE_DN', //567, Mouse Move Down
  'MS_MOVE_UP', //568, Mouse Move Up
  'MS_SCRL_RT', //569, Mouse Scroll Coast Right
  'MS_SCRL_LF', //570, Mouse Scroll Coast Left
  'MS_SCRL_DN', //571, Mouse Scroll Coast Down
  'MS_SCRL_UP', //572, Mouse Scroll Coast Up
  '', //573,
  '', //574,
  '', //575,
  '', //576,
  '', //577,
  '', //578,
  '', //579,
  '', //580,
  '', //581,
  '', //582,
  '', //583,
  '', //584,
  '', //585,
  '', //586,
  '', //587,
  '', //588,
  '', //589,
  '', //590,
  '', //591,
  '', //592,
  '', //593,
  '', //594,
  '', //595,
  '', //596,
  '', //597,
  '', //598,
  '', //599,
  'LH_THUMB_3_3D', //600
  'LH_THUMB_2_3D', //601
  'LH_THUMB_1_3D', //602
  'LH_INDEX_3D', //603
  'LH_MID_1_3D', //604
  'LH_RING_1_3D', //605
  'LH_PINKY_3D', //606
  'LH_MID_2_3D', //607
  'LH_RING_2_3D', //608
  'RH_THUMB_3_3D', //609
  'RH_THUMB_2_3D', //610
  'RH_THUMB_1_3D', //611
  'RH_INDEX_3D', //612
  'RH_MID_1_3D', //613
  'RH_RING_1_3D', //614
  'RH_PINKY_3D', //615
  'RH_MID_2_3D', //616
  'RH_RING_2_3D', //617
  */
};

function compare(a: any, b: any) {
  if (a === b) {
    return 0;
  }

  const a_components = a.split('.');
  const b_components = b.split('.');

  const len = Math.min(a_components.length, b_components.length);

  // loop while the components are equal
  for (let i = 0; i < len; i++) {
    // A bigger than B
    if (parseInt(a_components[i]) > parseInt(b_components[i])) {
      return 1;
    }

    // B bigger than A
    if (parseInt(a_components[i]) < parseInt(b_components[i])) {
      return -1;
    }
  }

  // If one's a prefix of the other, the longer one is greater.
  if (a_components.length > b_components.length) {
    return 1;
  }

  if (a_components.length < b_components.length) {
    return -1;
  }

  // Otherwise they are the same.
  return 0;
}

export async function selectBase() {
  await sendCommandString('SELECT BASE');
  await readGetOneAndToss(); //toss the result of 2000
}

export async function sendCommandString(commandString: string) {
  console.log(commandString);
  if (MainControls.serialPort) {
    const encoder = new TextEncoder();
    const writer = MainControls.serialPort.writable.getWriter();
    await writer.write(encoder.encode(commandString + '\r\n'));
    writer.releaseLock();
    console.log('writing ' + commandString + '\r\n');
  } else {
    console.log('serial port is not open yet');
  }
}

export async function readGetOneAndToss() {
  const { value, done } = await MainControls.lineReader
    .read()
    .catch(console.error);
  //throw away the value
  if (value) {
    console.log('toss value of: ' + value);
  } else {
    console.log('value is null');
  }
}

export async function readGetOneAndTossCommitAll(virtualId) {
  const myTimeout = await setTimeout(pressCommitButton, 10000, virtualId); //Fiddle with this
  //console.log('readGetOneAndTossCommitAll()');
  //console.log('Starting timer')

  const { value, done } = await MainControls.lineReader
    .read()
    .catch(console.error);
  //throw away the value
  if (value) {
    console.log('toss value of: ' + value);
  } else {
    console.log('value is null');
  }
  clearTimeout(myTimeout);
}

export async function readGetOneAndReturnOne() {
  const { value, done } = await MainControls.lineReader
    .read()
    .catch(console.error);
  //throw away the value
  if (value) {
    return value;
  } else {
    console.log('value is null');
  }
}

export async function selectConfig() {
  await sendCommandString('SELECT CONFIG');
  await readGetOneAndToss(); //toss the result of 17
}

export async function readGetChordmapCount() {
  const { value, done } = await MainControls.lineReader.read();
  if (value) {
    MainControls._chordmapCountOnDevice = parseInt(value);
    console.log(MainControls._chordmapCountOnDevice);
  }
}
export async function enableSerialChordOutput(val: boolean) {
  console.log('enableSerialChordOutput(' + val.toString() + ')');
  await selectConfig();
  if (val == true) {
    await sendCommandString(
      'SET ' + MainControls.CONFIG_ID_ENABLE_SERIAL_CHORD + ' 01',
    );
    await sendCommandString(
      'SET ' + MainControls.CONFIG_ID_ENABLE_HID_KEYBOARD + ' 00',
    );
    await sendCommandString(
      'SET ' + MainControls.CONFIG_ID_ENABLE_HID_MOUSE + ' 00',
    );
  } else {
    await sendCommandString(
      'SET ' + MainControls.CONFIG_ID_ENABLE_SERIAL_CHORD + ' 00',
    );
    await sendCommandString(
      'SET ' + MainControls.CONFIG_ID_ENABLE_HID_KEYBOARD + ' 01',
    );
    await sendCommandString(
      'SET ' + MainControls.CONFIG_ID_ENABLE_HID_MOUSE + ' 01',
    );
  }
  await selectBase();
}
export async function cancelReader() {
  if (MainControls.serialPort) {
    if (MainControls.lineReader) {
      // if(lineReader.locked){
      await MainControls.lineReader.cancel().then(() => {
        console.log('cleared line reader');
      });
      // await serialPort.readable.releaseLock();
      console.log(MainControls.abortController1);
      await MainControls.abortController1.abort();
      console.log(MainControls.serialPort.readable);
      await MainControls.lineReaderDone.catch(() => {
        /* Ignore the error */
      }); //this frees up the serialPort.readable after the abortControl1.abort() signal
      // await serialPort.readable.cancel();
      // }
    }
  }
}
function ReplaceAt(input, search, replace, start, end) {
  return (
    input.slice(0, start) +
    input.slice(start, end).replace(search, replace) +
    input.slice(end)
  );
}
function replaceAt(index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
}
export function convertHexadecimalPhraseToAsciiString(hexString: string) {
  let asciiString = '';
  const tempCharacterSet = [];
  //let actionId = actionMap.indexOf(part); //returns the position of the first occurrence of a value in a string.; returns -1 if not found
  //let humanStringPart = actionMap[actionId]; //returns the ASCII string output from the actionMap
  //assume 2x size
  //get every 2 characters
  //TODO covert to byte array and account for non-ascii inputs like mouse moves
  if (Hex2Dec(hexString.substr(0, 2)) <= 32) {
    for (let i = 0; i < hexString.length; i += 4) {
      const tempASI = actionMap[parseInt(hexString.substr(i, 4), 16)]
        ?.split('_')
        ?.pop();
      if (BaseLevelSpecialCharactersLibrary[tempASI] == undefined) {
        asciiString += tempASI;
      } else {
        asciiString += BaseLevelSpecialCharactersLibrary[tempASI];
      }
      //asciiString += ;
      console.log(actionMap[parseInt(hexString.substr(i, 4), 16)]);
      tempCharacterSet.push(actionMap[parseInt(hexString.substr(i, 4), 16)]);
      //asciiString += String.fromCharCode("0x"+hexString.substr(i, 2));
      //Handles 1 byte string outputs
    }
    asciiString = asciiString.toLocaleLowerCase();
    console.log('tempCharacterSet array 1 ' + tempCharacterSet);
  } else {
    for (let i = 0; i < hexString.length; i += 2) {
      const tempASI = actionMap[parseInt(hexString.substr(i, 2), 16)]
        ?.split('_')
        ?.pop();
      if (BaseLevelSpecialCharactersLibrary[tempASI] == undefined) {
        asciiString += tempASI;
        tempCharacterSet.push(actionMap[parseInt(hexString.substr(i, 2), 16)]);
      } else {
        asciiString += BaseLevelSpecialCharactersLibrary[tempASI];
        tempCharacterSet.push(actionMap[parseInt(hexString.substr(i, 2), 16)]);
      }
      console.log(actionMap[parseInt(hexString.substr(i, 2), 16)]);
    }
    console.log('tempCharacterSet array 2 ' + tempCharacterSet);
  }

  //Logic to handle modifiers
  if (
    tempCharacterSet.includes('LEFT_SHIFT') ||
    tempCharacterSet.includes('RIGHT_SHIFT')
  ) {
    const numberOfShiftOccurences = tempCharacterSet
      .map((element, index) =>
        element === ('LEFT_SHIFT' || 'RIGHT_SHIFT') ? index : -1,
      )
      .filter((element) => element !== -1);
    if (numberOfShiftOccurences.length >= 2) {
      let startModifierWork = false;
      let changedSection = '';
      numberOfShiftOccurences;
      let nextShiftPositionIncrement = 0;
      for (let y = 0; y < tempCharacterSet.length; y++) {
        //Should check the boolean for false or true
        if (
          tempCharacterSet[y] == ('LEFT_SHIFT' || 'RIGHT_SHIFT') &&
          !startModifierWork
        ) {
          //If this is the fist shift set start modifer to true
          startModifierWork = true;
          tempCharacterSet.splice(y, 1); //Remove the shift
          nextShiftPositionIncrement++;
          console.log('Entered the first shift i, Y-index' + y);
        } else if (
          tempCharacterSet[y] == ('LEFT_SHIFT' || 'RIGHT_SHIFT') &&
          startModifierWork &&
          y ==
            numberOfShiftOccurences[nextShiftPositionIncrement] -
              nextShiftPositionIncrement
        ) {
          //If this is the last shift set it to false
          startModifierWork = false;
          tempCharacterSet.splice(y, 1); //Remove the shift
          console.log('Entered the first shift else if');
          nextShiftPositionIncrement++;
        }
        //Begin working around this boolean
        if (startModifierWork) {
          if (ModifierCharactersLibrary[tempCharacterSet[y]] == undefined) {
            changedSection += tempCharacterSet[y]
              ?.split('_')
              ?.pop()
              .toUpperCase();
          } else if (
            ModifierCharactersLibrary[tempCharacterSet[y]] != undefined
          ) {
            changedSection += ModifierCharactersLibrary[tempCharacterSet[y]];
          }
        }
        if (!startModifierWork && tempCharacterSet[y] != undefined) {
          changedSection += tempCharacterSet[y]
            ?.split('_')
            ?.pop()
            .toLocaleLowerCase();
        }
        console.log(
          'Position values at each step ' +
            changedSection.split(',') +
            ' TempCharacter Set ' +
            tempCharacterSet,
        );
      }
      console.log('new stuff ' + changedSection.split(','));
      asciiString = changedSection.split(',');
    }
  }
  console.log(asciiString);
  return asciiString;
}

async function readGetSomeChordmaps(expectedLineCount = 100) {
  console.log('readGetSome(' + expectedLineCount + ')');
  let i = 0;
  const checker = true;
  while (checker) {
    const { value } = await MainControls.lineReader.read();
    i++;
    if (value) {
      const arrValue = [...value];
      //ascii_to_hexa(arrValue);
      const strValue = String(arrValue.join(''));
      console.log(strValue);

      const hexChordString = strValue[2]; // Should return 32 characters at all times
      const hexAsciiString = strValue.substr(17, strValue.length);
      const strValues = ['', '', '', ''];
      strValues[0] = convertHexadecimalChordToHumanChord(hexChordString);
      strValues[1] = convertHexadecimalPhraseToAsciiString(hexAsciiString);
      strValues[2] = hexChordString;
      strValues[3] = hexAsciiString;
      console.log(strValues);

      //appendToList(strValues);
      // _chordMaps.push(["0x"+hexChordString,strValues[1]]);
      _chordMaps.push([
        convertHexadecimalChordToHumanString(hexChordString),
        strValues[1],
      ]); //this ultimately isn't used

      appendToRow(strValues);
    }
    if (i >= expectedLineCount) {
      break;
    }
  }
}

export async function readGetHexChord() {
  let hexChordString = '';
  if (MainControls.serialPort) {
    // let decoder = new TextDecoderStream();
    // let inputDone = port.readable.pipeTo(decoder.writable);//throws error here
    // console.log(inputDone);
    // let inputStream = decoder.readable.pipeThrough(
    //   new TransformStream(new LineBreakTransformer())
    // );
    // reader = inputStream.getReader();
    if (
      MainControls._chordmapId == 'CHARACHORDER' &&
      compare(MainControls._firmwareVersion, '0.9.0') == -1
    ) {
      await readGetOneAndToss(); //this is added for the latest firmware with customers, where decimal version
      console.log('i did indeed enter here');
    }

    //console.log(MainControls._firmwareVersion);
    //console.log(parseInt(MainControls._firmwareVersion))
    //console.log('Compare for version method :' + compare(MainControls._firmwareVersion, "0.9.0"));
    const { value, done } = await MainControls.lineReader.read();
    if (done) {
      console.log('reader is done');
      // break;
    } else {
      console.log(['value', value]);
      // await reader.cancel().then(()=>{console.log(['value',value]);console.log('then cancelled reader');});
      // await inputDone.catch(() => {});
      // reader.releaseLock();

      if (value) {
        const arrValue = [...value];
        const strValue = String(arrValue.join(''));
        console.log(strValue);
        hexChordString = strValue.substr(0, 16);
        await readGetOneAndToss(); //the "processing chord:" decimal output
      }
    }
  }
  return hexChordString;
}

export function convertHexadecimalChordToHumanString(
  hexString: string | any[],
) {
  let humanString = '';
  //let num = parseInt(hexString, 16);
  //humanString = String(num);
  console.log(hexString);
  if (hexString.length <= 0) {
    hexString = '00';
  }
  const bigNum = BigInt('0x' + hexString);

  if (MainControls._chordmapId == 'CHARACHORDER') {
    //charachorder original uses different key map structure
    const decString: any = String(bigNum).split(''); //no left zeros; that's ok
    console.log(decString);
    console.log(MainControls._chordmapId);
    for (let i = 0; i < decString.length; i++) {
      if (decString[i] != '0') {
        if (humanString.length > 0) {
          humanString += ' + ';
        }
        console.log({
          i: i,
          'decString[i]': decString[i],
          'decString.length': decString.length,
          decString: decString,
          '10exp': decString.length - i - 1,
          decChordComp: decString[i] * 10 ** (decString.length - i - 1),
          // 'decChordCompBigInt':BigInt(decString[i])*BigInt((BigInt(10)**(decString.length-i-1))),
          noteId: chord_to_noteId(
            decString[i] * 10 ** (decString.length - i - 1),
          ),
        });
        let noteId;
        let actionId;
        if (decString[i] % 2 == 1) {
          //if it is odd, then it is simple
          noteId = chord_to_noteId(
            decString[i] * 10 ** (decString.length - i - 1),
          );
          actionId = _keyMapDefaults[0][noteId];
          if (actionId == 0) {
            actionId = 0x0200 + noteId;
          }
          humanString += actionMap[actionId];
        } else {
          //value is even, odd plus a 1
          noteId = chord_to_noteId(
            (decString[i] - 1) * 10 ** (decString.length - i - 1),
          );
          //Charachorder = 0
          actionId = _keyMapDefaults[0][noteId];
          if (actionId == 0) {
            actionId = 0x0200 + noteId;
          }
          humanString += actionMap[actionId];

          humanString += ' + ';

          noteId = chord_to_noteId(1 * 10 ** (decString.length - i - 1));
          actionId = _keyMapDefaults[0][noteId];
          if (actionId == 0) {
            actionId = 0x0200 + noteId;
          }
          humanString += actionMap[actionId];
        }
      }
      //This checks if the Chord has the sequence e + e inside if it does this changes it to the correct e + r diagonal press representation
      // if(humanString.indexOf('e + e')!=-1 || humanString.indexOf('e + e') != 0) {
      // humanString = humanString.replace("e + e", "r + e");
      // }
      //This checks if the Chord has the sequence m + k inside if it does this changes it to the correct m + c diagonal press representation

      if (
        humanString.indexOf('m + k') != -1 ||
        humanString.indexOf('m + k') != 0
      ) {
        humanString = humanString.replace('m + k', 'm + c');
      }
    }
  } else if (MainControls._chordmapId == 'CHARACHORDERLITE') {
    console.log('ChordLite ' + bigNum);
    const binString = bigNum.toString(2); //no left zeros; that's ok
    console.log(binString);
    for (let i = 0; i < binString.length; i++) {
      if (binString[i] == '1') {
        if (humanString.length > 0) {
          humanString += ' + ';
        }
        humanString += _keyMap[64 - binString.length + i];
        //console.log(i);
        //humanString+=_keyMap[(64-binString.length+i)];
        if (
          _keyMap[64 - binString.length + i] == 'GTM' ||
          _keyMap[64 - binString.length + i] == '0x0061'
        ) {
          console.log('The two values ' + _keyMap[64 - binString.length + i]);
        }
      }
    }
  } else {
    console.log('ChordLite ' + bigNum);
    const binString = bigNum.toString(2); //no left zeros; that's ok
    console.log(binString);
    for (let i = 0; i < binString.length; i++) {
      if (binString[i] == '1') {
        if (humanString.length > 0) {
          humanString += ' + ';
        }
        humanString += _keyMap[64 - binString.length + i];
        //console.log(i);
        //humanString+=_keyMap[(64-binString.length+i)];
        if (
          _keyMap[64 - binString.length + i] == 'GTM' ||
          _keyMap[64 - binString.length + i] == '0x0061'
        ) {
          console.log(
            'The two values ' + _keyMapDefaults[64 - binString.length + i],
          );
        }
      }
    }
  }

  console.log(humanString);
  return humanString;
}

function checkBin(n) {
  return /^[01]{1,64}$/.test(n);
}
function checkDec(n) {
  return /^[0-9]{1,64}$/.test(n);
}
function checkHex(n) {
  return /^[0-9A-Fa-f]{1,64}$/.test(n);
}
function pad(s, z) {
  s = '' + s;
  return s.length < z ? pad('0' + s, z) : s;
}
function unpad(s) {
  s = '' + s;
  return s.replace(/^0+/, '');
}
function backpad(s, z) {
  s = '' + s;
  return s.length < z ? backpad(s + '0', z) : s;
}

//Decimal operations
function Dec2Bin(n) {
  if (!checkDec(n) || n < 0) return 0;
  return n.toString(2);
}
function Dec2Hex(n) {
  if (!checkDec(n) || n < 0) return 0;
  return n.toString(16);
}
//Binary Operations
function Bin2Dec(n) {
  if (!checkBin(n)) return 0;
  return parseInt(n, 2).toString(10);
}
function Bin2Hex(n) {
  if (!checkBin(n)) return 0;
  return parseInt(n, 2).toString(16);
}

//Hexadecimal Operations
//function Hex2Bin(n){if(!checkHex(n))return 0;return parseInt(n,16).toString(2)} do not use
function Hex2Dec(n) {
  if (!checkHex(n)) return 0;
  return parseInt(n, 16).toString(10);
}

export function convertHexadecimalChordToHumanChordForAllChordsTier(hexChord) {
  //console.log("convertHexadecimalChordToHumanChord()");
  //console.log(hexChord);
  const humanChord = [];
  const binChord = pad(hex2Bin(hexChord), 128);
  console.log(hexChord);
  console.log(binChord);
  const chainIndex = binChord.substring(0, 8); //unused right now; this is used for phrases that have more than 192 bytes

  for (let i = 0; i < 12; i++) {
    const binAction = binChord.substring(8 + i * 10, 8 + (i + 1) * 10); //take 10 bits at a time
    const actionCode = Bin2Dec(binAction); //convert 10-bit binary to an action id
    if (actionCode != 0) {
      //replaceOldAsciiKeys()
      console.log('this is actionMap output ' + actionMap[actionCode]);
      const humanStringPart = replaceOldAsciiKeys(actionMap[actionCode]); //returns the ASCII string output from the actionMap
      //humanStringPart = oldAsciiKeyReplacementDictionary[humanStringPart];
      //console.log('Old Ascii '+ humanStringPart)
      humanChord.push(humanStringPart); //Replace when new action codes arrive
      //console.log('Human string part in the loop '+ humanChord)
    } else {
      break; //we can exit the for loop early
    }
  }
  console.log('final humanChord ' + humanChord);
  //console.log(humanChord);
  return humanChord;
}

export function convertHexadecimalChordToHumanChord(hexChord) {
  //console.log("convertHexadecimalChordToHumanChord()");
  //console.log(hexChord);
  let humanChord = '';
  const binChord = pad(hex2Bin(hexChord), 128);
  console.log(hexChord);
  console.log(binChord);
  const chainIndex = binChord.substring(0, 8); //unused right now; this is used for phrases that have more than 192 bytes

  for (let i = 0; i < 12; i++) {
    const binAction = binChord.substring(8 + i * 10, 8 + (i + 1) * 10); //take 10 bits at a time
    const actionCode = Bin2Dec(binAction); //convert 10-bit binary to an action id
    if (actionCode != 0) {
      if (humanChord.length > 0) {
        humanChord += ' + '; //add this + between action ids; put here so we don't have to remove it at end of for-loop
      }

      console.log('this is actionMap output ' + actionMap[actionCode]);
      const humanStringPart = replaceOldAsciiKeys(actionMap[actionCode]); //humanStringPart = oldAsciiKeyReplacementDictionary[humanStringPart];
      //console.log('Old Ascii '+ humanStringPart)
      humanChord += humanStringPart?.split('_')?.pop(); //Replace when new action codes arrive
      //console.log('Human string part in the loop '+ humanChord)
    } else {
      break; //we can exit the for loop early
    }
  }
  console.log('final humanChord ' + humanChord);
  //console.log(humanChord);
  return humanChord;
}

export function chord_to_noteId(chord: number) {
  const part1 = 5 * Math.floor(Math.log10(chord));
  const part2 = Math.floor(chord / 10 ** Math.floor(Math.log10(chord)) + 1) / 2;
  const part3 = Math.log10(chord);

  const full = Math.floor(
    5 * Math.floor(Math.log10(chord)) +
      Math.floor(chord / 10 ** Math.floor(Math.log10(chord)) + 1) / 2,
  );
  console.log([chord, part1, part2, part3, full]);
  return full;
}

export async function setupLineReader() {
  if (MainControls.serialPort) {
    console.log('setupLineReader()');
    const decoder = new TextDecoderStream();
    MainControls.abortController1 = new AbortController(); //reset abortController1
    MainControls.abortController2 = new AbortController(); //reset abortController2
    //preventAbort:true,
    MainControls.lineReaderDone = MainControls.serialPort.readable.pipeTo(
      decoder.writable,
      { preventAbort: true, signal: MainControls.abortController1.signal },
    ); //throws error here
    const inputStream = decoder.readable.pipeThrough(
      new TransformStream(new LineBreakTransformer(), {
        signal: MainControls.abortController2.signal,
      }),
    );
    MainControls.lineReader = await inputStream.getReader();
    console.log('setup line reader');
    document.getElementById('statusDiv').innerHTML =
      'status: opened serial port and listening';
  } else {
    console.log('serial port is not open yet');
  }
}
class LineBreakTransformer {
  chunks: any;

  constructor() {
    this.chunks = '';
  }

  transform(chunk: any, controller: any) {
    this.chunks += chunk;
    const lines = this.chunks.split('\r\n');
    this.chunks = lines.pop();
    lines.forEach((line: any) => controller.enqueue(line));
  }

  flush(controller: any) {
    controller.enqueue(this.chunks);
  }
}
export function appendToList(str: any) {
  const ul = document.getElementById('list');
  const li = document.createElement('li');

  li.appendChild(document.createTextNode(str[0] + ' ' + str[1]));
  ul.appendChild(li);
}

export function ascii_to_hexa(arr: any) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Number(arr[i].charCodeAt(0)).toString(16);
  }
}
function convertKeyPostionsHumanPosition(inPostion: string) {
  return inPostion.split('_').pop();
}
function tryItAll(character) {
  const variations: string[] = ['KEY_', 'KSC_', 'ARROW_', 'KP_', 'VOL_'];
  if (ReverseLookUpTable[character] != undefined) {
    return actionMap.indexOf(character);
  } else if (ReverseModifierCharactersLibrary[character] != undefined) {
    return ReverseModifierCharactersLibrary[character];
  } else {
    for (let y = 0; y < variations.length; y++) {
      if (ReverseLookUpTable[variations[y] + character]) {
        return ReverseLookUpTable[variations[y] + character];
      }
    }
    return;
  }
}

//Need to handle modifiers and shifts
export function convertHumanStringToHexadecimalPhrase(
  humanString: string,
): string {
  let hexString = '';
  if (MainControls._chordmapId == 'ID CHARACHORDER X S2') {
    const variations: string[] = ['KEY_', 'KSC_', 'ARROW_', 'KP_', 'VOL_'];
    let shouldModBeTrue = false; //Only true if shift is already in it
    const leftShiftValue = DecimalHexTwosComplement(
      ReverseLookUpTable['LEFT_SHIFT'],
    );
    for (let i = 0; i < humanString.length; i++) {
      if (
        ReverseLookUpTable[humanString[i].toUpperCase()] != undefined &&
        humanString[i] != humanString[i].toUpperCase()
      ) {
        !shouldModBeTrue
          ? [(shouldModBeTrue = true), (hexString += leftShiftValue)]
          : '';
        hexString += DecimalHexTwosComplement(
          actionMap.indexOf(humanString[i].toUpperCase()),
        );
      } else if (humanString[i] == humanString[i].toUpperCase()) {
        !shouldModBeTrue
          ? [(shouldModBeTrue = true), (hexString += leftShiftValue)]
          : '';

        for (let y = 0; y < variations.length; y++) {
          if (
            ReverseLookUpTable[variations[y] + humanString[i].toUpperCase()]
          ) {
            hexString += DecimalHexTwosComplement(
              ReverseLookUpTable[variations[y] + humanString[i].toUpperCase()],
            );
          }
        }
      } else if (
        ReverseModifierCharactersLibrary[humanString[i].toUpperCase()] !=
        undefined
      ) {
        //Handles special characters

        !shouldModBeTrue
          ? [(shouldModBeTrue = false), (hexString += leftShiftValue)]
          : '';
        hexString += DecimalHexTwosComplement(
          actionMap.indexOf(humanString[i].toUpperCase()),
        );
      } else {
        for (let y = 0; y < variations.length; y++) {
          if (
            ReverseLookUpTable[variations[y] + humanString[i].toUpperCase()]
          ) {
            shouldModBeTrue
              ? [(shouldModBeTrue = false), (hexString += leftShiftValue)]
              : '';
            hexString += DecimalHexTwosComplement(
              ReverseLookUpTable[variations[y] + humanString[i].toUpperCase()],
            );
          }
        }
      }
    }
  } else {
    for (let i = 0; i < humanString.length; i++) {
      const hex = Number(humanString.charCodeAt(i)).toString(16);
      hexString += hex;
    }
    hexString = hexString.toUpperCase();
  }
  console.log(hexString);
  return hexString;
}
function DecimalHexTwosComplement(decimal) {
  const size = 8;

  if (decimal >= 0) {
    let hexadecimal = decimal.toString(16);

    while (hexadecimal.length % size != 0) {
      hexadecimal = '' + 0 + hexadecimal;
    }

    return hexadecimal;
  } else {
    let hexadecimal = Math.abs(decimal).toString(16);
    while (hexadecimal.length % size != 0) {
      hexadecimal = '' + 0 + hexadecimal;
    }

    let output = '';
    for (let i = 0; i < hexadecimal.length; i++) {
      output += (0x0f - parseInt(hexadecimal[i], 16)).toString(16);
    }

    output = (0x01 + parseInt(output, 16)).toString(16);
    return output;
  }
}
/*eslint-disable */
function replaceOldAsciiKeys(inputKey) {
  inputKey = inputKey.split(' + ');
  let finishedInputKey = '';
  for (let i = 0; i < inputKey.length; i++) {
    if (oldAsciiKeyReplacementDictionary.hasOwnProperty(inputKey[i])) {
      // eslint-disable-line no-use-before-define
      finishedInputKey += oldAsciiKeyReplacementDictionary[inputKey[i]];
      // eslint-disable-line no-use-before-define
      console.log('OldAsciiReplacement ' + finishedInputKey);
    } else {
      finishedInputKey += inputKey[i];
    }
    if (inputKey.length - 1 > 0 && i != inputKey.length - 1) {
      finishedInputKey += ' + ';
    }
  }
  return finishedInputKey;
}
/*eslint-enable */

export function convertHumanStringToHexadecimalChord(
  humanString: string,
): string {
  console.log(humanString);
  let hexString = '';
  let bigNum = BigInt(0);
  //parse the pieces with _+_
  const humanStringParts = humanString.split(' + '); //assumes plus isn't being used; bc default is = for the +/= key
  console.log('these are the parts ' + humanStringParts);
  humanStringParts.forEach(async (part: any) => {
    //console.log('this is the part in the convert '+part + ' '+ replaceOldAsciiKeys(part));
    part = replaceOldAsciiKeys(part);
    console.log('This is the part ' + part);
    const actionId = actionMap.indexOf(part);

    console.log('ActionID: ' + actionId);
    if (MainControls._chordmapId == 'CHARACHORDER') {
      //charachorder original uses different key map structure
      let keyId: number;
      if (actionId < 0x0200) {
        keyId = _keyMapDefaults[0].indexOf(actionId);
        console.log(keyId);
      } else {
        keyId = actionId - 0x0200; //using the physical key position
      }

      console.log(keyId);
      bigNum += BigInt(noteId_to_chord(keyId));
      console.log(bigNum);
    } else if (MainControls._chordmapId == 'CHARACHORDERLITE') {
      let keyId: number;
      if (actionId < 0x0200) {
        console.log('I am here');
        keyId = _keyMapDefaults[1].indexOf(actionMap[actionId]);
        console.log(keyId);
      } else {
        keyId = actionId - 0x0200; //using the physical key position
      }

      console.log(keyId);
      bigNum += BigInt(2n ** BigInt(keyId));
      console.log(bigNum);
    } else {
      //use other keymap
    }
  });
  console.log(bigNum);

  hexString = bigNum.toString(16).toUpperCase();
  hexString = '0'.repeat(16 - hexString.length) + hexString; //add leading zeros up to 16 characters
  console.log(hexString);

  return hexString;
}

export function noteId_to_chord(note: any): bigint {
  return (
    BigInt(2 * ((note - 1) % 5) + 1) *
    BigInt(10) ** BigInt(Math.floor((note - 1) / 5))
  );
}

export async function readGetOneChordmap() {
  console.log('readGetOneChordmap()');
  const { value } = await MainControls.lineReader.read();
  const splitter = value.split(' ');
  console.log(splitter);
  const strValues = ['', '', '', ''];

  if (value) {
    const arrValue = [...splitter];
    //ascii_to_hexa(arrValue);
    const strValue = arrValue;
    let hexChordString = '';
    hexChordString = strValue[3]; //Should be 32 characters at all times
    let hexAsciiString = '';
    hexAsciiString = strValue[4];
    strValues[0] = convertHexadecimalChordToHumanChord(hexChordString);
    strValues[1] = convertHexadecimalPhraseToAsciiString(hexAsciiString);
    strValues[2] = hexChordString;
    strValues[3] = hexAsciiString;

    //appendToList(strValues);
    // _chordMaps.push(["0x"+hexChordString,strValues[1]]);
    _chordMaps.push([
      convertHexadecimalPhraseToAsciiString(hexChordString),
      strValues[1],
    ]);

    //appendToRow(strValues);
  }
  return strValues;
}

export async function commitChordLayout() {
  console.log('readGetOneChordMapLayout()');
  const { value } = await MainControls.lineReader.read();
  console.log('Chord layout array ' + value);

  if (value) {
    const arrValue = [...value];
    //ascii_to_hexa(arrValue);
    const strValue = String(arrValue.join(''));
    console.log(strValue);
    let hexChordString = '';
    hexChordString = strValue.substr(0, 16);
    let hexAsciiString = '';
    hexAsciiString = strValue.substr(17, strValue.length);
    const strValues = ['', '', '', ''];
    const myArray = value.split(' ');

    strValues[0] = myArray[1];
    strValues[1] = myArray[2];
    strValues[2] = myArray[3];
    strValues[3] = myArray[4];
    strValues[4] = myArray[5];
    strValues[5] = myArray[6];

    //appendToList(strValues);
    // _chordMaps.push(["0x"+hexChordString,strValues[1]]);
    _chordLayout.push(value); //this ultimately isn't used

    appendLayoutToRow(strValues);
  }
}

export async function readGetOneChordLayout() {
  console.log('readGetOneChordMapLayout()');
  const { value } = await MainControls.lineReader.read();
  console.log('Chord layout array ' + value);
  const strValues = ['', '', '', ''];

  if (value) {
    const arrValue = [...value];
    //ascii_to_hexa(arrValue);
    const strValue = String(arrValue.join(''));
    console.log(strValue);
    let hexChordString = '';
    hexChordString = strValue.substr(0, 16);
    let hexAsciiString = '';
    hexAsciiString = strValue.substr(17, strValue.length);
    const myArray = value.split(' ');

    strValues[0] = myArray[1];
    strValues[1] = myArray[2];
    strValues[2] = myArray[3];
    strValues[3] = myArray[4];
    strValues[4] = myArray[5];
    strValues[5] = myArray[6];

    //appendToList(strValues);
    // _chordMaps.push(["0x"+hexChordString,strValues[1]]);
    _chordLayout.push(value); //this ultimately isn't used

    //appendLayoutToRow(strValues);
  }
  return strValues;
}

export function appendLayoutToRow(data: string[], isFromFile = false): any {
  if (data[4] != '2') {
    const dataTable = document.getElementById(
      'layoutDataTable',
    ) as HTMLTableElement;
    const row = dataTable.insertRow(-1); //insert row at end of table

    const cells: any = [];
    cells.push(row.insertCell(-1)); //0 virtual id
    cells.push(row.insertCell(-1)); //1 chord edit button
    cells.push(row.insertCell(-1)); //2 chord string (locked)
    cells.push(row.insertCell(-1)); //3 phrase (locked)
    cells.push(row.insertCell(-1)); //4 chord string new (locked)
    cells.push(row.insertCell(-1)); //5 phrase new (open)
    cells.push(row.insertCell(-1)); //6 delete - flags chord for deletion
    cells.push(row.insertCell(-1)); //7 revert
    cells.push(row.insertCell(-1)); //8 commit
    cells.push(row.insertCell(-1)); //9 orig hex chord
    cells.push(row.insertCell(-1)); //10 orig hex phrase
    // cells[9].innerHTML = data[2];
    // cells[10].innerHTML = data[3];

    const chordTextOrig = document.createElement('div');
    const phraseTextOrig = document.createElement('div');
    const chordTextNew = document.createElement('div');
    const phraseTextInput = document.createElement('div');

    const virtualId = MainControls._chordMapIdCounter;
    console.log('ChordMap Counter: ' + virtualId);
    cells[0].innerHTML = virtualId; //local id number
    cells[0].setAttribute('style', 'border: 1px solid #D3D3D3;');
    MainControls._chordMapIdCounter++;

    //btnEdit.id = virtualId.toString()+"-edit";
    //btnEdit.className = "buttonEdit";
    //btnEdit.setAttribute('style', 'background-color: #4CAF50;border: 1px solid white; color: white;padding: 1px 15px;text-align: center;text-decoration: none;display: inline-block; font-size: 16px;');

    //cells[1].appendChild(btnEdit);
    //cells[1].setAttribute('style','border: 1px solid #D3D3D3;')

    chordTextOrig.id = virtualId.toString() + '-chordorig';
    chordTextOrig.innerHTML = data[1];
    cells[2].appendChild(chordTextOrig);
    cells[2].setAttribute('style', 'border: 1px solid #D3D3D3;');

    phraseTextOrig.id = virtualId.toString() + '-phraseorig';
    phraseTextOrig.innerHTML = data[2];
    cells[3].appendChild(phraseTextOrig);
    cells[3].setAttribute('style', 'border: 1px solid #D3D3D3;');

    chordTextNew.id = virtualId.toString() + '-chordnew';
    chordTextNew.innerHTML = data[3];
    cells[4].appendChild(chordTextNew);
    cells[4].setAttribute('style', 'border: 1px solid #D3D3D3; ');

    // phraseTextInput.id = virtualId.toString()+"-phraseinput";
    // phraseTextInput.innerHTML = '';
    // cells[4].appendChild(phraseTextInput);
    // cells[4].setAttribute('style','border: 1px solid #D3D3D3; ')

    //phraseTextInput.value = "";
    //cells[5].setAttribute('style', 'color: white; border: 1px solid white;border-right: 1px solid #D3D3D3;');
    //cells[5].appendChild(phraseTextInput);
    //cells[5].setAttribute('style','border: 1px solid #D3D3D3;')

    phraseTextInput.onchange = function () {
      const element: HTMLInputElement = document.getElementById(
        virtualId.toString() + '-commit',
      ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
      element.disabled = false;
    };

    if (isFromFile) {
      phraseTextInput.value = data[1];
    }
  }
}

export function appendToRow(data: string[], isFromFile = false): any {
  const dataTable = document.getElementById('dataTable') as HTMLTableElement;
  const row = dataTable.insertRow(-1); //insert row at end of table

  const cells: any = [];
  cells.push(row.insertCell(-1)); //0 virtual id
  cells.push(row.insertCell(-1)); //1 chord edit button
  cells.push(row.insertCell(-1)); //2 chord string (locked)
  cells.push(row.insertCell(-1)); //3 phrase (locked)
  cells.push(row.insertCell(-1)); //4 chord string new (locked)
  cells.push(row.insertCell(-1)); //5 phrase new (open)
  cells.push(row.insertCell(-1)); //6 delete - flags chord for deletion
  cells.push(row.insertCell(-1)); //7 revert
  cells.push(row.insertCell(-1)); //8 commit
  cells.push(row.insertCell(-1)); //9 orig hex chord
  cells.push(row.insertCell(-1)); //10 orig hex phrase
  // cells[9].innerHTML = data[2];
  // cells[10].innerHTML = data[3];

  const btnEdit = document.createElement('input');
  const chordTextOrig = document.createElement('div');
  const phraseTextOrig = document.createElement('div');
  const chordTextNew = document.createElement('div');
  const phraseTextInput = document.createElement('input');
  const btnDelete = document.createElement('input');
  const btnRevert = document.createElement('input');
  const btnCommit = document.createElement('input');

  const virtualId = MainControls._chordMapIdCounter;
  console.log('ChordMap Counter: ' + virtualId);
  cells[0].innerHTML = virtualId; //local id number
  cells[0].setAttribute('style', 'border: 1px solid #D3D3D3;');
  MainControls._chordMapIdCounter++;

  btnEdit.id = virtualId.toString() + '-edit';
  btnEdit.type = 'button';
  btnEdit.className = 'buttonEdit';
  btnEdit.value = 'edit chord';
  btnEdit.setAttribute(
    'style',
    'background-color: #4CAF50;border: 1px solid white; color: white;padding: 1px 15px;text-align: center;text-decoration: none;display: inline-block; font-size: 16px;',
  );

  cells[1].appendChild(btnEdit);
  cells[1].setAttribute('style', 'border: 1px solid #D3D3D3;');

  btnEdit.onclick = async function () {
    const btn = document.getElementById(
      virtualId.toString() + '-edit',
    ) as HTMLInputElement;

    if (btn.value == 'edit chord') {
      btn.value = 'listening';
      await enableSerialChordOutput(true); //TODO include code to enable raw inputs and detect chord or else timeout

      const hexChord = await readGetHexChord(); //TODO enable a timeout to stop listening to read serial
      console.log(
        'Listening Hex Chord ' + convertHexadecimalChordToHumanString(hexChord),
      ); //TODO take this hexchord and do something with it

      if (hexChord != null) {
        console.log(hexChord + ' Original Hex Value');
        const element: HTMLElement = document.getElementById(
          virtualId.toString() + '-chordnew',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
        element.innerHTML = convertHexadecimalChordToHumanString(hexChord);
        const elementT: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-commit',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
        elementT.disabled = false;
        console.log('hexChord is ' + hexChord);

        // await readGetOneAndToss(); //extra processchord: serial output; this is already in the 'readGetHexChord()' method
      }
      await enableSerialChordOutput(false); //if the lineReader is cancelled, then the code flow resumes here
    } else {
      console.log('cancelling lineReader');
      console.log(await MainControls.lineReader);
      // console.log(await serialPort.getReader());
      // await lineReader.releaseLock();
      // await abortController2.abort();
      //TODO need to find the way to cancel or abort the away lineReader stream; bc this isn't working
      await cancelReader(); //forces the reader to call done
      await setupLineReader();
      // await resetReader();
      console.log('cancelled lineReader');
    }
    // setTimeout(()=>{enableSerialChordOutput(false);},100); //don't need to call this down here
    // await enableSerialChordOutput(false); //don't need to call this down here
    btn.value = 'edit chord';
  };

  chordTextOrig.id = virtualId.toString() + '-chordorig';
  chordTextOrig.innerHTML = replaceOldAsciiKeys(data[0]);
  console.log('Output of current chord ' + data);
  cells[2].appendChild(chordTextOrig);
  cells[2].setAttribute('style', 'border: 1px solid #D3D3D3;');

  phraseTextOrig.id = virtualId.toString() + '-phraseorig';
  phraseTextOrig.innerHTML = data[1];
  cells[3].appendChild(phraseTextOrig);
  cells[3].setAttribute('style', 'border: 1px solid #D3D3D3;');

  chordTextNew.id = virtualId.toString() + '-chordnew';
  chordTextNew.innerHTML = '';
  cells[4].appendChild(chordTextNew);
  cells[4].setAttribute('style', 'border: 1px solid #D3D3D3; ');

  phraseTextInput.id = virtualId.toString() + '-phraseinput';
  phraseTextInput.setAttribute('type', 'text');
  phraseTextInput.setAttribute('style', 'color:black');

  phraseTextInput.value = '';
  cells[5].setAttribute(
    'style',
    'color: white; border: 1px solid white;border-right: 1px solid #D3D3D3;',
  );
  cells[5].appendChild(phraseTextInput);
  cells[5].setAttribute('style', 'border: 1px solid #D3D3D3;');

  phraseTextInput.onchange = function () {
    const element: HTMLInputElement = document.getElementById(
      virtualId.toString() + '-commit',
    ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
    element.disabled = false;
  };

  btnDelete.id = virtualId.toString() + '-delete';
  btnDelete.type = 'button';
  btnDelete.className = 'buttonDelete';
  btnDelete.value = 'delete';
  btnDelete.setAttribute(
    'style',
    'background-color: #f44336; border: 1px solid white;color: white;padding: 1px 15px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;',
  );

  cells[6].appendChild(btnDelete);
  cells[6].setAttribute('style', 'border: 1px solid #D3D3D3;');

  btnDelete.onclick = function () {
    const element: HTMLElement = document.getElementById(
      virtualId.toString() + '-chordnew',
    ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
    element.innerHTML = 'DELETE';
    const elementDelete: HTMLInputElement = document.getElementById(
      virtualId.toString() + '-delete',
    ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
    elementDelete.disabled = true;
    const elementCommit: HTMLInputElement = document.getElementById(
      virtualId.toString() + '-commit',
    ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
    elementCommit.disabled = false;
  };

  btnRevert.id = virtualId.toString() + '-revert';
  btnRevert.type = 'button';
  btnRevert.className = 'buttonRevert';
  btnRevert.value = 'revert';
  btnRevert.setAttribute(
    'style',
    'background-color: green; border: 1px solid white; color: white; padding: 1px 15px; text-align: center; display: inline-block; font-size: 16px;',
  );
  cells[7].appendChild(btnRevert);
  cells[7].setAttribute('style', 'border: 1px solid #D3D3D3;');

  btnRevert.onclick = function () {
    const element: HTMLElement = document.getElementById(
      virtualId.toString() + '-chordnew',
    ) as HTMLElement;
    element.innerHTML = '';
    const elementPhase: HTMLInputElement = document.getElementById(
      virtualId.toString() + '-phraseinput',
    ) as HTMLInputElement;
    elementPhase.value = '';
    const elementDelete: HTMLInputElement = document.getElementById(
      virtualId.toString() + '-delete',
    ) as HTMLInputElement;
    elementDelete.disabled = false;
    const elementCommit: HTMLInputElement = document.getElementById(
      virtualId.toString() + '-commit',
    ) as HTMLInputElement;
    elementCommit.disabled = true;
  };

  btnCommit.id = virtualId.toString() + '-commit';
  btnCommit.type = 'button';
  btnCommit.className = 'buttonCommit';
  btnCommit.value = 'commit';
  btnCommit.disabled = true;
  btnCommit.setAttribute(
    'style',
    'border: 1px solid white;color: white;padding: 1px 15px;text-align: center;display: inline-block;font-size: 16px;hover: background: #00ff00;',
  );
  cells[8].appendChild(btnCommit);

  btnCommit.onclick = async function (distinguisher) {
    const check: HTMLInputElement = document.getElementById(
      virtualId.toString() + '-delete',
    ) as HTMLInputElement;
    const checkELementOriginalChord = document.getElementById(
      virtualId.toString() + '-delete',
    ) as HTMLInputElement;
    if (check.disabled) {
      //delete the chord from the device, and then also delete from this list
      //const element: HTMLInputElement = document.getElementById(virtualId.toString()+"-commit")
      document.getElementById(virtualId.toString() + '-');
      await sendCommandString('CML C4 ' + data[2]);
      await readGetOneAndToss();
      //then remove the row from the table
      const i = this.parentNode.parentNode.rowIndex;
      console.log('deleting row ' + virtualId);
      dataTable.deleteRow(i);
    } else {
      const chordNew: HTMLElement = document.getElementById(
        virtualId.toString() + '-chordnew',
      ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
      if (chordNew.innerHTML.length > 0) {
        //if chord was changed, then we need to delete the chord from the device first
        const phraseinput: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-phraseinput',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
        if (phraseinput.value.length > 0) {
          //if phrase was changed, then just set the new chordmap with the new chord and the new phrase
          const chordNewIn: HTMLInputElement = document.getElementById(
            virtualId.toString() + '-chordnew',
          ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
          const phraseInputIn: HTMLInputElement = document.getElementById(
            virtualId.toString() + '-phraseinput',
          ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
          const hexChord = await convertHumanChordToHexadecimalChord(
            chordNewIn.innerHTML,
          );
          const hexPhrase = await convertHumanPhraseToHexadecimalPhrase(
            phraseInputIn.value,
          );

          //await selectBase(); //make sure we're in the BASE dictionary
          await sendCommandString('CML C3 ' + hexChord + ' ' + hexPhrase);
          console.log('ChordNew In' + chordNewIn.innerHTML);
          console.log('ChordNew In' + phraseInputIn.value);

          //then delete the old chordmap          const phraseinput: HTMLInputElement = document.getElementById(virtualId.toString()+"-phraseinput") as HTMLElement; //.innerHTML = "status: opened serial port";
          const chordorig: HTMLInputElement = document.getElementById(
            virtualId.toString() + '-chordorig',
          ) as HTMLInputElement; //.innerHTML = "status: opened serial port";

          const hexChordOrigToDelete =
            await convertHumanChordToHexadecimalChord(chordorig.innerHTML);
          await sendCommandString('CML C4 ' + hexChordOrigToDelete);
          await readGetOneAndToss();

          const phraseorig: HTMLInputElement = document.getElementById(
            virtualId.toString() + '-phraseorig',
          ) as HTMLInputElement; //.innerHTML = "status: opened serial port";

          const phraseinput2: HTMLInputElement = document.getElementById(
            virtualId.toString() + '-phraseinput',
          ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
          phraseorig.innerHTML = phraseinput2.value;
        } else {
          //if phrase was not changed, then just add/set new chordmap with the new chord and the original phrase
          const element: HTMLElement = document.getElementById(
            virtualId.toString() + '-chordnew',
          ) as HTMLElement; //.innerHTML = "status: opened serial port";
          const elementPhase: HTMLElement = document.getElementById(
            virtualId.toString() + '-phraseorig',
          ) as HTMLElement; //.innerHTML = "status: opened serial port";
          const hexChord = await convertHumanChordToHexadecimalChord(
            element.innerHTML,
          );
          const hexPhrase = await convertHumanPhraseToHexadecimalPhrase(
            elementPhase.innerHTML,
          );

          //await selectBase(); //make sure we're in the BASE dictionary
          await sendCommandString('CML C3 ' + hexChord + ' ' + hexPhrase);

          const s = elementPhase.innerHTML.split(',');
          // await sendCommandString('');

          await sendCommandString(
            'VAR ' + 'B4 ' + 'A' + element.innerHTML + ' ' + s[0] + ' ' + s[1],
          );
          await readGetOneAndToss();
          //then delete the old chordmap
          const chordorig: HTMLElement = document.getElementById(
            virtualId.toString() + '-chordorig',
          ) as HTMLElement; //.innerHTML = "status: opened serial port";
          const hexChordOrigToDelete =
            await convertHumanChordToHexadecimalChord(chordorig.innerHTML);
          await sendCommandString('CML C4 ' + hexChordOrigToDelete);
          // document.getElementById(virtualId.toString()+"-phraseorig").innerHTML = document.getElementById(virtualId.toString()+"-phraseinput").value;
        }
        const phraseinput3: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-phraseinput',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
        const chordorig: HTMLElement = document.getElementById(
          virtualId.toString() + '-chordorig',
        ) as HTMLElement; //.innerHTML = "status: opened serial port";
        const chordnew: HTMLElement = document.getElementById(
          virtualId.toString() + '-chordnew',
        ) as HTMLElement; //.innerHTML = "status: opened serial port";
        const delete2: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-delete',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
        const commit2: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-commit',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";

        phraseinput3.value = '';
        chordorig.innerHTML = chordnew.innerHTML;
        chordnew.innerHTML = '';
        delete2.disabled = false;
        commit2.disabled = true;
      } else {
        const check2: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-phraseinput',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";

        if (check2.value.length > 0) {
          //if just the phrase was changed, then update the chordmap with the original chord and new phrase
          const chordorig: HTMLElement = document.getElementById(
            virtualId.toString() + '-chordorig',
          ) as HTMLElement; //.innerHTML = "status: opened serial port";
          const phraseinput5: HTMLInputElement = document.getElementById(
            virtualId.toString() + '-phraseinput',
          ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
          const hexChord = await convertHumanChordToHexadecimalChord(
            chordorig.innerHTML,
          );
          const hexPhrase = await convertHumanPhraseToHexadecimalPhrase(
            phraseinput5.value,
          );

          //await selectBase(); //make sure we're in the BASE dictionary
          await sendCommandString('CML C3 ' + hexChord + ' ' + hexPhrase);

          //then move the new phrase into the original phrase text location in the table, and clear the new phrase input
          const phraseorig3: HTMLElement = document.getElementById(
            virtualId.toString() + '-phraseorig',
          ) as HTMLElement; //.innerHTML = "status: opened serial port";
          const phraseinput3: HTMLInputElement = document.getElementById(
            virtualId.toString() + '-phraseinput',
          ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
          const chordnew: HTMLElement = document.getElementById(
            virtualId.toString() + '-chordnew',
          ) as HTMLElement; //.innerHTML = "status: opened serial port";
          const delete3: HTMLInputElement = document.getElementById(
            virtualId.toString() + '-delete',
          ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
          const commit3: HTMLInputElement = document.getElementById(
            virtualId.toString() + '-commit',
          ) as HTMLInputElement; //.innerHTML = "status: opened serial port";

          phraseorig3.innerHTML = phraseinput3.innerHTML;
          phraseinput3.value = '';
          chordnew.innerHTML = '';
          delete3.disabled = false;
          commit3.disabled = true;
        }
      }
    }
  };
  if (isFromFile) {
    phraseTextInput.value = data[1];
    btnCommit.disabled = false;
  }
  const trow = dataTable.insertRow(-1);
  cells.push(trow);
  const tr = [];
  tr.push(
    <React.Fragment>
      <div className="bg-[#222] mx-auto max-w shadow-lg rounded-lg overflow-hidden row">
        <div className="md:flex md:items-center px-6 py-4">
          <input
            type={'text'}
            className="block h-8 sm:h-12 rounded-xs mx-auto mb-4 sm:mb-0 sm:mr-4 sm:ml-0"
          />
          <input
            type={'text'}
            className="block h-8 sm:h-12 rounded-xs mx-auto mb-4 sm:mb-0 sm:mr-4 sm:ml-0"
          />
          <div className="text-center sm:text-left sm:flex-grow">
            <div>
              <button className="text-xs float-right font-semibold rounded-full px-4 py-1 leading-normal bg-[#22c55e] border border-purple text-purple hover:bg-purple hover:text-black">
                Edit Chord
              </button>
              <button className="text-xs float-right font-semibold rounded-full px-4 py-1 leading-normal bg-[#22c55e] border border-purple text-purple hover:bg-purple hover:text-black">
                Save
              </button>
              <button className="text-xs float-right font-semibold rounded-full px-4 py-1 leading-normal bg-[#22c55e] border border-purple text-purple hover:bg-purple hover:text-black">
                Delete Chord
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>,
  );
  return <div>{tr[0]}</div>;
}

export const asyncCallWithTimeout = async (
  asyncPromise,
  timeLimit,
  virtualId,
) => {
  let timeoutHandle;
  const commitButton = document.getElementById(
    virtualId.toString() + '-commit',
  );
  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutHandle = setTimeout(
      () => _resolve(commitButton?.click()),
      timeLimit,
    );
  });

  return Promise.race([asyncPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle);
    return result;
  });
};

export const asyncCallForDownloadChords = async (asyncPromise, timeLimit) => {
  let timeoutHandle;

  const timeoutPromise = new Promise((_resolve, reject) => {
    timeoutHandle = setTimeout(() => _resolve(asyncPromise), timeLimit);
  });

  return Promise.race([asyncPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle);
    return result;
  });
};

export async function clickCommit(virtualId) {
  const check: HTMLInputElement = document.getElementById(
    virtualId.toString() + '-delete',
  ) as HTMLInputElement;
  // const commitButton = document.getElementById(virtualId.toString()+"-commit");

  //const myTimeout = setTimeout(() => ,virtualId*20000,virtualId);//Fiddle with this
  if (check.disabled) {
    //delete the chord from the device, and then also delete from this list
    document.getElementById(virtualId.toString() + '-');
    await sendCommandString('CML C4 ' + data[2]);
    await readGetOneAndToss();
    //then remove the row from the table
    const i = this.parentNode.parentNode.rowIndex;
    console.log('deleting row ' + i.toString());
    dataTable.deleteRow(i);
  } else {
    const chordNew: HTMLElement = document.getElementById(
      virtualId.toString() + '-chordnew',
    ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
    if (chordNew.innerHTML.length > 0) {
      //if chord was changed, then we need to delete the chord from the device first
      const phraseinput: HTMLInputElement = document.getElementById(
        virtualId.toString() + '-phraseinput',
      ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
      if (phraseinput.value.length > 0) {
        //if phrase was changed, then just set the new chordmap with the new chord and the new phrase
        const chordNewIn: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-chordnew',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
        const phraseInputIn: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-phraseinput',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
        const hexChord = await convertHumanChordToHexadecimalChord(
          chordNewIn.innerHTML,
        );
        const hexPhrase = await convertHumanPhraseToHexadecimalPhrase(
          phraseInputIn.value,
        );

        //await selectBase(); //make sure we're in the BASE dictionary
        await sendCommandString('CML C3 ' + hexChord + ' ' + hexPhrase);
        //await readGetOneAndToss();

        //console.log('ChordNew In'+ chordNewIn.innerHTML);
        //console.log('ChordNew In'+ phraseInputIn.value);

        //then delete the old chordmap          const phraseinput: HTMLInputElement = document.getElementById(virtualId.toString()+"-phraseinput") as HTMLElement; //.innerHTML = "status: opened serial port";
        const chordorig: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-chordorig',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";

        const hexChordOrigToDelete = await convertHumanChordToHexadecimalChord(
          chordorig.innerHTML,
        );
        await sendCommandString('CML C4 ' + hexChordOrigToDelete);
        //await readGetOneAndToss();

        const phraseorig: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-phraseorig',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";

        const phraseinput2: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-phraseinput',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
        phraseorig.innerHTML = phraseinput2.value;
      } else {
        //if phrase was not changed, then just add/set new chordmap with the new chord and the original phrase
        const element: HTMLElement = document.getElementById(
          virtualId.toString() + '-chordnew',
        ) as HTMLElement; //.innerHTML = "status: opened serial port";
        const elementPhase: HTMLElement = document.getElementById(
          virtualId.toString() + '-phraseorig',
        ) as HTMLElement; //.innerHTML = "status: opened serial port";
        const hexChord = await convertHumanChordToHexadecimalChord(
          element.innerHTML,
        );
        const hexPhrase = await convertHumanPhraseToHexadecimalPhrase(
          elementPhase.innerHTML,
        );

        //await selectBase(); //make sure we're in the BASE dictionary
        await sendCommandString('CML C3 ' + hexChord + ' ' + hexPhrase);
        //await readGetOneAndToss();

        const s = elementPhase.innerHTML.split(',');
        // await sendCommandString('');

        await sendCommandString(
          'VAR ' + 'B4 ' + 'A' + element.innerHTML + ' ' + s[0] + ' ' + s[1],
        );
        //await readGetOneAndToss();
        //then delete the old chordmap
        const chordorig: HTMLElement = document.getElementById(
          virtualId.toString() + '-chordorig',
        ) as HTMLElement; //.innerHTML = "status: opened serial port";
        const hexChordOrigToDelete = await convertHumanChordToHexadecimalChord(
          chordorig.innerHTML,
        );
        await sendCommandString('CML C4 ' + hexChordOrigToDelete);
        // document.getElementById(virtualId.toString()+"-phraseorig").innerHTML = document.getElementById(virtualId.toString()+"-phraseinput").value;
      }
      const phraseinput3: HTMLInputElement = document.getElementById(
        virtualId.toString() + '-phraseinput',
      ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
      const chordorig: HTMLElement = document.getElementById(
        virtualId.toString() + '-chordorig',
      ) as HTMLElement; //.innerHTML = "status: opened serial port";
      const chordnew: HTMLElement = document.getElementById(
        virtualId.toString() + '-chordnew',
      ) as HTMLElement; //.innerHTML = "status: opened serial port";
      const delete2: HTMLInputElement = document.getElementById(
        virtualId.toString() + '-delete',
      ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
      const commit2: HTMLInputElement = document.getElementById(
        virtualId.toString() + '-commit',
      ) as HTMLInputElement; //.innerHTML = "status: opened serial port";

      phraseinput3.value = '';
      chordorig.innerHTML = chordnew.innerHTML;
      chordnew.innerHTML = '';
      delete2.disabled = false;
      commit2.disabled = true;
    } else {
      const check2: HTMLInputElement = document.getElementById(
        virtualId.toString() + '-phraseinput',
      ) as HTMLInputElement; //.innerHTML = "status: opened serial port";

      if (check2.value.length > 0) {
        //if just the phrase was changed, then update the chordmap with the original chord and new phrase
        const chordorig: HTMLElement = document.getElementById(
          virtualId.toString() + '-chordorig',
        ) as HTMLElement; //.innerHTML = "status: opened serial port";
        const phraseinput5: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-phraseinput',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
        const hexChord = await convertHumanChordToHexadecimalChord(
          chordorig.innerHTML,
        );
        const hexPhrase = await convertHumanPhraseToHexadecimalPhrase(
          phraseinput5.value,
        );

        //await selectBase(); //make sure we're in the BASE dictionary
        console.log('Chord Original ' + chordorig);
        await sendCommandString('CML C3 ' + hexChord + ' ' + hexPhrase);
        //await readGetOneAndToss();

        //then move the new phrase into the original phrase text location in the table, and clear the new phrase input
        const phraseorig3: HTMLElement = document.getElementById(
          virtualId.toString() + '-phraseorig',
        ) as HTMLElement; //.innerHTML = "status: opened serial port";
        const phraseinput3: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-phraseinput',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
        const chordnew: HTMLElement = document.getElementById(
          virtualId.toString() + '-chordnew',
        ) as HTMLElement; //.innerHTML = "status: opened serial port";
        const delete3: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-delete',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
        const commit3: HTMLInputElement = document.getElementById(
          virtualId.toString() + '-commit',
        ) as HTMLInputElement; //.innerHTML = "status: opened serial port";

        phraseorig3.innerHTML = phraseinput3.innerHTML;
        phraseinput3.value = '';
        chordnew.innerHTML = '';
        delete3.disabled = false;
        commit3.disabled = true;
      }
    }
  }
  //await clearTimeout(myTimeout)
  await readGetOneAndToss();
}

export function pressCommitButton(virtualId: { toString: () => string }) {
  const commitButton = document.getElementById(
    virtualId.toString() + '-commit',
  );
  //const myTimeout = await setTimeout(pressCommitButton,virtualId*10000,virtualId);//Fiddle with this
  //myTimeout.
  clickCommit(virtualId);
  //clearTimeout(myTimeout);
}

export async function commitTo(virtualId) {
  const commitButton = document.getElementById(
    virtualId.toString() + '-commit',
  );
  if (commitButton.disabled == false) {
    commitButton.click();
  }
  const chordorig: HTMLElement = document.getElementById(
    virtualId.toString() + '-chordorig',
  ) as HTMLElement; //.innerHTML = "status: opened serial port";
  const phraseinput5: HTMLInputElement = document.getElementById(
    virtualId.toString() + '-phraseinput',
  ) as HTMLInputElement; //.innerHTML = "status: opened serial port";
  const hexChord = await convertHumanChordToHexadecimalChord(
    chordorig.innerHTML,
  );
  const hexPhrase = await convertHumanPhraseToHexadecimalPhrase(
    phraseinput5.value,
  );
  await sendCommandString('CML C3 ' + hexChord + ' ' + hexPhrase);
  await readGetOneAndToss();
  console.log('Done sending command');
}

export function convertHumanChordToHexadecimalChord(humanChord) {
  console.log('convertHumanChordToHexadecimalChord()');
  console.log(humanChord);
  let hexChord = '';

  const decChordParts = [];

  if (MainControls._chordmapId == 'ID CHARACHORDER X S2') {
    humanChord = humanChord.toUpperCase();
    const humanChordParts = humanChord.split(' + '); //somewhat assumes plus isn't being used; bc default is = for the +/= key
    humanChordParts.forEach((part) => {
      const actionCode = tryItAll(part);

      //const actionCode = part.charCodeAt(0); //TODO pull from actionCodesMap instead of ASCII
      actionCode == -1
        ? console.log('ActionCode does not exist')
        : decChordParts.push(actionCode);
    });
  } else {
    const humanChordParts = humanChord.split(' + '); //somewhat assumes plus isn't being used; bc default is = for the +/= key
    humanChordParts.forEach((part) => {
      const actionCode = actionMap.indexOf(part);

      //const actionCode = part.charCodeAt(0); //TODO pull from actionCodesMap instead of ASCII
      actionCode == -1
        ? console.log('ActionCode does not exist')
        : decChordParts.push(actionCode);
    });
  }

  console.log('decoded ' + decChordParts);
  decChordParts.sort(function (a, b) {
    return b - a;
  }); // This sorts the parts of the chord in descending order

  const chainIndex = 0; //to be developed later
  let binChord = pad(Dec2Bin(chainIndex), 8); //convert the chain index to binary and zero fill up to 8-bits
  for (let i = 0; i < decChordParts.length; i++) {
    if (i < 12) {
      //only support up to 12 keys
      binChord += pad(Dec2Bin(decChordParts[i]), 10); //convert the action id to binary and zero fill up to 10-bits
    }
  }
  binChord = backpad(binChord, 128); //zero backfill up to 128 bits
  console.log(binChord);

  for (let i = 0; i < 16; i++) {
    //this also limits the output to 12 keys (plus the first 8-bits reserved for the chain index)
    hexChord += pad(Bin2Hex(binChord.substring(i * 8, (i + 1) * 8)), 2);
  }
  hexChord = hexChord.toUpperCase(); //convert to all uppercase characters for hexadecimal representation
  console.log('This is the hexChord ' + hexChord);
  return hexChord;
}

export function convertHumanPhraseToHexadecimalPhrase(humanPhrase) {
  console.log('convertHumanPhraseToHexadecimalPhrase()');
  console.log(humanPhrase);
  let hexPhrase = '';

  //TODO split by ' + ' and detect if it is ascii or not
  for (let i = 0; i < humanPhrase.length; i++) {
    const actionCode = humanPhrase.charCodeAt(i); //TODO look up in actionCodeMap
    const hexPhrasePart = pad(Dec2Hex(actionCode), 2); //convert the actionCode to a hex string and pad with zeros
    hexPhrase += hexPhrasePart; //append to final hexadecimal string
  }
  hexPhrase = hexPhrase.toUpperCase(); //convert to uppercase
  console.log('This is the hex human phrase ' + hexPhrase);
  return hexPhrase;
}

export async function readGetNone() {
  console.log(' ');
}
