import  { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LogoutButton  from '../buttons/logoutBtn';

interface MenuItem {
  name: string;
  link?: string;
  icon: React.ReactNode;
}

interface SideMenuProps {
  data: MenuItem[];
  onMenuClick: () => void;
}

const SideMenu = ({ data, onMenuClick }:SideMenuProps) => {  
  const navigate = useNavigate();
  const location = useLocation();  
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null | undefined>(null);

  // Establecer el tab seleccionadooo en función de la ruta actual
  useEffect(() => {
    setSelectedItem(location.pathname);    
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = (link: string | undefined) => {
    setSelectedItem(link); 
    onMenuClick();
    setMenuOpen(false);
  };

  return (
    <aside className="absolute lg:static w-full lg:w-auto h-[50px] lg:h-auto">
      <div className="lg:hidden p-4 flex justify-between items-center border-b">
        <div onClick={() => navigate("/")}>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <button onClick={toggleMenu} className="text-2xl">
          {menuOpen ? <span>&#x2715;</span> : <span>&#9776;</span>}
        </button>
      </div>

      <div
        className={`fixed  lg:sticky lg:top-0 h-screen  lg:flex z-50 top-0 left-0 h-full w-52 bg-white p-5 border-r transform ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out  lg:translate-x-0 flex flex-col justify-between`}
      >
        <ul className="space-y-2">
          {data.map((item, index) => (
            <li key={index}>
              <Link
                to={item.link || '#'}
                className={`w-full text-left hover:bg-gray-100 p-2 rounded block flex items-center ${
                  selectedItem === item.link ? 'bg-gray-200 text-[#A0CB2A] font-medium' : ''
                }`}
                onClick={() => handleMenuItemClick(item.link)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
          <LogoutButton/>
      </div>
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </aside>
  );
};

export default SideMenu;
