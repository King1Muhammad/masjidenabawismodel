import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// MCB Islamic Bank Logo
const McbIslamicLogo = () => (
  <div className="bg-white p-2 rounded-md inline-flex items-center justify-center">
    <span className="text-2xl font-bold">
      <span className="text-blue-800">M</span>
      <span className="text-red-600">I</span>
      <span className="text-blue-800">B</span>
    </span>
  </div>
);

// EasyPaisa Logo
const EasyPaisaLogo = () => (
  <div className="bg-green-50 p-2 rounded-md inline-flex items-center justify-center">
    <span className="text-green-600 font-bold">EasyPaisa</span>
  </div>
);

// JazzCash Logo
const JazzCashLogo = () => (
  <div className="bg-red-50 p-2 rounded-md inline-flex items-center justify-center">
    <span className="text-red-600 font-bold">JazzCash</span>
  </div>
);

// Zindagi Logo
const ZindagiLogo = () => (
  <div className="bg-orange-50 p-2 rounded-md inline-flex items-center justify-center">
    <span className="text-orange-600 font-bold">Zindagi</span>
  </div>
);

// Crypto TRC20 Logo
const CryptoTrc20Logo = () => (
  <div className="bg-blue-50 p-2 rounded-md inline-flex items-center justify-center">
    <span className="text-blue-600 font-bold">USDT-TRC20</span>
  </div>
);

// Crypto BNB Logo
const CryptoBnbLogo = () => (
  <div className="bg-yellow-50 p-2 rounded-md inline-flex items-center justify-center">
    <span className="text-yellow-600 font-bold">BNB</span>
  </div>
);

