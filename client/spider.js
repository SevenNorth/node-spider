import axios from "axios";
import cheerio from "cheerio";
import path from 'node:path';
import fs from 'node:fs';

class Spider {

    constructor(props) {
        this.base_url = props.base_url; // 要爬取的网站
        this.current_page = 1;
        this.result_list = [];
        this.maxPage = props.maxPage; // 最大页数
    }

    async init() {
        try {
            await this.getPicLinks();
            await this.downLoadPictures();
        } catch (e) {
            console.log(e);
        }
    }

    async getPicLinks() {
        try {
            for(let page = 1; page <= this.maxPage; page++){
                console.log(`开始抓取第${page}页图片链接`)
                await this.getPageData(this.base_url + page);
                console.log(`第${page}页图片链接抓取完成`)
                await this.sleep(3000 * Math.random());
            }
            return Promise.resolve();
        } catch (e) {
            Promise.reject(e);
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

    async getPageData(href) {
        const target_url = href;
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
                result_list.push(src);
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
                await this.downLoadPicture(result_list[i]);
                console.log(`第${i + 1}张图片下载成功!`);
                await this.sleep(3000 * Math.random());
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
            const reg = /\.png/
            if(reg.test(href)){
                return Promise.reject(e)
            }else{
                await this.jpg2png(href);
            }
        }
    }

    async jpg2png(href) {
        try {
            const href4png = href.replace(/\.jpg/, '.png')
            await this.downLoadPicture(href4png)
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e)
        }
    }

}
// module.exports = Spider;
export default Spider;