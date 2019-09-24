# Seneral Developer Website
First attempt at a responsive, mobile-first website (or any website for that matter)
Has some unfortunate js dependencies that weren't needed in hindsight, but generally works without JS.

In order to make maintaining the website easier I developed an python build script that places the page content into a html 'frame' and replaces other generic code. It watches for changes on the source files and rebuilds the website into the build folder.
The SOURCE folder includes the pages with their content, divided in HEAD (links/meta found in the header), BANNER (for images and slideshow at the top of the page), SIDE (for side panels), CONTENT (for all text content) and SCRIPTS (loaded at the end of the page). Filling these regions in puts them into their respective position in the html frame.
The BUILD folders contains only additional resources (anything other than the html files in the source folder) like images, css, javascript or additional, inconsistent html pages.

config.json controls options and replacement rules:
1. Simple replacement rule: match (simple) replaced by value - $CURPAGE is replaced with current page path
2. Fetch rule: match (simple) replaced by value selected (regex) out of source (path to file)

Dependencies:
- <a href="http://unslider.com/">Unslider</a> for the slider
- <a href="https://modernizr.com/">Modernizr</a> for some conditional CSS and features
- <a href="https://jquery.com/">jQuery</a> for unslider
