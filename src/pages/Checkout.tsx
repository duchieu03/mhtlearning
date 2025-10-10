import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  QrCode,
  CheckCircle,
  Clock,
  CreditCard,
} from "lucide-react";
import { sampleDocuments, bankAcc } from "../data/sampleDocuments";
import { PaymentWebSocket } from "../services/websocket";
import Header from "../components/Header";

export default function Checkout() {
  const navigate = useNavigate();
  const { documentId } = useParams<{ documentId: string }>();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId] = useState(() => `${Date.now()}`);
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "completed">(
    "pending"
  );

  const document = sampleDocuments.find((doc) => doc.id === documentId);

  useEffect(() => {
    if (!document) return;

    const ws = new PaymentWebSocket(orderId);

    ws.onMessage((data) => {
      console.log("Payment completed with link:", data);
      setPaymentStatus("completed");
      setShowSuccessModal(true);
    });

    ws.connect();

    return () => {
      ws.disconnect();
    };
  }, [orderId, document]);

  if (!document) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Document not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const qrCodePlaceholder = `https://qr.sepay.vn/img?bank=${bankAcc.bankName}&acc=${bankAcc.accountNumber}&template=compact&amount=${document.price}&des=${orderId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(`/detail/${documentId}`)}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Details</span>
        </button>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Checkout</h1>
          <p className="text-lg text-slate-600">
            Complete your purchase to access the document
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Payment Information
              </h2>
            </div>

            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <QrCode className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 text-center mb-4">
                  Scan QR Code to Pay
                </h3>
                <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200 flex items-center justify-center">
                  <img
                    src={qrCodePlaceholder}
                    alt="Payment QR Code"
                    className="w-64 h-64 object-contain"
                  />
                </div>
                <p className="text-center text-sm text-slate-500 mt-4">
                  Scan this QR code with your payment app
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 text-slate-600">
                {paymentStatus === "pending" ? (
                  <>
                    <Clock className="w-5 h-5 animate-pulse text-amber-500" />
                    <span className="font-medium">Waiting for payment...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-600">
                      Payment received!
                    </span>
                  </>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800">
                  <strong>Order ID:</strong> {orderId}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Keep this ID for your records
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Order Summary
              </h2>

              <div className="flex items-start space-x-4 mb-6 pb-6 border-b border-slate-200">
                <img
                  src={document.image_url}
                  alt={document.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {document.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-2">
                    by {document.author}
                  </p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                    {document.category}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${document.price}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between text-lg">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-slate-900">
                    ${document.price}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  After successful payment, you'll receive instant access to
                  download your document and all associated materials.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4">What happens next?</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Scan the QR code with your payment app
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Complete the payment transaction
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    Receive instant confirmation and access
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-in">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">
              Payment Successful!
            </h2>
            <p className="text-slate-600 text-center mb-8 leading-relaxed">
              Your payment has been processed successfully. You now have access
              to <strong>{document.title}</strong>.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate(`/`);
              }}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
