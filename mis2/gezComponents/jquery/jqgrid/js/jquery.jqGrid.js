function jqGridInclude(){var a="mis2/gezComponents/jquery/jqgrid/js/";var c=[{include:true,incfile:"grid.base.js"},{include:true,incfile:"grid.common.js"},{include:true,incfile:"grid.formedit.js"},{include:true,incfile:"grid.inlinedit.js"},{include:true,incfile:"grid.celledit.js"},{include:true,incfile:"grid.subgrid.js"},{include:true,incfile:"grid.treegrid.js"},{include:true,incfile:"grid.custom.js"},{include:true,incfile:"grid.postext.js"},{include:true,incfile:"grid.tbltogrid.js"},{include:true,incfile:"grid.setcolumns.js"},{include:true,incfile:"grid.import.js"},{include:true,incfile:"jquery.fmatter.js"},{include:true,incfile:"grid.grouping.js"},{include:true,incfile:"jqModal.js"},{include:true,incfile:"jqDnR.js"},{include:true,incfile:"JsonXml.js"},{include:true,incfile:"grid.jqueryui.js"},{include:true,incfile:"jquery.searchFilter.js"}];var b;for(var d=0;d<c.length;d++){if(c[d].include===true){b=a+c[d].incfile;if(jQuery.browser.safari){jQuery.ajax({url:b,dataType:"script",async:false,cache:true})}else{if(jQuery.browser.msie){document.write('<script type="text/javascript" src="'+b+'"><\/script>')}else{e(b)}}}}function e(f){var h=document.getElementsByTagName("head")[0];var g=document.createElement("script");g.type="text/javascript";g.charset="UTF-8";g.src=f;h.appendChild(g)}}jqGridInclude();