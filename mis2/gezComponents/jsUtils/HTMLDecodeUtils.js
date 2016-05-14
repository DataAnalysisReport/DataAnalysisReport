/**
 * HTML解码工具类
 */

var HTMLDecodeUtils = {
	/**
	 * @param encodedStr 已加密的字符串 
	 * @returns 加密前的字符串
	 */
	decode:function(encodedStr) {
		if(encodedStr == undefined || encodedStr == null || encodedStr == ""){
			return "";
		}
		var buffer = new StringBuffer();
		var firstAmp = encodedStr.indexOf("&");
		if(firstAmp < 0 ){
			return encodedStr;
		}
		buffer.append(encodedStr.substring(0,firstAmp));
		var len = encodedStr.length;
		for (var i = firstAmp ; i < len; i++) {
			var c = encodedStr.charAt(i);
			if (c == '&') {
				var nextIdx = i + 1;
				var semiColonIdx = encodedStr.indexOf(";", nextIdx);
				if (semiColonIdx == -1) {
					buffer.append(c);
				} else {
					var amphersandIdx = encodedStr.indexOf("&", i + 1);
					if ((amphersandIdx != -1) && (amphersandIdx < semiColonIdx)) {
						buffer.append(c);
					} else {
						var entityContent = encodedStr.substring(nextIdx, semiColonIdx);
						var entityValue = -1;
						var entityContentLen = entityContent.length;
						if (entityContentLen > 0) {
							if (entityContent.charAt(0) == '#') {
								if (entityContentLen > 1) {
									var isHexChar = entityContent.charAt(1);
									try {
										switch (isHexChar) {
										case 'X':
										case 'x':
											entityValue = String.fromCharCode(parseInt(entityContent.substring(2), 16));
											break;
										default:
											entityValue = String.fromCharCode(parseInt(entityContent.substring(1), 10));
										}
										if (entityValue > 65535)
											entityValue = -1;
									} catch (e) {
										entityValue = -1;
									}
								}
							} else{
								entityValue = String.fromCharCode(this.entityValue(entityContent));
							}
						}
						if (entityValue == -1) {
							buffer.append("&");
							buffer.append(entityContent);
							buffer.append(";");
						} else {
							buffer.append(entityValue);
						}
						i = semiColonIdx;
					}
				}
			} else {
				buffer.append(c);
			}
		}
		//var decodedStr = buffer.toString();
		/* 实现html解码，要与html编码对应 */
		//return decodedStr;
		return buffer;
	},
	entityValue:function(name){
		var BASIC_ARRAY = new Array(new Array("quot", "34"),new Array("amp", "38"),new Array("lt", "60"),new Array("gt", "62"));
		var APOS_ARRAY = new Array(new Array("apos", "39"));
		var ISO8859_1_ARRAY = new Array( new Array( "nbsp", "160" ), new Array( "iexcl", "161" ), new Array( "cent", "162" ), new Array( "pound", "163" ), new Array( "curren", "164" ), new Array( "yen", "165" ), new Array( "brvbar", "166" ), new Array( "sect", "167" ), new Array( "uml", "168" ), new Array( "copy", "169" ), new Array( "ordf", "170" ), new Array( "laquo", "171" ), new Array( "not", "172" ), new Array( "shy", "173" ), new Array( "reg", "174" ), new Array( "macr", "175" ), new Array( "deg", "176" ), new Array( "plusmn", "177" ), new Array( "sup2", "178" ), new Array( "sup3", "179" ), new Array( "acute", "180" ), new Array( "micro", "181" ), new Array( "para", "182" ), new Array( "middot", "183" ), new Array( "cedil", "184" ), new Array( "sup1", "185" ), new Array( "ordm", "186" ), new Array( "raquo", "187" ), new Array( "frac14", "188" ), new Array( "frac12", "189" ), new Array( "frac34", "190" ), new Array( "iquest", "191" ), new Array( "Agrave", "192" ), new Array( "Aacute", "193" ), new Array( "Acirc", "194" ), new Array( "Atilde", "195" ), new Array( "Auml", "196" ), new Array( "Aring", "197" ), new Array( "AElig", "198" ), new Array( "Ccedil", "199" ), new Array( "Egrave", "200" ), new Array( "Eacute", "201" ), new Array( "Ecirc", "202" ), new Array( "Euml", "203" ), new Array( "Igrave", "204" ), new Array( "Iacute", "205" ), new Array( "Icirc", "206" ), new Array( "Iuml", "207" ), new Array( "ETH", "208" ), new Array( "Ntilde", "209" ), new Array( "Ograve", "210" ), new Array( "Oacute", "211" ), new Array( "Ocirc", "212" ), new Array( "Otilde", "213" ), new Array( "Ouml", "214" ), new Array( "times", "215" ), new Array( "Oslash", "216" ), new Array( "Ugrave", "217" ), new Array( "Uacute", "218" ), new Array( "Ucirc", "219" ), new Array( "Uuml", "220" ), new Array( "Yacute", "221" ), new Array( "THORN", "222" ), new Array( "szlig", "223" ), new Array( "agrave", "224" ), new Array( "aacute", "225" ), new Array( "acirc", "226" ), new Array( "atilde", "227" ), new Array( "auml", "228" ), new Array( "aring", "229" ), new Array( "aelig", "230" ), new Array( "ccedil", "231" ), new Array( "egrave", "232" ), new Array( "eacute", "233" ), new Array( "ecirc", "234" ), new Array( "euml", "235" ), new Array( "igrave", "236" ), new Array( "iacute", "237" ), new Array( "icirc", "238" ), new Array( "iuml", "239" ), new Array( "eth", "240" ), new Array( "ntilde", "241" ), new Array( "ograve", "242" ), new Array( "oacute", "243" ), new Array( "ocirc", "244" ), new Array( "otilde", "245" ), new Array( "ouml", "246" ), new Array( "divide", "247" ), new Array( "oslash", "248" ), new Array( "ugrave", "249" ), new Array( "uacute", "250" ), new Array( "ucirc", "251" ), new Array( "uuml", "252" ), new Array( "yacute", "253" ), new Array( "thorn", "254" ), new Array( "yuml", "255" ) );
		var HTML40_ARRAY = new Array( new Array( "fnof", "402" ), new Array( "Alpha", "913" ), new Array( "Beta", "914" ), new Array( "Gamma", "915" ), new Array( "Delta", "916" ), new Array( "Epsilon", "917" ), new Array( "Zeta", "918" ), new Array( "Eta", "919" ), new Array( "Theta", "920" ), new Array( "Iota", "921" ), new Array( "Kappa", "922" ), new Array( "Lambda", "923" ), new Array( "Mu", "924" ), new Array( "Nu", "925" ), new Array( "Xi", "926" ), new Array( "Omicron", "927" ), new Array( "Pi", "928" ), new Array( "Rho", "929" ), new Array( "Sigma", "931" ), new Array( "Tau", "932" ), new Array( "Upsilon", "933" ), new Array( "Phi", "934" ), new Array( "Chi", "935" ), new Array( "Psi", "936" ), new Array( "Omega", "937" ), new Array( "alpha", "945" ), new Array( "beta", "946" ), new Array( "gamma", "947" ), new Array( "delta", "948" ), new Array( "epsilon", "949" ), new Array( "zeta", "950" ), new Array( "eta", "951" ), new Array( "theta", "952" ), new Array( "iota", "953" ), new Array( "kappa", "954" ), new Array( "lambda", "955" ), new Array( "mu", "956" ), new Array( "nu", "957" ), new Array( "xi", "958" ), new Array( "omicron", "959" ), new Array( "pi", "960" ), new Array( "rho", "961" ), new Array( "sigmaf", "962" ), new Array( "sigma", "963" ), new Array( "tau", "964" ), new Array( "upsilon", "965" ), new Array( "phi", "966" ), new Array( "chi", "967" ), new Array( "psi", "968" ), new Array( "omega", "969" ), new Array( "thetasym", "977" ), new Array( "upsih", "978" ), new Array( "piv", "982" ), new Array( "bull", "8226" ), new Array( "hellip", "8230" ), new Array( "prime", "8242" ), new Array( "Prime", "8243" ), new Array( "oline", "8254" ), new Array( "frasl", "8260" ), new Array( "weierp", "8472" ), new Array( "image", "8465" ), new Array( "real", "8476" ), new Array( "trade", "8482" ), new Array( "alefsym", "8501" ), new Array( "larr", "8592" ), new Array( "uarr", "8593" ), new Array( "rarr", "8594" ), new Array( "darr", "8595" ), new Array( "harr", "8596" ), new Array( "crarr", "8629" ), new Array( "lArr", "8656" ), new Array( "uArr", "8657" ), new Array( "rArr", "8658" ), new Array( "dArr", "8659" ), new Array( "hArr", "8660" ), new Array( "forall", "8704" ), new Array( "part", "8706" ), new Array( "exist", "8707" ), new Array( "empty", "8709" ), new Array( "nabla", "8711" ), new Array( "isin", "8712" ), new Array( "notin", "8713" ), new Array( "ni", "8715" ), new Array( "prod", "8719" ), new Array( "sum", "8721" ), new Array( "minus", "8722" ), new Array( "lowast", "8727" ), new Array( "radic", "8730" ), new Array( "prop", "8733" ), new Array( "infin", "8734" ), new Array( "ang", "8736" ), new Array( "and", "8743" ), new Array( "or", "8744" ), new Array( "cap", "8745" ), new Array( "cup", "8746" ), new Array( "int", "8747" ), new Array( "there4", "8756" ), new Array( "sim", "8764" ), new Array( "cong", "8773" ), new Array( "asymp", "8776" ), new Array( "ne", "8800" ), new Array( "equiv", "8801" ), new Array( "le", "8804" ), new Array( "ge", "8805" ), new Array( "sub", "8834" ), new Array( "sup", "8835" ), new Array( "sube", "8838" ), new Array( "supe", "8839" ), new Array( "oplus", "8853" ), new Array( "otimes", "8855" ), new Array( "perp", "8869" ), new Array( "sdot", "8901" ), new Array( "lceil", "8968" ), new Array( "rceil", "8969" ), new Array( "lfloor", "8970" ), new Array( "rfloor", "8971" ), new Array( "lang", "9001" ), new Array( "rang", "9002" ), new Array( "loz", "9674" ), new Array( "spades", "9824" ), new Array( "clubs", "9827" ), new Array( "hearts", "9829" ), new Array( "diams", "9830" ), new Array( "OElig", "338" ), new Array( "oelig", "339" ), new Array( "Scaron", "352" ), new Array( "scaron", "353" ), new Array( "Yuml", "376" ), new Array( "circ", "710" ), new Array( "tilde", "732" ), new Array( "ensp", "8194" ), new Array( "emsp", "8195" ), new Array( "thinsp", "8201" ), new Array( "zwnj", "8204" ), new Array( "zwj", "8205" ), new Array( "lrm", "8206" ), new Array( "rlm", "8207" ), new Array( "ndash", "8211" ), new Array( "mdash", "8212" ), new Array( "lsquo", "8216" ), new Array( "rsquo", "8217" ), new Array( "sbquo", "8218" ), new Array( "ldquo", "8220" ), new Array( "rdquo", "8221" ), new Array( "bdquo", "8222" ), new Array( "dagger", "8224" ), new Array( "Dagger", "8225" ), new Array( "permil", "8240" ), new Array( "lsaquo", "8249" ), new Array( "rsaquo", "8250" ), new Array( "euro", "8364" ) );
		for(var i=0;i<BASIC_ARRAY.length;i++){
			if(name==BASIC_ARRAY[i][0]){
				return BASIC_ARRAY[i][1];
			}
		}
		for(var i=0;i<APOS_ARRAY.length;i++){
			if(name==APOS_ARRAY[i][0]){
				return APOS_ARRAY[i][1];
			}
		}
		for(var i=0;i<ISO8859_1_ARRAY.length;i++){
			if(name==ISO8859_1_ARRAY[i][0]){
				return ISO8859_1_ARRAY[i][1];
			}
		}
		for(var i=0;i<HTML40_ARRAY.length;i++){
			if(name==HTML40_ARRAY[i][0]){
				return HTML40_ARRAY[i][1];
			}
		}
		return -1;
	}
};

//StringBuffer类
function StringBuffer () {
	this._strings_ = new Array();
};

StringBuffer.prototype.append = function(str) {
	this._strings_.push(str);
};

StringBuffer.prototype.toString = function() {
		return this._strings_.join("");
};

