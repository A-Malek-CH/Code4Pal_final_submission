// src/pages/Donations.jsx

import { useState, useEffect, useContext } from 'react';

import client from '../apiServices/api.js';

import AuthContext from "../context/AuthContext";

import SidebarComponent from "../components/SidebarComponent.jsx";



const Donations = () => {

  const [donations, setDonations] = useState([]);

  const [filteredDonations, setFilteredDonations] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState('all');

  const [stats, setStats] = useState({

    total: 0,

    pending: 0,

    completed: 0

  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);



  // Get user data from your auth context

  const { user } = useContext(AuthContext);



  useEffect(() => {

    if (user && user.id) {

      fetchDonations();

      fetchStats();

    } else {

      setLoading(false);

    }

  }, [user]);



  useEffect(() => {

    filterDonations();

  }, [donations, selectedFilter]);



  const fetchDonations = async () => {

    try {

      setLoading(true);



      // Since users can be both buyers and sellers, we need to fetch both

      const endpoints = [

        `/api/donations/buyer/${user.id}`,

        `/api/donations/seller/${user.id}`

      ];



      console.log("Fetching donations from:", endpoints);

      const responses = await Promise.all(

          endpoints.map(endpoint => client.get(endpoint))

      );



      // Combine results from both endpoints

      const allDonations = responses.flatMap(response =>

          Array.isArray(response.data) ? response.data : []

      );



      setDonations(allDonations);

      console.log("all donations: ", JSON.stringify(allDonations, null, 2));

    } catch (err) {

      console.error("Error fetching donations:", err);

      setError('Failed to fetch donations. Please try again later.');



      // Set mock data for development

      setDonations([

        {

          id: 1,

          amount: 25.00,

          status: 'COMPLETED',

          donationDate: '2023-05-15T10:30:00',

          order: { id: 101 },

          charityName: 'Gaza Relief Fund'

        },

        {

          id: 2,

          amount: 12.50,

          status: 'COMPLETED',

          donationDate: '2023-05-15T10:30:00',

          order: { id: 101 },

          charityName: 'Medical Aid Palestine'

        },

        {

          id: 3,

          amount: 24.10,

          status: 'COMPLETED',

          donationDate: '2023-05-16T14:22:00',

          order: { id: 102 },

          charityName: 'Gaza Relief Fund'

        },

        {

          id: 4,

          amount: 15.00,

          status: 'PENDING',

          donationDate: '2023-05-17T09:15:00',

          order: { id: 103 },

          charityName: 'Children of Gaza'

        },

        {

          id: 5,

          amount: 60.00,

          status: 'PENDING',

          donationDate: '2023-05-18T16:45:00',

          order: { id: 104 },

          charityName: 'Gaza Relief Fund'

        }

      ]);

    } finally {

      setLoading(false);

    }

  };



  const fetchStats = async () => {

    try {

      // Fetch stats for both buyer and seller roles

      const [buyerTotalRes, sellerTotalRes, pendingRes] = await Promise.all([

        client.get(`/api/donations/total/buyer/${user.id}`),

        client.get(`/api/donations/total/seller/${user.id}`),

        client.get('/api/donations/total/pending')

      ]);



      // Combine buyer and seller totals

      const total = parseFloat(buyerTotalRes.data) + parseFloat(sellerTotalRes.data);



      setStats({

        total: total,

        pending: pendingRes.data,

        completed: total - pendingRes.data

      });

    } catch (err) {

      console.error("Error fetching stats:", err);

      // Set mock stats for development

      setStats({

        total: 136.60,

        pending: 75.00,

        completed: 61.60

      });

    }

  };



  const filterDonations = () => {

    if (!Array.isArray(donations)) {

      setFilteredDonations([]);

      return;

    }



    if (selectedFilter === 'all') {

      setFilteredDonations(donations);

    } else {

      setFilteredDonations(donations.filter(d => d.status === selectedFilter.toUpperCase()));

    }

  };



  const handleFilterChange = (filter) => {

    setSelectedFilter(filter);

  };



  const markAsTransferred = async (donationId) => {

    try {

      await client.patch(`/api/donations/${donationId}/transfer`);

      // Refresh donations list

      fetchDonations();

      fetchStats();

    } catch (err) {

      setError('Failed to update donation: ' + (err.response?.data?.message || err.message));

    }

  };



  const formatCurrency = (amount) => {

    if (typeof amount !== 'number') {

      amount = parseFloat(amount) || 0;

    }

    return new Intl.NumberFormat('ar-DZ', {

      style: 'currency',

      currency: 'DZD'

    }).format(amount);

  };



  const formatDate = (dateString) => {

    try {

      return new Date(dateString).toLocaleDateString('ar-DZ');

    } catch (e) {

      return 'تاريخ غير معروف';

    }

  };



  const getStatusBadgeClass = (status) => {

    switch (status) {

      case 'COMPLETED':

        return 'bg-green-100 text-green-800';

      case 'PENDING':

        return 'bg-yellow-100 text-yellow-800';

      case 'FAILED':

        return 'bg-red-100 text-red-800';

      default:

        return 'bg-gray-100 text-gray-800';

    }

  };



  const translateStatus = (status) => {

    switch (status) {

      case 'COMPLETED':

        return 'مكتمل';

      case 'PENDING':

        return 'قيد الانتظار';

      case 'FAILED':

        return 'فاشل';

      default:

        return status;

    }

  };



  if (loading) {

    return (

        <div className="min-h-screen bg-gray-50 flex" dir="rtl">

          <SidebarComponent />

          <div className="flex-1 mr-64 p-8 flex justify-center items-center">

            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>

          </div>

        </div>

    );

  }



  return (

      <div className="min-h-screen bg-gray-50 flex w-screen" dir="rtl">

        <SidebarComponent />



        {/* Main Content */}

        <main className="flex-1 mr-64 p-8">

          {error && (

              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">

                <strong className="font-bold">خطأ! </strong>

                <span className="block sm:inline">{error}</span>

                <button onClick={() => setError(null)} className="absolute top-0 bottom-0 right-0 px-4 py-3">

                  <span className="text-2xl">&times;</span>

                </button>

              </div>

          )}



          <div className="text-center mb-12">

            <h1 className="text-3xl font-bold text-gray-800 mb-4">تبرعاتي</h1>

            <p className="text-gray-600 max-w-2xl mx-auto">

              تتبع تبرعاتك وتأثيرها في دعم أهالي غزة. كل تبرع يساهم في صنع فرق حقيقي.

            </p>

          </div>



          {/* Stats Cards */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white rounded-lg shadow-md p-6 text-center">

              <div className="text-2xl font-bold text-brand mb-2">{formatCurrency(stats.total)}</div>

              <div className="text-gray-600">إجمالي التبرعات</div>

            </div>



            <div className="bg-white rounded-lg shadow-md p-6 text-center">

              <div className="text-2xl font-bold text-yellow-600 mb-2">{formatCurrency(stats.pending)}</div>

              <div className="text-gray-600">تبرعات قيد الانتظار</div>

            </div>



            <div className="bg-white rounded-lg shadow-md p-6 text-center">

              <div className="text-2xl font-bold text-blue-600 mb-2">{formatCurrency(stats.completed)}</div>

              <div className="text-gray-600">تبرعات مكتملة</div>

            </div>

          </div>



          {/* Filters */}

          <div className="bg-white rounded-lg shadow-md p-4 mb-6">

            <div className="flex flex-wrap gap-2">

              <button

                  className={`px-4 py-2 rounded-full ${selectedFilter === 'all' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}

                  onClick={() => handleFilterChange('all')}

              >

                الكل

              </button>

              <button

                  className={`px-4 py-2 rounded-full ${selectedFilter === 'completed' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}

                  onClick={() => handleFilterChange('completed')}

              >

                مكتمل

              </button>

              <button

                  className={`px-4 py-2 rounded-full ${selectedFilter === 'pending' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}

                  onClick={() => handleFilterChange('pending')}

              >

                قيد الانتظار

              </button>

              <button

                  className={`px-4 py-2 rounded-full ${selectedFilter === 'failed' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}

                  onClick={() => handleFilterChange('failed')}

              >

                فاشل

              </button>

            </div>

          </div>



          {/* Donations Table */}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">

            <div className="overflow-x-auto">

              <table className="min-w-full divide-y divide-gray-200">

                <thead className="bg-gray-50">

                <tr>

                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">

                    رقم التبرع

                  </th>

                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">

                    التاريخ

                  </th>

                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">

                    المبلغ

                  </th>

                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">

                    الحالة

                  </th>

                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">

                    رقم الطلب

                  </th>

                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">

                    الجهة المستفيدة

                  </th>

                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">

                    الإجراءات

                  </th>

                </tr>

                </thead>

                <tbody className="bg-white divide-y divide-gray-200">

                {Array.isArray(filteredDonations) && filteredDonations.length > 0 ? (

                    filteredDonations.map((donation) => (

                        <tr key={donation.id}>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">

                            #{donation.id}

                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                            {formatDate(donation.donationDate || donation.createdAt)}

                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                            {formatCurrency(donation.amount)}

                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">

                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(donation.status)}`}>

                          {translateStatus(donation.status)}

                        </span>

                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                            #{donation.order?.id || 'N/A'}

                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">

                            {donation.charityName || 'غير محدد'}

                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                            {donation.status === 'PENDING' && (

                                <button

                                    className="text-blue-600 hover:text-blue-900"

                                    onClick={() => markAsTransferred(donation.id)}

                                >

                                  تحويل

                                </button>

                            )}

                          </td>

                        </tr>

                    ))

                ) : (

                    <tr>

                      <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">

                        لا توجد تبرعات لعرضها

                      </td>

                    </tr>

                )}

                </tbody>

              </table>

            </div>

          </div>



          {/* Impact Section */}

          <div className="bg-gradient-to-r from-gray-900 to-green-700 rounded-lg shadow-md p-8 mt-12 text-white text-center">

            <h2 className="text-2xl font-bold mb-4">تأثير تبرعاتك</h2>

            <p className="mb-6">

              بفضل تبرعاتك السخية، استطعنا تقديم المساعدة للعديد من العائلات في غزة.

            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <div>

                <div className="text-2xl font-bold">500+</div>

                <div className="text-sm">عائلة مستفيدة</div>

              </div>

              <div>

                <div className="text-2xl font-bold">1,200+</div>

                <div className="text-sm">وجبة طعام</div>

              </div>

              <div>

                <div className="text-2xl font-bold">350+</div>

                <div className="text-sm">طفل يحصلون على التعليم</div>

              </div>

              <div>

                <div className="text-2xl font-bold">250+</div>

                <div className="text-sm">حالة طبية تم علاجها</div>

              </div>

            </div>

          </div>

        </main>

      </div>

  );

};



export default Donations;