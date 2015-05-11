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




  /*this is a test of plugin for the zoom to full extend */
  L.Control.zoomHome = L.Control.extend({
    options: {
        position: 'topleft',
        zoomInText: '+',
        zoomInTitle: 'Zoom in',
        zoomOutText: '-',
        zoomOutTitle: 'Zoom out',
        // zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>',
        zoomHomeText: '<img src = "image/MapFullExtent.png"/>',
        zoomHomeTitle: 'Zoom Full'
    },

    onAdd: function (map) {
        var controlName = 'three-control-zoom',
            container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
            options = this.options;

        this._zoomInButton = this._createButton(options.zoomInText, options.zoomInTitle,
        controlName + '-in', container, this._zoomIn);
        this._zoomHomeButton = this._createButton(options.zoomHomeText, options.zoomHomeTitle,
        controlName + '-home', container, this._zoomHome);
        this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
        controlName + '-out', container, this._zoomOut);

        this._updateDisabled();
        map.on('zoomend zoomlevelschange', this._updateDisabled, this);
        return container;
    },

    onRemove: function (map) {
        map.off('zoomend zoomlevelschange', this._updateDisabled, this);
    },

    _zoomIn: function (e) {
        this._map.zoomIn(e.shiftKey ? 3 : 1);
    },

    _zoomOut: function (e) {
        this._map.zoomOut(e.shiftKey ? 3 : 1);
    },

    _zoomHome: function (e) {
        map.setView([27.6933, 85.5643], 9);
    },

    _createButton: function (html, title, className, container, fn) {
        var link = L.DomUtil.create('a', className, container);
        link.innerHTML = html;
        link.href = '#';
        link.title = title;

        L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
            .on(link, 'click', L.DomEvent.stop)
            .on(link, 'click', fn, this)
            .on(link, 'click', this._refocusOnMap, this);

        return link;
    },

    _updateDisabled: function () {
        var map = this._map,
            className = 'leaflet-disabled';

        L.DomUtil.removeClass(this._zoomInButton, className);
        L.DomUtil.removeClass(this._zoomOutButton, className);

        if (map._zoom === map.getMinZoom()) {
            L.DomUtil.addClass(this._zoomOutButton, className);
        }
        if (map._zoom === map.getMaxZoom()) {
            L.DomUtil.addClass(this._zoomInButton, className);
        }
    }
  });
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