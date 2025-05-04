import React from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, Code, Bug, PenTool, FileText, 
  Zap, Server, Github, CheckCircle, ArrowUpRight,
  ExternalLink, ChevronRight, Wallet
} from "lucide-react";

export default function LandingPage() {
  const [, navigate] = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-[#0D1117]">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-[#0D1117]/95 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c4.142 0 7.5 3.358 7.5 7.5 0 2.786-1.917 5.223-4.667 5.943v-3.943h1.917v-2h-1.917v-1.5c0-0.942 0.442-1.5 1.5-1.5h0.5v-2h-0.583c-1.978 0-3.23 1.305-3.23 3.25v1.75h-2.12v2h2.12v3.938c-2.737-0.729-4.642-3.161-4.642-5.938 0-4.142 3.358-7.5 7.5-7.5z"/>
            </svg>
            <span className="text-xl font-bold text-white">CodeCrew</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="#browse" className="text-gray-300 hover:text-white transition-colors">Browse Projects</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-gray-300"
            >
              {/* Theme toggle (moon/sun) */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </Button>
            <Button 
              onClick={() => navigate("/login")}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Launch App
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#161B22] to-[#0D1117]"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid-pattern-overlay"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Earn Crypto for Contributing to Open Source
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Fix bugs, add features, review code — get rewarded when your work is accepted
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button 
                onClick={() => navigate("/login")}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg h-auto"
              >
                Launch App
              </Button>
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-200 hover:bg-gray-800 px-8 py-6 text-lg h-auto"
              >
                Join Community
              </Button>
            </div>
            
            {/* Trust Bar */}
            <div className="pt-10 border-t border-gray-800">
              <p className="text-sm text-gray-400 mb-6">Trusted by developers from</p>
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 opacity-70">
                <img src="https://cdn.worldvectorlogo.com/logos/github-icon-1.svg" className="h-8 w-auto grayscale" alt="GitHub" />
                <img src="https://cdn.worldvectorlogo.com/logos/aws-2.svg" className="h-8 w-auto grayscale" alt="AWS" />
                <img src="https://cdn.worldvectorlogo.com/logos/microsoft-5.svg" className="h-8 w-auto grayscale" alt="Microsoft" />
                <img src="https://cdn.worldvectorlogo.com/logos/zoho-2.svg" className="h-8 w-auto grayscale" alt="Zoho" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[#161B22]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-16">How CodeCrew Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* For Contributors */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-8 flex items-center">
                <Badge className="mr-2 bg-primary text-white">For Contributors</Badge>
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Github className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Connect GitHub + Wallet</h4>
                    <p className="text-gray-400">Link your GitHub account and crypto wallet to get started</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Bug className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Pick an Issue with Bounty</h4>
                    <p className="text-gray-400">Browse open issues with attached token rewards</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Submit PR</h4>
                    <p className="text-gray-400">Work on the issue and create a pull request on GitHub</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Get Paid in Crypto</h4>
                    <p className="text-gray-400">Receive tokens automatically when your PR is merged</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* For Pool Managers */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-8 flex items-center">
                <Badge className="mr-2 bg-secondary text-white">For Pool Managers</Badge>
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                    <Github className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Install GitHub App</h4>
                    <p className="text-gray-400">Add the CodeCrew app to your repositories</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                    <Wallet className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Fund Issues</h4>
                    <p className="text-gray-400">Add bounties to issues that need attention</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Approve PRs</h4>
                    <p className="text-gray-400">Review and merge high-quality contributions</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4">
                    <Zap className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Release Rewards</h4>
                    <p className="text-gray-400">Tokens are automatically sent to contributors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Contribute */}
      <section className="py-24 bg-[#0D1117]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-16">Ways to Contribute</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Bug className="w-6 h-6" />, title: "Fix Bugs", description: "Squash bugs and improve stability" },
              { icon: <Zap className="w-6 h-6" />, title: "Add Features", description: "Implement new functionality" },
              { icon: <FileText className="w-6 h-6" />, title: "Write Docs", description: "Improve documentation and examples" },
              { icon: <Server className="w-6 h-6" />, title: "Test Software", description: "Create tests and ensure quality" },
              { icon: <Code className="w-6 h-6" />, title: "Review Code", description: "Help maintain code quality" },
              { icon: <PenTool className="w-6 h-6" />, title: "Help Others", description: "Answer questions and mentor" }
            ].map((item, index) => (
              <Card key={index} className="bg-[#161B22] border-gray-800 hover:border-primary/50 transition-all hover:shadow-md hover:shadow-primary/10">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 mb-4">{item.description}</p>
                  <a href="#" className="text-primary inline-flex items-center text-sm hover:underline">
                    Explore Bounties <ChevronRight className="ml-1 w-4 h-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="browse" className="py-24 bg-[#161B22]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Featured Projects</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Explore open-source projects with active bounties ready for contributions
          </p>

          <div className="flex justify-center mb-10 overflow-x-auto pb-4">
            <div className="flex space-x-2">
              <Button variant="secondary" className="bg-primary text-white hover:bg-primary/90">All</Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:border-gray-600">Web3</Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:border-gray-600">AI</Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:border-gray-600">DevTools</Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:border-gray-600">Infra</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {[
              {
                name: "ethereum/solidity",
                description: "Solidity, the Smart Contract Programming Language",
                tags: ["blockchain", "languages"],
                issues: 42,
                pool: "3.2 ETH"
              },
              {
                name: "defi-protocol/lending",
                description: "Decentralized lending protocol for Pharos Testnet",
                tags: ["defi", "finance"],
                issues: 28,
                pool: "500 USDC"
              },
              {
                name: "ai-toolkit/models",
                description: "Open source AI models and utilities",
                tags: ["ai", "machine-learning"],
                issues: 56,
                pool: "2.5 ETH"
              },
            ].map((project, index) => (
              <Card key={index} className="bg-[#0D1117] border-gray-800 hover:border-primary/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <Github className="w-5 h-5 text-gray-500" />
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-gray-800">
                    <div className="text-sm">
                      <span className="text-gray-500">Open Issues:</span>
                      <span className="ml-2 text-white">{project.issues}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Total Pool:</span>
                      <span className="ml-2 text-primary font-medium">{project.pool}</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-5 border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    View Project
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              variant="outline" 
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={() => navigate("/browse-issues")}
            >
              Browse All Projects <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Top Contributors */}
      <section className="py-24 bg-[#0D1117]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Contributors */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Top Contributors</h2>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { name: "web3wizard", avatar: "W", earned: "2,500 CREW" },
                  { name: "codehunter", avatar: "C", earned: "1,750 CREW" },
                  { name: "devmaster", avatar: "D", earned: "1,200 CREW" },
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center p-4 bg-[#161B22] rounded-lg border border-gray-800">
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-lg mr-4">
                      {contributor.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{contributor.name}</h4>
                      <p className="text-gray-400 text-sm">GitHub</p>
                    </div>
                    <div className="text-right">
                      <div className="text-primary font-medium">{contributor.earned}</div>
                      <p className="text-gray-400 text-sm">earned</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Testimonials */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-8">Testimonials</h2>
              <div className="bg-[#161B22] p-8 rounded-lg border border-gray-800">
                <svg className="w-10 h-10 text-primary/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-300 text-lg mb-6">
                  "I fixed a small bug in a popular library and earned $150 worth of tokens. It was surprisingly straightforward and rewarding!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold text-sm mr-3">
                    JS
                  </div>
                  <div>
                    <h4 className="text-white font-medium">jsdev23</h4>
                    <p className="text-gray-400 text-sm">Full-stack Developer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CREW Token Overview */}
      <section className="py-24 bg-[#161B22]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30">Tokenomics Finalizing</Badge>
            <h2 className="text-3xl font-bold text-white mb-4">CREW Token Overview</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              CREW is the utility token that powers the CodeCrew ecosystem, enabling
              efficient reward distribution and platform governance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-[#0D1117] border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Wallet className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Rewards</h3>
                <p className="text-gray-400">Earn tokens for contributions to open source projects</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0D1117] border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-primary">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Governance</h3>
                <p className="text-gray-400">Vote on proposals and shape the future of the platform</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#0D1117] border-gray-800">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-primary">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Staking</h3>
                <p className="text-gray-400">Lock tokens for bonus rewards and platform benefits</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-gray-700 text-primary hover:bg-gray-800"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-[#0D1117]">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Stay Updated on Bounties & Launches</h2>
            <div className="flex space-x-0 mb-2">
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 rounded-l-md bg-[#161B22] border border-gray-700 text-white"
              />
              <Button className="rounded-l-none bg-primary hover:bg-primary/90">
                Subscribe
              </Button>
            </div>
            <p className="text-gray-500 text-sm">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#0A0C10] border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Roadmap</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Insights</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Token</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Forum</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center">
            <div className="flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5c4.142 0 7.5 3.358 7.5 7.5 0 2.786-1.917 5.223-4.667 5.943v-3.943h1.917v-2h-1.917v-1.5c0-0.942 0.442-1.5 1.5-1.5h0.5v-2h-0.583c-1.978 0-3.23 1.305-3.23 3.25v1.75h-2.12v2h2.12v3.938c-2.737-0.729-4.642-3.161-4.642-5.938 0-4.142 3.358-7.5 7.5-7.5z"/>
              </svg>
              <span className="text-xl font-bold text-white ml-2">CodeCrew</span>
            </div>
            <p className="text-gray-500">
              © 2025 CodeCrew. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}