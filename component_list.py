import os
import re

ignore = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio',
          'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button',
          'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
          'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div',
          'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure',
          'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head',
          'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins',
          'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map',
          'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript',
          'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param',
          'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's',
          'samp', 'script', 'section', 'select', 'small', 'source',
          'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table',
          'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time',
          'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr']
jaderegex = r'^([^\.\s\{\}\(\)\#\/\|]+).*$'
seen_components = {}


def process_paren(line, paren):
    # sort and count parentheses
    sorted_line = sorted(line)
    paren_started = False
    for c in sorted_line:
        if c == '(':
            paren_started = True
            paren += 1
        elif c == ')':
            paren -= 1
        else:
            if paren_started:
                break
    return paren


def parseJade(jadefile):
    # reconstruct multi-line declarations, keep track of parens
    paren = 0
    open_lines = []
    basicfpath = jadefile.split('insights-frontend/')[1]
    with open(jadefile, 'r') as jfil:
        for line in jfil:
            l = line.strip()
            if not l:
                # empty line
                continue
            paren = process_paren(l, paren)
            if paren > 0:
                open_lines.append(l)
                continue
            if len(open_lines) > 0:
                # append last line
                open_lines.append(l)
                l = ' '.join(open_lines)
                open_lines = []
            comprgx = re.match(jaderegex, l)
            comp = comprgx.group(1) if comprgx else None
            if comp and comp not in ignore:
                if comp not in seen_components:
                    seen_components[comp] = {'occurs': 0, 'in_files': [basicfpath]}
                seen_components[comp]['occurs'] += 1
                if basicfpath not in seen_components[comp]['in_files']:
                    seen_components[comp]['in_files'].append(basicfpath)


def recurseDown(filepath):
    for f in os.listdir(filepath):
        fullpath = os.path.join(filepath, f)
        if os.path.isdir(fullpath):
            recurseDown(fullpath)

        if os.path.isfile(fullpath):
            fil, ext = os.path.splitext(fullpath)
            if ext == '.jade':
                parseJade(fullpath)

toplvl = os.path.join(os.getcwd(), 'app', 'js')
recurseDown(toplvl)

for comp in sorted(seen_components.keys()):
    occurs = seen_components[comp]['occurs']
    print(comp.ljust(32) + ': {0} occurrence{1}'.format(
        occurs,
        '' if occurs == 1 else 's'))
    for f in seen_components[comp]['in_files']:
        print(''.ljust(34) + '\t' + f)
