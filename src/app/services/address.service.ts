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
                    address = this.getCountryInfo(response, address);
                    this.getNeighborhoodInfo(response, address);

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
     * Busca informações da localização por Cep
     * @param zipCode Cep que será usado para efetuar a busca
     */
    getAddressByZipCode(zipCode: string): Observable<GoogleLocationModel> {
        let parameters = `postal_code: ${zipCode}`;
        return this.apiHttp.get<GoogleLocationModel>(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${parameters}&key=AIzaSyDG95Xl3hF3O3blkW56R-spSAVASK8gkns&language=en`
        );
    }

    /**
     * Busca informações da localização por Latitude e Longitude
     * @param lat Latitude
     * @param lng Longitude
     */
    getAddressByLatLng(lat: number, lng: number): Observable<GoogleLocationModel> {
        let parameters = `${lat}, ${lng}`;
        return this.apiHttp.get<GoogleLocationModel>(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${parameters}&key=AIzaSyDG95Xl3hF3O3blkW56R-spSAVASK8gkns&language=en`
        );
    }

    /**
     * Verifica as informações referente a Latitude, Longitude, País, Estado e Cidade 
     * dentro do objeto de resposta da API do google
     * @param model Objeto de resposta do google
     * @param zipCode Cep do local
     * @returns Instância de Address
     */
    private getCountryInfo(model: GoogleLocationModel, address: Address) {

        let googleResponse = model.results[0];

        for (var i = 0; i < Object.keys(googleResponse.address_components).length; i++) {
            let types = googleResponse.address_components[i].types

            if (types.indexOf('country') != -1) {
                address.country = googleResponse.address_components[i].long_name
            }

            if (types.indexOf('administrative_area_level_1') != -1) {
                address.state = googleResponse.address_components[i].short_name
            }

            if (types.indexOf('administrative_area_level_2') != -1) {
                address.city = googleResponse.address_components[i].long_name
            }
        }

        return address
    }

    /**
     * Verifica as informações referente a Bairro e Rua dentro do objeto de resposta da API do google
     * @param model Objeto de resposta do google
     * @param address Objeto que será alterado
     */
    private getNeighborhoodInfo(model: GoogleLocationModel, address: Address) {
        model.results.some(result => {
            for (var i = 0; i < Object.keys(result.address_components).length; i++) {
                debugger
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
    }

}