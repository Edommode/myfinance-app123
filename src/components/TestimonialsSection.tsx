
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Adebayo Okafor",
      role: "University Student, Lagos",
      image: "AO",
      rating: 5,
      text: "MyFinance helped me save ₦100,000 for my final year project! The budgeting tools are perfect for students, and the investment education gave me confidence to start building wealth early."
    },
    {
      name: "Chioma Nwosu",
      role: "Small Business Owner, Abuja",
      image: "CN",
      rating: 5,
      text: "As a young entrepreneur, tracking business expenses was chaotic until I found MyFinance. The category-based analysis and savings goals helped me grow my business capital by 40%."
    },
    {
      name: "Ibrahim Musa",
      role: "Graduate, Kano",
      image: "IM",
      rating: 5,
      text: "The investment education hub taught me about Treasury Bills and mutual funds. I started with ₦5,000 and now have a diversified portfolio worth ₦250,000!"
    },
    {
      name: "Funmi Adebisi",
      role: "Corp Member, Port Harcourt",
      image: "FA",
      rating: 5,
      text: "During my NYSC year, MyFinance helped me manage my allowee wisely. The emergency fund tracker motivated me to save consistently, and I finished service with ₦180,000 saved!"
    },
    {
      name: "Emeka Okwu",
      role: "Software Developer, Lagos",
      image: "EO",
      rating: 5,
      text: "The personalized financial plan and daily money tips completely changed my relationship with money. I paid off my student loan 2 years early and started investing in AgricTech."
    },
    {
      name: "Amina Hassan",
      role: "Teacher, Kaduna",
      image: "AH",
      rating: 5,
      text: "Finance Wise's coaching sessions through the app were game-changing. I learned to avoid common money mistakes and now I'm building wealth on a teacher's salary!"
    }
  ];

  return (
    <section id="testimonials" className="py-16 bg-emerald-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">
            Success Stories from African Youth
          </h2>
          <p className="text-lg text-emerald-700 max-w-3xl mx-auto">
            See how MyFinance by Finance Wise has helped thousands of young Africans take control of their finances and build lasting wealth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-shadow duration-300 animate-fade-in border-emerald-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-african-gradient rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-emerald-900">{testimonial.name}</h4>
                    <p className="text-sm text-emerald-600">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="w-6 h-6 text-emerald-200 absolute -top-2 -left-2" />
                  <p className="text-emerald-700 italic pl-4">
                    {testimonial.text}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-lg">
            <div className="flex items-center space-x-2 text-emerald-800">
              <Star className="w-5 h-5 fill-gold-400 text-gold-400" />
              <span className="font-semibold">4.9/5 rating</span>
              <span className="text-emerald-600">from 12,000+ reviews</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
