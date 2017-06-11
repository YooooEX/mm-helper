// ==UserScript==
// @name         MM商城应用信息获取
// @namespace    https://yooooex.com/
// @version      0.4
// @description  自动复制应用名称,应用ID,开发者,版本号,快速搜索检查是否为商城应用
// @author       YooooEX
// @match        http://mm.10086.cn/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    var storageKey = "_appData";
    $(document).ready(function () {
        console.log("ready");

        if (window.location.pathname.match("android")) {
            _getAppInfos();
        } else {
            var infos = localStorage.getItem(storageKey).split(";");
            var appID = infos[1];
            if (appID === null) {
                console.log("ERROR: null application ID !");
            } else {
                findApp(appID);
            }
        }
    });
    /**
     * 获取应用信息
     */
    function _getAppInfos() {
        var regex_infos = /：.*$/;
        var app = {};
        app.name = $('.mj_big_title').find("span").attr("title");
        app.id = window.location.pathname.match(/\d+/);
        app.version = $(".mj_info.font-f-yh li:eq(2)").text().match(regex_infos).toString().replace("：", "");
        app.dev = $(".mj_info.font-f-yh li:eq(4)").text().match(regex_infos).toString().replace("：", "");
        var res = app.name + ";" + app.id + ";" + app.dev + ";" + "MM商城;" + app.name + ".apk;" + app.version;
        // 存储应用信息
        localStorage.setItem(storageKey, res);
        console.log("stored info: " + res);

        // 显示获取的信息
        var helper = document.getElementById("_helper");
        var target = "http://mm.10086.cn/searchapp?st=0&q=";
        if (!helper) {
            helper = document.createElement("div");
            helper.id = "_helper";
            helper.style.position = "absolute";
            helper.style.left = "0px";
            helper.style.top = "0px";
            helper.style.width = "450px";

            var infos = document.createElement("textarea");
            infos.id = "_infos";
            infos.style.width = "400px";
            infos.style.verticalAlign = "top";
            infos.value = res;

            var checkBtn = document.createElement("button");
            checkBtn.textContent = "检查";
            checkBtn.addEventListener("click", function () { window.open(target + app.name); });

            document.body.appendChild(helper);
            helper.appendChild(infos);
            helper.appendChild(checkBtn);
            infos.focus();
            infos.select();

            if (document.execCommand("copy", false, null)) {
                console.log("copy success");
            } else {
                console.log("copy fail");
            }
        }
    }
    /**
     * 查找应用
     * @param appID 应用ID
     */
    function findApp(appID) {
        // ES6 Template literals https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
        console.log("Working with id: " + appID);
        var selector = `a[href*='${appID}']`;
        var target = $(selector).parent(".content_list_cont_real_i").css("background", "#FF0000");
        if (target != null) {
            // 移动到应用
            $('html,body').animate({
                scrollTop: $(target).offset().top
            }, 300);
        } else {
            alert("app not found!");
        }
    }
})();
