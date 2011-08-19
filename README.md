*NOTE:* The code in this repository does not currently match that found on www.jstat.org. We are in the 
process of merging two similar projects and will update the website once the merge is complete. 


[jStat](http://www.jstat.org/) - JavaScript Statistical Library
===============================================================

Build Prerequisites
-------------------

In order to build jStat, you need to have GNU make 3.8 or later, Node.js 0.2 or later, and git 1.7 or later.
(Earlier versions might work OK, but are not tested.)

Windows users have two options:

1. Install [msysgit](https://code.google.com/p/msysgit/) (Full installer for official Git),
   [GNU make for Windows](http://gnuwin32.sourceforge.net/packages/make.htm), and a
   [binary version of Node.js](http://node-js.prcn.co.cc/). Make sure all three packages are installed to the same
   location (by default, this is C:\Program Files\Git).
2. Install [Cygwin](http://cygwin.com/) (make sure you install the git, make, and which packages), then either follow
   the [Node.js build instructions](https://github.com/ry/node/wiki/Building-node.js-on-Cygwin-%28Windows%29) or install
   the [binary version of Node.js](http://node-js.prcn.co.cc/).

Mac OS users should install Xcode (comes on your Mac OS install DVD, or downloadable from
[Apple's Xcode site](http://developer.apple.com/technologies/xcode.html)) and
[http://mxcl.github.com/homebrew/](Homebrew). Once Homebrew is installed, run `brew install git` to install git,
and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install make, git, and node, or build from source
if you swing that way.


Building jStat
--------------

First, clone a copy of the jStat git repo by running `git clone git://github.com/jstat/jstat.git`.

Then, to get a complete, minified, jslinted version of jStat, simply `cd` to the `jstat` directory and type
`make`. If you don't have Node installed and/or want to make a basic, uncompressed, unlinted version of jstat, use
`make jstat` instead of `make`.

The built version of jStat will be put in the `dist/` subdirectory.

Generate just the documentation by running `make doc`. Documentation will be placed in `dist/docs` by default.

To remove all built files, run `make clean`.


Building to a different directory
---------------------------------

If you want to build jStat to a directory that is different from the default location, you can specify the PREFIX
directory: `make PREFIX=/home/jstat/test/ [command]`

With this example, the output files would end up in `/home/jstat/test/dist/`.
