/// <reference types="@types/googlemaps" />
import { Component, OnInit, Input } from '@angular/core';
import { Address } from '../models/address';

@Component({
  selector: 'map',
  templateUrl: './map.component.html'
})
export class MapComponent implements OnInit {

  @Input() address: Address;
  @Input() title: string = "Titulo";

  map: google.maps.Map;

  constructor() { }

  ngOnInit() {
    this.setMap();
  }

  setMap() {
    let geocoder = new google.maps.Geocoder();
    let markerTitle = this.title;
    
    geocoder.geocode({ 'address': this.address.complete }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          let latitude = results[0].geometry.location.lat();
          let longitude = results[0].geometry.location.lng();

          let latlng = new google.maps.LatLng(latitude, longitude);

          let mapOpt = {
            center: latlng,
            zoom: 19,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }
          
          let map = new google.maps.Map(document.getElementById('map'), mapOpt);

          let marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: markerTitle,
            draggable: true
          });

          google.maps.event.addListener(marker, 'dragend', function (a) {
            let div = document.createElement('div');
            div.innerHTML = a.latLng.lat().toFixed(4) + ', ' + a.latLng.lng().toFixed(4);
            document.getElementsByTagName('body')[0].appendChild(div);
          });

        }
      }
    })

  }

}
