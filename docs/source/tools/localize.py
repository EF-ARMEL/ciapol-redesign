"""Localize staging Markdown pages: download images/documents, rewrite links to local routes.
Usage: python -I localize.py <staging_dir> <web_dir> <manifest.json>
Staging files: <route-slug>.md with YAML-ish frontmatter (title, route, sourceUrl, description).
"""
import os, re, sys, json, glob, unicodedata, urllib.request, urllib.error, urllib.parse, ssl, time

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36"
STAGE, WEB, MANIFEST = sys.argv[1], sys.argv[2], sys.argv[3]
IMG_EXT = ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif')
DOC_EXT = ('.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip')
CTX = ssl.create_default_context()

PAGE_ROUTES = {
    '': '/', 'presentation': '/presentation', 'services': '/services',
    'cipomar': '/services/cipomar', 'lce': '/services/lce', 'unipol': '/services/unipol',
    'sdiic': '/services/sdiic', 'sdgsp-vae': '/services/sdgsp-vae', 'rno': '/projets/rno',
    'ciapol': '/projets/ccac', 'ucp-lac-yakro': '/projets/ucp-lac-yakro',
    'qualite-de-lair': '/qualite-de-lair', 'contactez-nous': '/contact', 'gallerie': '/galerie',
    'decret-de-creation': '/decret-de-creation', 'nos-articles': '/actualites',
    'page-d-exemple': '/page-d-exemple',
}
GIAMSUC_ROUTES = {'': '/projets/giamsuc', 'a-propos': '/projets/giamsuc/a-propos',
                  'organes': '/projets/giamsuc/organes', 'activites': '/projets/giamsuc/activites',
                  'contact': '/projets/giamsuc/contact', 'mediatheque': '/projets/giamsuc/mediatheque',
                  'rapport-dactivite': '/projets/giamsuc/rapports-d-activite',
                  'sample-page': '/projets/giamsuc/sample-page'}


def slugify(s):
    s = urllib.parse.unquote(s)
    s = unicodedata.normalize('NFKC', s)
    s = unicodedata.normalize('NFKD', s)
    s = ''.join(c for c in s if not unicodedata.combining(c)).lower()
    s = s.replace('œ', 'oe').replace('æ', 'ae').replace('’', '').replace("'", '')
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return re.sub(r'-+', '-', s)


def load_article_slugs():
    m = {}
    for f in glob.glob(os.path.join(WEB, 'content', 'articles', '*.md')):
        head = open(f, encoding='utf-8').read(3000)
        su = re.search(r'^sourceUrl:\s*"?([^"\n]+)"?', head, re.M)
        sl = re.search(r'^slug:\s*"?([^"\n]+)"?', head, re.M)
        if su and sl:
            m[su.group(1).strip().lower().rstrip('/')] = sl.group(1).strip()
    return m


ARTICLES = load_article_slugs()


def map_link(url):
    """Return local route for a ciapol/giamsuc URL, or None if external."""
    u = url.strip()
    if u.startswith('#') or u.startswith('mailto:') or u.startswith('tel:'):
        return None
    p = urllib.parse.urlparse(u)
    host = p.netloc.lower()
    path = re.sub(r'/+', '/', p.path)
    if host in ('ciapol.ci', 'www.ciapol.ci'):
        seg = path.strip('/')
        if seg in PAGE_ROUTES:
            return PAGE_ROUTES[seg] + (('#' + p.fragment) if p.fragment else '')
        if seg.startswith('category/'):
            return '/actualites/categorie/' + seg.split('/')[-1]
        if seg.startswith('tag/'):
            return '/actualites/tag/' + seg.split('/')[-1]
        if seg.startswith('author/'):
            return '/actualites/auteur/' + seg.split('/')[-1]
        if seg in ('mot-du-directeur', 'le-mot-du-directeur-2'):
            key = ('https://ciapol.ci/' + seg).lower()
            return '/actualites/' + ARTICLES.get(key, seg)
        if seg.startswith('wp-content') or '/' in seg or seg == '':
            return None
        key = ('https://ciapol.ci/' + seg).lower()
        return '/actualites/' + ARTICLES.get(key, slugify(seg))
    if host == 'giamsuc.ciapol.ci':
        seg = path.strip('/')
        if seg in GIAMSUC_ROUTES:
            return GIAMSUC_ROUTES[seg]
        if seg.startswith('wp-content') or seg.startswith('wp-json') or seg.startswith('wp-admin'):
            return None
        if seg.startswith('curriculum-vitae/'):
            return '/projets/giamsuc/organes#' + seg.split('/')[-1]
        if seg.startswith('rapport-dactivite/'):
            return '/projets/giamsuc/rapports-d-activite#' + seg.split('/')[-1]
        return '/projets/giamsuc/actualites#' + seg
    return None


def fetch(url, tries=2):
    last = None
    for _ in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=90, context=CTX) as r:
                data = r.read()
                ctype = r.headers.get('Content-Type', '')
                if 'text/html' in ctype:
                    return None, 'html-response'
                return data, None
        except urllib.error.HTTPError as e:
            last = 'HTTP %d' % e.code
            if e.code in (404, 403, 410):
                break
        except Exception as e:  # noqa
            last = str(e)[:80]
            time.sleep(1)
    return None, last


def candidates(url):
    url = url.replace('://ciapol.ci//', '://ciapol.ci/')
    m = re.match(r'(https?://web\.archive\.org/web/\d+)(?:im_|id_)?/(.*)', url)
    orig = m.group(2) if m else url
    c = []
    full = re.sub(r'-\d+x\d+(\.\w+)$', r'\1', orig)
    if full != orig:
        c.append(full)
    c.append(orig)
    c += ['https://web.archive.org/web/2026id_/' + x for x in list(c)]
    return orig, c


