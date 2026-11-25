"""Convert the <main> of a (cleaned) WordPress/Elementor HTML page to Markdown.
Usage: python -I tomd.py <in.html> <out.md>
Keeps headings, paragraphs, lists (nested), tables, bold/italic, links, images,
iframes. Elementor top-level sections become <!-- section --> markers.
Hidden-on-desktop duplicate sections (elementor-hidden-desktop) are skipped.
"""
import sys, re, html
from html.parser import HTMLParser

VOID = {'img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'col', 'wbr'}


class Node:
    def __init__(self, tag, attrs, parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []


class TreeBuilder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node('root', [])
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self.cur.children.append(Node(tag, attrs, self.cur))

    def handle_endtag(self, tag):
        n = self.cur
        while n is not None and n.tag != tag:
            n = n.parent
        if n is not None and n.parent is not None:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def inline(n):
    if isinstance(n, str):
        return re.sub(r'\s+', ' ', n)
    t = n.tag
    inner = ''.join(inline(c) for c in n.children)
    if t in ('strong', 'b'):
        s = inner.strip()
        return f' **{s}** ' if s else inner
    if t in ('em', 'i'):
        s = inner.strip()
        return f' *{s}* ' if s else ''
    if t == 'br':
        return '  \n'
    if t == 'li':
        return '• ' + inner.strip() + '  \n'
    if t == 'a':
        href = n.attrs.get('href', '')
        s = inner.strip()
        if not s:
            return inner
        return f'[{s}]({href})' if href else s
    if t == 'img':
        return f"![{n.attrs.get('alt', '')}]({n.attrs.get('src', '')})"
    if t in ('script', 'style', 'svg', 'noscript', 'link'):
        return ''
    return inner


BLOCK = {'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'table', 'figure', 'blockquote',
         'iframe', 'form', 'img', 'hr', 'section', 'div', 'pre', 'figcaption', 'a'}


def clean_inline(s):
    s = s.replace('  \n', '<<BR>>')
    s = re.sub(r'\s+', ' ', s)
    s = re.sub(r'\*\*\s*\*\*', '', s)
    s = re.sub(r'\s*<<BR>>\s*', '<<BR>>', s).replace('<<BR>>', '  \n')
    return s.strip()


def has_block(n):
    return any((not isinstance(c, str)) and (c.tag in BLOCK and c.tag != 'a' or has_block(c)) for c in n.children)


def render(n, out, depth=0):
    if isinstance(n, str):
        if n.strip():
            out.append(('text', n))
        return
    t = n.tag
    cls = n.attrs.get('class', '') or ''
    if t in ('script', 'style', 'svg', 'noscript', 'link', 'button') and t != 'button':
        return
    if 'elementor-hidden-desktop' in cls:
        return
    if t == 'section' and 'elementor-top-section' in cls:
        out.append(('block', '<!-- section -->'))
    if re.match(r'h[1-6]$', t):
        out.append(('block', '#' * int(t[1]) + ' ' + clean_inline(inline(n))))
        return
    if t == 'p':
        s = clean_inline(inline(n))
        if s and s != '&nbsp;':
            out.append(('block', s))
        return
    if t in ('ul', 'ol'):
        out.append(('block', render_list(n, 0)))
        return
    if t == 'table':
        out.append(('block', render_table(n)))
        return
    if t == 'blockquote':
        s = clean_inline(inline(n))
        out.append(('block', '> ' + s))
        return
    if t == 'img':
        out.append(('block', inline(n)))
        return
    if t == 'iframe':
        out.append(('block', f'<iframe src="{n.attrs.get("src", "")}" title="{n.attrs.get("title", "")}"></iframe>'))
        return
    if t == 'a' and not has_block(n):
        s = clean_inline(inline(n))
        if s:
            out.append(('block', s))
        return
    if t == 'button':
        s = clean_inline(inline(n))
        out.append(('block', f'[bouton: {s}]'))
        return
    if t in ('input', 'textarea', 'select'):
        out.append(('block', f'[champ {t} {n.attrs}]'))
        return
    # generic container: collect loose inline runs as paragraphs
    buf = []
    for c in n.children:
        if isinstance(c, str) or (c.tag in ('strong', 'b', 'em', 'i', 'span', 'br') and not has_block(c)):
            buf.append(inline(c))
        else:
            if ''.join(buf).strip():
                out.append(('block', clean_inline(''.join(buf))))
            buf = []
            render(c, out, depth + 1)
    if ''.join(buf).strip():
        out.append(('block', clean_inline(''.join(buf))))


def render_list(n, level):
    lines = []
    i = 1
    for li in n.children:
        if isinstance(li, str) or li.tag != 'li':
            continue
        text_parts, subs = [], []
        for c in li.children:
            if not isinstance(c, str) and c.tag in ('ul', 'ol'):
                subs.append(c)
            else:
                text_parts.append(inline(c))
        bullet = f'{i}.' if n.tag == 'ol' else '-'
        txt = clean_inline(''.join(text_parts))
        if txt:
            lines.append('  ' * level + f'{bullet} {txt}')
            sub_level = level + 1
        else:
            sub_level = level
        for s in subs:
            lines.append(render_list(s, sub_level))
        i += 1
    return '\n'.join(l for l in lines if l.strip())


def render_table(n):
    rows = []

    def walk(x):
        for c in x.children:
            if isinstance(c, str):
                continue
            if c.tag == 'tr':
                rows.append([clean_inline(inline(td)).replace('|', '\\|').replace('  \n', ' <br> ').replace('\n', ' <br> ')
                             for td in c.children if not isinstance(td, str) and td.tag in ('td', 'th')])
            else:
                walk(c)
    walk(n)
    if not rows:
        return ''
    w = max(len(r) for r in rows)
    rows = [r + [''] * (w - len(r)) for r in rows]
    md = ['| ' + ' | '.join(rows[0]) + ' |', '|' + '---|' * w]
    md += ['| ' + ' | '.join(r) + ' |' for r in rows[1:]]
    return '\n'.join(md)


def convert(src):
    m = re.search(r'<main.*?</main>', src, re.S)
    body = m.group(0) if m else src
    tb = TreeBuilder()
    tb.feed(body)
    out = []
    render(tb.root, out)
    blocks, prev = [], None
    for kind, s in out:
        s = s.strip()
        if not s or s == prev:
            continue
        blocks.append(s)
        prev = s
    md = '\n\n'.join(blocks)
    md = re.sub(r'(<!-- section -->\s*)+(?=<!-- section -->)', '', md)
    return html.unescape(md) if '&' in md else md


if __name__ == '__main__':
    src = open(sys.argv[1], encoding='utf-8').read()
    open(sys.argv[2], 'w', encoding='utf-8').write(convert(src) + '\n')
