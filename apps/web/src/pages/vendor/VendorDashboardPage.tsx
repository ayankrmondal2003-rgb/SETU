import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';
import { Offering, Order, Vendor } from '../../types';
import { Store, DollarSign, Package, CheckCircle2, Clock, AlertTriangle, Plus, Edit2, Trash2 } from 'lucide-react';

export const VendorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // New Offering Modal State
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Guided Tour');
  const [price, setPrice] = useState<number>(1500);
  const [duration, setDuration] = useState('4 Hours');
  const [maxGuests, setMaxGuests] = useState<number>(10);
  const [location, setLocation] = useState('Bodh Gaya');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80');

  useEffect(() => {
    async function loadVendorData() {
      try {
        const [profRes, offRes, ordRes] = await Promise.all([
          api.get('/vendors/me'),
          api.get('/vendors/me/offerings'),
          api.get('/vendors/me/orders')
        ]);

        if (profRes.data.success) setVendor(profRes.data.data);
        if (offRes.data.success) setOfferings(offRes.data.data);
        if (ordRes.data.success) setOrders(ordRes.data.data);
      } catch (err) {
        console.error('Error loading vendor dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    if (user && user.role === 'VENDOR') loadVendorData();
  }, [user]);

  const handleCreateOffering = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/vendors/me/offerings', {
        title,
        description,
        category,
        price,
        duration,
        maxGuests,
        location,
        coverImage,
        isActive: true
      });

      if (res.data.success) {
        showToast('New offering created successfully!', 'success');
        setOfferings([res.data.data, ...offerings]);
        setShowModal(false);
        // Reset
        setTitle('');
        setDescription('');
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to create offering', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await api.patch(`/vendors/me/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus as any } : o));
      }
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  if (!user || user.role !== 'VENDOR') {
    return (
      <div className="pt-32 pb-24 text-center space-y-4">
        <h2 className="text-3xl font-serif text-brand-black">Vendor Access Required</h2>
        <p className="text-sm font-serif text-brand-brown">You must be logged in as a Vendor to view this dashboard.</p>
      </div>
    );
  }

  const paidOrders = orders.filter(o => o.paymentStatus === 'PAID');
  const grossSales = paidOrders.reduce((sum, o) => sum + o.amount, 0);
  const setuCommission = paidOrders.reduce((sum, o) => sum + (o.commissionAmount || 0), 0);
  const netEarnings = paidOrders.reduce((sum, o) => sum + (o.vendorEarnings || 0), 0);

  return (
    <div className="pt-28 pb-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto my-6 bg-cream/85 backdrop-blur-sm rounded-2xl border border-brand-brown/15 p-4 sm:p-6 md:p-10 shadow-lg space-y-8">
      {/* Vendor Profile & Status Alert */}
      <div className="bg-cream p-4 sm:p-8 rounded border border-brand-brown/15 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-5 text-center sm:text-left gap-3">
          <div className="w-16 h-16 rounded-full bg-brand-maroon text-white flex items-center justify-center font-serif text-2xl font-bold border-2 border-brand-gold shrink-0">
            <Store className="w-8 h-8 text-brand-gold" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-serif text-brand-black">{vendor?.businessName || user.name}</h1>
              <span className={`text-[10px] sub-nav-label px-2.5 py-0.5 rounded ${
                vendor?.status === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                STATUS: {vendor?.status || 'PENDING'}
              </span>
            </div>
            <p className="text-xs font-sans text-brand-brown/80 mt-1">
              Business Type: {vendor?.businessType || 'Tour Operator'} &bull; {vendor?.city}, {vendor?.district}
            </p>
          </div>
        </div>

        {vendor?.status === 'APPROVED' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 text-xs sub-nav-label px-5 py-3 bg-brand-black text-brand-gold rounded hover:bg-brand-maroon hover:text-white transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW OFFERING</span>
          </button>
        )}
      </div>

      {vendor?.status === 'PENDING' && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded text-amber-900 text-xs font-sans flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>Your vendor account is pending admin approval. You can prepare offering details, but active publication is restricted until approved.</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded border border-brand-brown/15 shadow-sm space-y-2">
          <span className="text-[10px] sub-nav-label text-brand-brown/70">GROSS SALES</span>
          <p className="font-serif text-3xl font-bold text-brand-black">₹{grossSales.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white p-6 rounded border border-brand-brown/15 shadow-sm space-y-2">
          <span className="text-[10px] sub-nav-label text-brand-brown/70">SETU COMMISSION (7%)</span>
          <p className="font-serif text-3xl font-bold text-brand-maroon">₹{setuCommission.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white p-6 rounded border border-brand-brown/15 shadow-sm space-y-2">
          <span className="text-[10px] sub-nav-label text-brand-brown/70">NET EARNINGS</span>
          <p className="font-serif text-3xl font-bold text-emerald-700">₹{netEarnings.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white p-6 rounded border border-brand-brown/15 shadow-sm space-y-2">
          <span className="text-[10px] sub-nav-label text-brand-brown/70">TOTAL ORDERS</span>
          <p className="font-serif text-3xl font-bold text-brand-black">{orders.length}</p>
        </div>

        <div className="bg-white p-6 rounded border border-brand-brown/15 shadow-sm space-y-2">
          <span className="text-[10px] sub-nav-label text-brand-brown/70">ACTIVE OFFERINGS</span>
          <p className="font-serif text-3xl font-bold text-brand-black">{offerings.length}</p>
        </div>

        <div className="bg-white p-6 rounded border border-brand-brown/15 shadow-sm space-y-2">
          <span className="text-[10px] sub-nav-label text-brand-brown/70">PENDING BOOKINGS</span>
          <p className="font-serif text-3xl font-bold text-brand-maroon">
            {orders.filter(o => o.orderStatus === 'PENDING').length}
          </p>
        </div>
      </div>

      {/* Offerings Section */}
      <div className="bg-white p-8 rounded border border-brand-brown/15 space-y-6">
        <div className="flex items-center justify-between border-b border-brand-brown/15 pb-4">
          <h3 className="sub-nav-label text-brand-maroon">YOUR TOURISM OFFERINGS</h3>
          <span className="text-xs font-sans text-brand-brown">{offerings.length} Active Listing(s)</span>
        </div>

        {offerings.length === 0 ? (
          <p className="text-sm font-serif text-brand-brown/70 text-center py-6">No offerings published yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offerings.map((off) => (
              <div key={off.id} className="border border-brand-brown/15 rounded overflow-hidden p-4 space-y-3 bg-cream-light">
                <img src={off.coverImage} alt={off.title} className="w-full h-36 object-cover rounded" />
                <span className="text-[10px] sub-nav-label text-brand-maroon uppercase block">{off.category}</span>
                <h4 className="font-serif text-lg text-brand-black font-semibold">{off.title}</h4>
                <div className="flex items-center justify-between pt-2 border-t border-brand-brown/10">
                  <span className="font-serif text-base font-bold text-brand-black">₹{off.price}</span>
                  <span className="text-xs font-sans text-brand-brown">{off.duration}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vendor Orders Section */}
      <div className="bg-white p-8 rounded border border-brand-brown/15 space-y-6">
        <h3 className="sub-nav-label text-brand-maroon">BOOKING ORDERS RECEIVED</h3>

        {orders.length === 0 ? (
          <p className="text-sm font-serif text-brand-brown/70 text-center py-6">No orders received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm border-collapse">
              <thead>
                <tr className="border-b border-brand-brown/15 text-[11px] sub-nav-label text-brand-brown">
                  <th className="py-3 px-2">ORDER #</th>
                  <th className="py-3 px-2">CUSTOMER</th>
                  <th className="py-3 px-2">OFFERING</th>
                  <th className="py-3 px-2">BOOKING DATE</th>
                  <th className="py-3 px-2">AMOUNT</th>
                  <th className="py-3 px-2">PAYMENT</th>
                  <th className="py-3 px-2">STATUS ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-brown/10">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-cream-light">
                    <td className="py-4 px-2 font-mono text-xs font-bold text-brand-maroon">{order.orderNumber}</td>
                    <td className="py-4 px-2 font-semibold text-brand-black">{order.user?.name || 'Tourist'}</td>
                    <td className="py-4 px-2 font-serif">{order.offering?.title}</td>
                    <td className="py-4 px-2 text-xs">{new Date(order.bookingDate).toLocaleDateString()}</td>
                    <td className="py-4 px-2 font-semibold">₹{order.amount}</td>
                    <td className="py-4 px-2">
                      <span className={`text-[10px] sub-nav-label px-2 py-0.5 rounded ${
                        order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-cream border border-brand-brown/20 text-xs p-1.5 rounded focus:outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Creating New Offering */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-8 rounded shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-2xl text-brand-black">Create Tourism Offering</h3>

            <form onSubmit={handleCreateOffering} className="space-y-4 font-sans text-xs">
              <div>
                <label className="block sub-nav-label mb-1">TITLE</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Nalanda Monastic Ruins Walking Tour" className="w-full bg-cream border p-2.5 rounded text-sm text-brand-black" />
              </div>

              <div>
                <label className="block sub-nav-label mb-1">DESCRIPTION</label>
                <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detailed description..." className="w-full bg-cream border p-2.5 rounded text-sm text-brand-black" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block sub-nav-label mb-1">CATEGORY</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-cream border p-2.5 rounded text-sm text-brand-black">
                    <option value="Guided Tour">Guided Tour</option>
                    <option value="Heritage Walk">Heritage Walk</option>
                    <option value="Cultural Experience">Cultural Experience</option>
                    <option value="Stay">Heritage Stay</option>
                  </select>
                </div>
                <div>
                  <label className="block sub-nav-label mb-1">PRICE (INR)</label>
                  <input type="number" required min={100} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full bg-cream border p-2.5 rounded text-sm text-brand-black" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block sub-nav-label mb-1">DURATION</label>
                  <input type="text" required value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 4 Hours" className="w-full bg-cream border p-2.5 rounded text-sm text-brand-black" />
                </div>
                <div>
                  <label className="block sub-nav-label mb-1">LOCATION</label>
                  <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Bodh Gaya" className="w-full bg-cream border p-2.5 rounded text-sm text-brand-black" />
                </div>
              </div>

              <div>
                <label className="block sub-nav-label mb-1">COVER IMAGE URL</label>
                <input type="url" required value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="w-full bg-cream border p-2.5 rounded text-sm text-brand-black" />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded sub-nav-label">CANCEL</button>
                <button type="submit" className="px-6 py-2 bg-brand-black text-brand-gold rounded sub-nav-label hover:bg-brand-maroon hover:text-white">CREATE OFFERING</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
