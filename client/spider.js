import axios from "axios";
import cheerio from "cheerio";
import path from 'node:path';
import fs from 'node:fs';

class Spider {

    constructor(url) {
        this.base_url = url; //要爬取的网站
        this.current_page = 1;
        this.result_list = [];
    }

    async init() {
        try {
            await this.getPageData();
            await this.downLoadPictures();
        } catch (e) {
            console.log(e);
        }
    }

    sleep(time) {
        return new Promise((resolve) => {
            console.log(`自动睡眠中，${time / 1000}秒后重新发送请求......`)
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    async getPageData() {
        const target_url = this.base_url;
        try {
            const res = await axios.get(target_url);
            const html = res.data;
            const $ = cheerio.load(html);
            const result_list = [];
            $('.lazyload').each((index, element) => {
                const datasrc = $(element).attr('data-src');
                const datasrcs = datasrc.split('/');
                datasrcs[datasrcs.length - 1] = 'wallhaven-' + datasrcs[datasrcs.length - 1];
                let src = datasrcs.join('/');
                src = src.replace(/th\.wallhaven\.cc\/small/, 'w.wallhaven.cc/full')
                result_list.push({
                    down_loda_url: src,
                });
            });
            this.result_list.push(...result_list);
            return Promise.resolve(result_list);
        } catch (e) {
            console.log('获取数据失败');
            return Promise.reject(e);
        }
    }

    async downLoadPictures() {
        const result_list = this.result_list;
        try {
            for (let i = 0, len = result_list.length; i < len; i++) {
                console.log(`开始下载第${i + 1}张图片!`);
                await this.downLoadPicture(result_list[i].down_loda_url);
                await this.sleep(3000 * Math.random());
                console.log(`第${i + 1}张图片下载成功!`);
            }
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async downLoadPicture(href) {
        try {
            const target_path = path.resolve(path.dirname('./'), `./cache/${href.split('/').pop()}`);
            const response = await axios.get(href, {
                responseType: 'stream'
            });
            await response.data.pipe(fs.createWriteStream(target_path));
            console.log('写入成功');
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e)
        }
    }

}
// module.exports = Spider;
export default Spider;