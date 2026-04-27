const pages = {
  dashboard: 'Dashboard',
  users: 'Users & access',
  permissions: 'Permission sets',
  visibility: 'Visibility groups',
  teams: 'Teams & hierarchy',
  security: 'Security center',
  auditlog: 'Audit log',
  analytics: 'Platform analytics',
  billing: 'Billing & plans',
  api: 'API & integrations',
  settings: 'Company settings'
};

function navigate(el, pageId) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (el) el.classList.add('active');
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  document.getElementById('page-title').textContent = pages[pageId] || pageId;
  if (pageId === 'analytics') initAnalyticsCharts();
}

document.querySelectorAll('.tab-item').forEach(t => {
  t.addEventListener('click', function() {
    this.closest('.tab-bar').querySelectorAll('.tab-item').forEach(x => x.classList.remove('active'));
    this.classList.add('active');
  });
});

const DAYS14 = Array.from({length:14}, (_,i) => { const d = new Date(); d.setDate(d.getDate()-13+i); return d.toLocaleDateString('en',{month:'short',day:'numeric'}); });
const DAYS30 = Array.from({length:30}, (_,i) => { const d = new Date(); d.setDate(d.getDate()-29+i); return d.toLocaleDateString('en',{month:'short',day:'numeric'}); });
const rnd = (a,b) => Math.round(a + Math.random()*(b-a));

const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#A8A8A2', maxTicksLimit: 8, font: { family: 'DM Sans', size: 11 } } },
    y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#A8A8A2', font: { family: 'DM Sans', size: 11 } } }
  }
};

new Chart(document.getElementById('actChart'), {
  type: 'line',
  data: {
    labels: DAYS14,
    datasets: [{
      data: DAYS14.map(()=>rnd(14,26)),
      borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.07)',
      tension: 0.4, pointRadius: 0, borderWidth: 2, fill: true
    }]
  },
  options: { ...CHART_OPTS, plugins: { legend: { display: false } } }
});

let analyticsInited = false;
function initAnalyticsCharts() {
  if (analyticsInited) return;
  analyticsInited = true;

  // Generate first-principle data for Usage Growth
  const baseUsers = 1200;
  const baseAPI = 5000;
  const dauData = DAYS30.map((_, i) => Math.round(baseUsers + (i * 45) + (Math.sin(i) * 150) + rnd(-50, 50)));
  const apiData = DAYS30.map((_, i) => Math.round(baseAPI + (i * 200) + (Math.cos(i) * 800) + rnd(-200, 200)));

  new Chart(document.getElementById('analDauChart'), {
    type: 'line',
    data: {
      labels: DAYS30,
      datasets: [
        { 
          label: 'Active Users',
          data: dauData, 
          borderColor: '#2563EB', 
          backgroundColor: 'rgba(37,99,235,0.1)', 
          tension: 0.4, 
          pointRadius: 0, 
          pointHoverRadius: 6,
          borderWidth: 3, 
          fill: true,
          yAxisID: 'y'
        },
        { 
          label: 'API Calls',
          data: apiData, 
          borderColor: '#0284C7', 
          backgroundColor: 'rgba(2,132,199,0.05)', 
          tension: 0.4, 
          pointRadius: 0, 
          pointHoverRadius: 6,
          borderWidth: 2, 
          borderDash: [5, 5],
          fill: true,
          yAxisID: 'y1'
        }
      ]
    },
    options: { 
      ...CHART_OPTS, 
      interaction: { mode: 'index', intersect: false },
      plugins: { 
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17, 17, 16, 0.9)',
          titleFont: { family: 'DM Sans', size: 13 },
          bodyFont: { family: 'DM Sans', size: 12 },
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#A8A8A2', maxTicksLimit: 10, font: { family: 'DM Sans', size: 11 } } },
        y: { type: 'linear', display: true, position: 'left', grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { color: '#A8A8A2', font: { family: 'DM Sans', size: 11 } } },
        y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#A8A8A2', font: { family: 'DM Sans', size: 11 } } }
      }
    }
  });

  if(document.getElementById('analSourceChart')) {
    new Chart(document.getElementById('analSourceChart'), {
      type: 'doughnut',
      data: {
        labels: ['Direct Web', 'Mobile iOS', 'Mobile Android', 'API / Integrations'],
        datasets: [{ 
          data: [45, 28, 17, 10], 
          backgroundColor: ['#2563EB', '#16A34A', '#D97706', '#7C3AED'], 
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: { 
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: { 
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(17, 17, 16, 0.9)',
            bodyFont: { family: 'DM Sans', size: 13 },
            padding: 12,
            callbacks: {
              label: function(context) {
                return ' ' + context.label + ': ' + context.raw + '%';
              }
            }
          }
        } 
      }
    });
  }

  const features = ['Core Pipeline', 'Contact Sync', 'Email Tracking', 'Automated Workflows', 'Custom Reports', 'API Usage', 'Lead Scoring', 'Team Chat'];
  const baseEngagement = 95;
  const dropoffFactor = 0.85;
  const pcts = features.map((_, i) => Math.round(baseEngagement * Math.pow(dropoffFactor, i) + rnd(-5, 5)));
  
  new Chart(document.getElementById('analAdoptChart'), {
    type: 'bar',
    data: {
      labels: features,
      datasets: [{ 
        data: pcts, 
        backgroundColor: pcts.map(v => v > 75 ? '#16A34A' : v > 50 ? '#2563EB' : '#D97706'), 
        borderRadius: 4,
        barPercentage: 0.6
      }]
    },
    options: { 
      ...CHART_OPTS, 
      indexAxis: 'x', 
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(17, 17, 16, 0.9)',
          titleFont: { family: 'DM Sans', size: 13 },
          bodyFont: { family: 'DM Sans', size: 12 },
          callbacks: {
            label: function(context) { return ' Engagement: ' + context.raw + '%'; }
          }
        }
      },
      scales: { 
        x: { grid: { display: false }, ticks: { color: '#6B6B66', font: { family: 'DM Sans', size: 12 } } }, 
        y: { max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => v + '%', color: '#A8A8A2', font: { family: 'DM Sans', size: 11 } } } 
      } 
    }
  });
}
