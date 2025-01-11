"use strict";

Handlebars.registerHelper('view', function(classe) {
    var out = "<div>";
    console.log(classe);
    out = out + "<b>" + (new classe()) + "</b>";

    return out + "</div>";
});

function buildTree(url, pid) {
    $.get(url,
          {},
          function(jsonData){
              var data;
              if (jsonData == "not visible")
                  data = {};
              else if (jsonData == "no data")
                  data = projectData;
              else
                  data = unpackData(jsonData);
              var version = getUrlVars()["version"];
              version = version == undefined ? 1 : version;
              App.version = version;
              App.updateForVersion();
              App.url = url;

              //Container for the tree
              var tree = new App.TreeView();

              //Draw text overlay
              var textOverlay = new App.TextOverlay();

              //The paper where the tree will be drawn
              var wrapper = new App.RaphaelPaper();
              App.wrapper = wrapper;

              //Calculate tree
              var rootModel = new App.RootModel({content: data, focus: pid});

              //Draw tree
              var rootView = new App.RootView({model: rootModel, focus: pid});
          }
         );
};

function unpackData(json) {
    var data = JSON && JSON.parse(json) || $.parseJSON(json);
    return data;
};

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
};