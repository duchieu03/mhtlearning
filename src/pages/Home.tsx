import { useNavigate } from "react-router-dom";
import { sampleDocuments } from '../data/sampleDocuments';
import Header from "../components/Header";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">
            Expand Your Knowledge
          </h2>
          <p className="text-lg text-slate-600">
            Browse our curated collection of professional learning documents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/detail/${doc.id}`)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-slate-100"
            >
              <div className="relative h-48 overflow-hidden bg-slate-200">
                <img
                  src={doc.image_url}
                  alt={doc.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-lg">
                  <span className="text-sm font-semibold text-blue-600">{doc.category}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate-500 mb-3">by {doc.author}</p>
                <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                  {doc.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-2xl font-bold text-slate-900">
                    ${doc.price}
                  </span>
                  <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-slate-600">
            © 2025 DocuLearn. Premium educational resources for lifelong learners.
          </p>
        </div>
      </footer>
    </div>
  );
}
