import os
from os.path import join, getsize 

if __name__ == "__main__": 
    print("begin")
    md = open("F:\BaiduNetdiskDownload\笔记\分布式事务.md", mode='r',encoding="utf8")
    content = md.read()
    md.close()
    print(content)
    for root, dirs, files in os.walk('F:\BaiduNetdiskDownload\笔记'):
        for i in range(0,len(files)):
            print(join(root, files[i]))
            print(files[i].split(".")[0])
            nn = f'dt_{i}'
            sp = files[i].split(".")
            content = content.replace(sp[0], nn)
            nn = nn+'.'+sp[-1]
            # print(join(root, 'dt_'+i+  os.path.splitext(files[i])[-1] ))
            os.rename(join(root,files[i]), join(root, nn))
            
        # print(root, "consumes", end="") 
        # print(sum([getsize(join(root, name)) for name in files]), end="") 
        # print("bytes in", len(files), "non-directory files") 
        # if 'CVS' in dirs:
        #     dirs.remove('CVS') # don't visit CVS directories

    print(content)
    content = content.replace('assets/', 'https://cdn.clinan.xyz/')
    with open("F:\BaiduNetdiskDownload\笔记\分布式事务.md", mode='w',encoding="utf8") as mm:
        mm.write(content)
        mm.close()