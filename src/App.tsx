/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring,
  useInView
} from "motion/react";
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  PhoneCall, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Award, 
  MessageCircle,
  Cpu,
  Smartphone,
  Battery,
  Camera,
  Layers,
  Zap,
  Headphones,
  Usb,
  ChevronRight,
  MapPin,
  Heart
} from "lucide-react";

// --- Types ---
interface Product {
  id: number;
  name: string;
  price: number;
  discount: string;
  image: string;
  category: string;
  subcategory: string;
  brand: string;
  stock: number;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

// --- Components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`glass-card p-6 hover:shadow-[0_0_20px_rgba(0,102,255,0.3)] transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-12 text-center">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-font text-4xl md:text-5xl font-bold neon-text"
    >
      {title}
    </motion.h2>
    <motion.p 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
      className="text-gray-400 mt-4 max-w-2xl mx-auto"
    >
      {subtitle}
    </motion.p>
  </div>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("mp_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});
  
  // Contact Form State
  const [formState, setFormState] = useState({ name: "", phone: "", message: "" });
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});
  const [formSuccess, setFormSuccess] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    localStorage.setItem("mp_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const checkoutWhatsApp = () => {
    if (cart.length === 0) return;
    
    const productsText = cart.map(item => `* ${item.name} x ${item.quantity}`).join("\n");
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    const message = encodeURIComponent(
      `Assalam o Alaikum\nMujhe ye products order karne hain:\n\n${productsText}\n\nTotal: Rs ${total.toLocaleString()}\n\nShukriya!`
    );
    window.open(`https://wa.me/923001234567?text=${message}`, "_blank");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, boolean> = {
      name: !formState.name.trim(),
      phone: !formState.phone.trim(),
      message: !formState.message.trim(),
    };
    
    setFormErrors(errors);
    
    if (!Object.values(errors).some(Boolean)) {
      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setFormState({ name: "", phone: "", message: "" });
      }, 3000);
    }
  };

  const brands = [
    { name: "Apple", icon: "https://cdn-icons-png.flaticon.com/512/0/747.png" },
    { name: "Samsung", icon: "https://cdn-icons-png.flaticon.com/512/5969/5969116.png" },
    { name: "Xiaomi", icon: "https://cdn-icons-png.flaticon.com/512/5969/5969135.png" },
    { name: "Oppo", icon: "https://cdn-icons-png.flaticon.com/512/882/882745.png" },
    { name: "Vivo", icon: "https://cdn-icons-png.flaticon.com/512/882/882751.png" },
    { name: "Anker", icon: "https://cdn-icons-png.flaticon.com/512/5969/5969106.png" },
    { name: "Baseus", icon: "https://cdn-icons-png.flaticon.com/512/5969/5969109.png" },
    { name: "JBL", icon: "https://cdn-icons-png.flaticon.com/512/300/300221.png" },
  ];

  const categories = [
    { name: "LCD & Screens", Urdu: "LCD Display", icon: <Layers className="w-8 h-8 text-primary" /> },
    { name: "Batteries", Urdu: "Mobile Battery", icon: <Battery className="w-8 h-8 text-accent" /> },
    { name: "Charging Parts", Urdu: "Charging Jack/Flex", icon: <Usb className="w-8 h-8 text-secondary" /> },
    { name: "Camera Modules", Urdu: "Lens and Camera", icon: <Camera className="w-8 h-8 text-secondary" /> },
    { name: "Audio Parts", Urdu: "Speaker & Mic", icon: <Headphones className="w-8 h-8 text-secondary" /> },
    { name: "Body & Housing", Urdu: "Back Panels/Frames", icon: <Smartphone className="w-8 h-8 text-primary" /> },
    { name: "Motherboard ICs", Urdu: "Power/Wifi/CPU ICs", icon: <Cpu className="w-8 h-8 text-accent" /> },
    { name: "Signal & Network", Urdu: "Antenna Flex/Booster", icon: <Zap className="w-8 h-8 text-primary" /> },
    { name: "Repair Tools", Urdu: "Screwdrivers/Meters", icon: <Zap className="w-8 h-8 text-accent" /> },
    { name: "Small Parts", Urdu: "Capacitors/Diodes", icon: <Cpu className="w-8 h-8 text-secondary" /> },
  ];

  const products: Product[] = [
    // --- DISPLAY SECTION ---
    { id: 1, name: "iPhone 15 Pro Max OLED Display (Original)", price: 45000, discount: "Hot", image: "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=400", category: "LCD & Screens", subcategory: "OLED", brand: "Apple", stock: 12, description: "Grade A+ original OLED assembly with frame." },
    { id: 2, name: "Samsung S24 Ultra AMOLED Panel", price: 52000, discount: "New", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=400", category: "LCD & Screens", subcategory: "AMOLED", brand: "Samsung", stock: 8, description: "Original dynamic AMOLED 2X panel." },
    { id: 3, name: "Redmi Note 13 Pro 5G LCD Assembly", price: 12500, discount: "Best Seller", image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=400", category: "LCD & Screens", subcategory: "Incell", brand: "Xiaomi", stock: 25, description: "High quality Incell display with touch digitizer." },
    { id: 4, name: "Vivo V30 OLED Screen with Frame", price: 18500, discount: "Premium", image: "https://images.unsplash.com/photo-1556656793-062ff987c56c?q=80&w=400", category: "LCD & Screens", subcategory: "OLED", brand: "Vivo", stock: 15, description: "Replacement OLED for Vivo V30 series." },
    
    // --- BATTERY SECTION ---
    { id: 5, name: "iPhone 14 Pro Max Original Battery", price: 8500, discount: "Original", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400", category: "Batteries", subcategory: "Original", brand: "Apple", stock: 50, description: "Zero cycle original battery cell." },
    { id: 6, name: "Samsung Galaxy S22 Ultra Battery (OEM)", price: 4200, discount: "OEM", image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=400", category: "Batteries", subcategory: "OEM", brand: "Samsung", stock: 100, description: "High capacity OEM replacement battery." },
    { id: 7, name: "Google Pixel 7 Pro Battery G03P", price: 6500, discount: "Rare", image: "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=400", category: "Batteries", subcategory: "Original", brand: "Google", stock: 20, description: "Original Google Pixel service part." },

    // --- CHARGING SECTION ---
    { id: 8, name: "iPhone 13 Pro Charging Port Flex", price: 3200, discount: "Fast Ship", image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=400", category: "Charging Parts", subcategory: "Flex Cable", brand: "Apple", stock: 45, description: "Complete charging dock flex cable." },
    { id: 9, name: "Global Type-C Charging Jack (10pcs)", price: 850, discount: "Bulk", image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=400", category: "Charging Parts", subcategory: "Connector", brand: "Generic", stock: 500, description: "Universal Type-C SMD charging connectors." },
    { id: 10, name: "Oppo Reno 10 Pro Charging Board", price: 1800, discount: "Original", image: "https://images.unsplash.com/photo-1619139031267-339893d5f573?q=80&w=400", category: "Charging Parts", subcategory: "Board", brand: "Oppo", stock: 30, description: "Original sub-board with mic and antenna point." },

    // --- CAMERA SECTION ---
    { id: 11, name: "iPhone 15 Rear Camera Module", price: 14500, discount: "Grade A", image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=400", category: "Camera Modules", subcategory: "Back Camera", brand: "Apple", stock: 10, description: "Original main camera sensor assembly." },
    { id: 12, name: "Samsung S23 Ultra 200MP Main Cam", price: 19500, discount: "Elite", image: "https://images.unsplash.com/photo-1588423770674-f2855ee82639?q=80&w=400", category: "Camera Modules", subcategory: "Back Camera", brand: "Samsung", stock: 5, description: "Oem 200MP primary camera module." },
    { id: 13, name: "iPhone 14 FaceID/Front Cam Flex", price: 7800, discount: "Fragile", image: "https://images.unsplash.com/photo-1609091839311-d536446bb1e4?q=80&w=400", category: "Camera Modules", subcategory: "Front Camera", brand: "Apple", stock: 15, description: "TrueDepth camera system flex." },

    // --- AUDIO SECTION ---
    { id: 14, name: "iPhone 11 Loudspeaker Ringer", price: 1200, discount: "Loud", image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=400", category: "Audio Parts", subcategory: "Speaker", brand: "Apple", stock: 80, description: "Bottom loudspeaker repair part." },
    { id: 15, name: "Xiaomi Mi 11 Ear Speaker", price: 650, discount: "Clear", image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=400", category: "Audio Parts", subcategory: "Receiver", brand: "Xiaomi", stock: 120, description: "Replacement earpiece speaker." },

    // --- BODY & HOUSING ---
    { id: 16, name: "iPhone 14 Pro Back Glass Module", price: 5500, discount: "All Colors", image: "https://images.unsplash.com/photo-1603313011101-3165b6a188b4?q=80&w=400", category: "Body & Housing", subcategory: "Back Glass", brand: "Apple", stock: 60, description: "Rear glass with camera lens and adhesive." },
    { id: 17, name: "Samsung S21 Middle Frame (Steel)", price: 3800, discount: "Structural", image: "https://images.unsplash.com/photo-1603313011101-3165b6a188b4?q=80&w=400", category: "Body & Housing", subcategory: "Frame", brand: "Samsung", stock: 20, description: "Chassis frame for internal component mounting." },

    // --- MOTHERBOARD ICs ---
    { id: 18, name: "Qualcomm PM8550 Power Management IC", price: 2800, discount: "Crucial", image: "https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?q=80&w=400", category: "Motherboard ICs", subcategory: "Power IC", brand: "Qualcomm", stock: 150, description: "Universal Power IC for high-end Androids." },
    { id: 19, name: "Apple U2 Tristar Charging IC (1610A3)", price: 1450, discount: "Logic", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400", category: "Motherboard ICs", subcategory: "Charging IC", brand: "Apple", stock: 300, description: "Common charging controller for iPhone 6-8." },
    { id: 20, name: "Broadcom WiFi/Bluetooth IC", price: 2200, discount: "Wireless", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400", category: "Motherboard ICs", subcategory: "WiFi IC", brand: "Generic", stock: 75, description: "Universal WiFi/BT chipset for repair." },

    // --- SIGNAL & NETWORK ---
    { id: 21, name: "iPhone X Antenna Flex Set", price: 1800, discount: "Full Set", image: "https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=400", category: "Signal & Network", subcategory: "Antenna", brand: "Apple", stock: 40, description: "Internal signal and wifi antenna cables." },
    { id: 22, name: "Network Signal Booster IC (RF7198)", price: 950, discount: "Signal", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400", category: "Signal & Network", subcategory: "Network IC", brand: "Generic", stock: 200, description: "RF amplifier IC for signal issues." },

    // --- REPAIR TOOLS ---
    { id: 23, name: "Sunshine SS-905D Power Boot Cable", price: 4500, discount: "Pro Tool", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400", category: "Repair Tools", subcategory: "Power Tool", brand: "Sunshine", stock: 30, description: "Professional boot cable for testing boards." },
    { id: 24, name: "Quick 861DW Hot Air Rework Station", price: 34500, discount: "Premium", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400", category: "Repair Tools", subcategory: "Soldering", brand: "Quick", stock: 5, description: "Original 1000W lead-free hot air station." },
    { id: 25, name: "Precision Screwdriver Set (24 in 1)", price: 1800, discount: "Must Have", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400", category: "Repair Tools", subcategory: "Hand Tool", brand: "Baku", stock: 100, description: "Magnetic S2 steel bits for phone repair." },

    // --- SMALL PARTS ---
    { id: 26, name: "SMD Ceramic Capacitors (Mix 100pcs)", price: 450, discount: "Value", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400", category: "Small Parts", subcategory: "Capacitor", brand: "Generic", stock: 1000, description: "Common value SMD caps for board repair." },
    { id: 27, name: "Soldering Flux Paste (Relife RL-422)", price: 1200, discount: "High Quality", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400", category: "Small Parts", subcategory: "Flux", brand: "Relife", stock: 80, description: "Non-clean halogen-free soldering flux." },
    { id: 28, name: "0.01mm Jumper Wire (Original)", price: 550, discount: "Thin", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=400", category: "Small Parts", subcategory: "Wire", brand: "Mechanic", stock: 200, description: "Ultra-thin copper wire for IC jumpers." },
  ];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesBrand = selectedBrand === "All" || p.brand === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="min-h-screen font-sans grid-pattern relative overflow-hidden bg-dark-bg selection:bg-accent/40">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div 
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
            className="fixed inset-0 z-[100] bg-dark-bg flex flex-col items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center space-font font-bold text-4xl neon-border mb-8 shadow-[0_0_50px_rgba(0,102,255,0.3)]">
                MP
              </div>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "240px" }}
                transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                className="h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent"
              />
              <p className="mt-6 text-[10px] uppercase tracking-[0.5em] text-gray-500 font-bold">Initializing Tech Supply</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Ambient Background Highlights --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 spotlight-orb rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 spotlight-orb rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="max-w-[1400px] w-[calc(100%-40px)] m-[20px_auto] glass-card-premium px-6 py-4 flex items-center justify-between rounded-[2rem] border border-white/10 shadow-2xl pointer-events-auto gap-5 box-border"
        >
          <div className="flex items-center gap-3 group cursor-pointer flex-shrink-0">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center space-font font-bold text-xl neon-border shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              MP
            </div>
            <span className="space-font font-bold text-xl lg:text-2xl tracking-tighter hidden sm:block">
              MobileParts<span className="text-accent underline decoration-accent/20 underline-offset-8">PK</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center gap-8 flex-1">
            {["Marketplace", "Wholesale", "Service", "Brands"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all relative group whitespace-nowrap"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            {/* Search - Desktop/Tablet */}
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs focus:border-accent outline-none w-[200px] lg:w-[280px] transition-all"
              />
            </div>
            
            {/* Search - Mobile (Hidden Input, Show Icon) */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Cart - Always Visible */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 glass-card bg-white/5 border-white/10 px-4 md:px-5 py-2.5 hover:bg-white/10 transition-all rounded-xl group active:scale-95 flex-shrink-0"
            >
              <div className="relative flex-shrink-0">
                <ShoppingCart size={18} className="group-hover:rotate-12 transition-transform text-gray-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 w-4 h-4 bg-accent text-dark-bg text-[9px] font-black rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Inventory</span>
            </button>

            {/* Hamburger - Tablet & Mobile */}
            <button 
              className="lg:hidden p-2.5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={22} />
            </button>
          </div>
        </motion.div>
      </nav>

      {/* --- Cart Drawer --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-dark-bg/95 backdrop-blur-2xl z-[70] border-l border-white/10 p-8 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl space-font font-bold uppercase tracking-tighter">My <span className="text-accent underline decoration-accent/20">Cart</span></h3>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-3 glass-card bg-white/5 hover:bg-white/10 rounded-full transition-colors active:scale-90"
                >
                  <X size={24} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                    <ShoppingCart size={40} />
                  </div>
                  <p className="text-xl font-bold italic opacity-30">Cart is empty</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="px-8 py-3 bg-white text-dark-bg font-black rounded-xl hover:scale-105 transition-all text-sm uppercase tracking-widest"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-4 pr-4 custom-scrollbar">
                    {cart.map((item) => (
                      <div key={item.id} className="glass-card-premium p-4 rounded-2xl border border-white/5 flex gap-4 group">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold truncate mb-1">{item.name}</h4>
                          <p className="text-accent font-black text-xs mb-3">Rs. {item.price.toLocaleString()}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 glass-card bg-white/5 p-1 rounded-lg">
                              <button 
                                onClick={() => updateCartQuantity(item.id, -1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
                              >
                                {item.quantity === 1 ? <X size={12} /> : "-"}
                              </button>
                              <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.id, 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
                              >
                                +
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-[10px] uppercase tracking-widest font-black text-red-500/50 hover:text-red-500 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="text-right flex flex-col justify-between">
                           <p className="text-sm font-black">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/10 space-y-6">
                    <div className="flex justify-between items-end">
                      <p className="text-gray-500 uppercase tracking-widest font-black text-[10px]">Subtotal Estimate</p>
                      <p className="text-3xl space-font font-black">Rs. {cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={clearCart}
                        className="py-4 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all active:scale-95"
                      >
                        Clear All
                      </button>
                      <button 
                        onClick={checkoutWhatsApp}
                        className="py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/20"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 z-50 bg-dark-bg/95 backdrop-blur-xl md:hidden flex flex-col p-8"
          >
            <div className="flex justify-end mb-12">
              <button onClick={() => setIsMenuOpen(false)} className="p-2">
                <X size={32} />
              </button>
            </div>
          <div className="flex flex-col gap-6 text-2xl space-font font-medium flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-lg focus:border-accent outline-none transition-all"
              />
            </div>
            {["Home", "Parts", "Accessories", "Brands", "Wholesale", "Contact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)}>
                {item}
              </a>
            ))}
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <section id="home" className="relative pt-32 pb-20 px-6 min-h-screen flex items-center z-10 perspective-2000 overflow-hidden">
        <motion.div 
          style={{ scale, opacity: opacityHero }}
          className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center w-full"
        >
          <div className="space-y-10">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-card border border-accent/20 text-accent font-black text-[10px] uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(0,229,255,0.1)]"
            >
              <Zap size={14} className="fill-accent animate-pulse" /> Direct Supply Chain Access
            </motion.div>
            
            <div className="space-y-4">
              <motion.h1 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
                className="text-6xl md:text-8xl space-font font-black leading-[0.85] tracking-tighter"
              >
                ELITE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-x">PRECISION</span> <br />
                <span className="italic font-light text-white/40">COMPONENTS</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.2 }}
                className="text-gray-400 text-lg md:text-xl max-w-xl leading-relaxed font-medium"
              >
                Saddar's premium wholesale ecosystem, now digitized. Original panels, batteries, and accessories with <span className="text-white">Next-Day Delivery</span> nationwide.
              </motion.p>
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.4 }}
              className="flex flex-wrap gap-6"
            >
              <button className="px-12 py-5 bg-white text-dark-bg font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] group shimmer-btn uppercase tracking-widest text-sm">
                Explore Inventory <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-12 py-5 glass-card-premium border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all active:scale-95 flex items-center gap-3">
                <Truck size={20} className="text-secondary" /> Dealer Portal
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2.6 }}
              className="flex items-center gap-8 pt-6 border-t border-white/5"
            >
              {[
                { label: "Active Shops", value: "1.2k+" },
                { label: "Daily Orders", value: "850+" },
                { label: "Parts Catalog", value: "5k+" }
              ].map((stat, i) => (
                <div key={i} className="group cursor-default">
                  <div className="text-2xl space-font font-black group-hover:text-accent transition-colors">{stat.value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="relative preserve-3d">
            <motion.div
              initial={{ opacity: 0, rotateY: 45, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: -15, scale: 1 }}
              transition={{ duration: 2, delay: 1.8, ease: "easeOut" }}
              className="relative z-10"
            >
              {/* Glass Phone Mockup */}
              <div className="relative w-[320px] h-[640px] md:w-[380px] md:h-[760px] mx-auto preserve-3d">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-2xl rounded-[4rem] border-[1px] border-white/20 shadow-2xl overflow-hidden shadow-primary/20">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621330396173-e41b181292f7?q=80&w=800')] bg-cover bg-center grayscale opacity-40 mix-blend-overlay" />
                  <div className="absolute inset-6 rounded-[3rem] border border-white/5 bg-black/40 flex flex-col items-center justify-center p-8 text-center backdrop-blur-md">
                     <motion.div 
                       animate={{ 
                         rotate: [0, 360],
                         scale: [1, 1.1, 1]
                       }}
                       transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                       className="w-32 h-32 rounded-full border-[1px] border-accent/30 flex items-center justify-center mb-10 relative"
                     >
                       <div className="absolute inset-2 border-[1px] border-primary/20 rounded-full animate-spin-slow" />
                       <Cpu size={48} className="text-accent" />
                     </motion.div>
                     <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-black mb-2">System Diagnostic</p>
                     <h3 className="text-3xl space-font font-black mb-4 uppercase">Elite Grade Parts</h3>
                     <p className="text-sm text-gray-400 font-medium">Certified original smartphone components for professional technicians.</p>
                  </div>
                </div>

                {/* Floating "Inventory Particles" */}
                {[
                  { icon: <Battery />, label: "Original Cells", top: "10%", left: "-20%", color: "text-green-400" },
                  { icon: <Layers />, label: "OLED Panels", top: "40%", right: "-25%", color: "text-blue-400" },
                  { icon: <Camera />, label: "Cam Modules", bottom: "15%", left: "-15%", color: "text-purple-400" },
                  { icon: <Smartphone />, label: "Full Housing", bottom: "5%", right: "-10%", color: "text-orange-400" },
                ].map((particle, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      y: [0, -40, 0],
                      rotateZ: [0, 10, 0]
                    }}
                    transition={{ 
                      duration: 4 + i, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: i * 0.5
                    }}
                    style={{ top: particle.top, left: particle.left, right: particle.right, bottom: particle.bottom }}
                    className="absolute z-20 glass-card-premium p-5 rounded-3xl border border-white/10 flex items-center gap-3 backdrop-blur-3xl shadow-xl group hover:border-accent/40 cursor-default"
                  >
                    <div className={`${particle.color} bg-white/5 p-2 rounded-xl group-hover:scale-110 transition-transform`}>
                      {particle.icon}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest">{particle.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* --- Live Stats --- */}
      <section className="px-6 py-12 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Products", value: "5000+", icon: <Layers size={24} /> },
            { label: "Repair Shops", value: "1200+", icon: <ShieldCheck size={24} /> },
            { label: "Delivery", value: "24hr", icon: <Truck size={24} /> },
            { label: "Original Parts", value: "99%", icon: <Award size={24} /> },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="glass-card p-6 border-white/5 flex flex-col items-center text-center group"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <h3 className="text-3xl space-font font-bold">{stat.value}</h3>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Brands --- */}
      <section id="brands" className="px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Premium Brands" 
            subtitle="Original parts for every major smartphone brand available in Pakistan market." 
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {brands.map((brand, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1, rotateY: 20 }}
                onClick={() => setSelectedBrand(prev => prev === brand.name ? "All" : brand.name)}
                className={`glass-card p-4 aspect-square flex flex-col items-center justify-center group cursor-pointer transition-all duration-500 ${selectedBrand === brand.name ? "border-accent bg-accent/10" : "border-white/5"}`}
              >
                <img 
                  src={brand.icon} 
                  alt={brand.name} 
                  className={`w-12 h-12 object-contain transition-all duration-500 ${selectedBrand === brand.name ? "grayscale-0" : "grayscale group-hover:grayscale-0"}`} 
                  referrerPolicy="no-referrer"
                />
                <span className={`text-[10px] font-bold mt-2 uppercase tracking-widest text-accent ${selectedBrand === brand.name ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}>{brand.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Categories --- */}
      <section className="px-6 py-20 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Explore Categories" 
            subtitle="Har cheez original, har cheez behtareen. Saddar rates ab apki pocket mein." 
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedCategory(prev => prev === cat.name ? "All" : cat.name)}
                className={`glass-card group p-8 relative overflow-hidden cursor-pointer transition-all duration-500 ${selectedCategory === cat.name ? "border-accent bg-accent/10" : "border-white/5"}`}
              >
                <div className={`absolute -right-4 -bottom-4 opacity-10 transition-transform text-primary ${selectedCategory === cat.name ? "scale-125 rotate-12" : "group-hover:scale-110"}`}>
                  {cat.icon}
                </div>
                <div className="mb-6 scale-125 origin-left">{cat.icon}</div>
                <h3 className="text-2xl space-font font-bold mb-2">{cat.name}</h3>
                <p className="text-gray-400 font-medium mb-4">{cat.Urdu}</p>
                <button className="text-sm font-bold flex items-center gap-2 group-hover:text-accent transition-colors">
                  {selectedCategory === cat.name ? "Filtered By" : "Shop Now"} <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Products --- */}
      <section id="parts" className="px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl space-font font-bold neon-text">Featured <span className="italic">Products</span></h2>
              <p className="text-gray-500 mt-2">Latest original parts and accessories in Karachi stock.</p>
            </div>
            <div className="flex gap-2 p-1 glass-card rounded-full overflow-x-auto no-scrollbar max-w-full">
              {["All", ...categories.map(c => c.name)].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === cat ? "bg-primary text-white" : "text-gray-500 hover:text-white"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <div className="glass-card p-4 border-white/5 h-full flex flex-col group-hover:bg-white/10 transition-all duration-500">
                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-dark-bg">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 bg-accent text-dark-bg text-[10px] font-black rounded-lg uppercase tracking-widest">
                          {product.discount}
                        </div>
                        <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[8px] font-black rounded-lg uppercase tracking-widest">
                          {product.brand}
                        </div>
                        <button className="absolute top-3 right-3 p-2 bg-dark-bg/50 backdrop-blur-md rounded-full text-white/50 hover:text-red-500 transition-colors">
                          <Heart size={16} />
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-accent font-bold uppercase tracking-widest mb-1">{product.category} • {product.subcategory}</p>
                        <h4 className="text-lg space-font font-bold mb-1 line-clamp-2 leading-snug">{product.name}</h4>
                        <p className="text-gray-500 text-[10px] line-clamp-2 mb-4 leading-relaxed">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-xs text-gray-500 line-through">Rs. {(product.price + 1500).toLocaleString()}</p>
                          <p className="text-xl space-font font-black">Rs. {product.price.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => addToCart(product)}
                          className={`p-3 glass-card transition-all active:scale-90 ${addedItems[product.id] ? "bg-green-500 text-white" : "bg-white/5 hover:bg-primary hover:text-white"}`}
                        >
                          {addedItems[product.id] ? "✓" : <ShoppingCart size={20} />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 flex flex-col items-center justify-center space-y-6 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-primary animate-pulse">
                    <Search size={40} />
                  </div>
                  <div>
                    <h3 className="text-3xl space-font font-black uppercase tracking-tighter">Koi product nahi mila</h3>
                    <p className="text-gray-500 mt-2">Try searching something else or reset filters.</p>
                  </div>
                  <button 
                    onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedBrand("All"); }}
                    className="px-8 py-3 glass-card bg-primary text-white font-bold rounded-xl hover:scale-105 transition-all text-xs uppercase tracking-widest"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-16 text-center">
            <button className="px-12 py-4 glass-card font-bold border-white/10 hover:border-accent/50 transition-all hover:scale-105 active:scale-95">
              View All Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* --- Why Choose Us --- */}
      <section className="px-6 py-20 relative z-10 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="MobilePartsPK Trust" 
            subtitle="Why thousands of repair shops in Karachi choose us every single day." 
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "100% Original", detail: "Genuine parts direct from supply chain. No clones.", icon: <Award className="text-primary" /> },
              { title: "Fast Delivery", detail: "Same day in Karachi, 2-3 days nationwide delivery.", icon: <Truck className="text-accent" /> },
              { title: "Wholesale Rates", detail: "Premium parts at the best market prices guaranteed.", icon: <Zap className="text-secondary" /> },
              { title: "7-Day Return", detail: "No questions asked checking warranty for parts.", icon: <RotateCcw className="text-primary" /> },
              { title: "Expert Support", detail: "Technical help for repair shop owners & technicians.", icon: <MessageCircle className="text-accent" /> },
              { title: "Secure Payment", detail: "Ease-paisa, JazzCash, Bank Transfer & COD.", icon: <ShieldCheck className="text-secondary" /> },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 5 }}
                className="flex items-start gap-4 p-4 glass-card border-transparent hover:border-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 neon-border">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-lg space-font font-bold mb-1">{feature.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Wholesale Section --- */}
      <section id="wholesale" className="px-6 py-20 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card p-12 md:p-20 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12 bg-gradient-to-br from-white/10 to-transparent border-white/10">
            <div className="absolute -left-24 top-0 w-96 h-96 bg-primary/20 blur-[150px] -z-10" />
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl space-font font-bold mb-6 italic leading-tight">
                <span className="neon-text">Shop chala rahay ho?</span>
              </h2>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                Saddar types wholesale prices ab ghar bethay mobile screen par. Exclusive rates unlock karain aur business grow karain.
              </p>
              <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/20">
                Apply as Dealer Now
              </button>
            </div>
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-primary/20 rounded-full blur-[100px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <img 
                src="https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=400" 
                alt="Dealer" 
                className="rounded-3xl w-72 h-72 object-cover relative z-10 border border-white/10 shadow-2xl rotate-3"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Satisfied Technicians" 
            subtitle="Join thousands of happy customers from all over Pakistan." 
          />
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x no-scrollbar">
            {[
              { name: "Aijaz Ahmed", city: "Karachi", text: "Original LCD mil gayi, touch response ek dum sleek hai. 10/10 service." },
              { name: "Usman Khan", city: "Lahore", text: "Wholesale rates bohot hi zabardast hain. Saddar jane ki zaroorat nahi." },
              { name: "Sara Malik", city: "Islamabad", text: "My iPhone battery is now working like new. Premium quality parts indeed." },
              { name: "Bilal Sheikh", city: "Faisalabad", text: "Karachi se mangwaya tha, packaging bohot hi secure thi. Wah yar!" },
              { name: "Hamza Qureshi", city: "Pindi", text: "Fastest delivery for mobile parts. Highly satisfied technicians here." },
            ].map((review, i) => (
              <motion.div
                key={i}
                className="glass-card p-8 rounded-[2rem] min-w-[300px] md:min-w-[400px] snap-center border-white/5 bg-white/[0.02]"
              >
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(j => <Award key={j} size={14} className="text-accent" />)}
                </div>
                <p className="text-gray-300 italic mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary">
                    {review.name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-sm tracking-tight">{review.name}</h5>
                    <p className="text-[10px] text-accent/60 uppercase tracking-widest font-black">{review.city}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Contact --- */}
      <section id="contact" className="px-6 py-20 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-5xl space-font font-bold mb-8 neon-text">Get <span className="italic">In Touch</span></h2>
              <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
                Questions or Bulk Orders? Karachi's tech experts are here to help your repair business grow.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 neon-border">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-black">Experience Center</p>
                    <p className="text-lg font-bold group-hover:text-primary transition-colors">Saddar, Karachi, Pakistan</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
                    <PhoneCall size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-black">Helpline</p>
                    <p className="text-lg font-bold group-hover:text-accent transition-colors">+92 300 0000000</p>
                  </div>
                </div>
              </div>
            </div>

            <GlassCard className="p-10 border-white/5 bg-white/[0.01]">
              {formSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center border border-green-500/30">
                    <ShieldCheck size={40} />
                  </div>
                  <div>
                    <h3 className="text-2xl space-font font-black uppercase tracking-tighter">Shukriya!</h3>
                    <p className="text-gray-400">Apka message mil gaya hai. Ham jald hi rabta karain ge.</p>
                  </div>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleFormSubmit}>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-500">Full Name</label>
                    <input 
                      type="text" 
                      value={formState.name}
                      onChange={e => setFormState(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full bg-white/5 border rounded-xl px-4 py-4 focus:border-accent outline-none transition-all ${formErrors.name ? "border-red-500/50 bg-red-500/5" : "border-white/10"}`} 
                      placeholder="Apka Naam" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-500">Phone</label>
                    <input 
                      type="tel" 
                      value={formState.phone}
                      onChange={e => setFormState(prev => ({ ...prev, phone: e.target.value }))}
                      className={`w-full bg-white/5 border rounded-xl px-4 py-4 focus:border-accent outline-none transition-all ${formErrors.phone ? "border-red-500/50 bg-red-500/5" : "border-white/10"}`} 
                      placeholder="Mobile Number" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-500">Message</label>
                    <textarea 
                      rows={3} 
                      value={formState.message}
                      onChange={e => setFormState(prev => ({ ...prev, message: e.target.value }))}
                      className={`w-full bg-white/5 border rounded-xl px-4 py-4 focus:border-accent outline-none transition-all ${formErrors.message ? "border-red-500/50 bg-red-500/5" : "border-white/10"}`} 
                      placeholder="Parts ki quotation chahiye?"
                    ></textarea>
                  </div>
                  <button type="submit" className="w-full py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-500/30">
                    <MessageCircle size={24} /> Submit Request
                  </button>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="px-6 py-20 border-t border-white/5 bg-black/40 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center space-font font-bold text-xl neon-border">
                  MP
                </div>
                <span className="space-font font-bold text-2xl tracking-tighter">
                  MobileParts<span className="text-accent">PK</span>
                </span>
              </div>
              <p className="text-gray-500 max-w-xs leading-relaxed text-sm">
                Pakistan's premium marketplace for original mobile repairing parts and accessories. Leading tech supply chain in Karachi.
              </p>
            </div>
            
            <div>
              <h5 className="font-bold mb-6 uppercase tracking-widest text-xs text-primary">Parts Marketplace</h5>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">Replacement LCDs</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Original Batteries</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Main Boards</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Camera Modules</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 uppercase tracking-widest text-xs text-accent">Tech Accessories</h5>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">GaN Fast Chargers</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Airpods Pro ANC</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Power Banks 20K</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Gaming Triggers</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 uppercase tracking-widest text-xs text-secondary">Support</h5>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-accent transition-colors">Wholesale Portal</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Tracking Order</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Return Policy</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">WhatsApp Help</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">© 2024 MobilePartsPK. Karachi, Pakistan. Premium Supply Chain.</p>
            <div className="flex items-center gap-4">
              {['EasyPaisa', 'JazzCash', 'COD', 'Bank'].map(item => (
                <span key={item} className="text-[8px] font-black uppercase tracking-widest text-gray-600 bg-white/5 px-3 py-1 rounded-md border border-white/5">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
