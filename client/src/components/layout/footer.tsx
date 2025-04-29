export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-4 px-6 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center mb-2 md:mb-0">
          <span className="neon-primary">ROXONN</span>
          <span className="mx-2">•</span>
          <span>Decentralized GitHub Rewards Platform</span>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-foreground">About</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Support</a>
        </div>
      </div>
    </footer>
  );
}
