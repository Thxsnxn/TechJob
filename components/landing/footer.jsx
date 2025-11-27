export function Footer() {
  return (
    <footer className="py-16 md:py-20 px-6 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto text-center space-y-6">
        {/* ชื่อบริษัท/โปรเจค */}
        <h3 className="text-2xl md:text-3xl font-light text-black tracking-tight">
          Precision Electrical Solutions
        </h3>

        {/* ที่อยู่ (แปลไทย + เพิ่ม กทม. และรหัสไปรษณีย์ให้ดูครบถ้วน) */}
        <div className="space-y-2 text-base md:text-lg font-light text-neutral-600">
          <p>มหาวิทยาลัยศรีปทุม</p>
          <p>แขวงเสนานิคม เขตจตุจักร กรุงเทพมหานคร 10900</p>
        </div>

        {/* ช่องทางติดต่อ */}
        <div className="space-y-2 text-base md:text-lg font-light text-neutral-600">
          <p>
            {/* แก้ href เป็น mailto: เพื่อให้กดส่งเมลได้จริง */}
            <a href="mailto:techjob@example.com" className="hover:text-black transition-colors">
              อีเมล : techjob@example.com
            </a>
          </p>
          <p>
            <a href="tel:+6612345678" className="hover:text-black transition-colors">
              โทร : 02-xxx-xxxx
            </a>
          </p>
        </div>

        {/* Copyright */}
        <div className="pt-8 text-sm font-light text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Precision Electrical Solutions. สงวนลิขสิทธิ์</p>
        </div>
      </div>
    </footer>
  )
}