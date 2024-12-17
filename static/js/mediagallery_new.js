var media_type, metadataJSON, md5_to_metadata, curr_costume, shifted, playing, selected_objects, selected_tags;

var type_to_tags = {
	backdrop: {
		category: ["indoors",  "outdoors",  "other"],
		theme: ["castle", "city", "flying", "music-and-dance", "nature", "space", "sports", "underwater"]
	},
	costume: {
		category: ["animals",  "fantasy",  "people", "things", "transportation"],
		theme: ["castle", "city", "flying", "music-and-dance", "space", "sports", "underwater", "walking"],
		type: ["drawing", "photo"]
	},
	sound: {
		category: ["animal", "effects", "electronic", "human", "instruments", "music-loops", "percussion", "vocals"]
	},
	sprite: {
		category: ["animals",  "fantasy",  "people", "things", "transportation"],
		theme: ["castle", "city", "flying", "music-and-dance", "space", "sports", "underwater", "walking"],
		type: ["drawing", "photo"],
		features: ["scripts", "costumes", "sounds"]
	}
};

$(document).ready(function() { 
	JSopenMediaLibrary = function(asset_type){ // called from SWF; open media library from project editor
		resetMediaLibrary()
		media_type = (asset_type=="background") ? "backdrop" : asset_type;
		$('#media-library').modal();
		initLibrary();
	    resizeModal()
	}
	
	function initLibrary(){ //initialize media library
    	selected_objects = []; 
    	selected_tags = {category: [], theme: [], type: [], features: []};
    	md5_to_metadata = {}
    	curr_costume = 1
    	shifted = false;
    	playing = false;
	   	$("#results-container").scrollTop(0);
	   	$("#library-name").text(media_type + " library");
	   	$("#media-library").addClass(media_type);
	   	initTags()
	   	var ajax_url = (window.location.port=="") ? static_url+'/mediaLibrary.json' : "/mediagallery/json/"
	   	$.ajax({
			url: ajax_url,
			success: function(data) { 
		   		metadataJSON = data;
		   		for (i in metadataJSON){
			   		if (metadataJSON[i].type==media_type){
			   			var md5 = metadataJSON[i].md5;
			   			md5_to_metadata[md5] = metadataJSON[i];
				   		$("#results").append("<li id='"+md5+"'></li>");
				   		for (j in metadataJSON[i].tags){
					   		$("#"+md5.replace(".","\\.")).addClass(metadataJSON[i].tags[j]);
				   		}
				   		if (media_type=="sprite"){
					   		getSpriteData(md5)
				   		}else{
					   		createThumbnail(md5)
				   		}
			   		}
			   	}
		   	},
		})
		
	}
	
	function initTags(){ //initialize list of tags
		var tag_set = eval("type_to_tags."+media_type);
		if (tag_set.category){$("#category h4").show()}
		if (tag_set.theme){$("#theme h4").show()}
		if (tag_set.type){$("#type h4").show()}
		if (tag_set.features){$("#features h4").show()}
		for (i in tag_set){
			if (i=="features"){
				$("#features ul").append('<li id="all" class="'+i+' current"><span class="tag-link titlecase"><a href="#" class="">all</a></span></li>')
				$("#features ul").append('<li id="scripts" class="features"><span class="tag-link titlecase"><a href="#" class="">scripts</a></span></li>')
				$("#features ul").append('<li id="costumes" class="features"><span class="tag-link titlecase"><a href="#" class="">costumes > 1</a></span></li>')
				$("#features ul").append('<li id="sounds" class="features"><span class="tag-link titlecase"><a href="#" class="">sounds</a></span></li>')
			}else{
				$("#"+i+" ul").append('<li id="all" class="'+i+' current"><span class="tag-link titlecase"><a href="#" class="">all</a></span></li>')	
				for (j in tag_set[i]){
					$("#"+i+" ul").append('<li id="'+tag_set[i][j]+'" class="'+i+'"><span class="tag-link titlecase"><a href="#" class="">'+tag_set[i][j].replace(/\-/g,' ')+'</a></span></li>')
				}
			}
		}
	}


	function getSpriteData(md5){ //get sprite data
		$.ajax({
			url: Scratch.ROOT_URL + '/internalapi/asset/'+md5+'/get/',
			context: {md5 : md5}, 
			dataType: 'json',
			success: function(data) {
				var md5 = this.md5;
				var costumes = [];
				for (i in data.costumes){
					costumes.push(data.costumes[i].baseLayerMD5);
				}
				md5_to_metadata[md5]["costumes"] = costumes;
				createThumbnail(md5);
			}
		})
	}

	function createThumbnail(md5){ //create thumbnail preview of media object	
		var curr_metadata = md5_to_metadata[md5]
		var md5_selector = md5.replace(".","\\.")
		switch(media_type){
			case "sprite":
			  	var html = "<div class='media thumbnail'>";
				for (i in curr_metadata.costumes){
					if (i==0){ 
						html += "<img class='' src='" + Scratch.ROOT_URL + "/internalapi/asset/"+curr_metadata.costumes[0]+"/get/'>";
					}else{
						html+="<img class='hidden' src='" + Scratch.ROOT_URL + "/internalapi/asset/"+curr_metadata.costumes[i]+"/get/'>";
					}
				}
				html+='<div class="arrows"><a id="left" class="carousel-control left arrow-left off" href="#" data-slide="prev">‹</a>\<a id="right" class="carousel-control right arrow-right off" href="#" data-slide="next">›</a></div>';
				html+="</div><div class='name titlecase'>"+trimTitle(curr_metadata.name,15)+"</div><div class='icons'>";
				if (curr_metadata.info[0]>0){ 
					$("#"+md5_selector).addClass("scripts");
					html+="<img src='"+static_url+"/images/mediagallery/scripts_sm.png' />";
				}
				if (curr_metadata.info[1]>1){ 
					$("#"+md5_selector).addClass("costumes");
					html+="<img src='"+static_url+"/images/mediagallery/costumes_sm.png' />";
				}
				if (curr_metadata.info[2]>0){ 
					$("#"+md5_selector).addClass("sounds");
					html+="<img src='"+static_url+"/images/mediagallery/sounds_sm.png' />";
				}
				html+="</div>";
				$("#"+md5_selector).append(html);
				break;
			case "sound":
				var html = "<div class='media thumbnail'><img class='' src='"+static_url+"/images/sound.png' height='20'></div> \<div class='sound-title titlecase' >"+trimTitle(curr_metadata.name,15)+"</div><div class='sound-length'>"+curr_metadata.info[0]+"</div>";
				html+= "<div class='sound-controls'><span id='play' class='button small grey'><span class='play-icon'><img src='"+static_url+"/images/mediagallery/play2.png' height='13'></span><span class='pause-icon hidden'><img src='"+static_url+"/images/mediagallery/play_blue.png' height='13'/></span></span></div>";
				$("#"+md5_selector).append(html);
				break;
			default:
				$("#"+md5_selector).append("<div class='media thumbnail'><img class='' src='" + Scratch.ROOT_URL + "/internalapi/asset/"+md5+"/get/'></div><div class='name titlecase'>"+trimTitle(curr_metadata.name,15)+"</div>");  
		}
	}
	
	function loadThumbnailPreview(md5){
		resetInfoBox()
		var md5_selector = md5.replace(".","\\.")
		var name = md5_to_metadata[md5].name
		var tags = md5_to_metadata[md5].tags
		var counts = md5_to_metadata[md5].info
		//selected_objects.push([name, md5])
		current_costume=1 
		$("#selected-object").attr("md5",md5)
		$("#object-name").text(name)
		if (media_type=="sprite"){
			$("#scripts.count").text(counts[0])
			$("#costumes.count").text(counts[1])
			$("#sounds.count").text(counts[2])
			if (counts[1]>1){
				$("#"+md5_selector+" .arrows").show()
				$("#"+md5_selector+" .arrows .right").removeClass("off")
			}
		}
	}
	
	function showInfoBox(md5_selector){
		$("#info-box").css("top",$("#"+md5_selector).position().top+$("#results-container").scrollTop()+1+"px")
		if ($("#results-container").width()-$("#"+md5_selector).position().left-$("#"+md5_selector).width() > 185){
			$("#info-box").css("left", $("#"+md5_selector).position().left + $("#"+md5_selector).width() + 15 +"px")
		}else{
			$("#info-box").css("left",$("#"+md5_selector).position().left-200+"px")
		}
	}  

	function resetMediaLibrary(){ //clear results in media library
		current_tags.main = [];
		current_tags = [];
		md5_list = [];
		metadataJSON = {};
		$("#media-library").removeClass("sprite costume background sound")
		$('#media-library #filters ul').html("");
		$('#media-library ul#results').html("");
		$("#filters h4").hide()
		$("#results-container").scrollTop(0)
		$("#object-name").html("");
		$("#object-thumbnail").html("");
		if (type =="sprite"){
			$("#info-box").css("top", "6px")
			$("#info-box").css("left", "142px")
		}
		$("#info-box").show()
	}
	
	
	function closeMediaLibrary(submitSelected){
		$('#media-library').modal('hide')
		if (submitSelected){
			Scratch.FlashApp.ASobj.ASimportMedia(selected_objects)
		}
		resetMediaLibrary()
	}

/* Listeners */

	$("#media-library #ok").click(function(){ //click OK button
		closeMediaLibrary(true)
	})
	
	$("#media-library #cancel").click(function(){ //click cancel button
		closeMediaLibrary(false)
	})
	
	$("#media-library .close").click(function(){ //click close button
		closeMediaLibrary(false)
	})


	$("#results li").live("click", function(e){ //click on media object
		var md5 = $(this).attr("id")
		var md5_selector = md5.replace(".","\\.")
		if (e.shiftKey==false){ //shift key not pressed
			$("#results li").removeClass("selected")
			selected_objects = []
		}else if (e.shiftKey && $(this).hasClass("selected")){ //deselect already selected object
			$("#"+md5_selector).removeClass("selected")
			selected_objects.splice(findElement(md5, selected_objects), 1)
			return false
		}
		$("#"+md5_selector).addClass("selected")
		selected_objects.push([md5_to_metadata[md5].name, md5]) 
		switch(media_type){
			case "sprite":
				loadThumbnailPreview(md5)
				showInfoBox(md5_selector)
				break;
			case "sound":
				break;
			default:
				loadThumbnailPreview(md5)
		} 
	})
	
	$("#results li").live("dblclick", function(e){
		var md5 = $(this).attr("id")
		var md5_selector = md5.replace(".","\\.")
		$("#results li").removeClass("selected")
		selected_objects = []
		$("#"+md5_selector).addClass("selected")
		selected_objects.push([md5_to_metadata[md5].name, md5])
		closeMediaLibrary(true)
	})
	
	$("#results li").live("mouseleave", function(e){
		if ($(this).hasClass("selected") && media_type=="sprite"){
			$("#info-box").hide()
		}
	})
	
	$("#results li").live("mouseenter", function(e){
		if ($(this).hasClass("selected") && !e.shiftKey && media_type=="sprite"){
			$("#info-box").show()
		}
	})
	
	$("#filters .tag-link").live("click", function(e){ //click on tag filter
		e.preventDefault()
		selected_objects = []
		$("#results li").hide()
		$("#results-container").scrollTop(0)
		var tag = $(this).parent().attr("id");
		var tag_type = $(this).parent().parent().parent().attr("id")
		$("#filters ."+tag_type).removeClass("current")
		$("#filters #"+tag+"."+tag_type).addClass("current")
		if (media_type=="sprite"){
			resetInfoBox()
		}
		if (tag=="all"){
			selected_tags[tag_type]=[]
		}else{
			selected_tags[tag_type]=[tag]
		}
		flat_tags = selected_tags.category.concat(selected_tags.theme).concat(selected_tags.type).concat(selected_tags.features)
		if (flat_tags.length>0){
			tag_selector="."+flat_tags.join(".")
			console.log(tag_selector)
			$("#results li"+tag_selector).show()
		}else{
			$("#results li").show()
		}
	})
		
	$(".arrows .left").live("click", function(e){ //click left arrow in costume preview
		e.preventDefault()
		var md5 = $("#selected-object").attr("md5")
		var md5_selector = md5.replace(".","\\.")
		var num_costumes = md5_to_metadata[md5].info[1]
		if ($(this).hasClass("off")==false){
			var prev_costume = current_costume-1
			$("#"+md5_selector+" .thumbnail img:nth-child("+current_costume+")").addClass("hidden")
			$("#"+md5_selector+" .thumbnail img:nth-child("+prev_costume+")").removeClass("hidden")
			$("#"+md5_selector+" .right").removeClass("off")
			current_costume-=1
			if (prev_costume==1){ $("#"+md5_selector+" .left").addClass("off") }
		}
		return false;
	})
	
	$(".arrows .right").live("click",function(e){ //click right arrow in costume preview
		e.preventDefault()
		var md5 = $("#selected-object").attr("md5")
		var md5_selector = md5.replace(".","\\.")
		var num_costumes = md5_to_metadata[md5].info[1]
		if ($(this).hasClass("off")==false){
			var next_costume = current_costume+1
			$("#"+md5_selector+" .thumbnail img:nth-child("+current_costume+")").addClass("hidden")
			$("#"+md5_selector+" .thumbnail img:nth-child("+next_costume+")").removeClass("hidden")
			$("#"+md5_selector+" .left").removeClass("off")
			current_costume+=1
			if (next_costume==num_costumes){ $("#"+md5_selector+" .right").addClass("off") }
			
		}
		return false;
	})
	
	$(".sound-controls #play").live("click", function(){ //click play button
		var md5 = $(this).parent().parent().attr("id")
		var md5_selector = md5.replace(".","\\.")
		$(".play-icon").removeClass("hidden")
		$(".pause-icon").addClass("hidden")
		$("#"+md5_selector+ " .play-icon").addClass("hidden")
		$("#"+md5_selector+ " .pause-icon").removeClass("hidden")
		sound = new Audio(Scratch.ROOT_URL + "/internalapi/asset/"+md5+"/get/");
		sound.play()
		/*
var audio_type = md5.substring(md5.indexOf(".")+1)
		if (audio_type=="mp3"){
			$("#sound").html("<audio id='audio-player' name='audio-player' type='audio/mpeg3' src=Scratch.ROOT_URL+'/internalapi/asset/"+md5+"/get/'>")
		}else if (audio_type=="wav"){
			$("#sound").html("<audio id='audio-player' name='audio-player' type='audio/wav' src=Scratch.ROOT_URL+'/internalapi/asset/"+md5+"/get/'>")
		}
		setTimeout(function(){ $("#audio-player")[0].play()},300)
		$("#audio-player").bind('ended', function(){
		    $(".play-icon").removeClass("hidden")
			$(".pause-icon").addClass("hidden")
		});
*/
	})
	
		
	$(document).keydown(function (e) { //SHIFT keydown event
	    var code = e.keyCode || e.which;
	    if (code == 16 && e.shiftKey) { 
	    	shifted=true 
	    }
	});
	
	$(document).keyup(function (e) { //SHIFT keyup event
	    var code = e.keyCode || e.which;
	    if (code == 16 && e.shiftKey) { 
	    	shifted=false 
	    }
	});
	
	
	$("#media-library form.search").keypress( function( e ) {
	  var code = e.keyCode || e.which; //press enter in search bar
	  if( code === 13 ) {
	    e.preventDefault();
	    return false; 
	  }
	})
	
	$(window).resize(function() {
		resizeModal()
	})
	
	/* reset functions */
	function resetMediaLibrary(){ //clear results in media library
		var selected_objects = [];
		var selected_tags = {category: [], theme: [], type: [], features: []};
		var md5_to_metadata = {};
		var curr_costume = 1;
		var shifted = false;
		var playing = false;
		$("#media-library").removeClass("sprite costume backdrop sound")
		$('#media-library #filters ul').html("");
		$('#media-library ul#results').html("");
		$("#filters h4").hide()
		$("#results-container").scrollTop(0)
		$("#object-name").html("");
		$("#object-thumbnail").html("");
		resetInfoBox()
	}
	
	function resetInfoBox(){
		$("#info-box").hide()
		$("#scripts.count").text("0");
		$("#costumes.count").text("1");
		$("#sounds.count").text("0");
		$(".arrows #left").addClass("off");
		$(".arrows #right").addClass("off");
		$(".arrows").hide();
	}
	
	function resizeModal(){ //dynamically resize modal based on window size
		if (media_type=="sound"){
		    width = "900px" 
	    }else{
			width = (($(window).width() < 1100) ? 900 : $(window).width()-200)+"px"
	    }	   
	    $('#media-library').css({
	        width: width,
	        height: (($(window).height() < 650) ? 590 : $(window).height()-100)+"px",
	        'margin-left': function () {
	            return -($(this).width() / 2);
	        },
	        'margin-top': function () {
	            return -($(this).height() / 2);
	        }
	    });
	    if ($(window).width() > 1100){
	    	$("#results-container").css("width", ($('#media-library').width()-220)+"px")
	    	var num_across = Math.floor($("#results-container").outerWidth()/137)
	    	var margin = ($("#results-container").outerWidth()-(num_across*137))
	    	if (media_type!="sound"){ $("#results-container ul").css("margin-left", (margin/2)+"px") }
	    	else{$("#results-container ul").css("margin-left", "0.6em")  }
	    	$("#search-bar input").css("width",600+($('#media-library').width()-900)+"px")
	    }else{
	  		$("#results-container").css("width", "700px")
	  		$("#search-bar input").css("width", "600px")
	  		$("#results-container ul").css("margin-left","0.6em")
	    }
	    if ($(window).height() > 720){
	    	$("#results-container").css("height", ($('#media-library').height()-100)+"px")
	    	$("#media-library .modal-body").css("height", ($('#media-library').height()-45)+"px")
	    	$("#tags ul").css("height", "250px")
	    	$("#bottom-row").css("top", ($('#media-library').height()-74)+"px")
	    	if (media_type!="sound"){$("#tags ul").css("line-height","20px")}
	    	else{$("#tags ul").css("line-height","28px")}
	    }else{
	    	$("#media-library .modal-body").css("height", "545px")
	    	$("#results-container").css("height","490px")
	    	if (media_type!="sound"){ $("#tags ul").css("height", "230px")}
	    	$("#bottom-row").css("top", "516px")
	    	if (media_type!="sound"){ $("#tags ul").css("line-height","18px")}
	    	else{$("#tags ul").css("line-height","28px")}
	    }
	}

	
})

	
/* Utility Functions */

$.urlParam = function(name){ //get value of URL parameters
	if (window.location.search.indexOf(name)==-1){
		return null
	}else{
		var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}
}

function trimTitle(title, length){//trim title if longer than length
	if (title.length> length){
		return title.substring(0,length)+"…"
	}else{
		return title
	}
}

function findElement(elt, array){
	for (var i=0; i<array.length; i++){
		if (array[i][1]==elt || array[i]==elt){
			return i
		}
	}
	return -1
}
