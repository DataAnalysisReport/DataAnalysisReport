/*
 * Treeview 1.5pre - jQuery plugin to hide and show branches of a tree
 * 
 * http://bassistance.de/jquery-plugins/jquery-plugin-treeview/
 * http://docs.jquery.com/Plugins/Treeview
 *
 * Copyright (c) 2007 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.treeview.js 5759 2008-07-01 07:50:28Z joern.zaefferer $
 *
 */
(function(){
	var modules=[
		'/mis2/gezComponents/jsUtils/IconFactory.js',
		'/mis2/gezComponents/formstyle/js/form.js'
	];
	rqLoadJS(modules);
})(); 
var thisObj=null; 
function changeStyle(obj){
    if(thisObj!=null){
        $(thisObj).css("color","#000");
        $(thisObj).removeClass("treeNodeSelected");
    }
    // $(obj).css("color","#4467ff");
    $(obj).addClass("treeNodeSelected");
    
    thisObj=obj;
    //	alert(obj.id);
    
    //选中树节点后添加整行背景色
    if($(obj).find("span").length==0){
        $(".treeNodebgDiv").remove();//清除其他树节点的背景色
        $(obj).parent().css("background","none");
        
        var isPopTree=($(obj).parent().parent().parent().parent()[0].tagName).toLowerCase()=="li";//区分普通树和弹出树的标志，弹出树的四个parent是li标签，普通树第四个parent是span标签
        var isFileTree=$(obj).prev().attr("restype")=="null";//是否是文件树
        /*
        var bgDivWidth=$("body").width();
        if(isPopTree){
        	bgDivWidth = $(obj).parent().parent().parent().parent().width();
        }
        var divbg=$("<div class='treeNodebgDiv' style='position:absolute;height:30px;width:"+bgDivWidth+"px;z-index:-1;'></div>");
        var liObj=null;
        if($(obj).parent().parent().parent().find("li").length>0){//机构用户树
            liObj=$(obj).parent().parent();
            divbg.prependTo(liObj);
        }else if($(obj).parent().parent().parent().parent().parent().find("li").length>0){//机构树
            liObj=$(obj).parent().parent().parent().parent();
            divbg.prependTo(liObj);
            //$(".treeNodebgDiv").css("margin-top","-6px");
        }else{//资源和角色树
            liObj=$(obj).parent().parent().parent().parent().parent();
            divbg.prependTo(liObj);
        }*/

        var divbg=$("<div class='treeNodebgDiv' style='position:absolute;height:30px;z-index:-1;'></div>");
        var liObj = $(obj).parents("li").eq(0);
        var bgDivWidth = parseInt(liObj.width());
        if(liObj.children("div.hitarea").length > 0){
            bgDivWidth = bgDivWidth - parseInt(liObj.children("div.hitarea").outerWidth(true));
        }
        divbg.prependTo(liObj).width(bgDivWidth);
        if(!isPopTree && $(obj).parent().parent().parent().parent()[0].tagName!="DIV" || isFileTree){
        	$(".treeview").parent().css("position","relative").css("z-index","100").css("overflow-x","hidden");
    	}
    }
}



//get selected node Info
function getNodeObj(){
	return thisObj.firstChild;
}
function getNodeId(){
	if(thisObj==null){
		return "";
	}else{
	var resId = $(thisObj.firstChild).attr("id");
	return(resId);
	} 
}
function getNodeName(){
	if(thisObj==null){
		return "";
	}else{
	var resName =$(thisObj.firstChild).attr("name");
	return(resName);
	} 
}
function getNodeType(){
	if(thisObj==null){
		return "";
	}else{
	var resType =$(thisObj.firstChild).attr("type");
		return(resType);
	} 
}
 

