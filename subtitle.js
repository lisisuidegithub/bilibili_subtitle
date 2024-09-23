// ==UserScript==
// @name         自动打开哔哩哔哩字幕
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动打开哔哩哔哩字幕，只在有播放列表时开启，方便看课程，不需要每次都点击字幕
// @author       lisisuidegithub
// @match        https://www.bilibili.com/video/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        none
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    let subtitleOpened = false; // 增加标志位，确保只点击一次字幕按钮
    let interval; // 声明轮询变量

    // 等待页面完全加载完毕后执行脚本
    window.onload = function() {
        let lastUrl = window.location.href; // 存储上一个 URL

        // 初始检测播放列表和字幕
        checkAndOpenSubtitle();

        // 监听 DOM 变化
        const observer = new MutationObserver(() => {
            const currentUrl = window.location.href;

            // 检查 URL 是否发生变化
            if (currentUrl !== lastUrl) {
                console.log('URL发生变化');
                lastUrl = currentUrl; // 更新上一个 URL

                subtitleOpened = false; // 重置标志位
                clearInterval(interval); // 停止当前轮询
                checkAndOpenSubtitle(); // 重新检测播放列表和字幕
            }
        });

        // 开始观察 DOM 变化，监听整个页面的变化
        observer.observe(document.body, { childList: true, subtree: true });

        function checkAndOpenSubtitle() {
            // 检测是否存在 ul.list-box 元素（播放列表）
            const listBox = document.querySelector('ul.list-box');
            if (listBox) {
                console.log('存在播放列表');
                clearInterval(interval); // 确保清除旧的轮询
                waitForSubtitleButton();
            }
        }

        // 轮询检测列表和字幕
        function waitForSubtitleButton() {
            const maxAttempts = 10; // 设置最大尝试次数
            let attempts = 0;

            interval = setInterval(() => {
                const subtitleButton = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-subtitle[aria-label="字幕"] .bpx-player-ctrl-btn-icon .bpx-common-svg-icon');

                if (subtitleButton && !subtitleOpened) { // 判断字幕是否已开启
                    console.log('找到字幕按钮，正在点击...');
                    subtitleButton.click(); // 点击字幕按钮
                    subtitleOpened = true; // 设置标志位，表示字幕已开启
                    clearInterval(interval); // 找到字幕按钮后停止轮询
                    console.log('字幕已开启，停止轮询');
                } else {
                    attempts++;
                    console.log(`尝试 ${attempts} 次，还未找到字幕按钮`);

                    if (attempts >= maxAttempts) {
                        clearInterval(interval); // 超过最大尝试次数后停止轮询
                        console.log('超过最大尝试次数，未找到字幕按钮');
                    }
                }
            }, 1000); // 每秒检测一次字幕按钮
        }
    };
})();
