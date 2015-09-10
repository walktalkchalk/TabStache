var tabStacheId = '0';

document.addEventListener('DOMContentLoaded', function() {
  var stashButton = document.getElementById('stashem');
  var unstashButton = document.getElementById('unstashem');
  var killstashButton = document.getElementById('killstash');

  chrome.bookmarks.search({'title':'TabStache_base'}, function(results) {
    if (results.length == 0) {
      chrome.bookmarks.getTree(function(tree){
          otherBookmarksID = tree[0].children[1].id;
          chrome.bookmarks.create({
            'parentId': otherBookmarksID,
            'title': 'TabStache_base'
          }, function(node) {
            stashButton.hide()
            destashButton.show()
            tabStacheId = node.id
          })
      })
    } else {
      tabStacheId = results[0].id + ''
    }
  });

  stashButton.addEventListener('click', function() {
    chrome.tabs.getAllInWindow(null, function(tabs) {
      for (var i in tabs) {
        chrome.bookmarks.create({
              'parentId': tabStacheId,
              'title': tabs[i].title,
              'url': tabs[i].url})
      }
    })
  });

  unstashButton.addEventListener('click', function() {
      chrome.bookmarks.getChildren(tabStacheId, function(children) {
         children.forEach(function(bookmark) {
           chrome.tabs.create({url: bookmark.url})
         });
      });
  }, false);

  killstashButton.addEventListener('click', function() {
      chrome.bookmarks.removeTree(tabStacheId);
  }, false);
}, false);
