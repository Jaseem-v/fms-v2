import AIChunkAnalysis from '../../components/AIChunkAnalysis';

export default function AIAnalysisPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">AI Chunk Analysis</h1>
          <p className="text-gray-600 mt-2">
            Leverage your AI chunks database for CRO problem identification and solution suggestions
          </p>
        </div>
      </div>
      
      <AIChunkAnalysis />
    </div>
  );
} 