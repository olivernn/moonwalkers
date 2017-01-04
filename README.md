# Moonwalkers

A demo site to show off some features of Lunr 2.

Short bios on every person to have walked on the moon are indexed and made searchable by Lunr.

## Features

* Search term highlighting
* More advances query capabilities
* Improved searching performance
* Smaller index size

## Usage

This is intended as a demo only, and the site itself is quite basic. The source should give some pointers in using Lunr 2, more comprehensive documentation and guides will be made available before the full release of Lunr 2.

### Building an Index

In Lunr 2 all search indexes are static and immutable. In this site the index is built ahead of time using the script in `build-index`.

### Searching the Index

The basic search interface is largely unchanged from previous versions of Lunr, the details of searching can be seen in `src/main.js`.

### Highlighting Results

The index includes the positions of all terms, and this data is used by `src/wrapper.js` to highlight search results.

## Building

The build is automated using rake, to re-create the site run `rake` from the project directory.
