import { Button } from "@/components/ui/button";

function Navbar() {
  return (
    <div className="text-primary border-b h-[8vh] z-50 fixed flex items-center justify-between px-20 bg-background w-screen">
      <h1 className="text-white">Logo</h1>
      <Button size="default" className="!rounded-full">
        Logout
      </Button>
    </div>
  );
}

export default Navbar;