def local_name(orig, slug, used):
    base = urllib.parse.unquote(orig.split('?')[0].rstrip('/').split('/')[-1])
    base = re.sub(r'-\d+x\d+(\.\w+)$', r'\1', base)
    stem, ext = os.path.splitext(base)
    if ext.lower() == '.webp' and stem.lower().endswith(('.jpg', '.jpeg', '.png')):
        stem = os.path.splitext(stem)[0]
    stem = slugify(stem) or 'image'
    if re.fullmatch(r'\d{1,3}(-\d)?', stem) or len(stem) <= 3:
        stem = f'{slug}-{stem}'
    name = stem + ext.lower()
    n = 2
    while name in used and used[name] != orig:
        name = f'{stem}-{n}{ext.lower()}'
        n += 1
    used[name] = orig
    return name


manifest = json.load(open(MANIFEST, encoding='utf-8')) if os.path.exists(MANIFEST) else {}
DL_CACHE = {}


def download(url, dest_dir, slug, used):
    orig, cands = candidates(url)
    name = local_name(orig, slug, used)
    dest = os.path.join(dest_dir, name)
    rec = {'source': orig, 'local': None, 'status': None}
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        rec.update(local=dest, status='ok(cached)')
        return name, rec
    for c in cands:
        if c in DL_CACHE:
            data = DL_CACHE[c]
            err = None if data else 'cached-fail'
        else:
            data, err = fetch(c)
            DL_CACHE[c] = data
        if data:
            os.makedirs(dest_dir, exist_ok=True)
            open(dest, 'wb').write(data)
            rec.update(local=dest, status='ok', fetched=c)
            return name, rec
        rec['status'] = f'FAIL {err}'
    return None, rec


def process(path):
    slug = os.path.splitext(os.path.basename(path))[0]
    txt = open(path, encoding='utf-8').read()
    m = re.match(r'---\n(.*?)\n---\n(.*)', txt, re.S)
    fm, body = m.group(1), m.group(2)
    img_dir = os.path.join(WEB, 'public', 'media', 'pages', slug)
    doc_dir = os.path.join(WEB, 'public', 'media', 'documents')
    used, images, recs, docs = {}, [], [], []

    def is_img(u):
        return urllib.parse.urlparse(u).path.lower().endswith(IMG_EXT)

    def is_doc(u):
        return urllib.parse.urlparse(u).path.lower().endswith(DOC_EXT)

    def repl_url(u):
        u0 = u
        if u.startswith('/ciapol/wp-content') or u.startswith('/wp-content'):
            u = 'https://ciapol.ci' + u.replace('/ciapol/wp-content', '/wp-content')
        if re.match(r'https?://', u) and ('ciapol.ci' in u or 'web.archive.org' in u) and is_img(u):
            name, rec = download(u, img_dir, slug, used)
            rec['page'] = slug
            recs.append(rec)
            if name:
                lp = f'/media/pages/{slug}/{name}'
                if lp not in images:
                    images.append(lp)
                return lp
            return u0
        if re.match(r'https?://', u) and 'ciapol.ci' in u and is_doc(u):
            dname = os.path.basename(urllib.parse.unquote(urllib.parse.urlparse(u).path))
            dest = os.path.join(doc_dir, dname)
            rec = {'source': u, 'page': slug, 'kind': 'document'}
            if not os.path.exists(dest):
                data, err = fetch(u.replace('://ciapol.ci//', '://ciapol.ci/'))
                if data:
                    os.makedirs(doc_dir, exist_ok=True)
                    open(dest, 'wb').write(data)
                    rec['status'] = 'ok'
                else:
                    rec['status'] = f'FAIL {err}'
            else:
                rec['status'] = 'ok(cached)'
            recs.append(rec)
            if rec['status'].startswith('ok'):
                rec['local'] = dest
                return f'/media/documents/{dname}'
            return u0
        r = map_link(u)
        return r if r else u0

    # markdown links/images: ](url) ; html src="url" ; frontmatter-free
    body = re.sub(r'\]\((\S+?)\)', lambda mm: '](' + repl_url(mm.group(1)) + ')', body)
    body = re.sub(r'(<img[^>]*\ssrc=")([^"]+)(")', lambda mm: mm.group(1) + repl_url(mm.group(2)) + mm.group(3), body)
    body = re.sub(r'(<!--\s*(?:bg|image|background|logo):\s*)(\S+)(\s*-->)',
                  lambda mm: mm.group(1) + repl_url(mm.group(2)) + mm.group(3), body)
    fm_lines = [l for l in fm.split('\n') if not l.startswith('images:')]
    fm_lines.append('images:' + ('' if images else ' []'))
    for i in images:
        fm_lines.append(f'  - "{i}"')
    out = '---\n' + '\n'.join(fm_lines) + '\n---\n' + body
    dest = os.path.join(WEB, 'content', 'pages', slug + '.md')
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, 'w', encoding='utf-8', newline='\n').write(out)
    manifest[slug] = recs
    fails = [r for r in recs if not str(r.get('status', '')).startswith('ok')]
    print(f'{slug}: {len(images)} images, {len(recs)} media refs, {len(fails)} failed')
    for f in fails:
        print('   FAIL', f['source'], f.get('status'))


files = sys.argv[4:] or sorted(glob.glob(os.path.join(STAGE, '*.md')))
for f in files:
    process(f if os.path.isabs(f) or os.path.exists(f) else os.path.join(STAGE, f))
json.dump(manifest, open(MANIFEST, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
