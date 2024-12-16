var flashapp, pageNum, curr_q, curr_sort, curr_date; 
var pathname = window.location.pathname
var url_param_string = window.location.search
var curr_type = pathname.substring(8,pathname.length-1)

$(document).ready(function(){
	curr_q = $.urlParam('q') || ""; // Empty string rather than null if no q argument.
	pageNum = ($.urlParam("page")==null) ? 1 : parseInt($.urlParam("page"))
	if (pageNum<total_pages && pathname.indexOf("all_results")==-1){
		$(window).bind('scroll', loadOnScroll)
	};
	$(".search input").eq(0).val(decodeURIComponent(curr_q.replace(/\+/g, " "))) //show query in search bar
	$("#side_tabs li").removeClass("active")
	$("#side_tabs #"+curr_type).addClass("active")
	
    var search_str = window.location.search.substring(1);
    var params = search_str.split("&");
    var display_str = "";
    for (var i=0; i<params.length; i++) {
        var pair = params[i].split("=");
        if (pair[0] == "q") {
            display_str = decodeURIComponent(pair[1]);
            display_str = display_str.replace(/\+/g, " ");
            break;
        }
    }
    $("#search-header").append(": <small id=\"search-subtitle\">"+ $('<div />').text(display_str).html() +"</small>");
    $("#search-subtitle").attr("style", ("font-weight:300;font-size:"+$("#search-header").css("font-size")));
    $("#search-input").attr("value", display_str);
    
	if (curr_type=="projects" || curr_type=="galleries"){
		curr_sort = ($.urlParam('sort_by')==null) ? "most_relevant" : $.urlParam('sort_by')
		curr_date = $.urlParam('date')
		$("#filters li").removeClass("selected")
		$("#"+curr_sort).addClass("selected")
		$("#"+curr_date).addClass("selected")
		$("#any_type").addClass("selected")
	}
	
	else if (curr_type=="users"){
		curr_sort = $.urlParam('sort_by')
		$("#filters li").removeClass("selected")
		$("#"+curr_sort).addClass("selected")
	}
	
	else if (curr_type=="all_results"){
        $.ajax({
                url: "../galleries5/?q="+$.urlParam("q")+"&date=anytime",
                success: function(data){
                        results = $(data).find("#results_list")
                        $("#gallery_all_results .ajax-loader").remove()
                        $("#gallery_all_results").append(results)
                },
        })
        $.ajax({
                url: "../users5/?q="+$.urlParam("q")+"&sort_by=projectCount",
                success: function(data){
                        results = $(data).find("#results_list")
						$("#user_all_results .ajax-loader").remove()
                        $("#user_all_results").append(results)
                },
        })
    }

	
	$("#filters li").click(function(event){
		event.preventDefault()
		if ($(this).hasClass("disabled")==false) {
			var parent_id = $(this).parent().attr('id')
			if (parent_id=="sort_by"){
				curr_sort=$(this).attr('id')
			}
			if (parent_id=="date_filter"){
				curr_date=$(this).attr('id')
			}
			if (curr_type!="users"){ 
				if (curr_sort!="most_relevant"){
					window.location = "../"+curr_type+"/?q="+curr_q+"&sort_by="+curr_sort+"&date="+curr_date
				}else{
					window.location = "../"+curr_type+"/?q="+curr_q+"&date="+curr_date
				}
			}else{
				window.location = "../"+curr_type+"/?q="+curr_q+"&sort_by="+curr_sort
			}
		}
		return false
	})	
    
	
	$("#side_tabs li").click(function(event){
		event.preventDefault()
		var selected_tab = $(this).attr('id')
		if (selected_tab=="projects"||selected_tab=="all_results"){
			window.location = "../"+selected_tab+"/?q="+curr_q+"&date=anytime"
		}
		else if (selected_tab=="galleries"){
			window.location = "../"+selected_tab+"/?q="+curr_q+"&date=anytime"
		}
		else if (selected_tab=="users") {
			window.location = "../"+selected_tab+"/?q="+curr_q+"&sort_by=projectCount"
		}
		else if (selected_tab=="support"){
			window.location = "../"+selected_tab+"/?q="+curr_q
		}
	})

	$(".disabled a").click(function(){
		event.preventDefault()
    })

	
	$(".preview").on("click", function(){
		var id = $(this).parent().attr("id");
		data = { 
			project: {
  				id: id,
  				creator: $(this).parent().attr("creator"),
  				title: $(this).parent().attr("title"),
			}
  		}
        showPlayer(id)
		$(".result").removeClass("preview_mode");
        $(".preview").removeClass("invisible")
		$(this).parent().addClass("preview_mode");
		$(this).addClass("invisible");
		FA.init(data, 'scratch',  false, true);
		$("#scratch").css("visibility", "visible");	
    })

})

function loadswf(id) {
    swfobject.registerObject(id, "10", false);
    return swfobject.getObjectById(id);
}; 	 

function showPlayer(id){
	$("#search_preview_player").remove();
	var player = ' \
		<div id="search_preview_player"> \
             <object id="scratch" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"> \
	          	<param name="movie" value="'+ Scratch.INIT_DATA.GLOBAL_URLS['static_path'] + 'Scratch.swf" /> \
	          	<param name="allowScriptAccess" value="sameDomain"> \
	         	<param name="allowFullScreen" value="true"> \
	         	<param name="wmode" value="opaque"> \
				<param name="scale" value="default"> \
				<param name="FlashVars" value="autostart=true"> \
	          	<!--[if !IE]>--> \
	          	<object type="application/x-shockwave-flash" data="'+ Scratch.INIT_DATA.GLOBAL_URLS['static_path'] + 'Scratch.swf" width="100%" height="100%"> \
		         	<param name="allowScriptAccess" value="sameDomain"> \
		          	<param name="allowFullScreen" value="true"> \
		          	<param name="wmode" value="window"> \
					<param name="scale" value="default"> \
		                    <param name="FlashVars" value="autostart=true"> \
		          	<!--<![endif]--> \
		            	<p>Alternative content</p> \
		          	<!--[if !IE]>--> \
	         	</object> \
	          	<!--<![endif]--> \
             </object> \
        </div> ';
	$(player).appendTo("#"+id);
}

function loadProject(){
	flashapp.ASloadProject(results_array[result_num].creator, results_array[result_num].id, results_array[result_num].title, false, true);
    flashapp.ASsetLoginUser(user);
}

var loadOnScroll = function() {
    if ($(window).scrollTop() > $(document).height() - ($(window).height()*3)) {
        $(window).unbind();
        loadItems();
    }
};

var loadItems = function() {
    pageNum = pageNum + 1;
    $(".ajax-loader").removeClass("hidden")
    var url = pathname + "ajax/"+ url_param_string + '&page='+ pageNum ;
    $.ajax({
        url: url,
        success: function(data) {
        	$(".ajax-loader").addClass("hidden")
            $("#new_results").before(data);
        },
        complete: function(data, textStatus){
            if (pageNum<total_pages){ $(window).bind('scroll', loadOnScroll) };
        }
    });
};

$.urlParam = function(name){
	if (window.location.search.indexOf(name)==-1){
		return null
	}else{
		var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}
}
