'use client'
import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'

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

const WorkMap = ({ selectedJob, allJobs, statusFilter }) => {
    const mapRef = useRef(null)

    useEffect(() => {
        if (selectedJob && selectedJob.lat && selectedJob.lng && mapRef.current) {
            mapRef.current.flyTo([selectedJob.lat, selectedJob.lng], 15, {
                duration: 1.5
            })
        }
    }, [selectedJob])

    // Auto fit bounds when status filter changes
    useEffect(() => {
        if (!mapRef.current || !allJobs || allJobs.length === 0) return;

        // Get filtered jobs
        const filteredJobs = allJobs.filter(job => {
            if (!statusFilter) return true;
            return job.raw?.status === statusFilter;
        }).filter(job => job.lat && job.lng);

        if (filteredJobs.length === 0) return;

        // If only one job, center on it
        if (filteredJobs.length === 1) {
            mapRef.current.flyTo([filteredJobs[0].lat, filteredJobs[0].lng], 13, {
                duration: 1
            });
            return;
        }

        // Multiple jobs - fit bounds
        import('leaflet').then((L) => {
            const bounds = L.latLngBounds(
                filteredJobs.map(job => [job.lat, job.lng])
            );
            mapRef.current.fitBounds(bounds, {
                padding: [50, 50],
                duration: 1,
                maxZoom: 15
            });
        });
    }, [statusFilter, allJobs])

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

                {/* Render filtered jobs markers */}
                {allJobs && allJobs
                    .filter(job => {
                        // If no filter, show all
                        if (!statusFilter) return true
                        // Filter by status
                        return job.raw?.status === statusFilter
                    })
                    .map((job) => {
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
