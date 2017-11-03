# Seneral Developer Website
This is my developer website.
It's built to be lightweight, with as few scripts as possible. 
It is responsive, mobile-first and can work without javascript.

In order to make maintaining the website easier I developed an executable tool that places the page content into a html 'frame' and replaces other generic code. It watches for changes on the source files and rebuilds the website into the build folder.
The SOURCE folder includes the pages with their content, divided in HeadLinks (links found in the header), Banner (for images and slideshow at the top of the page), Content (for all text content) and Scripts (loaded at the end of the page). Filling these regions in puts them into their respective position in the html frame.
The BUILD folders contains only additional resources (anything other than the html files in the source folder) like images, css, javascript or additional, inconsistent html pages.

In config.txt you can adjust some options aswell as specify new replacement rules (between the curly braces).

Only used tools and libraries are <a href="http://unslider.com/">Unslider</a> for the slider, <a href="https://modernizr.com/">Modernizr</a> for some conditional CSS and features and of course <a href="https://jquery.com/">jQuery</a>.

This page is for reference only. You may not redistribute or use this in any way without my explicit permission. Only exception is the HTML_PageBuilder executable tool, which you may use in any way for your own projects.
