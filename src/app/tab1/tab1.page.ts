import { Component, OnInit, NgZone } from '@angular/core';
import { NativeGeocoderOptions, NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Address } from '../models/address';
import { AddressService } from '../services/address.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  /**Instância do endereço do usuário */
  address = new Address();

  /**Opções do geolocator */
  options = {
    timeout: 10000,
    enableHighAccuracy: true,
    maximumAge: 3600
  };

  /**Opções do geocoder */
  nativeGeocoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  /**Flag que indica a renderização do mapa */
  showMap: boolean;

  constructor(
    private platform: Platform,
    private addressService: AddressService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
  ) {
    this.platform.ready().then(() => {
      this.getCurrentCoordinates();
    });
  }


  /**Busca a latitude e longitude do local */
  getCurrentCoordinates() {
    this.geolocation.watchPosition().subscribe(
      (response) => {
        this.address.latitude = response.coords.latitude;
        this.address.longitude = response.coords.longitude;
        this.getAddress();
      },
      (error) => {
        console.log('Error getting Latitude/Longitude', error);
      }
    );
  }

  /**Busca o endereço de acordo com as plataformas */
  getAddress() {
    if (this.platform.is('cordova')) {
      this.getAddressByCordova(this.address.latitude, this.address.longitude);
    } else {
      this.getAddressByNavigator(this.address);
    }
  }

  /**Busca o endereço caso a plataforma seja cordova */
  getAddressByCordova(lat: number, lng: number) {
    this.nativeGeocoder.reverseGeocode(lat, lng, this.nativeGeocoderOptions)
      .then((res: NativeGeocoderResult[]) => {
        this.address = this.pretifyAddress(res[0]);
      })
      .catch((error: any) => {
        alert('Error getting Address ' + JSON.stringify(error));
      });
  }


  /**Busca o endereço caso a plataforma seja o navegador */
  getAddressByNavigator(address: Address) {
    if (navigator.geolocation) {

      this.addressService.getAddress(address).subscribe(
        response => {
          this.address = response;
          this.showMap = true;
        },
        error => {

        }
      )
     
    }
  }

  /**Formata o endereço recebido pelo geocoder */
  pretifyAddress(address: any) {
    let obj = [];
    let data = "";
    for (let key in address) {
      obj.push(address[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        data += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }
}
