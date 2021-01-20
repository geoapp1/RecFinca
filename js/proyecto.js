
//Globals

var map = L.map("map", {zoomControl: false}); 

//Basemaps de OSM. No se utilizan en la app como está configurada actualmente. Opción de cambiarlo de quererse.
var osmURL = "http://{s}.tile.osm.org/{z}/{x}/{y}.png";
var osmAtt = "&copy; <a href=\"http://openstreetmap.org/copyright\">OpenStreetMap</a> contributors";


var locationOptions = {
	"enableHighAccuracy": true, //Permite posicionamiento GNSS
	"timeout": 7000 //Cancela luego de 7 segundos

}



var osm = L.tileLayer(osmURL, {maxZoom: 20,attribution: osmAtt});
//Basemap de fotografías aereas de ESRI
var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});


var n = 0; //Contador de puntos
var pointLng = null; //Longitud actual
var pointLtd = null; //Latitud actual
var pointAcc = null; //Precisión actual

var pointArray = []; //Donde se almacenan puntos

var markerArray = [];
var markerOptions = {
	radius: 0.3,
	color: "black",
	fillOpacity: 0.9
};


watchId = null;

var locationOptions = {
	enableHighAccuracy: true,
	timeout: 6000
}




var pointId = document.getElementById("point-id");
var pointIdText = document.getElementById("point-id-text");

//Conexión a botones del HTML
document.getElementById("id-box").addEventListener("click", toggleIdBox, false);
document.getElementById("geolocation").addEventListener("click", toggleLocation, false);
document.getElementById("point").addEventListener("click", storePoint, false);
document.getElementById("memory").addEventListener("click", clearMemory, false);
document.getElementById("file").addEventListener("click", saveGeoJSON, false);
document.getElementById("mapa").addEventListener("click", allFeaturesZoom, false);

navigator.geolocation.getCurrentPosition(currentLocation);

map.setView([0.0,0.0], 1);
//map.addLayer(osm); 
map.addLayer(Esri_WorldImagery); 

//Función que obtiene posicionamiento actual
function currentLocation(position) {
	pointLng = position.coords.longitude;
	pointLtd = position.coords.latitude;
	map.setView([pointLtd, pointLng], 16);
	alert("Utiliza los iconos para activar geolocalización, escribir el tipo de cultivo, añadir el punto al mapa, borrar los datos para reiniciar de ser necesario, extiender el mapa final y guardar los datos, respectivamente. Escribe el nombre de los cultivos igual que como aparecen en la leyenda.");
	alert("La aplicación está adaptada para fincas en Puerto Rico, con los cultivos más comunes según el Dept. de Agricultura y el USDA.");
}

//Función que genera la tabla de texto
function toggleIdBox() {
	if (pointId.style.display == "none"){
		pointId.style.display = "block";
		pointIdText.focus();
	} else if (pointId.style.display == "block"){
		pointId.style.display = "none";
	}
}


function toggleLocation() {
	//Si no se puede obtener geolocalización, salir
	if (!navigator.geolocation) {
		return;
	}
	
	if (watchId === null) {
		
		//Comenzar geolocalización
		watchId = navigator.geolocation.watchPosition(locationSuccess,
		locationError, locationOptions);
	document.getElementsByClassName("fas fa-map-pin")
	[0].style.color = "red";
	document.getElementsByClassName("fas fa-map-pin")
	[0].style.animation = "blinker 3s linear infinite";
	document.getElementsByClassName("fas fa-map-pin")
	[0].style.webkitAnimation = "blinker 3s linear infinite";
	} else {
	//Parar geolocalización
	navigator.geolocation.clearWatch(watchId);
	watchId = null;
	document.getElementsByClassName("fas fa-map-pin")
	[0].style.color = "black";
	document.getElementsByClassName("fas fa-map-pin")
	[0].style.animation = "";
	document.getElementsByClassName("fas fa-map-pin")
	[0].style.webkitAnimation = "";
		}
	}

