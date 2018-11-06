// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// import chromep from 'js/chrome-promise.js';

const chromep = new ChromePromise();

const settings = {
  default: [
    {name: 'Ig_ID', target: 'https://www.instagram.com/%s'},
    {name: 'twitter_ID', target: 'https://twitter.com/%s'},
    {name: 'Facebook_search',target: 'https://www.facebook.com/search/top/?q=%s'}
  ],
  ex: [
    {name: 'nh_搜尋/', target: 'https://nhentai.net/search/?q=%s'},
    {name: '紳士_搜尋/', target: 'https://wnacg.com/albums-index-page-1-sname-%s.html'},
    {name: 'e熊貓_搜尋/', target: 'https://e-hentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=%s'},
    {name: 'ex熊貓_搜尋/', target: 'https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=%s'},
    {name: 'nh_本/', target: 'https://nhentai.net/g/%s'},
    {name: '紳士_本_ID/', target: 'https://wnacg.com/photos-index-aid-%s.html'},
  ]
};
let page = $("#settingInput");

function getNewLine(index, item = {name:'', url:''}) {
  let nameBlock = $("<div class='col-sm-3 '></div>");
  let targetBlock = $("<div class='col-sm-6 '></div>");

  let line = $("<div class='form-group row'></div>");
  let functionBtn = $("<div class='col-sm-1 '></div>");
  let delBtn = $("<a class='btn btn-danger delete-btn'>刪除</a>");
  delBtn.click(() => {
    delBtn.parent().parent().remove();
  });

  // let cb = $("<input class='form-control' type='checkbox' />").attr("checked", item.enabled).attr("name", `enabled_${index}`);
  let name = $("<input class='form-control' placeholder='name' />").val(
      item.name).attr("name", `name_${index}`);
  let target = $("<input class='form-control' placeholder='target' />").val(
      item.target).attr("name", `target_${index}`);
  line
  .append(functionBtn.append(delBtn))
  .append(nameBlock.append(name))
  .append(targetBlock.append(target));
  return line;

}






function constructOptions() {
  //先取出資料
  chromep.storage.sync.get("allData")
  .then(storeData => {
    let allData;
    //判斷資料是否存在
    if (!!storeData && !!storeData.allData) {
      allData = storeData.allData;
    } else {
      let code = $("#code").val();
      if (!!settings[code]) {
        allData = settings[code];
      } else {
        allData = settings.default;
      }
    }

    page.empty();
    let index = 0;

    for (let item of allData) {

      page.append(getNewLine(index, item));
      index++;
    }
  })
}

//Save Btn
$("#save").click(function () {
  let allData = [];
  $("#settingInput :input").each(function (index, dom) {
    /*
    * collect input value
    * ex: name = name_1, url_1, name_2, url_2
    * */
    let name = dom.name.split("_");
    if (name.length > 1) {
      let arrayIndex = name[1];
      let data = allData[arrayIndex];
      if (!data) {
        data = {};
      }
      if (!!dom.value) {
        Object.assign(data, {[name[0]]: dom.value});
        allData[arrayIndex] = data;
      }
    }
  });

  //save option
  chromep.storage.sync
  .set({allData: allData.filter(obj => Object.keys(obj).length > 0)})
  .then(() => {
    constructOptions();
    return Promise.resolve();
  })
  .then(function () {
    let status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 1500);
  })
});
//Reset Btn
$("#reset").click(() => {
  chromep.storage.sync.clear()
  .then(() => {
    constructOptions();
    return Promise.resolve();
  })
  .then(() => {
    let status = document.getElementById('status');
    status.textContent = 'Options reset.';
    //setDefault option
    setTimeout(function () {
      status.textContent = '';
    }, 1500);
  })

});

$("#add").click(() => {
  let index = parseInt($("#settingInput :input:last").attr("name").split("_")[1]) + 1;
  console.log(index); //FIXME DEBUG LOG
  page.append(getNewLine(index));
});






//initPageSetting
document.addEventListener('DOMContentLoaded', constructOptions);
//
// $(() => {
//   addEvent()
// });
//
// function addEvent () {
//   $(".delete-btn").each((index, btn) => {
//     //delete Btn Function
//     $(btn).click(() => {
//       $(btn).parent().parent().remove();
//     })
//   })
// }
