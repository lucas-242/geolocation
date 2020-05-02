export class GoogleLocationModel {

    results: Array<{
        address_components: Array<{
            long_name: string,
            short_name: string,
            types: Array<string>
        }>,
        geometry: {
            location: {
                lat: number;
                lng: number;
            },
        },
    }>;
    formatted_address: string;
    status: string;
}