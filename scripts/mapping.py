mapping = {
    "settings": {
        "index": {
            "max_result_window": 15000,
            "analysis": {
                "char_filter": {
                    "replace": {
                        "type": "mapping",
                        "mappings": [
                            "&=> and "
                        ]
                    }
                },
                "filter": {
                    "autocomplete_filter": {
                        "min_gram": "1",
                        "type": "edge_ngram",
                        "max_gram": "20"
                    },
                    "word_delimiter" : {
                        "type": "word_delimiter",
                        "split_on_numerics": False,
                        "split_on_case_change": True,
                        "generate_word_parts": True,
                        "generate_number_parts": True,
                        "catenate_all": True,
                        "preserve_original": True,
                        "catenate_numbers": True
                    }
                },
                "analyzer": {
                    "default": {
                        "type": "custom",
                        "char_filter": [
                            "html_strip",
                            "replace"
                        ],
                        "tokenizer": "whitespace",
                        "filter": [
                            "lowercase",
                            "word_delimiter"
                        ]
                    },
                    "autocomplete": {
                        "type": "custom",
                        "filter": ["lowercase", "autocomplete_filter"],
                        "tokenizer": "standard"
                    },
                    "raw": {
                        "type": "custom",
                        "filter": ["lowercase"],
                        "tokenizer": "keyword"
                    }
                }
            },
            "number_of_replicas": "0",
            "number_of_shards": "2"
        }
    },
    "mappings": {
        "searchable_item": {
            "properties": {
                "gene_symbol": {
                    "type": "string",
                    "fields": {
                        "raw": {"type": "string", "index": "not_analyzed"}
                    }
                },
                "gene_name": {
                    "type": "string",
                    "fields": {
                        "raw": {"type": "string", "index": "not_analyzed"}
                    }
                },
                "organism": {
                    "type": "string",
                    "fields": {
                        "raw": {"type": "string", "index": "not_analyzed"}
                    }
                },
                "primary_id": {
                    "type": "string",
                    "fields": {
                        "raw": {"type": "string", "index": "not_analyzed"}
                    }
                },
                "secondary_id": {
                    "type": "string",
                    "fields": {
                        "raw": {"type": "string", "index": "not_analyzed"}
                    }
                },
                "description": {
                    "type": "string",
                    "fields": {
                        "raw": {"type": "string", "index": "not_analyzed"}
                    }
                },
                "href": {
                    "type": "string",
                    "fields": {
                        "raw": {"type": "string", "index": "not_analyzed"}
                    }
                }
            }
        }
    }
}
