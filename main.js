const {JSDOM} = require("jsdom")
const fetch = require("node-fetch");
const {writeFileSync,readFileSync, fstat, readFile} = require("fs")

function getData(){
 fetch("https://www.youtube.com/feed/trending").then(async(data)=>{
    var content=await data.text()
    var dom =await new JSDOM(content)
    var scripts=await dom.window.document.querySelectorAll("script")
    data=await scripts[28].text.replace("var ytInitialData = ","")
    data = await data.replace("};","}")
    data=await JSON.parse(data)
    await readData(data)
  }).catch(err=>{throw err})
}


function readData(ytInitialData){
    var itemRenderers=ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents
    newtrends=prettify(itemRenderers[0].itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer.items)
    oldtrends=prettify(itemRenderers[1].itemSectionRenderer.contents[0].shelfRenderer.content.expandedShelfContentsRenderer.items)
    writeFileSync("datas.json",JSON.stringify({trends:newtrends,oldtrends:oldtrends}))


}
function prettify(videos){
    data=[]
    videos.forEach(v=>{
       v=v.videoRenderer
       data.push({title:v.title.runs[0].text,desc:v.descriptionSnippet.runs[0].text,time:v.publishedTimeText.simpleText,views:v.viewCountText.simpleText,Channel:v.ownerText.runs[0].text,ChannelId:v.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId})
     })
    return data
}

function getDataLocally(){
    var data=JSON.parse(readFileSync("datas.json"))
    return data
}

function API(data,keys){
    dataApi=JSON.stringify(data)   
    keys.forEach(key=>{
         dataApi=dataApi.replace(key+":",`"${key}":`)
    })
    dataApi=dataApi.replace("`",'"""')
    console.log(dataApi)
}

process.argv.forEach(a=>{
if(a=="--getDataLocally"){
    try{
    data=getDataLocally()
    API(data,Object.keys(data.trends[0]))
    }
    catch{
        console.log("/*Error*/")
    }
}
if(a=="--getData"){
    try{
    getData()
    data=getDataLocally()
    API(data,Object.keys(data.trends[0]))
    }
    catch{
        console.log("/*Error*/")
    }
}

})