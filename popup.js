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
          stache.addEventListener('click', function() {
            console.log(stache.value);
            chrome.bookmarks.getChildren(stache.value, function(children) {
               children.forEach(function(bookmark) {
                 chrome.tabs.create({url: bookmark.url})
               });
               chrome.bookmarks.removeTree(stache.value);
            });
          });
          stache.appendChild(document.createTextNode(bookmark.title))
          stache_list.appendChild(stache)
        });
      });
    }
  });

  new_stache.addEventListener('keyup', function (e) {
    if ((e.keyCode == 13) && (new_stache.value)) {
      console.log(new_stache.value);
      chrome.bookmarks.create({
        'parentId': tabStacheId,
        'title': new_stache.value
      }, function(node) {
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
      })
      new_stache.value = "";
    }
  });

}, false);
