function init (){
  var map = L.map('map').setView([27.714, 85.319], 13);
    osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    mapbox = 'https://{switch:a,b,c,d}.tiles.mapbox.com/v4/mapbox.satellite-kathmandu-20150425-after/{zoom:7}/{x}/{y}.jpg?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJhNVlHd29ZIn0.ti6wATGDWOmCnCYen-Ip7Q';
    osmAttribution = 'Map Tiles &copy; CC BY-SA <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/*for osm layer*/
    var osm = L.tileLayer(osmUrl, {
        attribution: osmAttribution,
        doubleClickZoom: true
      }).addTo(map);


    var mapbox = L.tileLayer(mapbox);
    
  // var pruneCluster = new PruneClusterForLeaflet();
  // var marker = new PruneCluster.Marker(latitude, longitude);
  // pruneCluster.RegisterMarker(marker);
  // leafletMap.addLayer(pruneCluster);

  function popup_show(f,l){
      // console.log(f.properties.Description);
      // debugger;
      // var marker = new PruneCluster.Marker(f.geometry.coordinates);
      // pruneCluster.RegisterMarker(marker);
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
  var road_damages = new L.geoJson.ajax('road_damaged.geojson',{
    onEachFeature : popup_show
  });
  var major_destructions = new L.geoJson.ajax('major_destruction.geojson',{
    onEachFeature : popup_show
  });
  // map.addLayer(pruneCluster);
  var baseLayers = {
    "Post-Disaster Image":mapbox,
    "OpenStreetMap": osm      
  }
  var overlays = {
    "Damaged Buildings" : damaged_buildings,
    "Damaged Road" : road_damages,
    "Major Destructions" : major_destructions
  }
  L.control.layers(baseLayers,overlays).addTo(map);
}