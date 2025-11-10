"use client"
import React, { useState, useRef, useEffect } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// fix icon paths for Leaflet (Next.js)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

export default function SmartMapProFinal({ onChange }) {
  const [markers, setMarkers] = useState([])
  const [search, setSearch] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [radius, setRadius] = useState(300)
  const mapRef = useRef(null) // จะเก็บ instance ของ Leaflet map
  const [isMapReady, setIsMapReady] = useState(false)


  // โหลดจาก localStorage ตอน mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("jobMarkers") || "[]")
      setMarkers(Array.isArray(saved) ? saved : [])
    } catch (e) {
      console.error("Failed to parse jobMarkers", e)
    }
  }, [])

  // sync กลับ localStorage แล้วเรียก callback ภายนอก (ถ้ามี)
  useEffect(() => {
    try {
      localStorage.setItem("jobMarkers", JSON.stringify(markers))
    } catch (e) {
      console.error("Failed to save jobMarkers", e)
    }
    onChange?.(markers)
  }, [markers])

  // search suggestions (Nominatim) — debounce 400ms
  useEffect(() => {
    const t = setTimeout(async () => {
      if (search.trim().length < 2) return setSuggestions([])
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(
            search
          )}`
        )
        const data = await res.json()
        setSuggestions(data)
      } catch (e) {
        console.error("Search error", e)
        setSuggestions([])
      }
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  // คลิกแผนที่เพื่อเพิ่มหมุด
  const handleMapClick = (e) => {
    const newMarker = {
      id: Date.now(),
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      name: `Point ${markers.length + 1}`,
    }
    setMarkers((prev) => [...prev, newMarker])
    toast.success("📍 Added new point.")
  }

  // ปักตำแหน่งปัจจุบัน (GPS)
  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("❌ GPS not supported")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const newMarker = {
          id: Date.now(),
          lat: latitude,
          lng: longitude,
          name: "My Location",
        }
        setMarkers((prev) => [...prev, newMarker])

        // ป้องกัน mapRef.current เป็น null หรือ flyTo ไม่ใช่ฟังก์ชัน
        if (mapRef.current && typeof mapRef.current.flyTo === "function") {
          mapRef.current.flyTo([latitude, longitude], 15)
        } else {
          console.warn("mapRef not ready for flyTo", mapRef.current)
        }
        toast.success("📍 Added your current location.")
      },
      () => toast.error("⚠️ Could not get location.")
    )
  }

  // เลือก suggestion -> ปักหมุด และ focus
  const handleSelectSuggestion = (place) => {
    const lat = parseFloat(place.lat)
    const lng = parseFloat(place.lon)
    const newMarker = {
      id: Date.now(),
      lat,
      lng,
      name: place.display_name,
    }
    setMarkers((prev) => [...prev, newMarker])
    setSearch(place.display_name)
    setSuggestions([])

    if (mapRef.current && typeof mapRef.current.flyTo === "function") {
      mapRef.current.flyTo([lat, lng], 15)
    } else {
      console.warn("mapRef not ready for flyTo", mapRef.current)
    }
  }

  // ลบหมุด by id
  const handleDeleteMarker = (id) => {
    setMarkers((prev) => prev.filter((m) => m.id !== id))
    toast.error("🗑️ Marker removed.")
  }

  // ลบทั้งหมด (confirm)
  const handleClearAll = () => {
    if (!confirm("ต้องการลบหมุดทั้งหมดใช่หรือไม่?")) return
    setMarkers([])
    try {
      localStorage.removeItem("jobMarkers")
    } catch (e) { /* ignore */ }
    toast.error("🧹 Cleared all markers.")
  }

  // Save (แค่เขียนลง localStorage) — ป้องกันปุ่มเป็น submit
  const handleSave = (e) => {
    // ถ้าถูกเรียกจาก form event ให้ preventDefault
    if (e?.preventDefault) e.preventDefault()
    try {
      localStorage.setItem("jobMarkers", JSON.stringify(markers))
      toast.success("✅ Saved markers successfully!")
    } catch (err) {
      console.error("Failed to save markers", err)
      toast.error("❌ Save failed")
    }
  }

  // คำนวณระยะรวม (m)
  const calcDistance = () => {
    if (markers.length < 2) return 0
    let distance = 0
    for (let i = 1; i < markers.length; i++) {
      const from = L.latLng(markers[i - 1].lat, markers[i - 1].lng)
      const to = L.latLng(markers[i].lat, markers[i].lng)
      distance += from.distanceTo(to)
    }
    return distance
  }

  const lastMarker = markers[markers.length - 1]
  const totalDistance = calcDistance()

  // Focus last marker (มี guard)
  const handleFocusLast = () => {
    if (!isMapReady) {
      toast.error("Map not ready yet!")
      return
    }
    if (!lastMarker) {
      toast("No marker to focus")
      return
    }
    mapRef.current.flyTo([lastMarker.lat, lastMarker.lng], 15, { duration: 1 })
    toast.info("🎯 Focused on last marker.")
  }

  // ปรับรัศมี
  const handleRadiusChange = (e) => {
    setRadius(Number(e.target.value))
  }

  return (
    <div className="relative">
      {/* Floating toolbar — อย่าใส่ปุ่มแบบ default submit (ต้อง type="button") */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-[92%] md:w-[75%] bg-white p-3 rounded-xl shadow-lg space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            placeholder="Search location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          {/* ทุกปุ่มต้องมี type="button" เพื่อป้องกัน submit form */}
          <Button type="button" onClick={handleMyLocation}>📡 My Location</Button>
          <Button type="button" variant="secondary" onClick={handleSave}>💾 Save</Button>
          <Button type="button" variant="outline" onClick={handleFocusLast}>🎯 Focus</Button>
          <Button type="button" variant="destructive" onClick={handleClearAll}>🗑️ Clear All</Button>
        </div>

        {suggestions.length > 0 && (
          <div className="bg-white border rounded-md shadow-md w-full mt-1 max-h-48 overflow-auto">
            {suggestions.map(s => (
              <div
                key={s.place_id}
                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                onClick={() => handleSelectSuggestion(s)}
              >
                {s.display_name}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-3">
          <div>
            Total Distance:{" "}
            <span className="font-semibold text-blue-700">
              {totalDistance > 1000 ? (totalDistance / 1000).toFixed(2) + " km" : totalDistance.toFixed(1) + " m"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-700">Radius:</label>
            <input type="range" min="50" max="1000" value={radius} onChange={handleRadiusChange} className="w-32 cursor-pointer" />
            <span className="font-semibold">{radius} m</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={[13.7563, 100.5018]}
        zoom={12}
        style={{ height: "700px", width: "100%", borderRadius: "12px", zIndex: 0 }}
        whenCreated={(mapInstance) => {
          // เก็บ instance ไว้ใน ref — ตรวจดูใน console ถ้าจำเป็น
          mapRef.current = mapInstance
          setIsMapReady(true) // ✅ บอกว่าแผนที่พร้อมแล้ว
        }}
        onClick={handleMapClick}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map(m => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const newLatLng = e.target.getLatLng()
                setMarkers(prev => prev.map(x => x.id === m.id ? { ...x, lat: newLatLng.lat, lng: newLatLng.lng } : x))
                toast.info("📍 Marker moved.")
              }
            }}
          >
            <Popup>
              <div className="space-y-1">
                <div className="font-medium text-sm">{m.name}</div>
                <div className="text-xs text-muted-foreground">{m.lat.toFixed(4)}, {m.lng.toFixed(4)}</div>
                <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteMarker(m.id)} className="w-full mt-2">Delete</Button>
              </div>
            </Popup>
          </Marker>
        ))}

        {markers.length > 1 && <Polyline positions={markers.map(m => [m.lat, m.lng])} color="blue" weight={3} />}
        {markers.map((m) => (
          <Circle
            key={`circle-${m.id}`}
            center={[m.lat, m.lng]}
            radius={radius}
            color="purple"
            fillOpacity={0.15}
          />
        ))}
      </MapContainer>
    </div>
  )
}
