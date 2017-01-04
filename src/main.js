var json = require('json!./index.json'),
    corpus = require('json!./../build/corpus.json'),
    lunr = require('./lunr.js'),
    wrapper = require('./wrapper.js')

var idx = lunr.Index.load(json)

  window.corpus = corpus
window.idx = idx

var searchForm = document.querySelector('#search-form'),
    searchField = searchForm.querySelector('input')

searchForm.addEventListener('submit', function (event) {
  event.preventDefault()
  var query = searchField.value,
      results = idx.search(query)


  results.forEach(function (result) {
    var article = document.querySelector('[data-bio-id=' + result.ref + ']')

    Object.keys(result.matchData.metadata).forEach(function (fieldName) {
      console.log(fieldName)
      var field = article.querySelector('[data-field=' + fieldName + ']'),
          positions = result.matchData.metadata[fieldName].position

      wrapper(field, positions)
    })
  })

  console.log(results)
})

var ignoreWhiteSpace = {
  acceptNode: function (node) {
    if (/^[\t\n\r ]*$/.test(node.nodeValue)) {
      return NodeFilter.FILTER_SKIP
    }
    return NodeFilter.FILTER_ACCEPT
  }
}

window.getTextNodes = function (element, fn) {
  var node = null
  var walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    ignoreWhiteSpace,
    false
  )

  while (node = walker.nextNode()) {
    fn(node)
  }
}