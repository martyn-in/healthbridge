"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { Calendar, Clock, CreditCard, CheckCircle2, User as UserIcon } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Ensure this matches your NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in .env.local
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function PatientAppointments() {
  const { userId } = useAuth();
  const user = useQuery(api.users.getUser, userId ? { clerkId: userId } : "skip");
  const appointments = useQuery(api.appointments.getPatientAppointments, user?._id ? { patientId: user._id } : "skip");
  
  // Simulated available doctors for the demo since we don't have a getDoctors query yet
  const availableDoctors = [
    { id: "dr1", name: "Dr. Sarah Jenkins", specialty: "Cardiology", fee: 150 },
    { id: "dr2", name: "Dr. Michael Chen", specialty: "Neurology", fee: 200 },
  ];

  const [selectedDoctor, setSelectedDoctor] = useState(availableDoctors[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientSecret, setClientSecret] = useState("");

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return;
    
    // Create Stripe Payment Intent via our API
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: selectedDoctor.fee, currency: "usd" }),
    });
    
    const data = await res.json();
    if (data.clientSecret) {
      setClientSecret(data.clientSecret);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Appointments</h1>
        <p className="text-gray-500 mt-2">Book a new appointment or manage existing ones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Form */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-gray-100 dark:border-zinc-800 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Book New Appointment</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Doctor</label>
              <div className="grid gap-3">
                {availableDoctors.map(doc => (
                  <div 
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-center justify-between ${selectedDoctor.id === doc.id ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20" : "border-gray-200 dark:border-zinc-800 hover:border-teal-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{doc.name}</h4>
                        <p className="text-sm text-gray-500">{doc.specialty}</p>
                      </div>
                    </div>
                    <span className="font-bold text-teal-600">${doc.fee}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-teal-500 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                <div className="relative">
                  <Clock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:outline-none focus:border-teal-500 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {!clientSecret ? (
              <button 
                onClick={handleBook}
                disabled={!selectedDate || !selectedTime}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-5 h-5" /> Proceed to Payment (${selectedDoctor.fee})
              </button>
            ) : (
              <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-gray-200 dark:border-zinc-700">
                <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Payment Required
                </h3>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm doctorId={selectedDoctor.id} datetime={new Date(`${selectedDate}T${selectedTime}`).getTime()} patientId={user?._id || ""} />
                </Elements>
              </div>
            )}
          </div>
        </div>

        {/* Existing Appointments */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Upcoming</h2>
          <div className="space-y-4">
            {appointments && appointments.length > 0 ? appointments.map((appt) => (
              <div key={appt._id} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Appointment</h4>
                  <p className="text-gray-500 flex items-center gap-2 mt-1 text-sm">
                    <Calendar className="w-4 h-4" /> {new Date(appt.datetime).toLocaleDateString()}
                    <span className="mx-1">•</span>
                    <Clock className="w-4 h-4" /> {new Date(appt.datetime).toLocaleTimeString()}
                  </p>
                </div>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {appt.status}
                </span>
              </div>
            )) : (
              <div className="text-center p-8 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800 text-gray-500">
                No appointments found. Book one to get started!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm({ doctorId, datetime, patientId }: { doctorId: string, datetime: number, patientId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const bookAppointment = useMutation(api.appointments.bookAppointment);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    // Simulate payment confirmation since we don't have real keys
    const result = { error: null }; // await stripe.confirmPayment(...)
    
    if (result.error) {
      console.error(result.error);
    } else {
      // Payment successful, book in Convex
      // Note: In reality, we'd use a Stripe webhook to book it to be fully secure
      // await bookAppointment({ doctorId, datetime, patientId });
      alert("Payment successful! Appointment booked (simulated).");
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button 
        disabled={!stripe || isProcessing} 
        className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 rounded-lg disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
