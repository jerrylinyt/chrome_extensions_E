// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// import chromep from 'js/chrome-promise.js';

const chromep = new ChromePromise();
const defaultSetting = [];
let page = $("#settingInput");



function constructOptions() {
  //先取出資料
  chromep.storage.sync.get("allData")
  .then(storeData => {
    let allData;
    //判斷資料是否存在
    if (!!storeData && !!storeData.allData) {
      allData = storeData.allData;
    } else {
      allData = defaultSetting
    }

    page.empty();

    let index = 0;
    let cbBlock = $("<div class='col-sm-1 '></div>");

    let nameBlock = $("<div class='col-sm-3 '></div>");
    let targetBlock = $("<div class='col-sm-6 '></div>");
    for (let item of allData) {
      let line = $("<div class='form-group row'></div>");
      let cb = $("<input class='form-control' type='checkbox' />").attr("checked", item.enabled).attr("name", `enabled_${index}`);

      let name = $("<input class='form-control' placeholder='name' />").val(item.name).attr("name", `name_${index}`);
      let target = $("<input class='form-control' placeholder='target' />").val(item.target).attr("name", `target_${index}`);
      line
      // .append(cbBlock.clone().append(cb))
      .append(nameBlock.clone().append(name))
      .append(targetBlock.clone().append(target));
      page.append(line);
      index++;
    }
  })
}

//儲存按鈕
$("#save").click(function () {
  let allData = [];
  $("#settingInput :input").each(function(index, dom) {
    let name = dom.name.split("_");
    if (name.length > 1) {
      let data = allData[name[1]];
      if (!data) {
        data = {};
      }
      Object.assign(data, {[name[0]]: dom.value});
      allData[name[1]] = data;

    }
  });

  chromep.storage.sync
  .set({allData:allData})
  .then(function() {
    let status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 1500);
  })
});
document.addEventListener('DOMContentLoaded', constructOptions);
