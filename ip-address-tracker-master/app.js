const ipInput = document.getElementById('ipInput');
var ipMap = L.map('mapid').setView([0,0],13)
const tileURL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attibution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tiles = L.tileLayer(tileURL,{attibution});
const myIcon = L.icon({
    iconUrl: './images/icon-location.svg',
    iconSize: [40,40],
})
var marker1 = L.marker([0,0], {icon: myIcon})
marker1.addTo(ipMap)
tiles.addTo(ipMap);



function updateMap(x,y) {
    var container = L.DomUtil.get('mapid'); 
    if(container != null){ 
        container._leaflet_id = null; 
    }
    ipMap = L.map('mapid').setView([x,y],13)
    var newLatLng = new L.LatLng(x,y);
    marker1.setLatLng(newLatLng);
    tiles.addTo(ipMap);
    marker1.addTo(ipMap);
}


function getMap() {

    let base_url =  "https://geo.ipify.org/api/v2/country,city?apiKey=at_Z8jhxu78jswibEU0zuFT0MSXHVrwX&ipAddress=";
    let ip_url = ipInput.value;
    let url = base_url.concat(ip_url);

    async function getData() {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }


    async function showMap(){
        let ipData = await getData();
        if(ipData.hasOwnProperty('messages')) {
            alert(ipData.messages);
        } else {
            var container = L.DomUtil.get('mapid'); 
            if(container != null){ 
                container._leaflet_id = null; 
            }
            let ipVal = document.getElementById('ipVal');
            let region = document.getElementById('region');
            let city = document.getElementById('city');
            let timezone = document.getElementById('timezone');
            let zip = document.getElementById('zip');
            let isp = document.getElementById('isp');
            console.log(ipVal,region,city,timezone,isp)
            ipVal.innerText = ip_url;
            region.innerText = ipData.location.region;
            city.innerText = ipData.location.city;
            timezone.innerText = ipData.location.timezone;
            isp.innerText = ipData.isp;
            zip.innerText = ipData.as.asn;
            let lat = ipData.location.lat;
            let lng = ipData.location.lng;
            updateMap(lat,lng);
        }
    }
    showMap();
}

window.onload = function() {
    updateMap(12.780889,437.770445);
}
ipInput.addEventListener('keypress', (event) => {
    if(event.key === "Enter") {
        document.getElementById('btn').click();
    }
})