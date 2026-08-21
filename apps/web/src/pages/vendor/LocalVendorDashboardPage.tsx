import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../context/LanguageContext';
import api from '../../api/client';
import { Offering, Order, Vendor } from '../../types';
import { ShoppingBag, PlusCircle, Edit3, PhoneCall, CheckCircle, Clock, AlertTriangle, Package, DollarSign, Store, Tag } from 'lucide-react';

export const LocalVendorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // Add Product State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(500);
  const [category, setCategory] = useState('Handicraft');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80');

  // Edit Profile State
  const [editBusinessName, setEditBusinessName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');

  useEffect(() => {
    async function loadVendorData() {
      try {
        const [profRes, offRes, ordRes] = await Promise.all([
          api.get('/vendors/me'),
          api.get('/vendors/me/offerings'),
          api.get('/vendors/me/orders')
        ]);

        if (profRes.data.success) {
          setVendor(profRes.data.data);
          setEditBusinessName(profRes.data.data.businessName || '');
          setEditPhone(profRes.data.data.phone || '');
          setEditAddress(profRes.data.data.address || '');
          setEditCity(profRes.data.data.city || '');
        }
        if (offRes.data.success) setOfferings(offRes.data.data);
        if (ordRes.data.success) setOrders(ordRes.data.data);
      } catch (err) {
        console.error('Error loading local vendor data:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user && user.role === 'VENDOR') loadVendorData();
  }, [user]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/vendors/me/offerings', {
        title,
        description,
        category,
        price,
        duration: 'Product',
        maxGuests: 1,
        location: vendor?.city || 'Bihar',
        coverImage,
        isActive: true
      });

      if (res.data.success) {
        showToast('New product added to your catalog!', 'success');
        setOfferings([res.data.data, ...offerings]);
        setShowAddProductModal(false);
        setTitle('');
        setDescription('');
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to add product', 'error');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/vendors/me', {
        businessName: editBusinessName,
        phone: editPhone,
        address: editAddress,
        city: editCity
      });

      if (res.data.success) {
        showToast('Profile updated successfully!', 'success');
        setVendor(res.data.data);
        setShowEditProfileModal(false);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update profile', 'error');
    }
  };

  if (!user || user.role !== 'VENDOR') {
    return (
      <div className="pt-32 pb-24 text-center space-y-4">
        <h2 className="text-3xl font-serif text-brand-black">Vendor Access Required</h2>
        <p className="text-sm font-serif text-brand-brown">Please log in as a local vendor to access this simple dashboard.</p>
      </div>
    );
  }

  const totalSales = orders
    .filter(o => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="pt-28 pb-24 px-4 sm:px-8 max-w-6xl mx-auto my-6 bg-cream/85 backdrop-blur-sm rounded-2xl border border-brand-brown/15 p-6 sm:p-10 shadow-lg space-y-8">
      {/* High Visibility Vendor Banner */}
      <div className="bg-amber-900 text-cream p-6 sm:p-8 rounded-xl shadow-lg border-2 border-brand-gold flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-gold text-brand-black flex items-center justify-center font-bold text-3xl shadow-inner flex-shrink-0">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-3 flex-wrap gap-y-1">
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide">
                {vendor?.businessName || user.name}
              </h1>
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                vendor?.status === 'APPROVED'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-400 text-amber-950'
              }`}>
                {vendor?.status === 'APPROVED'
                  ? t('localVendor.approvedStatus', '✓ APPROVED VENDOR')
                  : t('localVendor.pendingStatus', '⌛ PENDING APPROVAL')}
              </span>
            </div>
            <p className="text-sm font-sans text-brand-gold/90 font-medium">
              Category: {vendor?.businessType || 'Local Crafts & Goods'} &bull; Location: {vendor?.city || 'Bihar'}, {vendor?.district || ''}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowEditProfileModal(true)}
          className="w-full md:w-auto px-5 py-3 bg-brand-gold text-brand-black hover:bg-yellow-400 font-bold rounded-lg text-sm flex items-center justify-center space-x-2 transition-all shadow"
        >
          <Edit3 className="w-5 h-5" />
          <span>{t('localVendor.editProfile', 'EDIT BUSINESS PROFILE').toUpperCase()}</span>
        </button>
      </div>

      {vendor?.status === 'PENDING' && (
        <div className="bg-amber-100 border-2 border-amber-400 p-5 rounded-lg text-amber-950 text-sm font-sans flex items-center space-x-4">
          <AlertTriangle className="w-8 h-8 text-amber-700 flex-shrink-0" />
          <div>
            <p className="font-bold text-base">Your listing is being reviewed by the SETU team.</p>
            <p className="text-xs text-amber-900 mt-0.5">You can add your products now so customers can buy them as soon as you are approved!</p>
          </div>
        </div>
      )}

      {/* Large Action Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => setShowAddProductModal(true)}
          className="p-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md flex items-center space-x-5 transition-all text-left group border-2 border-emerald-500"
        >
          <div className="p-4 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
            <PlusCircle className="w-10 h-10 text-white" />
          </div>
          <div>
            <span className="block text-xl font-bold font-serif">{t('localVendor.addProduct', 'ADD NEW PRODUCT').toUpperCase()}</span>
            <span className="text-xs opacity-90 font-sans">List Madhubani art, Makhana, Silk, or local items</span>
          </div>
        </button>

        <a
          href="tel:18003456789"
          className="p-6 bg-brand-maroon hover:bg-red-950 text-white rounded-xl shadow-md flex items-center space-x-5 transition-all text-left group border-2 border-red-700"
        >
          <div className="p-4 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
            <PhoneCall className="w-10 h-10 text-brand-gold" />
          </div>
          <div>
            <span className="block text-xl font-bold font-serif">{t('localVendor.callHelpline', 'CALL SETU HELPLINE').toUpperCase()}</span>
            <span className="text-xs text-brand-gold font-sans">{t('localVendor.helplineDesc', 'Toll-Free Assistance: 1800-345-6789')}</span>
          </div>
        </a>
      </div>

      {/* Key Stats (Large Text) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border-2 border-brand-brown/15 shadow-sm text-center space-y-1">
          <span className="text-xs font-bold text-brand-brown uppercase tracking-wider">PRODUCTS LISTED</span>
          <p className="font-serif text-4xl font-extrabold text-brand-black">{offerings.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-brand-brown/15 shadow-sm text-center space-y-1">
          <span className="text-xs font-bold text-brand-brown uppercase tracking-wider">CUSTOMER ORDERS</span>
          <p className="font-serif text-4xl font-extrabold text-brand-maroon">{orders.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border-2 border-brand-brown/15 shadow-sm text-center space-y-1">
          <span className="text-xs font-bold text-brand-brown uppercase tracking-wider">TOTAL SALES</span>
          <p className="font-serif text-4xl font-extrabold text-emerald-700">₹{totalSales.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Products & Crafts Catalog */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border-2 border-brand-brown/15 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-brand-brown/10 pb-4">
          <h2 className="text-2xl font-serif font-bold text-brand-black flex items-center space-x-2">
            <Tag className="w-6 h-6 text-brand-maroon" />
            <span>YOUR PRODUCTS CATALOG</span>
          </h2>
          <span className="text-sm font-bold text-brand-maroon">{offerings.length} Product(s)</span>
        </div>

        {offerings.length === 0 ? (
          <div className="text-center py-10 space-y-4">
            <p className="text-base font-serif text-brand-brown">You have not added any products yet.</p>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-6 py-3 bg-emerald-700 text-white font-bold rounded-lg text-sm hover:bg-emerald-800"
            >
              + Add First Product Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offerings.map((product) => (
              <div key={product.id} className="border-2 border-brand-brown/15 rounded-xl overflow-hidden bg-cream-light p-4 space-y-3 shadow-sm">
                <img src={product.coverImage} alt={product.title} className="w-full h-44 object-cover rounded-lg" />
                <span className="text-xs font-bold text-brand-maroon uppercase tracking-wider block">{product.category}</span>
                <h3 className="font-serif text-xl font-bold text-brand-black">{product.title}</h3>
                <p className="text-xs font-sans text-brand-brown line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-brand-brown/10">
                  <span className="font-serif text-xl font-extrabold text-brand-black">₹{product.price}</span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded">Active</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Orders List */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border-2 border-brand-brown/15 space-y-6">
        <h2 className="text-2xl font-serif font-bold text-brand-black flex items-center space-x-2">
          <Package className="w-6 h-6 text-brand-maroon" />
          <span>RECENT CUSTOMER ORDERS</span>
        </h2>

        {orders.length === 0 ? (
          <p className="text-sm font-serif text-brand-brown/70 text-center py-6">No customer orders received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-brand-brown/15 text-xs font-bold text-brand-brown uppercase">
                  <th className="py-3 px-3">ORDER #</th>
                  <th className="py-3 px-3">BUYER NAME</th>
                  <th className="py-3 px-3">PRODUCT</th>
                  <th className="py-3 px-3">PRICE</th>
                  <th className="py-3 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-brown/10">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream-light">
                    <td className="py-4 px-3 font-mono font-bold text-brand-maroon text-sm">{ord.orderNumber}</td>
                    <td className="py-4 px-3 font-bold text-brand-black">{ord.user?.name || 'Customer'}</td>
                    <td className="py-4 px-3 font-serif font-semibold">{ord.offering?.title}</td>
                    <td className="py-4 px-3 font-bold text-base">₹{ord.amount}</td>
                    <td className="py-4 px-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        ord.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Product / Craft */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border-4 border-emerald-600">
            <h3 className="font-serif text-2xl font-bold text-brand-black">Add New Product or Craft</h3>

            <form onSubmit={handleAddProduct} className="space-y-4 text-sm font-sans">
              <div>
                <label className="block font-bold text-brand-black mb-1">PRODUCT / CRAFT TITLE</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Handwoven Silk Saree or Madhubani Painting"
                  className="w-full border-2 border-brand-brown/30 p-3 rounded-lg text-base"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-black mb-1">SHORT DESCRIPTION</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your craft, materials used, etc."
                  className="w-full border-2 border-brand-brown/30 p-3 rounded-lg text-base"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-black mb-1">CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border-2 border-brand-brown/30 p-3 rounded-lg text-base font-bold bg-cream"
                >
                  <option value="Handicraft">Handicraft & Art</option>
                  <option value="Silk & Handloom">Silk & Handloom</option>
                  <option value="Gourmet Food">Gourmet Food (Makhana, Sattu, Sweets)</option>
                  <option value="Local Products">Local Souvenirs & Goods</option>
                  <option value="Transport">Local Transport & Taxi</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-brand-black mb-1">PRICE (INR ₹)</label>
                <input
                  type="number"
                  required
                  min={10}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full border-2 border-brand-brown/30 p-3 rounded-lg text-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-black mb-1">PHOTO URL</label>
                <input
                  type="url"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full border-2 border-brand-brown/30 p-3 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-5 py-3 border-2 border-gray-400 font-bold rounded-lg text-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-sm"
                >
                  SAVE PRODUCT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Profile */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl space-y-6 border-4 border-brand-gold">
            <h3 className="font-serif text-2xl font-bold text-brand-black">Edit Business Details</h3>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-sm font-sans">
              <div>
                <label className="block font-bold text-brand-black mb-1">BUSINESS NAME</label>
                <input
                  type="text"
                  required
                  value={editBusinessName}
                  onChange={(e) => setEditBusinessName(e.target.value)}
                  className="w-full border-2 border-brand-brown/30 p-3 rounded-lg text-base"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-black mb-1">PHONE NUMBER</label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full border-2 border-brand-brown/30 p-3 rounded-lg text-base"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-black mb-1">ADDRESS / MARKET</label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full border-2 border-brand-brown/30 p-3 rounded-lg text-base"
                />
              </div>

              <div>
                <label className="block font-bold text-brand-black mb-1">CITY / DISTRICT</label>
                <input
                  type="text"
                  required
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full border-2 border-brand-brown/30 p-3 rounded-lg text-base"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-5 py-3 border-2 border-gray-400 font-bold rounded-lg text-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-black text-brand-gold font-bold rounded-lg text-sm hover:bg-brand-maroon hover:text-white"
                >
                  UPDATE INFO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
