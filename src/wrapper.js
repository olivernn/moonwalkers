module.exports = function (element, matches) {

  var nodeFilter = {
    acceptNode: function (node) {
      if (/^[\t\n\r ]*$/.test(node.nodeValue)) {
        return NodeFilter.FILTER_SKIP
      }
      return NodeFilter.FILTER_ACCEPT
    }
  }

  var index = 0,
      match = matches.shift()
      walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        nodeFilter,
        false
      )

  while (node = walker.nextNode()) {
    if (match == undefined) break

    var text = node.textContent
        nodeEndIndex = index + node.length

    debugger

    if (match[0] < nodeEndIndex) {
      var range = document.createRange(),
          tag = document.createElement('i'),
          rangeStart = match[0] - index,
          rangeEnd = rangeStart + match[1]

      console.log(text.slice(rangeStart, rangeEnd))

      range.setStart(node, rangeStart)
      range.setEnd(node, rangeEnd)
      range.surroundContents(tag)

      index = match[0] + match[1]

      // the next node will now actually be the text we just wrapped, so
      // we need to skip it
      console.log(walker.nextNode())
      match = matches.shift()
    } else {
      index = nodeEndIndex
    }
  }
}
