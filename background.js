// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const chromep = new ChromePromise();

chromep.storage.sync.get("allData")
.then(function (storeData) {
  chrome.extension.getBackgroundPage().console.log(storeData);




  if (!!storeData && !!storeData.allData) {
    storeData.allData.forEach(function (data, index) {
      chrome.contextMenus.create({
        "title": data.name + "%s",
        "contexts": ["all"],
        "onclick": function (info, tab) {
          chrome.tabs.create({
            url: data.target.replace("%s", info.selectionText)
          })
        }
      });
    })

  }
  chrome.contextMenus.create({
    "title": "設定頁",
    "contexts": ["all"],
    "onclick": function (info, tab) {
      chrome.tabs.create({ url: "options.html" });
    }
  });

});