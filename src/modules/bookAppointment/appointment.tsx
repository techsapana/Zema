import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { bookAppointmentApi } from "../../api/appointmentApi";
import { getPublicServicesApi, type Service } from "../../api/servicesApi";
import toast from "react-hot-toast";
import {
  CalendarDays,
  User,
  CheckCircle2,
  ArrowRight,
  ReceiptText,
  Loader2,
  Scissors,
  ChevronDown,
} from "lucide-react";


function toDateKey(iso: string) {
  return iso.slice(0, 10);
}


function formatDate(dateKey: string) {
  const d = new Date(dateKey + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}


function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}


export default function Appointment() {
  const [step, setStep] = useState(1);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [booked, setBooked] = useState(false);

  // Fetch all services
  const { data: servicesResponse, isLoading: loadingServices } = useQuery({
    queryKey: ["publicServices"],
    queryFn: getPublicServicesApi,
  });

  const filteredServices = useMemo(() => {
    if (!servicesResponse?.services) return [];
    if (!selectedGender) return servicesResponse.services;
    return servicesResponse.services.filter(
      (s) => s.category === selectedGender || s.category === "Unisex"
    );
  }, [servicesResponse, selectedGender]);

  // Fetch available slots for the selected service
  const {
    data: slotsResponse,
    isLoading: loadingSlots,
  } = useQuery({
    queryKey: ["availableSlots", selectedService?.id],
    queryFn: async () => {
      const API_URL = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API_URL}/public/available/appointments?serviceId=${selectedService?.id}&limit=100`);
      if (!res.ok) throw new Error("Failed to fetch slots");
      return res.json();
    },
    enabled: !!selectedService,
  });

  // Reset date/slot when service changes
  useEffect(() => {
    setSelectedDate(null);
    setSelectedSlot(null);
  }, [selectedService]);

  // Group slots by date
  const slotsByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    if (!slotsResponse?.slots) return map;
    for (const slot of slotsResponse.slots) {
      const key = toDateKey(slot);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(slot);
    }
    return map;
  }, [slotsResponse]);

  const availableDates = useMemo(() => Array.from(slotsByDate.keys()), [slotsByDate]);

  // Auto-select first date when data loads
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const timesForSelectedDate = selectedDate
    ? slotsByDate.get(selectedDate) ?? []
    : [];

  const bookMutation = useMutation({
    mutationFn: bookAppointmentApi,
    onSuccess: () => {
      setBooked(true);
    },
    onError: () => {
      toast.error("Failed to book appointment. Please try again.");
    },
  });

  const handleBook = () => {
    if (!selectedService) return toast.error("Please select a service.");
    if (!selectedSlot) return toast.error("Please select a time slot.");
    if (!form.name.trim()) return toast.error("Please enter your name.");
    if (!form.phone.trim()) return toast.error("Please enter your phone number.");

    bookMutation.mutate({
      name: form.name.trim(),
      phone: form.phone.trim(),
      appointment: selectedSlot,
      serviceId: selectedService.id,
    } as any);
  };

  const stepLabels = [
    { icon: User, label: "Gender" },
    { icon: Scissors, label: "Service" },
    { icon: CalendarDays, label: "Date & Time" },
    { icon: User, label: "Details" },
    { icon: CheckCircle2, label: "Confirm" },
  ];

  return (
    <>
      <main className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-200 bg-white rounded-xl shadow-sm border border-primary-pink/10 overflow-hidden">
          {/* Progress Header */}
          <div className="p-8 border-b border-primary-pink/10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Book Your Glow-up
                </h1>
                <p className="text-slate-500 mt-1">
                  Reserve your spot at Salon Bloom
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-primary-pink">
                  Step {step} of 5
                </span>
                <div className="w-32 h-2 bg-primary-pink/20 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-primary-pink transition-all duration-300"
                    style={{ width: `${(step / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            {/* Step Navigation */}
            <div className="flex gap-8 overflow-x-auto no-scrollbar pt-4">
              {stepLabels.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 border-b-2 pb-2 shrink-0 transition-all ${step === i + 1
                      ? "border-primary-pink"
                      : "border-transparent opacity-40"
                      }`}
                  >
                    <Icon
                      size={18}
                      className={step === i + 1 ? "text-primary-pink" : ""}
                    />
                    <span className="font-bold text-sm">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 space-y-6">
            {/* Step 1: Gender Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-4 text-center">
                    Who are we glowing up today?
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { id: "Male", label: "Male" },
                      { id: "Female", label: "Female" },
                      { id: "Unisex", label: "Unisex / Others" },
                    ].map((g) => (
                      <button
                        key={g.id}
                        onClick={() => {
                          setSelectedGender(g.id);
                          setSelectedService(null);
                          setStep(2);
                        }}
                        className={`cursor-pointer group flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${selectedGender === g.id
                          ? "border-primary-pink bg-primary-pink/5"
                          : "border-slate-100 hover:border-primary-pink/30 hover:bg-slate-50"
                          }`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${selectedGender === g.id ? "bg-primary-pink text-white" : "bg-slate-100 text-slate-400 group-hover:text-primary-pink"}`}>
                          <User size={24} />
                        </div>
                        <span className={`font-bold text-sm ${selectedGender === g.id ? "text-primary-pink" : "text-slate-600"}`}>
                          {g.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Service Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-3">
                    Choose a Service
                  </p>
                  {loadingServices ? (
                    <div className="h-12 rounded-xl bg-slate-100 animate-pulse" />
                  ) : (
                    <div className="relative">
                      <select
                        value={selectedService?.id || ""}
                        onChange={(e) => {
                          const s = filteredServices.find(svc => svc.id === e.target.value);
                          setSelectedService(s || null);
                        }}
                        className="w-full bg-background-light border-none rounded-xl px-4 py-3 text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-primary-pink outline-none"
                      >
                        <option value="" disabled>Select a service...</option>
                        {filteredServices.map((svc) => (
                          <option key={svc.id} value={svc.id}>
                            {svc.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  )}
                </div>

                {selectedService && (
                  <div className="bg-primary-pink/5 border border-primary-pink/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-pink/10 flex items-center justify-center">
                      <Scissors size={20} className="text-primary-pink" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary-pink uppercase tracking-wider">Selected Service</p>
                      <p className="text-sm font-bold text-slate-800">{selectedService.name}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 3 && (
              <div className="space-y-6">
                {!selectedService ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 text-sm italic">Please go back and select a service first.</p>
                  </div>
                ) : (
                  <>
                    {loadingSlots && (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary-pink" />
                        <span className="ml-2 text-slate-500 text-sm">
                          Loading available slots…
                        </span>
                      </div>
                    )}

                    {!loadingSlots && availableDates.length === 0 && (
                      <div className="rounded-xl bg-slate-50 p-10 text-center">
                        <CalendarDays
                          size={32}
                          className="text-slate-300 mx-auto mb-2"
                        />
                        <p className="text-slate-400 text-sm">
                          No available slots for this service.
                        </p>
                      </div>
                    )}

                    {!loadingSlots && availableDates.length > 0 && (
                      <>
                        {/* Date picker */}
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase mb-3">
                            Pick a Day
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            {availableDates.map((dateKey) => (
                              <button
                                key={dateKey}
                                onClick={() => {
                                  setSelectedDate(dateKey);
                                  setSelectedSlot(null);
                                }}
                                className={`cursor-pointer px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${selectedDate === dateKey
                                  ? "bg-primary-pink text-white border-primary-pink shadow-lg shadow-primary-pink/20"
                                  : "bg-background-light border-transparent text-slate-700 hover:border-primary-pink/50"
                                  }`}
                              >
                                {formatDate(dateKey)}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Time picker */}
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase mb-3">
                            Pick a Time
                          </p>
                          {timesForSelectedDate.length === 0 ? (
                            <p className="text-slate-400 text-sm">
                              No slots available for this day.
                            </p>
                          ) : (
                            <div className="flex gap-3 flex-wrap">
                              {timesForSelectedDate.map((slot) => (
                                <button
                                  key={slot}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`cursor-pointer px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${selectedSlot === slot
                                    ? "bg-primary-pink text-white border-primary-pink shadow-lg shadow-primary-pink/20"
                                    : "bg-background-light border-transparent text-slate-700 hover:border-primary-pink/50"
                                    }`}
                                >
                                  {formatTime(slot)}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Step 4: Customer Details */}
            {step === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-background-light border-none rounded-lg focus:ring-2 focus:ring-primary-pink px-4 py-2.5"
                    placeholder="Jane Doe"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">
                    Phone Number
                  </label>
                  <input
                    className="w-full bg-background-light border-none rounded-lg focus:ring-2 focus:ring-primary-pink px-4 py-2.5"
                    placeholder="+977 9800000000"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Confirm */}
            {step === 5 && (
              <div className="space-y-4">
                <p className="text-slate-500">
                  Please review your booking details before confirming.
                </p>
                <div className="bg-background-light rounded-xl p-6 space-y-3">
                  {[
                    ["Service", selectedService?.name || "—"],
                    [
                      "Date",
                      selectedDate ? formatDate(selectedDate) : "—",
                    ],
                    [
                      "Time",
                      selectedSlot ? formatTime(selectedSlot) : "—",
                    ],
                    ["Name", form.name || "—"],
                    ["Phone", form.phone || "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-bold text-slate-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-8 flex justify-between items-center border-t border-primary-pink/10">
              <button
                onClick={() => (step > 1 ? setStep(step - 1) : null)}
                className="cursor-pointer px-6 py-2 text-slate-500 font-bold hover:text-slate-700 transition-colors"
              >
                {step === 1 ? "Cancel" : "Back"}
              </button>
              {step < 5 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && !selectedGender) ||
                    (step === 2 && !selectedService) ||
                    (step === 3 && !selectedSlot)
                  }
                  className="cursor-pointer bg-primary-pink text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-pink/20 hover:scale-[1.02] transition-transform flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  Next Step
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleBook}
                  disabled={bookMutation.isPending}
                  className="cursor-pointer bg-primary-pink text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-pink/20 hover:scale-[1.02] transition-transform flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {bookMutation.isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                  {bookMutation.isPending ? "Booking…" : "Confirm Booking"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Booking Summary Card */}
        <div className="w-full max-w-200 mt-8">
          <div className="bg-white p-6 rounded-xl border border-primary-pink/10">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <ReceiptText size={20} className="text-primary-pink" />
              Booking Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Gender</span>
                <span className="font-bold">{selectedGender || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Service</span>
                <span className="font-bold">
                  {selectedService ? selectedService.name : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-bold">
                  {selectedDate ? formatDate(selectedDate) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time</span>
                <span className="font-bold">
                  {selectedSlot ? formatTime(selectedSlot) : "—"}
                </span>
              </div>
              {step >= 2 && form.name && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Name</span>
                  <span className="font-bold">{form.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {booked && (
          <div className="fixed inset-0 z-100 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl p-8 text-center shadow-2xl">
              <div className="w-20 h-20 bg-primary-pink/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-pink">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Booking Recieved!</h2>
              <p className="text-slate-500 mb-8">
                Your appointment has been booked successfully. We'll contact you
                at {form.phone || "your phone number"}. See you soon!
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setBooked(false);
                    setStep(1);
                    setSelectedDate(null);
                    setSelectedSlot(null);
                    setForm({ name: "", phone: "" });
                  }}
                  className="w-full py-3 bg-primary-pink text-white font-bold rounded-xl shadow-lg shadow-primary-pink/20 hover:bg-primary-pink/90 transition-all"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
