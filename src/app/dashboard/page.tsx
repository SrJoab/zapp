// /home/ubuntu/zapp_report_app/src/app/dashboard/page.tsx
"use client";

// Placeholder components - Replace with actual UI components later
const Card = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
    <div>{children}</div>
  </div>
);

export default function DashboardPage() {
  // TODO: Fetch actual data from backend APIs

  const overviewData = {
    totalContacts: 150, // Example data
    activeCampaigns: 5,
    messagesSentToday: 1234,
    chatbotInteractions: 87,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Visão Geral</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card title="Total de Contatos">
          <p className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{overviewData.totalContacts}</p>
        </Card>
        <Card title="Campanhas Ativas">
          <p className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{overviewData.activeCampaigns}</p>
        </Card>
        <Card title="Mensagens Enviadas (Hoje)">
          <p className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{overviewData.messagesSentToday}</p>
        </Card>
        <Card title="Interações do Chatbot (Hoje)">
          <p className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{overviewData.chatbotInteractions}</p>
        </Card>
      </div>

      {/* Placeholder for recent activity or other dashboard widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Atividade Recente">
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Novo contato adicionado: João Silva</li>
            <li>Campanha "Promoção de Páscoa" enviada.</li>
            <li>Chatbot respondeu a 15 novas conversas.</li>
            <li>Canal WhatsApp conectado com sucesso.</li>
          </ul>
        </Card>
        <Card title="Performance do Chatbot">
          {/* Placeholder for a chart */}
          <div className="h-40 flex items-center justify-center text-gray-500">
            (Gráfico de Performance do Chatbot)
          </div>
        </Card>
      </div>
    </div>
  );
}

