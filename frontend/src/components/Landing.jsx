import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ArrowRight, CheckCircle2, Zap, Code, Layers, Rocket, Users, Shield, Star, Code2 } from 'lucide-react';
import { mockFeatures, mockPricingPlans, mockTestimonials } from '../mock';
import Navbar from './Navbar';

const iconMap = {
  Zap: Zap,
  Code: Code,
  Layers: Layers,
  Rocket: Rocket,
  Users: Users,
  Shield: Shield
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <Navbar isAuthenticated={false} />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20">
              AI-Powered Development Platform
            </Badge>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Build Apps with
              <span className="block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-transparent bg-clip-text mt-2">
                AI Agents
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-300">
              Transform your ideas into production-ready applications using natural language.
              Our AI agents handle the code while you focus on creativity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 text-lg group">
                  Start Building Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800 px-8 h-12 text-lg">
                  Learn More
                </Button>
              </a>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Free forever plan</span>
              </div>
            </div>
          </div>

          {/* Demo Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10"></div>
            <div className="rounded-xl border border-gray-800 overflow-hidden shadow-2xl shadow-emerald-500/10">
              <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-8 h-96 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Code className="w-16 h-16 mx-auto text-emerald-500" />
                  <p className="text-gray-400">Interactive demo will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Everything You Need to Build</h2>
            <p className="text-xl text-gray-400">Powerful features that make development effortless</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockFeatures.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              return (
                <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group">
                  <CardHeader>
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                      <Icon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Loved by Developers</h2>
            <p className="text-xl text-gray-400">See what our users are saying</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-300 text-base">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-400">Choose the plan that fits your needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockPricingPlans.map((plan, index) => (
              <Card key={index} className={`bg-gray-900/50 border-gray-800 relative ${
                plan.popular ? 'ring-2 ring-emerald-500 shadow-xl shadow-emerald-500/20' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400 ml-2">/{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup">
                    <Button className={`w-full ${
                      plan.popular ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-800 hover:bg-gray-700'
                    }`}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl text-gray-300">
            Join thousands of developers who are building faster with Repbep
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 text-lg">
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-transparent bg-clip-text">
                Repbep
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 Repbep. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
