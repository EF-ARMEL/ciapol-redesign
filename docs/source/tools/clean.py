import re,sys,os,glob
src,dst=sys.argv[1],sys.argv[2]
for f in glob.glob(os.path.join(src,'*.html')):
    h=open(f,encoding='utf-8',errors='replace').read()
    i=h.find('<body'); b=h[i:] if i>=0 else h
    b=re.sub(r'<script.*?</script>','',b,flags=re.S|re.I)
    b=re.sub(r'<style.*?</style>','',b,flags=re.S|re.I)
    b=re.sub(r'<noscript.*?</noscript>','',b,flags=re.S|re.I)
    b=re.sub(r'<svg.*?</svg>','<svg/>',b,flags=re.S|re.I)
    b=re.sub(r'<!--.*?-->','',b,flags=re.S)
    b=re.sub(r'\s(srcset|sizes|decoding|loading|style|data-[\w-]+|aria-[\w-]+|role|tabindex)="[^"]*"','',b)
    b=re.sub(r'[ \t]+',' ',b); b=re.sub(r'\n\s*\n+','\n',b)
    open(os.path.join(dst,os.path.basename(f)),'w',encoding='utf-8').write(b)
