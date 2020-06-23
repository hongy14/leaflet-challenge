url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 3
  });
  // Adding tile layer

var grayMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,

    id: "mapbox/light-v10",
  
    accessToken: API_KEY
  })
  
grayMap.addTo(myMap);
  
d3.json(url, function(data) {
    //console.log(data)

    var coordinates = []

    for (var i=0; i < data.features.length; i++) {
        var Marker = L.circle([data.features[i].geometry.coordinates[1], data.features[i].geometry.coordinates[0]], {
            color: "#8c8c8c",
            weight: 1,
            fillColor: colorCircles(data.features[i].properties.mag),
            fillOpacity: 0.75,
            radius: circleSize(data.features[i].properties.mag)              
        })
        coordinates.push(Marker)
    }
    
    console.log(coordinates)
    L.layerGroup(coordinates).addTo(myMap); 

    function colorCircles(magnitude) {
        if (magnitude>=0 & magnitude<=1) {
            return "#66FF33";
        } else if (magnitude >1 & magnitude <=2) {
            return "#d1ff74";
        } else if (magnitude >2 & magnitude <=3) {
            return "#FFFF00";
        } else if (magnitude >3 & magnitude <=4) {
            return "#FFCC66";
        } else if (magnitude >4 & magnitude <=5) {
            return "#FF9999";
        } else {
            return "#FF5050";
        }
    };

    function circleSize(magnitude) {
        if (magnitude>=0 & magnitude<=1) {
            return 10000;
        } else if (magnitude >1 & magnitude <=2) {
            return 40000;
        } else if (magnitude >2 & magnitude <=3) {
            return 80000;
        } else if (magnitude >3 & magnitude <=4) {
            return 120000;
        } else if (magnitude >4 & magnitude <=5) {
            return 160000;
        } else {
            return 200000;
        }
    };

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>location: " + feature.properties.place);
        }
    }).addTo(myMap);

    var legend = L.control({ 
        position: "bottomright"
    });
    
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var colors = ["#66FF33","#d1ff74","FFFF00","FFCC66","FF9999","FF5050"]
        var grades = [0, 1, 2, 3, 4, 5];
        
        for (var i=0; i<grades.length; i++) {
            div.innerHTML += "<i style='background:" + colors[i] + " '>    </i>" +
            grades[i] + (grades[i+1] ? "&ndash;" + grades [i+1] + "<br>" : grades[i] + "+")  
        }
        return div;
    };
    
    legend.addTo(myMap);    

});