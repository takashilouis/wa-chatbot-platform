const fs = require('fs');
const path = require('path');
const deps = 'C:/Users/PhanTanKhanh.Nguyen/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/';
const { chromium } = require(deps + 'playwright');
(async () => {
  const browser = await chromium.launch({headless:true,channel:'msedge'});
  const page = await browser.newPage({viewport:{width:2400,height:1800},deviceScaleFactor:3});
  await page.setContent('<html><head><style>body{margin:0;background:white;font-family:Arial}#diagram{padding:40px;display:inline-block}svg{max-width:none!important}</style></head><body><div id="diagram"></div></body></html>');
  await page.addScriptTag({url:'https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.min.js'});
  const source=fs.readFileSync(path.join(__dirname,'architecture.mmd'),'utf8');
  await page.evaluate(async source=>{
    mermaid.initialize({startOnLoad:false,theme:'base',flowchart:{useMaxWidth:false,htmlLabels:true,nodeSpacing:45,rankSpacing:65,curve:'basis'},themeVariables:{fontFamily:'Arial',fontSize:'17px',lineColor:'#64748b',edgeLabelBackground:'#ffffff'}});
    const {svg}=await mermaid.render('architecture',source);
    document.getElementById('diagram').innerHTML=svg;
  },source);
  await page.locator('#diagram').screenshot({path:path.join(__dirname,'whatsapp-architecture.png')});
  await page.locator('#diagram').screenshot({path:path.join(__dirname,'whatsapp-architecture.jpg'),type:'jpeg',quality:95});
  console.log(await page.locator('#diagram').boundingBox());
  await browser.close();
})();
