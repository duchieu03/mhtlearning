import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  QrCode,
  CheckCircle,
  Clock,
  CreditCard,
} from "lucide-react";
import { sampleDocuments } from "../data/sampleDocuments";
import { PaymentWebSocket } from "../services/websocket";
import Header from "../components/Header";
import { QRCodeCanvas } from "qrcode.react";

interface CreatePaymentResponse {
  code: number;
  message: string;
  data: {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    status: string;
    expiredAt: string | null;
    checkoutUrl: string;
    qrCode: string;
  };
}

export default function Checkout() {
  const navigate = useNavigate();
  const { documentId } = useParams<{ documentId: string }>();
  const [sheetLink, setSheetLink] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed">("pending");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Thêm state quản lý trạng thái sheet
  const [sheetStatus, setSheetStatus] = useState<"pending" | "processing" | "completed" | "error">("pending");

  const document = sampleDocuments.find((doc) => doc.id === documentId);

  useEffect(() => {
    if (!document) return;

    const createOrder = async () => {
      try {
        setLoading(true);

        const endpoint = import.meta.env.VITE_ENDPOINT + "/order/create";
        const requestBody = {
          orderCode: Date.now(),
          productName: document.title,
          description: `Thanh toán cho tài liệu`,
          returnUrl: `${endpoint}/success`,
          cancelUrl: `${window.location.origin}`,
          price: document.price,
        };

        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data: CreatePaymentResponse = await res.json();

        if (data.code === 0) {
          setQrCode(data.data.qrCode);
          setOrderCode(data.data.orderCode);
          setCheckoutUrl(data.data.checkoutUrl);

          const ws = new PaymentWebSocket(data.data.orderCode.toString());

          ws.onMessage((msg) => {
            let parsed: any;
            if (typeof msg === "string") {
              try {
                parsed = JSON.parse(msg);
              } catch {
                console.error("Không thể parse JSON WS:", msg);
                return;
              }
            } else parsed = msg;

            const now = new Date();
            console.log(`Bây giờ: ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
            console.log("Webhook WS:", parsed);

            if (parsed.link === "processing") {
              setSheetStatus("processing");
              setShowSuccessModal(prev => prev || true);
              return;
            }

            if (parsed.link === "error") {
              setSheetStatus("error");
              setShowSuccessModal(prev => prev || true);
              return;
            }

            if (parsed.link) {
              setSheetLink(parsed.link);
              setSheetStatus("completed");
              setPaymentStatus("completed");
              setShowSuccessModal(prev => prev || true);
            }
          });

          ws.connect();
          return () => ws.disconnect();
        } else {
          console.error("Tạo đơn hàng thất bại:", data.message);
        }
      } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    createOrder();
  }, [document]);

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(`/detail/${documentId}`)}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Quay lại chi tiết</span>
        </button>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Thanh toán</h1>
          <p className="text-lg text-slate-600">
            Hoàn tất thanh toán để truy cập tài liệu của bạn
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Thanh toán */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Thông tin thanh toán</h2>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <QrCode className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                {loading ? (
                  <p className="text-center text-slate-500">Đang tạo mã QR...</p>
                ) : qrCode ? (
                  <>
                    <h3 className="text-lg font-semibold text-slate-900 text-center mb-4">
                      Quét mã QR để thanh toán
                    </h3>
                    <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200 flex items-center justify-center">
                      <QRCodeCanvas value={qrCode} size={256} />
                    </div>
                    <p className="text-center text-sm text-slate-500 mt-4">
                      Sử dụng ứng dụng ngân hàng để quét mã và thanh toán
                    </p>
                  </>
                ) : (
                  <p className="text-center text-red-500">Không thể tạo mã QR</p>
                )}
              </div>

              <div className="flex items-center justify-center space-x-2 text-slate-600">
                {paymentStatus === "pending" ? (
                  <>
                    <Clock className="w-5 h-5 animate-pulse text-amber-500" />
                    <span className="font-medium">Đang chờ thanh toán...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-600">Đã nhận thanh toán!</span>
                  </>
                )}
              </div>

              {orderCode && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Mã đơn hàng:</strong> {orderCode}
                  </p>
                </div>
              )}

              {/* Trạng thái sheet */}
              {paymentStatus === "completed" && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4 text-center">
                  {sheetStatus === "processing" && (
                    <p className="text-green-700 font-medium">Đang chuẩn bị tài liệu...</p>
                  )}
                  {sheetStatus === "error" && (
                    <p className="text-red-600 font-medium">Có lỗi khi chuẩn bị tài liệu. Vui lòng liên hệ với chăm sóc khách hàng.</p>
                  )}
                  {sheetStatus === "completed" && sheetLink && (
                    <a
                      href={sheetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-800 hover:underline break-all"
                    >
                      Tải tài liệu của bạn tại đây
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Tóm tắt đơn hàng</h2>

              <div className="flex items-start space-x-4 mb-6 pb-6 border-b border-slate-200">
                <img
                  src={document.image_url}
                  alt={document.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">{document.title}</h3>
                  <p className="text-sm text-slate-500 mb-2">Tác giả: {document.author}</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                    {document.category}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính</span>
                  <span className="font-medium">${document.price}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Thuế</span>
                  <span className="font-medium">0.00VNĐ</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between text-lg">
                  <span className="font-bold text-slate-900">Tổng cộng</span>
                  <span className="font-bold text-slate-900">${document.price}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Sau khi thanh toán thành công, bạn sẽ được truy cập và tải về tài liệu cùng toàn bộ nội dung liên quan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal thanh toán */}
      {/* Modal thanh toán / tài liệu */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-in">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
              Thanh toán thành công!
            </h2>
            <p className="text-slate-600 text-center mb-8 leading-relaxed">
              Thanh toán của bạn đã được xử lý thành công. Bạn hiện có quyền truy cập vào <strong>{document.title}</strong>.
            </p>

            {/* Phần nội dung sheet */}
            <div className="text-center">
              {sheetStatus === "processing" && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-green-700 font-medium">Đang chuẩn bị tài liệu...</p>
                  <p className="text-sm text-slate-500">Vui lòng chờ trong giây lát</p>
                </div>
              )}

              {sheetStatus === "error" && (
                <p className="text-red-600 font-medium">
                  Có lỗi khi chuẩn bị tài liệu. Vui lòng liên hệ với chăm sóc khách hàng.
                </p>
              )}

              {sheetStatus === "completed" && sheetLink && (
                <div className="mt-4">
                  <p className="text-slate-700 mb-2 font-medium">Tệp Google Sheet của bạn:</p>
                  <a
                    href={sheetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {sheetLink}
                  </a>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
