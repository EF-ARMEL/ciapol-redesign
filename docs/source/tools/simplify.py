import re,sys,os,glob
src,dst=sys.argv[1],sys.argv[2]
os.makedirs(dst,exist_ok=True)
for f in glob.glob(os.path.join(src,'*.html')):
    b=open(f,encoding='utf-8').read()
    m=re.search(r'<main.*?</main>',b,flags=re.S)
    if m: b=m.group(0)
    def secrepl(m):
        c=m.group(1)
        w=re.search(r'elementor-widget-([\w-]+)',c)
        if w and 'elementor-widget-container' not in c: return '\n[W:%s]'%w.group(1)
        if re.search(r'elementor-(top-)?section\b',c) or 'e-con ' in c or c.startswith('e-con') : return '\n[SECTION]'
        if 'elementor-column ' in c: return '\n[COL]'
        return ''
    b=re.sub(r'<(?:div|section)\s+[^>]*?class="([^"]*)"[^>]*>',secrepl,b)
    b=re.sub(r'</?(div|section|span|main|article|header)\b[^>]*>','',b)
    b=re.sub(r'\s(class|id|rel|target|width|height|fetchpriority)="[^"]*"','',b)
    b=re.sub(r'[ \t]+',' ',b); b=re.sub(r'\s*\n\s*','\n',b)
    open(os.path.join(dst,os.path.basename(f)),'w',encoding='utf-8').write(b)
