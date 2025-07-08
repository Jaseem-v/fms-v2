export default function Header() {
  return (
    <header className="text-center mb-12">
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          🚀 Instant Analysis
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          🎯 Actionable Insights
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          ⏰ Real-Time Results
        </span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
        <span className="relative inline-block">
          <span className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CRO Analysis
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 transform rotate-1 rounded-lg"></div>
        </span>{' '}
        for Your Online Store
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Why aren&apos;t your visitors buying? Get{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          clear answers
        </span>{' '}
        and{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          simple fixes
        </span>{' '}
        to turn{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          browsers into buyers
        </span>
        .{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          No guesswork
        </span>{' '}
        - just{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">
          straightforward solutions
        </span>{' '}
        to boost your sales and grow your business.
      </p>
    </header>
  );
} 