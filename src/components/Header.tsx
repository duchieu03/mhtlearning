import { BookOpen} from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

     return (
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 hover:cursor-pointer" onClick={() => navigate(`/`)}>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">MHT Learning</h1>
                <p className="text-sm text-slate-600">Learning By Your Way</p>
              </div>
            </div>
          </div>
        </div>
      </header>
     )
};
