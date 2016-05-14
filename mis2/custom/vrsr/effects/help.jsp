<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="com.runqianapp.common.util.Base64Util"%>
<%@page import="java.net.URL"%>
<%@page import="java.net.HttpURLConnection"%>
<%@page import="org.htmlparser.Parser"%>
<%@page import="org.htmlparser.Node"%>
<%@page import="org.htmlparser.NodeFilter"%>
<%@page import="org.htmlparser.filters.HasAttributeFilter"%>
<%@page import="org.htmlparser.filters.TagNameFilter"%>
<%@page import="org.htmlparser.util.NodeList"%>
<%@page import="org.htmlparser.tags.LinkTag"%>
<%@page import="org.htmlparser.filters.NodeClassFilter"%>
<%@page import="org.htmlparser.tags.ImageTag"%>
<%@page import="org.htmlparser.filters.OrFilter"%>
<%@page import="org.htmlparser.Tag"%>
<%@page import="java.io.IOException"%>

<%  
	String appPath = request.getContextPath();
    String base = "http://www.appquicker.com.cn:1111/documents/148442edit/";  // 可客户化修改
	String homePage = "http://www.geezn.com/documents/gez/help/148442-index.html";
    String content = Base64Util.Base64Decode("content",request);
    String docPath = content;//html路径
	String title = null;//二级标题
    String helpContent = null;//查找到的帮助信息html
    try{
        if(docPath.indexOf("#") != -1){
			int index = content.indexOf("#");
            docPath = content.substring(0,index);
            if(!docPath.endsWith("#")){
                title = content.substring(index + 1);
            } 
            
            Node titleNode = null;//二级标题对象
            if(title != null && !"".equals(title)){
                //生成parser对象
                URL htmlUrl = new URL(base+docPath);
				HttpURLConnection urlConnection = null;
				try{
					urlConnection = (HttpURLConnection) htmlUrl.openConnection();
				}catch(Exception e){
					e.printStackTrace();
					return;
				}
                
                Parser parser = new Parser(urlConnection);
                parser.setEncoding("UTF-8");
            
                //查找html中的H2标签
				NodeFilter filterH2 = new TagNameFilter("H2");
				NodeList nodes = parser.extractAllNodesThatMatch(filterH2);
				for(int i=0; i<nodes.size(); i++){
					Node node = nodes.elementAt(i);
					String nodeText = node.toPlainTextString().trim().replaceAll("&nbsp;","");//H2标签中标题内容
					if(nodeText.equals(title)){//存在要找的二级标题
						if(node.getParent() != null){
							Tag tag = (Tag)node.getParent();
							String className = tag.getAttribute("class");
							if("box".equals(className)){
								node = node.getParent();
							}
						}
						titleNode = node;
						break;
					}
				}
            }
  
            //存在标题节点
            if(titleNode != null){
                //helpContent = titleNode.toHtml();
				helpContent = "";
                Node nextNode = titleNode.getNextSibling();//当前节点的下一个兄弟节点
                while(nextNode != null){
					String nextTagName = nextNode.getText().replaceAll("&nbsp;","");//获取到的是标签内所有的信息，包括样式以及属性信息。所以要对获取到的内容进行过滤截取
					if(nextTagName.indexOf(" ") != -1){
						nextTagName = nextTagName.substring(0, nextTagName.indexOf(" "));//标签名称
					}

					//帮助信息的内容从当前二级标题开始到下一个二级标题结束
				   if(nextTagName != null){
					  if("H2".equalsIgnoreCase(nextTagName)){
					  	break;
					  }else if("DIV".equalsIgnoreCase(nextTagName)){
					  	Tag tag = (Tag)nextNode;
					  	String className = tag.getAttribute("class");
						String idName = tag.getAttribute("id");
					  	if("box".equals(className) || "foot".equals(idName)){
							break;
						}else{
							helpContent += nextNode.toHtml();              
                            nextNode = nextNode.getNextSibling();
						}
					  }else{
					  	helpContent += nextNode.toHtml();              
                        nextNode = nextNode.getNextSibling();
					  }
				   }else{
					   break;
				   }
                }
				//修改图片和超链接的路径为绝对路径
                //String pathPre = base + docPath.substring(0,docPath.lastIndexOf("/"));
                helpContent = completLinkAndImagePath(helpContent, base, docPath, homePage);
            }else{
			    helpContent = "<p>未找到！</p>";
			}
        }
    }catch(Exception e){
        e.printStackTrace();
		response.sendRedirect("error.jsp");
    }
    
    /** 进行跳转 */
    if(docPath.endsWith(".html")){
		if(docPath.equals(content)){
		    try{
				URL htmlUrl = new URL(base+docPath);
				HttpURLConnection urlConn = (HttpURLConnection) htmlUrl.openConnection();
				int returnCode = urlConn.getResponseCode();
				if (returnCode == HttpURLConnection.HTTP_OK){
					response.sendRedirect(base+content);//重定向
				}else{
					response.sendRedirect("error.jsp");
				}
			} catch (IOException e) {
				e.printStackTrace();
				response.sendRedirect("error.jsp");
			}
		}else{
		    out.println(helpContent);
		}  
    }else if(docPath.indexOf(".jsp") != -1){
		response.sendRedirect(appPath+"/"+content);//重定向
	}else if(docPath.endsWith(".swf")){
        
    }else if(docPath.endsWith(".txt")){
    
    }else{
    
    }
