import re

def get_text_from_html(raw_html):

    # from https://stackoverflow.com/a/12982689
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)

    cleantext = cleantext.replace('&nbsp;', ' ')
    cleantext = cleantext.replace('\n\n', ' ')
    cleantext = cleantext.replace('\r\n', ' ')
    cleantext = cleantext.replace('\n', ' ')
    cleantext = cleantext.strip()

    return cleantext
