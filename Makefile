ES_URI='http://elastic_search_address_here:9200/'

build:
	pip install -r requirements.txt
	npm install

index:
	cd scripts && ES_URI=$(ES_URI) && python index_elastic_search.py

run:
	ELASTIC_URL=$(ES_URI) npm start