%>

<%!
	
	/** 根据base和html文档的路径，进行补充完成图片和超链接的路径 */
	String completLinkAndImagePath(String htmlContent, String pathPre ,String docPath, String homePage){
		Parser helpParser = null;
	    try{  
			String toolBar = "<div><button target onClick=\"window.open('"+homePage+"')\">主页</button>"+
			"<button style=\"margin-left: 10\" onClick=\"window.open('"+pathPre+docPath+"')\">当前内容页面</button>"+	"</div>";	 
			htmlContent = toolBar + htmlContent;
			helpParser = new Parser("<div>"+ htmlContent+"</div>");
	        helpParser.setEncoding("UTF-8");
	        
	        NodeFilter linkFileter = new NodeClassFilter(LinkTag.class);//超链接
	        NodeFilter imgFileter = new NodeClassFilter(ImageTag.class);//图片
	        NodeFilter nodeFilter = new OrFilter(linkFileter, imgFileter);
	        NodeList nodeList = helpParser.extractAllNodesThatMatch(nodeFilter);
	        for(int i=0; i<nodeList.size(); i++){
	            Node node = nodeList.elementAt(i);
	            if(node instanceof LinkTag){//重新设置超链接的href路径
	               LinkTag linkTag = (LinkTag)nodeList.elementAt(i);
	               String linkHtml = linkTag.toHtml();

	               String href = linkTag.getAttribute("href");
				   if(href.indexOf("http://") == -1){
				       href = pathPre+"/"+href;
				   }  
	               linkTag.setAttribute("href", href);
                   linkTag.setAttribute("target", "_blank");

				   String newLinkHtml = linkTag.toHtml();
				   htmlContent = htmlContent.replace(linkHtml,newLinkHtml);
	            }else if(node instanceof ImageTag){//重新设置图片的src路径
	               ImageTag imageTag = (ImageTag)nodeList.elementAt(i);
	               String imageHtml = imageTag.toHtml();
	               String src = imageTag.getAttribute("src");
				   if(src.indexOf("http://") == -1){
				       src = pathPre+"/"+src;
				   }  
	               imageTag.setAttribute("src", src);

	               String newImagetml = imageTag.toHtml();
                   htmlContent = htmlContent.replace(imageHtml,newImagetml);
	            }
	        }
	        
	    }catch(Exception e){
	        e.printStackTrace();
	    } 
		return htmlContent;
	}
%>

<html>
    <head>
	    
		<style>
		    body{background:#fff; font-family: Microsoft YaHei ,微软雅黑; margin:10px;}
            h3{margin:20px 0;padding:0px 0 0px 10px;font-size:14px;font-weight:blod;text-align:left;line-height:12px;color:#333; border-left: solid 3px #134262 }

            p{text-indent:2em;font-size:14px;line-height:1.6em;margin:0px 0px 10px 0px;}
            a{color: #03F;text-decoration:none;}
            a:hover{color: #134262;}

            ul{margin:10px 4em;padding:0;}
            ul li{margin:0;padding:0;line-height:20px;font-size:12px;}
            ol{margin:10px 4em;padding:0;}
            ol li{margin:0;padding:0;line-height:20px;font-size:12px;}
            table{margin:20px 0 0;border:1px solid #FFF;text-indent:.5em;font-size:12px;}
            thead tr td{border-right:1px solid #FFF;border-bottom:1px solid #FFF;background:#134262;color:#fff;height:26px;}
            tbody tr td{border-right:1px solid #FFF;border-bottom:1px solid #FFF;background:#f2f2f2;height:26px;}
            img{margin:10px 0; max-width:1200px;}
            code{line-height:26px;margin:20px 0 0;padding:10px;background:#f2f2f2;border-left:5px solid #134262;display:block;font-size:12px;font-weight:normal;}
            H5{line-height:26px;margin:20px 0 0;padding:10px;background:#f2f2f2;border-left:5px solid #134262;display:block;font-size:12px;font-weight:normal;}
            BLOCKQUOTE{line-height:20px;margin:20px 0 0 0;padding:20px 20px 20px 50px;  border:1px solid #ccc;display:block;font-size:12px; background:#f2f2f2 url(image/BLOCKQUOTE.png) no-repeat 5px 5px;}
            pre{line-height:30px; padding:0 0 0 40px;color:#a5a5a5;font-size:12px; font-family: Microsoft YaHei ,微软雅黑; background:url(image/pre.png) no-repeat center left;}
            H4{ font-weight:bold; color:red; font-style:normal; font-size:14px;}
            EM{ font-weight:bold; color:red; font-style:normal; font-size:14px;}
		</style>
	</head>
	<body></body>

</html>