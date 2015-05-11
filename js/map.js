function init (){
  //console.log('inside the init');
  var north_east = new L.latLng(26.328231, 80.029907);
  var south_west = new L.latLng(30.605155, 88.225708);
  var bounds = new L.latLngBounds(north_east, south_west);
  map = L.map('map',{zoomControl:false}).setView([27.6933, 85.5643], 9);
  
  var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  var mapbox = 'https://{switch:a,b,c,d}.tiles.mapbox.com/v4/mapbox.satellite-kathmandu-20150425-after/{zoom:7}/{x}/{y}.jpg?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJhNVlHd29ZIn0.ti6wATGDWOmCnCYen-Ip7Q';
    
/*for osm layer*/
  var osm = L.tileLayer(osmUrl, {
      doubleClickZoom: true
  });


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

  var markersClusterBuildings = L.markerClusterGroup();
  var markersClusterRoad = L.markerClusterGroup(); 
  var markersClusterMajor = L.markerClusterGroup();
  var markersClusterTent = L.markerClusterGroup();    
  function pointToLayer(f,ll){
    var icon = L.icon({
      iconSize: [20, 20],
      iconAnchor: [13, 27],
      popupAnchor:  [1, -24],
      iconUrl: 'image/icon.png'
    });
    return L.marker(ll, {icon: icon})
  }
  function onEachFeature (f,l){
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
  var damaged_buildings = new L.GeoJSON.AJAX("data/Damaged_Building/damaged_buildings1.geojson", {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  });  
  
  var damaged_road = new L.GeoJSON.AJAX("data/Damaged_road/damaged_road1.geojson", {
      pointToLayer: pointToLayer,
      onEachFeature: onEachFeature
  });
  var major_destruction = new L.GeoJSON.AJAX("data/Major_Destruction/major_destruction1.geojson", {
      pointToLayer: pointToLayer,
      onEachFeature: onEachFeature
  });
  var tent_shelter = new L.GeoJSON.AJAX("data/TentShelter/tent_shelter1.geojson", {
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
  });
  damaged_road.on('data:loaded', function () {
      markersClusterRoad.addLayer(damaged_road);
  });
  tent_shelter.on('data:loaded', function () {
      markersClusterTent.addLayer(tent_shelter);
  });
  major_destruction.on('data:loaded', function () {
      markersClusterMajor.addLayer(damaged_road);
  });


  var baseLayers = {
    "Districts": district     
  }

  var overlays = {
    "OpenStreetMap": osm,
    "Building Damages" : markersClusterBuildings,
    "Damaged Road" : markersClusterRoad,
    "Major Destructions" : markersClusterMajor,
    "Shelter Tents" : markersClusterTent,
    "Village Name":vilname,
    "VDC":vdc
    //"Transportation":trans,
    //"Rivers":hydro
  }
  

  //addition of attribution
  var attribution = 'Map Tiles &copy; CC BY-SA <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Vector data source: <a href = "http://www.dos.gov.np">Survey Department</a>, Earthquake Damages Points: <a href = "http://blog.tomnod.com/Nepal-Earthquake-Data-Portal">Tomnod</a>, Data updated on 9th May,2015';
  map.attributionControl.setPrefix('');
  L.control.attribution({
    position: 'bottomright',
  }).addAttribution(attribution).setPrefix('<a href= "http://www.leafletjs.com">leaflet</a>').addTo(map);

//addition of overlays and set the collapsed false 
  L.control.layers(baseLayers,overlays,{collapsed:false}).addTo(map);



  // add the new control to the map
  var zoomHome = new L.Control.zoomHome();
  zoomHome.addTo(map);
  


  //easy way of doing so
    // $("div.leaflet-control-zoom").append("<a class='new-control-zoom-to-extent' href=# title='Zoom to extent'><div id = 'zoom'><img src = 'img/MapFullExtent.png'></div></a>");
    // $("a.new-control-zoom-to-extent").click(function(){
    //     set the map view
    //     document.activeElement.blur();
    // });

}