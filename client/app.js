import Spider from './spider.js'
import path from 'node:path';

const spider = new Spider({
    base_url: 'https://wallhaven.cc/toplist?page=',
    maxPage: 1,
    target_dir: 'toplist/'
});
spider.init();