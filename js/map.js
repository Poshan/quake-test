function init (){
  //console.log('inside the init');
  var north_east = new L.latLng(26.328231, 80.029907);
  var south_west = new L.latLng(30.605155, 88.225708);
  var bounds = new L.latLngBounds(north_east, south_west);
   map = L.map('map').setView([27.6933, 85.5643], 9);
  
    osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    mapbox = 'https://{switch:a,b,c,d}.tiles.mapbox.com/v4/mapbox.satellite-kathmandu-20150425-after/{zoom:7}/{x}/{y}.jpg?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJhNVlHd29ZIn0.ti6wATGDWOmCnCYen-Ip7Q';
    attribution = 'Map Tiles &copy; CC BY-SA <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Vector data source: Survey Department, Crowd Sourced Points: Tomnod';
   //map.fitBounds(bounds);
/*for osm layer*/
    var osm = L.tileLayer(osmUrl, {
        attribution: attribution,
        doubleClickZoom: true
      });

/*
TO-dos
1. Add post disaster imageries
2. Add other data (new data)
3. zoom to full extent
4. make circle markers instead
*/


var vdc= L.tileLayer.wms('http://202.45.144.203:8080/geoserver/Nepal_Earthquake/wms',{
    layers: 'VDC',
    zoom:7.5,
    opacity:.4,
    

  });
var vilname=L.tileLayer.wms('http://202.45.144.203:8080/geoserver/Nepal_Earthquake/wms',{
  layers:'Village_name',
  transparent: true,
  opacity: .4,
  zoom:10
});
var district=L.tileLayer.wms('http://202.45.144.203:8080/geoserver/Nepal_Earthquake/wms',{
  layers:'district',
  transparent: true,
  opacity: .4,
  zoom:10
}).addTo(map);
//new addition starts here

var markersClusterBuildings = L.markerClusterGroup();
var markersClusterRoad = L.markerClusterGroup(); 
var markersClusterMajor = L.markerClusterGroup();
var markersClusterTent = L.markerClusterGroup();      
  
var damaged_buildings = new L.GeoJSON.AJAX("data/damaged_buildings.geojson", {
    pointToLayer: function(feature, latlng) {
        var icon = L.icon({
                        iconSize: [20, 20],
                        iconAnchor: [13, 27],
                        popupAnchor:  [1, -24],
                        iconUrl: 'image/icon.png'
                        });
        //return L.marker(latlng);
        return L.marker(latlng, {icon: icon})
    }, 
    onEachFeature: function(f, l) {
        var popUpContent = f.properties.Description;
      l.bindPopup(L.popup({
          closeOnClick: true,
          closeButton: true,
          keepInView: true,
          autoPan: true,
          maxHeight: 500,
          minWidth: 500
      }).setContent(popUpContent));
    }
});
var damaged_road = new L.GeoJSON.AJAX("data/damaged_road.geojson", {
    pointToLayer: function(feature, latlng) {
        var icon = L.icon({
                        iconSize: [20, 20],
                        iconAnchor: [13, 27],
                        popupAnchor:  [1, -24],
                        iconUrl: 'image/icon.png'
                        });
        //return L.marker(latlng);
        return L.marker(latlng, {icon: icon})
    }, 
    onEachFeature: function(f, l) {
        var popUpContent = f.properties.Description;
      l.bindPopup(L.popup({
          closeOnClick: true,
          closeButton: true,
          keepInView: true,
          autoPan: true,
          maxHeight: 500,
          minWidth: 500
      }).setContent(popUpContent));
    }
});
var major_destruction = new L.GeoJSON.AJAX("data/major_destruction.geojson", {
    pointToLayer: function(feature, latlng) {
        var icon = L.icon({
                        iconSize: [20, 20],
                        iconAnchor: [13, 27],
                        popupAnchor:  [1, -24],
                        iconUrl: 'image/icon.png'
                        });
        //return L.marker(latlng);
        return L.marker(latlng, {icon: icon})
    }, 
    onEachFeature: function(f, l) {
    //debugger;
        var popUpContent = '<img src = ' + f.properties.chip_url + '/>';
      l.bindPopup(L.popup({
          closeOnClick: true,
          closeButton: true,
          keepInView: true,
          autoPan: true,
          maxHeight: 500,
          minWidth: 500
      }).setContent(popUpContent));
    }
});
var tent_shelter = new L.GeoJSON.AJAX("data/tent_shelter.geojson", {
    pointToLayer: function(feature, latlng) {
        var icon = L.icon({
                        iconSize: [20, 20],
                        iconAnchor: [13, 27],
                        popupAnchor:  [1, -24],
                        iconUrl: 'image/temporary.gif'
                        });
        //return L.marker(latlng);
        return L.marker(latlng, {icon: icon})
    }, 
    onEachFeature: function(f, l) {
        var popUpContent = f.properties.Description;
      l.bindPopup(L.popup({
          closeOnClick: true,
          closeButton: true,
          keepInView: true,
          autoPan: true,
          maxHeight: 500,
          minWidth: 500
      }).setContent(popUpContent));
    }
});
damaged_buildings.on('data:loaded', function () {
    markersClusterBuildings.addLayer(damaged_buildings).addTo(map);
    // console.log(markersBar);
    // map.addLayer(damaged_buildings);
});
damaged_road.on('data:loaded', function () {
    markersClusterRoad.addLayer(damaged_road);
    // console.log(markersBar);
    // map.addLayer(damaged_buildings);
});
tent_shelter.on('data:loaded', function () {
    markersClusterTent.addLayer(tent_shelter);
    // console.log(markersBar);
    // map.addLayer(damaged_buildings);
});
major_destruction.on('data:loaded', function () {
    markersClusterMajor.addLayer(damaged_road);
    // console.log(markersBar);
    // map.addLayer(damaged_buildings);
});
//new added ends here


  // map.addLayer(pruneCluster);
  var baseLayers = {
    //"Post-Disaster Image":mapbox,
    "Districts": district
    // "SD": topodata      
  }

  var overlays = {
    "Building Damages" : markersClusterBuildings,
  "OpenStreetMap": osm,
    /*"Damaged Road" : markersClusterRoad,
    "Major Destructions" : markersClusterMajor,
  "Shelter Tents" : markersClusterTent,*/
    "Village Name":vilname,
    "VDC":vdc
    //"Transportation":trans,
    //"Rivers":hydro
  }
  // map.addLayer(damaged_buildings_cluster);
  L.control.layers(baseLayers,overlays,{collapsed:false}).addTo(map);
  

}