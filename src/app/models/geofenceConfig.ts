export class GeofenceConfig {
    id: string;

    /**Centro do raio da Geofence */
    latitude: number;

    /**Centro do raio da Geofence */
    longitude: number;

    /**Raio que o geofence irá suportar a circulação antes de notificar
     *  
     * Medida em metros */
    radius: number;

    /**Comportamento de transição */
    transitionType: number;

    /**Configuração de notificação */
    notification: {
        id: number;
        title: string;
        text: string;
        openAppOnClick: boolean;
    }

    constructor(id: string, latitude: number, longitude: number, radius: number,
        transitionType: number, notification: {
            id: number, title: string, text: string, openAppOnClick: boolean
        }
    ) 
    {
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
        this.transitionType = transitionType;
        this.notification = notification;
    }
}