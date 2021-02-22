import spacy

class Analyzer:
    nlp = None

    def __init__(self):
        self.nlp = spacy.load("en_core_web_lg")

    def get_article_similarities(self, article_id, article_contents):
        if not article_id in article_contents:
            return {}

        doc1 = self.nlp(article_contents[article_id])

        similarities = {}
        for compare_id, compare_text in article_contents.items():
            if article_id == compare_id:
                continue

            print(article_id, '<->', compare_id)

            doc2 = self.nlp(compare_text)
            similarities[compare_id] = doc1.similarity(doc2)
        return similarities
