'use strict';
const electron                  = require('electron');
const { remote, ipcRenderer }   = electron;
const { Menu }                  = remote;

// const InputMenu = Menu.buildFromTemplate([{
//         label: 'Undo',
//         role: 'undo',
//     }, {
//         label: 'Redo',
//         role: 'redo',
//     }, {
//         type: 'separator',
//     }, {
//         label: 'Cut',
//         role: 'cut',
//     }, {
//         label: 'Copy',
//         role: 'copy',
//     }, {
//         label: 'Paste',
//         role: 'paste',
//     }, {
//         type: 'separator',
//     }, {
//         label: 'Select all',
//         role: 'selectall',
//     },
// ]);

const InputMenu = Menu.buildFromTemplate([{
        label: 'Paste',
        role: 'paste',
    }
]);

document.body.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();

    let node = e.target;

    while (node) {
        if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
            InputMenu.popup(remote.getCurrentWindow());
            break;
        }
        node = node.parentNode;
    }
});
document.body.addEventListener('paste', (e) => {
    const paste = (e.clipboardData || window.clipboardData).getData('text');
    ipcRenderer.send('Clipboard:paste', paste);
});