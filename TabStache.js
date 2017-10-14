const TabStache = {
  new_stache: null,
  submit_buttom: null,
  stache_list: null,
  tabStacheId: 0,
  chromeBookmarkObj: null,
  chromeTabsObj: null,

  /**
   * @member {Object} DOMApi An object that implements the
   * DOM document API
   */
  DOMApi: null,

  initializeEmptyStache: (chromeBookmarkObj) => {
    chromeBookmarkObj.getTree((tree) => {
      const otherBookmarksID = tree[0].children[1].id;
      this.chromeBookmarkObj.create({
        'parentId': otherBookmarksID,
        'title': 'TabStache_base'
      }, (node) => {
        this.tabStaceId = node.id;
      });
    });
  },

  populateStacheList: (results) => {
    this.tabStacheId = results[0].id;
    this.chromeBookmarkObj.getChildren((children) => {
      children.forEach((bookmark) => {
        let stache = document.createElement('button');
        stache.setAttribute('value', bookmark.id);
        stache.setAttribute('class', 'stache');
        stache.addEventListener('click', this.unload_stache);
        stache.appendChild(document.createTextNode(bookmark.title));
        let li = document.createElement('article');
        li.appendChild(stache);
        this.stache_list.appendChild(li);
      });
    });
  },

  /**
   * @param {Object} chromeBookmarkObj An object that implements the
   * interface of chrome bookmark object
   */
  genSearchResult: (chromeBookmarkObj) => {
    return (results) => {
      if (results.length === 0) {
        this.initializeEmptyStache(chromeBookmarkObj);
      } else {
        this.populateStacheList();
      }
    };
  },

  add_stache: () => {
    this.chromeBookmarkObj.create({
      'parentId': this.tabStacheId,
      'title': this.new_stache.value
    },this.load_stache);
    this.new_stache.value = "";
  },

  load_stache: (node) => {
    this.chromeTabsObj.getAllInWindow(null, (tabs) => {
      let urls = tabs.map(tab => tab.url);
      for (let i in tabs) {
        // some tabs should be ignored
        // 1. ignore dublicate tabs
        if (urls.indexOf(tabs[i].url) < i) {
          this.chromeTabsObj.remove(tabs[i].id);
          continue;
        }
        // 2. ignore some specified types of tabs
        if (tabs[i].url.startsWith("chrome-extension://") || tabs[i].url.startsWith("chrome://") || tabs[i].url.startsWith("about:blank")) {
          this.chromeTabsObj.remove(tabs[i].id);
          continue;
        }
        this.chromeBookmarkObj.create({
          'parentId': node.id,
          'title': tabs[i].title,
          'url': tabs[i].url
        });
        this.chromeTabsObj.remove(tabs[i].id);
      }
      this.chromeTabsObj.create({ 'url': 'about:blank' });
    });
  },

  unload_stache: () => {
    const self = this;
    return () => {
      self.chromeBookmarkObj.getChildren(this.value, (children) => {
        children.forEach((bookmark) => {
          self.chromeTabsObj.create({
            url: bookmark.url
          });
        });
        self.chromeBookmarkObj.removeTree(this.value);
      });
    };
  },

  listenNewStache: (event, cb) => {
    this.new_stache.addEventListener(event, cb);
  },

  listenSubmitButton: (event, cb) => {
    this.submit_buttom.addEventListener(event, cb);
  },

  setCacheList: (stacheList) => {
    this.stache_list = stacheList;
  },

  setNewStache: (newStache) => {
    this.new_stache = newStache;
  },

  setSubmitButton: (submitButton) => {
    this.submit_button = submitButton;
  },

  setChromeBookmarks: (chromeBookmarks) => {
    this.chromeBookmarkObj = chromeBookmarks;
  },
  
  setChromeTabs: (chromeTabs) => {
    this.chromeTabsObj = chromeTabs;
  }
};

if (typeof window !== 'undefined' && typeof module !== 'undefined' && module.exports) {
  module.exports = TabStache;
}
