import json
import re
from .FieldNote import FieldNote

class Article:

    type = ''
    slug = ''

    def __init__(self, data):
        self.raw_data = data

        self.type = data['type']
        self.slug = data['slug']

    def get_essentialized_content(self):
        content = {}

        if self.type == 'field_note':
            field_note = FieldNote(self.raw_data)
            content = field_note.get_reduced_data()
        elif self.type == 'contribution' or self.type == 'project':
            content = self._get_essentialized_project_content()

        return content

    def _get_essentialized_field_note_content(self):
        data = {}

        data['link'] = 'https://notes.anthropocene-curriculum.org/id/%s' % self.raw_data['id']
        data['text'] = self._get_text_from_html(self.raw_data['acf']['text'])

        return data

    def _get_essentialized_project_content(self):
        data = {}

        data['title'] = self.raw_data['title']['rendered']
        data['subtitle'] = self.raw_data['acf']['subtitle']
        data['abstract'] = self._get_text_from_html(self.raw_data['acf']['abstract'])
        data['link'] = self.raw_data['link'].replace('content.', 'www.')
        data['content'] = self._get_contents_from_content_entries(self.raw_data['acf']['_content']['content'])

        return data

    def _get_contents_from_content_entries(self, content_entries):
        contents = []

        if content_entries:
            for entry in content_entries:

                ignored_types = ['iframe', 'featured', 'featured-children', 'reading-list', 'pdf']

                # Get content based on layout type
                content = {}
                if entry['acf_fc_layout'] == 'embed':
                    content = self._get_embed_content_entry(entry)
                elif entry['acf_fc_layout'] == 'text':
                    content = self._get_text_content_entry(entry)
                elif entry['acf_fc_layout'] == 'image':
                    content = self._get_image_content_entry(entry)

                elif entry['acf_fc_layout'] in ignored_types:
                    # doesn't hold any content. skipped for now
                    continue

                else:
                    # Unhandled content type.
                    continue

                # Add content if not empty
                if content:
                    contents.append(content)

        return contents

    def _get_text_from_html(self, raw_html):

        # from https://stackoverflow.com/a/12982689
        cleanr = re.compile('<.*?>')
        cleantext = re.sub(cleanr, '', raw_html)

        cleantext = cleantext.replace('&nbsp;', ' ')
        cleantext = cleantext.replace('\n\n', ' ')
        cleantext = cleantext.replace('\r\n', ' ')
        cleantext = cleantext.replace('\n', ' ')
        cleantext = cleantext.strip()

        return cleantext

    def _get_embed_content_entry(self, entry_data):
        if entry_data['title'] or entry_data['caption']:
            return {
                'type': entry_data['acf_fc_layout'],
                'title': entry_data['title'],
                'text': entry_data['caption'],
            }

        return {}

    def _get_text_content_entry(self, entry_data):
        text = self._get_text_from_html(entry_data['text'])

        if text:
            return {
                'type': entry_data['acf_fc_layout'],
                'text': text,
            }

        return {}

    def _get_image_content_entry(self, entry_data):
        text_elements = []
        for image_data in entry_data['image']:
            if image_data['caption']:
                text_elements.append(image_data['caption'].strip())
            if image_data['description']:
                text_elements.append(image_data['description'].strip())

        text = ' '.join(text_elements)

        if text:
            return {
                'type': entry_data['acf_fc_layout'],
                'text': self._get_text_from_html(text)
            }

        return {}
