import {
    CheckCircle,
    Circle,
    CircleOff,
    HelpCircle,
    Timer,
    FolderKanban,
  } from "lucide-react"
  import { Home, Briefcase, Factory, Building, ShoppingBag, Hotel, Server, Package, Users } from "lucide-react";

  
  export const statuses = [
    {
      value: "under_review",
      label: "Under Review",
      icon: HelpCircle,
    },
    {
      value: "active",
      label: "Active",
      icon: Circle,
    },
    {
      value: "coming_soon",
      label: "Coming Soon",
      icon: Timer,
    },
    {
      value: "published",
      label: "Published",
      icon: CheckCircle,
    },
    {
      value: "rejected",
      label: "Rejected",
      icon: CircleOff,
    },
  ]
  
  export const investmentCategories = [
    {
      label: "Opportunistic",
      value: "Opportunistic",
      icon: FolderKanban,
    },
    {
      label: "Core",
      value: "Core",
      icon: Building,
    },
  ]



  export const propertyType = [
    {
      value: "Multifamily",
      label: "Multifamily",
      icon: Home, // Icono para viviendas multifamiliares
    },
    {
      value: "Offices",
      label: "Offices",
      icon: Briefcase, // Icono para oficinas
    },
    {
      value: "Industrial",
      label: "Industrial",
      icon: Factory, // Icono para propiedades industriales
    },
    {
      value: "Mixed Use",
      label: "Mixed Use",
      icon: Building, // Icono para propiedades de uso mixto
    },
    {
      value: "Retail",
      label: "Retail",
      icon: ShoppingBag, // Icono para propiedades comerciales
    },
    {
      value: "Hospitality",
      label: "Hospitality",
      icon: Hotel, // Icono para propiedades de hospitalidad (hoteles)
    },
    {
      value: "Data Center",
      label: "Data Centre",
      icon: Server, // Icono para centros de datos
    },
    {
      value: "Warehouse",
      label: "Warehouse",
      icon: Package, // Icono para almacenes
    },
    {
      value: "Student Housing",
      label: "Student Housing",
      icon: Users, // Icono para viviendas estudiantiles
    },
  ];


  export const performanceStatus = [
    {
        value: "Best Performance",
        label: "Best Performance",
        // icon: Users, // Icono para viviendas estudiantiles
    },
    {
        value: "Worst Performance",
        label: "Worst Performance",
        // icon: Users, // Icono para viviendas estudiantiles
    },
];




export const orderStatus = [
  {
    value: "expired",
    label: "Expired",
  },
  {
    value: "valid",
    label: "Valid",
  }
]