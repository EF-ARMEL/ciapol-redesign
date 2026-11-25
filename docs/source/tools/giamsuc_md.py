import json,sys,os,html,re
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from tomd import convert
src=sys.argv[1]; out=sys.argv[2]
for kind in ['pages','posts','cv','rapport']:
    for p in json.load(open(os.path.join(src,kind+'.json'),encoding='utf-8')):
        md=convert('<main>'+p['content']['rendered']+'</main>')
        ex=p.get('excerpt',{}).get('rendered','')
        ex=html.unescape(re.sub(r'<[^>]+>','',ex)).strip()
        head=f"TITLE: {html.unescape(p['title']['rendered'])}\nSLUG: {p['slug']}\nLINK: {p['link']}\nDATE: {p['date']}\nMODIFIED: {p['modified']}\nFEATURED: {p.get('featured_media')}\nEXCERPT: {ex}\n\n"
        open(os.path.join(out,f"{kind}_{p['slug']}.md"),'w',encoding='utf-8').write(head+md+'\n')
