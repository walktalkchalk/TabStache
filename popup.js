'use strict';

document.addEventListener('DOMContentLoaded', () => {
  let stache = TabStache;
  stache.setNewStache(document.getElementById('new_stache'));
  stache.setSubmitButton(document.getElementById('submit_button'));
  stache.setCacheList(document.getElementById('stache_list'));
  stache.setChromeBookmarks(chrome.bookmarks);
  stache.setChromeTabs(chrome.tabs);
  chrome.bookmarks.search({
      'title': 'TabStache_base'
  }, stache.genSearchResult());

  stache.listenNewStache('keyup', (e) => {
    if ((e.keyCode == 13) && (stache.new_stache.value)) {
      stache.add_stache();
    }
  });

  stache.listenSubmitButton('click', function() {
    if (stache.new_stache.value) {
      stache.add_stache();
    }
  });
}, false);
