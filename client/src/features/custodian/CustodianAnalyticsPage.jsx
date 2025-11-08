import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import Litepicker from 'litepicker'; // Assuming litepicker is installed
import html2canvas from 'html2canvas'; // Assuming html2canvas is installed
import { jsPDF } from 'jspdf'; // Assuming jspdf is installed
import DashboardSidebar from '../dashboard/DashboardSidebar';
import '../../styles/modern-dashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut, Pie } from 'react-chartjs-2';
import { generatePredictions, getSeasonalTrends } from '../../utils/predictiveAnalytics';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const CustodianAnalyticsPage = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState('All Time');
  const pickerRef = useRef(null);
  const [predictions] = useState(generatePredictions());
  const [seasonalData] = useState(getSeasonalTrends());

  const custodianProfile = {
    fullName: 'John K.',
    course: 'Lead Custodian',
    profilePicture: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // State for stats (dummy data)
  const [stats, setStats] = useState({
    totalRevenue: 'UGX 25,400,000',
    totalRevenueChange: { value: '5.2%', type: 'positive' },
    avgOccupancy: '85%',
    avgOccupancyChange: { value: '1.5%', type: 'negative' },
    newBookings: '122',
    newBookingsChange: { value: '12%', type: 'positive' },
    maintenanceTickets: '3 Open',
    maintenanceTicketsChange: 'vs. 5 last month',
  });

  useEffect(() => {
    // Initialize Litepicker
    pickerRef.current = new Litepicker({
      element: document.getElementById('dateRangePicker'),
      singleMode: false,
      format: 'DD MMM, YYYY',
      setup: (picker) => {
        picker.on('selected', (date1, date2) => {
          if (date1 && date2) {
            setDateRange(`${date1.toDateString()} - ${date2.toDateString()}`);
          }
        });
      }
    });

    return () => {
      if (pickerRef.current) pickerRef.current.destroy();
    };
  }, []);

  // Chart.js Configuration
  const chartTextColor = '#64748b';
  const chartGridColor = '#f1f5f9';
  const chartTitleColor = '#1e293b';

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: chartTextColor } },
      title: { display: true, color: chartTitleColor, font: { size: 16, weight: '600' } }
    }
  };

  const revenueChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ label: 'Monthly Revenue (UGX Millions)', data: [18.5, 19.1, 20.8, 21.5, 24.2, 25.0, 25.4], borderColor: 'var(--primary-color)', backgroundColor: 'rgba(0, 191, 255, 0.1)', tension: 0.4, fill: true }]
  };

  const occupancyChartData = {
    labels: ['Occupied', 'Available', 'Maintenance'],
    datasets: [{ label: 'Room Status', data: [185, 38, 5], backgroundColor: ['#10B981', '#3B82F6', '#EF4444'], borderColor: '#fff', borderWidth: 4 }]
  };

  const genderChartData = {
    labels: ['Female', 'Male'],
    datasets: [{ label: 'Gender Distribution', data: [120, 65], backgroundColor: ['#f472b6', '#60a5fa'], borderColor: '#fff', borderWidth: 4 }]
  };

  const paymentMethodChartData = {
    labels: ['Mobile Money', 'Bank Transfer', 'Credit Card'],
    datasets: [{ label: 'Revenue by Payment Method', data: [15.2, 8.1, 2.1], backgroundColor: ['#34d399', '#fbbf24', '#9ca3af'], borderColor: '#fff', borderWidth: 4 }]
  };

  const applyDateRange = () => {
    // Simulate fetching new data based on date range
    // In a real app, this would trigger an API call
    setStats({
      totalRevenue: `UGX ${(Math.random() * 10 + 20).toFixed(3)}M`,
      totalRevenueChange: { value: `${(Math.random() * 5).toFixed(1)}%`, type: Math.random() > 0.5 ? 'positive' : 'negative' },
      avgOccupancy: `${(Math.random() * 15 + 75).toFixed(1)}%`,
      avgOccupancyChange: { value: `${(Math.random() * 2).toFixed(1)}%`, type: Math.random() > 0.5 ? 'positive' : 'negative' },
      newBookings: `${Math.floor(Math.random() * 50 + 100)}`,
      newBookingsChange: { value: `${(Math.random() * 10).toFixed(1)}%`, type: Math.random() > 0.5 ? 'positive' : 'negative' },
      maintenanceTickets: `${Math.floor(Math.random() * 5 + 1)} Open`,
      maintenanceTicketsChange: `vs. ${Math.floor(Math.random() * 5 + 1)} last period`,
    });
    // Update chart data and call .update() on each chart instance
    // For brevity, not fully implementing dynamic chart data update here.
  };

  const generatePDFReport = async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const docWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = 20;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Hostel Analytics Report', docWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date Range: ${dateRange}`, docWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Metrics', margin, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`- Total Revenue: ${stats.totalRevenue}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`- Average Occupancy: ${stats.avgOccupancy}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`- New Bookings: ${stats.newBookings}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`- Open Maintenance Tickets: ${stats.maintenanceTickets}`, margin + 5, yPos);
    yPos += 15;

    const chartElements = [
      document.getElementById('revenueChartContainer'),
      document.getElementById('occupancyChartContainer'),
      document.getElementById('genderChartContainer'),
      document.getElementById('paymentMethodChartContainer')
    ];

    for (let i = 0; i < chartElements.length; i++) {
      const canvas = await html2canvas(chartElements[i]);
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = (docWidth - margin * 2) / 2 - 5;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xPos = (i % 2 === 0) ? margin : docWidth / 2 + 2.5;

      if (yPos + imgHeight > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);
      if (i % 2 !== 0) yPos += imgHeight + 10;
    }
    doc.save(`Analytics-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <section className="dashboard-hero-section">
        <div className="floating-home-icons">
          <i className="fa-solid fa-chart-line floating-home-1"></i>
          <i className="fa-solid fa-chart-bar floating-home-2"></i>
          <i className="fa-solid fa-chart-pie floating-home-3"></i>
          <i className="fa-solid fa-file-chart-line floating-home-4"></i>
          <i className="fa-solid fa-analytics floating-home-5"></i>
          <i className="fa-solid fa-chart-area floating-home-6"></i>
        </div>
        <div className="dashboard-hero-container">
          <h1 className="dashboard-hero-title">Analytics & <span className="dashboard-animated">Reports</span></h1>
          <p className="dashboard-hero-subtitle">Track key metrics and performance indicators</p>
        </div>
      </section>
      
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-layout">
            <DashboardSidebar
              user={custodianProfile}
              role="custodian"
              onLogout={() => setIsLogoutModalOpen(true)}
            />
            {/* Main Content */}
            <div className="dashboard-content">
              <div className="header-actions">
                <div className="date-range-filter">
                  <div className="date-input-wrapper">
                    <i className="fas fa-calendar-alt"></i>
                    <input type="text" id="dateRangePicker" placeholder="Select Date Range" />
                  </div>
                  <button className="btn primary small" onClick={applyDateRange}>Apply</button>
                </div>
                <button className="btn outline small" onClick={generatePDFReport}><i className="fas fa-download"></i> Download Report</button>
              </div>

            {/* Stat Cards Section */}
            <section className="stat-card-grid">
              <div className="stat-card">
                <h4>Total Revenue (Month)</h4>
                <p id="totalRevenueStat">{stats.totalRevenue}</p>
                <span className={`stat-change ${stats.totalRevenueChange.type}`} id="totalRevenueChange"><i className={`fas fa-arrow-${stats.totalRevenueChange.type === 'positive' ? 'up' : 'down'}`}></i> {stats.totalRevenueChange.value}</span>
              </div>
              <div className="stat-card">
                <h4>Avg. Occupancy Rate</h4>
                <p id="avgOccupancyStat">{stats.avgOccupancy}</p>
                <span className={`stat-change ${stats.avgOccupancyChange.type}`} id="avgOccupancyChange"><i className={`fas fa-arrow-${stats.avgOccupancyChange.type === 'positive' ? 'up' : 'down'}`}></i> {stats.avgOccupancyChange.value}</span>
              </div>
              <div className="stat-card">
                <h4>New Bookings (Month)</h4>
                <p id="newBookingsStat">{stats.newBookings}</p>
                <span className={`stat-change ${stats.newBookingsChange.type}`} id="newBookingsChange"><i className={`fas fa-arrow-${stats.newBookingsChange.type === 'positive' ? 'up' : 'down'}`}></i> {stats.newBookingsChange.value}</span>
              </div>
              <div className="stat-card">
                <h4>Open Maintenance Tickets</h4>
                <p id="maintenanceTicketsStat">{stats.maintenanceTickets}</p>
                <span className="stat-change neutral" id="maintenanceTicketsChange">{stats.maintenanceTicketsChange}</span>
              </div>
            </section>

            {/* Predictions Section */}
            <section style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>Predictive Insights</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#0ea5e9' }}>Occupancy Forecast</h4>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>{predictions.occupancyForecast.nextMonth}%</div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>Next month prediction ({predictions.occupancyForecast.confidence}% confidence)</div>
                  <div style={{ fontSize: '12px', color: predictions.occupancyForecast.trend === 'increasing' ? '#10b981' : '#ef4444', marginTop: '4px' }}>
                    {predictions.occupancyForecast.trend === 'increasing' ? '↗' : '↘'} {predictions.occupancyForecast.trend}
                  </div>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#10b981' }}>Revenue Forecast</h4>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>UGX {(predictions.revenueForecast.nextMonth / 1000000).toFixed(1)}M</div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>Next month projection</div>
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>↗ {predictions.revenueForecast.growth} growth</div>
                </div>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <h4 style={{ margin: '0 0 16px 0' }}>AI Recommendations</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {predictions.recommendations.map((rec, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: '#f8fafc', borderRadius: '6px' }}>
                      <i className="fa-solid fa-lightbulb" style={{ color: '#f59e0b', fontSize: '14px' }}></i>
                      <span style={{ fontSize: '14px', color: '#1e293b' }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Charts Section */}
            <section className="chart-grid">
              <div className="chart-container" id="revenueChartContainer">
                <Line options={{ ...commonChartOptions, plugins: { ...commonChartOptions.plugins, title: { ...commonChartOptions.plugins.title, text: 'Booking & Revenue Trends' } }, scales: { y: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } }, x: { ticks: { color: chartTextColor }, grid: { color: chartGridColor } } } }} data={revenueChartData} />
              </div>
              <div className="chart-container" id="occupancyChartContainer">
                <Doughnut
                  options={{ ...commonChartOptions, plugins: { ...commonChartOptions.plugins, title: { ...commonChartOptions.plugins.title, text: 'Room Utilization' } } }}
                  data={occupancyChartData}
                />
              </div>
              <div className="chart-container" id="genderChartContainer">
                <Pie
                  options={{ ...commonChartOptions, plugins: { ...commonChartOptions.plugins, title: { ...commonChartOptions.plugins.title, text: 'Gender Distribution' } } }}
                  data={genderChartData}
                />
              </div>
              <div className="chart-container" id="paymentMethodChartContainer">
                <Pie
                  options={{ ...commonChartOptions, plugins: { ...commonChartOptions.plugins, title: { ...commonChartOptions.plugins.title, text: 'Revenue by Payment Method' } } }}
                  data={paymentMethodChartData}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
      </main>
      
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default CustodianAnalyticsPage;