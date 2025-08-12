import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex flex-col items-center justify-center p-8">
      {/* Header */}
      <header className="absolute top-8 left-8">
        <div className="flex items-center gap-3">
          <Image
            src="/prisma-logo.svg"
            alt="Prisma Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-neutral-900">Prisma</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-6xl font-bold text-neutral-900 mb-4">
            Interactive B2B
            <span className="block text-prisma-red">Presentations</span>
          </h2>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Transform your business presentations into engaging, interactive experiences 
            with AI-powered chat, voice narration, and real-time analytics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-12">
          <button className="bg-prisma-red hover:bg-prisma-red-hover text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            View Presentation
          </button>
          <button className="border-2 border-neutral-300 hover:border-prisma-red text-neutral-700 hover:text-prisma-red px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            Admin Panel
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-prisma-red-light rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-prisma-red text-xl">🎯</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Interactive Chat</h3>
            <p className="text-neutral-600">AI-powered contextual conversations during presentations</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-prisma-red-light rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-prisma-red text-xl">🎤</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Voice Narration</h3>
            <p className="text-neutral-600">Automatic or manual presentation modes with voice control</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-prisma-red-light rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-prisma-red text-xl">📊</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Real-time Analytics</h3>
            <p className="text-neutral-600">Track engagement, interactions, and presentation performance</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-8 text-center">
        <div className="flex items-center gap-1 justify-center whitespace-nowrap">
          <span className="text-xs font-semibold text-neutral-900">TodoSeTransforma by</span>
          <Image
            src="/digitis-logo.svg"
            alt="Digitis Logo"
            width={60}
            height={15}
            className="w-auto max-w-[42px] mt-0.5 -ml-0.5"
          />
        </div>
      </footer>
    </div>
  );
}
