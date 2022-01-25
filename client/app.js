import Spider from './spider.js'
import path from 'node:path';

const spider = new Spider({
    base_url: 'https://wallhaven.cc/random?seed=n3Jyc7&page=',
    maxPage: 10,
});
spider.init();