// components/Footer.tsx
export default function PublicFooter() {
  return (
    <footer className="border-t bg-background py-8 mt-20">
      <div className="container px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GatherUp. All rights reserved. Made with
        love
      </div>
    </footer>
  );
}
