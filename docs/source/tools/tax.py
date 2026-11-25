import re,sys,json,urllib.request,urllib.error,os,html
UA="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36"
out=sys.argv[1]; res=[]
def get(u):
    try:
        r=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':UA}),timeout=60)
        return r.read().decode('utf-8','replace')
    except urllib.error.HTTPError as e: return None
for sm,kind in [('wp-sitemap-taxonomies-category-1.xml','category'),('wp-sitemap-taxonomies-post_tag-1.xml','tag')]:
    x=open(os.path.join(sys.argv[2],sm),encoding='utf-8').read()
    for u in re.findall(r'<loc>([^<]+)',x):
        slug=u.rstrip('/').split('/')[-1]; n=0; posts=[]; title=None; page=1
        while True:
            h=get(u if page==1 else u+'page/%d/'%page)
            if not h: break
            open(os.path.join(out,'%s_%s_%d.html'%(kind,slug,page)),'w',encoding='utf-8').write(h)
            if title is None:
                m=re.search(r'<h1[^>]*>(.*?)</h1>',h,re.S); title=html.unescape(re.sub(r'<[^>]+>','',m.group(1))).strip() if m else None
            main=h[h.find('<main'):h.find('</main>')]
            arts=re.findall(r'<article[^>]*>.*?</article>',main,re.S)
            for a in arts:
                m=re.search(r'<h2[^>]*class="[^"]*entry-title[^"]*"[^>]*>\s*<a href="([^"]+)"[^>]*>(.*?)</a>',a,re.S)
                if m: posts.append({'url':m.group(1),'title':html.unescape(re.sub(r'<[^>]+>','',m.group(2))).strip()})
            n+=len(arts)
            if not arts or 'page/%d/'%(page+1) not in h: break
            page+=1
        parent=None
        if kind=='category':
            parts=u.split('/category/')[1].strip('/').split('/'); parent=parts[0] if len(parts)>1 else None
        res.append({'kind':kind,'name':title,'slug':slug,'parent':parent,'count':n,'sourceUrl':u,'posts':posts})
        print(kind,slug,title,n,file=sys.stderr)
json.dump(res,open(os.path.join(out,'taxonomies.json'),'w',encoding='utf-8'),ensure_ascii=False,indent=1)
