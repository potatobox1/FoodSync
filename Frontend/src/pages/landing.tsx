import { CuboidIcon as CubeIcon, Mail, Phone, Building } from "lucide-react";
import "../styles/landing.css";
function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white">
        <div className="text-[#187795] font-bold text-2xl">
          <a href="/">FoodSync</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="/contact" className="text-[#187795]">
            Contact Us
          </a>
          <a href="/login" className="border border-[#187795] text-[#187795] px-6 py-2 rounded">
            Join
          </a>
          <a href="/login" className="bg-[#187795] text-white px-6 py-2 rounded">
            Login
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[400px] w-full">
          <img
            src="/images/children-eating.jpg?height=400&width=1200"
            alt="Children eating food"
            className="object-cover absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40">
            <div className="container mx-auto px-4 py-16 text-white max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">Join the Fight Against Food Waste Today!</h1>
              <p className="mb-6">
                Our innovative web application connects restaurants and food banks, ensuring that surplus food reaches
                those in need. Together, we can make a significant impact on reducing food wastage and feeding our
                communities.
              </p>
              <a href="/learn-more" className="bg-white text-black px-6 py-2 inline-block rounded">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-8 bg-[#d6d6d6]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">Get Started with Our Food Rescue Platform</h2>
            </div>
            <div>
              <p>
                Join our platform to help reduce food waste. It's simple: sign up, list your available inventory, and
                connect with local foodbanks. Together, we can make a difference in our community.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-start">
              <CubeIcon className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Step 1: Sign Up for an Account</h3>
              <p className="text-sm mb-4">Create your account in just a few clicks.</p>
              <a href="/login" className="mt-auto bg-primary text-primary-foreground px-6 py-2 rounded">
                Sign Up
              </a>
            </div>
            <div>
              <CubeIcon className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Step 2: List Your Available Inventory</h3>
              <p className="text-sm">Easily upload your surplus food items.</p>
            </div>
            <div>
              <CubeIcon className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Step 3: Connect with Local Foodbanks</h3>
              <p className="text-sm">Coordinate pickups and help those in need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Restaurants on our platform</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Defence Club J",
                image: "/images/club_j.png?height=200&width=300",
                description: "One of the leading food donors of lahore, known for its food quality and taste",
              },
              {
                name: "Defence Club Raya",
                image: "/images/raya.png?height=200&width=300",
                description: "Main stay on any foodies wishlist, known for amazing food and great variety",
              },
              {
                name: "Defence Club FF",
                image: "/images/club_f.png?height=200&width=300",
                description: "Known for its desi cuisine, FF is one of the largest donors of desi food in lahore.",
              },
            ].map((restaurant, index) => (
              <div key={index} className="border rounded overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={restaurant.image || "/placeholder.svg"}
                    alt={restaurant.name}
                    className="object-cover absolute inset-0 w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Goals Section */}
      <section className="py-12 bg-[#d6d6d6]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Goals</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 p-6 rounded">
              <h3 className="font-bold mb-4 text-center">Reduce food Waste</h3>
              <p className="text-sm text-center text-gray-600">
                Minimizing surplus food waste by connecting restaurants with food banks in real-time, ensuring that
                excess food reaches those who need it most
              </p>
            </div>
            <div className="bg-white/80 p-6 rounded">
              <h3 className="font-bold mb-4 text-center">From Surplus to Support</h3>
              <p className="text-sm text-center text-gray-600">
                Bridging the gap between restaurants and underfunded food banks to ensure surplus food reaches those in
                need
              </p>
            </div>
            <div className="bg-white/80 p-6 rounded">
              <h3 className="font-bold mb-4 text-center">Community Collaboration</h3>
              <p className="text-sm text-center text-gray-600">
                Encouraging restaurants and food banks to work together, share resources, and create a sustainable
                impact on food security
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-200 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Mail className="h-12 w-12 mb-2" />
              <h3 className="font-bold mb-2">Email</h3>
              <p className="text-sm">foodsync9@gmail.com</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="h-12 w-12 mb-2" />
              <h3 className="font-bold mb-2">Phone</h3>
              <p className="text-sm">+92 325 9422 068</p>
            </div>
            <div className="flex flex-col items-center">
              <Building className="h-12 w-12 mb-2" />
              <h3 className="font-bold mb-2">Office</h3>
              <p className="text-sm">LUMS SSE CS Department</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;