import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Efectos de luces de fondo */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] -top-40 -left-20 pointer-events-none"></div>
      <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[130px] -bottom-20 -right-20 pointer-events-none"></div>

      <main className="max-w-4xl text-center z-10">
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-bold tracking-widest uppercase mb-8">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          NexusAuth v1.0 está vivo
        </div>

        {/* Titular Principal */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent leading-tight">
          Seguridad y Analíticas <br /> en Tiempo Real.
        </h1>

        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          "Plataforma con autenticación de GitHub y dashboard de métricas en
          tiempo real. Desarrollado con el fin de demostrar el manejo de
          Supabase."
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            Comenzar Ahora
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-lg transition-all">
            Saber más
          </button>
        </div>

        {/* Sección de Features (Mini) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left">
          {[
            {
              title: "Realtime",
              desc: "Datos que fluyen al instante sin recargar.",
            },
            {
              title: "Auth Segura",
              desc: "Autenticación OAuth 2.0 con Google.",
            },
            {
              title: "Dashboard",
              desc: "Gráficos dinámicos y visualización Pro.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm"
            >
              <h4 className="text-blue-400 font-bold mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Landing;
