import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, MessageCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ContactInfo {
  whatsapp_number: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  till_number: string | null;
  paybill_number: string | null;
  account_number: string | null;
}

const Contact = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data } = await supabase
        .from("contact_info")
        .select("*")
        .limit(1)
        .single();
      if (data) setContactInfo(data);
    };
    fetchContactInfo();
  }, []);

  const handleWhatsAppClick = () => {
    const cleanNumber = contactInfo?.whatsapp_number.replace(/[^0-9]/g, '') || '';
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  return (
    <section id="contact" className="py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,200,200,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,200,200,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Get In Touch
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready to upgrade your technology? Reach out to us via WhatsApp for 
            quick responses and personalized support.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Info Card */}
          <Card className="bg-gradient-primary text-primary-foreground border-0">
            <CardContent className="p-8">
              <h3 className="font-display text-2xl font-bold mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                {contactInfo?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground/70 mb-1">Phone</p>
                      <p className="font-medium">{contactInfo.phone}</p>
                    </div>
                  </div>
                )}

                {contactInfo?.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground/70 mb-1">Email</p>
                      <p className="font-medium">{contactInfo.email}</p>
                    </div>
                  </div>
                )}

                {contactInfo?.address && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-primary-foreground/70 mb-1">Location</p>
                      <p className="font-medium">{contactInfo.address}</p>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-primary-foreground/10">
                  <Button
                    onClick={handleWhatsAppClick}
                    className="w-full gap-2 bg-green-500 hover:bg-green-600 text-white"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chat on WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info Card */}
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  Payment Methods
                </h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                We accept M-Pesa payments for all orders. Use the details below:
              </p>

              <div className="space-y-4">
                {contactInfo?.till_number && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Till Number (Buy Goods)</p>
                    <p className="text-xl font-bold text-foreground">{contactInfo.till_number}</p>
                  </div>
                )}

                {contactInfo?.paybill_number && (
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Paybill Number</p>
                    <p className="text-xl font-bold text-foreground">{contactInfo.paybill_number}</p>
                    {contactInfo.account_number && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Account: <span className="text-foreground">{contactInfo.account_number}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground mt-6">
                💡 After payment, send confirmation via WhatsApp for faster processing.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
