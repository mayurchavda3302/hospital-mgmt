import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Activity, Users, Clock, Award, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const departments = [
    { title: "Gynaecology & Obstetrics", desc: "Expert care for women's health and high-risk pregnancy", icon: Activity },
    { title: "Test Tube Baby Center", desc: "Advanced IVF, ICSI, and IUI fertility treatments", icon: Activity },
    { title: "Pediatrics & Neonatology", desc: "Specialized newborn and child healthcare services", icon: Users },
    { title: "General Medicine & Surgery", desc: "Comprehensive surgical and medical diagnosis", icon: Activity },
  ];

  const treatments = [
    "IUI (Intrauterine Insemination)",
    "IVF (In Vitro Fertilization)",
    "ICSI (Intracytoplasmic Sperm Injection)",
    "Endometriosis Treatment",
    "Blastocyst Transfer",
    "PCOS Management",
    "Tubo Ovarian Abscess Treatment",
    "Infertility Workup",
    "High Risk Pregnancy Care",
    "Laparoscopic Surgery",
    "Fibroid Removal"
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative pt-16 pb-32 flex items-center min-h-[600px] overflow-hidden bg-gradient-to-br from-white via-blue-50 to-teal-50">
        <div className="absolute inset-0 hero-pattern opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                #1 Hospital in the City
              </div>
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-6">
                Siddhi Vinayak <br />
                <span className="text-gradient">Hospital.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                A renowned Multi-Specialty Hospital in Jamnagar since 1985, providing professional and honest care in IVF, Gynaecology, and Pediatrics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="rounded-full text-base px-8 h-14 shadow-xl shadow-primary/25">
                    Book Appointment
                  </Button>
                </Link>
                <Link href="/doctors">
                  <Button size="lg" variant="outline" className="rounded-full text-base px-8 h-14 border-2">
                    Find a Doctor
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Abstract decorative elements */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />

              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
                {/* Doctor team image */}
                <img
                  src="/images/medical-team.jpg"
                  alt="Medical Team"
                  className="w-full object-cover h-[500px]"
                />

                {/* Floating Card */}
                <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg flex items-center gap-4 max-w-xs">
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">20+ Years</p>
                    <p className="text-xs text-slate-500">of Excellence in Medical Service</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Why Choose Medicare?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              We combine advanced medical technology with compassionate care to ensure the best outcomes for our patients.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "30+ Years Experience", text: "Trusted healthcare provider in Jamnagar since 1985." },
              { icon: Clock, title: "24/7 Care", text: "Round-the-clock neonatal and emergency medical services." },
              { icon: Award, title: "Advanced IVF", text: "State-of-the-art Test Tube Baby Center with high success rates." },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="h-14 w-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary mb-6">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Our Departments</h2>
              <p className="text-slate-500">Comprehensive care across all specialties</p>
            </div>
            <Link href="/departments">
              <Button variant="outline" className="hidden sm:flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, i) => (
              <div key={i} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-slate-100 cursor-pointer">
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <dept.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{dept.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Our Specialized Treatments</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Advanced fertility and medical treatments tailored to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
            {treatments.map((treatment, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/20 hover:shadow-md transition-all">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-primary flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="font-medium text-slate-700">{treatment}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Need a Doctor for Check-up?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Just make an appointment & you will be done. Our team is ready to help you get back to full health.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-primary hover:bg-blue-50 font-bold px-8 h-12 rounded-full">
              Get an Appointment
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
