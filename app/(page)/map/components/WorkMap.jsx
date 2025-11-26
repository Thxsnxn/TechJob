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
const Circle = dynamic(
    () => import('react-leaflet').then((mod) => mod.Circle),
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

const WorkMap = ({ selectedJob, allJobs }) => {
    const mapRef = useRef(null)

    useEffect(() => {
        if (selectedJob && selectedJob.lat && selectedJob.lng && mapRef.current) {
            mapRef.current.flyTo([selectedJob.lat, selectedJob.lng], 15, {
                duration: 1.5
            })
        }
    }, [selectedJob])

    // If no jobs at all, show placeholder
    if ((!allJobs || allJobs.length === 0) && (!selectedJob || !selectedJob.lat || !selectedJob.lng)) {
        return (
            <div className="w-full h-full rounded-xl bg-muted/30 flex flex-col items-center justify-center text-muted-foreground border border-border">
                <MapPin className="w-12 h-12 mb-4 text-muted-foreground/50" />
                <p className="font-medium">ไม่พบงานที่มีข้อมูลตำแหน่ง</p>
            </div>
        )
    }

    return (
        <div className="w-full h-full relative z-0">
            <LeafletIconFixer />
            <MapContainer
                center={[13.7563, 100.5018]} // Default to Bangkok
                zoom={10}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Render all jobs markers */}
                {allJobs && allJobs.map((job) => {
                    if (!job.lat || !job.lng) return null;
                    const isSelected = selectedJob && selectedJob.id === job.id;

                    return (
                        <React.Fragment key={job.id}>
                            <Marker position={[job.lat, job.lng]}>
                                <Popup>
                                    <div className="p-1">
                                        <h3 className="font-bold text-sm">{job.title}</h3>
                                        <p className="text-xs text-slate-600 mt-1">{job.jobCode}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {job.locationName || job.address || "ไม่มีที่อยู่"}
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>

                            {/* Render Radius Circle if available */}
                            {/* Assuming job.raw.locationRadius exists, otherwise default or skip */}
                            {/* If user wants to show radius for ALL jobs, we do it here. */}
                            {/* If only for selected, we check isSelected. User said "show radius of the work". */}
                            {/* Let's assume we show it for all or maybe just selected? User said "show all pins... and show radius". */}
                            {/* I'll show radius for all if data exists. */}

                            {(job.raw?.locationRadius || 500) && (
                                <Circle
                                    center={[job.lat, job.lng]}
                                    radius={job.raw?.locationRadius || 500}
                                    pathOptions={{
                                        color: isSelected ? 'blue' : 'gray',
                                        fillColor: isSelected ? 'blue' : 'gray',
                                        fillOpacity: 0.1
                                    }}
                                />
                            )}
                        </React.Fragment>
                    )
                })}
            </MapContainer>
        </div>
    )
}

export default WorkMap
