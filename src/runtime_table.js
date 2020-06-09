/**
 * @license
 * Copyright 2017 The Emscripten Authors
 * SPDX-License-Identifier: MIT
 */

#if STANDALONE_WASM // standalone wasm creates the table in the wasm
var wasmTable;
#else
var wasmTable = new WebAssembly.Table({
  'initial': {{{ getQuoted('WASM_TABLE_SIZE') }}},
#if !ALLOW_TABLE_GROWTH
  'maximum': {{{ getQuoted('WASM_TABLE_SIZE') }}},
#endif
  'element': 'anyfunc'
});
#endif

// TODO(sbc): Avoid this gross hack using `rest` ES6 operator once we
// enable ES6: https://github.com/emscripten-core/emscripten/issues/11984
// function tableCall(ptr, ...args) {
//  return wasmTable.get(ptr).apply(null, args);
// }
var tableCallArgs = [];
function tableCall(ptr) {
  tableCallArgs.length = arguments.length - 1;
  for (var i = 1; i < arguments.length; i++) {
    tableCallArgs[i - 1] = arguments[i];
  }
  return wasmTable.get(ptr).apply(null, tableCallArgs);
}
