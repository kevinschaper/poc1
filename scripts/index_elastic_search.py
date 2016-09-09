from elasticsearch import Elasticsearch
from mapping import mapping
import os
import requests

INDEX_NAME = 'searchable_items'
DOC_TYPE = 'searchable_item'
ES_ADDRESS = 'http://52.43.223.105:9200/'
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

# def index_fly_genes():
#     fly_genes = 0
    
#     for line in open('data/fly_gene_results.tsv', 'r'):
#         content = line.split('\n')[0].split('\t')

#         if content[0] == 'Sequence Feature > Primary DBID':
#             continue

#         secondary_id = ''
#         if str(content[0]) != '""':
#             secondary_id = content[0]

#         description = ''
#         if str(content[6]) != '""':
#             secondary_id = content[6]
        
#         obj = {
#             'gene_symbol': content[1],
#             'gene_name': content[5],
#             'organism': 'Saccharomyces cerevisiae',
#             'primary_id': content[2],
#             'secondary_id': secondary_id,
#             'description': description,
#             'href': 'http://www.ncbi.nlm.nih.gov/gene/' + content[2]
#         }

#         es.index(index=INDEX_NAME, doc_type=DOC_TYPE, body=obj, id=content[4] + "/" + content[2])

#         fly_genes += 1

#     print "Indexing " + str(fly_genes) + " fly genes"

    
# def index_mouse_genes():
#     mouse_genes = 0
    
#     for line in open('data/mousemine_gene_results.tsv', 'r'):
#         content = line.split('\n')[0].split('\t')

#         if content[0] == 'Gene > Primary Identifier':
#             continue

#         description = ''
#         if str(content[5]) != '""':
#             secondary_id = content[5]
        
#         obj = {
#             'gene_symbol': content[1],
#             'gene_name': content[2],
#             'organism': content[4],
#             'primary_id': content[0],
#             'secondary_id': '',
#             'description': description,
#             'href': 'http://www.ncbi.nlm.nih.gov/gene/' + content[0]
#         }

#         es.index(index=INDEX_NAME, doc_type=DOC_TYPE, body=obj, id=content[4] + "/" + content[2])

#         mouse_genes += 1

#     print "Indexing " + str(mouse_genes) + " mouse genes"
    
# def index_yeast_genes():
#     yeast_genes = 0
    
#     for line in open('data/yeast_gene_results.tsv', 'r'):
#         content = line.split('\n')[0].split('\t')

#         if content[0] == 'Sequence Feature > Primary DBID':
#             continue

#         secondary_id = ''
#         if str(content[1]) != '""':
#             secondary_id = content[1]

#         description = ''
#         if str(content[4]) != '""':
#             secondary_id = content[4]
        
#         obj = {
#             'gene_symbol': content[2],
#             'gene_name': content[3],
#             'organism': 'Saccharomyces cerevisiae',
#             'primary_id': content[0],
#             'secondary_id': secondary_id,
#             'description': description,
#             'href': 'http://www.ncbi.nlm.nih.gov/gene/' + content[0]
#         }

#         es.index(index=INDEX_NAME, doc_type=DOC_TYPE, body=obj, id=content[4] + "/" + content[2])

#         yeast_genes += 1

#     print "Indexing " + str(yeast_genes) + " yeastglo genes"
        
# def index_human_genes():
#     human_genes = 0
    
#     for line in open('data/human_gene_results.tsv', 'r'):
#         content = line.split('\n')[0].split('\t')

#         if content[0] == 'Gene > Symbol':
#             continue

#         secondary_id = ''
#         if str(content[3]) != '""':
#             secondary_id = content[3]

#         description = ''
#         if str(content[5]) != '""':
#             secondary_id = content[5]
        
#         obj = {
#             'gene_symbol': content[0],
#             'gene_name': content[1],
#             'organism': content[4],
#             'primary_id': content[2],
#             'secondary_id': secondary_id,
#             'description': description,
#             'href': 'http://www.ncbi.nlm.nih.gov/gene/' + content[2]
#         }

#         es.index(index=INDEX_NAME, doc_type=DOC_TYPE, body=obj, id=content[4] + "/" + content[2])

#         human_genes += 1

#     print "Indexing " + str(human_genes) + " human genes"

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
            
#            es.index(index=INDEX_NAME, doc_type=DOC_TYPE, body=obj, id=organism + "/" + obj['primary_id'])

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

#delete_mapping()
#put_mapping()

for mod in mods.keys():
    index_mine_genes(mods[mod]['mine_dump_file'], mods[mod]['schema'], mod)
