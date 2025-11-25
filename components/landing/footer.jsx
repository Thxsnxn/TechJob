export function Footer() {
  return (
    <footer className="py-16 md-20 px-6 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto text-center space-y-6">
        <h3 className="text-2xl md-3xl font-light text-black tracking-tight">Precision Electrical Solutions</h3>

        <div className="space-y-2 text-base md-lg font-light text-neutral-600">
          <p>Sripatum University</p>
          <p>Sena Nikhom Sub-district, Chatuchak District</p>
        </div>

        <div className="space-y-2 text-base md-lg font-light text-neutral-600">
          <p>
            <a href="techjob@example.com" className="hover-black transition-colors">
              contact : techjob@example.com
            </a>
          </p>
          <p>
            <a href="tel:+6612345678" className="hover-black transition-colors">
              +66 1234 5678
            </a>
          </p>
        </div>

        <div className="pt-8 text-sm font-light text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Precision Electrical Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