;(function($) {

	// TODO rewrite as a widget, removing all the extra plugins
	$.extend($.fn, {
		swapClass: function(c1, c2) {
			var c1Elements = this.filter('.' + c1);
			this.filter('.' + c2).removeClass(c2).addClass(c1);
			c1Elements.removeClass(c1).addClass(c2);
			return this;
		},
		replaceClass: function(c1, c2) {
			return this.filter('.' + c1).removeClass(c1).addClass(c2).end();
		},
		hoverClass: function(className) {
			className = className || "hover";
			return this.hover(function() {
				$(this).addClass(className);
			}, function() {
				$(this).removeClass(className);
			});
		},
		heightToggle: function(animated, callback) {
			animated ?
				this.animate({ height: "toggle" }, animated, callback) :
				this.each(function(){
					jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]();
					if(callback)
						callback.apply(this, arguments);
				});
		},
		heightHide: function(animated, callback) {
			if (animated) {
				this.animate({ height: "hide" }, animated, callback);
			} else {
				this.hide();
				if (callback)
					this.each(callback);				
			}
		},
		prepareBranches: function(settings) {
			if (!settings.prerendered) {
				// mark last tree items
				this.filter(":last-child:not(ul)").addClass(CLASSES.last);
				// collapse whole tree, or only those marked as closed, anyway except those marked as open
				this.filter((settings.collapsed ? "" : "." + CLASSES.closed) + ":not(." + CLASSES.open + ")").find(">ul").hide();
			}
			// return all items with sublists
			return this.filter(":has(>ul)");
		},
		applyClasses: function(settings, toggler) {
			// TODO use event delegation
			this.filter(":has(>ul):not(:has(>a))").find(">span").unbind("click.treeview").bind("click.treeview", function(event) {
				// don't handle click events on children, eg. checkboxes
				if ( this == event.target )
					toggler.apply($(this).next());
			}).add( $("a", this) ).hoverClass();
			
			if (!settings.prerendered) {
				// handle closed ones first
				this.filter(":has(>ul:hidden)")
						.addClass(CLASSES.expandable)
						.replaceClass(CLASSES.last, CLASSES.lastExpandable);
						
				// handle open ones
				this.not(":has(>ul:hidden)")
						.addClass(CLASSES.collapsable)
						.replaceClass(CLASSES.last, CLASSES.lastCollapsable);
						
	            // create hitarea if not present
				var hitarea = this.find("div." + CLASSES.hitarea);
				if (!hitarea.length)
					hitarea = this.prepend("<div iconType='1' class=\"" + CLASSES.hitarea + "\"/>").find("div." + CLASSES.hitarea);
					hitarea.append($(IconFactory.getIcon("gezico_p_ziyuanzhongxinzhedie")));
					this.find("div div i.i1").addClass("iconZD");
					//解决qtp回放问题
					$("."+CLASSES.hitarea).each(function(){
						if($(this).find("#hideDiv").length==0){
							$(this).append($('<div id="hideDiv" style=position:absolute;width:100%;height:100;">'+$(this).parent().find("span").eq(0).attr("dispvalue")+'</div>'));
							$(this).find("#hideDiv").css("display","none");
						}
					})
				hitarea.removeClass().addClass(CLASSES.hitarea).each(function() {
					var classes = "";
					$.each($(this).parent().attr("class").split(" "), function() {
						classes += this + "-hitarea ";
					});
					$(this).addClass( classes );
				})
			}
			this.find("div." + CLASSES.hitarea).css("position","relative");//解决ie7下图标错位bug
			// apply event to hitarea
			this.find("div." + CLASSES.hitarea).click( toggler );
		},
		treeview: function(settings) {
			
			settings = $.extend({
				cookieId: "treeview"
			}, settings);
			
			if ( settings.toggle ) {
				var callback = settings.toggle;
				settings.toggle = function() {
					return callback.apply($(this).parent()[0], arguments);
				};
			}
		
			// factory for treecontroller
			function treeController(tree, control) {
				// factory for click handlers
				function handler(filter) {
					return function() {
						// reuse toggle event handler, applying the elements to toggle
						// start searching for all hitareas
						toggler.apply( $("div." + CLASSES.hitarea, tree).filter(function() {
							// for plain toggle, no filter is provided, otherwise we need to check the parent element
							return filter ? $(this).parent("." + filter).length : true;
						}) );
						return false;
					};
				}
				// click on first element to collapse tree
				$("a:eq(0)", control).click( handler(CLASSES.collapsable) );
				// click on second to expand tree
				$("a:eq(1)", control).click( handler(CLASSES.expandable) );
				// click on third to toggle tree
				$("a:eq(2)", control).click( handler() ); 
			}
		
			// handle toggle event
			function toggler() {
	var iconType = $(this).parent().find(">.hitarea").attr("iconType");
				if(iconType==1){
					$(this).parent().find(">.hitarea").children(".icon_div").remove();
					$(this).parent().find(">.hitarea").append($(IconFactory.getIcon("gezico_p_ziyuanzhongxinzhankai")));
					$(this).parent().find(">.hitarea").attr("iconType","0");
					$(this).parent().find("div div.icon_div i.i1").addClass("iconZD");
					$(this).parent().children("span").children("#folder").children(".icon_div").remove();
					$(this).parent().children("span").children("#folder").children("span").before($(IconFactory.getIcon("gezico_p_wenjianjiazhankai")));
				}else{
					$(this).parent().find(">.hitarea").children(".icon_div").remove();
					$(this).parent().find(">.hitarea").append($(IconFactory.getIcon("gezico_p_ziyuanzhongxinzhedie")));
					$(this).parent().find(">.hitarea").attr("iconType","1");
					$(this).parent().find("div div.icon_div i.i1").addClass("iconZD");
					$(this).parent().children("span").children("#folder").children(".icon_div").remove();
					$(this).parent().children("span").children("#folder").children("span").before($(IconFactory.getIcon("gezico_p_ziyuanzhongxinwenjianjiazhedie")));
				}
				$(this)
					.parent()
					// swap classes for hitarea
					.find(">.hitarea")
					.end()
					// find child lists
					.find( ">ul" )
					// toggle them
					.heightToggle( settings.animated, settings.toggle );
				if ( settings.unique ) {
					$(this).parent().siblings().find(">.hitarea").end().find( ">ul" ).heightHide( settings.animated, settings.toggle );

			
	}
			}
			this.data("toggler", toggler);
			
			function serialize() {
				function binary(arg) {
					return arg ? 1 : 0;
				}
				var data = [];
				branches.each(function(i, e) {
					data[i] = $(e).is(":has(>ul:visible)") ? 1 : 0;
				});
				$.cookie(settings.cookieId, data.join(""), settings.cookieOptions );
			}
			
			function deserialize() {
				var stored = $.cookie(settings.cookieId);
				if ( stored ) {
					var data = stored.split("");
					branches.each(function(i, e) {
						$(e).find(">ul")[ parseInt(data[i]) ? "show" : "hide" ]();
					});
				}
			}
			
			// add treeview class to activate styles
			this.addClass("treeview");
			
			// prepare branches and find all tree items with child lists
			var branches = this.find("li").prepareBranches(settings);
			
			switch(settings.persist) {
			case "cookie":
				var toggleCallback = settings.toggle;
				settings.toggle = function() {
					serialize();
					if (toggleCallback) {
						toggleCallback.apply(this, arguments);
					}
				};
				deserialize();
				break;
			case "location":
				var current = this.find("a").filter(function() {
					return this.href.toLowerCase() == location.href.toLowerCase();
				});
				if ( current.length ) {
					// TODO update the open/closed classes
					var items = current.addClass("selected").parents("ul, li").add( current.next() ).show();
					if (settings.prerendered) {
						// if prerendered is on, replicate the basic class swapping
						items.filter("li")
							.swapClass( CLASSES.collapsable, CLASSES.expandable )
							.swapClass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
							.find(">.hitarea")
								.swapClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea )
								.swapClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea );
					}
				}
				break;
			}
			
			branches.applyClasses(settings, toggler);
				
			// if control option is set, create the treecontroller and show it
			if ( settings.control ) {
				treeController(this, settings.control);
				$(settings.control).show();
			}
			
			return this;
		}
	});
	
	// classes used by the plugin
	// need to be styled via external stylesheet, see first example
	$.treeview = {};
	var CLASSES = ($.treeview.classes = {
		open: "open",
		closed: "closed",
		expandable: "expandable",
		expandableHitarea: "expandable-hitarea",
		lastExpandableHitarea: "lastExpandable-hitarea",
		collapsable: "collapsable",
		collapsableHitarea: "collapsable-hitarea",
		lastCollapsableHitarea: "lastCollapsable-hitarea",
		lastCollapsable: "lastCollapsable",
		lastExpandable: "lastExpandable",
		last: "last",
		hitarea: "hitarea"
	});
	
})(jQuery);