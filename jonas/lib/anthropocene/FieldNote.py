from .helper import get_text_from_html

class FieldNote:
    raw_data = {}

    def __init__(self, data):
        self.raw_data = data

    def get_reduced_data(self):
        data = {}

        data['link'] = 'https://notes.anthropocene-curriculum.org/id/%s' % self.raw_data['id']
        data['text'] = get_text_from_html(self.raw_data['acf']['text'])
        data['tags'] = self.raw_data['method'] + self.raw_data['keyword'] + self.raw_data['folksonomy']

        return data

    def get_fully_merged_content(self):
        data = self.get_reduced_data()
        return data['text']
