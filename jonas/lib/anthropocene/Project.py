from .helper import get_text_from_html

class Project:

    def __init__(self, data):
        self.raw_data = data

    def get_reduced_data(self):
        data = {}

        data['title'] = self.raw_data['title']['rendered']
        data['subtitle'] = self.raw_data['acf']['subtitle']
        data['abstract'] = get_text_from_html(self.raw_data['acf']['abstract'])
        data['link'] = self.raw_data['link'].replace('content.', 'www.')
        data['content'] = self._get_contents()

        return data

    def get_fully_merged_content(self):
        data = self.get_reduced_data()

        contents = []
        direct_content_keys = ['title', 'subtitle', 'abstract']

        for key in direct_content_keys:
            if data[key]:
                contents.append(data[key])

        for content_element in data['content']:
            if content_element['text']:
                contents.append(content_element['text'])

        if len(contents) > 0:
            return ' '.join(contents)
        else:
            return ''

    def _get_contents(self):
        contents = []

        content_entries = self.raw_data['acf']['_content']['content']

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

    def _get_embed_content_entry(self, entry_data):
        if entry_data['title'] or entry_data['caption']:
            return {
                'type': entry_data['acf_fc_layout'],
                'title': entry_data['title'],
                'text': entry_data['caption'],
            }

        return {}

    def _get_text_content_entry(self, entry_data):
        text = get_text_from_html(entry_data['text'])

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
                'text': get_text_from_html(text)
            }

        return {}
