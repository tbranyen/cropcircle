define(function(require, module, exports) {
  var combyne = require('combyne');
  var $ = require('jquery');

  require('diffhtml');

  // Preload all the pages used.
  require('../../views/pages/index.html');

  var main = $('main');
  var views = '../../views/';
  var pages = views + 'pages/';

  function pageChange(name) {
    var loc = pages + name + '.html';
    var template = dynamicRequire(loc);

    document.documentElement.outerDiffHTML = template.render({
      title: name
    });
  }

  $.getJSON('/pages').then(function(pages) {
    $(window).on('popstate', function(ev) {
      var href = location.pathname.slice(1);
      var page = pages.indexOf(href);

      if (href && page > -1) {
        pageChange(pages[page])
      }
    });

    $('body').on('click', 'a', function(ev) {
      var href = $(ev.currentTarget).attr('href').slice(1);
      var page = pages.indexOf(href);

      if (href && page > -1) {
        ev.preventDefault();
        window.history.pushState(null, '', '/' + href);
        pageChange(pages[page])
      }
    });
  });
});
