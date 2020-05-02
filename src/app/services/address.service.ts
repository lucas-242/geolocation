import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../models/address';
import { GoogleLocationModel } from '../models/googleLocationModel';

@Injectable()
export class AddressService {

    constructor(protected apiHttp: HttpClient) { }

    /**
     * Busca o endereço completo de acordo com o zipCode
     * @param zipCode Cep pelo qual o endereço será buscado
     * @returns Retorna um Observable de Address
     */
    getAddress(address: Address): Observable<Address> {

        return Observable.create(observer => {

            this.getAddressByLatLng(address.latitude, address.longitude).subscribe(
                response => {
                    // address = this.getCountryInfo(response, address);
                    address = this.getAddressInfo(response, address);

                    observer.next(address);
                    observer.complete();
                },
                error => {
                    //TODO: Tratar Erro
                }
            );

        });
    }

    /**
     * Busca informações da localização por Latitude e Longitude
     * @param lat Latitude
     * @param lng Longitude
     */
    getAddressByLatLng(lat: number, lng: number): Observable<GoogleLocationModel> {
        let parameters = `${lat}, ${lng}`;
        return this.apiHttp.get<GoogleLocationModel>(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${parameters}&key=AIzaSyCO4gwBdfPiIRlL3objUhR755yjP7uOxvg&language=en`
        );
    }


    /**
     * Verifica as informações referente a Bairro e Rua dentro do objeto de resposta da API do google
     * @param model Objeto de resposta do google
     * @param address Objeto que será alterado
     */
    private getAddressInfo(model: GoogleLocationModel, address: Address) {
        model.results.some(result => {
            for (let i = 0; i < Object.keys(result.address_components).length; i++) {
                let types = result.address_components[i].types;

                if (types.indexOf('route') != -1) {
                    address.street = result.address_components[i].long_name;
                }

                else if (types.indexOf('street_number') != -1) {
                    address.number = +result.address_components[i].long_name;
                }

                else if (types.indexOf('sublocality_level_1') != -1) {
                    address.neighborhood = result.address_components[i].long_name;
                }

                else if (types.indexOf('country') != -1) {
                    address.country = result.address_components[i].long_name
                }

                else if (types.indexOf('administrative_area_level_1') != -1) {
                    address.state = result.address_components[i].short_name
                }

                else if (types.indexOf('administrative_area_level_2') != -1) {
                    address.city = result.address_components[i].long_name
                }

                else if (types.indexOf('postal_code') != -1) {
                    address.zipCode = +result.address_components[i].long_name.replace(/\D/g, '');
                }

                if (address.street != undefined && address.neighborhood != undefined && address.zipCode != undefined) {
                    address.complete = `${address.zipCode} ${address.street} - ${address.number}, ${address.neighborhood}`
                    return true;
                }
            }
        });

        return address;
    }

}