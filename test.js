const datasrc = 'https://th.wallhaven.cc/small/4l/4lvjk2.jpg'
const datasrcs = datasrc.split('/');
datasrcs[datasrcs.length-1] = 'wallhaven-' + datasrcs[datasrcs.length-1]
let src = datasrcs.join('/')
src = src.replace(/th\.wallhaven\.cc\/small/, 'w.wallhaven.cc/full')
