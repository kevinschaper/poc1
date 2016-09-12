ES_URI=http://localhost:9200/

build:
	pip install -r requirements.txt
	npm install

index:
	cd scripts && ES_URI=$(ES_URI) python index_elastic_search.py

run:
	ELASTIC_URL=$(ES_URI) npm start
