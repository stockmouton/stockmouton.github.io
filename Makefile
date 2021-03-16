###
# Articles
###
.PHONY: hyperinflation
hyperinflation:
	pandoc --toc --standalone --mathjax -f markdown -t html articles/$@.md -o articles/$@.html