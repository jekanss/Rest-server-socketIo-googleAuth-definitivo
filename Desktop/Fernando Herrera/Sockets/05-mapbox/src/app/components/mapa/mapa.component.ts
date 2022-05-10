import { Component, OnInit } from '@angular/core';
import { Lugar } from 'src/app/interfaces/interfaces';

import * as mapboxgl from 'mapbox-gl';
import { WebsocketService } from 'src/app/services/websocket.service';
import { HttpClient } from '@angular/common/http';

interface RespMarcadores {
  [key: string] : Lugar 
}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {

  mapa!: mapboxgl.Map;

  // lugares: Lugar[] = [];
  lugares: RespMarcadores = {};
  markersMapbox: { [ id:string ]: mapboxgl.Marker } = {};

  constructor(  
    private http: HttpClient ,
    private wsService: WebsocketService
  ) { }

  ngOnInit(): void {

    this.http.get<RespMarcadores>('http://localhost:5000/mapa')
          .subscribe ( lugares => {          
            this.lugares = lugares
            this.crearMapa();
          });

    this.escucharSockets();
  }

  escucharSockets(){

    // marcador nuevo
    this.wsService.listen('marcador-nuevo')
          .subscribe( ( marcador: any ) => this.agregarMarcador(marcador) );
          
       
    //marcador-mover
    this.wsService.listen('marcador-mover')
          .subscribe( ( marcador: any) => this.markersMapbox[marcador.id].setLngLat([marcador.lng, marcador.lat]));

    //marcador-borrar
    this.wsService.listen('marcador-borrar')
          .subscribe( ( id: any ) => {
            this.markersMapbox[id].remove();
            //borrrar la propiedad dle objeto
            delete this.markersMapbox[id];
          });
  }

  crearMapa(){  

    this.mapa = new mapboxgl.Map({    
      accessToken: 'pk.eyJ1IjoiamVrYW5zcyIsImEiOiJja3V5b2lpZzIwNGd3MzFxMTMxZ3lvaDc0In0.9Y3MtWrNeGumGTC8VDEG1A',
      container: 'mapa', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL 
      center: [ -75.75512993582937 , 45.349977429009954 ], // posición inicial [lng, lat]
      zoom: 15 // zoom inicial
    });

    //barrer el obejto
    for ( const [ key, marcador ] of Object.entries(this.lugares)  ){      
      this.agregarMarcador( marcador );
    }

  }

  agregarMarcador( marcador: Lugar ){

    const h2 = document.createElement('h2');
    h2.innerText = marcador.nombre;

    const btnBorrar = document.createElement('button');
    btnBorrar.innerText = 'Borrar';

    const div = document.createElement('div');
    div.append(h2, btnBorrar);

    // const html = `<h2>${ marcador.nombre }</h2>
    //               <br>
    //               <button>Borrar</button>`;

    const customPoup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false,
    }).setDOMContent(div);

    const marker = new mapboxgl.Marker({
      draggable: true,
      color: marcador.color
    })
    .setLngLat([ marcador.lng, marcador.lat ])
    .setPopup( customPoup )
    .addTo( this.mapa );

    marker.on('drag', () => {
      const lngLat = marker.getLngLat();
     
      //crear evento para emitir las coordenadas de este marcador      
      const marcadorActualizado = {
        id: marcador.id, 
        lng: lngLat.lng, 
        lat: lngLat.lat
      }

      this.wsService.emit('marcador-mover', marcadorActualizado );
      
    });

    //ELIMINAR MARCADOR --------------------------------
    btnBorrar.addEventListener('click', () => {

      marker.remove();
      // Eliminar el marcador mediante sockets
      this.wsService.emit('marcador-borrar', marcador.id );

    });

    //guardar el marcador en el mapa de instancia de mapbox
    this.markersMapbox[ marcador.id ] = marker;


  }

  //CREAR MARCADOR ---------------------------------------
  crearMarcador(){

    const customMarker: Lugar = {
      id: new Date().toISOString(),
      nombre: 'Sin nombre',
      lng: -75.75512993582937,
      lat: 45.349977429009954,
      color: '#' + Math.floor(Math.random()*16777215).toString(16) 
    }

    this.agregarMarcador(customMarker);

    //emitir marcador-nuevo
    this.wsService.emit('marcador-nuevo', customMarker ) ;
    

  }

}