//Función almacenar puntos	
function storePoint() {
	if (pointLng === null || pointLtd === null || pointAcc === null) {
		return;
	}
	//Contador ID
	var countId = ("0000" + n.toString()).substr(-4)
	if (pointIdText.value === "") {
		var pointIdValue = null;
	} else {
		var pointIdValue = pointIdText.value;
	}
	//Fecha
	var currentDate = new Date();
	//Creación de nuevo GeoJSON
	var feature = {
	type: "Feature",
	id: countId,
	geometry: {
		type: "Point",
		coordinates: [pointLng, pointLtd]
	},
	properties: {
		sid: pointIdValue,
		accuracy: pointAcc,
		time: currentDate.toISOString()
		}
	}
	
	pointArray.push(feature);
	
	pointIdText.value = "";
	
	if (pointId.style.display == "block") {
		pointId.style.display = "none";
	}
	
	//Simbología para cada cultivo en específico
	if (pointIdValue === 'caña'){
		color = '#5F9EA0';
	} else if (pointIdValue === 'ají|'){
		color = '#FF7F50';
	} else if (pointIdValue === 'café'){
		color = '#996600';
	} else if (pointIdValue === 'guineo'){
		color = '#F4D03F';
	} else if (pointIdValue === 'batata'){
		color = '#E59866';	
	} else if (pointIdValue === 'berenjena'){
		color = '#9B59B6';	
	} else if (pointIdValue === 'cacao'){
		color = '#7E5109';	
	} else if (pointIdValue === 'china'){
		color = '#F39C12';	
	} else if (pointIdValue === 'habichuela'){
		color = '#C0392B';	
	} else if (pointIdValue === 'plátano'){
		color = '#9A7D0A';	
	} else if (pointIdValue === 'tomate'){
		color = '#F6DDCC';	
	} else if (pointIdValue === 'yuca'){
		color = '#D7BDE2';	
	} else if (pointIdValue === 'ñame'){
		color = '#D4E6F1';	
	} else if (pointIdValue === 'yautía'){
		color = 'D98880';	
	} else if (pointIdValue === 'lechoza'){
		color = '#D35400';	
	} else if (pointIdValue === 'rambután'){
		color = '#5499C7';	
	} else if (pointIdValue === 'limón'){
		color = '#F9E79F';	
	} else if (pointIdValue === 'malanga'){
		color = '#BFC9CA';	
	} else if (pointIdValue === 'guayaba'){
		color = '#641E16';	
	} else if (pointIdValue === 'pimiento'){
		color = '#196F3D';			
	} else {
		color = "black";
	}

		
//var markID = L.circle([pointLtd, pointLng], markerOptions); 
var markID = L.circle([pointLtd, pointLng], {radius: 5, color: color, fillOpacity: 0.9 });
	markID.addTo(map); //Dibujar marcador
	markPopup = "ID= " + countId + '<br/>' +
				"User ID= " + pointIdValue + '<br/>' +
				"Latitude= " + pointLtd.toFixed(8) + '<br/>' +
				"Longitude= " + pointLng.toFixed(8) + '<br/>' +
				"Accuracy= " + pointAcc.toFixed(2);
	markID.bindPopup(markPopup);
	markerArray.push(markID);
	map.setView([pointLtd, pointLng], 100);
	//Dibujar los buffers alrededor de puntos con color de cada cultivo
	//var geojii = {type: "FeatureCollection", features: pointArray}
	//return L.geoJSON(turf.buffer(geojii, 5, {units: 'meters'}), {style:{color:color}}).addTo(map);	

	
	n++;
	console.log(JSON.stringify(feature, null, 2));
}



//Función para demarcar zoom en todos los puntos. Visualizaci[on final.
function allFeaturesZoom() {
	alert("Estos son los cultivos registrados. Toma un screenshot para salvar esta visualización o descarga los datos en formato GeoJSON en el icono de guardar para que los utilices luego.")
	let latlngs = markerArray.map(marker => marker.getLatLng())
	let latlngBounds = L.latLngBounds(latlngs)
	map.flyToBounds(latlngBounds)

}
   

//Función para guardar GeoJSON
function saveGeoJSON() {
	
	//Verificar si hay datos
	if (pointArray.length == 0) {
		alert("No hay datos colectados.");
		return false;
	}

	// Creación de contenido en GeoJSON
	var geoj = {type: "FeatureCollection", features: pointArray}
			
	
	var mime = "data:application/json;charset=utf-8,";
	

	
	var saveLink = document.createElement("a");
	
	var fileName = createDateTimeFilename();
	
	//Asignar atributos
	saveLink.setAttribute("href", mime+encodeURI(JSON.stringify(geoj, null, 4)));
	saveLink.setAttribute("download", fileName);
	
	
	document.body.appendChild(saveLink);
	
	
	saveLink.click();

	
	document.body.removeChild(saveLink);
	
	
	n = 0;
	pointArray = [];
	
}

//Función para crear el nombre del archivo GeoJSON generado
function createDateTimeFilename(){
	var rightNow = new Date();
	var nd = ("00" + rightNow.getUTCDate()).substr(-2,2);
	var nm = ("00" + (rightNow.getUTCMonth() + 1)).substr(-2,2);
	var ny = ("0000" + rightNow.getUTCFullYear()).substr(-4,4);
	var nhr = ("00" + rightNow.getUTCHours()).substr(-2,2);
	var nmn = ("00" + rightNow.getUTCMinutes()).substr(-2,2);
	var nsc = ("00" + rightNow.getUTCSeconds()).substr(-2,2);
	var fn = ny + nm + nd + "_" + nhr + nmn + nsc + ".json";
	return(fn);
}

//Función para obtener localización
function getLocation() {
	
	//Verificar servicio geolocalización
	if (navigator.geolocation) {
		//Obtener geolocalización
		navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
			
	} else {
		alert("Geolocation not supported.");
	}
}

//Función para cuando se tenga el servicio de localización
function locationSuccess(position) {
	var locText = document.getElementById("location-text");
	pointLng = position.coords.longitude;
	pointLtd = position.coords.latitude;
	pointAcc = position.coords.accuracy;
	console.log(pointLtd + "," + pointLng);
}

//Función para notificar error de localización
function locationError (error) {
	var msg = "";
	switch(error.code){
		case error.PERMISSION_DENIED:
			msg = "Geolocation request denied.";
			break;
		case error.POSITION_UNAVAILABLE:
			msg = "Position unavailable.";
			break;
		case error.TIMEOUT:
			msg = "Geolocation request timed out.";
			break;
		case error.UNKNOWN_ERROR:
			msg = "Unknown geolocation error.";
			break;
	}
	navigator.notification.alert(msg, function(){}, "Rec Finca", "Ok");
}

//Función para verificar si existen datos para borrar.
function clearMemory() {

	if (pointArray.length == 0) {
		alert("No hay datos colectados");
		return;	
	}

	var clearMem = confirm ("Se perderán los datos. ¿Desea proceder?");
	
	console.log(clearMem);
	if (clearMem) {
		map.eachLayer((layer) => {
			layer.remove();
		});
		
	//Carga de basemap limpio
	var Esri_WorldImagery_2 = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	});	
	map.addLayer(Esri_WorldImagery_2); 
	}
		
	if (!clearMem) {
		return;
	}
	
	pointArray = [];
	
	
}




