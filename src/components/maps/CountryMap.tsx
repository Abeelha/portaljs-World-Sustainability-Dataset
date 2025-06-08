'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Filter, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SustainabilityData } from '@/lib/data-processing';
import CountryPopup from './CountryPopup';
import { useTheme } from '@/lib/theme-provider';

interface CountryMapProps {
    data: SustainabilityData[];
    loading?: boolean;
}

const COUNTRY_COORDINATES: Record<string, [number, number]> = {
    'Afghanistan': [33.93911, 67.709953],
    'Albania': [41.153332, 20.168331],
    'Algeria': [28.033886, 1.659626],
    'Angola': [-11.202692, 17.873887],
    'Argentina': [-38.416097, -63.616672],
    'Armenia': [40.069099, 45.038189],
    'Australia': [-25.274398, 133.775136],
    'Austria': [47.516231, 14.550072],
    'Azerbaijan': [40.143105, 47.576927],
    'Bahrain': [25.930414, 50.637772],
    'Bangladesh': [23.684994, 90.356331],
    'Belarus': [53.709807, 27.953389],
    'Belgium': [50.503887, 4.469936],
    'Benin': [9.30769, 2.315834],
    'Bolivia': [-16.290154, -63.588653],
    'Bosnia and Herzegovina': [43.915886, 17.679076],
    'Botswana': [-22.328474, 24.684866],
    'Brazil': [-14.235004, -51.92528],
    'Bulgaria': [42.733883, 25.48583],
    'Burkina Faso': [12.238333, -1.561593],
    'Burundi': [-3.373056, 29.918886],
    'Cambodia': [12.565679, 104.990963],
    'Cameroon': [7.369722, 12.354722],
    'Canada': [56.130366, -106.346771],
    'Central African Republic': [6.611111, 20.939444],
    'Chad': [15.454166, 18.732207],
    'Chile': [-35.675147, -71.542969],
    'China': [35.86166, 104.195397],
    'Colombia': [4.570868, -74.297333],
    'Costa Rica': [9.748917, -83.753428],
    'Croatia': [45.1, 15.2],
    'Cyprus': [35.126413, 33.429859],
    'Czech Republic': [49.817492, 15.472962],
    'Denmark': [56.26392, 9.501785],
    'Dominican Republic': [18.735693, -70.162651],
    'Ecuador': [-1.831239, -78.183406],
    'Egypt': [26.820553, 30.802498],
    'El Salvador': [13.794185, -88.89653],
    'Estonia': [58.595272, 25.013607],
    'Ethiopia': [9.145, 40.489673],
    'Finland': [61.92411, 25.748151],
    'France': [46.227638, 2.213749],
    'Gabon': [-0.803689, 11.609444],
    'Georgia': [42.315407, 43.356892],
    'Germany': [51.165691, 10.451526],
    'Ghana': [7.946527, -1.023194],
    'Greece': [39.074208, 21.824312],
    'Guatemala': [15.783471, -90.230759],
    'Guinea': [9.945587, -9.696645],
    'Honduras': [15.199999, -86.241905],
    'Hungary': [47.162494, 19.503304],
    'Iceland': [64.963051, -19.020835],
    'India': [20.593684, 78.96288],
    'Indonesia': [-0.789275, 113.921327],
    'Iran': [32.427908, 53.688046],
    'Iraq': [33.223191, 43.679291],
    'Ireland': [53.41291, -8.24389],
    'Israel': [31.046051, 34.851612],
    'Italy': [41.87194, 12.56738],
    'Jamaica': [18.109581, -77.297508],
    'Japan': [36.204824, 138.252924],
    'Jordan': [30.585164, 36.238414],
    'Kazakhstan': [48.019573, 66.923684],
    'Kenya': [-0.023559, 37.906193],
    'Korea, Rep.': [35.907757, 127.766922],
    'Kuwait': [29.31166, 47.481766],
    'Kyrgyz Republic': [41.20438, 74.766098],
    'Latvia': [56.879635, 24.603189],
    'Lebanon': [33.854721, 35.862285],
    'Lithuania': [55.169438, 23.881275],
    'Luxembourg': [49.815273, 6.129583],
    'Madagascar': [-18.766947, 46.869107],
    'Malawi': [-13.254308, 34.301525],
    'Malaysia': [4.210484, 101.975766],
    'Mali': [17.570692, -3.996166],
    'Malta': [35.937496, 14.375416],
    'Mauritania': [21.00789, -10.940835],
    'Mauritius': [-20.348404, 57.552152],
    'Mexico': [23.634501, -102.552784],
    'Moldova': [47.411631, 28.369885],
    'Mongolia': [46.862496, 103.846656],
    'Morocco': [31.791702, -7.09262],
    'Mozambique': [-18.665695, 35.529562],
    'Myanmar': [21.913965, 95.956223],
    'Namibia': [-22.95764, 18.49041],
    'Nepal': [28.394857, 84.124008],
    'Netherlands': [52.132633, 5.291266],
    'New Zealand': [-40.900557, 174.885971],
    'Nicaragua': [12.865416, -85.207229],
    'Niger': [17.607789, 8.081666],
    'Nigeria': [9.081999, 8.675277],
    'Norway': [60.472024, 8.468946],
    'Oman': [21.512583, 55.923255],
    'Pakistan': [30.375321, 69.345116],
    'Panama': [8.537981, -80.782127],
    'Paraguay': [-23.442503, -58.443832],
    'Peru': [-9.189967, -75.015152],
    'Philippines': [12.879721, 121.774017],
    'Poland': [51.919438, 19.145136],
    'Portugal': [39.399872, -8.224454],
    'Qatar': [25.354826, 51.183884],
    'Romania': [45.943161, 24.96676],
    'Russian Federation': [61.52401, 105.318756],
    'Rwanda': [-1.940278, 29.873888],
    'Saudi Arabia': [23.885942, 45.079162],
    'Senegal': [14.497401, -14.452362],
    'Serbia': [44.016521, 21.005859],
    'Sierra Leone': [8.460555, -11.779889],
    'Singapore': [1.352083, 103.819836],
    'Slovak Republic': [48.669026, 19.699024],
    'Slovenia': [46.151241, 14.995463],
    'South Africa': [-30.559482, 22.937506],
    'Spain': [40.463667, -3.74922],
    'Sri Lanka': [7.873054, 80.771797],
    'Sudan': [12.862807, 30.217636],
    'Sweden': [60.128161, 18.643501],
    'Switzerland': [46.818188, 8.227512],
    'Syrian Arab Republic': [34.802075, 38.996815],
    'Tajikistan': [38.861034, 71.276093],
    'Tanzania': [-6.369028, 34.888822],
    'Thailand': [15.870032, 100.992541],
    'Togo': [8.619543, 0.824782],
    'Tunisia': [33.886917, 9.537499],
    'Turkey': [38.963745, 35.243322],
    'Turkmenistan': [38.969719, 59.556278],
    'Uganda': [1.373333, 32.290275],
    'Ukraine': [48.379433, 31.16558],
    'United Arab Emirates': [23.424076, 53.847818],
    'United Kingdom': [55.378051, -3.435973],
    'United States': [37.09024, -95.712891],
    'Uruguay': [-32.522779, -55.765835],
    'Uzbekistan': [41.377491, 64.585262],
    'Venezuela': [6.42375, -66.58973],
    'Vietnam': [14.058324, 108.277199],
    'Yemen': [15.552727, 48.516388],
    'Zambia': [-13.133897, 27.849332],
    'Zimbabwe': [-19.015438, 29.154857]
};

