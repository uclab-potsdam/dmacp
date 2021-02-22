import json

from .FieldNote import FieldNote
from .Project import Project

class Preprocessor:

    # data dirs
    raw_data_filepath = ''

    # filepaths
    article_list_filepath = ''

    def __init__(self, raw_data_filepath):
        self.raw_data_filepath = raw_data_filepath
        self.article_list_filepath = '%s/article_list.json' % raw_data_filepath

    def get_merged_article_contents_by_type(self):
        article_contents_by_type = {}

        articles = self.get_scraped_articles()
        for article in articles:
            type = article['type']
            slug = article['slug']

            if not type in article_contents_by_type:
                article_contents_by_type[type] = {}

            article_contents_by_type[type][slug] = self.get_reduced_article_data(type, slug)

        return article_contents_by_type

    def get_fully_merged_article_contents(self):
        article_contents = {}
        articles = self.get_scraped_articles()

        for article in articles:
            type = article['type']
            slug = article['slug']

            content = self.get_fully_merged_article_content(type, slug)

            if content:
                article_contents[slug] = self.get_fully_merged_article_content(type, slug)

        return article_contents

    def get_scraped_articles(self):
        with open(self.article_list_filepath) as content_list_file:
            return json.load(content_list_file)

    def get_raw_article_data(self, type, slug):
        filepath = '%s/%s/%s.json' % (self.raw_data_filepath, type, slug)

        with open(filepath) as json_file:
            nested_data = json.load(json_file)
            return nested_data[0]

    def get_reduced_article_data(self, type, slug):
        raw_data = self.get_raw_article_data(type, slug)

        data = {}
        if type == 'field_note':
            field_note = FieldNote(raw_data)
            data = field_note.get_reduced_data()
        elif type == 'contribution' or type == 'project':
            project = Project(raw_data)
            data = project.get_reduced_data()

        return data

    def get_fully_merged_article_content(self, type, slug):
        raw_data = self.get_raw_article_data(type, slug)

        content = ''
        if type == 'field_note':
            field_note = FieldNote(raw_data)
            content = field_note.get_fully_merged_content()
        elif type == 'contribution' or type == 'project':
            project = Project(raw_data)
            content = project.get_fully_merged_content()

        return content
