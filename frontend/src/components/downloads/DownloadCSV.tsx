import { format } from 'date-fns'; // Importar la función format de date-fns

type Column = {
  label: string; // Nombre de la columna (a mostrar en el encabezado)
  accessor: string | ((item: any) => string | number); // Propiedad del objeto o función que obtiene el valor
};

// Función para formatear las claves de forma legible
const formatLabel = (key: string): string => {
  const formatted = key
    .replace(/_/g, " ") // Reemplazar guiones bajos por espacios
    .replace(/([a-z])([A-Z])/g, "$1 $2"); // Agregar un espacio entre minúsculas y mayúsculas

  return formatted
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Función para formatear las fechas en el formato YYYY-MM-DD
const formatDate = (date: string): string => {
  return format(new Date(date), 'yyyy-MM-dd'); // Formato: 2024-11-20
};

export const DownloadCSV = (data: any[], fileName: string) => {
  if (data.length === 0) return; // Si no hay datos, no hacer nada

  // Obtenemos las claves del primer objeto en los datos para generar las columnas
  const sampleItem = data[0];

  // Aseguramos que las claves sean de tipo 'string' y las formateamos
  const columns: Column[] = Object.keys(sampleItem).map((key) => ({
    label: formatLabel(key), // Aplicar formato a la clave
    accessor: key,
  }));

  // Crear los encabezados del CSV
  const headers = columns.map((col) => col.label);

  // Convertir los datos a filas de CSV
  const csvRows = [
    headers.join(","), // Primer fila: los encabezados
    ...data.map((item) =>
      columns
        .map((col) =>
          typeof col.accessor === "function"
            ? col.accessor(item) // Si es una función, llamar a la función
            : typeof item[col.accessor] === 'string' && item[col.accessor].includes('T')
            ? formatDate(item[col.accessor]) // Si es una fecha, formatearla
            : item[col.accessor] // Si es otro tipo de dato, usar el valor tal cual
        )
        .join(",") // Unir cada fila con comas
    ),
  ];

  // Crear el Blob para el CSV
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  // Crear el enlace para descargar el archivo
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName; // Nombre del archivo
  document.body.appendChild(link);
  link.click(); // Iniciar la descarga
  document.body.removeChild(link); // Eliminar el enlace después de la descarga
};
