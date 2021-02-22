import json
import glob
import os
import pandas as pd
import shutil
import urllib.request

class Scraper:

    # source urls
    article_list_url = 'https://content.anthropocene-curriculum.org/wp-json/ac/v1/geocoded?filter=all&methods=&keywords=&folksonomy='
    article_data_url_template = 'https://content.anthropocene-curriculum.org/wp-json/wp/v2/%s?slug=%s'

    # filepaths
    data_filepath = ''
    articles_list_filepath = ''

    def __init__(self, filepath):
        self.data_filepath = filepath
        self.article_list_filepath = '%s/article_list.json' % filepath

        # Create data dir
        if not os.path.exists(filepath):
            os.makedirs(filepath)

    def scrape_content(self):
        self.clear_filepath()

        self.scrape_article_list()
        self._remove_html_warning_from_json_file(self.article_list_filepath)

        self.scrape_articles()

    def clear_filepath(self):
        files = glob.glob(self.data_filepath + '/*')
        for f in files:
            if os.path.isdir(f):
                shutil.rmtree(f)
            else:
                os.remove(f)

    def scrape_article_list(self):
        urllib.request.urlretrieve(self.article_list_url, self.article_list_filepath)

    def scrape_articles(self):
        with open(self.article_list_filepath) as file:
            article_list = json.load(file)

            for article in article_list:
                self.scrape_article(article['type'], article['slug'])

    def scrape_article(self, type, slug):
        filepath = self._get_article_filepath(type, slug)

        if not os.path.exists(os.path.dirname(filepath)):
            os.makedirs(os.path.dirname(filepath))

        url = self.article_data_url_template % (type, slug)
        urllib.request.urlretrieve(url, filepath)

    def _remove_html_warning_from_json_file(self, filepath):
        lines = open(filepath).readlines()

        if '<br />' in lines[0] and '<br />' in lines[1]:
            # remove first two lines of the file
            with open(filepath, 'w') as f:
                f.writelines(lines[2:])

    def _get_article_filepath(self, type, slug):
        return '%s/%s/%s.json' % (self.data_filepath, type, slug)
