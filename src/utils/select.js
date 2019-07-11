export function getActualSelect(rootNode){
  // 偏移量
  var offset = 0;
  // 选择的对象
  var selection = window.getSelection();
  // range
  var range = selection.getRangeAt(0);
  var start = range.startOffset;
  var startNode = range.startContainer;
  var end = range.endOffset;
  var endNode = range.endContainer;

  if (rootNode.hasChildNodes()) { 
      for ( var i = 0 ; rootNode.childNodes.length > i ; i++ ) { 
          var cnode = rootNode.childNodes[i];
          var cNodeContent = cnode.nodeType === document.TEXT_NODE? 
                        cnode.textContent : cnode.innerText;
          if(cNodeContent === startNode.textContent){  // 如果和初始节点相同
            start += offset;
          }

          if (cNodeContent === endNode.textContent){// 如果和结束节点相同
            end += offset;
            // 结尾节点就结束了
            break;
          }

          // 找到的节点都需要加上 offset
          offset += cnode.nodeType === document.TEXT_NODE ?
                  cnode.length : cnode.innerText.length;
      }   
  }   

  return [start, end];
}