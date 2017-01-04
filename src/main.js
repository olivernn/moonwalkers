var json = require('json!./../build/index.json'),
    corpus = require('json!./../build/corpus.json'),
    lunr = require('lunr'),
    wrapper = require('./wrapper.js')

var idx = lunr.Index.load(json)

var documents = corpus.reduce(function (memo, doc) {
  memo[doc.id] = doc
  return memo
}, {})

window.corpus = corpus
window.idx = idx

var buildSearchResult = function (doc) {
  var li = document.createElement('li'),
      article = document.createElement('article'),
      header = document.createElement('header'),
      section = document.createElement('section'),
      h2 = document.createElement('h2'),
      p = document.createElement('p')

  h2.dataset.field = 'name'
  h2.textContent = doc.name

  p.dataset.field = 'body'
  p.textContent = doc.body

  li.appendChild(article)
  article.appendChild(header)
  article.appendChild(section)
  header.appendChild(h2)
  section.appendChild(p)

  return li
}

var displayQueryError = function (queryText, error) {
  var message = document.createElement('p'),
      container = document.querySelector('.query-error')

  message.classList.add('message')
  message.textContent = error.message

  container.appendChild(message)
}

var clearQueryError = function () {
  var container = document.querySelector('.query-error')

  while (container.firstChild) {
    container.removeChild(container.firstChild)
  }
}

var searchForm = document.querySelector('#search-form'),
    searchField = searchForm.querySelector('input')

searchForm.addEventListener('reset', function (event) {
  clearQueryError()

  var ol = document.querySelector('ol')

  while (ol.firstChild) {
    ol.removeChild(ol.firstChild)
  }

  Object.keys(documents).forEach(function (id) {
    var doc = documents[id],
        li = buildSearchResult(doc)

    ol.appendChild(li)
  })
})

searchForm.addEventListener('submit', function (event) {
  event.preventDefault()
  clearQueryError()

  var query = searchField.value,
      results = undefined,
      ol = document.querySelector('ol')

  try {
    results = idx.search(query)
  } catch(e) {
    if (e instanceof lunr.QueryParseError) {
      displayQueryError(query, e)
      return
    } else {
      throw e
    }
  }

  while (ol.firstChild) {
    ol.removeChild(ol.firstChild)
  }

  results.forEach(function (result) {
    var doc = documents[result.ref],
        li = buildSearchResult(doc)

    Object.keys(result.matchData.metadata).forEach(function (term) {
      Object.keys(result.matchData.metadata[term]).forEach(function (fieldName) {
        var field = li.querySelector('[data-field=' + fieldName + ']'),
            positions = result.matchData.metadata[term][fieldName].position

        wrapper(field, positions)
      })
    })

    ol.appendChild(li)
  })
})
