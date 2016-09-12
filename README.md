# Elasticsearch Node.js Example
Small project to get started using searchkit. Webpack, es6 (es2015 babel)

## Steps
* npm install
* npm start
* visit http://localhost:3000

Note:  the default elasticsearch address is `http://localhost:9200`, so if you want to use a different address run

    $ ELASTIC_URL=http://yourserver.net:9200 npm start

## Indexing Data to local elasticsearch instance

First, install and run elasticsearch on `http://localhost:9200` by following the instructions at [https://www.elastic.co/guide/en/elasticsearch/guide/current/running-elasticsearch.html](https://www.elastic.co/guide/en/elasticsearch/guide/current/running-elasticsearch.html).

Next, install the python dependencies (the indexing script is in python) by running 

    $ make build

To index the data, run

    $ make index
