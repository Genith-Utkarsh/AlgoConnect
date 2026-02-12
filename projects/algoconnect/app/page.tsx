export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">AlgoConnect</h1>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-2xl font-medium hover:bg-primary-600 transition-colors">
            Connect
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-32 max-w-md mx-auto px-6">
        {/* Scan QR Button */}
        <div className="flex justify-center mb-8">
          <button className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
            <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </button>
        </div>

        {/* Send Money Section */}
        <div className="mb-12">
          <h2 className="text-sm font-medium text-gray-500 mb-3">Send Money</h2>
          <div className="bg-gray-50 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-gray-400">₳</span>
              <input
                type="text"
                placeholder="0.00"
                className="flex-1 text-display bg-transparent outline-none text-gray-900"
              />
            </div>
            <div className="flex gap-2">
              <a
                href="/send"
                className="flex-1 py-3 bg-primary-500 text-white rounded-2xl font-semibold hover:bg-primary-600 transition-colors text-center"
              >
                Send to Friend
              </a>
              <a
                href="/send"
                className="flex-1 py-3 bg-white border-2 border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 transition-colors text-center"
              >
                Generate Link
              </a>
            </div>
          </div>
        </div>

        {/* Recent Contacts */}
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-4">Recent Contacts</h2>
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No contacts yet</p>
            <p className="text-xs mt-1">Send your first payment to get started</p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto px-6 py-4 flex justify-around">
          <button className="flex flex-col items-center gap-1 text-primary-500">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <span className="text-xs font-medium">Contacts</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z"/>
            </svg>
            <span className="text-xs font-medium">Activity</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
