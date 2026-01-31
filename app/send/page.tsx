"use client";

import { useState } from "react";
import EmergencyTransferModal from "./components/EmergencyTransferModal";
import Link from "next/link";
import { ArrowLeft, Send, AlertCircle } from "lucide-react";
import SendHeader from "./components/SendHeader";
import RecipientAddressInput from "./components/RecipientAddressInput";
import AmountCurrencySection from "./components/AmountCurrencySection";
import AutomaticSplitCard from "./components/AutomaticSplitCard";
import EmergencyTransferCard from "./components/EmergencyTransferCard";

export default function SendMoney() {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [previewAmount, setPreviewAmount] = useState<number | null>(null);
  const [previewCurrency, setPreviewCurrency] = useState<string | null>(null);

  const handlePreview = () => {
    // Handle preview transaction
    console.log("Preview transaction clicked");
  };

  const handleSend = (amount: number, currency: string) => {
    setPreviewAmount(amount);
    setPreviewCurrency(currency);
    // Handle send remittance
    console.log(`Send ${amount} ${currency}`);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <SendHeader />

      <main className="mx-auto px-4 sm:px-6 max-w-7xl lg:px-30 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:flex-[2]">
            <RecipientAddressInput />
            <AmountCurrencySection />
            <EmergencyTransferCard
              onAction={() => setShowEmergencyModal(true)}
            />
          </div>
          <div className="lg:flex-[1]">
            <AutomaticSplitCard />
          </div>
        </div>
      </main>
    </div>
  );
}
