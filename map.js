function init (){
  //console.log('inside the init');
  var north_east = new L.latLng(26.328231, 80.029907);
  var south_west = new L.latLng(30.605155, 88.225708);
  var bounds = new L.latLngBounds(north_east, south_west);
   map = L.map('map').setView([27.6933, 85.5643], 9);
  
    osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    mapbox = 'https://{switch:a,b,c,d}.tiles.mapbox.com/v4/mapbox.satellite-kathmandu-20150425-after/{zoom:7}/{x}/{y}.jpg?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJhNVlHd29ZIn0.ti6wATGDWOmCnCYen-Ip7Q';
    osmAttribution = 'Map Tiles &copy; CC BY-SA <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';
   //map.fitBounds(bounds);
/*for osm layer*/
    var osm = L.tileLayer(osmUrl, {
        attribution: osmAttribution,
        doubleClickZoom: true
      }).addTo(map);

/*
TO-dos
1. Add post disaster imageries
2. Add other data (new data)
3. cluster the markers
4. add description and attribution
*/


    var vdc= L.tileLayer.wms('http://202.45.144.203:8080/geoserver/earthquake/wms',{
    layers: 'VDC',
    zoom:7.5,
    opacity: .4,
    transparent: true

  });
var vilname=L.tileLayer.wms('http://202.45.144.203:8080/geoserver/earthquake/wms',{
  layers:'Village_name',
  transparent: true,
  opacity: .4,
});

/*var trans=L.tileLayer.wms('http://localhost:8080/geoserver/NepalEarthquake/wms',{
  layers:'trans_ln',
  transparent: true,
  opacity: .5,
    });

var hydro=L.tileLayer.wms('http://localhost:8080/geoserver/NepalEarthquake/wms',{
  layers:'hydro_ln',
  transparent: true,
  opacity: .5,
    });*/


  damaged_buildings_cluster = L.markerClusterGroup();

  function popup_show(f,l){
      // console.log(f.geometry.coordinates);
      // debugger;
      // var marker = new PruneCluster.Marker(f.geometry.coordinates);
      marker = new L.marker(f.geometry.coordinates);
      damaged_buildings_cluster.addLayer(marker);
      
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

var damaged_buildings = new L.geoJson.ajax('damaged_buildings.geojson',{
    onEachFeature : popup_show
  });


  var road_damages = new L.geoJson.ajax('damaged_buildings.geojson',{
    onEachFeature : popup_show
  });
  var major_destructions = new L.geoJson.ajax('damaged_buildings.geojson',{
    onEachFeature : popup_show
  });
  // map.addLayer(pruneCluster);
  var baseLayers = {
    //"Post-Disaster Image":mapbox,
    "OpenStreetMap": osm
    // "SD": topodata      
  }
   damaged_buildings_cluster.addLayer(damaged_buildings);
  var overlays = {
    "Damaged Buildings" : damaged_buildings_cluster,
    "Damaged Road" : road_damages,
    "Major Destructions" : major_destructions,
    "Village Name":vilname,
    "VDC":vdc,
    //"Transportation":trans,
    //"Rivers":hydro
  }
  map.addLayer(damaged_buildings_cluster);
  L.control.layers(baseLayers,overlays).addTo(map);
  

}