const MapEvents = ({
    onCountryClick,
    countries
}: {
    onCountryClick: (country: string, position: { x: number; y: number }) => void;
    countries: string[];
}) => {
    const map = useMap();

    useEffect(() => {
        const markers: L.CircleMarker[] = [];

        countries.forEach(country => {
            const coords = COUNTRY_COORDINATES[country];
            if (coords) {
                const marker = L.circleMarker([coords[0], coords[1]], {
                    radius: 6,
                    fillColor: '#22c55e',
                    color: '#15803d',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.7,
                    className: 'country-marker'
                }).addTo(map);

                marker.bindTooltip(country, {
                    permanent: false,
                    direction: 'top',
                    className: 'country-tooltip'
                });

                marker.on('click', (e) => {
                    const containerPoint = map.latLngToContainerPoint(e.latlng);
                    onCountryClick(country, {
                        x: containerPoint.x,
                        y: containerPoint.y
                    });
                });

                marker.on('mouseover', () => {
                    marker.setStyle({
                        radius: 8,
                        fillOpacity: 0.9,
                        weight: 3
                    });
                });

                marker.on('mouseout', () => {
                    marker.setStyle({
                        radius: 6,
                        fillOpacity: 0.7,
                        weight: 2
                    });
                });

                markers.push(marker);
            }
        });

        return () => {
            markers.forEach(marker => map.removeLayer(marker));
        };
    }, [map, countries, onCountryClick]);

    return null;
};

