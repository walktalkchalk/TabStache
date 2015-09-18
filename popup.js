var tabStacheId = '0';

document.addEventListener('DOMContentLoaded', function() {
  var new_stache = document.getElementById('new_stache')
  var stache_list = document.getElementById('stache_list')

  chrome.bookmarks.search({'title':'TabStache_base'}, function(results) {
    if (results.length == 0) {
      chrome.bookmarks.getTree(function(tree){
          otherBookmarksID = tree[0].children[1].id;
          chrome.bookmarks.create({
            'parentId': otherBookmarksID,
            'title': 'TabStache_base'
          }, function(node) {
            tabStacheId = node.id
          })
      })
    } else {
      tabStacheId = results[0].id + ''
      chrome.bookmarks.getChildren(tabStacheId, function(children) {
        children.forEach(function(bookmark) {
          var stache = document.createElement('button')
          stache.setAttribute('value', bookmark.id)
          stache.addEventListener('click', unload_stache);
          stache.appendChild(document.createTextNode(bookmark.title))
          stache_list.appendChild(stache)
        });
      });
    }
  });

  new_stache.addEventListener('keyup', function (e) {
    if ((e.keyCode == 13) && (new_stache.value)) {
      chrome.bookmarks.create({
        'parentId': tabStacheId,
        'title': new_stache.value
      }, load_stache)
      new_stache.value = "";
    }
  });

  function load_stache(node) {
    chrome.tabs.getAllInWindow(null, function(tabs) {
      chrome.tabs.create({});
      for (var i in tabs) {
        chrome.bookmarks.create({
          'parentId': node.id,
          'title': tabs[i].title,
          'url': tabs[i].url})
        chrome.tabs.remove(tabs[i].id);
      }
    })
  };

  function unload_stache() {
    _this = this;
    chrome.bookmarks.getChildren(this.value, function(children) {
       children.forEach(function(bookmark) {
         chrome.tabs.create({url: bookmark.url})
       });
       chrome.bookmarks.removeTree(_this.value);
    });
  };
}, false);
