import { useEffect, useState } from "react";
import { TabsComponent } from "../../components/tabs"
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Definir el tipo de los logs
interface Log {
  id: string;
  event_type: string;
  involved_address: string;
  timestamp: string;
}

// Componente principal ActivityLog
const ActivityLog = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [allLogs, setAllLogs] = useState<Log[]>([]); // Usar el tipo Log[] para los logs
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllLogs = async () => {
      if (!isAuthenticated) return;

      const apiUrl = `${import.meta.env.VITE_APP_BACKEND_URL}notifications/activity-log/`;

      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data.results);
        setAllLogs(response.data.results); // Asigna los logs a allLogs
      } catch (err) {
        console.error("Error fetching logs:", err); // Manejo de errores
      } finally {
        setLoading(false); // Cambia el estado de carga al final
      }
    };

    getAllLogs();
  }, [getAccessTokenSilently, isAuthenticated]);

  if (loading) {
    return <p>Loading activity logs...</p>; // Muestra un mensaje mientras carga
  }

  const tabs = [
    {
      value: "all",
      title: "All",
      description: "View all activity logs.",
      content: <ActivityLogTable logs={allLogs} />, // Pasa allLogs a la tabla
    },
    {
      value: "transactions",
      title: "Transactions",
      description: "View all transaction logs.",
      content: (
        <ActivityLogTable logs={allLogs.filter((log) => log.event_type === "transaction")} />
      ),
    },
    {
      value: "new-properties",
      title: "New Properties",
      description: "View all new property logs.",
      content: (
        <ActivityLogTable logs={allLogs.filter((log) => log.event_type === "new_property")} />
      ), // Filtra por 'new_property'
    },
  ];

  return <TabsComponent tabs={tabs} />;
};

// Función para formatear los nombres de los tipos de eventos
const formatEventType = (type: string) => {
  switch (type) {
    case "transaction":
      return "Transaction";
    case "new_property":
      return "New Property";
    case "KYC verification":
      return "KYC Verification";
    default:
      return type;
  }
};

// Función para obtener la clase de color de fondo según el tipo de evento
const getTypeClass = (type: string) => {
  switch (type) {
    case "transaction":
      return "bg-green-100 text-green-700"; // Verde para 'transaction'
    case "new_property":
      return "bg-orange-100 text-orange-400"; // Naranja para 'new_property'
    case "KYC verification":
      return "bg-blue-100 text-blue-700"; // Azul para 'KYC verification'
    default:
      return "bg-gray-100 text-gray-700"; // Gris para otros tipos
  }
};

// Componente de tabla de logs
const ActivityLogTable = ({ logs }: { logs: Log[] }) => {
  const formattedLogs = logs.map((log) => ({
    id: log.id,
    type: log.event_type,
    email: log.involved_address,
    timestamp: formatTimestamp(log.timestamp), // Formatear timestamp
  }));

  const columns = [
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }: { row: any }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: { row: any }) => (
        <div className={`capitalize font-semibold p-1 rounded ${getTypeClass(row.getValue("type"))}`}>
          {formatEventType(row.getValue("type"))}
        </div>
      ),
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }: { row: any }) => <div>{row.getValue("timestamp")}</div>,
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.accessorKey as string}>{column.header}</TableHead> // Tipo definido explícitamente para `key`
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {formattedLogs.length > 0 ? (
          formattedLogs.map((log) => (
            <TableRow key={log.id}>
              {columns.map((column) => (
                <TableCell key={column.accessorKey as string}>
                  {column.cell({ row: { getValue: (key: keyof typeof log) => log[key] } })}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

// Función para formatear la fecha y hora
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};


export default ActivityLog;