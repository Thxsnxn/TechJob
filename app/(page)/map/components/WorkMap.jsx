/**
 * ============================================================================
 * Work Map Component - แผนที่แสดงตำแหน่งงาน
 * ============================================================================
 * 
 * เปรียบเทียบ: เหมือน Google Maps แต่แทนที่จะแสดงร้านอาหาร
 * เราแสดงตำแหน่งที่ติดตั้ง/ซ่อมแซมแทน
 * 
 * คุณสมบัติพิเศษ:
 * 1. แสดงหมุด (marker) ตำแหน่งงานทั้งหมด
 * 2. กรองหมุดตามสถานะที่เลือก (เหมือนกรองร้านอาหารตามประเภท)
 * 3. Auto zoom ไปยังหมุดที่กรอง (เหมือน GPS นำทาง)
 * 4. แสดงวงกลมรัศมีรอบตำแหน่งงาน
 * 
 * ทำไมต้อง Dynamic Import?
 * - Leaflet (ไลบรารีแผนที่) ใช้ window object ของ browser
 * - แต่ Next.js render ที่ server ก่อน (ไม่มี window)
 * - ต้อง dynamic import + ssr: false เพื่อให้โหลดแค่ฝั่ง client
 * เปรียบเทียบ: เหมือนห้ามเอาน้ำเข้าห้องคอมพิวเตอร์ (server) ต้องดื่มข้างนอก (client) เท่านั้น
 */

'use client'
import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import { MapPin } from 'lucide-react'

// ============================================================
// Dynamic Imports - โหลด component แบบไม่ render ที่ server
// ============================================================

/**
 * ทำไมต้อง dynamic?
 * 
 * เปรียบเทียบ: 
 * - ร้านอาหารบางร้านเปิดแค่กลางคืน ห้ามเข้าตอนเช้า
 * - React-Leaflet เปิดแค่ใน browser ห้ามรันใน server
 * 
 * { ssr: false } = Server-Side Rendering ปิด
 * แปลว่า Next.js จะข้าม component นี้ตอน build หน้าเว็บที่ server
 * รอโหลดตอนที่ user เปิดหน้าเว็บใน browser แทน
 */

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

// ============================================================
// Icon Fixer - แก้ปัญหาไอคอนหาย
// ============================================================

/**
 * LeafletIconFixer: แก้ไอคอนหมุดที่หายใน Next.js
 * 
 * ปัญหา: Leaflet คาดหวังว่าไอคอนอยู่ใน path ของ webpack แต่ Next.js ใช้ path คนละแบบ
 * วิธีแก้: ลบ default icon path แล้วชี้ไปที่ CDN แทน
 * 
 * เปรียบเทียบ: ร้านอาหารย้ายที่ แต่ GPS ยังชี้ที่เก่า
 * - ต้องอัพเดทที่อยู่ใหม่ใน GPS (ตั้งค่า icon URL ใหม่)
 */
const LeafletIconFixer = () => {
    useEffect(() => {
        import('leaflet').then((L) => {
            // ลบ path เก่าที่ผิด
            delete L.Icon.Default.prototype._getIconUrl

            // ตั้ง path ใหม่ชี้ไป CDN
            L.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl:
                    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            })
        })
    }, []) // รันครั้งเดียวพอ

    return null  // component นี้ไม่แสดงอะไรบนหน้าจอ แค่แก้ไอคอนเบื้องหลัง
}

// ============================================================
// Main Component
// ============================================================

