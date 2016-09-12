from elasticsearch import Elasticsearch
from mapping import mapping
import os
import requests

INDEX_NAME = 'searchable_items'
DOC_TYPE = 'searchable_item'
ES_ADDRESS = os.environ['ES_URI']
es = Elasticsearch(ES_ADDRESS, retry_on_timeout=True)

def delete_mapping():
    print "Deleting mapping..."
    response = requests.delete(ES_ADDRESS + INDEX_NAME + "/")
    if response.status_code != 200:
        print "ERROR: " + str(response.json())
    else:
        print "SUCCESS"        

def put_mapping():
    print "Putting mapping... "
    response = requests.put(ES_ADDRESS + INDEX_NAME + "/", json=mapping)
    if response.status_code != 200:
        print "ERROR: " + str(response.json())
    else:
        print "SUCCESS"

def index_mine_genes(mine_dump_file, schema, organism):
    genes = 0

    with open(mine_dump_file, 'r') as f:
        next(f)

        bulk_data = []
        
        for line in f:
            content = line.split('\n')[0].split('\t')

            obj = {}
            for field in schema.keys():
                if str(content[schema[field]]) != '""':
                    obj[field] = content[schema[field]].decode('utf-8')
                else:
                    obj[field] = ''

            obj['organism'] = organism
            obj['href'] = 'http://www.ncbi.nlm.nih.gov/gene/' + obj['primary_id']

            bulk_data.append({
                'index': {
                    '_index': INDEX_NAME,
                    '_type': DOC_TYPE,
                    '_id': organism + "/" + obj['primary_id']
                }
            })

            bulk_data.append(obj)
            
            genes += 1

            if genes % 500 == 0:
                es.bulk(index=INDEX_NAME, body=bulk_data, refresh=True)
                bulk_data = []

        if len(bulk_data) > 0:
            es.bulk(index=INDEX_NAME, body=bulk_data, refresh=True)

    print organism + " " + str(genes) + " genes indexed"

mods = {
    'Homo sapiens': {
        'mine_dump_file': 'data/human_gene_results.tsv',
        'schema': {
            'gene_symbol': 0,
            'gene_name': 1,
            'primary_id': 2,
            'secondary_id': 3,
            'description': 5
        }
    },
    'Saccharomyces cerevisiae': {
        'mine_dump_file': 'data/yeast_gene_results.tsv',
        'schema': {
            'gene_symbol': 2,
            'gene_name': 3,
            'primary_id': 0,
            'secondary_id': 1,
            'description': 4
        }
    },
    'Drosophila melanogaster': {
        'mine_dump_file': 'data/fly_gene_results.tsv',
        'schema': {
            'gene_symbol': 1,
            'gene_name': 5,
            'primary_id': 2,
            'secondary_id': 0,
            'description': 6
        }
    },
    'Mus musculus': {
        'mine_dump_file': 'data/mousemine_gene_results.tsv',
        'schema': {
            'gene_symbol': 1,
            'gene_name': 2,
            'primary_id': 0,
            'description': 5
        }
    }
}

delete_mapping()
put_mapping()

for mod in mods.keys():
    index_mine_genes(mods[mod]['mine_dump_file'], mods[mod]['schema'], mod)
