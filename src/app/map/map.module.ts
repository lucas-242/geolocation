import { NgModule } from '@angular/core';
import { MapComponent } from './map.component';
export * from './map.component';

@NgModule({
    imports: [
        
    ],
    declarations: [
        MapComponent
    ],
    exports: [
        MapComponent
    ]
})
export class MapModule {}