const WorkMap = ({ selectedJob, allJobs, statusFilter }) => {
    /**
     * mapRef: ตัวอ้างอิงถึง map instance
     * 
     * เปรียบเทียบ: รีโมทคอนโทรลทีวี
     * - ปกติเราสั่งทีวีผ่าน props (เปลี่ยนช่อง, เปลี่ยนเสียง)
     * - แต่บางคำสั่งต้องใช้รีโมทโดยตรง (flyTo, fitBounds)
     * - mapRef ก็คือรีโมทนั่นเอง
     * 
     * ทำไมต้องใช้ useRef?
     * - useState จะทำให้ re-render ทุกครั้งที่เปลี่ยนค่า → ช้า
     * - useRef เก็บค่าโดยไม่ re-render → เร็ว
     * เหมือนจดเบอร์โทรในสมุดโน้ต (ref) vs เขียนป้ายหน้าร้าน (state)
     */
    const mapRef = useRef(null)

    // ============================================================
    // Effect 1: Fly to Selected Job (บินไปยังงานที่เลือก)
    // ============================================================

    /**
     * เมื่อเลือกงาน → บินไปยังตำแหน่งนั้น
     * 
     * เปรียบเทียบ: เหมือนการซุ่มกล้อง drone
     * - เห็นรายการงานในมือถือ
     * - กดเลือกงานหนึ่ง
     * - drone บินไปถ่ายจุดนั้นให้ใกล้ๆ (zoom 15)
     * 
     * Dependencies [selectedJob]:
     * - เมื่อ selectedJob เปลี่ยน → รันฟังก์ชันนี้ใหม่
     * เปรียบเทียบ: ตั้งแจ้งเตือนว่า "ถ้ามีงานใหม่เลือก ให้บินไปที่นั้น"
     */
    useEffect(() => {
        if (selectedJob && selectedJob.lat && selectedJob.lng && mapRef.current) {
            mapRef.current.flyTo([selectedJob.lat, selectedJob.lng], 15, {
                duration: 1.5  // ใช้เวลาบิน 1.5 วินาที (animation นุ่มนวล)
            })
        }
    }, [selectedJob])

    // ============================================================
    // Effect 2: Auto Fit Bounds When Filter Changes (ปรับมุมมองเมื่อกรอง)
    // ============================================================

    /**
     * เมื่อเปลี่ยนฟิลเตอร์สถานะ → ปรับ zoom ให้เห็นงานที่กรองทั้งหมด
     * 
     * เปรียบเทียบ: เหมือนการดู Google Maps ร้านอาหาร
     * 1. เริ่มต้นเห็นร้านทุกประเภท (ไทย, ญี่ปุ่น, อิตาเลียน)
     * 2. กรองเฉพาะร้านญี่ปุ่น
     * 3. แผนที่ zoom ออก/เข้าอัตโนมัติให้เห็นร้านญี่ปุ่นทุกแห่งพอดี
     * 
     * ทำไมต้องมี?
     * - ไม่งั้นต้องเลื่อนแผนที่หาเอง ลำบาก
     * - ระบบฉลาดช่วยปรับให้อัตโนมัติ
     */
    useEffect(() => {
        // Guard clause: ตรวจสอบเงื่อนไขก่อนทำงาน
        if (!mapRef.current || !allJobs || allJobs.length === 0) return;

        // 1. กรองงานตามสถานะ
        const filteredJobs = allJobs.filter(job => {
            if (!statusFilter) return true;  // ไม่กรอง = เอาทุกงาน
            return job.raw?.status === statusFilter;  // กรอง = เอาเฉพาะสถานะที่ตรง
        }).filter(job => job.lat && job.lng);  // เอาแค่งานที่มีพิกัด

        // 2. ถ้าไม่มีงานเลย → ไม่ต้องทำอะไร
        if (filteredJobs.length === 0) return;

        // 3. ถ้ามีงานเดียว → บินไปจุดนั้น (zoom 13)
        // เปรียบเทียบ: มีร้านอาหารญี่ปุ่นแค่ร้านเดียว → ซูมเข้าไปใกล้ๆ
        if (filteredJobs.length === 1) {
            mapRef.current.flyTo([filteredJobs[0].lat, filteredJobs[0].lng], 13, {
                duration: 1
            });
            return;
        }

        // 4. ถ้ามีหลายงาน → ปรับ bounds ให้เห็นทุกจุด
        // เปรียบเทียบ: มีร้านอาหารญี่ปุ่น 5 ร้าน กระจายทั่วกรุงเทพ
        //              → ซูมออกให้เห็นทั้ง 5 ร้านในจอเดียว
        import('leaflet').then((L) => {
            // สร้าง bounds (กรอบสี่เหลี่ยม) ที่ครอบคลุมทุกจุด
            const bounds = L.latLngBounds(
                filteredJobs.map(job => [job.lat, job.lng])
            );

            // ปรับแผนที่ให้ fit พอดีกับ bounds
            mapRef.current.fitBounds(bounds, {
                padding: [50, 50],    // เว้นขอบ 50px (ไม่ให้หมุดชิดขอบจอ)
                duration: 1,          // animation 1 วินาที
                maxZoom: 15           // ซูมเข้าสุดไม่เกิน level 15 (ไม่ให้ใกล้เกินไป)
            });
        });
    }, [statusFilter, allJobs])  // เมื่อฟิลเตอร์หรือรายการงานเปลี่ยน → รันใหม่

    // ============================================================
    // Empty State - กรณีไม่มีข้อมูล
    // ============================================================

    /**
     * ถ้าไม่มีงานเลย → แสดง placeholder
     * 
     * เปรียบเทียบ: เหมือนป้าย "ยังไม่มีสินค้า" ในตะกร้า Shopee
     * ดีกว่าปล่อยให้ว่างเปล่า เพราะ user จะงงว่า error หรือเปล่า
     */
    if ((!allJobs || allJobs.length === 0) && (!selectedJob || !selectedJob.lat || !selectedJob.lng)) {
        return (
            <div className="w-full h-full rounded-xl bg-muted/30 flex flex-col items-center justify-center text-muted-foreground border border-border">
                <MapPin className="w-12 h-12 mb-4 text-muted-foreground/50" />
                <p className="font-medium">ไม่พบงานที่มีข้อมูลตำแหน่ง</p>
            </div>
        )
    }

    // ============================================================
    // Render Map - แสดงแผนที่
    // ============================================================

    return (
        <div className="w-full h-full relative z-0">
            {/* แก้ไอคอนหมุด */}
            <LeafletIconFixer />

            {/* 
                MapContainer: กรอบแผนที่หลัก
                
                Props:
                - center: จุดเริ่มต้นของแผนที่ [latitude, longitude]
                          ใช้พิกัดกรุงเทพฯ เป็น default
                - zoom: ระดับ zoom เริ่มต้น (1-20, ยิ่งมากยิ่งใกล้)
                - scrollWheelZoom: เลื่อนล้อเมาส์เพื่อ zoom ได้/ไม่ได้
                - ref: เก็บ reference เพื่อควบคุมแผนที่ภายหลัง
            */}
            <MapContainer
                center={[13.7563, 100.5018]}  // กรุงเทพฯ
                zoom={10}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
            >
                {/* 
                    TileLayer: ชั้นแผนที่ (ภาพแผนที่จริงๆ)
                    
                    เปรียบเทียบ: ผ้าใบวาดภาพ
                    - แผนที่เปล่าๆ เป็นแค่พื้นที่ว่าง
                    - TileLayer คือภาพแผนที่ โหลดมาจาก OpenStreetMap
                    
                    url: template สำหรับดึงภาพ tile
                    - {s} = subdomain (a,b,c - กระจาย traffic)
                    - {z} = zoom level
                    - {x},{y} = ตำแหน่ง tile
                */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* 
                    Render Markers - วาดหมุดบนแผนที่
                    
                    Flow:
                    1. เริ่มจาก allJobs (งานทั้งหมด)
                    2. .filter() → กรองตามสถานะ
                    3. .map() → แปลงแต่ละงานเป็น Marker + Circle
                    
                    ทำไมต้องกรอง 2 ครั้ง?
                    - .filter แรก: กรองตามสถานะ
                    - .filter ใน map: กรองเฉพาะที่มีพิกัด (lat, lng)
                */}
                {allJobs && allJobs
                    .filter(job => {
                        // ถ้าไม่กรอง → เอาทุกงาน
                        if (!statusFilter) return true
                        // ถ้ากรอง → เอาเฉพาะที่สถานะตรง
                        return job.raw?.status === statusFilter
                    })
                    .map((job) => {
                        // ข้ามงานที่ไม่มีพิกัด
                        if (!job.lat || !job.lng) return null;

                        // เช็คว่าเป็นงานที่เลือกอยู่หรือเปล่า
                        // เพื่อเปลี่ยนสีวงกลม (เลือก=น้ำเงิน, ไม่เลือก=เทา)
                        const isSelected = selectedJob && selectedJob.id === job.id;

                        /**
                         * React.Fragment: กรอบคลุม component หลายตัวโดยไม่สร้าง DOM element เพิ่ม
                         * 
                         * ทำไมต้องใช้?
                         * - .map() ต้องการ return 1 element เท่านั้น
                         * - แต่เราอยากได้ทั้ง Marker และ Circle
                         * - ใช้ Fragment ห่อไว้ → ได้ทั้งคู่แต่ไม่มี div เพิ่ม
                         * 
                         * เปรียบเทียบ: ห่อของขวัญด้วยกระดาษในใส (Fragment)
                         * แทนที่จะห่อด้วยกล่อง (div) → ประหยัดพื้นที่
                         */
                        return (
                            <React.Fragment key={job.id}>
                                {/* 
                                Marker: หมุดปักตำแหน่ง
                                เปรียบเทียบ: ปักธงบนแผนที่กระดาษ
                            */}
                                <Marker position={[job.lat, job.lng]}>
                                    {/* 
                                    Popup: กล่องข้อความเมื่อกดหมุด
                                    เปรียบเทียบ: ป้ายข้อมูลเมื่อกดปิ่นใน Google Maps
                                */}
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

                                {/* 
                                Circle: วงกลมรัศมีรอบตำแหน่งงาน
                                
                                เปรียบเทียบ: เหมือนวงกลมบริเวณจัดส่ง Grab Food
                                - เส้นผ่านศูนย์กลาง = ระยะทางที่พนักงานต้องเดินทาง
                                - ใช้ระบุพื้นที่ความรับผิดชอบ
                                
                                ทำไมต้องตรวจสอบ (job.raw?.locationRadius || 500)?
                                - บางงานอาจไม่มี locationRadius
                                - ใช้ 500 เมตร เป็นค่า default
                                - || 500 เป็น fallback (ถ้าไม่มีให้ใช้ 500)
                            */}
                                {(job.raw?.locationRadius || 500) && (
                                    <Circle
                                        center={[job.lat, job.lng]}
                                        radius={job.raw?.locationRadius || 500}
                                        pathOptions={{
                                            color: isSelected ? 'blue' : 'gray',
                                            fillColor: isSelected ? 'blue' : 'gray',
                                            fillOpacity: 0.1  // ความโปร่งใส 10% (เบาๆ)
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