export default function Checkout() {
  const [donationData, setDonationData] = useState({
    amount: 0,
    campaign: 'general',
    type: 'one-time',
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    anonymous: false,
    cryptoType: '',
    cryptoAddress: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState<string>('bank');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Handle payment method selection and update the context
  useEffect(() => {
    if (paymentMethod === 'crypto_trc20') {
      // Update donationData with crypto info for TRC20
      setDonationData(prev => ({
        ...prev,
        cryptoType: 'trc20',
        cryptoAddress: 'TAYc66GdUqufsWcAHXxS6qgXRW2w73179f'
      }));
    } else if (paymentMethod === 'crypto_bnb') {
      // Update donationData with crypto info for BNB
      setDonationData(prev => ({
        ...prev,
        cryptoType: 'bnb',
        cryptoAddress: '0xd4f5912e37aa51402849acd7d9d4e7e9d94eb458'
      }));
    } else {
      // Clear crypto fields if other payment methods are selected
      setDonationData(prev => ({
        ...prev,
        cryptoType: '',
        cryptoAddress: ''
      }));
    }
  }, [paymentMethod]);
  
  // Parse URL query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    setDonationData({
      amount: parseFloat(params.get('amount') || '0'),
      campaign: params.get('campaign') || 'general',
      type: params.get('type') || 'one-time',
      firstName: params.get('firstName') || '',
      lastName: params.get('lastName') || '',
      email: params.get('email') || '',
      message: params.get('message') || '',
      anonymous: params.get('anonymous') === 'true',
      cryptoType: '',
      cryptoAddress: ''
    });
  }, []);
  
  // State for payment proof upload
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [uploadedProofUrl, setUploadedProofUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [publicConsent, setPublicConsent] = useState(false);
  const [transactionIdOrReference, setTransactionIdOrReference] = useState('');

  // Handle file input change for payment proof
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  // Handle payment proof upload
  const handleProofUpload = async () => {
    if (!paymentProof) return;
    
    setIsUploading(true);
    
    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('file', paymentProof);
      formData.append('fileName', `payment_proof_${Date.now()}_${paymentProof.name}`);
      
      const response = await fetch('/api/upload-proof', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to upload payment proof');
      
      const data = await response.json();
      setUploadedProofUrl(data.url);
      
      toast({
        title: "Upload Successful",
        description: "Your payment proof has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload payment proof. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleCompletePayment = async () => {
    setIsSubmitting(true);
    
    try {
      // Check if transaction ID is entered or payment proof is uploaded
      if (['bank', 'easypaisa', 'jazzcash', 'nayapay'].includes(paymentMethod) && !transactionIdOrReference && !uploadedProofUrl) {
        toast({
          title: "Transaction Information Required",
          description: "Please enter the transaction ID or upload your payment receipt to complete your donation.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Save donation to database with additional details
      const donationFormData = {
        userId: null, // Not needed if anonymous donation
        amount: donationData.amount.toString(),
        donationType: donationData.type, // Ensure the donation type is passed correctly
        campaign: donationData.campaign,
        firstName: donationData.firstName,
        lastName: donationData.lastName,
        email: donationData.email,
        message: donationData.message || "",
        anonymous: donationData.anonymous,
        paymentMethod,
        transactionId: transactionIdOrReference,
        paymentProofUrl: uploadedProofUrl,
        cryptoType: donationData.cryptoType,
        cryptoAddress: donationData.cryptoAddress,
        publicDisplayConsent: publicConsent,
        receiptDetails: {
          donorName: `${donationData.firstName} ${donationData.lastName}`.trim(),
          amount: donationData.amount,
          campaign: donationData.campaign,
          donationType: donationData.type,
          date: new Date().toISOString(),
          paymentMethod: paymentMethod,
        }
      };
      
      console.log("Submitting donation data:", donationFormData);
      const donationResponse = await apiRequest('POST', '/api/donations', donationFormData);
      
      // Show success message
      toast({
        title: "JazakAllah Khair!",
        description: "Your donation has been recorded. A receipt has been sent to your email. May Allah reward you abundantly!",
      });
      
      // Redirect to success page
      navigate('/donate/success');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (donationData.amount <= 0) {
    return (
      <div className="py-16 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-heading text-[#0C6E4E] mb-4">Invalid Donation Amount</h1>
        <p className="mb-6">The donation amount appears to be invalid. Please go back and try again.</p>
        <Button 
          onClick={() => navigate('/donate')}
          variant="default"
          className="bg-[#0C6E4E] hover:bg-[#0A5C41]"
        >
          Return to Donation Page
        </Button>
      </div>
    );
  }
  
  return (
    <div className="py-16 bg-[#F7F3E9]">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-heading text-[#0C6E4E] text-center mb-4">Complete Your Donation</h1>
        <p className="text-xl text-center max-w-3xl mx-auto mb-16">
          Thank you for your generosity. Please select your preferred payment method to complete your donation.
        </p>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-heading text-[#0C6E4E] mb-6">Donation Summary</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600">Amount:</p>
                <p className="text-2xl font-bold text-[#0C6E4E]">PKR {donationData.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Donation Type:</p>
                <p className="font-medium">
                  {donationData.type === 'one-time' ? 'One-time Donation' : 
                   donationData.type === 'monthly' ? 'Monthly Donation' : 
                   donationData.type === 'zakat' ? 'Zakat' : 'Sadaqah'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Campaign:</p>
                <p className="font-medium">{donationData.campaign}</p>
              </div>
              <div>
                <p className="text-gray-600">Donation By:</p>
                <p className="font-medium">
                  {donationData.anonymous ? 'Anonymous' : 
                   `${donationData.firstName} ${donationData.lastName}`.trim() || 'Anonymous'}
                </p>
              </div>
            </div>
            {donationData.message && (
              <div className="mb-6">
                <p className="text-gray-600">Message:</p>
                <p className="italic">{donationData.message}</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-heading text-[#0C6E4E] mb-6">Select Payment Method</h2>
            
            <Tabs defaultValue="bank" onValueChange={setPaymentMethod} className="w-full">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
                <TabsTrigger value="bank" className="text-xs md:text-sm px-2 py-1.5 md:px-3">Bank Transfer</TabsTrigger>
                <TabsTrigger value="easypaisa" className="text-xs md:text-sm px-2 py-1.5 md:px-3">EasyPaisa</TabsTrigger>
                <TabsTrigger value="jazzcash" className="text-xs md:text-sm px-2 py-1.5 md:px-3">JazzCash</TabsTrigger>
                <TabsTrigger value="nayapay" className="text-xs md:text-sm px-2 py-1.5 md:px-3">Zindagi</TabsTrigger>
                <TabsTrigger value="crypto_trc20" className="text-xs md:text-sm px-2 py-1.5 md:px-3">TRC20</TabsTrigger>
                <TabsTrigger value="crypto_bnb" className="text-xs md:text-sm px-2 py-1.5 md:px-3">BNB</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bank">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <McbIslamicLogo />
                      <span className="ml-2">MCB Islamic Bank Transfer</span>
                    </CardTitle>
                    <CardDescription>Transfer from your bank account directly</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <div className="font-medium">Bank Name</div>
                          <div className="p-2 border rounded bg-gray-50">MCB Islamic</div>
                        </div>
                        <div className="grid gap-2">
                          <div className="font-medium">Account Number</div>
                          <div className="p-2 border rounded bg-gray-50">0541003765900001</div>
                        </div>
                        <div className="grid gap-2">
                          <div className="font-medium">IBAN</div>
                          <div className="p-2 border rounded bg-gray-50">PK53MCIB0541003765900001</div>
                        </div>
                        <div className="grid gap-2">
                          <div className="font-medium">Account Title</div>
                          <div className="p-2 border rounded bg-gray-50">Jamia Masjid Nabvi Qureshi Hashmi</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="bg-blue-800 p-4 rounded-lg max-w-full">
                          <div className="text-center text-white text-2xl font-bold mb-2">
                            FOR ONLINE TRANSFER
                          </div>
                          <div className="space-y-1 text-white">
                            <div><span className="font-medium">Bank:</span> MCB Islamic</div>
                            <div><span className="font-medium">A/c No:</span> 0541003765900001</div>
                            <div><span className="font-medium">IBAN:</span> PK53MCIB0541003765900001</div>
                            <div className="flex items-center">
                              <div className="bg-blue-500 text-white rounded-full p-1 mr-1">JS</div>
                              <span className="text-blue-500 font-medium">JS BANK:</span> PK31JSBL9999903468053268
                            </div>
                            <div className="flex items-center">
                              <div className="bg-green-500 text-white rounded-full p-1 mr-1">EP</div>
                              <span className="text-green-500 font-medium">EASYPAISA:</span> 03468053268
                            </div>
                            <div className="mt-2">
                              <span className="bg-green-500 text-white rounded-full px-2 py-1 mr-1 text-xs">W</span>
                              <span className="text-green-500">WHATSAPP:</span> +92 3339214600
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-gray-500">
                      After making the transfer, click "Complete Donation" below to register your contribution.
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="easypaisa">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <EasyPaisaLogo />
                      <span className="ml-2">EasyPaisa</span>
                    </CardTitle>
                    <CardDescription>Send money using EasyPaisa mobile wallet or USSD</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <div className="font-medium">EasyPaisa Account Number</div>
                      <div className="p-2 border rounded bg-gray-50">03468053268</div>
                    </div>
                    <div className="grid gap-2">
                      <div className="font-medium">Account Title</div>
                      <div className="p-2 border rounded bg-gray-50">Muhammad Qureshi</div>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">How to donate via EasyPaisa:</h3>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Open your EasyPaisa app or dial *786#</li>
                        <li>Select "Send Money" option</li>
                        <li>Enter the number: 03468053268</li>
                        <li>Enter amount: {donationData.amount}</li>
                        <li>Confirm the transaction</li>
                      </ol>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-gray-500">
                      After completing the payment, click "Complete Donation" below to register your contribution.
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="jazzcash">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <JazzCashLogo />
                      <span className="ml-2">JazzCash</span>
                    </CardTitle>
                    <CardDescription>Send money using JazzCash mobile wallet or USSD</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <div className="font-medium">JazzCash Account Number</div>
                      <div className="p-2 border rounded bg-gray-50">03468053268</div>
                    </div>
                    <div className="grid gap-2">
                      <div className="font-medium">Account Title</div>
                      <div className="p-2 border rounded bg-gray-50">Muhammad Qureshi</div>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">How to donate via JazzCash:</h3>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Open your JazzCash app or dial *786#</li>
                        <li>Select "Send Money" option</li>
                        <li>Enter the number: 03468053268</li>
                        <li>Enter amount: {donationData.amount}</li>
                        <li>Confirm the transaction</li>
                      </ol>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-gray-500">
                      After completing the payment, click "Complete Donation" below to register your contribution.
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="nayapay">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ZindagiLogo />
                      <span className="ml-2 font-bold text-blue-700">JS Bank</span>
                    </CardTitle>
                    <CardDescription>Send money using JS Bank Zindagi Account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <div className="font-medium">IBAN</div>
                      <div className="p-2 border rounded bg-gray-50">PK31JSBL9999903468053268</div>
                    </div>
                    <div className="grid gap-2">
                      <div className="font-medium">Account Title</div>
                      <div className="p-2 border rounded bg-gray-50">Muhammad Qureshi</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mt-2">
                      <p className="text-blue-700 text-sm font-medium">This account supports USD transactions as well. You can send your donation in USD from any international bank.</p>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">How to donate via JS Bank:</h3>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Open your banking app</li>
                        <li>Select "Funds Transfer" option</li>
                        <li>Enter the IBAN: PK31JSBL9999903468053268</li>
                        <li>Enter amount: {donationData.amount}</li>
                        <li>Confirm the transaction</li>
                      </ol>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-gray-500">
                      After completing the payment, click "Complete Donation" below to register your contribution.
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="crypto_trc20">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CryptoTrc20Logo />
                      <span className="ml-2">USDT TRC20</span>
                    </CardTitle>
                    <CardDescription>Donate using USDT on the Tron Network (TRC20)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <div className="font-medium">TRC20 Wallet Address</div>
                          <div className="p-2 border rounded bg-gray-50 break-all">TAYc66GdUqufsWcAHXxS6qgXRW2w73179f</div>
                        </div>
                        <div className="mt-4">
                          <h3 className="font-medium mb-2">How to donate via TRC20:</h3>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Open your crypto wallet app</li>
                            <li>Select USDT (TRC20) token</li>
                            <li>Send to the address above or scan the QR code</li>
                            <li>Enter amount equivalent to {donationData.amount} PKR</li>
                            <li>Complete the transaction</li>
                          </ol>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg border">
                          <img 
                            src="/images/trc20_wallet_qr.jpg" 
                            alt="TRC20 Wallet QR Code" 
                            className="max-w-full h-auto"
                          />
                          <div className="text-center mt-2 text-sm font-medium">Scan to pay with USDT (TRC20)</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-gray-500">
                      After sending crypto, click "Complete Donation" below to register your contribution.
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="crypto_bnb">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CryptoBnbLogo />
                      <span className="ml-2">BNB Smart Chain</span>
                    </CardTitle>
                    <CardDescription>Donate using BNB or any BEP20 token</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <div className="font-medium">BNB Wallet Address</div>
                          <div className="p-2 border rounded bg-gray-50 break-all">0xd4f5912e37aa51402849acd7d9d4e7e9d94eb458</div>
                        </div>
                        <div className="mt-4">
                          <h3 className="font-medium mb-2">How to donate via BNB Chain:</h3>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            <li>Open your crypto wallet app</li>
                            <li>Select BNB Smart Chain network</li>
                            <li>Send BNB or any BEP20 token to the address above or scan the QR code</li>
                            <li>Enter amount equivalent to {donationData.amount} PKR</li>
                            <li>Complete the transaction</li>
                          </ol>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg border">
                          <img 
                            src="/images/bnb_wallet_qr.jpg" 
                            alt="BNB Wallet QR Code" 
                            className="max-w-full h-auto"
                          />
                          <div className="text-center mt-2 text-sm font-medium">Scan to pay with BNB or BEP20 tokens</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-sm text-gray-500">
                      After sending crypto, click "Complete Donation" below to register your contribution.
                    </p>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-8 bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-lg font-medium mb-4 text-gray-800">Complete Your Donation</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="transactionId" className="block text-sm font-medium mb-1 text-gray-700">
                    Transaction ID or Reference Number
                  </label>
                  <input
                    type="text"
                    id="transactionId"
                    value={transactionIdOrReference}
                    onChange={(e) => setTransactionIdOrReference(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-[#0C6E4E] focus:outline-none"
                    placeholder="Enter transaction ID from your payment receipt"
                  />
                </div>
                
                <div>
                  <label htmlFor="paymentProof" className="block text-sm font-medium mb-1 text-gray-700">
                    Upload Payment Receipt (Optional)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      id="paymentProof"
                      onChange={handleFileChange}
                      className="w-full p-2 border rounded"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleProofUpload}
                      disabled={!paymentProof || isUploading}
                      className="ml-2 whitespace-nowrap"
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                  {uploadedProofUrl && (
                    <p className="text-green-600 text-sm mt-1">✓ Receipt uploaded successfully</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/donate')}
                >
                  Back to Donation Form
                </Button>
                
                <Button 
                  onClick={handleCompletePayment}
                  disabled={isSubmitting}
                  className="bg-[#D4AF37] hover:bg-opacity-90 text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Complete Donation'
                  )}
                </Button>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-md border border-yellow-200">
              <h3 className="font-medium text-yellow-800 mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Important Note
              </h3>
              <p className="text-sm text-yellow-700">
                After making the payment through your chosen method, please click the "Complete Donation" button to register your contribution. 
                For assistance, contact us at <span className="whitespace-nowrap">+92 339214600</span> via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}