function nextLevel(nodeList, startIndex, hlevel, prefix, tocString)
{
    var hIndex = 1;
    var i = startIndex;
    
    while (i < nodeList.length) {
        var currentNode = nodeList[i];
        
        if (currentNode.tagName != "H"+hlevel)
            break;
        
        if (currentNode.className == "no-toc") {
            ++i;
            continue;
        }
            
        var sectionString = prefix+hIndex;
        
        // Update the TOC
        var text = currentNode.innerHTML;
        // Strip off names specified via <a id="..."></a>
        var tocText = text.replace(/<a id=[\'\"][^\'\"]*[\'\"]>([^<]*)<\/a>/g, "$1");
        tocString.s += "<li class='toc-h"+hlevel+"'><a href='#"+sectionString+"'><span class='secno'>"+sectionString+"</span>"+tocText+"</a></li>\n";
        
        // Modify the header
        currentNode.innerHTML = "<span class=secno>"+sectionString+"</span> "+text;
        currentNode.id = sectionString;
        
        // traverse children
        i = nextLevel(nodeList, i+1, hlevel+1, sectionString+".", tocString);
        hIndex++;
    }
    
    return i;
}

function generateTOC(toc)
{
    var nodeList = $("h2,h3,h4");
    var tocString = { s:"<ul class='toc'>\n" };
    nextLevel(nodeList, 0, 2, "", tocString);
    toc.innerHTML = tocString.s;
    
    // Now position the document, in case a #xxx directive was given
    var id = window.location.hash.substring(1);
    if (id.length > 0) {
        var target = document.getElementById(id);
        if (target) {
            var rect = target.getBoundingClientRect();
            setTimeout(function() { window.scrollTo(0, rect.top) }, 0);
        }
    }
}
