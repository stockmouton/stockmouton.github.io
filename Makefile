###
# Articles
###
ARTICLES_DIR = articles
ARTICLES := $(filter-out articles/README.md,$(shell find $(ARTICLES_DIR) -name '*.md'))

.PHONY: hyperinflation articles

inflation:
	pandoc --standalone --mathjax -f markdown -t html --metadata title="$@" articles/$@.md -o articles/$@.html

articles: $(ARTICLES)
	$(foreach file,$^,pandoc \
		--standalone \
		--mathjax \
		--highlight-style espresso \
		-f markdown \
		-t html \
		--metadata title="$(notdir $(basename $(file)))" \
		$(file) -o $(file:.md=.html);\
	)