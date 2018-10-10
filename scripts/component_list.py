import os
import re

jaderegex = r'^([^\.\s\{\}\(\)\#\/\|]+).*$'
js_component_regex = '.*componentsModule.directive\((.*?)\,.*\).*'
seen_components = {}
cwd = os.getcwd()

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
    basicfpath = jadefile.split(cwd)[1]
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

            # here we can check if the component is in seen_components
            # because the first pass found them *all* in the JS and
            # added them to the dict already
            if comp and comp in seen_components:
                seen_components[comp]['occurs'] += 1
                if basicfpath not in seen_components[comp]['in_files']:
                    seen_components[comp]['in_files'].append(basicfpath)

def parseJs(path):
    with open(path, 'r') as jsfile:
        for line in jsfile:
            matches = re.match(js_component_regex, line)
            if matches and matches.group(1):
                component = matches.group(1)

                # strip ' or " we dont know which were used by the dev
                # although if " was used... curse that person
                component = component.replace("'", '').replace('"', '')

                # turn the camel cased component into a - seperated string
                component = re.sub('(?=[A-Z])', '-', component).lower()

                # add to the seen_components dict
                seen_components[component] = {'occurs': 0, 'src': path, 'in_files': []}

def recurseDown(filepath, func):
    for f in os.listdir(filepath):
        fullpath = os.path.join(filepath, f)
        if os.path.isdir(fullpath):
            recurseDown(fullpath, func)

        if os.path.isfile(fullpath):
            fil, ext = os.path.splitext(fullpath)
            func(fullpath, ext)

def jadeHandler(fullpath, ext):
    if ext == '.jade':
        parseJade(fullpath)

def jsHandler(fullpath, ext):
    if ext == '.js':
        parseJs(fullpath)

toplvl = os.path.join(os.getcwd(), 'app', 'js')
recurseDown(toplvl, jsHandler)
recurseDown(toplvl, jadeHandler)

for comp in sorted(seen_components.keys()):
    occurs = seen_components[comp]['occurs']
    jsFile = seen_components[comp]['src'].replace(toplvl, '')
    print('{0}: {1} occurrence{2} ({3})'.format(comp.ljust(32), occurs, '' if occurs == 1 else 's', jsFile))
    for f in seen_components[comp]['in_files']:
        print(''.ljust(34) + '\t' + f)
