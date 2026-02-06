import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [count, setCount] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  const fetchMetrics = async () => {
    const { data, error } = await supabase
      .from("user_metrics")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data) {
      setCount(data.length);
      const formatted = data.map((m, index) => ({
        time: new Date(m.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        acumulado: index + 1,
      }));
      setChartData(formatted);
    }
  };

  const trackAction = async () => {
    const { error } = await supabase.from("user_metrics").insert([
      {
        action_name: "click_button",
        value: 1,
        user_id: user?.id,
      },
    ]);
    if (error) console.error("Error al insertar:", error.message);
  };

  useEffect(() => {
    fetchMetrics();

    // Suscripción con reconexión automática
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_metrics",
        },
        (payload) => {
          console.log("🔔 ¡Cambio detectado!", payload);
          fetchMetrics();
        },
      )
      .subscribe((status, err) => {
        console.log("📡 Estado Realtime:", status);
        if (err) console.error("❌ Error de conexión:", err.message);
      });

    return () => {
      console.log("🔌 Desconectando canal...");
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white p-4 md:p-8 relative overflow-hidden">
      {/* Luces de fondo */}
      <div className="absolute w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -top-20 -right-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <nav className="flex justify-between items-center mb-10 bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-4">
            <img
              src={user?.user_metadata.avatar_url}
              className="w-10 h-10 rounded-full border border-blue-500/50"
              alt="avatar"
            />
            <div className="hidden sm:block">
              <p className="text-[10px] text-blue-400 uppercase tracking-[0.2em] font-bold">
                Panel de Control
              </p>
              <p className="font-bold text-lg">
                {user?.user_metadata.full_name || "Usuario"}
              </p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 transition-all"
          >
            Cerrar Sesión
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-gray-400 font-medium">Interacciones</h3>
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <div className="flex items-baseline gap-2 mb-8">
              <p className="text-7xl font-black">{count}</p>
              <span className="text-blue-500 font-bold uppercase text-xs">
                Live
              </span>
            </div>
            <button
              onClick={trackAction}
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              + Registrar Actividad
            </button>
          </div>

          {/* Gráfico con altura fija para evitar error de Recharts */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md min-h-[400px]">
            <h3 className="text-gray-400 font-medium mb-8">
              Flujo de Actividad
            </h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#ffffff05"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="time"
                    stroke="#444"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis hide domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid #333",
                      borderRadius: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="acumulado"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorBlue)"
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
