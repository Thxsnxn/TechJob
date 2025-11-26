'use client'
import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'

// Fix Leaflet icon issue in Next.js
// We need to do this inside the component or a useEffect, but since we are dynamically importing MapContainer,
// we can also handle L import inside. However, standard practice is often to import L and fix it.
// Let's try to import L dynamically or check if window is defined to avoid SSR issues with L itself if imported directly.
// But 'leaflet' package usually can be imported, just map rendering needs client.

// Dynamically import React-Leaflet components
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
)
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
)
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
)
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
)

// We need a component to handle map flyTo when selectedJob changes
const MapUpdater = ({ center }) => {
    const map = useRef(null)

    // We can't use useMap hook easily with dynamic import unless we import useMap from react-leaflet dynamically too?
    // Actually, useMap is a hook, so it should be fine if react-leaflet is present.
    // But since we are using dynamic imports for components, let's try a different approach:
    // Pass a ref to MapContainer? No, MapContainer ref gives the map instance.

    // Better approach: Create a small component that uses useMap, but we need to import useMap.
    // Let's import useMap normally? No, react-leaflet uses context which might not be available if parent is dynamic?
    // Actually, if we import 'react-leaflet' at top level, it might break build if it accesses window.
    // So we should dynamic import the whole Map component or use a wrapper.

    // Let's try a simpler approach first: Key the MapContainer to force re-render? No, that resets zoom.
    // Let's use the 'whenCreated' or 'ref' prop on MapContainer if available (v3/v4).
    // In v4, it's 'ref'.

    return null
}

// Component to fix icons
const LeafletIconFixer = () => {
    useEffect(() => {
        import('leaflet').then((L) => {
            delete L.Icon.Default.prototype._getIconUrl
            L.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            })
        })
    }, [])
    return null
}

// Inner component to handle map logic (flyTo)
// We need to import useMap from react-leaflet. 
// Since we can't easily mix dynamic and static imports for the same library if it breaks SSR,
// we will define this component but only use it inside the dynamic MapContainer context.
// Wait, if we import { useMap } from 'react-leaflet', does it break SSR?
// Usually 'react-leaflet' exports hooks that are safe, but the context usage requires being inside MapContainer.
// Let's try to dynamic import the whole inner component if needed.
// Or just use a ref on MapContainer.

const WorkMap = ({ selectedJob }) => {
    const mapRef = useRef(null)

    useEffect(() => {
        if (selectedJob && selectedJob.lat && selectedJob.lng && mapRef.current) {
            mapRef.current.flyTo([selectedJob.lat, selectedJob.lng], 15, {
                duration: 1.5
            })
        }
    }, [selectedJob])

    // Placeholder if no job or no coordinates
    if (!selectedJob || !selectedJob.lat || !selectedJob.lng) {
        return (
            <div className="w-full h-[500px] rounded-xl bg-neutral-100 flex flex-col items-center justify-center text-neutral-500 border border-neutral-200">
                <MapPin className="w-12 h-12 mb-4 text-neutral-300" />
                <p className="font-medium">Select a job to view its location on the map</p>
                <p className="text-sm mt-2 text-neutral-400">
                    {selectedJob ? "(This job has no location data)" : ""}
                </p>
            </div>
        )
    }

    return (
        <div className="w-full h-full rounded-xl overflow-hidden shadow-md border border-slate-200 relative z-0">
            <LeafletIconFixer />
            <MapContainer
                center={[selectedJob.lat, selectedJob.lng]}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[selectedJob.lat, selectedJob.lng]}>
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-bold text-sm">{selectedJob.title}</h3>
                            <p className="text-xs text-slate-600 mt-1">{selectedJob.jobCode}</p>
                            <p className="text-xs text-slate-500 mt-1">
                                {selectedJob.locationName || selectedJob.address || "No address"}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

export default WorkMap
