import { map, tileLayer, Icon, icon, marker, popup, layerGroup, control, latLng } from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
 
/**
 * Class untuk mengelola peta interaktif menggunakan Leaflet
 * @class Map
 */
export default class Map {
  #zoom = 5;
  #map = null;
  #baseLayers = {};
  #overlayLayers = {};
  #markers = new Set();
  #defaultCenter = [-6.2, 106.816666]; // Jakarta coordinates
 
  /**
   * Mengecek ketersediaan Geolocation API
   * @returns {boolean} Status ketersediaan Geolocation API
   */
  static isGeolocationAvailable() {
    return 'geolocation' in navigator;
  }
 
  /**
   * Mendapatkan posisi geografis saat ini
   * @param {Object} options - Opsi untuk Geolocation API
   * @returns {Promise<GeolocationPosition>} Promise yang berisi posisi geografis
   */
  static getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!Map.isGeolocationAvailable()) {
        reject(new Error('Geolocation API unsupported'));
        return;
      }
 
      const timeoutId = setTimeout(() => {
        reject(new Error('Geolocation request timed out'));
      }, 10000); // 10 detik timeout
 
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          resolve(position);
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
          ...options
        }
      );
    });
  }

  /**
   * Membuat instance Map baru
   * @param {string} selector - Selector CSS untuk elemen peta
   * @param {Object} options - Opsi konfigurasi peta
   * @returns {Promise<Map>} Promise yang berisi instance Map
   */
  static async build(selector, options = {}) {
    if ('center' in options && options.center) {
      return new Map(selector, options);
    }
 
    if ('locate' in options && options.locate) {
      try {
        const position = await Map.getCurrentPosition();
        const coordinate = [position.coords.latitude, position.coords.longitude];
 
        return new Map(selector, {
          ...options,
          center: coordinate,
        });
      } catch (error) {
        console.error('build: error:', error);
 
        return new Map(selector, {
          ...options,
          center: this.#defaultCenter,
        });
      }
    }
 
    return new Map(selector, {
      ...options,
      center: this.#defaultCenter,
    });
  }
 
  /**
   * Konstruktor untuk class Map
   * @param {string} selector - Selector CSS untuk elemen peta
   * @param {Object} options - Opsi konfigurasi peta
   */
  constructor(selector, options = {}) {
    this.#zoom = options.zoom ?? this.#zoom;
 
    // Define base layers with error handling
    this.#baseLayers = {
      'OpenStreetMap': tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        maxZoom: 19,
        errorTileUrl: 'https://tile.openstreetmap.org/0/0/0.png'
      }),
      'Satellite': tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="https://www.esri.com/" target="_blank">Esri</a>',
        maxZoom: 19,
        errorTileUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0'
      }),
      'Terrain': tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.stamen.com" target="_blank">Stamen Design</a>',
        maxZoom: 18,
        errorTileUrl: 'https://stamen-tiles.a.ssl.fastly.net/terrain/0/0/0.png'
      })
    };
 
    try {
      this.#map = map(document.querySelector(selector), {
        zoom: this.#zoom,
        scrollWheelZoom: true, // Enable scroll wheel zoom
        layers: [this.#baseLayers['OpenStreetMap']], // Default layer
        ...options,
      });

      // Add layer control
      control.layers(this.#baseLayers, this.#overlayLayers, {
        position: 'topright',
        collapsed: false
      }).addTo(this.#map);

      // Add scale control
      control.scale({
        imperial: false,
        position: 'bottomleft'
      }).addTo(this.#map);

    } catch (error) {
      console.error('Error initializing map:', error);
      throw new Error('Failed to initialize map');
    }
  }

  /**
   * Membuat ikon kustom untuk marker
   * @param {Object} options - Opsi untuk ikon
   * @returns {L.Icon} Instance L.Icon
   */
  createIcon(options = {}) {
    return icon({
      ...Icon.Default.prototype.options,
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
      ...options,
    });
  }

  /**
   * Menambahkan marker ke peta
   * @param {Array<number>} coordinates - Koordinat [lat, lng]
   * @param {Object} markerOptions - Opsi untuk marker
   * @param {Object} popupOptions - Opsi untuk popup
   * @returns {L.Marker} Instance marker yang ditambahkan
   */
  addMarker(coordinates, markerOptions = {}, popupOptions = null) {
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      throw new Error('coordinates must be an array of [lat, lng]');
    }
    
    if (typeof markerOptions !== 'object') {
      throw new Error('markerOptions must be an object');
    }
  
    const newMarker = marker(coordinates, {
      icon: this.createIcon(),
      ...markerOptions,
    });
  
    if (popupOptions) {
      if (typeof popupOptions !== 'object') {
        throw new Error('popupOptions must be an object');
      }
      if (!('content' in popupOptions)) {
        throw new Error('popupOptions must include `content` property.');
      }
  
      newMarker.bindPopup(popupOptions.content);
    }
  
    newMarker.addTo(this.#map);
    this.#markers.add(newMarker);
  
    return newMarker;
  }

  /**
   * Menghapus marker dari peta
   * @param {L.Marker} marker - Marker yang akan dihapus
   */
  removeMarker(marker) {
    if (this.#markers.has(marker)) {
      marker.remove();
      this.#markers.delete(marker);
    }
  }

  /**
   * Menghapus semua marker dari peta
   */
  clearMarkers() {
    this.#markers.forEach(marker => marker.remove());
    this.#markers.clear();
  }

  /**
   * Mengatur opacity layer
   * @param {string} layerName - Nama layer
   * @param {number} opacity - Nilai opacity (0-1)
   */
  setLayerOpacity(layerName, opacity) {
    if (this.#baseLayers[layerName]) {
      this.#baseLayers[layerName].setOpacity(opacity);
    }
  }

  /**
   * Mendapatkan instance peta
   * @returns {L.Map} Instance peta Leaflet
   */
  getMap() {
    return this.#map;
  }
}