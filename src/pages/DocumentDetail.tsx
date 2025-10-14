import { ArrowLeft, ShoppingCart, BookOpen, User, Tag } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { sampleDocuments } from "../data/sampleDocuments";
import Header from "../components/Header";

export default function DocumentDetail() {
  const navigate = useNavigate();
  const { documentId } = useParams<{ documentId: string }>();
  const document = sampleDocuments.find((doc) => doc.id === documentId);

  if (!document) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Không tìm thấy tài liệu
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Quay lại danh sách tài liệu</span>
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-96 md:h-auto bg-slate-200">
              <img
                src={document.image_url}
                alt={document.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-semibold text-blue-600">
                  {document.category}
                </span>
              </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-slate-600 mb-4">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Tác giả: {document.author}</span>
                </div>

                <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  {document.title}
                </h1>

                <div className="prose prose-slate mb-8">
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {document.description}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3 text-slate-600">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span>Tài liệu học tập đầy đủ, chi tiết</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Tag className="w-5 h-5 text-blue-600" />
                    <span>Truy cập kỹ thuật số ngay sau khi thanh toán</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8 mt-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Giá</p>
                    <p className="text-4xl font-bold text-slate-900">
                      ${document.price}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/checkout/${document.id}`)}
                  className="w-full flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>Tiến hành thanh toán</span>
                </button>

                <p className="text-center text-sm text-slate-500 mt-4">
                  Thanh toán an toàn • Truy cập tức thì
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-md p-8 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Bạn sẽ học được gì
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold text-sm">✓</span>
              </div>
              <p className="text-slate-700">
                Kiến thức chuyên sâu và các thực tiễn tốt nhất trong ngành
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold text-sm">✓</span>
              </div>
              <p className="text-slate-700">
                Ví dụ thực tế và các ứng dụng trong đời sống
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold text-sm">✓</span>
              </div>
              <p className="text-slate-700">
                Hướng dẫn chi tiết từng bước triển khai
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold text-sm">✓</span>
              </div>
              <p className="text-slate-700">
                Tài nguyên học tập mở rộng để nâng cao kiến thức
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
