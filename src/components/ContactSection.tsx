
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subject, setSubject] = useState("Budgeting Help");
  const [sending, setSending] = useState(false);
  const topics = ["Budgeting Help", "Investment Education", "Debt Management", "Premium Coaching", "Other"];
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSending(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const { error } = await supabase.from("contact_submissions").insert({
      user_id: user?.id ?? null, first_name: String(form.get("firstName")||"").trim(),
      last_name: String(form.get("lastName")||"").trim(), email: String(form.get("email")||"").trim(),
      phone: String(form.get("phone")||"").trim() || null, subject, message: String(form.get("message")||"").trim()
    });
    setSending(false);
    if(error) return toast({title:"Message not sent",description:error.message,variant:"destructive"});
    formElement.reset(); setSubject("Budgeting Help");
    toast({title:"Message received",description:"Finance Wise can now review your request."});
  };
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">
            Get in Touch with Finance Wise
          </h2>
          <p className="text-lg text-emerald-700 max-w-3xl mx-auto">
            Have questions about MyFinance or need personalized financial guidance? Our team of experts is here to help you on your wealth-building journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="text-emerald-900">Send us a Message</CardTitle>
              <CardDescription>
                Get personalized financial advice or ask about our coaching programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={submit}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-emerald-800 mb-2">
                      First Name
                    </label>
                    <Input 
                      id="firstName" 
                      name="firstName"
                      placeholder="Enter your first name"
                      className="border-emerald-200 focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-emerald-800 mb-2">
                      Last Name
                    </label>
                    <Input 
                      id="lastName" 
                      name="lastName"
                      placeholder="Enter your last name"
                      className="border-emerald-200 focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-emerald-800 mb-2">
                    Email Address
                  </label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="your.email@example.com"
                    className="border-emerald-200 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-emerald-800 mb-2">
                    Phone Number
                  </label>
                  <Input 
                    id="phone" 
                    name="phone"
                    type="tel" 
                    placeholder="+234 (xxx) xxx-xxxx"
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-emerald-800 mb-2">
                    How can we help you?
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {topics.map(topic => <button key={topic} type="button" onClick={() => setSubject(topic)}><Badge variant="outline" className={`cursor-pointer border-emerald-200 ${subject===topic?"bg-emerald-700 text-white":"hover:bg-emerald-50"}`}>{topic}</Badge></button>)}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-emerald-800 mb-2">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    name="message"
                    placeholder="Tell us about your financial goals or questions..."
                    className="border-emerald-200 focus:border-emerald-500 min-h-[120px]"
                    required
                    minLength={10}
                    maxLength={3000}
                  />
                </div>

                <Button type="submit" disabled={sending} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  {sending ? "Sending…" : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-emerald-900">Contact Information</CardTitle>
                <CardDescription>
                  Multiple ways to connect with our financial experts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-800">Email</p>
                    <p className="text-emerald-600">hello@financewise.ng</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-800">Phone</p>
                    <p className="text-emerald-600">+234 (0) 800-FINANCE</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-800">Office</p>
                    <p className="text-emerald-600">Lagos, Nigeria</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-gold-600" />
                  </div>
                  <div>
                    <p className="font-medium text-emerald-800">WhatsApp</p>
                    <p className="text-emerald-600">+234 (0) 900-WEALTH</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="text-emerald-900">YouTube Channel</CardTitle>
                <CardDescription>
                  Subscribe for weekly financial education content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold text-red-800 mb-2">Finance Wise</h4>
                  <p className="text-red-600 mb-4">50,000+ subscribers learning to build wealth</p>
                  <Button className="bg-red-600 hover:bg-red-700 text-white w-full" asChild><a href="https://youtube.com/@financewise" target="_blank" rel="noopener noreferrer">Subscribe to Youtube.com/@financewise</a></Button>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <CardContent className="p-6">
                <div className="text-center">
                  <h4 className="font-semibold text-emerald-800 mb-2">Office Hours</h4>
                  <div className="space-y-1 text-emerald-600">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM (WAT)</p>
                    <p>Saturday: 10:00 AM - 4:00 PM (WAT)</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
import { FormEvent, useState } from "react";