export default function CountryMap({ data, loading = false }: CountryMapProps) {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [filterMetric, setFilterMetric] = useState<string>('all');
    const [filterRegion, setFilterRegion] = useState<string>('all');
    const mapRef = useRef<L.Map | null>(null);

    const uniqueCountries = [...new Set(data.map(d => d.Country))].sort();
    const uniqueRegions = [...new Set(data.map(d => d.Region))].sort();

    const getMetricCategories = () => {
        return {
            environmental: [
                'Carbon emissions (metric tons per capita)',
                'Renewable energy consumption (% of total final energy consumption)',
                'Forest area (% of land area)'
            ],
            social: [
                'Life expectancy at birth, total (years)',
                'Population, total',
                'Income group'
            ],
            economic: [
                'GDP per capita (current US$)',
                'Income group'
            ]
        };
    };

    const hasMetricData = (country: string, metricCategory: string): boolean => {
        if (metricCategory === 'all') return true;

        const countryData = data.filter(d => d.Country === country);
        if (countryData.length === 0) return false;

        const categories = getMetricCategories();
        const relevantMetrics = categories[metricCategory as keyof typeof categories] || [];

        return relevantMetrics.some(metric =>
            countryData.some(row => {
                const value = row[metric as keyof SustainabilityData];
                return value !== null && value !== undefined && value !== '';
            })
        );
    };

    const filteredCountries = uniqueCountries.filter(country => {
        const regionMatch = filterRegion === 'all' || (() => {
            const countryData = data.find(d => d.Country === country);
            return countryData?.Region === filterRegion;
        })();

        return regionMatch;
    });

    const handleCountryClick = (country: string, position: { x: number; y: number }) => {
        setSelectedCountry(country);
        setPopupPosition(position);
    };

    const getCountryData = (country: string): SustainabilityData[] => {
        return data.filter(d => d.Country === country);
    };

    const getMetricDescription = (metric: string): string => {
        const descriptions = {
            all: 'All available sustainability metrics',
            environmental: 'Environmental indicators like CO2 emissions, renewable energy, and forest coverage',
            social: 'Social development metrics including life expectancy, population, and income classification',
            economic: 'Economic indicators such as GDP per capita and income group classifications'
        };
        return descriptions[metric as keyof typeof descriptions] || '';
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Loading world map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Map Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Region</label>
                            <Select value={filterRegion} onValueChange={setFilterRegion}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Regions" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Regions</SelectItem>
                                    {uniqueRegions.map(region => (
                                        <SelectItem key={region} value={region}>{region}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            Showing {filteredCountries.length} countries
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Click on any country marker to view detailed sustainability data
                        </div>
                    </div>
                </CardContent>
            </Card>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative h-96 md:h-[500px] bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg"
            >
                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    style={{ height: '100%', width: '100%' }}
                    className="z-10"
                    ref={mapRef}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        className="dark:opacity-80 dark:contrast-125 dark:brightness-75"
                    />
                    <MapEvents
                        onCountryClick={handleCountryClick}
                        countries={filteredCountries}
                    />
                </MapContainer>

                <div className="absolute top-4 left-4 z-20 bg-white dark:bg-gray-900 rounded-lg p-3 shadow-lg">
                    <div className="text-sm">
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-700 dark:text-gray-300">Countries with sustainability data</span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Click any country to view details
                        </div>
                    </div>
                </div>
            </motion.div>

            {selectedCountry && (
                <CountryPopup
                    country={selectedCountry}
                    data={getCountryData(selectedCountry)}
                    isOpen={!!selectedCountry}
                    onClose={() => setSelectedCountry(null)}
                    position={popupPosition}
                />
            )}

            <style jsx global>{`
                .leaflet-container {
                    height: 100%;
                    width: 100%;
                    border-radius: 0.5rem;
                }

                .leaflet-popup-content-wrapper {
                    border-radius: 8px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                }

                .leaflet-popup-content {
                    margin: 12px 16px;
                    max-width: 300px;
                }

                .custom-marker {
                    background-color: #22c55e;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .custom-marker:hover {
                    background-color: #16a34a;
                    transform: scale(1.1);
                    transition: all 0.2s ease-in-out;
                }
            `}</style>
        </div>
    );
}

// Add CSS for tooltips and markers
const mapStyles = `
  .country-tooltip {
    background: rgba(0, 0, 0, 0.8) !important;
    color: white !important;
    border: none !important;
    border-radius: 4px !important;
    font-size: 12px !important;
    padding: 4px 8px !important;
  }

  .country-marker {
    cursor: pointer !important;
    transition: all 0.2s ease !important;
  }

  .leaflet-control-attribution {
    font-size: 10px !important;
    background: rgba(255, 255, 255, 0.9) !important;
  }

  .dark .leaflet-control-attribution {
    background: rgba(0, 0, 0, 0.9) !important;
    color: white !important;
  }

  .dark .leaflet-control-zoom {
    background: rgba(0, 0, 0, 0.9) !important;
  }

  .dark .leaflet-control-zoom a {
    background: rgba(0, 0, 0, 0.9) !important;
    color: white !important;
    border-color: rgba(255, 255, 255, 0.2) !important;
  }
`;

if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = mapStyles;
    document.head.appendChild(styleElement);
}