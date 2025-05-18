import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowRight, Code, Bug, PenTool, FileText, 
  Zap, Server, Github, CheckCircle, ArrowUpRight,
  ExternalLink, ChevronRight, Wallet, Star, Award
} from "lucide-react";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const [githubUsername, setGithubUsername] = useState('');
  const [userScore, setUserScore] = useState<number | null>(null);
  const [showScoreResult, setShowScoreResult] = useState(false);
  
  // Function to calculate user score based on GitHub username
  const calculateScore = () => {
    if (!githubUsername) return;
    
    // This would typically call an API to get real score data
    // For demo purposes, we'll generate a random score between 400-850
    const randomScore = Math.floor(Math.random() * 450) + 400;
    setUserScore(randomScore);
    setShowScoreResult(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-background/95 border-b border-border">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4c4.418 0 8 3.582 8 8 0 4.418-3.582 8-8 8-4.418 0-8-3.582-8-8 0-4.418 3.582-8 8-8zm1 3H9v2h4v3h-3v2h3v3h2v-3h3v-2h-3V9z"/>
            </svg>
            <span className="text-xl heading-font text-white">NEXUS<span className="text-secondary">VOID</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">Home</a>
            <a href="#browse" className="text-muted-foreground hover:text-white transition-colors">Projects</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-white transition-colors">How It Works</a>
            <a href="#about" className="text-muted-foreground hover:text-white transition-colors">About</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-secondary text-secondary hover:bg-secondary/10 font-medium"
                >
                  Get Your Score <Star className="ml-2 w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="heading-font text-center text-xl mb-4">DEVELOPER SCORE</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {!showScoreResult ? (
                    <>
                      <p className="text-center text-white mb-4">
                        Enter your GitHub username to calculate your developer score
                      </p>
                      <div className="flex space-x-2">
                        <Input
                          value={githubUsername}
                          onChange={(e) => setGithubUsername(e.target.value)}
                          placeholder="GitHub Username"
                          className="bg-muted text-white border-border"
                        />
                        <Button 
                          onClick={calculateScore} 
                          className="bg-primary hover:bg-primary/90 text-white"
                        >
                          Calculate
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center border-4 border-primary bg-muted mb-4">
                        <span className="text-3xl font-bold text-white">{userScore}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {userScore && userScore > 700 ? 'Excellent' : 
                         userScore && userScore > 600 ? 'Good' : 
                         userScore && userScore > 500 ? 'Average' : 'Needs Improvement'}
                      </h3>
                      <p className="text-muted-foreground">
                        Based on your GitHub contributions, code quality, and project history
                      </p>
                      <Button 
                        onClick={() => setShowScoreResult(false)} 
                        className="mt-4 bg-primary hover:bg-primary/90 text-white"
                      >
                        Check Another
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#341D63] to-[#2C023F]"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid-pattern-overlay"></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-secondary/20 blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-accent/20 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1 bg-primary/10 border border-primary/30 rounded-full">
              <span className="text-sm text-primary">Decentralized Developer Platform</span>
            </div>
            <h1 className="heading-font text-3xl md:text-4xl lg:text-5xl text-white mb-6 leading-tight neon-primary tracking-wider uppercase">
              EARN CRYPTO FOR<br />OPEN SOURCE CONTRIBUTIONS
            </h1>
            <p className="text-xl text-white/80 mb-10">
              Fix bugs, add features, review code — get rewarded with CREW tokens on Pharos Testnet
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button 
                onClick={() => navigate("/login")}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg h-auto"
              >
                Launch App
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-secondary text-secondary hover:bg-secondary/10 px-8 py-6 text-lg h-auto"
                  >
                    Get Your Score <Star className="ml-2 w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="heading-font text-center text-xl mb-4">DEVELOPER SCORE</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {!showScoreResult ? (
                      <>
                        <p className="text-center text-white mb-4">
                          Enter your GitHub username to calculate your developer score
                        </p>
                        <div className="flex space-x-2">
                          <Input
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            placeholder="GitHub Username"
                            className="bg-muted text-white border-border"
                          />
                          <Button 
                            onClick={calculateScore} 
                            className="bg-primary hover:bg-primary/90 text-white"
                          >
                            Calculate
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center border-4 border-primary bg-muted mb-4">
                          <span className="text-3xl font-bold text-white">{userScore}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {userScore && userScore > 700 ? 'Excellent' : 
                           userScore && userScore > 600 ? 'Good' : 
                           userScore && userScore > 500 ? 'Average' : 'Needs Improvement'}
                        </h3>
                        <p className="text-muted-foreground">
                          Based on your GitHub contributions, code quality, and project history
                        </p>
                        <Button 
                          onClick={() => setShowScoreResult(false)} 
                          className="mt-4 bg-primary hover:bg-primary/90 text-white"
                        >
                          Check Another
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Trust Bar */}
            <div className="pt-10 border-t border-border/50">
              <p className="text-sm text-white/60 mb-6">Trusted by developers from</p>
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 opacity-70">
                <img src="https://cdn.worldvectorlogo.com/logos/github-icon-1.svg" className="h-8 w-auto brightness-200" alt="GitHub" />
                <img src="https://cdn.worldvectorlogo.com/logos/aws-2.svg" className="h-8 w-auto brightness-200" alt="AWS" />
                <img src="https://cdn.worldvectorlogo.com/logos/microsoft-5.svg" className="h-8 w-auto brightness-200" alt="Microsoft" />
                <img src="https://cdn.worldvectorlogo.com/logos/zoho-2.svg" className="h-8 w-auto brightness-200" alt="Zoho" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[#312442]">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm mb-4">
              EASY TO USE
            </span>
            <h2 className="heading-font text-3xl text-white text-center mb-4 uppercase tracking-wider">How NexusVoid Works</h2>
            <p className="text-white/70 max-w-2xl mx-auto">Connecting developers with meaningful work and rewards on the Pharos Testnet</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* For Contributors */}
            <div className="bg-[#3C3050]/50 p-8 rounded-lg border border-[#52476C]">
              <h3 className="heading-font text-xl text-white mb-8 flex items-center">
                <Badge className="mr-2 bg-primary text-white">For Contributors</Badge>
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 border border-primary/30">
                    <Github className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Connect GitHub + Wallet</h4>
                    <p className="text-white/70">Link your GitHub account and crypto wallet to get started</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 border border-primary/30">
                    <Bug className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Pick an Issue with Bounty</h4>
                    <p className="text-white/70">Browse open issues with attached token rewards</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 border border-primary/30">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Boost Your Score</h4>
                    <p className="text-white/70">Increase your developer score with each contribution</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4 border border-primary/30">
                    <Wallet className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Get Paid in Crypto</h4>
                    <p className="text-white/70">Receive CREW tokens automatically when your PR is merged</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* For Pool Managers */}
            <div className="bg-[#3C3050]/50 p-8 rounded-lg border border-[#52476C]">
              <h3 className="heading-font text-xl text-white mb-8 flex items-center">
                <Badge className="mr-2 bg-secondary text-white">For Pool Managers</Badge>
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4 border border-secondary/30">
                    <Github className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Install GitHub App</h4>
                    <p className="text-white/70">Add the NexusVoid app to your repositories</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4 border border-secondary/30">
                    <Wallet className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Fund Issues</h4>
                    <p className="text-white/70">Add bounties to issues that need attention</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4 border border-secondary/30">
                    <CheckCircle className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Approve PRs</h4>
                    <p className="text-white/70">Review and merge high-quality contributions</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mr-4 border border-secondary/30">
                    <Zap className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Release Rewards</h4>
                    <p className="text-white/70">Tokens are automatically sent to contributors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Contribute */}
      <section className="py-24 bg-[#2C023F]">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-1 bg-secondary/10 border border-secondary/30 rounded-full text-secondary text-sm mb-4">
              OPPORTUNITIES
            </span>
            <h2 className="heading-font text-3xl text-white text-center mb-4 uppercase tracking-wider">Ways to Contribute</h2>
            <p className="text-white/70 max-w-2xl mx-auto">Multiple ways to earn rewards and boost your developer score</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Bug className="w-6 h-6" />, title: "Fix Bugs", description: "Squash bugs and improve stability", color: "primary" },
              { icon: <Zap className="w-6 h-6" />, title: "Add Features", description: "Implement new functionality", color: "secondary" },
              { icon: <FileText className="w-6 h-6" />, title: "Write Docs", description: "Improve documentation and examples", color: "accent" },
              { icon: <Server className="w-6 h-6" />, title: "Test Software", description: "Create tests and ensure quality", color: "primary" },
              { icon: <Code className="w-6 h-6" />, title: "Review Code", description: "Help maintain code quality", color: "secondary" },
              { icon: <PenTool className="w-6 h-6" />, title: "Help Others", description: "Answer questions and mentor", color: "accent" }
            ].map((item, index) => (
              <Card key={index} className={`bg-[#3C3050]/50 border-border hover:border-${item.color}/50 transition-all hover:shadow-lg hover:shadow-${item.color}/10 overflow-hidden group`}>
                <div className={`h-1 w-full bg-${item.color}`}></div>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-full bg-${item.color}/10 border border-${item.color}/30 flex items-center justify-center mb-4 text-${item.color} group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/70 mb-4">{item.description}</p>
                  <a href="#" className={`text-${item.color} inline-flex items-center text-sm hover:underline`}>
                    Explore Bounties <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30">
              View All Opportunities <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="browse" className="py-24 bg-[#341D63]">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-1 bg-accent/10 border border-accent/30 rounded-full text-accent text-sm mb-4">
              BOUNTIES AVAILABLE
            </span>
            <h2 className="heading-font text-3xl text-white text-center mb-4 uppercase tracking-wider">Featured Projects</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Explore open-source projects with active bounties ready for contributions
            </p>
          </div>

          <div className="flex justify-center mb-10 overflow-x-auto pb-4">
            <div className="flex space-x-2">
              <Button variant="secondary" className="bg-primary text-white hover:bg-primary/90">All</Button>
              <Button variant="outline" className="border-border text-white hover:border-primary/50 hover:bg-primary/10">Web3</Button>
              <Button variant="outline" className="border-border text-white hover:border-primary/50 hover:bg-primary/10">AI</Button>
              <Button variant="outline" className="border-border text-white hover:border-primary/50 hover:bg-primary/10">DevTools</Button>
              <Button variant="outline" className="border-border text-white hover:border-primary/50 hover:bg-primary/10">Infra</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {[
              {
                name: "ethereum/solidity",
                description: "Solidity, the Smart Contract Programming Language",
                tags: ["blockchain", "languages"],
                issues: 42,
                pool: "3.2 ETH",
                color: "primary"
              },
              {
                name: "defi-protocol/lending",
                description: "Decentralized lending protocol for Pharos Testnet",
                tags: ["defi", "finance"],
                issues: 28,
                pool: "500 USDC",
                color: "secondary"
              },
              {
                name: "ai-toolkit/models",
                description: "Open source AI models and utilities",
                tags: ["ai", "machine-learning"],
                issues: 56,
                pool: "2.5 ETH",
                color: "accent"
              },
            ].map((project, index) => (
              <Card key={index} className="bg-[#3C3050]/50 border-border hover:border-primary/50 transition-all group overflow-hidden">
                <div className={`h-1 w-full bg-${project.color}`}></div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{project.name}</h3>
                      <p className="text-white/70 text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-primary/30 bg-primary/10 text-primary">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full bg-${project.color}/10 border border-${project.color}/30 flex items-center justify-center`}>
                      <Github className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-border">
                    <div className="text-sm">
                      <span className="text-white/50">Open Issues:</span>
                      <span className="ml-2 text-white">{project.issues}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-white/50">Total Pool:</span>
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